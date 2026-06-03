# 🔥 HabitForge — Habit Tracker

> Capstone project • Team of 6

A web app that helps you build good habits. Track daily routines like **Water intake, Gym, Reading, Coding practice**, build streaks, and stay motivated.

---

## ✨ Features

- ✅ Add, complete, and delete habits
- 💧 4 one-click presets (Water intake · Gym · Reading · Coding practice)
- 🔥 **Daily streaks** — current streak + personal-best longest streak
- 📅 **Calendar view** — month grid color-coded by completion
  - 🟩 green = all habits done that day
  - 🟨 yellow = some habits done
  - 🟦 blue border = today
- 📊 **Motivational stats** — today's progress %, total completions
- 💬 **Daily motivational quote** — changes each day
- 💾 **Persistent storage** — habits + history saved in browser localStorage
- 📱 **Responsive** — works on phone, tablet, and desktop

---

## 🛠 Tech stack

**Frontend** (in `/src`)
- [React 19](https://react.dev/) — UI library
- [Vite](https://vitejs.dev/) — dev server + build tool
- Plain CSS (no framework)
- Browser `localStorage` for persistence

**Backend** (in `/backend`)
- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) — REST API
- [CORS](https://www.npmjs.com/package/cors) — cross-origin requests
- Provides motivational quote endpoints

---

## 🚀 How to run

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)
- A terminal (PowerShell, bash, etc.)

### One-time setup

Clone the repo and install dependencies for **both** the frontend and the backend:

```bash
git clone https://github.com/Jonathon10/HABIT_TRACKER.git
cd HABIT_TRACKER

# Install frontend dependencies
npm install

# Install backend dependencies (separate package.json)
cd backend
npm install
cd ..
```

### Running the app (you need 2 terminals)

**Terminal 1 — Frontend**
```bash
npm run dev
```
Opens at **http://localhost:5173/**

**Terminal 2 — Backend**
```bash
cd backend
npm start
```
Listens at **http://localhost:5000/**

---

## 📂 Project structure

```
HABIT_TRACKER/
├── index.html              # Vite entry point
├── package.json            # Frontend dependencies
├── vite.config.js          # Vite configuration
├── eslint.config.js        # ESLint rules
│
├── src/                    # 🎨 FRONTEND
│   ├── main.jsx            # React mount point
│   ├── App.jsx             # ⭐ Main component (all the app logic)
│   ├── App.css             # Component styles
│   ├── index.css           # Global styles
│   └── assets/             # Images, icons
│
├── backend/                # 🔧 BACKEND
│   ├── server.js           # Express server + API routes
│   └── package.json        # Backend dependencies
│
└── public/                 # Static assets (favicon, etc.)
```

---

## 🔌 Backend API

The Express server in `backend/server.js` exposes these endpoints:

| Method | Route | Description |
|---|---|---|
| GET | `/` | Health check — returns "Habit Tracker Backend is running!" |
| GET | `/api/quotes` | Returns all 9 motivational quotes as a JSON array |
| GET | `/api/quote/today` | Returns today's quote (changes daily) |

Example:
```bash
curl http://localhost:5000/api/quote/today
# → { "quote": "You are what you repeatedly do." }
```

---

## 👥 The team — who built what

The `src/App.jsx` file is organized so each team member has a clear section they own and can explain during the presentation:

| Member | What they own | Where in the code |
|---|---|---|
| **Member 1** | State management + save/load | `useState` + `useEffect` for localStorage |
| **Member 2** | Date display + motivational quote | `todayDayNumber` + `todayQuote` |
| **Member 3** | Add / delete habits | `addHabit`, `addPreset`, `deleteHabit` |
| **Member 4** | Mark done + streak math | `toggleHabit`, `calculateCurrentStreak`, `calculateLongestStreak` |
| **Member 5** | Calendar view | The `cells` loop + calendar rendering |
| **Member 6** | Stats display + habit list | `todayPercent`, `totalDone`, the JSX layout |

> 📝 **Team:** _replace these placeholders with your real names before the presentation._

---

## 🧠 How key features work (presentation talking points)

### Where the data lives
Everything is stored in **two React state variables** in `App.jsx`:
```jsx
const [habits, setHabits] = useState([]);
// Example: ["Water intake", "Gym", "Reading"]

const [completed, setCompleted] = useState({});
// Example: { "2026-05-30": ["Water intake", "Gym"] }
```
That's the entire data model. Every feature reads from or writes to these two.

### How streaks are calculated
We start at today's date and **walk backwards day by day**. As long as we find at least one completed habit on that day, the streak grows by 1. When we hit a day with no completions, we stop.

```jsx
function calculateCurrentStreak() {
  let streak = 0;
  let date = new Date();
  // ... walk backwards through completed[date] ...
}
```

### How the calendar is built
We loop from day 1 to the last day of the current month, building one `<div>` per day. Each cell gets a CSS class based on completion ratio (`done`, `partial`, or empty) plus a `today` class for the current date.

### Why your data survives a refresh
Two `useEffect` hooks watch the state. Whenever `habits` or `completed` changes, the new value is written to `localStorage`. On page load, another `useEffect` reads them back. No backend needed for persistence.

---

## 🔮 Future improvements

Ideas for the team to explore after the capstone:
- **User accounts** — let multiple people use the app, with data synced via the backend
- **Charts** — weekly completion bar chart, monthly heatmap
- **Reminders** — browser notifications
- **Habit categories** — group habits (health, learning, etc.)
- **Export / import** — download your history as JSON
- **Mobile app** — wrap in Capacitor or React Native

---

## 📄 License

Built for our capstone project.
