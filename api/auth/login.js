import { getAuthConfig, isAuthConfigured, isSecureRequest, verifyPassword, createSession, sessionCookie, sendJson, readBody } from '../../src/server/auth.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed.' }, { Allow: 'POST' })
  const body = await readBody(req)
  const { email, password } = body || {}
  const config = getAuthConfig()
  const valid = isAuthConfigured(config) && typeof email === 'string' && typeof password === 'string' && email.trim().toLowerCase() === config.email.trim().toLowerCase() && verifyPassword(password, config.passwordHash)
  if (!valid) return sendJson(res, 401, { error: 'Invalid email or password.' })
  return sendJson(res, 200, { ok: true, user: { email: config.email, name: 'Aboobakar' } }, { 'Set-Cookie': sessionCookie(createSession(config.email, config.secret), isSecureRequest(req)), 'Cache-Control': 'no-store' })
}
