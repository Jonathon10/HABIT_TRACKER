# Habit Tracker

> Capstone project · Team of 6

A web app that helps you build good habits. Track daily routines like Water intake, Gym, Reading, and Coding practice. See your streaks grow on a calendar and stay motivated with a daily quote.

## Features

- Add, complete, and delete habits
- 4 one-click presets: Water intake, Gym, Reading, Coding practice
- Daily current streak and personal-best longest streak
- Month calendar coloured by completion (green = all done, yellow = some, blue border = today)
- Today's progress percentage and total completions
- Motivational quote that changes each day
- Data is saved in the browser, so it stays after a refresh
- Works on phone, tablet, and desktop

## Tech stack

- **Frontend:** React 19 + Vite, plain CSS, `localStorage` for persistence
- **Backend:** Node.js + Express + CORS (serves quote endpoints)

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

## Project structure

```
HABIT_TRACKER/
├── index.html              # Vite entry point
├── package.json            # Frontend deps
├── vite.config.js
├── src/                    # FRONTEND
│   ├── main.jsx
│   ├── App.jsx             # Main component — all app logic
│   ├── App.css
│   └── index.css
└── backend/                # BACKEND
    ├── server.js           # Express server + API routes
    └── package.json
```

## Backend API

| Method | Route | Description |
|---|---|---|
| GET | `/` | Health check |
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
| Member 6 | Stats + habit list | `todayPercent`, `totalDone`, JSX layout |

> Replace the placeholders above with real team names before the presentation.

## How it works (one-line each)

- **Data model:** two React state variables — `habits` (array of names) and `completed` (object of `date -> names`).
- **Persistence:** `useEffect` writes both to `localStorage` on change; another reads them on load.
- **Streak:** count consecutive days back from today that have at least one completed habit.
- **Calendar:** loop from day 1 to the month's last day, give each cell a CSS class based on how many habits were done that day.

---

Built for our capstone project.
