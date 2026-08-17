import { supabase } from "@/lib/supabase";

export async function getLikeCount(postId: string): Promise<number> {
  if (!supabase) return 0;
  const { data, error } = await supabase.from("likes").select("count").eq("post_id", postId).single();
  if (error && error.code !== "PGRST116") throw error;
  return data?.count || 0;
}

export async function updateLike(postId: string, action: "increment" | "decrement"): Promise<void> {
  if (!supabase) throw new Error("Supabase is not configured");
  const { error } = await supabase.rpc(`${action}_likes`, { input_post_id: postId });
  if (error) throw error;
}
