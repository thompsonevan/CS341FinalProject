import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import habitRoutes from "./routes/habitRoutes.js";
import entryRoutes from "./routes/entryRoutes.js";
import "./config/database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/+$/, "");
const isDev = process.env.NODE_ENV !== "production";

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (isDev && /^http:\/\/localhost:\d+$/.test(origin)) {
        callback(null, true);
        return;
      }

      if (origin === clientUrl) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "WellTrack API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/entries", entryRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error." });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`WellTrack API running on http://localhost:${PORT}`);
  });
}

export default app;
