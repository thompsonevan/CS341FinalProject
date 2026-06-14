import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/database.js";
import { sanitizeEmail, sanitizeText } from "../utils/sanitize.js";
import { validateRegistration } from "../utils/validators.js";

export function register(req, res) {
  const name = sanitizeText(req.body.name, 80);
  const email = sanitizeEmail(req.body.email);
  const password = typeof req.body.password === "string" ? req.body.password : "";

  const errors = validateRegistration({ name, email, password });
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    return res.status(409).json({ error: "An account with this email already exists." });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const result = db
    .prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)")
    .run(name, email, passwordHash);

  const user = db.prepare("SELECT id, name, email, created_at FROM users WHERE id = ?").get(result.lastInsertRowid);

  return res.status(201).json({
    message: "Registration successful.",
    user,
  });
}

export function login(req, res) {
  const email = sanitizeEmail(req.body.email);
  const password = typeof req.body.password === "string" ? req.body.password : "";

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.created_at,
    },
  });
}

export function getProfile(req, res) {
  const user = db
    .prepare("SELECT id, name, email, created_at AS createdAt FROM users WHERE id = ?")
    .get(req.user.id);

  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  return res.json({ user });
}
