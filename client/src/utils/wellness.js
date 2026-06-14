export function sanitizeInput(value, maxLength = 200) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/[<>]/g, "").slice(0, maxLength);
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password) {
  return typeof password === "string" && password.length >= 8;
}

export function calculateCompletionRate(entries) {
  if (!entries.length) return 0;
  const completed = entries.filter((entry) => entry.completed).length;
  return Math.round((completed / entries.length) * 100);
}

export function sortHabits(habits, sortKey) {
  const copy = [...habits];
  if (sortKey === "name") {
    return copy.sort((a, b) => a.name.localeCompare(b.name));
  }
  if (sortKey === "streak") {
    return copy.sort((a, b) => b.streak - a.streak);
  }
  return copy.sort((a, b) => b.completionRate - a.completionRate);
}

export function filterHabitsByCategory(habits, category) {
  if (!category || category === "all") return habits;
  return habits.filter((habit) => habit.category === category);
}

export const HABIT_CATEGORIES = [
  { value: "fitness", label: "Fitness" },
  { value: "nutrition", label: "Nutrition" },
  { value: "mindfulness", label: "Mindfulness" },
  { value: "sleep", label: "Sleep" },
  { value: "productivity", label: "Productivity" },
  { value: "social", label: "Social" },
];

export const MOOD_OPTIONS = [
  { value: "great", label: "Great" },
  { value: "good", label: "Good" },
  { value: "okay", label: "Okay" },
  { value: "low", label: "Low" },
  { value: "stressed", label: "Stressed" },
];

export const HABIT_FREQUENCIES = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "custom", label: "Custom" },
];

export function getCategoryLabel(value) {
  return HABIT_CATEGORIES.find((category) => category.value === value)?.label || value;
}

export function getMoodLabel(value) {
  if (!value) return "—";
  return MOOD_OPTIONS.find((mood) => mood.value === value)?.label || value;
}

export function getFrequencyLabel(value) {
  return HABIT_FREQUENCIES.find((frequency) => frequency.value === value)?.label || value;
}
