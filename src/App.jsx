import { useState, useEffect } from "react";
import "./App.css";

// 9 motivational quotes — one per day based on the date
const QUOTES = [
  "Small steps every day lead to big results!",
  "Don't break the chain — keep going!",
  "Discipline beats motivation.",
  "You are what you repeatedly do.",
  "Progress, not perfection.",
  "One day at a time.",
  "A little bit every day is better than a lot once in a while.",
  "Believe you can and you're halfway there.",
  "The secret of getting ahead is getting started.",
];

// Turn a Date into "YYYY-MM-DD" using LOCAL time (not UTC)
function formatDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getTodayString() {
  return formatDate(new Date());
}

function isNextDay(d1, d2) {
  const d = new Date(d1 + "T00:00:00");
  d.setDate(d.getDate() + 1);
  return formatDate(d) === d2;
}

export default function App() {
  const [habitInput, setHabitInput] = useState("");
  const [habits, setHabits] = useState([]);
  const [completed, setCompleted] = useState({});

  // Load saved data when the page opens
  useEffect(() => {
    const h = localStorage.getItem("habits");
    const c = localStorage.getItem("completed");
    if (h) setHabits(JSON.parse(h));
    if (c) setCompleted(JSON.parse(c));
  }, []);

  // Save whenever habits change
  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  // Save whenever completed changes
  useEffect(() => {
    localStorage.setItem("completed", JSON.stringify(completed));
  }, [completed]);

  // ===== TODAY'S QUOTE =====
  const todayDayNumber = new Date().getDate();
  const todayQuote = QUOTES[todayDayNumber % QUOTES.length];

  // ===== STATS =====
  const today = getTodayString();
  const doneTodayList = completed[today] || [];
  const todayPercent =
    habits.length > 0
      ? Math.round((doneTodayList.length / habits.length) * 100)
      : 0;

  let totalDone = 0;
  for (const d in completed) totalDone += completed[d].length;

  function calculateCurrentStreak() {
    let streak = 0;
    let date = new Date();
    if (!completed[today] || completed[today].length === 0) {
      date.setDate(date.getDate() - 1);
    }
    while (true) {
      const k = formatDate(date);
      if (completed[k] && completed[k].length > 0) {
        streak++;
        date.setDate(date.getDate() - 1);
      } else break;
      if (streak > 1000) break;
    }
    return streak;
  }

  function calculateLongestStreak() {
    const dates = Object.keys(completed)
      .filter((k) => completed[k].length > 0)
      .sort();
    let longest = 0;
    let current = 0;
    let prev = null;
    for (const d of dates) {
      if (prev !== null && isNextDay(prev, d)) current++;
      else current = 1;
      if (current > longest) longest = current;
      prev = d;
    }
    return longest;
  }

  const currentStreak = calculateCurrentStreak();
  let longestStreak = calculateLongestStreak();
  if (currentStreak > longestStreak) longestStreak = currentStreak;

  // ===== ACTIONS =====
  function addHabit() {
    const name = habitInput.trim();
    if (!name) {
      alert("Please type a habit name!");
      return;
    }
    if (habits.includes(name)) {
      alert("You already have this habit!");
      return;
    }
    setHabits([...habits, name]);
    setHabitInput("");
  }

  function addPreset(name) {
    if (habits.includes(name)) {
      alert("You already have this habit!");
      return;
    }
    setHabits([...habits, name]);
  }

  function toggleHabit(name) {
    const list = completed[today] || [];
    const newList = list.includes(name)
      ? list.filter((h) => h !== name)
      : [...list, name];
    setCompleted({ ...completed, [today]: newList });
  }

  function deleteHabit(name) {
    if (!window.confirm(`Delete the habit '${name}'?`)) return;
    setHabits(habits.filter((h) => h !== name));
    const cleaned = {};
    for (const d in completed) {
      cleaned[d] = completed[d].filter((h) => h !== name);
    }
    setCompleted(cleaned);
  }

  // ===== CALENDAR =====
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const todayDay = now.getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push({ empty: true });
  for (let day = 1; day <= lastDate; day++) {
    const k = formatDate(new Date(year, month, day));
    const doneCount = (completed[k] || []).length;
    let status = "none";
    if (habits.length > 0 && doneCount === habits.length) status = "done";
    else if (doneCount > 0) status = "partial";
    cells.push({ day, status, isToday: day === todayDay });
  }

  return (
    <div className="container">
      <h1>My Habit Tracker</h1>
      <p className="date">
        {now.toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <div className="stats">
        <div className="card">
          <h4>CURRENT STREAK</h4>
          <h2>{currentStreak} days</h2>
        </div>
        <div className="card">
          <h4>LONGEST STREAK</h4>
          <h2>{longestStreak} days</h2>
        </div>
        <div className="card">
          <h4>TODAY'S PROGRESS</h4>
          <h2>{todayPercent}%</h2>
        </div>
        <div className="card">
          <h4>TOTAL DONE</h4>
          <h2>{totalDone}</h2>
        </div>
      </div>

      {/* MOTIVATIONAL QUOTE — inline styles GUARANTEE it shows */}
      <div
        className="quote"
        style={{
          background: "#2ea3f2",
          color: "white",
          padding: "20px",
          margin: "20px 0",
          borderRadius: "10px",
          textAlign: "center",
          fontStyle: "italic",
          fontSize: "18px",
          fontWeight: "500",
          display: "block",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        💡 {todayQuote}
      </div>

      <div className="section">
        <h2>Add a New Habit</h2>
        <div className="input-row">
          <input
            value={habitInput}
            onChange={(e) => setHabitInput(e.target.value)}
            placeholder="e.g. Drink 2L of water"
            onKeyDown={(e) => {
              if (e.key === "Enter") addHabit();
            }}
          />
          <button onClick={addHabit}>Add Habit</button>
        </div>
        <p className="preset-label">Or pick one to start with:</p>
        <div className="quick-buttons">
          <button onClick={() => addPreset("Water intake")}>💧 Water intake</button>
          <button onClick={() => addPreset("Gym")}>💪 Gym</button>
          <button onClick={() => addPreset("Reading")}>📚 Reading</button>
          <button onClick={() => addPreset("Coding practice")}>💻 Coding practice</button>
        </div>
      </div>

      <div className="section">
        <h2>Today's Habits</h2>
        {habits.length === 0 ? (
          <p className="empty">No habits yet. Add one above to get started!</p>
        ) : (
          habits.map((name) => {
            const done = doneTodayList.includes(name);
            return (
              <div key={name} className={`habit-row ${done ? "completed" : ""}`}>
                <span>{name}</span>
                <div>
                  <button className="done-btn" onClick={() => toggleHabit(name)}>
                    {done ? "Undo" : "Done"}
                  </button>
                  <button className="delete-btn" onClick={() => deleteHabit(name)}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="section">
        <h2>
          {monthNames[month]} {year}
        </h2>
        <div className="weekdays">
          <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span>
          <span>Thu</span><span>Fri</span><span>Sat</span>
        </div>
        <div className="calendar">
          {cells.map((c, i) => {
            if (c.empty) return <div key={i} className="day empty"></div>;
            let cls = "day";
            if (c.status === "done") cls += " done";
            if (c.status === "partial") cls += " partial";
            if (c.isToday) cls += " today";
            return (
              <div key={i} className={cls}>
                {c.day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}