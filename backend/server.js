const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Temporary in-memory data
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

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Habit Tracker API is running",
  });
});

// Get all habits
app.get("/api/habits", (req, res) => {
  res.json(habits);
});

// Get one habit by ID
app.get("/api/habits/:id", (req, res) => {
  const habit = habits.find(
    (habit) => habit.id === parseInt(req.params.id)
  );

  if (!habit) {
    return res.status(404).json({
      message: "Habit not found",
    });
  }

  res.json(habit);
});

// Create a new habit
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

// Update a habit
app.put("/api/habits/:id", (req, res) => {
  const habit = habits.find(
    (habit) => habit.id === parseInt(req.params.id)
  );

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

// Delete a habit
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

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on("error", (error) => {
  console.error("Server error:", error);
});