// Habit Tracker Backend
// Express + CORS
// In-memory user store (no database needed for the demo)

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ============================================================
// In-memory user store — { email: password }
// Wiped every time you restart the server.
// For a demo capstone this is fine.
// Production: replace with a real DB and hash passwords (bcrypt).
// ============================================================
const users = {};

// ===== AUTH ROUTES =====

app.post("/api/register", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  if (password.length < 4) {
    return res.status(400).json({ error: "Password must be at least 4 characters" });
  }
  if (users[email]) {
    return res.status(409).json({ error: "An account with that email already exists" });
  }
  users[email] = password;
  console.log(`Registered: ${email}  (total users: ${Object.keys(users).length})`);
  res.json({ success: true, email });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  if (!users[email]) {
    return res.status(401).json({ error: "No account with that email" });
  }
  if (users[email] !== password) {
    return res.status(401).json({ error: "Wrong password" });
  }
  console.log(`Signed in: ${email}`);
  res.json({ success: true, email });
});

// ===== QUOTE ROUTES =====

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

app.get("/", (req, res) => {
  res.send("Habit Tracker Backend is running!");
});

app.get("/api/quotes", (req, res) => {
  res.json(QUOTES);
});

app.get("/api/quote/today", (req, res) => {
  const day = new Date().getDate();
  res.json({ quote: QUOTES[day % QUOTES.length] });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
