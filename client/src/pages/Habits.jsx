import { useEffect, useMemo, useState } from "react";
import { createHabit, deleteHabit, getHabits } from "../api/welltrackApi";
import { useAuth } from "../context/AuthContext";
import HabitForm from "../components/HabitForm";
import { filterHabitsByCategory, getCategoryLabel, getFrequencyLabel, HABIT_CATEGORIES, sortHabits } from "../utils/wellness";

export default function Habits() {
  const { token } = useAuth();
  const [habits, setHabits] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortKey, setSortKey] = useState("completion");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadHabits = async () => {
    try {
      const data = await getHabits(token);
      setHabits(data.habits);
    } catch (loadError) {
      setError(loadError.message);
    }
  };

  useEffect(() => {
    loadHabits();
  }, [token]);

  const visibleHabits = useMemo(() => {
    const filtered = filterHabitsByCategory(habits, categoryFilter);
    return sortHabits(filtered, sortKey);
  }, [habits, categoryFilter, sortKey]);

  const handleCreate = async (payload) => {
    try {
      await createHabit(token, payload);
      setMessage("Habit created successfully.");
      await loadHabits();
    } catch (createError) {
      setError(createError.message);
    }
  };

  const handleDelete = async (habit) => {
    const confirmed = window.confirm(
      `Delete "${habit.name}"? This will also remove all logged entries for this habit.`
    );
    if (!confirmed) return;

    try {
      await deleteHabit(token, habit.id);
      setMessage("Habit deleted.");
      await loadHabits();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  return (
    <main className="page">
      <section className="page-header">
        <h1>Habit Library</h1>
        <p>Filter, sort, and manage the routines that support your wellness goals.</p>
      </section>

      <section className="habits-layout">
        <HabitForm onSubmit={handleCreate} />

        <section className="card">
          <div className="toolbar">
            <label htmlFor="categoryFilter">Filter by category</label>
            <select
              id="categoryFilter"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              <option value="all">All categories</option>
              {HABIT_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            <label htmlFor="sortKey">Sort habits</label>
            <select id="sortKey" value={sortKey} onChange={(event) => setSortKey(event.target.value)}>
              <option value="completion">Completion rate</option>
              <option value="streak">Streak</option>
              <option value="name">Name</option>
            </select>
          </div>

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}

          {visibleHabits.length === 0 ? (
            <div className="empty-state">
              <p>{habits.length === 0 ? "No habits yet." : "No habits match this filter."}</p>
              <p>
                {habits.length === 0
                  ? "Use the form on the left to create your first wellness habit."
                  : "Try a different category or create a new habit."}
              </p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Habit</th>
                    <th>Category</th>
                    <th>Frequency</th>
                    <th>Completion</th>
                    <th>Streak</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleHabits.map((habit) => (
                    <tr key={habit.id}>
                      <td>
                        <span className="color-dot" style={{ backgroundColor: habit.color }}></span>
                        {habit.name}
                      </td>
                      <td>{getCategoryLabel(habit.category)}</td>
                      <td>{getFrequencyLabel(habit.frequency)}</td>
                      <td>{habit.completionRate}%</td>
                      <td>{habit.streak}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline"
                          onClick={() => handleDelete(habit)}
                          aria-label={`Delete ${habit.name}`}
                        >
                          Delete
                        </button>
                      </td>
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
