export default function handler(req,res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  // clear cookie
  res.setHeader("Set-Cookie", `admin_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict; Secure=${process.env.NODE_ENV==='production'}`);
  res.status(200).json({ ok: true });
}
