import { useEffect, useState } from "react";
import { getEntries, getWellnessSummary } from "../api/welltrackApi";
import { useAuth } from "../context/AuthContext";
import StreakCanvas from "../components/StreakCanvas";

export default function Dashboard() {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [summaryData, entryData] = await Promise.all([
          getWellnessSummary(token),
          getEntries(token),
        ]);
        setSummary(summaryData.summary);
        setEntries(entryData.entries);
      } catch (loadError) {
        setError(loadError.message);
      }
    }

    loadDashboard();
  }, [token]);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!summary) {
    return <p className="status-message">Loading your wellness dashboard...</p>;
  }

  return (
    <main className="page">
      <section className="page-header">
        <h1>Wellness Dashboard</h1>
        <p>Your daily habits, streak momentum, and recent check-ins in one place.</p>
      </section>

      <section className="stats-grid">
        <article className="card stat-card">
          <h2>{summary.totalHabits}</h2>
          <p>Active Habits</p>
        </article>
        <article className="card stat-card">
          <h2>{summary.averageCompletion}%</h2>
          <p>Average Completion</p>
        </article>
        <article className="card stat-card">
          <h2>{summary.bestStreak}</h2>
          <p>Best Current Streak</p>
        </article>
      </section>

      <section className="dashboard-grid">
        <StreakCanvas habits={summary.habits} />

        <article className="card">
          <h3>Recent Entries</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Habit</th>
                  <th>Status</th>
                  <th>Mood</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {entries.slice(0, 8).map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.entryDate}</td>
                    <td>{entry.habitName}</td>
                    <td>{entry.completed ? "Completed" : "Missed"}</td>
                    <td>{entry.mood || "—"}</td>
                    <td>{entry.durationMinutes ? `${entry.durationMinutes} min` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </main>
  );
}
