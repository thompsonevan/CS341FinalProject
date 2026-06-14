import db from "../config/database.js";
import {
  sanitizeBoolean,
  sanitizeDate,
  sanitizeInteger,
  sanitizeText,
} from "../utils/sanitize.js";
import { validateEntryPayload } from "../utils/validators.js";

function mapEntry(row) {
  return {
    id: row.id,
    habitId: row.habit_id,
    entryDate: row.entry_date,
    completed: row.completed === 1,
    durationMinutes: row.duration_minutes,
    mood: row.mood,
    notes: row.notes,
    createdAt: row.created_at,
    habitName: row.habit_name,
    habitCategory: row.habit_category,
  };
}

function habitBelongsToUser(habitId, userId) {
  const habit = db.prepare("SELECT id FROM habits WHERE id = ? AND user_id = ?").get(habitId, userId);
  return Boolean(habit);
}

export function getEntries(req, res) {
  const { habitId, from, to } = req.query;
  let query = `
    SELECT e.*, h.name AS habit_name, h.category AS habit_category
    FROM habit_entries e
    INNER JOIN habits h ON h.id = e.habit_id
    WHERE h.user_id = ?
  `;
  const params = [req.user.id];

  if (habitId) {
    query += " AND e.habit_id = ?";
    params.push(sanitizeInteger(habitId, 0, 1));
  }

  if (from) {
    query += " AND e.entry_date >= ?";
    params.push(sanitizeDate(from));
  }

  if (to) {
    query += " AND e.entry_date <= ?";
    params.push(sanitizeDate(to));
  }

  query += " ORDER BY e.entry_date DESC";

  const entries = db.prepare(query).all(...params).map(mapEntry);
  return res.json({ entries });
}

export function createEntry(req, res) {
  const habitId = sanitizeInteger(req.body.habitId, 0, 1);
  const payload = {
    entryDate: sanitizeDate(req.body.entryDate),
    completed: sanitizeBoolean(req.body.completed),
    durationMinutes: sanitizeInteger(req.body.durationMinutes, 0, 0, 1440),
    mood: sanitizeText(req.body.mood, 20),
    notes: sanitizeText(req.body.notes, 500),
  };

  if (!habitBelongsToUser(habitId, req.user.id)) {
    return res.status(404).json({ error: "Habit not found." });
  }

  const errors = validateEntryPayload(payload);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const result = db
      .prepare(
        `INSERT INTO habit_entries (habit_id, entry_date, completed, duration_minutes, mood, notes)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(
        habitId,
        payload.entryDate,
        payload.completed ? 1 : 0,
        payload.durationMinutes,
        payload.mood || null,
        payload.notes || null
      );

    const entry = db
      .prepare(
        `SELECT e.*, h.name AS habit_name, h.category AS habit_category
         FROM habit_entries e
         INNER JOIN habits h ON h.id = e.habit_id
         WHERE e.id = ?`
      )
      .get(result.lastInsertRowid);

    return res.status(201).json({ entry: mapEntry(entry) });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({ error: "An entry already exists for this date." });
    }
    throw error;
  }
}

export function updateEntry(req, res) {
  const entryId = sanitizeInteger(req.params.id, 0, 1);
  const existing = db
    .prepare(
      `SELECT e.*, h.user_id
       FROM habit_entries e
       INNER JOIN habits h ON h.id = e.habit_id
       WHERE e.id = ? AND h.user_id = ?`
    )
    .get(entryId, req.user.id);

  if (!existing) {
    return res.status(404).json({ error: "Entry not found." });
  }

  const payload = {
    entryDate: req.body.entryDate !== undefined ? sanitizeDate(req.body.entryDate) : existing.entry_date,
    completed:
      req.body.completed !== undefined ? sanitizeBoolean(req.body.completed) : existing.completed === 1,
    durationMinutes:
      req.body.durationMinutes !== undefined
        ? sanitizeInteger(req.body.durationMinutes, existing.duration_minutes, 0, 1440)
        : existing.duration_minutes,
    mood: req.body.mood !== undefined ? sanitizeText(req.body.mood, 20) : existing.mood,
    notes: req.body.notes !== undefined ? sanitizeText(req.body.notes, 500) : existing.notes,
  };

  const errors = validateEntryPayload(payload, true);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  db.prepare(
    `UPDATE habit_entries
     SET entry_date = ?, completed = ?, duration_minutes = ?, mood = ?, notes = ?
     WHERE id = ?`
  ).run(
    payload.entryDate,
    payload.completed ? 1 : 0,
    payload.durationMinutes,
    payload.mood || null,
    payload.notes || null,
    entryId
  );

  const entry = db
    .prepare(
      `SELECT e.*, h.name AS habit_name, h.category AS habit_category
       FROM habit_entries e
       INNER JOIN habits h ON h.id = e.habit_id
       WHERE e.id = ?`
    )
    .get(entryId);

  return res.json({ entry: mapEntry(entry) });
}

export function deleteEntry(req, res) {
  const entryId = sanitizeInteger(req.params.id, 0, 1);
  const result = db
    .prepare(
      `DELETE FROM habit_entries
       WHERE id = ? AND habit_id IN (SELECT id FROM habits WHERE user_id = ?)`
    )
    .run(entryId, req.user.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Entry not found." });
  }

  return res.json({ message: "Entry deleted successfully." });
}
