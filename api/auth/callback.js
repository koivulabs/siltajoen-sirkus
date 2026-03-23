// /api/auth/callback.js — GitHub OAuth initial redirect
export default function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = `${process.env.SITE_URL || 'https://siltajoensirkus.vercel.app'}/api/auth`;
  const scope = 'repo,user';

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
  
  res.redirect(githubAuthUrl);
}
