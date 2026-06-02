// Habit Tracker Backend
// Express + CORS — serves motivational quotes

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

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