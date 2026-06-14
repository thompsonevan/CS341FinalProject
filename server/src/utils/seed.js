import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import db from "../config/database.js";

dotenv.config();

const demoEmail = "demo@welltrack.app";
const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(demoEmail);

if (!existing) {
  const passwordHash = bcrypt.hashSync("demo12345", 10);
  const userResult = db
    .prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)")
    .run("Demo User", demoEmail, passwordHash);

  const userId = userResult.lastInsertRowid;
  const habits = [
    ["Morning Walk", "fitness", "daily", 7, "#10b981", "20-minute neighborhood walk"],
    ["Drink Water", "nutrition", "daily", 7, "#3b82f6", "8 glasses throughout the day"],
    ["Meditation", "mindfulness", "daily", 5, "#8b5cf6", "10 minutes of guided breathing"],
  ];

  const insertHabit = db.prepare(
    `INSERT INTO habits (user_id, name, category, frequency, target_days, color, description)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );

  const habitIds = habits.map((habit) => insertHabit.run(userId, ...habit).lastInsertRowid);

  const insertEntry = db.prepare(
    `INSERT INTO habit_entries (habit_id, entry_date, completed, duration_minutes, mood, notes)
     VALUES (?, ?, ?, ?, ?, ?)`
  );

  const today = new Date();
  for (let offset = 0; offset < 7; offset += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    const entryDate = date.toISOString().slice(0, 10);

    habitIds.forEach((habitId, index) => {
      insertEntry.run(
        habitId,
        entryDate,
        offset < 5 ? 1 : 0,
        index === 0 ? 20 : index === 2 ? 10 : 0,
        offset < 3 ? "great" : "good",
        offset === 0 ? "Felt energized today." : null
      );
    });
  }

  console.log("Demo data seeded. Login with demo@welltrack.app / demo12345");
} else {
  console.log("Demo data already exists.");
}
