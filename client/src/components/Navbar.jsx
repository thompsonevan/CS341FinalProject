import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout, theme, toggleTheme } = useAuth();

  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Primary navigation">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="brand">
          <img src="/favicon.svg" alt="" width="32" height="32" />
          <span>WellTrack</span>
        </Link>

        <ul className="nav-links">
          {!isAuthenticated && (
            <li>
              <NavLink to="/" end>
                Home
              </NavLink>
            </li>
          )}
          {isAuthenticated ? (
            <>
              <li>
                <NavLink to="/dashboard">Dashboard</NavLink>
              </li>
              <li>
                <NavLink to="/habits">Habits</NavLink>
              </li>
              <li>
                <NavLink to="/log">Log Entry</NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login">Login</NavLink>
              </li>
              <li>
                <NavLink to="/register">Register</NavLink>
              </li>
            </>
          )}
        </ul>

        <div className="nav-actions">
          <button type="button" className="btn btn-secondary" onClick={toggleTheme}>
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
          {isAuthenticated && (
            <>
              <span className="user-chip">Hi, {user.name}</span>
              <button type="button" className="btn btn-outline" onClick={logout}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
