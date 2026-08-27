import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import login from './api/auth/login.js'
import me from './api/auth/me.js'
import logout from './api/auth/logout.js'
import reset from './api/auth/reset.js'

const root = fileURLToPath(new URL('.', import.meta.url))
const routes = { '/api/auth/login': login, '/api/auth/me': me, '/api/auth/logout': logout, '/api/auth/reset': reset }
const contentTypes = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.json': 'application/json' }

async function serveStatic(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.statusCode = 405; return res.end('Method not allowed') }
  const requested = req.url === '/' ? '/index.html' : new URL(req.url, 'http://localhost').pathname
  const relative = normalize(requested).replace(/^([.][.][/\\])+/, '')
  const file = join(root, 'dist', relative)
  try {
    const body = await readFile(file)
    res.statusCode = 200; res.setHeader('Content-Type', contentTypes[extname(file)] || 'application/octet-stream'); res.setHeader('X-Content-Type-Options', 'nosniff')
    return res.end(req.method === 'HEAD' ? undefined : body)
  } catch {
    if (extname(relative)) { res.statusCode = 404; return res.end('Not found') }
    try { const body = await readFile(join(root, 'dist', 'index.html')); res.statusCode = 200; res.setHeader('Content-Type', contentTypes['.html']); return res.end(body) } catch { res.statusCode = 503; return res.end('Build the application before starting the server.') }
  }
}

createServer((req, res) => {
  const path = new URL(req.url || '/', 'http://localhost').pathname
  if (routes[path]) return routes[path](req, res)
  return serveStatic(req, res)
}).listen(Number(process.env.PORT || 4173), process.env.HOST || '127.0.0.1', () => {
  console.log(`Shoppers Spot server listening on http://${process.env.HOST || '127.0.0.1'}:${process.env.PORT || 4173}`)
})
