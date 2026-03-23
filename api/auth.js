// /api/auth.js — Täydellinen GitHub OAuth handler Decap CMS:lle
// Käsittelee sekä kirjautumisen aloituksen että callbackin

export default async function handler(req, res) {
  const { code, provider, scope } = req.query;

  // TAPAUS 1: Decap CMS pyytää kirjautumisen aloitusta
  // URL: /api/auth?provider=github&scope=repo,user
  if (provider === 'github' && !code) {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = `https://siltajoensirkus.vercel.app/api/auth`;
    const githubScope = scope || 'repo,user';

    const githubUrl = new URL('https://github.com/login/oauth/authorize');
    githubUrl.searchParams.set('client_id', clientId);
    githubUrl.searchParams.set('redirect_uri', redirectUri);
    githubUrl.searchParams.set('scope', githubScope);
    githubUrl.searchParams.set('response_type', 'code');

    return res.redirect(302, githubUrl.toString());
  }

  // TAPAUS 2: GitHub ohjaa takaisin koodin kanssa
  // URL: /api/auth?code=XXXX
  if (code) {
    try {
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });

      const data = await tokenResponse.json();

      if (data.error) {
        return res.status(400).send(`
          <!doctype html><html><body><script>
            window.opener && window.opener.postMessage(
              'authorization:github:error:${JSON.stringify({ message: data.error_description })}',
              '*'
            );
            window.close();
          <\/script></body></html>
        `);
      }

      const token = data.access_token;

      // Lähetä token takaisin Decap CMS:lle postMessage-viestillä
      return res.status(200).send(`
        <!doctype html>
        <html>
        <head><meta charset="utf-8" /></head>
        <body>
        <script>
          (function() {
            function sendToken(e) {
              window.opener.postMessage(
                'authorization:github:success:${JSON.stringify({ token, provider: 'github' }).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}',
                e.origin
              );
              window.removeEventListener('message', sendToken);
            }
            window.addEventListener('message', sendToken, false);
            window.opener && window.opener.postMessage('authorizing:github', '*');
          })();
        <\/script>
        </body>
        </html>
      `);
    } catch (err) {
      return res.status(500).send(`Server error: ${err.message}`);
    }
  }

  // Jos parametrit puuttuvat täysin
  return res.status(400).send('Missing required parameters (provider or code)');
}
