import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import type { Database } from "@/integrations/supabase/types";

function supabaseForUser(ctx: ToolContext) {
  return createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "get_usage",
  title: "Get my Clipra usage & plan",
  description:
    "Return the signed-in user's Clipra plan, monthly minutes allowance, minutes used, minutes remaining, and cycle start date.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("profiles")
      .select("plan, monthly_minutes, minutes_used, cycle_start, display_name")
      .eq("user_id", ctx.getUserId()!)
      .maybeSingle();
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    if (!data) {
      return { content: [{ type: "text", text: "Profile not found" }], isError: true };
    }
    const usage = {
      ...data,
      minutes_remaining: Math.max(0, (data.monthly_minutes ?? 0) - (data.minutes_used ?? 0)),
    };
    return {
      content: [{ type: "text", text: JSON.stringify(usage, null, 2) }],
      structuredContent: { usage },
    };
  },
});
