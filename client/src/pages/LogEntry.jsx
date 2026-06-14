import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createEntry, getEntries, getHabits } from "../api/welltrackApi";
import { useAuth } from "../context/AuthContext";
import { getMoodLabel, MOOD_OPTIONS, sanitizeInput } from "../utils/wellness";

export default function LogEntry() {
  const { token } = useAuth();
  const [habits, setHabits] = useState([]);
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    habitId: "",
    entryDate: new Date().toISOString().slice(0, 10),
    completed: true,
    durationMinutes: 15,
    mood: "good",
    notes: "",
  });
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    const [habitData, entryData] = await Promise.all([getHabits(token), getEntries(token)]);
    setHabits(habitData.habits);
    setEntries(entryData.entries);
    if (!form.habitId && habitData.habits[0]) {
      setForm((current) => ({ ...current, habitId: String(habitData.habits[0].id) }));
    }
  };

  useEffect(() => {
    loadData().catch((error) => setErrors([error.message]));
  }, [token]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = [];
    if (!form.habitId) nextErrors.push("Select a habit.");
    if (!form.entryDate) nextErrors.push("Entry date is required.");

    setErrors(nextErrors);
    if (nextErrors.length > 0) return;

    try {
      await createEntry(token, {
        habitId: Number(form.habitId),
        entryDate: form.entryDate,
        completed: form.completed,
        durationMinutes: Number(form.durationMinutes),
        mood: form.mood,
        notes: sanitizeInput(form.notes, 500),
      });
      setMessage("Entry logged successfully.");
      await loadData();
    } catch (submitError) {
      setErrors([submitError.message]);
    }
  };

  return (
    <main className="page">
      <section className="page-header">
        <h1>Log a Wellness Entry</h1>
        <p>Record completion, mood, and notes to keep your habit history meaningful.</p>
      </section>

      <section className="log-layout">
        {habits.length === 0 ? (
          <section className="card form-card">
            <div className="empty-state">
              <p>You need at least one habit before logging entries.</p>
              <Link className="btn btn-primary" to="/habits">
                Create a habit
              </Link>
            </div>
          </section>
        ) : (
          <form className="card form-card" onSubmit={handleSubmit} noValidate>
          <label htmlFor="habitId">Habit</label>
          <select id="habitId" name="habitId" value={form.habitId} onChange={handleChange} required>
            <option value="">Select a habit</option>
            {habits.map((habit) => (
              <option key={habit.id} value={habit.id}>
                {habit.name}
              </option>
            ))}
          </select>

          <label htmlFor="entryDate">Entry Date</label>
          <input
            id="entryDate"
            name="entryDate"
            type="date"
            value={form.entryDate}
            onChange={handleChange}
            required
          />

          <label className="checkbox-row">
            <input
              type="checkbox"
              name="completed"
              checked={form.completed}
              onChange={handleChange}
            />
            Mark as completed
          </label>

          <label htmlFor="durationMinutes">Duration (minutes)</label>
          <input
            id="durationMinutes"
            name="durationMinutes"
            type="number"
            min="0"
            max="1440"
            value={form.durationMinutes}
            onChange={handleChange}
          />

          <fieldset>
            <legend>Mood</legend>
            {MOOD_OPTIONS.map((mood) => (
              <label key={mood.value}>
                <input
                  type="radio"
                  name="mood"
                  value={mood.value}
                  checked={form.mood === mood.value}
                  onChange={handleChange}
                />
                {mood.label}
              </label>
            ))}
          </fieldset>

          <label htmlFor="notes">Notes</label>
          <textarea id="notes" name="notes" rows="4" value={form.notes} onChange={handleChange} />

          {errors.length > 0 && (
            <ul className="error-list" role="alert">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          )}
          {message && <p className="success-message">{message}</p>}

          <button type="submit" className="btn btn-primary">
            Save Entry
          </button>
        </form>
        )}

        <section className="card">
          <h3>Entry History</h3>
          {entries.length === 0 ? (
            <div className="empty-state">
              <p>No entry history yet.</p>
              <p>Your logged check-ins will appear here.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Habit</th>
                    <th>Completed</th>
                    <th>Mood</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id}>
                      <td>{entry.entryDate}</td>
                      <td>{entry.habitName}</td>
                      <td>{entry.completed ? "Yes" : "No"}</td>
                      <td>{getMoodLabel(entry.mood)}</td>
                      <td>{entry.notes || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
