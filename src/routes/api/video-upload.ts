import { createFileRoute } from "@tanstack/react-router";

const VIDEO_PROCESSOR_URL = "http://178.105.192.132:5000/upload";
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
          const upstream = await fetch(VIDEO_PROCESSOR_URL, {
            method: "POST",
            headers: { "content-type": contentType },
            body: request.body,
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