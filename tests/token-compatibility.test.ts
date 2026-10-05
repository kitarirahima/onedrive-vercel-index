import assert from 'node:assert/strict'
import { createDecipheriv, createHash } from 'node:crypto'
import { test } from 'node:test'

import { obfuscateToken, revealObfuscatedToken } from '../src/utils/oAuthHandler'
import { compareHashedToken } from '../src/utils/protectedRouteHandler'

const plaintext = '兼容测试 🔑'
// Generated with CryptoJS 4.2.0 before migrating the dependency.
const legacyCiphertext = 'U2FsdGVkX1+XrpVlsGQNXbYBCHuXes8XT+xWUOWnOFHeEkzSEkrQcECS/no/86iz'
const legacyHash = '75c4d3a06ecefdda3927be039fac4c762627974a1e1c1c4d10ea77cb6941e0e5'

test('decrypts existing CryptoJS tokens', () => {
  assert.equal(revealObfuscatedToken(legacyCiphertext), plaintext)
})

test('new tokens retain the OpenSSL salted AES format', () => {
  const encoded = Buffer.from(obfuscateToken(plaintext), 'base64')
  assert.equal(encoded.subarray(0, 8).toString(), 'Salted__')
  const salt = encoded.subarray(8, 16)
  const password = Buffer.from('onedrive-vercel-index')
  let material = Buffer.alloc(0)
  let block = Buffer.alloc(0)
  while (material.length < 48) {
    block = createHash('md5').update(Buffer.concat([block, password, salt])).digest()
    material = Buffer.concat([material, block])
  }
  const decipher = createDecipheriv('aes-256-cbc', material.subarray(0, 32), material.subarray(32, 48))
  const decrypted = Buffer.concat([decipher.update(encoded.subarray(16)), decipher.final()])
  assert.equal(decrypted.toString('utf8'), plaintext)
})

test('protected passwords keep their existing SHA256 hashes and whitespace handling', () => {
  assert.equal(compareHashedToken({ odTokenHeader: legacyHash, dotPassword: `  ${plaintext}\n` }), true)
  assert.equal(compareHashedToken({ odTokenHeader: legacyHash, dotPassword: 'wrong password' }), false)
})
