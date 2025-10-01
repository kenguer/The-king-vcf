import { supabaseAdmin } from "../../lib/supabaseServer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { name, phone } = req.body || {};
  if (!name || !phone) return res.status(400).json({ error: "Missing fields" });

  try {
    // check duplicate
    const { data: existing } = await supabaseAdmin
      .from("ralph_xpert").select("id").eq("phone", phone).limit(1);

    if (existing?.length) {
      return res.status(200).json({ exists: true });
    }

    const { data, error } = await supabaseAdmin
      .from("ralph_xpert")
      .insert({ name, phone })
      .select()
      .single();

    if (error) throw error;
    return res.status(200).json({ ok: true, contact: data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
