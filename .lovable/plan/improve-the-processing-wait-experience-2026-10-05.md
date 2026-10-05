# Improve the processing wait experience

## What will change
- Keep real upload percentage only while the file is uploading; stop showing a frozen percentage during server processing.
- On the Free plan, replace the stalled bar with a calm indeterminate “Waiting for your clips” state and clear reassurance that processing continues.
- On Starter, rotate through honest status messages such as transcribing, finding viral moments, preparing captions, hashtags, and vertical clips.
- On Creator, include the paid AI workflow: intelligent moment detection, speaker-aware AI reframing, captions, hashtags, translation when selected, and final rendering.
- Keep backend-reported status visible when useful, without pretending that timed messages are real completion percentages.
- Preserve cancellation and minute-refund behavior.

## Preview recovery
- Reproduce the blank preview locally, inspect browser/runtime errors, and fix only the issue preventing the current page from rendering.
- Verify the homepage and signed-in upload page at desktop and mobile sizes.

## Technical details
- Add a small plan-aware processing-status component within the upload experience.
- Cycle messages on a timer while polling continues, but never let that timer imply backend completion.
- Reset the visual state when a job completes, fails, or is cancelled.
- Keep Free free of paid AI-reframe/translation claims; Starter gets its actual 1080p, captions, hashtag, translation, and center-crop messaging; Creator gets AI reframe and tracking messaging.
