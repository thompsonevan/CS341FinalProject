# WellTrack API Documentation

Base URL (local): `http://localhost:5000`

All protected routes require:

```
Authorization: Bearer <JWT_TOKEN>
```

## Health

### `GET /api/health`

Returns API status.

**Response 200**

```json
{
  "status": "ok",
  "service": "WellTrack API"
}
```

## Authentication

### `POST /api/auth/register`

Create a new user account.

**Body**

```json
{
  "name": "Evan Smith",
  "email": "evan@example.com",
  "password": "password123"
}
```

**Response 201**

```json
{
  "message": "Registration successful.",
  "user": {
    "id": 1,
    "name": "Evan Smith",
    "email": "evan@example.com",
    "created_at": "2026-06-14T12:00:00.000Z"
  }
}
```

### `POST /api/auth/login`

Authenticate and receive a JWT.

**Body**

```json
{
  "email": "evan@example.com",
  "password": "password123"
}
```

**Response 200**

```json
{
  "token": "jwt-token",
  "user": {
    "id": 1,
    "name": "Evan Smith",
    "email": "evan@example.com",
    "createdAt": "2026-06-14T12:00:00.000Z"
  }
}
```

### `GET /api/auth/profile`

Protected route returning the current user profile.

## Habits

### `GET /api/habits`

List habits for the authenticated user.

**Query params**

- `category` (optional): filter by category
- `sort` (optional): `name`, `category`, or default `created_at`

**Response 200**

```json
{
  "habits": [
    {
      "id": 1,
      "userId": 1,
      "name": "Morning Walk",
      "category": "fitness",
      "frequency": "daily",
      "targetDays": 7,
      "color": "#10b981",
      "description": "20-minute walk",
      "createdAt": "2026-06-14T12:00:00.000Z",
      "completionRate": 85,
      "streak": 4
    }
  ]
}
```

### `GET /api/habits/summary`

Returns dashboard wellness summary metrics.

### `POST /api/habits`

Create a habit.

**Body**

```json
{
  "name": "Morning Walk",
  "category": "fitness",
  "frequency": "daily",
  "targetDays": 7,
  "color": "#10b981",
  "description": "Optional description"
}
```

### `PUT /api/habits/:id`

Update an existing habit.

### `DELETE /api/habits/:id`

Delete a habit and its related entries.

## Entries

### `GET /api/entries`

List habit entries for the authenticated user.

**Query params**

- `habitId` (optional)
- `from` (optional ISO date)
- `to` (optional ISO date)

### `POST /api/entries`

Create a daily habit entry.

**Body**

```json
{
  "habitId": 1,
  "entryDate": "2026-06-14",
  "completed": true,
  "durationMinutes": 20,
  "mood": "great",
  "notes": "Felt energized"
}
```

### `PATCH /api/entries/:id`

Update an existing entry.

### `DELETE /api/entries/:id`

Delete an entry.

## Error Format

Validation and business errors return JSON:

```json
{
  "errors": ["Habit name must be at least 2 characters."]
}
```

or

```json
{
  "error": "Authentication required."
}
```

## Security Notes

- Passwords are hashed with bcrypt before storage.
- User input is sanitized on both client and server.
- Secrets are loaded from `.env` and never committed to source control.
