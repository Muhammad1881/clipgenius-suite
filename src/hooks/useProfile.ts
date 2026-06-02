import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) {
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();
    if (!error && data) setProfile(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProfile();

    // Refetch when profile changes via realtime-ish: listen for custom event
    const handler = () => fetchProfile();
    window.addEventListener("profile:refresh", handler);
    return () => window.removeEventListener("profile:refresh", handler);
  }, [fetchProfile]);

  return { profile, loading, refetch: fetchProfile };
}
