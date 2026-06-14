import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { registerUser } from "../api/welltrackApi";
import { useAuth } from "../context/AuthContext";
import { sanitizeInput, validateEmail, validatePassword } from "../utils/wellness";

export default function Register() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState("");

  if (loading) {
    return <p className="status-message">Checking your session...</p>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      name: sanitizeInput(form.name, 80),
      email: sanitizeInput(form.email, 120).toLowerCase(),
      password: form.password,
    };

    const nextErrors = [];
    if (!payload.name) nextErrors.push("Name is required.");
    if (!validateEmail(payload.email)) nextErrors.push("Enter a valid email address.");
    if (!validatePassword(payload.password)) nextErrors.push("Password must be at least 8 characters.");

    setErrors(nextErrors);
    if (nextErrors.length > 0) return;

    try {
      await registerUser(payload);
      setMessage("Account created successfully. You can log in now.");
      setTimeout(() => navigate("/login"), 900);
    } catch (error) {
      setErrors([error.message]);
    }
  };

  return (
    <main className="page narrow-page">
      <section className="card auth-card">
        <h1>Create your WellTrack account</h1>
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="name">Full Name</label>
          <input id="name" name="name" type="text" value={form.name} onChange={handleChange} required />

          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {errors.length > 0 && (
            <ul className="error-list" role="alert">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          )}
          {message && <p className="success-message">{message}</p>}

          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </form>
        <p>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </section>
    </main>
  );
}
