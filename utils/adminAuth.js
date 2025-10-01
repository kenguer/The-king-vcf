import jwt from "jsonwebtoken";

export function parseCookies(req) {
  const header = req.headers.cookie || "";
  const pairs = header.split(";").map(s => s.trim()).filter(Boolean);
  const obj = {};
  for (const p of pairs) {
    const [k, ...v] = p.split("=");
    obj[k] = decodeURIComponent(v.join("="));
  }
  return obj;
}

export function verifyAdmin(req) {
  const JWT_SECRET = process.env.ADMIN_JWT_SECRET;
  if (!JWT_SECRET) return { ok: false };
  const cookies = parseCookies(req);
  const token = cookies["admin_token"];
  if (!token) return { ok: false };
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { ok: true, user: decoded.sub || decoded };
  } catch (err) {
    return { ok: false };
  }
}
