import validator from "validator";

const HABIT_CATEGORIES = ["fitness", "nutrition", "mindfulness", "sleep", "productivity", "social"];
const HABIT_FREQUENCIES = ["daily", "weekly", "custom"];
const MOOD_OPTIONS = ["great", "good", "okay", "low", "stressed"];

export function validateRegistration({ name, email, password }) {
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push("Name must be at least 2 characters.");
  }
  if (!email || !validator.isEmail(email)) {
    errors.push("A valid email address is required.");
  }
  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters.");
  }

  return errors;
}

export function validateHabitPayload(payload, isUpdate = false) {
  const errors = [];
  const { name, category, frequency, targetDays, color, description } = payload;

  if (!isUpdate || name !== undefined) {
    if (!name || name.trim().length < 2) {
      errors.push("Habit name must be at least 2 characters.");
    }
  }

  if (!isUpdate || category !== undefined) {
    if (!HABIT_CATEGORIES.includes(category)) {
      errors.push("Invalid habit category.");
    }
  }

  if (!isUpdate || frequency !== undefined) {
    if (!HABIT_FREQUENCIES.includes(frequency)) {
      errors.push("Invalid habit frequency.");
    }
  }

  if (targetDays !== undefined) {
    const days = Number(targetDays);
    if (Number.isNaN(days) || days < 1 || days > 31) {
      errors.push("Target days must be between 1 and 31.");
    }
  }

  if (color !== undefined && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
    errors.push("Color must be a valid hex code.");
  }

  if (description !== undefined && description.length > 500) {
    errors.push("Description must be 500 characters or fewer.");
  }

  return errors;
}

export function validateEntryPayload(payload, isUpdate = false) {
  const errors = [];
  const { entryDate, completed, durationMinutes, mood, notes } = payload;

  if (!isUpdate || entryDate !== undefined) {
    if (!entryDate || !validator.isISO8601(entryDate, { strict: true })) {
      errors.push("Entry date must be a valid ISO date.");
    }
  }

  if (durationMinutes !== undefined) {
    const minutes = Number(durationMinutes);
    if (Number.isNaN(minutes) || minutes < 0 || minutes > 1440) {
      errors.push("Duration must be between 0 and 1440 minutes.");
    }
  }

  if (mood !== undefined && mood !== null && mood !== "" && !MOOD_OPTIONS.includes(mood)) {
    errors.push("Invalid mood value.");
  }

  if (notes !== undefined && notes.length > 500) {
    errors.push("Notes must be 500 characters or fewer.");
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    errors.push("Completed must be a boolean value.");
  }

  return errors;
}

export { HABIT_CATEGORIES, HABIT_FREQUENCIES, MOOD_OPTIONS };
