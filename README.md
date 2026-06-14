# WellTrack — Habit-Tracking Wellness App

**CS Web Design Shark Tank Final Project**

WellTrack is a full-stack wellness application that helps users build and maintain healthy habits. Users can register, create habits across wellness categories, log daily entries with mood tracking, and review streaks and completion rates on a personalized dashboard.

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

## Project Structure

```
FinalProject/
├── client/          # React front-end
├── server/          # Express API + SQLite database
├── docs/            # API documentation, ERD, deployment notes
├── screenshots/     # Place app screenshots here before submission
└── README.md
```

## Local Setup

### Prerequisites

- Node.js 18+
- npm

### 1. Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### 2. Configure environment variables

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

### 3. Seed demo data (optional)

```bash
cd server
npm run seed
```

Demo login: `demo@welltrack.app` / `demo12345`

### 4. Run the application

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

Open `http://localhost:5173`

## Running Tests

```bash
# Front-end unit tests (5 tests)
cd client
npm test

# API tests (2 tests)
cd ../server
npm test
```

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

## Deployment

> **Action required:** Deployment must be completed with your own accounts.

Recommended setup:

1. **Back-end:** Deploy `server/` to [Render](https://render.com) or [Railway](https://railway.app)
2. **Front-end:** Deploy `client/` to [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
3. Set production environment variables on both platforms
4. Update `CLIENT_URL` on the server to match your deployed front-end URL
5. Update `VITE_API_BASE_URL` on the client to match your deployed API URL

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for step-by-step instructions.

### Deployment Links (fill in after deploying)

| Service | URL |
|---------|-----|
| Live App | `https://YOUR-FRONTEND-URL` |
| API | `https://YOUR-API-URL` |
| GitHub Repo | `https://github.com/YOUR-USERNAME/welltrack` |

## Analytics

Add [Vercel Analytics](https://vercel.com/docs/analytics) or Google Analytics after front-end deployment. See `docs/DEPLOYMENT.md`.

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

Pitch slides and live presentation are not included in this build per project scope. Screenshots should be captured after running the app locally or from the deployed version.
