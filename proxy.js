const http = require('http');
const httpProxy = require('http-proxy');

// Simple serializing proxy: queues requests and sends one at a time
const TARGET_PORT = 3001;
const LISTEN_PORT = 3000;
let queue = Promise.resolve();

const server = http.createServer((req, res) => {
  // Serialize: chain each request into the queue
  queue = queue.then(() => new Promise((resolve) => {
    const proxyReq = http.request({
      hostname: '127.0.0.1',
      port: TARGET_PORT,
      path: req.url,
      method: req.method,
      headers: req.headers,
    }, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
      proxyRes.on('end', resolve);
    });
    proxyReq.on('error', (err) => {
      if (!res.headersSent) {
        res.writeHead(502, { 'Content-Type': 'text/plain' });
      }
      res.end('Bad Gateway: ' + err.message);
      resolve();
    });
    req.pipe(proxyReq);
  }));
});

server.listen(LISTEN_PORT, '0.0.0.0', () => {
  console.log(`Proxy listening on :${LISTEN_PORT} -> :${TARGET_PORT}`);
});
