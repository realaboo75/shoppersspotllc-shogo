import { expiredSessionCookie, isSecureRequest, sendJson } from '../../src/server/auth.js'
export default async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed.' }, { Allow: 'POST' })
  return sendJson(res, 200, { ok: true }, { 'Set-Cookie': expiredSessionCookie(isSecureRequest(req)), 'Cache-Control': 'no-store' })
}
