const http = require('node:http');

const PORT = Number(process.env.PORT || 3000);

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'no-referrer'
  });
  res.end(JSON.stringify(payload));
}

const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname.replace(/\/+$/, '') || '/';

  if (req.method === 'GET' && (pathname === '/health' || pathname === '/')) {
    return sendJson(res, 200, {
      status: 'ok',
      service: 'mzansi-cart-api',
      mode: 'development',
      persistence: 'not-configured'
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
