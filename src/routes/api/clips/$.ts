import { createFileRoute } from "@tanstack/react-router";

const CLIP_ORIGIN = "https://api.clipra.bond/clips";

export const Route = createFileRoute("/api/clips/$")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const splat = (params as { _splat?: string })._splat ?? "";
        if (!splat || splat.includes("..")) {
          return new Response("Not found", { status: 404 });
        }

        const url = new URL(request.url);
        const isDownload = url.searchParams.get("download") === "1";

        const range = request.headers.get("range");
        const upstream = await fetch(`${CLIP_ORIGIN}/${splat}`, {
          // never request a partial body for a download
          headers: range && !isDownload ? { range } : undefined,
        });

        if (!upstream.ok && upstream.status !== 206) {
          return new Response("Clip not available", { status: upstream.status });
        }

        const headers = new Headers();
        headers.set("content-type", upstream.headers.get("content-type") ?? "video/mp4");

        if (isDownload) {
          // Buffer so the browser gets an exact, consistent length (avoids
          // "network error" from a truncated/mismatched stream).
          const buf = await upstream.arrayBuffer();
          const raw = url.searchParams.get("filename") || splat.split("/").pop() || "clip.mp4";
          const safe = raw.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80) || "clip.mp4";
          headers.set("content-disposition", `attachment; filename="${safe}"`);
          headers.set("content-length", String(buf.byteLength));
          headers.set("cache-control", "no-store");
          return new Response(buf, { status: 200, headers });
        }

        const len = upstream.headers.get("content-length");
        if (len) headers.set("content-length", len);
        const cr = upstream.headers.get("content-range");
        if (cr) headers.set("content-range", cr);
        headers.set("accept-ranges", "bytes");
        headers.set("cache-control", "public, max-age=3600");

        return new Response(upstream.body, { status: upstream.status, headers });


      },
    },
  },
});
