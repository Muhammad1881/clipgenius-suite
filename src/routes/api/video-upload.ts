import { createFileRoute } from "@tanstack/react-router";

// Cloudflare Workers can only fetch a restricted set of outbound ports (80/443/8080/...),
// so port 5000 is unreachable from the relay. Use the HTTPS hostname first and keep the
// direct IP as a fallback for local/dev runtimes where the port is reachable.
const UPSTREAM_URLS = [
  "https://api.clipra.bond/upload",
  "http://178.105.192.132:5000/upload",
];
const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;

export const Route = createFileRoute("/api/video-upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const contentType = request.headers.get("content-type") ?? "";
        if (!contentType.toLowerCase().startsWith("multipart/form-data")) {
          return Response.json({ error: "Expected a multipart video upload." }, { status: 415 });
        }

        const contentLength = Number(request.headers.get("content-length") ?? "0");
        if (Number.isFinite(contentLength) && contentLength > MAX_UPLOAD_BYTES) {
          return Response.json({ error: "Video uploads are limited to 100 MB." }, { status: 413 });
        }

        try {
          const formData = await request.formData();
          const video = formData.get("video");
          if (!(video instanceof File)) {
            return Response.json({ error: "No video file was provided." }, { status: 400 });
          }
          if (video.size > MAX_UPLOAD_BYTES) {
            return Response.json({ error: "Video uploads are limited to 100 MB." }, { status: 413 });
          }

          const upstream = await fetch(VIDEO_PROCESSOR_URL, {
            method: "POST",
            body: formData,
          });

          const headers = new Headers();
          headers.set("content-type", upstream.headers.get("content-type") ?? "application/json");
          headers.set("cache-control", "no-store");

          return new Response(upstream.body, {
            status: upstream.status,
            statusText: upstream.statusText,
            headers,
          });
        } catch (error) {
          console.error("Video processor request failed", error);
          return Response.json(
            { error: "The video processor could not finish this request. Please try again." },
            { status: 502 },
          );
        }
      },
    },
  },
});