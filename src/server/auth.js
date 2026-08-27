import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

const COOKIE_NAME = 'shoppers_spot_session'
const SESSION_TTL_SECONDS = 60 * 60 * 8

export function getAuthConfig(env = process.env) {
  return { email: env.FOUNDER_EMAIL, passwordHash: env.FOUNDER_PASSWORD_HASH, secret: env.AUTH_SECRET }
}

export function verifyPassword(password, encoded) {
  if (!password || !encoded?.startsWith('scrypt$')) return false
  const [, salt, expected] = encoded.split('$')
  if (!salt || !expected) return false
  try {
    const actual = scryptSync(password, salt, 64).toString('hex')
    const a = Buffer.from(actual, 'hex')
    const b = Buffer.from(expected, 'hex')
    return a.length === b.length && timingSafeEqual(a, b)
  } catch { return false }
}

function encode(value) { return Buffer.from(value).toString('base64url') }
function decode(value) { return Buffer.from(value, 'base64url').toString('utf8') }
function sign(value, secret) { return createHmac('sha256', secret).update(value).digest('base64url') }

export function createSession(email, secret, now = Date.now()) {
  const payload = encode(JSON.stringify({ email, exp: Math.floor(now / 1000) + SESSION_TTL_SECONDS }))
  return `${payload}.${sign(payload, secret)}`
}

export function readSession(cookieHeader, secret, now = Date.now()) {
  if (!cookieHeader || !secret) return null
  const cookies = Object.fromEntries(cookieHeader.split(';').map(part => { const [key, ...rest] = part.trim().split('='); return [key, rest.join('=')] }))
  const value = cookies[COOKIE_NAME]
  if (!value) return null
  const [payload, signature] = value.split('.')
  if (!payload || !signature || sign(payload, secret) !== signature) return null
  try {
    const session = JSON.parse(decode(payload))
    return session.exp > Math.floor(now / 1000) ? session : null
  } catch { return null }
}

export function sessionCookie(value, secure = true) { return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}${secure ? '; Secure' : ''}` }
export function expiredSessionCookie(secure = true) { return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure ? '; Secure' : ''}` }

export function sendJson(res, status, body, headers = {}) { res.statusCode = status; for (const [key, value] of Object.entries(headers)) res.setHeader(key, value); res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.end(JSON.stringify(body)) }
export async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  let raw = ''
  for await (const chunk of req) raw += chunk
  try { return JSON.parse(raw || '{}') } catch { return {} }
}
export { COOKIE_NAME }
