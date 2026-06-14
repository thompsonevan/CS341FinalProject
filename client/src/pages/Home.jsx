import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <p className="status-message">Checking your session...</p>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="page">
      <section className="hero">
        <article className="hero-copy">
          <p className="eyebrow">Habit-Tracking Wellness App</p>
          <h1>Build healthier routines with WellTrack</h1>
          <p>
            WellTrack helps students and busy professionals turn small daily actions into lasting
            wellness habits through streak tracking, mood logging, and personalized insights.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/register">
              Start Free
            </Link>
            <Link className="btn btn-outline" to="/login">
              Sign In
            </Link>
          </div>
        </article>

        <aside className="hero-media">
          <img
            src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=80"
            alt="Person stretching during a morning wellness routine"
            loading="lazy"
          />
          <video controls muted poster="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80">
            <source
              src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
              type="video/mp4"
            />
            Your browser does not support embedded video.
          </video>
        </aside>
      </section>

      <section className="feature-grid">
        <article className="card">
          <h2>Track What Matters</h2>
          <p>Create habits across fitness, nutrition, mindfulness, sleep, and productivity.</p>
        </article>
        <article className="card">
          <h2>See Your Progress</h2>
          <p>Review completion rates, streaks, and mood trends in a responsive dashboard.</p>
        </article>
        <article className="card">
          <h2>Stay Consistent</h2>
          <p>Log daily entries, filter your history, and celebrate momentum over perfection.</p>
        </article>
      </section>
    </main>
  );
}
