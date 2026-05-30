import { useState } from "react";
import "./App.css";

function App() {
  const [habitInput, setHabitInput] = useState("");

  const [habits, setHabits] = useState([
    { id: 1, name: "Water intake", completed: true },
    { id: 2, name: "Gym", completed: true },
    { id: 3, name: "Reading", completed: false },
    { id: 4, name: "Coding practice", completed: false },
  ]);

  const addHabit = () => {
    if (!habitInput.trim()) return;

    setHabits([
      ...habits,
      {
        id: Date.now(),
        name: habitInput,
        completed: false,
      },
    ]);

    setHabitInput("");
  };

  const toggleHabit = (id) => {
    setHabits(
      habits.map((habit) =>
        habit.id === id
          ? { ...habit, completed: !habit.completed }
          : habit
      )
    );
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter((habit) => habit.id !== id));
  };

  const completed = habits.filter((h) => h.completed).length;

  const progress =
    habits.length > 0
      ? Math.round((completed / habits.length) * 100)
      : 0;

  return (
    <div className="container">
      <h1>My Habit Tracker</h1>
      <p className="date">
        {new Date().toDateString()}
      </p>

      <div className="stats">
        <div className="card">
          <h4>CURRENT STREAK</h4>
          <h2>1 day</h2>
        </div>

        <div className="card">
          <h4>LONGEST STREAK</h4>
          <h2>1 day</h2>
        </div>

        <div className="card">
          <h4>TODAY'S PROGRESS</h4>
          <h2>{progress}%</h2>
        </div>

        <div className="card">
          <h4>TOTAL DONE</h4>
          <h2>{completed}</h2>
        </div>
      </div>

      <div className="quote">
        You are what you repeatedly do.
      </div>

      <div className="section">
        <h2>Add a New Habit</h2>

        <div className="input-row">
          <input
            value={habitInput}
            onChange={(e) =>
              setHabitInput(e.target.value)
            }
            placeholder="e.g. Drink 2L of water"
          />

          <button onClick={addHabit}>
            Add Habit
          </button>
        </div>

        <div className="quick-buttons">
          <button onClick={() => setHabitInput("Water intake")}>
            💧 Water intake
          </button>

          <button onClick={() => setHabitInput("Gym")}>
            💪 Gym
          </button>

          <button onClick={() => setHabitInput("Reading")}>
            📚 Reading
          </button>

          <button onClick={() => setHabitInput("Coding practice")}>
            💻 Coding practice
          </button>
        </div>
      </div>

      <div className="section">
        <h2>Today's Habits</h2>

        {habits.map((habit) => (
          <div
            key={habit.id}
            className={`habit-row ${
              habit.completed ? "completed" : ""
            }`}
          >
            <span>{habit.name}</span>

            <div>
              <button
                className="done-btn"
                onClick={() => toggleHabit(habit.id)}
              >
                {habit.completed ? "Undo" : "Done"}
              </button>

              <button
                className="delete-btn"
                onClick={() => deleteHabit(habit.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="section">
        <h2>Calendar</h2>

        <div className="calendar">
          {Array.from({ length: 31 }, (_, i) => (
            <div key={i} className="day">
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;