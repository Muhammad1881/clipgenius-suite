/** Public-facing facts; keep these aligned with the processor's existing plan rules. */
export const INPUT_LIMIT_MINUTES = { free: 30, starter: 60, creator: 120 } as const;
export const PROJECT_RETENTION_HOURS = 24;
export const SUPPORT_EMAIL = "support@theclipra.com";
export const FREE_START_PATH = "/signup" as const;
export const UPLOAD_OPTIONS = "Upload a video file from your computer.";
export const INPUT_LIMIT_SUMMARY = `Up to ${INPUT_LIMIT_MINUTES.free} minutes on Free, ${INPUT_LIMIT_MINUTES.starter} on Starter, or ${INPUT_LIMIT_MINUTES.creator} on Creator.`;
export const STORAGE_SUMMARY = `Projects are deleted after ${PROJECT_RETENTION_HOURS} hours. Download your clips before then.`;