// Habit Tracker Backend
// Express + CORS

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

let habits = [
  {
    id: 1,
    name: "Workout",
    category: "Fitness",
    completed: false,
  },
  {
    id: 2,
    name: "Read",
    category: "Learning",
    completed: true,
  },
];

app.get("/", (req, res) => {
  res.send("Habit Tracker Backend is running!");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Habit Tracker API is running",
  });
});

app.get("/api/quotes", (req, res) => {
  res.json(QUOTES);
});

app.get("/api/quote/today", (req, res) => {
  const day = new Date().getDate();
  res.json({ quote: QUOTES[day % QUOTES.length] });
});

app.get("/api/habits", (req, res) => {
  res.json(habits);
});

app.get("/api/habits/:id", (req, res) => {
  const habit = habits.find((habit) => habit.id === parseInt(req.params.id));

  if (!habit) {
    return res.status(404).json({
      message: "Habit not found",
    });
  }

  res.json(habit);
});

app.post("/api/habits", (req, res) => {
  const newHabit = {
    id: habits.length > 0 ? habits[habits.length - 1].id + 1 : 1,
    name: req.body.name,
    category: req.body.category || "General",
    completed: false,
  };

  habits.push(newHabit);

  res.status(201).json(newHabit);
});

app.put("/api/habits/:id", (req, res) => {
  const habit = habits.find((habit) => habit.id === parseInt(req.params.id));

  if (!habit) {
    return res.status(404).json({
      message: "Habit not found",
    });
  }

  habit.name = req.body.name ?? habit.name;
  habit.category = req.body.category ?? habit.category;
  habit.completed = req.body.completed ?? habit.completed;

  res.json(habit);
});

app.delete("/api/habits/:id", (req, res) => {
  const habitIndex = habits.findIndex(
    (habit) => habit.id === parseInt(req.params.id)
  );

  if (habitIndex === -1) {
    return res.status(404).json({
      message: "Habit not found",
    });
  }

  const deletedHabit = habits.splice(habitIndex, 1);

  res.json({
    message: "Habit deleted successfully",
    deletedHabit: deletedHabit[0],
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});