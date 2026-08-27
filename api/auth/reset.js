import { sendJson } from '../../src/server/auth.js'
export default async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed.' }, { Allow: 'POST' })
  // Deliberately do not claim that an email was sent. An email provider and token store must be configured first.
  return sendJson(res, 501, { error: 'Password reset is not configured. Contact the account administrator.' }, { 'Cache-Control': 'no-store' })
}
