import jwt from "jsonwebtoken";

export default function handler(req,res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { username, password } = req.body || {};
  const ADMIN_USER = process.env.ADMIN_USER;
  const ADMIN_PASS = process.env.ADMIN_PASS;
  const JWT_SECRET = process.env.ADMIN_JWT_SECRET;
  if (!ADMIN_USER || !ADMIN_PASS || !JWT_SECRET) {
    console.error("Admin env missing");
    return res.status(500).json({ error: "Server not configured" });
  }

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ sub: ADMIN_USER }, JWT_SECRET, { expiresIn: "2h" });
    // set httpOnly cookie
    res.setHeader("Set-Cookie", `admin_token=${token}; HttpOnly; Path=/; Max-Age=${60*60*6}; SameSite=Strict; Secure=${process.env.NODE_ENV==='production'}`);
    return res.status(200).json({ ok: true });
  } else {
    return res.status(401).json({ error: "⚠️Unathorized Access! Only developer can access for now 😒." });
  }
}
  
