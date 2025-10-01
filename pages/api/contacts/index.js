import { supabaseAdmin } from "../../../lib/supabaseServer";

export default async function handler(req,res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { data, error } = await supabaseAdmin
      .from("ralph_xpert")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return res.status(200).json({ contacts: data || [] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
  }
