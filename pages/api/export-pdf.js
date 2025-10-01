import { supabaseAdmin } from "../../lib/supabaseServer";
import { verifyAdmin } from "../../utils/adminAuth";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default async function handler(req,res) {
  const verify = verifyAdmin(req);
  if (!verify.ok) return res.status(401).json({ error: "Unauthorized" });

  try {
    const { data } = await supabaseAdmin.from("ralph_xpert").select("*").order("created_at",{ascending:true});
    // create PDF
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    doc.setFontSize(14);
    doc.text("Ralph Xpert VCF — Contacts", 40, 50);
    const rows = (data || []).map((c, i) => [i+1, c.name, c.phone, new Date(c.created_at).toLocaleString()]);
    // @ts-ignore
    doc.autoTable({
      head: [['#','Name','Phone','Created At']],
      body: rows,
      startY: 70,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [47,215,113] }
    });
    const pdf = doc.output("arraybuffer");
    const filename = `ralph-xpert-contacts-${new Date().toISOString().slice(0,10)}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.status(200).send(Buffer.from(pdf));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
                                   }
      
