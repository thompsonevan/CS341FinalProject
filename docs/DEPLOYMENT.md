# Deployment Guide

This guide covers deploying WellTrack to production using Vercel (front-end) and Render (back-end).

## Back-End Deployment (Render)

1. Push the project to GitHub.
2. Create a new **Web Service** on Render pointing to the `server/` directory.
3. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add environment variables:
   - `PORT=10000` (or Render default)
   - `JWT_SECRET=<long-random-secret>`
   - `DATABASE_PATH=./data/welltrack.db`
   - `CLIENT_URL=https://your-vercel-app.vercel.app`
   - `NODE_ENV=production`
5. Deploy and copy the service URL (example: `https://welltrack-api.onrender.com`).

### Render notes

- SQLite works for demos and class projects. For long-term production, migrate to PostgreSQL.
- Render free tier may sleep after inactivity; first request may be slow.

## Front-End Deployment (Vercel)

1. Import the GitHub repository into Vercel.
2. Set root directory to `client/`.
3. Framework preset: **Vite**
4. Add environment variable:
   - `VITE_API_BASE_URL=https://welltrack-api.onrender.com`
5. Deploy and copy the live URL.

## Post-Deployment Checklist

- [ ] Register a new account on the live app
- [ ] Create a habit and log an entry
- [ ] Confirm protected routes redirect when logged out
- [ ] Update `README.md` deployment links table
- [ ] Capture screenshots for submission

## Analytics Setup

### Vercel Analytics

1. Open your Vercel project settings.
2. Enable Analytics.
3. Install package in `client/`:

```bash
npm install @vercel/analytics
```

4. Add to `client/src/main.jsx`:

```js
import { inject } from "@vercel/analytics";
inject();
```

### Google Analytics (alternative)

Add the GA script tag to `client/index.html` inside `<head>` using your measurement ID.

## GitHub Repository

Initialize version control and push with meaningful commits:

```bash
git init
git add .
git commit -m "Initial WellTrack full-stack implementation"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/welltrack.git
git push -u origin main
```

## Screenshots for Submission

Save these views into `screenshots/`:

1. `home.png` — landing page with image and video
2. `dashboard.png` — stats, table, and canvas chart
3. `habits.png` — habit form and filtered table
4. `log-entry.png` — entry logging form
5. `login.png` — authentication page

## Items You Must Complete Manually

- Create GitHub repository and push code
- Deploy front-end and back-end with your own accounts
- Add analytics in the hosting dashboard
- Capture screenshots
- Create pitch slides and record presentation (not included in this build)
