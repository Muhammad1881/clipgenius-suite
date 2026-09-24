# Fix: "Import" from a video link does nothing

## Problem
`src/routes/_app.upload.tsx` lines 471-477: the "Paste YouTube or video URL" input has no value/onChange binding and the Import button has no onClick — clicking it does literally nothing. Confirmed.

## Approach — no backend changes required

1. **Wire the input**
   - `videoUrl` state; controlled Input; Enter key and Import button both submit.
   - Validate: must be a valid http(s) URL. Empty/invalid → inline error message.

2. **Direct video file links import for real**
   - New server route `src/routes/api/video-import.ts`: receives `{url, plan, clipSize, translate, targetLanguage}`, fetches the remote file, rejects anything over 100 MB or without a video content-type, then streams it to `https://api.theclipra.com/upload` as multipart with the exact same field names the file flow uses (`video`, `plan`, …), forwarding the backend response (the `jobId`) verbatim.
   - Client: extract the existing job-polling logic into a shared `pollJob(jobId)` so file and URL imports use the same progress, cancel, and error handling.
   - Cancel during a URL import calls the same `notifyBackendCancel` + refund path.

3. **Clear feedback for YouTube / social links**
   - Links to youtube.com, tiktok, vimeo, instagram, etc. get an honest inline message: direct file links (.mp4/.mov/.webm) import today; YouTube-style import needs the video processor itself to fetch links (yt-dlp on your VPS) — a follow-up backend change, listed below.

4. **Minutes for URL imports**
   - Duration is unknown before processing, so no upfront reservation. When the job completes, deduct minutes based on the duration the job reports, if it includes one; failures/cancellations deduct nothing.
   - Flagged honestly: if the backend's job result carries no duration, URL imports won't deduct minutes until the backend adds it — the long-term fix is minute enforcement on the VPS.

## Files
- `src/routes/_app.upload.tsx` — wire input, shared poll logic, URL import flow
- `src/routes/api/video-import.ts` — new streaming relay route

## Verification
- Build clean.
- Playwright: paste a direct file link and a YouTube link; Import shows real progress for the first and a clear message for the second — no more dead clicks.
- Note: the sandbox can't reach `api.theclipra.com` (DNS), so the live end-to-end import is verified in your preview, not here.

## Follow-up (needs your backend)
- Accept a link directly on `/upload` (yt-dlp) so YouTube/social URLs import without a file, and report video duration in the job result for accurate minute deduction.
