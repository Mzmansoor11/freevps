const http = require('node:http');

const PORT = Number(process.env.PORT || 3000);
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
const DATABASE_TABLES = [
  'profiles',
  'vendors',
  'products',
  'orders',
  'order_items',
  'payment_events'
];

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'no-referrer'
  });
  res.end(JSON.stringify(payload));
}

function getSupabaseProjectUrl() {
  if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) return null;

  try {
    const projectUrl = new URL(SUPABASE_URL);
    if (projectUrl.protocol !== 'https:') return null;
    return projectUrl;
  } catch {
    return null;
  }
}

async function checkSupabaseConnection() {
  const projectUrl = getSupabaseProjectUrl();
  if (!projectUrl) {
    return {
      persistence: 'unavailable',
      persistenceDetail: 'missing-or-invalid-environment-variable'
    };
  }

  try {
    const response = await fetch(new URL('/rest/v1/', projectUrl), {
      method: 'GET',
      headers: {
        // Supabase sb_secret_* keys belong in the apikey header.
        // They are not JWTs and must not be sent as Bearer tokens.
        apikey: SUPABASE_SECRET_KEY,
        accept: 'application/openapi+json, application/json'
      },
      signal: AbortSignal.timeout(5000)
    });

    return {
      persistence: response.ok ? 'connected' : 'unavailable',
      persistenceDetail: response.ok ? 'ok' : 'supabase-http-error',
      supabaseHttpStatus: response.status
    };
  } catch (error) {
    return {
      persistence: 'unavailable',
      persistenceDetail: error && error.name === 'TimeoutError' ? 'timeout' : 'network-error'
    };
  }
}

async function checkDatabaseTables() {
  const projectUrl = getSupabaseProjectUrl();
  if (!projectUrl) {
    return {
      database: 'unavailable',
      databaseDetail: 'missing-or-invalid-environment-variable'
    };
  }

  const checks = await Promise.all(DATABASE_TABLES.map(async (table) => {
    try {
      // limit=0 validates table access without returning customer or business records.
      const endpoint = new URL(
        `/rest/v1/${table}?select=id&limit=0`,
        projectUrl
      );
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          apikey: SUPABASE_SECRET_KEY,
          accept: 'application/json'
        },
        signal: AbortSignal.timeout(5000)
      });

      return {
        table,
        status: response.ok ? 'ok' : 'unavailable',
        httpStatus: response.status
      };
    } catch (error) {
      return {
        table,
        status: 'unavailable',
        detail: error && error.name === 'TimeoutError' ? 'timeout' : 'network-error'
      };
    }
  }));

  const allConnected = checks.every((check) => check.status === 'ok');
  return {
    database: allConnected ? 'connected' : 'partially-unavailable',
    checks
  };
}

const server = http.createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname.replace(/\/+$/, '') || '/';

  if (req.method === 'GET' && (pathname === '/health' || pathname === '/')) {
    const connection = await checkSupabaseConnection();
    return sendJson(res, 200, {
      status: 'ok',
      service: 'mzansi-cart-api',
      mode: 'development',
      ...connection
    });
  }

  if (req.method === 'GET' && pathname === '/diagnostics/database') {
    const result = await checkDatabaseTables();
    return sendJson(res, result.database === 'connected' ? 200 : 503, {
      service: 'mzansi-cart-api',
      mode: 'development',
      ...result
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
  console.log('Mzansi Cart API listening on port ' + PORT);
});
