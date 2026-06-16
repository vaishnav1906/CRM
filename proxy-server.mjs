import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BUILD_DIR = path.join(__dirname, 'packages/twenty-front/build');
const BACKEND = 'http://localhost:3000';
const PORT = 3001;

const PROXY_PREFIXES = [
  '/graphql', '/metadata', '/auth', '/api', '/rest',
  '/files', '/healthz', '/health', '/webhook', '/open-api',
  '/client-config', '/mcp', '/oauth', '/.well-known',
  '/app/billing', '/rest/ai', '/s/', '/admin-panel',
];

const MIME = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.json': 'application/json',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
  '.ttf':  'font/ttf',
  '.webp': 'image/webp',
};

function proxyToBackend(req, res) {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: 'localhost:3000' },
  };

  const proxy = http.request(options, (backendRes) => {
    res.writeHead(backendRes.statusCode, backendRes.headers);
    backendRes.pipe(res, { end: true });
  });

  proxy.on('error', (err) => {
    console.error('[proxy error]', err.message);
    res.writeHead(502);
    res.end('Backend not reachable');
  });

  req.pipe(proxy, { end: true });
}

function serveStatic(req, res) {
  let filePath = path.join(BUILD_DIR, req.url.split('?')[0]);

  // SPA fallback — serve index.html for unknown paths
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(BUILD_DIR, 'index.html');
  }

  const ext = path.extname(filePath);
  const mime = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const isApiRoute = PROXY_PREFIXES.some(
    (prefix) => req.url === prefix || req.url.startsWith(prefix + '/') || req.url.startsWith(prefix + '?')
  );

  if (isApiRoute) {
    proxyToBackend(req, res);
  } else {
    serveStatic(req, res);
  }
});

// Handle WebSocket upgrades (for GraphQL subscriptions)
server.on('upgrade', (req, socket, head) => {
  const proxyReq = http.request({
    hostname: 'localhost',
    port: 3000,
    path: req.url,
    method: req.method,
    headers: req.headers,
  });

  proxyReq.on('upgrade', (proxyRes, proxySocket) => {
    socket.write('HTTP/1.1 101 Switching Protocols\r\n' +
      Object.entries(proxyRes.headers).map(([k, v]) => `${k}: ${v}`).join('\r\n') +
      '\r\n\r\n');
    proxySocket.pipe(socket);
    socket.pipe(proxySocket);
  });

  proxyReq.on('error', () => socket.destroy());
  proxyReq.end();
});

server.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
  console.log(`  Static files: ${BUILD_DIR}`);
  console.log(`  API proxy  : ${BACKEND}`);
});
