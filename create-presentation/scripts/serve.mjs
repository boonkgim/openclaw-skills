#!/usr/bin/env node
// serve.mjs — Simple static file server for presentations (cross-platform)
// Usage: node serve.mjs <presentation-dir>
// No dependencies — uses only Node.js built-ins.

import { createServer } from 'http';
import { readFileSync, existsSync, statSync } from 'fs';
import { join, extname, resolve } from 'path';

const dir = resolve(process.argv[2] || '.');

if (!existsSync(join(dir, 'index.html'))) {
  console.error(`Error: No index.html found in ${dir}`);
  process.exit(1);
}

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
};

function tryListen(port) {
  const server = createServer((req, res) => {
    const urlPath = req.url.split('?')[0];
    const filePath = join(dir, urlPath === '/' ? 'index.html' : urlPath);

    if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }

    const ext = extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(readFileSync(filePath));
  });

  server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
      tryListen(port + 1);
    } else {
      console.error(e);
      process.exit(1);
    }
  });

  server.listen(port, () => {
    console.log(`SERVER_PID=${process.pid}`);
    console.log(`SERVER_URL=http://localhost:${port}`);
  });
}

tryListen(3000);
