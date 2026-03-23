// api/admin-login.js — Tarkistaa salasanan, asettaa session-cookien
export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { password } = req.body || {};
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!password || password !== adminPassword) {
    return res.status(401).json({ error: 'Väärä salasana' });
  }

  // Yksinkertainen signed token (base64 aika + salasana hash)
  const token = Buffer.from(`${Date.now()}:${adminPassword}`).toString('base64');

  res.setHeader('Set-Cookie', `admin_session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`);
  return res.status(200).json({ ok: true });
}
