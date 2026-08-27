import { randomBytes, scryptSync } from 'node:crypto'
const password = process.env.PASSWORD
if (!password) { console.error('Set PASSWORD in the environment; do not pass it as a command-line argument.'); process.exit(1) }
const salt = randomBytes(16).toString('hex')
console.log(`scrypt$${salt}$${scryptSync(password, salt, 64).toString('hex')}`)
