import { supabaseAdmin } from "../../lib/supabaseServer";
import { verifyAdmin } from "../../utils/adminAuth";

export default async function handler(req,res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const verify = verifyAdmin(req);
  if (!verify.ok) return res.status(401).json({ error: "Unauthorized" });

  try {
    const { error } = await supabaseAdmin.from("ralph_xpert").delete().not("id", "is", null);// delete all
    if (error) throw error;
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
