const http = require('node:http');

const PORT = Number(process.env.PORT || 3000);
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'no-referrer'
  });
  res.end(JSON.stringify(payload));
}

async function checkSupabaseConnection() {
  if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
    return 'not-configured';
  }

  let endpoint;
  try {
    const projectUrl = new URL(SUPABASE_URL);
    if (projectUrl.protocol !== 'https:') {
      return 'configuration-error';
    }
    endpoint = new URL('/rest/v1/', projectUrl).toString();
  } catch {
    return 'configuration-error';
  }

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        // Supabase sb_secret_* keys belong in the apikey header.
        // They are not JWTs and must not be sent as Bearer tokens.
        apikey: SUPABASE_SECRET_KEY,
        accept: 'application/openapi+json, application/json'
      },
      signal: AbortSignal.timeout(5000)
    });

    return response.ok ? 'connected' : 'unavailable';
  } catch {
    return 'unavailable';
  }
}

const server = http.createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname.replace(/\/+$/, '') || '/';

  if (req.method === 'GET' && (pathname === '/health' || pathname === '/')) {
    const persistence = await checkSupabaseConnection();
    return sendJson(res, 200, {
      status: 'ok',
      service: 'mzansi-cart-api',
      mode: 'development',
      persistence
    });
  }

  if (pathname === '/api/orders') {
    return sendJson(res, 503, {
      success: false,
      error: 'Order processing is disabled until persistent storage, authentication, vendor controls and verified payment webhooks are implemented.'
    });
  }

  return sendJson(res, 404, { error: 'Not found' });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Mzansi Cart API listening on port ${PORT}`);
});
