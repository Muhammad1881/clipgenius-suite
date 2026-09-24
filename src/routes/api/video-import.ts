import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

// Same upstream targets as /api/video-upload: HTTPS hostname first, direct IP
// as a fallback for local/dev runtimes where the port is reachable.
const UPSTREAM_URLS = [
];
const MAX_IMPORT_BYTES = 100 * 1024 * 1024;

// Links to these hosts are pages, not direct video files — reject with a clear
// message instead of a confusing content-type error.
const SOCIAL_HOSTS = [
  "youtube.com", "youtu.be", "tiktok.com", "instagram.com", "vimeo.com",
  "facebook.com", "fb.watch", "twitter.com", "x.com", "twitch.tv",
  "dailymotion.com", "reddit.com", "linkedin.com",
];

const ImportBody = z.object({
  url: z.string().url(),
  plan: z.enum(["free", "starter", "creator"]).default("free"),
  clipSize: z.string().max(16).optional(),
  translate: z.boolean().optional(),
  targetLanguage: z.string().max(40).optional(),
});

function fail(status: number, error: string, detail?: string) {
  return Response.json({ error, ...(detail ? { detail } : {}) }, { status });
}

export const Route = createFileRoute("/api/video-import")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return fail(400, "Expected a JSON body.");
        }

        const parsed = ImportBody.safeParse(body);
        if (!parsed.success) {
          return fail(400, "Invalid import request.", parsed.error.issues[0]?.message);
        }
        const { url, plan, clipSize, translate, targetLanguage } = parsed.data;

        let source: URL;
        try {
          source = new URL(url);
        } catch {
          return fail(400, "Invalid link.");
        }
        if (source.protocol !== "http:" && source.protocol !== "https:") {
          return fail(400, "Only http(s) links are supported.");
        }
        const host = source.hostname.replace(/^www\./, "").toLowerCase();
        if (SOCIAL_HOSTS.some((s) => host === s || host.endsWith(`.${s}`))) {
          return fail(400, "YouTube and social links aren't supported yet — use a direct video file link (.mp4, .mov, .webm).");
        }

        // Download the remote video (redirects followed), then stream it to the
        // processor as multipart. The file is never fully buffered in memory.
        let upstream: Response;
        try {
          upstream = await fetch(source.toString(), {
            headers: {
              "user-agent": "Clipra-Importer/1.0",
              accept: "video/*,application/octet-stream",
            },
            redirect: "follow",
          });
        } catch (e) {
          return fail(502, "Could not reach the link.", e instanceof Error ? e.message : String(e));
        }

        if (!upstream.ok) {
          return fail(415, `The link server responded with ${upstream.status}. Make sure it's a public, direct link to a video file.`);
        }

        const contentType = (upstream.headers.get("content-type") ?? "").toLowerCase();
        const finalPath = new URL(upstream.url).pathname.toLowerCase();
        const looksLikeVideo =
          contentType.startsWith("video/") ||
          contentType === "application/octet-stream" ||
          contentType === "binary/octet-stream" ||
          /\.(mp4|mov|webm|m4v|mkv|avi|mpeg|mpg)$/.test(finalPath);
        if (!looksLikeVideo || contentType.includes("text/html")) {
          return fail(415, "That link is a webpage, not a direct video file. Use a link that ends in .mp4, .mov or .webm, or upload the file directly.");
        }

        const size = Number(upstream.headers.get("content-length") ?? "NaN");
        if (!Number.isFinite(size)) {
          return fail(415, "This link doesn't report its file size, so it can't be imported. Try a direct .mp4 link or upload the file.");
        }
        if (size > MAX_IMPORT_BYTES) {
          return fail(413, "Videos from links are limited to 100 MB, same as uploads.");
        }

        const filename =
          decodeURIComponent(finalPath.split("/").pop() ?? "")
            .replace(/[^a-zA-Z0-9._-]+/g, "-")
            .slice(0, 80) || "imported-video.mp4";
        const mime = contentType && !contentType.includes("text/html") ? contentType.split(";")[0] : "video/mp4";
        const boundary = `clipra-import-${crypto.randomUUID().replace(/-/g, "")}`;
        const enc = new TextEncoder();

        const fields: Array<[string, string]> = [["plan", plan]];
        if (plan !== "free") {
          if (clipSize) fields.push(["clipSize", clipSize]);
          fields.push(["translate", translate ? "true" : "false"]);
          if (translate && targetLanguage) fields.push(["targetLanguage", targetLanguage]);
        } else {
          fields.push(["translate", "false"]);
        }

        const parts: Uint8Array[] = [];
        for (const [n, v] of fields) {
          parts.push(enc.encode(`--${boundary}\r\nContent-Disposition: form-data; name="${n}"\r\n\r\n${v}\r\n`));
        }
        parts.push(
          enc.encode(
            `--${boundary}\r\nContent-Disposition: form-data; name="video"; filename="${filename}"\r\nContent-Type: ${mime}\r\n\r\n`,
          ),
        );
        parts.push(enc.encode(`\r\n--${boundary}--\r\n`));
        const closing = parts.pop()!;
        const prelude = parts;
        const totalLength = prelude.reduce((acc, p) => acc + p.length, 0) + size;

        // Pull-based stream: prelude fields, then the remote file bytes, then the
        // closing boundary — with backpressure, so memory stays flat.
        const fileReader = upstream.body ? upstream.body.getReader() : null;
        let preludeIdx = 0;
        let closed = false;
        const stream = new ReadableStream<Uint8Array>({
          pull(controller) {
            if (preludeIdx < prelude.length) {
              controller.enqueue(prelude[preludeIdx++]);
              return;
            }
            if (fileReader) {
              return fileReader.read().then(({ done, value }) => {
                if (done) {
                  controller.enqueue(closing);
                  controller.close();
                  closed = true;
                  return;
                }
                if (value) controller.enqueue(value);
              });
            }
            if (!closed) {
              controller.enqueue(closing);
              controller.close();
              closed = true;
            }
          },
          cancel() {
            try {
              fileReader?.cancel();
            } catch {
              /* noop */
            }
          },
        });

        const init = {
          method: "POST",
          headers: {
            "content-type": `multipart/form-data; boundary=${boundary}`,
            "content-length": String(totalLength),
          },
          body: stream,
          duplex: "half",
        } as RequestInit;

        let relay: Response | null = null;
        let lastError: unknown = null;
        for (const upstreamUrl of UPSTREAM_URLS) {
          try {
            relay = await fetch(upstreamUrl, init);
            break;
          } catch (e) {
            lastError = e;
            console.error(`Video processor unreachable at ${upstreamUrl} (import)`, e);
          }
        }
        if (!relay) {
          return fail(502, "Could not reach the video processor.", lastError instanceof Error ? lastError.message : String(lastError));
        }

        const headers = new Headers();
        headers.set("content-type", relay.headers.get("content-type") ?? "application/json");
        headers.set("cache-control", "no-store");
        return new Response(relay.body, {
          status: relay.status,
          statusText: relay.statusText,
          headers,
        });
      },
    },
  },
});
