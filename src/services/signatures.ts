import type { Signature } from "@/types/content";
import { supabase } from "@/lib/supabase";

export async function getSignatures(postId: string): Promise<Signature[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from("signs").select("svg_text, id").eq("post_id", postId);
  if (error) throw error;
  return (data || []).map(item => ({ svgText: item.svg_text, id: item.id }));
}

export async function addSignature(postId: string, svgText: string): Promise<string> {
  if (!supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase.from("signs").insert({ svg_text: svgText, post_id: postId }).select("id").single();
  if (error) throw error;
  return data.id;
}
