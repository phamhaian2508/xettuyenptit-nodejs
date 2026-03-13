import crypto from "crypto";
import bcrypt from "bcryptjs";

const BCRYPT_PREFIX = "$2";

function safeCompare(a, b) {
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export function matchesPassword(rawPassword, storedPassword) {
  if (!storedPassword) {
    return false;
  }

  if (storedPassword.startsWith("{noop}")) {
    const plainPassword = storedPassword.slice(6);
    if (plainPassword.length !== rawPassword.length) {
      return plainPassword === rawPassword;
    }
    return safeCompare(plainPassword, rawPassword);
  }

  if (storedPassword.startsWith("{bcrypt}") || storedPassword.startsWith(BCRYPT_PREFIX)) {
    const bcryptHash = storedPassword.startsWith("{bcrypt}")
      ? storedPassword.slice(8)
      : storedPassword;
    return bcrypt.compareSync(rawPassword, bcryptHash);
  }

  if (storedPassword.length !== rawPassword.length) {
    return storedPassword === rawPassword;
  }

  return safeCompare(storedPassword, rawPassword);
}

export function encodePassword(rawPassword) {
  return `{bcrypt}${bcrypt.hashSync(rawPassword, 10)}`;
}
