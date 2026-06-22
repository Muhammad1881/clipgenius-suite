import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const InputSchema = z.object({
  title: z.string().min(1).max(300),
  reason: z.string().max(1000).optional().nullable(),
  transcript: z.string().max(4000).optional().nullable(),
});

export type SocialMeta = {
  caption: string;
  hashtags: string[];
};

export const generateSocialMeta = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => InputSchema.parse(input))
  .handler(async ({ data, context }): Promise<SocialMeta> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    // Paywall: only paid plans can generate social meta
    const { data: profile } = await context.supabase
      .from("profiles")
      .select("plan")
      .eq("user_id", context.userId)
      .single();
    const plan = profile?.plan ?? "free";
    if (plan === "free") {
      throw new Error("UPGRADE_REQUIRED");
    }


    const userPrompt = [
      `Clip title: ${data.title}`,
      data.reason ? `Why it's viral: ${data.reason}` : null,
      data.transcript ? `Transcript excerpt: ${data.transcript.slice(0, 1200)}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content:
              "You write punchy social captions for short vertical videos (TikTok, Reels, YouTube Shorts). Output strict JSON only.",
          },
          {
            role: "user",
            content: `${userPrompt}\n\nReturn JSON with shape: {"caption": string (max 180 chars, hook-driven, no hashtags inside), "hashtags": string[] (5-8 items, each starting with #, lowercase, no spaces, mix niche + broad)}`,
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (res.status === 429) throw new Error("AI rate limit, please retry shortly.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add credits in Settings.");
    if (!res.ok) throw new Error(`AI error: ${res.status}`);

    const json = await res.json();
    const content: string = json?.choices?.[0]?.message?.content ?? "{}";
    let parsed: { caption?: string; hashtags?: string[] } = {};
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = {};
    }

    const caption = (parsed.caption ?? "").toString().trim().slice(0, 220) || data.title;
    let hashtags = Array.isArray(parsed.hashtags) ? parsed.hashtags : [];
    hashtags = hashtags
      .map((h) => String(h).trim().replace(/\s+/g, ""))
      .map((h) => (h.startsWith("#") ? h : `#${h}`))
      .filter((h) => h.length > 1)
      .slice(0, 8);
    if (hashtags.length < 5) {
      const fallback = ["#shorts", "#reels", "#tiktok", "#viral", "#fyp"];
      for (const f of fallback) {
        if (!hashtags.includes(f)) hashtags.push(f);
        if (hashtags.length >= 5) break;
      }
    }

    return { caption, hashtags };
  });
