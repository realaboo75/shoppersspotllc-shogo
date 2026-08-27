import { getAuthConfig, verifyPassword, createSession, sessionCookie, sendJson, readBody } from '../../src/server/auth.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed.' }, { Allow: 'POST' })
  const { email, password } = await readBody(req)
  const config = getAuthConfig()
  const valid = typeof email === 'string' && typeof password === 'string' && email.trim().toLowerCase() === config.email?.trim().toLowerCase() && verifyPassword(password, config.passwordHash)
  if (!valid || !config.secret) return sendJson(res, 401, { error: 'Invalid email or password.' })
  const secure = process.env.NODE_ENV !== 'development'
  return sendJson(res, 200, { ok: true, user: { email: config.email, name: 'Aboobakar' } }, { 'Set-Cookie': sessionCookie(createSession(config.email, config.secret), secure), 'Cache-Control': 'no-store' })
}
