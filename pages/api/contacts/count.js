import { supabaseAdmin } from "../../../lib/supabaseServer";

export default async function handler(req,res) {
  try {
    const { count, error } = await supabaseAdmin
      .from("ralph_xpert")
      .select("id", { head: true, count: "exact" });

    if (error) throw error;
    return res.status(200).json({ count: count || 5 });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
