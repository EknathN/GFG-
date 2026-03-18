import { subtle } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SALT = 'GFG_ADMIN_SALT_2026';
const PASSWORD = 'admin';

function bufferToBase64(buf) {
  const bytes = new Uint8Array(buf);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.byteLength; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return Buffer.from(binary, 'binary').toString('base64');
}

async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const keyMaterial = await subtle.importKey(
    'raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const bits = await subtle.deriveBits(
    { name: 'PBKDF2', salt: encoder.encode(salt), iterations: 100_000, hash: 'SHA-256' },
    keyMaterial, 256
  );
  return bufferToBase64(bits);
}

const hash = await hashPassword(PASSWORD, SALT);
console.log('New hash:', hash);

// Patch users.json
const usersPath = path.join(__dirname, 'server-data', 'users.json');
const users = JSON.parse(readFileSync(usersPath, 'utf-8'));
const admin = users.find(u => u.role === 'admin');
if (admin) {
  console.log('Updating admin user:', admin.regNo);
  admin.salt = SALT;
  admin.passwordHash = hash;
  writeFileSync(usersPath, JSON.stringify(users, null, 2));
  console.log('✅ users.json updated');
} else {
  console.log('❌ No admin user found');
}

// Print for crypto.js update
console.log('\nUpdate in crypto.js:');
console.log(`export const FIXED_ADMIN_SALT = '${SALT}';`);
console.log(`export const FIXED_ADMIN_HASH = '${hash}'; // password: admin`);
