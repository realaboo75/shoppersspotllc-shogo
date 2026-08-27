import { getAuthConfig, readSession, sendJson } from '../../src/server/auth.js'
export default async function handler(req, res) {
  if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed.' }, { Allow: 'GET' })
  const session = readSession(req.headers.cookie, getAuthConfig().secret)
  if (!session) return sendJson(res, 401, { error: 'Not authenticated.' }, { 'Cache-Control': 'no-store' })
  return sendJson(res, 200, { ok: true, user: { email: session.email, name: 'Aboobakar' } }, { 'Cache-Control': 'no-store' })
}
