# WellTrack — Habit-Tracking Wellness App

**CS Web Design Shark Tank Final Project**

WellTrack is a full-stack wellness application that helps users build and maintain healthy habits. Users can register, create habits across wellness categories, log daily entries with mood tracking, and review streaks and completion rates on a personalized dashboard.

## Live Links

| Service | URL |
|---------|-----|
| Live App | [cs-341-final-project.vercel.app](https://cs-341-final-project.vercel.app/) |
| API | [welltrack-api-ta8b.onrender.com](https://welltrack-api-ta8b.onrender.com) |
| GitHub Repo | [github.com/thompsonevan/CS341FinalProject](https://github.com/thompsonevan/CS341FinalProject) |

## Product Concept

**Problem:** Many people struggle to stay consistent with wellness routines because progress is hard to see and motivation fades without feedback.

**Solution:** WellTrack turns habit-building into a visual, data-driven experience with streak tracking, mood logging, filtering/sorting tools, and a canvas-based progress chart.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Front-end | React 19, Vite, React Router, CSS Grid/Flexbox |
| Back-end | Node.js, Express 5 |
| Database | SQLite (`better-sqlite3`) |
| Auth | JWT + bcrypt password hashing |
| Testing | Vitest (client), Node test runner + Supertest (server) |
| Hosting | Vercel (front-end), Render (back-end) |
| Analytics | Vercel Analytics |

## Project Structure

```
FinalProject/
├── client/              # React front-end (Vercel root)
│   ├── src/
│   ├── public/
│   ├── tests/
│   └── vercel.json      # SPA routing for React Router
├── server/              # Express API (Render root)
│   ├── src/
│   └── tests/
├── docs/                # API docs, ERD, deployment guide
├── screenshots/         # App screenshots for submission
└── README.md
```

## Local Setup

### Prerequisites

- Node.js 18+
- npm

### 1. Clone the repository

```bash
git clone https://github.com/thompsonevan/CS341FinalProject.git
cd CS341FinalProject
```

### 2. Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### 3. Configure environment variables

Copy the example files and edit as needed:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

**Server** (`server/.env`):

```
PORT=5000
JWT_SECRET=your-long-random-secret
DATABASE_PATH=./data/welltrack.db
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Client** (`client/.env`):

```
VITE_API_BASE_URL=http://localhost:5000
```

### 4. Seed demo data (optional)

```bash
cd server
npm run seed
```

Demo login: `demo@welltrack.app` / `demo12345`

### 5. Run the application

Terminal 1 (API):

```bash
cd server
npm run dev
```

Terminal 2 (client):

```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Running Tests

```bash
# Front-end unit tests (5 tests)
cd client
npm test

# API tests (2 tests)
cd ../server
npm test
```

## Deployment (Vercel + Render)

### Back-end on Render

1. Create a new **Web Service** connected to this GitHub repo.
2. Set **Root Directory** to `server`.
3. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add environment variables:

| Variable | Value |
|----------|-------|
| `JWT_SECRET` | Long random secret string |
| `DATABASE_PATH` | `./data/welltrack.db` |
| `CLIENT_URL` | `https://cs-341-final-project.vercel.app` |
| `NODE_ENV` | `production` |

5. Deploy and verify: [welltrack-api-ta8b.onrender.com/api/health](https://welltrack-api-ta8b.onrender.com/api/health)

### Front-end on Vercel

1. Import this GitHub repo into Vercel.
2. Set **Root Directory** to `client`.
3. Framework preset: **Vite**
4. Add environment variable:

| Variable | Value |
|----------|-------|
| `VITE_API_BASE_URL` | `https://welltrack-api-ta8b.onrender.com` |

5. Deploy. The included `client/vercel.json` handles React Router SPA routing.

### After both are deployed

1. Set Render's `CLIENT_URL` to `https://cs-341-final-project.vercel.app` (required for CORS).
2. Redeploy if you change `VITE_API_BASE_URL` — Vite bakes env vars in at build time.

Full walkthrough: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

## Feature Checklist (Rubric Alignment)

- Semantic HTML5 layout with `header`, `nav`, `main`, `section`, `article`, `footer`
- Interactive forms with text, dropdown, radio, checkbox, validation
- Styled data tables on Dashboard, Habits, and Log Entry pages
- Image + video on Home page, canvas streak chart on Dashboard
- Responsive CSS with design tokens, Flexbox/Grid, and media queries
- React state (`useState`), Context API auth state, `localStorage` persistence
- Express API with GET/POST/PUT/PATCH/DELETE routes
- SQLite with `users`, `habits`, and `habit_entries` tables + full CRUD
- Client/server input sanitization, JWT auth, bcrypt hashing, protected routes
- `.env` configuration for secrets and API URLs
- Vercel Analytics integrated in `client/src/main.jsx`

## Documentation Packet

- [API Documentation](docs/API.md)
- [Entity Relationship Diagram](docs/ERD.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- Screenshots: add PNG files to `screenshots/` before submission

## Submission ZIP

Create: `SharkTank_FinalProject_YourLastName.zip`

Include:

- `client/` and `server/` source code
- `docs/` and `screenshots/`
- `README.md` with deployment link
- Test files

## Author Notes

Pitch slides and live presentation are prepared separately. Screenshots should be captured from the deployed version after both Vercel and Render are live.

**Render free tier note:** The API may sleep after inactivity. The first request after sleep can take 30–60 seconds to respond.
