import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { code } = req.query;
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'GitHub OAuth not configured' });
  }

  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code as string,
      }),
    });

    const data = await tokenResponse.json();

    if (data.error) {
      return res.status(400).json({ error: data.error_description || 'OAuth error' });
    }

    const { access_token, token_type } = data;

    const script = `
      <script>
        (function() {
          function receiveMessage(e) {
            console.log("receiveMessage %o", e);
            window.opener.postMessage(
              'authorization:github:success:${JSON.stringify({
                token: access_token,
                provider: 'github'
              })}',
              e.origin
            );
            window.removeEventListener("message", receiveMessage, false);
          }
          window.addEventListener("message", receiveMessage, false);
          console.log("Posting message to opener");
          window.opener.postMessage("authorizing:github", "*");
        })();
      </script>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(script);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
