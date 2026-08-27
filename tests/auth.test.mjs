import test from 'node:test'
import assert from 'node:assert/strict'
import { createSession, readSession, verifyPassword } from '../src/server/auth.js'
import { scryptSync } from 'node:crypto'

test('password verification accepts the encoded hash and rejects another password', () => {
  const salt = 'test-salt'
  const hash = `scrypt$${salt}$${scryptSync('correct-password', salt, 64).toString('hex')}`
  assert.equal(verifyPassword('correct-password', hash), true)
  assert.equal(verifyPassword('wrong-password', hash), false)
})

test('sessions are signed and expire', () => {
  const now = 1_700_000_000_000
  const token = createSession('founder@example.test', 'test-secret', now)
  assert.deepEqual(readSession(`shoppers_spot_session=${token}`, 'test-secret', now), { email: 'founder@example.test', exp: 1700000000 + 28800 })
  assert.equal(readSession(`shoppers_spot_session=${token}`, 'wrong-secret', now), null)
  assert.equal(readSession(`shoppers_spot_session=${token}`, 'test-secret', now + 28801 * 1000), null)
})
