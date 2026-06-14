import { describe, expect, it } from "vitest";
import {
  calculateCompletionRate,
  filterHabitsByCategory,
  sanitizeInput,
  sortHabits,
  validateEmail,
  validatePassword,
} from "../src/utils/wellness.js";

describe("wellness utilities", () => {
  it("sanitizes unsafe characters from input", () => {
    expect(sanitizeInput("  hello <script>  ", 20)).toBe("hello script");
  });

  it("validates email addresses", () => {
    expect(validateEmail("user@example.com")).toBe(true);
    expect(validateEmail("invalid-email")).toBe(false);
  });

  it("validates password length", () => {
    expect(validatePassword("password123")).toBe(true);
    expect(validatePassword("short")).toBe(false);
  });

  it("calculates completion rate from entries", () => {
    const entries = [
      { completed: true },
      { completed: false },
      { completed: true },
      { completed: true },
    ];
    expect(calculateCompletionRate(entries)).toBe(75);
  });

  it("filters and sorts habits", () => {
    const habits = [
      { name: "Walk", category: "fitness", streak: 2, completionRate: 80 },
      { name: "Read", category: "productivity", streak: 5, completionRate: 60 },
      { name: "Meditate", category: "mindfulness", streak: 3, completionRate: 90 },
    ];

    const filtered = filterHabitsByCategory(habits, "fitness");
    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe("Walk");

    const sorted = sortHabits(habits, "streak");
    expect(sorted[0].name).toBe("Read");
  });
});
