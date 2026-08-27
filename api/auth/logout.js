import { expiredSessionCookie, sendJson } from '../../src/server/auth.js'
export default async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed.' }, { Allow: 'POST' })
  const secure = process.env.NODE_ENV !== 'development'
  return sendJson(res, 200, { ok: true }, { 'Set-Cookie': expiredSessionCookie(secure), 'Cache-Control': 'no-store' })
}
