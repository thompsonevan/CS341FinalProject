import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/welltrackApi";
import { useAuth } from "../context/AuthContext";
import { sanitizeInput, validateEmail } from "../utils/wellness";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = sanitizeInput(form.email, 120).toLowerCase();

    if (!validateEmail(email) || !form.password) {
      setError("Enter a valid email and password.");
      return;
    }

    try {
      const data = await loginUser({ email, password: form.password });
      login(data.token, data.user);
      navigate("/dashboard");
    } catch (loginError) {
      setError(loginError.message);
    }
  };

  return (
    <main className="page narrow-page">
      <section className="card auth-card">
        <h1>Welcome back</h1>
        <p className="card-copy">Demo account: demo@welltrack.app / demo12345</p>
        <form onSubmit={handleSubmit} noValidate>
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

          {error && <p className="error-message" role="alert">{error}</p>}

          <button type="submit" className="btn btn-primary">
            Log In
          </button>
        </form>
        <p>
          Need an account? <Link to="/register">Register</Link>
        </p>
      </section>
    </main>
  );
}
