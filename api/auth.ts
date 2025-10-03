import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  
  if (!clientId) {
    return res.status(500).json({ error: 'GitHub OAuth Client ID not configured' });
  }

  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo`;
  
  res.redirect(authUrl);
}
