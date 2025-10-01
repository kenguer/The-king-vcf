import { supabaseAdmin } from "../../lib/supabaseServer";
import { verifyAdmin } from "../../utils/adminAuth";

function vcardFor(contact) {
  const name = (contact.name || "Unknown").replace(/\n/g, " ");
  const phone = (contact.phone || "").replace(/\D/g, "");
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${name}`,
    `N:${name};;;;`,
    `TEL;TYPE=CELL:${phone}`,
    "END:VCARD"
  ].join("\r\n");
}

export default async function handler(req,res) {
  // protected
  const verify = verifyAdmin(req);
  if (!verify.ok) return res.status(401).json({ error: "Unauthorized" });

  try {
    const { data, error } = await supabaseAdmin.from("ralph_xpert").select("*").order("created_at", { ascending: true });
    if (error) throw error;
    const vcfText = (data || []).map(vcardFor).join("\r\n");
    const filename = `ralph-xpert-contacts-${new Date().toISOString().slice(0,10)}.vcf`;
    res.setHeader("Content-Type", "text/vcard; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.status(200).send(vcfText);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
    }
