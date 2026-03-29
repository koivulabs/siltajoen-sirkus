// api/admin-upload.js — Lataa kuvan GitHubiin base64-muodossa
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // Tarkista session
  const cookie = req.headers.cookie || '';
  const sessionMatch = cookie.match(/admin_session=([^;]+)/);
  if (!sessionMatch) return res.status(401).json({ error: 'Ei kirjautunut' });

  try {
    const decoded = Buffer.from(sessionMatch[1], 'base64').toString();
    const [, storedPassword] = decoded.split(':');
    if (storedPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Istunto vanhentunut' });
    }
  } catch {
    return res.status(401).json({ error: 'Virheellinen istunto' });
  }

  const { filename, base64content } = req.body || {};
  if (!filename || !base64content) return res.status(400).json({ error: 'Puuttuvat tiedot' });

  // Turvallisuus: salli vain kuvatiedostot, poista erikoismerkit nimestä
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase();
  if (!/\.(jpg|jpeg|png|webp|gif)$/i.test(safeName)) {
    return res.status(400).json({ error: 'Vain kuvatiedostot sallittu (jpg, png, webp)' });
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = 'OWNER/REPO';
  const filePath = `public/kuvia/${safeName}`;
  const apiUrl = `https://api.github.com/repos/${REPO}/contents/${filePath}`;

  // Tarkista onko sama tiedosto jo olemassa (SHA tarvitaan päivitykseen)
  let sha;
  try {
    const check = await fetch(apiUrl, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' }
    });
    if (check.ok) {
      const existing = await check.json();
      sha = existing.sha;
    }
  } catch {}

  const body = JSON.stringify({
    message: `Admin: ladattu kuva ${safeName}`,
    content: base64content,
    ...(sha ? { sha } : {}),
    branch: 'main',
  });

  const putRes = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body,
  });

  if (!putRes.ok) {
    const err = await putRes.json();
    return res.status(500).json({ error: err.message });
  }

  return res.status(200).json({ 
    ok: true, 
    path: `/kuvia/${safeName}`,
    message: `Kuva "${safeName}" ladattu onnistuneesti!`
  });
}
