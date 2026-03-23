// /api/auth.js — GitHub OAuth callback handler for Decap CMS
// This runs as a Vercel Serverless Function

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Missing code parameter');
  }

  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
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

    const data = await response.json();

    if (data.error) {
      return res.status(400).send(`GitHub OAuth error: ${data.error_description}`);
    }

    const token = data.access_token;

    // Send the token back to Decap CMS via postMessage
    const script = `
      <script>
        (function() {
          function receiveMessage(e) {
            console.log("receiveMessage %o", e);
            window.opener.postMessage(
              'authorization:github:success:${JSON.stringify({ token }).replace(/'/g, "\\'")}',
              e.origin
            );
          }
          window.addEventListener("message", receiveMessage, false);
          window.opener.postMessage("authorizing:github", "*");
        })()
      <\/script>
    `;

    return res.status(200).send(`
      <!doctype html>
      <html>
        <head><meta charset="utf-8" /></head>
        <body>
          ${script}
        </body>
      </html>
    `);
  } catch (err) {
    return res.status(500).send(`Server error: ${err.message}`);
  }
}
