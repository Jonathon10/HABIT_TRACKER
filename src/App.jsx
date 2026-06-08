import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";

const API = "http://localhost:5000";

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
 "Success is the sum of small efforts repeated day in and day out.",
 "Your future self is watching — make them proud.",
 "Wake up with determination. Go to bed with satisfaction.",
];

const PRESETS = [
 { label: "Water intake", emoji: "💧" },
 { label: "Gym", emoji: "🏋️" },
 { label: "Reading", emoji: "📚" },
 { label: "Coding practice", emoji: "💻" },
 { label: "Meditation", emoji: "🧘" },
 { label: "Journaling", emoji: "📓" },
 { label: "Walk / Run", emoji: "🏃" },
 { label: "Sleep by 11pm", emoji: "😴" },
 { label: "No social media", emoji: "📵" },
 { label: "Healthy eating", emoji: "🥗" },
 { label: "Stretching", emoji: "🤸" },
 { label: "Gratitude practice", emoji: "🙏" },
];

const TEMPLATES = [
 {
 id: "student",
 name: "Student Pack",
 emoji: "📚",
 color: "#3b82f6",
 habits: ["Study 1 hour", "Review notes", "Read textbook", "No social media"],
 },
 {
 id: "fitness",
 name: "Fitness Pack",
 emoji: "💪",
 color: "#22c55e",
 habits: ["Workout", "Drink water", "Stretching", "Sleep by 11pm"],
 },
 {
 id: "mindfulness",
 name: "Mindfulness Pack",
 emoji: "🧘",
 color: "#8b5cf6",
 habits: ["Meditation", "Journaling", "Gratitude practice", "Walk / Run"],
 },
 {
 id: "productivity",
 name: "Deep Work Pack",
 emoji: "🚀",
 color: "#f59e0b",
 habits: ["Coding practice", "Read 30 min", "Plan tomorrow", "No social media"],
 },
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function formatDate(d) {
 const y = d.getFullYear();
 const m = String(d.getMonth() + 1).padStart(2, "0");
 const day = String(d.getDate()).padStart(2, "0");
 return `${y}-${m}-${day}`;
}
function getTodayString() { return formatDate(new Date()); }
function isNextDay(d1, d2) {
 const d = new Date(d1 + "T00:00:00");
 d.setDate(d.getDate() + 1);
 return formatDate(d) === d2;
}
function getGreeting(email) {
 const name = email.split("@")[0];
 const h = new Date().getHours();
 if (h < 12) return `Good morning, ${name}! ☀️`;
 if (h < 18) return `Good afternoon, ${name}! 👋`;
 return `Good evening, ${name}! 🌙`;
}

function launchConfetti() {
 const canvas = document.createElement("canvas");
 canvas.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999";
 document.body.appendChild(canvas);
 const ctx = canvas.getContext("2d");
 canvas.width = window.innerWidth;
 canvas.height = window.innerHeight;
 const colors = ["#3b82f6","#22c55e","#f59e0b","#ec4899","#8b5cf6","#06b6d4","#f97316"];
 const pieces = Array.from({ length: 120 }, (_, i) => ({
 x: Math.random() * canvas.width, y: -20 - Math.random() * 200,
 size: Math.random() * 10 + 5, color: colors[Math.floor(Math.random() * colors.length)],
 speedY: Math.random() * 3 + 2, speedX: (Math.random() - 0.5) * 2,
 rotation: Math.random() * 360, rotSpeed: (Math.random() - 0.5) * 8,
 shape: i % 3, opacity: 1, wobble: Math.random() * Math.PI * 2,
 }));
 let frame, tick = 0;
 function draw() {
 ctx.clearRect(0, 0, canvas.width, canvas.height); tick++;
 pieces.forEach(p => {
 p.y += p.speedY; p.x += p.speedX + Math.sin(p.wobble + tick * 0.04) * 0.8;
 p.rotation += p.rotSpeed;
 if (p.y > canvas.height * 0.7) p.opacity = Math.max(0, p.opacity - 0.02);
 ctx.save(); ctx.globalAlpha = p.opacity; ctx.translate(p.x, p.y);
 ctx.rotate((p.rotation * Math.PI) / 180); ctx.fillStyle = p.color;
 if (p.shape === 0) { ctx.beginPath(); ctx.arc(0,0,p.size/2,0,Math.PI*2); ctx.fill(); }
 else if (p.shape === 1) { ctx.fillRect(-p.size/2,-p.size/4,p.size,p.size/2); }
 else { ctx.beginPath(); ctx.moveTo(0,-p.size/2); ctx.lineTo(p.size/2,p.size/2); ctx.lineTo(-p.size/2,p.size/2); ctx.closePath(); ctx.fill(); }
 ctx.restore();
 });
 if (pieces.some(p => p.y < canvas.height && p.opacity > 0)) frame = requestAnimationFrame(draw);
 else { cancelAnimationFrame(frame); if (canvas.parentNode) document.body.removeChild(canvas); }
 }
 draw();
 setTimeout(() => { cancelAnimationFrame(frame); if (canvas.parentNode) document.body.removeChild(canvas); }, 4000);
}

const NavIcons = {
 home: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
 habits: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
 stats: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
 calendar: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
 settings: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
};

// ===== CONGRATS MODAL =====
function CongratsModal({ streak, onClose }) {
 const messages = ["You're absolutely crushing it!", "Every habit checked. Every goal hit.", "This is what discipline looks like.", "You showed up. That's everything.", "Your future self thanks you! 🚀"];
 const msg = messages[new Date().getDate() % messages.length];
 return (
 <div className="congrats-overlay" onClick={onClose}>
 <div className="congrats-modal" onClick={e => e.stopPropagation()}>
 <div className="congrats-stars">
 {["⭐","✨","🌟","💫","⭐","✨"].map((s, i) => (
 <span key={i} className="congrats-star" style={{ top:`${10+(i*14)}%`, left: i%2===0?`${5+i*3}%`:`${80-i*3}%`, animationDelay:`${i*0.3}s` }}>{s}</span>
 ))}
 </div>
 <span className="congrats-emoji">🏆</span>
 <h2 className="congrats-title">All Done!</h2>
 <p className="congrats-sub">{msg}</p>
 {streak > 0 && <div className="congrats-streak">🔥 You're on a <strong>{streak}-day streak</strong> — keep it going!</div>}
 <button className="congrats-close" onClick={onClose}>Keep going! 💪</button>
 </div>
 </div>
 );
}

// ===== AUTH PAGE =====
function AuthPage({ onLogin }) {
 const [mode, setMode] = useState("signin");
 const [form, setForm] = useState({ email: "", password: "" });
 const [error, setError] = useState("");
 const [loading, setLoading] = useState(false);
 const [success, setSuccess] = useState("");

 function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); setError(""); setSuccess(""); }

 async function handleSubmit() {
 if (!form.email || !form.password) { setError("Email and password are required"); return; }
 setLoading(true); setError("");
 try {
 const endpoint = mode === "signin" ? "/api/login" : "/api/register";
 const res = await fetch(`${API}${endpoint}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
 const data = await res.json();
 if (!res.ok) { setError(data.error || "Something went wrong"); setLoading(false); return; }
 if (mode === "register") {
 setSuccess("Account created! Signing you in…");
 setTimeout(() => { localStorage.setItem("currentUser", form.email); onLogin(form.email); }, 900);
 } else { localStorage.setItem("currentUser", form.email); onLogin(form.email); }
 } catch { setError("Can't reach the backend. Is it running on http://localhost:5000?"); setLoading(false); }
 }

 return (
 <div className="auth-bg">
 <div className="auth-card">
 <div className="auth-logo">✅</div>
 <h1 className="auth-title">Habit Tracker</h1>
 <p className="auth-subtitle">{mode === "signin" ? "Welcome back. Sign in to continue." : "Create an account to get started."}</p>
 <div className="auth-tabs">
 <button className={`auth-tab ${mode==="signin"?"active":""}`} onClick={() => { setMode("signin"); setError(""); setSuccess(""); }}>Sign In</button>
 <button className={`auth-tab ${mode==="register"?"active":""}`} onClick={() => { setMode("register"); setError(""); setSuccess(""); }}>Register</button>
 </div>
 <div className="auth-field"><label>Email</label><input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} onKeyDown={e => e.key==="Enter" && handleSubmit()} /></div>
 <div className="auth-field"><label>Password</label><input name="password" type="password" placeholder={mode==="register"?"Min. 4 characters":"Your password"} value={form.password} onChange={handleChange} onKeyDown={e => e.key==="Enter" && handleSubmit()} /></div>
 {error && <div className="auth-error">{error}</div>}
 {success && <div className="auth-success">{success}</div>}
 <button className="auth-submit" onClick={handleSubmit} disabled={loading}>{loading?"Please wait…":mode==="signin"?"Sign In →":"Create Account →"}</button>
 </div>
 </div>
 );
}

// ===== MAIN APP =====
export default function App() {
 const [user, setUser] = useState(localStorage.getItem("currentUser") || null);
 const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");

 useEffect(() => {
 document.body.classList.toggle("dark", darkMode);
 localStorage.setItem("darkMode", darkMode);
 }, [darkMode]);

 if (!user) return <AuthPage onLogin={email => setUser(email)} />;
 return <Tracker user={user} darkMode={darkMode} setDarkMode={setDarkMode} onLogout={() => { localStorage.removeItem("currentUser"); setUser(null); }} />;
}

// ===== WEEKLY STATS PAGE =====
function WeeklyStats({ habits, completed }) {
 const today = new Date();
 const weekDays = Array.from({ length: 7 }, (_, i) => {
 const d = new Date(today);
 d.setDate(today.getDate() - 6 + i);
 return { date: formatDate(d), label: DAY_NAMES[d.getDay()], isToday: i === 6 };
 });

 const totalHabits = habits.length;
 const weekData = weekDays.map(({ date, label, isToday }) => {
 const done = (completed[date] || []).length;
 const pct = totalHabits > 0 ? Math.round((done / totalHabits) * 100) : 0;
 return { label, date, done, pct, isToday };
 });

 const bestDay = weekData.reduce((best, d) => d.pct > best.pct ? d : best, weekData[0]);
 const weekTotal = weekData.reduce((s, d) => s + d.done, 0);
 const weekPossible = totalHabits * 7;
 const avgPct = weekPossible > 0 ? Math.round((weekTotal / weekPossible) * 100) : 0;

 // Last 84 days heatmap (12 weeks)
 const heatDays = Array.from({ length: 84 }, (_, i) => {
 const d = new Date(today);
 d.setDate(today.getDate() - 83 + i);
 const key = formatDate(d);
 const done = (completed[key] || []).length;
 let level = 0;
 if (totalHabits > 0 && done > 0) {
 const pct = done / totalHabits;
 if (pct >= 1) level = 4;
 else if (pct >= 0.75) level = 3;
 else if (pct >= 0.5) level = 2;
 else level = 1;
 }
 return { key, day: d.getDate(), level, isToday: key === formatDate(today) };
 });

 // Group heatmap into weeks
 const heatWeeks = [];
 for (let i = 0; i < heatDays.length; i += 7) heatWeeks.push(heatDays.slice(i, i + 7));

 return (
 <div>
 {/* Summary cards */}
 <div className="stats" style={{ marginBottom: 20 }}>
 <div className="card"><h4>WEEK TOTAL</h4><h2>{weekTotal}</h2></div>
 <div className="card"><h4>AVG COMPLETION</h4><h2>{avgPct}%</h2></div>
 <div className="card"><h4>BEST DAY</h4><h2>{bestDay.pct > 0 ? bestDay.label : "—"}</h2></div>
 <div className="card"><h4>HABITS TRACKED</h4><h2>{totalHabits}</h2></div>
 </div>

 {/* Bar chart — this week */}
 <div className="section">
 <h2>This Week's Completion</h2>
 {totalHabits === 0 ? (
 <p className="empty-hint">Add habits first to see your stats.</p>
 ) : (
 <div className="bar-chart">
 {weekData.map(({ label, done, pct, isToday }) => (
 <div key={label} className={`bar-col ${isToday ? "bar-today" : ""}`}>
 <div className="bar-pct">{pct > 0 ? `${pct}%` : ""}</div>
 <div className="bar-track">
 <div className="bar-fill" style={{ height: `${pct}%`, background: pct === 100 ? "#22c55e" : "linear-gradient(180deg,#6366f1,#3b82f6)" }} />
 </div>
 <div className="bar-label">{label}</div>
 <div className="bar-sub">{done}/{totalHabits}</div>
 </div>
 ))}
 </div>
 )}
 </div>

 {/* Heatmap */}
 <div className="section" style={{ marginTop: 20 }}>
 <h2>Habit Heatmap <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-muted)", fontFamily: "Nunito" }}>— last 12 weeks</span></h2>
 <div className="heatmap-legend">
 <span className="hm-legend-label">Less</span>
 {[0,1,2,3,4].map(l => <span key={l} className={`hm-cell hm-${l}`} style={{ width:14, height:14, display:"inline-block", borderRadius:3, margin:"0 2px" }} />)}
 <span className="hm-legend-label">More</span>
 </div>
 <div className="heatmap-grid">
 <div className="heatmap-days-label">
 {["","Mon","","Wed","","Fri",""].map((d,i) => <div key={i} className="hm-day-label">{d}</div>)}
 </div>
 <div className="heatmap-weeks">
 {heatWeeks.map((week, wi) => (
 <div key={wi} className="hm-week">
 {week.map((d, di) => (
 <div key={di} className={`hm-cell hm-${d.level} ${d.isToday ? "hm-today" : ""}`} title={`${d.key}: ${(completed[d.key]||[]).length}/${totalHabits} done`} />
 ))}
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 );
}

// ===== SETTINGS PAGE =====
function SettingsPage({ habits, reminders, setReminders, darkMode, setDarkMode }) {
 const [notifPerm, setNotifPerm] = useState(typeof Notification !== "undefined" ? Notification.permission : "denied");
 const [editHabit, setEditHabit] = useState(null);
 const [editTime, setEditTime] = useState("");

 async function requestNotifPermission() {
 if (typeof Notification === "undefined") return alert("Notifications not supported in this browser.");
 const perm = await Notification.requestPermission();
 setNotifPerm(perm);
 if (perm === "granted") alert("Notifications enabled! Reminders will fire at your set times.");
 }

 function saveReminder() {
 if (!editTime) return;
 setReminders({ ...reminders, [editHabit]: editTime });
 setEditHabit(null); setEditTime("");
 }

 function removeReminder(h) {
 const r = { ...reminders };
 delete r[h];
 setReminders(r);
 }

 return (
 <div>
 {/* Dark Mode */}
 <div className="section">
 <h2>Appearance</h2>
 <div className="setting-row">
 <div>
 <div className="setting-title">🌙 Dark Mode</div>
 <div className="setting-sub">Easy on the eyes, especially at night.</div>
 </div>
 <button className={`toggle-btn ${darkMode ? "toggle-on" : ""}`} onClick={() => setDarkMode(v => !v)}>
 <span className="toggle-knob" />
 </button>
 </div>
 </div>

 {/* Notifications */}
 <div className="section" style={{ marginTop: 20 }}>
 <h2>Reminder Notifications</h2>
 {notifPerm !== "granted" ? (
 <div className="notif-banner">
 <div style={{ marginBottom: 10 }}>
 <strong>Enable browser notifications</strong> to get daily reminders for your habits.
 </div>
 <button className="notif-enable-btn" onClick={requestNotifPermission}>
 🔔 Enable Notifications
 </button>
 </div>
 ) : (
 <p className="setting-sub" style={{ marginBottom: 16, color: "#22c55e", fontWeight: 700 }}>✅ Notifications are enabled</p>
 )}

 {habits.length === 0 ? (
 <p className="empty-hint">Add habits first to set reminders.</p>
 ) : (
 <div>
 {habits.map(h => (
 <div key={h} className="reminder-row">
 <span className="reminder-habit">{h}</span>
 <div className="reminder-actions">
 {reminders[h] ? (
 <>
 <span className="reminder-time">🔔 {reminders[h]}</span>
 <button className="reminder-edit" onClick={() => { setEditHabit(h); setEditTime(reminders[h]); }}>Edit</button>
 <button className="reminder-remove" onClick={() => removeReminder(h)}>✕</button>
 </>
 ) : (
 <button className="reminder-add-btn" onClick={() => { setEditHabit(h); setEditTime("08:00"); }}>+ Set time</button>
 )}
 </div>
 </div>
 ))}
 </div>
 )}

 {editHabit && (
 <div className="congrats-overlay" onClick={() => setEditHabit(null)}>
 <div className="modal-small" onClick={e => e.stopPropagation()}>
 <h3 style={{ marginBottom: 8, fontFamily: "Playfair Display, serif" }}>Set Reminder</h3>
 <p style={{ color: "var(--text-muted)", marginBottom: 16, fontSize: 15 }}>Daily reminder for: <strong>{editHabit}</strong></p>
 <input type="time" value={editTime} onChange={e => setEditTime(e.target.value)} className="time-input" />
 <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
 <button className="auth-submit" style={{ flex: 1, padding: "12px" }} onClick={saveReminder}>Save Reminder</button>
 <button className="clear-btn" style={{ flex: 1, padding: "12px" }} onClick={() => setEditHabit(null)}>Cancel</button>
 </div>
 </div>
 </div>
 )}
 </div>
 </div>
 );
}

// ===== TRACKER =====
function Tracker({ user, darkMode, setDarkMode, onLogout }) {
 const [page, setPage] = useState("home");
 const [habitInput, setHabitInput] = useState("");
 const [habits, setHabits] = useState([]);
 const [completed, setCompleted] = useState({});
 const [showAllPresets, setShowAllPresets] = useState(false);
 const [showCongrats, setShowCongrats] = useState(false);
 const [reminders, setReminders] = useState({});
 const [appliedTemplates, setAppliedTemplates] = useState([]);
 const prevPercentRef = useRef(0);
 const notifTimerRef = useRef(null);

 const habitsKey = `habits_${user}`;
 const completedKey = `completed_${user}`;
 const remindersKey = `reminders_${user}`;
 const templatesKey = `templates_${user}`;

 useEffect(() => {
 const h = localStorage.getItem(habitsKey);
 const c = localStorage.getItem(completedKey);
 const r = localStorage.getItem(remindersKey);
 const t = localStorage.getItem(templatesKey);
 setHabits(h ? JSON.parse(h) : []);
 setCompleted(c ? JSON.parse(c) : {});
 setReminders(r ? JSON.parse(r) : {});
 setAppliedTemplates(t ? JSON.parse(t) : []);
 }, []);

 useEffect(() => { localStorage.setItem(habitsKey, JSON.stringify(habits)); }, [habits]);
 useEffect(() => { localStorage.setItem(completedKey, JSON.stringify(completed)); }, [completed]);
 useEffect(() => { localStorage.setItem(remindersKey, JSON.stringify(reminders)); }, [reminders]);
 useEffect(() => { localStorage.setItem(templatesKey, JSON.stringify(appliedTemplates)); }, [appliedTemplates]);

 // Check reminders every minute
 useEffect(() => {
 function checkReminders() {
 if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
 const now = new Date();
 const hhmm = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
 const today = getTodayString();
 Object.entries(reminders).forEach(([habit, time]) => {
 if (time === hhmm) {
 const doneTodayList = completed[today] || [];
 if (!doneTodayList.includes(habit)) {
 new Notification("Habit Reminder 🔔", { body: `Time to: ${habit}`, icon: "/favicon.ico" });
 }
 }
 });
 }
 notifTimerRef.current = setInterval(checkReminders, 60000);
 return () => clearInterval(notifTimerRef.current);
 }, [reminders, completed]);

 const today = getTodayString();
 const doneTodayList = completed[today] || [];
 const todayPercent = habits.length > 0 ? Math.round((doneTodayList.length / habits.length) * 100) : 0;

 let totalDone = 0;
 for (const d in completed) totalDone += completed[d].length;

 function calculateCurrentStreak() {
 let streak = 0, date = new Date();
 if (!completed[today] || completed[today].length === 0) date.setDate(date.getDate() - 1);
 while (true) {
 const k = formatDate(date);
 if (completed[k] && completed[k].length > 0) { streak++; date.setDate(date.getDate() - 1); }
 else break;
 if (streak > 1000) break;
 }
 return streak;
 }

 function calculateLongestStreak() {
 const dates = Object.keys(completed).filter(k => completed[k].length > 0).sort();
 let longest = 0, current = 0, prev = null;
 for (const d of dates) {
 if (prev !== null && isNextDay(prev, d)) current++;
 else current = 1;
 if (current > longest) longest = current;
 prev = d;
 }
 return longest;
 }

 const currentStreak = calculateCurrentStreak();
 const longestStreak = Math.max(calculateLongestStreak(), currentStreak);

 function addHabit() {
 const name = habitInput.trim();
 if (!name) { alert("Please type a habit name!"); return; }
 if (habits.includes(name)) { alert("You already have this habit!"); return; }
 setHabits([...habits, name]);
 setHabitInput("");
 }

 function addPreset(name) {
 if (habits.includes(name)) { alert("You already have this habit!"); return; }
 setHabits([...habits, name]);
 }

 function applyTemplate(template) {
 const newHabits = template.habits.filter(h => !habits.includes(h));
 if (newHabits.length === 0) { alert("All habits from this pack are already added!"); return; }
 setHabits([...habits, ...newHabits]);
 setAppliedTemplates([...appliedTemplates, template.id]);
 }

 function toggleHabit(name) {
 const list = completed[today] || [];
 const newList = list.includes(name) ? list.filter(h => h !== name) : [...list, name];
 setCompleted({ ...completed, [today]: newList });
 const newPercent = habits.length > 0 ? Math.round((newList.length / habits.length) * 100) : 0;
 if (newPercent === 100 && prevPercentRef.current < 100) {
 launchConfetti();
 setTimeout(() => setShowCongrats(true), 600);
 }
 prevPercentRef.current = newPercent;
 }

 function deleteHabit(name) {
 if (!window.confirm(`Delete the habit '${name}'?`)) return;
 setHabits(habits.filter(h => h !== name));
 const cleaned = {};
 for (const d in completed) cleaned[d] = completed[d].filter(h => h !== name);
 setCompleted(cleaned);
 }

 function clearToday() {
 if (doneTodayList.length === 0) return;
 if (window.confirm("Uncheck all habits for today?")) { setCompleted({ ...completed, [today]: [] }); prevPercentRef.current = 0; }
 }

 const now = new Date();

 const year = now.getFullYear(), 
       month = now.getMonth(), 
       todayDay = now.getDate();

 const firstDay = new Date(year, month, 1).getDay();
 const lastDate = new Date(year, month + 1, 0).getDate();

 const cells = [];

 for (let i = 0; i < firstDay; i++) cells.push({ empty: true });

 for (let day = 1; day <= lastDate; day++) {
    const k = formatDate(new Date(year, month, day));
    const doneCount = (completed[k] || []).length;

    let status = "none";

    if (habits.length > 0 && doneCount === habits.length) 
      status = "done";

    else if (doneCount > 0) 
      status = "partial";
    
    cells.push({ 
      day, 
      status, 
      isToday: day === todayDay 
  });


 const visiblePresets = showAllPresets ? PRESETS : PRESETS.slice(0, 6);
 const marqueeText = QUOTES.join(" ✦ ");

 const navItems = [
 { id: "home", label: "Home" },
 { id: "habits", label: "Habits" },
 { id: "stats", label: "Stats" },
 { id: "calendar", label: "Calendar" },
 { id: "settings", label: "Settings" },
 ];

 return (
 <div className="container">
 {showCongrats && <CongratsModal streak={currentStreak} onClose={() => setShowCongrats(false)} />}

 <div className="top-bar">
 <h1 className="greeting">{getGreeting(user)}</h1>
 <button className="signout-btn" onClick={() => { if (window.confirm("Sign out?")) onLogout(); }}>Sign out</button>
 </div>
 <p className="date">{now.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>

 {/* HOME */}
 {page === "home" && (
 <>
 <div className="stats">
 <div className="card"><h4>CURRENT STREAK</h4><h2>{currentStreak} days</h2></div>
 <div className="card"><h4>LONGEST STREAK</h4><h2>{longestStreak} days</h2></div>
 <div className="card"><h4>TODAY'S PROGRESS</h4><h2>{todayPercent}%</h2></div>
 <div className="card"><h4>TOTAL DONE</h4><h2>{totalDone}</h2></div>
 </div>
 <div className="quote-marquee-wrap">
 <div className="quote-marquee"><span>{marqueeText}&nbsp;&nbsp;&nbsp;✦&nbsp;&nbsp;&nbsp;{marqueeText}</span></div>
 </div>
 <div className="section">
 <h2>Today at a glance</h2>
 {habits.length === 0 ? (
 <p className="empty-hint">No habits added yet. Go to the Habits tab to get started!</p>
 ) : (
 <>
 <div className="progress-wrap">
 <div className="progress-labels">
 <span>Progress today</span>
 <span className="progress-pct">{todayPercent}%</span>
 </div>
 <div className="progress-track">
 <div className="progress-fill" style={{ width:`${todayPercent}%`, background: todayPercent===100?"#22c55e":"linear-gradient(90deg,#3b82f6,#6366f1)" }} />
 </div>
 </div>
 <p className="glance-text">{doneTodayList.length===habits.length?"🎉 All habits done for today!":`${doneTodayList.length} of ${habits.length} habits completed.`}</p>
 </>
 )}
 </div>
 </>
 )}

 {/* HABITS */}
 {page === "habits" && (
 <>
 {/* Templates */}
 <div className="section">
 <h2>Habit Templates</h2>
 <div className="templates-grid">
 {TEMPLATES.map(t => {
 const isApplied = t.habits.every(h => habits.includes(h));
 return (
 <div key={t.id} className={`template-card ${isApplied ? "template-applied" : ""}`} style={{ "--tc": t.color }}>
 <div className="template-emoji">{t.emoji}</div>
 <div className="template-name">{t.name}</div>
 <div className="template-habits">{t.habits.slice(0,3).join(" • ")}{t.habits.length > 3 ? " …" : ""}</div>
 <button className="template-btn" onClick={() => applyTemplate(t)} disabled={isApplied}>
 {isApplied ? "✓ Added" : "Add Pack"}
 </button>
 </div>
 );
 })}
 </div>
 </div>

 {/* Custom habit */}
 <div className="section" style={{ marginTop: 20 }}>
 <h2>Add a Custom Habit</h2>
 <div className="input-row">
 <input value={habitInput} onChange={e => setHabitInput(e.target.value)} placeholder="e.g. Drink 2L of water" onKeyDown={e => e.key==="Enter" && addHabit()} />
 <button onClick={addHabit}>Add</button>
 </div>
 <p className="preset-label">Or pick from suggestions:</p>
 <div className="quick-buttons">
 {visiblePresets.map(({ label, emoji }) => (
 <button key={label} onClick={() => addPreset(label)} className={habits.includes(label) ? "preset-added" : ""}>{emoji} {label} {habits.includes(label) ? "✓" : ""}</button>
 ))}
 </div>
 <button className="show-more-btn" onClick={() => setShowAllPresets(v => !v)}>{showAllPresets?"Show less ↑":`Show more habits (${PRESETS.length-6} more) ↓`}</button>
 </div>

 {/* Today's habits list */}
 <div className="section" style={{ marginTop: 20 }}>
 <div className="habits-header">
 <h2 style={{ margin: 0 }}>
 Today's Habits{" "}
 {habits.length > 0 && <span className={`badge ${doneTodayList.length===habits.length?"badge-green":"badge-blue"}`}>{doneTodayList.length}/{habits.length} done</span>}
 </h2>
 {doneTodayList.length > 0 && <button className="clear-btn" onClick={clearToday}>Clear all</button>}
 </div>
 {habits.length === 0 ? (
 <div className="empty-state">
 <div style={{ fontSize:"52px", marginBottom:"14px" }}>🌱</div>
 <p className="empty-title">No habits yet!</p>
 <p className="empty-sub">Add your first habit above or pick a template pack.</p>
 </div>
 ) : (
 habits.map(name => {
 const done = doneTodayList.includes(name);
 return (
 <div key={name} className={`habit-row ${done?"completed":""}`}>
 <div>
 <span>{name}</span>
 {reminders[name] && <span className="habit-reminder-badge">🔔 {reminders[name]}</span>}
 </div>
 <div>
 <button className="done-btn" onClick={() => toggleHabit(name)}>{done?"Undo":"Done"}</button>
 <button className="delete-btn" onClick={() => deleteHabit(name)}>Delete</button>
 </div>
 </div>
 );
 })
 )}
 </div>
 </>
 )}

 {/* STATS */}
 {page === "stats" && <WeeklyStats habits={habits} completed={completed} />}

 {/* CALENDAR */}
 {page === "calendar" && (
 <div className="section">
 <h2>{MONTH_NAMES[month]} {year}</h2>
 <div className="cal-legend">
 <span className="legend-item"><span className="legend-dot done-dot" /> All done</span>
 <span className="legend-item"><span className="legend-dot partial-dot" /> Partial</span>
 <span className="legend-item"><span className="legend-dot none-dot" /> None</span>
 </div>
 <div className="weekdays">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <span key={d}>{d}</span>)}</div>
 <div className="calendar">
 {cells.map((c, i) => {
 if (c.empty) return <div key={i} className="day empty" />;
 let cls = "day";
 if (c.status==="done") cls+=" done";
 if (c.status==="partial") cls+=" partial";
 if (c.isToday) cls+=" today";
 return <div key={i} className={cls}>{c.day}</div>;
 })}
 </div>
 </div>
 )}

 {/* SETTINGS */}
 {page === "settings" && (
 <SettingsPage habits={habits} reminders={reminders} setReminders={setReminders} darkMode={darkMode} setDarkMode={setDarkMode} />
 )}

 {/* BOTTOM NAV */}
 <div className="bottom-nav">
 {navItems.map(({ id, label }) => (
 <button key={id} className={`nav-btn ${page===id?"nav-active":""}`} onClick={() => setPage(id)}>
 <span className="nav-icon">{NavIcons[id]}</span>
 <span className="nav-label">{label}</span>
 {page===id && <span className="nav-dot" />}
 </button>
 ))}
 </div>
 <div style={{ height:"80px" }} />
 </div>
 );
}