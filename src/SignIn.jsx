import { useState } from "react";
import "./SignIn.css";

// Change this if your backend runs on a different host/port
const API = "http://localhost:5000";

export default function SignIn({ onLogin }) {
  const [mode, setMode] = useState("signin"); // "signin" or "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function callBackend(route) {
    try {
      const res = await fetch(`${API}${route}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return null;
      }
      return data;
    } catch (err) {
      setError("Can't reach the backend. Is it running on " + API + "?");
      return null;
    }
  }

  async function handleSignIn() {
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    const data = await callBackend("/api/login");
    setLoading(false);
    if (data) {
      setError("");
      localStorage.setItem("currentUser", data.email);
      onLogin(data.email);
    }
  }

  async function handleRegister() {
    if (!email.trim() || !password) {
      setError("Please enter an email and password.");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    const data = await callBackend("/api/register");
    setLoading(false);
    if (data) {
      setError("");
      localStorage.setItem("currentUser", data.email);
      onLogin(data.email);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (mode === "signin") handleSignIn();
    else handleRegister();
  }

  function switchMode(newMode) {
    setMode(newMode);
    setError("");
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="signin-page">
      <div className="signin-card">
        <h1>Habit Tracker</h1>
        <p className="signin-subtitle">
          {mode === "signin"
            ? "Welcome back. Sign in to continue."
            : "Create an account to start tracking your habits."}
        </p>

        <div className="signin-tabs">
          <button
            type="button"
            className={mode === "signin" ? "active" : ""}
            onClick={() => switchMode("signin")}
          >
            Sign In
          </button>
          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => switchMode("register")}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
              disabled={loading}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 4 characters"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              required
              disabled={loading}
            />
          </label>

          {mode === "register" && (
            <label>
              Confirm Password
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                required
                disabled={loading}
              />
            </label>
          )}

          {error && <p className="signin-error">{error}</p>}

          <button type="submit" className="signin-submit" disabled={loading}>
            {loading
              ? "..."
              : mode === "signin"
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
