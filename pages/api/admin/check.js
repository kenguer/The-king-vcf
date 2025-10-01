import { verifyAdmin } from "../../../utils/adminAuth";

export default function handler(req,res) {
  const v = verifyAdmin(req);
  if (!v.ok) return res.status(401).json({ error: "Not authenticated" });
  return res.status(200).json({ ok: true, user: v.user });
}
