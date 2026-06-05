# Habit Tracker

> Capstone project · Team of 6

A web app that helps you build good habits. Track daily routines like Water intake, Gym, Reading, and Coding practice. Sign in to keep your habit list separate from your teammates', see your streaks grow on a calendar, and stay motivated with a daily quote.

## Features

- Sign in or register an account (handled by the backend)
- Each user gets their own habit list — no sharing between accounts
- Add, complete, and delete habits
- 4 one-click presets: Water intake, Gym, Reading, Coding practice
- Daily current streak and personal-best longest streak
- Month calendar coloured by completion (green = all done, yellow = some, blue border = today)
- Today's progress percentage and total completions
- Motivational quote that changes each day
- Habit data is saved in the browser, so it stays after a refresh
- Works on phone, tablet, and desktop

## Tech stack

- **Frontend:** React 19 + Vite, plain CSS, `localStorage` for habit persistence
- **Backend:** Node.js + Express + CORS — handles register / login and serves quotes (no database; users live in memory for this demo)

## How to run

You need [Node.js](https://nodejs.org/) v18 or newer.

```bash
git clone https://github.com/Jonathon10/HABIT_TRACKER.git
cd HABIT_TRACKER

# Install dependencies (one time)
npm install
cd backend && npm install && cd ..
```

Then run the app in **two terminals**:

```bash
# Terminal 1 — frontend
npm run dev          # opens http://localhost:5173

# Terminal 2 — backend
cd backend
npm start            # listens on http://localhost:5000
```

Open `http://localhost:5173`, click **Register**, create an account, and you're in.

## Project structure

```
HABIT_TRACKER/
├── index.html              # Vite entry point
├── package.json            # Frontend deps
├── vite.config.js
├── src/                    # FRONTEND
│   ├── main.jsx
│   ├── App.jsx             # Auth gate + habit tracker
│   ├── App.css
│   ├── SignIn.jsx          # Sign in / Register page
│   ├── SignIn.css
│   └── index.css
└── backend/                # BACKEND
    ├── server.js           # Express server + API routes
    └── package.json
```

## Backend API

| Method | Route | Description |
|---|---|---|
| GET | `/` | Health check |
| POST | `/api/register` | Create a new account. Body: `{ email, password }` |
| POST | `/api/login` | Sign in to an existing account. Body: `{ email, password }` |
| GET | `/api/quotes` | All motivational quotes |
| GET | `/api/quote/today` | Today's quote |

## Who built what

The `src/App.jsx` file is split into sections so each member presents their own part.

| Member | What they own | Where in the code |
|---|---|---|
| Member 1 | State + save/load | `useState` + `useEffect` for localStorage |
| Member 2 | Date + daily quote | `todayDayNumber` + `todayQuote` |
| Member 3 | Add / delete habits | `addHabit`, `addPreset`, `deleteHabit` |
| Member 4 | Mark done + streak math | `toggleHabit`, `calculateCurrentStreak`, `calculateLongestStreak` |
| Member 5 | Calendar view | The `cells` loop + calendar rendering |
| Member 6 | Stats + habit list + sign-in | `todayPercent`, `totalDone`, JSX layout, `src/SignIn.jsx` |

> Replace the placeholders above with real team names before the presentation.

## How it works (one-line each)

- **Sign in / register:** the form POSTs `{ email, password }` to the backend, which stores accounts in an in-memory object. The logged-in user's email is kept in `localStorage` so a refresh keeps you signed in.
- **Per-user data:** habit storage keys are namespaced (`habits_<email>`, `completed_<email>`) so two accounts on the same browser don't mix.
- **Data model:** two React state variables — `habits` (array of names) and `completed` (object of `date -> names`).
- **Persistence:** `useEffect` writes both to `localStorage` on change; another reads them on load.
- **Streak:** count consecutive days back from today that have at least one completed habit.
- **Calendar:** loop from day 1 to the month's last day, give each cell a CSS class based on how many habits were done that day.

## What we'd do next (production)

- Replace the in-memory user store with a real database (PostgreSQL, MongoDB, etc.)
- Hash passwords with bcrypt before storing them
- Issue a JWT or session token on login and validate it on every API request
- Move habit data to the backend too, so habits sync across devices

---

Built for our capstone project.
