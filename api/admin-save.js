// api/admin-save.js — Tallentaa JSON-tiedoston GitHubiin GitHub API:n kautta
//
// HUOM: Vercel-serverless-funktio. Importtaa Zod-skeeman JS-mirroristä
// (src/utils/contactSchema.js), koska TS-tiedostoja ei käännetä `api/`:sta.
import { contactSchema } from "../src/utils/contactSchema.js";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // Tarkista session cookie
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

  const { filePath, content } = req.body || {};
  if (!filePath || !content) return res.status(400).json({ error: 'Puuttuvat parametrit' });

  // Sallitut tiedostot (turvallisuus)
  const allowedPaths = [
    'src/data/animals.json',
    'src/data/homepage.json',
    'src/data/team.json',
    'src/data/contact.json',
    'src/data/blog.json',
    'src/data/siilo.json',
  ];
  if (!allowedPaths.includes(filePath)) {
    return res.status(403).json({ error: 'Tiedostopolku ei sallittu' });
  }

  // ─── Per-tiedosto syötevalidointi ───────────────────────────────
  // contact.json: validoi Zod-skeemalla, jotta admin-UI ei pääse rikkomaan
  // tuotantosivun yhteystietoja (esim. ei-validi email tai tyhjä osoite).
  if (filePath === 'src/data/contact.json') {
    let parsed;
    if (typeof content === 'string') {
      try {
        parsed = JSON.parse(content);
      } catch {
        return res.status(400).json({ error: 'contact.json: ei validia JSONia' });
      }
    } else {
      parsed = content;
    }
    const result = contactSchema.safeParse(parsed);
    if (!result.success) {
      const issues = result.error.issues.map(
        (i) => `${i.path.join('.') || '(juuri)'}: ${i.message}`
      );
      return res.status(400).json({
        error: 'Yhteystietojen validointi epäonnistui',
        details: issues,
      });
    }
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = 'koivulabs/siltajoen-sirkus';
  const BRANCH = 'main';
  const apiUrl = `https://api.github.com/repos/${REPO}/contents/${filePath}`;

  try {
    // Hae nykyinen SHA (tarvitaan päivitykseen)
    const getRes = await fetch(apiUrl, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' }
    });
    const getJson = await getRes.json();
    const sha = getJson.sha;

    // Commitoi uusi versio
    const body = JSON.stringify({
      message: `Admin: päivitetty ${filePath}`,
      content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64'),
      sha,
      branch: BRANCH,
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

    return res.status(200).json({ ok: true, message: 'Tallennettu! Sivu päivittyy noin minuutissa.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
