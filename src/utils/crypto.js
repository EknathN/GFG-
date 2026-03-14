// ── Web Crypto API utilities ──────────────────────────────────────────────────
// All operations are async, browser-native, no external libraries needed.

/** Generate a random Base64 salt */
export function generateSalt(bytes = 16) {
  const arr = crypto.getRandomValues(new Uint8Array(bytes));
  return btoa(String.fromCharCode(...arr));
}

/** Generate a random session token */
export function generateToken(bytes = 32) {
  const arr = crypto.getRandomValues(new Uint8Array(bytes));
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

/** Hash a password with PBKDF2 + SHA-256 (100,000 iterations) */
export async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: encoder.encode(salt), iterations: 100_000, hash: 'SHA-256' },
    keyMaterial, 256
  );
  return bufferToBase64(bits);
}

/** Verify password against stored hash */
export async function verifyPassword(password, salt, storedHash) {
  const hash = await hashPassword(password, salt);
  return hash === storedHash;
}

/** Derive an AES-GCM key from a string (for encrypting stored data) */
async function deriveKey(secret) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode(secret), 'PBKDF2', false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: encoder.encode('gfg-club-rit-salt-2026'), iterations: 50_000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false, ['encrypt', 'decrypt']
  );
}

/** Encrypt a JSON object and return base64 ciphertext */
export async function encryptData(data, secret) {
  const key = await deriveKey(secret);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(data));
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return bufferToBase64(combined.buffer);
}

/** Decrypt base64 ciphertext and return parsed JSON */
export async function decryptData(b64, secret) {
  try {
    const combined = base64ToUint8Array(b64);
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);
    const key = await deriveKey(secret);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
    return JSON.parse(new TextDecoder().decode(decrypted));
  } catch {
    return null;
  }
}

// ── Buffer Utilities to prevent Call Stack Exceeded ─────────────────────────
function bufferToBase64(buf) {
  let binary = '';
  const bytes = new Uint8Array(buf);
  const len = bytes.byteLength;
  // Read in chunks to avoid blowing the call stack
  const chunkSize = 0x8000;
  for (let i = 0; i < len; i += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function base64ToUint8Array(b64) {
  const binaryString = atob(b64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// ── Simple Backend API helpers (users stored on server) ────────────────────
const API_BASE = 'http://localhost:5000/api';

export async function loadUsers() {
  const res = await fetch(`${API_BASE}/users`);
  if (!res.ok) return [];
  return res.json();
}

export async function findUserByRegNo(regNo) {
  const users = await loadUsers();
  return users.find(u => u.regNo.toLowerCase() === regNo.toLowerCase()) || null;
}

export async function registerUser(userData) {
  const users = await loadUsers();
  const exists = users.find(u => u.regNo.toLowerCase() === userData.regNo.toLowerCase());
  if (exists) throw new Error('Registration number already registered.');
  
  const salt = generateSalt();
  const passwordHash = await hashPassword(userData.password, salt);
  
  const newUser = {
    name: userData.name,
    regNo: userData.regNo,
    dept: userData.dept,
    section: userData.section,
    year: userData.year,
    sem: userData.sem,
    idCardPhoto: userData.idCardPhoto,  // base64
    email: userData.email,
    salt,
    passwordHash,
    createdAt: new Date().toISOString(),
    approved: true, // Default to approved for now as per current logic
    role: users.length === 0 ? 'admin' : 'member', // First user is admin
    points: 0,
  };

  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newUser),
  });

  if (!res.ok) throw new Error('Failed to register user on server.');
  return res.json();
}

export async function addPointsToUser(regNo, pointsToAdd) {
  const user = await findUserByRegNo(regNo);
  if (!user) throw new Error('User not found.');
  
  const updatedPoints = (user.points || 0) + pointsToAdd;
  
  const res = await fetch(`${API_BASE}/users/${user.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ points: updatedPoints }),
  });

  if (!res.ok) throw new Error('Failed to update points on server.');
  const updatedUser = await res.json();
  const { salt, passwordHash, ...safeUser } = updatedUser;
  return safeUser;
}

export async function loginUser(regNo, password) {
  const user = await findUserByRegNo(regNo);
  if (!user) throw new Error('Registration number not found.');
  const valid = await verifyPassword(password, user.salt, user.passwordHash);
  if (!valid) throw new Error('Incorrect password. Please try again.');
  if (!user.approved) throw new Error('Your account is pending admin approval.');
  
  const { salt, passwordHash, ...safeUser } = user;
  return safeUser;
}

export async function deleteUser(regNo) {
  const user = await findUserByRegNo(regNo);
  if (!user) throw new Error('User not found.');
  
  const res = await fetch(`${API_BASE}/users/${user.id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete user on server.');
}
