// Reverse proxy: forwards everything to twenty-server (3000) on a single port (8082).
// The backend serves the built frontend statically, so no separate frontend port needed.
// Port 8080 is reserved by Jenkins on this machine.
import http from 'http';
import httpProxy from 'http-proxy';

const BACKEND = 'http://localhost:3000';
const PORT = 8082;

const proxy = httpProxy.createProxyServer({ ws: true, xfwd: true });

proxy.on('error', (err, req, res) => {
  console.error(`Proxy error [${req.method} ${req.url}] → ${BACKEND}: ${err.code || err.message || JSON.stringify(err)}`);
  if (res && !res.headersSent) {
    res.writeHead(502);
    res.end('Bad Gateway');
  }
});

// Bypass ngrok browser interstitial for free-tier domains
proxy.on('proxyRes', (proxyRes) => {
  proxyRes.headers['ngrok-skip-browser-warning'] = 'true';
});

const server = http.createServer((req, res) => {
  proxy.web(req, res, { target: BACKEND });
});

// Forward WebSocket upgrades (e.g. GraphQL subscriptions)
server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head, { target: BACKEND });
});

server.listen(PORT, () => {
  console.log(`Proxy running on http://localhost:${PORT}`);
  console.log(`  ALL → ${BACKEND}`);
});
