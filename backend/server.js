const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Habit Tracker API is running"
  });
});

app.get("/api/habits", (req, res) => {
  res.json([]);
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});