import validator from "validator";

export function sanitizeText(value, maxLength = 500) {
  if (typeof value !== "string") return "";
  return validator.escape(validator.trim(value)).slice(0, maxLength);
}

export function sanitizeEmail(email) {
  if (typeof email !== "string") return "";
  const trimmed = validator.trim(email).toLowerCase();
  return validator.isEmail(trimmed) ? trimmed : "";
}

export function sanitizeBoolean(value) {
  return value === true || value === 1 || value === "1" || value === "true";
}

export function sanitizeInteger(value, fallback = 0, min = 0, max = 10000) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
}

export function sanitizeDate(value) {
  if (typeof value !== "string" || !validator.isISO8601(value, { strict: true })) {
    return "";
  }
  return value.slice(0, 10);
}
