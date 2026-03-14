const crypto = require('crypto');

function generateSalt(bytes = 16) {
  return crypto.randomBytes(bytes).toString('base64');
}

function hashPassword(password, salt) {
  return new Promise((resolve, reject) => {
    // Browser uses encoder.encode(salt) which is UTF-8 encoding of the Base64 string literal
    crypto.pbkdf2(password, Buffer.from(salt, 'utf8'), 100000, 32, 'sha256', (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString('base64'));
    });
  });
}

async function main() {
  const password = 'admin';
  const salt = 'hC+Xy+TnvHRwE2QkSCWmkg=='; // Keep the same salt to minimize changes
  const hash = await hashPassword(password, salt);
  console.log(JSON.stringify({ salt, hash, password }));
}

main();
