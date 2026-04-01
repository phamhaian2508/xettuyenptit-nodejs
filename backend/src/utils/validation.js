import { createHttpError } from "./errors.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9]{9,15}$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const PASSWORD_COMPLEXITY_REGEX = /^(?=.*[A-Za-z])(?=.*\d).+$/;

function normalizeTextValue(value) {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim();
}

export function parsePositiveInt(value, fieldName) {
  const normalized = normalizeTextValue(value);
  if (!normalized) {
    throw createHttpError(400, `${fieldName} không hợp lệ`);
  }

  const parsed = Number.parseInt(normalized, 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw createHttpError(400, `${fieldName} không hợp lệ`);
  }

  return parsed;
}

export function optionalPositiveInt(value, fieldName) {
  const normalized = normalizeTextValue(value);
  if (!normalized) {
    return null;
  }

  return parsePositiveInt(normalized, fieldName);
}

export function requiredText(value, fieldName, { min = 1, max = 255 } = {}) {
  const normalized = normalizeTextValue(value);
  if (!normalized || normalized.length < min || normalized.length > max) {
    throw createHttpError(400, `${fieldName} không hợp lệ`);
  }

  return normalized;
}

export function optionalText(value, fieldName, { max = 255 } = {}) {
  const normalized = normalizeTextValue(value);
  if (!normalized) {
    return null;
  }

  if (normalized.length > max) {
    throw createHttpError(400, `${fieldName} không hợp lệ`);
  }

  return normalized;
}

export function optionalEnum(value, allowedValues, fieldName) {
  const normalized = normalizeTextValue(value);
  if (!normalized) {
    return null;
  }

  if (!allowedValues.includes(normalized)) {
    throw createHttpError(400, `${fieldName} không hợp lệ`);
  }

  return normalized;
}

export function optionalEmail(value, fieldName = "Email") {
  const normalized = optionalText(value, fieldName, { max: 255 });
  if (!normalized) {
    return null;
  }

  if (!EMAIL_REGEX.test(normalized)) {
    throw createHttpError(400, `${fieldName} không hợp lệ`);
  }

  return normalized.toLowerCase();
}

export function optionalPhone(value, fieldName = "Số điện thoại") {
  const normalized = optionalText(value, fieldName, { max: 20 });
  if (!normalized) {
    return null;
  }

  if (!PHONE_REGEX.test(normalized)) {
    throw createHttpError(400, `${fieldName} không hợp lệ`);
  }

  return normalized;
}

export function optionalDate(value, fieldName) {
  const normalized = optionalText(value, fieldName, { max: 10 });
  if (!normalized) {
    return null;
  }

  if (!DATE_REGEX.test(normalized)) {
    throw createHttpError(400, `${fieldName} không hợp lệ`);
  }

  const parsedDate = new Date(`${normalized}T00:00:00.000Z`);
  if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== normalized) {
    throw createHttpError(400, `${fieldName} không hợp lệ`);
  }

  return normalized;
}

export function optionalSearch(value, fieldName = "Từ khóa tìm kiếm") {
  return optionalText(value, fieldName, { max: 100 });
}

export function validatePasswordStrength(password, fieldName = "Mật khẩu mới") {
  if (typeof password !== "string" || password.length < 8 || password.length > 72) {
    throw createHttpError(400, `${fieldName} phải có từ 8 đến 72 ký tự`);
  }

  if (!PASSWORD_COMPLEXITY_REGEX.test(password)) {
    throw createHttpError(400, `${fieldName} phải gồm ít nhất 1 chữ cái và 1 chữ số`);
  }

  return password;
}
