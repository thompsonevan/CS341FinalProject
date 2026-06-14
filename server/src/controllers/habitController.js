import db from "../config/database.js";
import { sanitizeInteger, sanitizeText } from "../utils/sanitize.js";
import { validateHabitPayload } from "../utils/validators.js";

function mapHabit(row) {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    category: row.category,
    frequency: row.frequency,
    targetDays: row.target_days,
    color: row.color,
    description: row.description,
    createdAt: row.created_at,
    completionRate: row.completion_rate ?? 0,
    streak: row.streak ?? 0,
  };
}

function getHabitStats(habitId) {
  const entries = db
    .prepare(
      `SELECT entry_date, completed
       FROM habit_entries
       WHERE habit_id = ?
       ORDER BY entry_date DESC`
    )
    .all(habitId);

  const completedCount = entries.filter((entry) => entry.completed === 1).length;
  const completionRate = entries.length > 0 ? Math.round((completedCount / entries.length) * 100) : 0;

  let streak = 0;
  for (const entry of entries) {
    if (entry.completed === 1) {
      streak += 1;
    } else {
      break;
    }
  }

  return { completionRate, streak };
}

export function getHabits(req, res) {
  const { category, sort } = req.query;
  let query = `
    SELECT h.*
    FROM habits h
    WHERE h.user_id = ?
  `;
  const params = [req.user.id];

  if (category && category !== "all") {
    query += " AND h.category = ?";
    params.push(sanitizeText(category, 30));
  }

  if (sort === "name") {
    query += " ORDER BY h.name ASC";
  } else if (sort === "category") {
    query += " ORDER BY h.category ASC, h.name ASC";
  } else {
    query += " ORDER BY h.created_at DESC";
  }

  const habits = db.prepare(query).all(...params).map((row) => {
    const stats = getHabitStats(row.id);
    return mapHabit({ ...row, ...stats });
  });

  return res.json({ habits });
}

export function createHabit(req, res) {
  const payload = {
    name: sanitizeText(req.body.name, 80),
    category: sanitizeText(req.body.category, 30),
    frequency: sanitizeText(req.body.frequency, 20),
    targetDays: sanitizeInteger(req.body.targetDays, 7, 1, 31),
    color: sanitizeText(req.body.color, 7) || "#4f46e5",
    description: sanitizeText(req.body.description, 500),
  };

  const errors = validateHabitPayload(payload);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const result = db
    .prepare(
      `INSERT INTO habits (user_id, name, category, frequency, target_days, color, description)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      req.user.id,
      payload.name,
      payload.category,
      payload.frequency,
      payload.targetDays,
      payload.color,
      payload.description
    );

  const habit = db.prepare("SELECT * FROM habits WHERE id = ?").get(result.lastInsertRowid);
  return res.status(201).json({ habit: mapHabit({ ...habit, completionRate: 0, streak: 0 }) });
}

export function updateHabit(req, res) {
  const habitId = sanitizeInteger(req.params.id, 0, 1);
  const existing = db
    .prepare("SELECT * FROM habits WHERE id = ? AND user_id = ?")
    .get(habitId, req.user.id);

  if (!existing) {
    return res.status(404).json({ error: "Habit not found." });
  }

  const payload = {
    name: req.body.name !== undefined ? sanitizeText(req.body.name, 80) : existing.name,
    category: req.body.category !== undefined ? sanitizeText(req.body.category, 30) : existing.category,
    frequency: req.body.frequency !== undefined ? sanitizeText(req.body.frequency, 20) : existing.frequency,
    targetDays:
      req.body.targetDays !== undefined
        ? sanitizeInteger(req.body.targetDays, existing.target_days, 1, 31)
        : existing.target_days,
    color: req.body.color !== undefined ? sanitizeText(req.body.color, 7) : existing.color,
    description:
      req.body.description !== undefined
        ? sanitizeText(req.body.description, 500)
        : existing.description,
  };

  const errors = validateHabitPayload(payload, true);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  db.prepare(
    `UPDATE habits
     SET name = ?, category = ?, frequency = ?, target_days = ?, color = ?, description = ?
     WHERE id = ? AND user_id = ?`
  ).run(
    payload.name,
    payload.category,
    payload.frequency,
    payload.targetDays,
    payload.color,
    payload.description,
    habitId,
    req.user.id
  );

  const habit = db.prepare("SELECT * FROM habits WHERE id = ?").get(habitId);
  const stats = getHabitStats(habitId);
  return res.json({ habit: mapHabit({ ...habit, ...stats }) });
}

export function deleteHabit(req, res) {
  const habitId = sanitizeInteger(req.params.id, 0, 1);
  const result = db
    .prepare("DELETE FROM habits WHERE id = ? AND user_id = ?")
    .run(habitId, req.user.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Habit not found." });
  }

  return res.json({ message: "Habit deleted successfully." });
}

export function getWellnessSummary(req, res) {
  const habits = db
    .prepare("SELECT id, name, category, color FROM habits WHERE user_id = ?")
    .all(req.user.id);

  const summary = habits.map((habit) => {
    const stats = getHabitStats(habit.id);
    return { ...habit, ...stats };
  });

  const totalHabits = summary.length;
  const averageCompletion =
    totalHabits > 0
      ? Math.round(summary.reduce((sum, item) => sum + item.completionRate, 0) / totalHabits)
      : 0;
  const bestStreak = summary.reduce((max, item) => Math.max(max, item.streak), 0);

  return res.json({
    summary: {
      totalHabits,
      averageCompletion,
      bestStreak,
      habits: summary,
    },
  });
}
