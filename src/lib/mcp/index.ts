import { auth, defineMcp } from "@lovable.dev/mcp-js";
import getProjectTool from "./tools/get-project";
import getUsageTool from "./tools/get-usage";
import listProjectsTool from "./tools/list-projects";

// The direct Supabase host is the only issuer form that survives publish
// (SUPABASE_URL is rewritten to the .lovable.cloud proxy on publish, which
// mcp-js rejects). Build from VITE_SUPABASE_PROJECT_ID which Vite inlines
// at build time.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "clipra-mcp",
  title: "Clipra",
  version: "0.1.0",
  instructions:
    "Tools for a signed-in Clipra user. Use `list_projects` to browse the user's generated clip projects, `get_project` to fetch transcript / viral moments / clip URLs for a specific project, and `get_usage` to check the user's plan and remaining monthly minutes. All tools act as the authenticated Clipra user; per-user data is protected by RLS.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listProjectsTool, getProjectTool, getUsageTool],
});
