import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

// High-resolution reliable fallback images
const IMAGES = {
  runner: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
  fruits: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80",
  veggies: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=300&q=80",
  salad: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?auto=format&fit=crop&w=300&q=80",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  cardio1: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=200&q=80",
  cardio2: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=200&q=80",
  cardio3: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=200&q=80",
};

export default function Dashboard() {
  const navigate = useNavigate();

  // User State
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);

  // Left Sidebar active tab
  const [sidebarTab, setSidebarTab] = useState("overview"); // overview, analytics, calendar, timer, community, settings

  // Search input & notifications
  const [searchQuery, setSearchQuery] = useState("");
  const [hasNotification, setHasNotification] = useState(true);

  // Timeframe selector for Activity Tracking
  const [activityTimeframe, setActivityTimeframe] = useState("Weekly");

  // Selected Calendar Date
  const [selectedDate, setSelectedDate] = useState(22);
  const [calendarMonth, setCalendarMonth] = useState("December 2022");

  // Focus Timer State (for Timer Tab)
  const [timerSeconds, setTimerSeconds] = useState(1500); // 25 min pomodoro
  const [timerRunning, setTimerRunning] = useState(false);

  // Check Auth & Profile
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      setIsGuest(true);
    }
  }, []);

  // Timer Tick
  useEffect(() => {
    let interval = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Format Timer
  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Display Name & Handle (Clean, no mock account fallbacks)
  const displayName = user?.name || "Developer";
  const userHandle = user?.email || (user?.username ? `@${user.username}` : "");

  return (
    <div className="glassy-dashboard-viewport">
      {/* Dynamic Ambient Luxury Lighting Background */}
      <div className="glassy-ambient-backdrop" />

      {/* Main 3-Column Floating Suite Container */}
      <div className="glassy-suite-container">

        {/* ======================================================== */}
        {/* 1. LEFT SLIM PILL FLOATING NAVIGATION RAIL                */}
        {/* ======================================================== */}
        <aside className="glassy-nav-rail">
          {/* Top Logo / Emblem */}
          <Link to="/" className="nav-rail-emblem" title="Cybrical Tech Home">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 5v14M18 5v14M2 9h4M18 9h4M2 15h4M18 15h4M6 12h12" />
            </svg>
          </Link>

          {/* Navigation Icon Stack */}
          <div className="nav-rail-group">
            {/* Overview / Home (Active Tab in screenshot) */}
            <button
              className={`nav-rail-btn ${sidebarTab === "overview" ? "active" : ""}`}
              onClick={() => setSidebarTab("overview")}
              title="Overview"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="2" />
                <rect x="14" y="3" width="7" height="7" rx="2" />
                <rect x="14" y="14" width="7" height="7" rx="2" />
                <rect x="3" y="14" width="7" height="7" rx="2" />
              </svg>
              <span className="nav-rail-tooltip">Overview</span>
            </button>

            {/* Analytics */}
            <button
              className={`nav-rail-btn ${sidebarTab === "analytics" ? "active" : ""}`}
              onClick={() => setSidebarTab("analytics")}
              title="Analytics"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
                <path d="M4 17l6-6 4 4 6-8" />
              </svg>
              <span className="nav-rail-tooltip">Analytics</span>
            </button>

            {/* Calendar */}
            <button
              className={`nav-rail-btn ${sidebarTab === "calendar" ? "active" : ""}`}
              onClick={() => setSidebarTab("calendar")}
              title="Calendar & Sessions"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="3" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="nav-rail-tooltip">Calendar</span>
            </button>

            {/* Timer / Stopwatch */}
            <button
              className={`nav-rail-btn ${sidebarTab === "timer" ? "active" : ""}`}
              onClick={() => setSidebarTab("timer")}
              title="Focus Stopwatch"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="13" r="8" />
                <path d="M12 9v4l2 2" />
                <path d="M10 2h4" />
                <path d="M18 5l1.5-1.5" />
              </svg>
              <span className="nav-rail-tooltip">Timer</span>
            </button>

            {/* Community / Team */}
            <button
              className={`nav-rail-btn ${sidebarTab === "community" ? "active" : ""}`}
              onClick={() => setSidebarTab("community")}
              title="Community"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span className="nav-rail-tooltip">Community</span>
            </button>

            {/* Settings */}
            <button
              className={`nav-rail-btn ${sidebarTab === "settings" ? "active" : ""}`}
              onClick={() => setSidebarTab("settings")}
              title="Settings"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span className="nav-rail-tooltip">Settings</span>
            </button>
          </div>

          {/* Bottom Controls */}
          <div className="nav-rail-bottom">
            <button
              className="nav-rail-dot-btn"
              title="Active System Pulse"
              onClick={() => alert("Cybrical Engine v2.4 Active & Synced")}
            >
              <span className="nav-rail-dot" />
            </button>

            <Link to="/" className="nav-rail-btn" title="Back to Cybrical Website">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span className="nav-rail-tooltip">Website</span>
            </Link>
          </div>
        </aside>

        {/* ======================================================== */}
        {/* 2. CENTER MAIN DASHBOARD CANVAS                           */}
        {/* ======================================================== */}
        <main className="glassy-center-canvas">
          {/* TOP HEADER: User Greeting + Search Bar + Notification */}
          <div className="glassy-header-row">
                <div className="greeting-box">
                  <h1 className="greeting-title">
                    {user?.name ? `Good Morning, ${user.name}` : "Welcome to Cybrical Executive Suite"} <span className="greeting-wave">👋</span>
                  </h1>
                  <p className="greeting-subtitle">
                    Cybrical Executive Intelligence & Learning Suite
                  </p>
                </div>

                <div className="header-actions-box">
                  {/* Pill Search Bar */}
                  <div className="pill-search-bar">
                    <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search courses, APIs, blueprints..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Notification Bell Pill */}
                  <button
                    className="bell-pill-btn"
                    onClick={() => setHasNotification(!hasNotification)}
                    title="Notifications"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    {hasNotification && <span className="bell-badge-dot" />}
                  </button>
                </div>
              </div>

              {/* TOP 4 METRIC WIDGET CARDS (Cybrical Analytics Cards) */}
              <div className="glassy-top-metrics-grid">
                {/* 1. Builds & Commits */}
                <div className="metric-white-card">
                  <div className="metric-card-top">
                    <span className="metric-card-label">Builds & Commits</span>
                    <span className="metric-icon-badge green-badge">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <polyline points="16 18 22 12 16 6" />
                        <polyline points="8 6 2 12 8 18" />
                      </svg>
                    </span>
                  </div>
                  <div className="metric-card-body">
                    <div className="metric-card-value">
                      1,428 <span className="metric-unit">Builds/mo</span>
                    </div>
                    {/* Emerald Vertical Bar Micro-Chart */}
                    <div className="micro-bar-chart orange-chart">
                      <span style={{ height: "40%" }} />
                      <span style={{ height: "65%" }} />
                      <span style={{ height: "90%" }} />
                      <span style={{ height: "50%" }} />
                      <span style={{ height: "75%" }} />
                      <span style={{ height: "100%" }} />
                      <span style={{ height: "60%" }} />
                    </div>
                  </div>
                </div>

                {/* 2. API Telemetry */}
                <div className="metric-white-card">
                  <div className="metric-card-top">
                    <span className="metric-card-label">API Latency</span>
                    <span className="metric-icon-badge pink-badge">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </span>
                  </div>
                  <div className="metric-card-body">
                    <div className="metric-card-value">
                      42 <span className="metric-unit">ms / 99.9%</span>
                    </div>
                    {/* Emerald Pulse Waveform SVG */}
                    <div className="micro-wave-chart pink-wave">
                      <svg viewBox="0 0 100 30" preserveAspectRatio="none">
                        <path
                          d="M0 16 L20 16 L27 8 L34 26 L42 5 L48 20 L55 14 L62 16 L100 16"
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="2.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* 3. Project Vault */}
                <div className="metric-white-card">
                  <div className="metric-card-top">
                    <span className="metric-card-label">Project Vault</span>
                    <span className="metric-icon-badge green-badge">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                        <line x1="12" y1="22.08" x2="12" y2="12" />
                      </svg>
                    </span>
                  </div>
                  <div className="metric-card-body">
                    <div className="metric-card-value">
                      63 <span className="metric-unit">ZIPs Active</span>
                    </div>
                    {/* Emerald Radial Arc Gauge SVG */}
                    <div className="micro-arc-chart green-arc">
                      <svg viewBox="0 0 60 36">
                        <path
                          d="M6 30 A24 24 0 0 1 54 30"
                          fill="none"
                          stroke="#e6f4ea"
                          strokeWidth="5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M6 30 A24 24 0 0 1 48 10"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* 4. AI Inference Tokens */}
                <div className="metric-white-card">
                  <div className="metric-card-top">
                    <span className="metric-card-label">AI Inference</span>
                    <span className="metric-icon-badge blue-badge">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.93V17a1 1 0 0 1-2 0v-.07A7.003 7.003 0 0 1 5.07 11H5a1 1 0 0 1 0-2h.07A7.003 7.003 0 0 1 11 3.07V3a1 1 0 0 1 2 0v.07A7.003 7.003 0 0 1 18.93 9H19a1 1 0 0 1 0 2h-.07A7.003 7.003 0 0 1 13 16.93z" />
                      </svg>
                    </span>
                  </div>
                  <div className="metric-card-body">
                    <div className="metric-card-value">
                      2.4M <span className="metric-unit">Tokens/mo</span>
                    </div>
                    {/* Blue Vertical Bar Micro-Chart */}
                    <div className="micro-bar-chart blue-chart">
                      <span style={{ height: "45%" }} />
                      <span style={{ height: "80%" }} />
                      <span style={{ height: "65%" }} />
                      <span style={{ height: "95%" }} />
                      <span style={{ height: "55%" }} />
                      <span style={{ height: "85%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* MIDDLE ROW: Engineering Velocity Spline Chart + Featured SaaS Sprint Card */}
              <div className="glassy-middle-row">
                {/* LEFT CARD: Velocity Spline Area Curve */}
                <div className="activity-tracking-card">
                  <div className="activity-card-header">
                    <h3 className="activity-card-title">Development & Commit Velocity</h3>
                    <div className="activity-dropdown-pill">
                      <span>Weekly Sprints</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>

                  {/* Spline Area Chart Canvas */}
                  <div className="spline-chart-wrapper">
                    {/* Floating Peak Badge e.g. "98.4% Efficiency" */}
                    <div className="spline-peak-badge">
                      <span className="peak-badge-dot" />
                      <span>98.4% Efficiency</span>
                    </div>

                    <svg className="spline-svg" viewBox="0 0 600 160" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="splineEmeraldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                          <stop offset="65%" stopColor="#10b981" stopOpacity="0.12" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Area Fill */}
                      <path
                        d="M 20 135 
                           Q 70 125, 110 100 
                           T 190 95 
                           T 270 90 
                           T 320 40 
                           T 380 85 
                           T 450 75 
                           T 530 65 
                           L 570 68 
                           L 570 155 
                           L 20 155 Z"
                        fill="url(#splineEmeraldGrad)"
                      />

                      {/* Smooth Spline Stroke */}
                      <path
                        d="M 20 135 
                           Q 70 125, 110 100 
                           T 190 95 
                           T 270 90 
                           T 320 40 
                           T 380 85 
                           T 450 75 
                           T 530 65 
                           L 570 68"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                      />

                      {/* Peak Glowing Circle Indicator */}
                      <circle cx="320" cy="40" r="5" fill="#ffffff" stroke="#10b981" strokeWidth="3.5" />
                    </svg>

                    {/* X-Axis Sprint Labels */}
                    <div className="spline-xaxis-labels">
                      <span>Jan</span>
                      <span>Feb</span>
                      <span>Mar</span>
                      <span>Apr</span>
                      <span>May</span>
                      <span>Jun</span>
                      <span>Jul</span>
                      <span>Aug</span>
                      <span>Sep</span>
                      <span>Oct</span>
                    </div>
                  </div>
                </div>

                {/* RIGHT CARD: Full-Stack SaaS Architecture Sprint */}
                <div className="featured-media-card">
                  <div className="featured-card-info">
                    <h3 className="featured-card-title">
                      Full-Stack SaaS Architecture Sprint
                    </h3>
                    <div className="featured-stats-stack">
                      <div className="featured-stat-block">
                        <div className="stat-large-val">12 Modules</div>
                        <div className="stat-small-desc">Curriculum Completed</div>
                      </div>
                      <div className="featured-stat-block">
                        <div className="stat-large-val">428 Commits</div>
                        <div className="stat-small-desc">Production Merged</div>
                      </div>
                    </div>
                  </div>

                  <div className="featured-card-image-box">
                    <img
                      src={IMAGES.runner}
                      alt="Full-Stack Development Sprint"
                      className="featured-cover-img"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80";
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* BOTTOM ROW: Enterprise Learning Roadmap & Milestones (3 Sprints with active highlighted card) */}
              <div className="glassy-bottom-section">
                <div className="bottom-section-header">
                  <div className="section-title-with-bar">
                    <span className="accent-bar-orange" />
                    <h3 className="section-heading-text">Enterprise Learning Roadmap & Milestones</h3>
                  </div>
                  <button className="view-all-link-btn" onClick={() => navigate("/courses/web-development")}>
                    view all 63 ZIPs →
                  </button>
                </div>

                <div className="diet-cards-grid">
                  {/* Sprint 1: MERN Architecture */}
                  <div className="diet-item-card white-diet-card" onClick={() => navigate("/courses/web-development")} style={{ cursor: "pointer" }}>
                    <div className="diet-card-details">
                      <h4 className="diet-card-name">MERN Production Architecture</h4>
                      <p className="diet-card-sub">JWT auth, MongoDB indexes, API gateway & Docker.</p>
                      <span className="diet-day-pill">Sprint 1 • Completed ✅</span>
                    </div>
                    <div className="diet-thumb-circle">
                      <img src={IMAGES.fruits} alt="MERN Architecture" />
                    </div>
                  </div>

                  {/* Sprint 2: AI Agents & Vector RAG (Active Highlighted Card) */}
                  <div className="diet-item-card orange-active-diet-card" onClick={() => navigate("/courses/ai")} style={{ cursor: "pointer" }}>
                    <div className="diet-card-details">
                      <h4 className="diet-card-name">AI Agents & Vector RAG</h4>
                      <p className="diet-card-sub">Multi-model reasoning, embeddings & LangChain.</p>
                      <span className="diet-day-pill white-pill">Sprint 2 • Active ⚡</span>
                    </div>
                    <div className="diet-thumb-circle">
                      <img src={IMAGES.veggies} alt="AI Neural Networks" />
                    </div>
                  </div>

                  {/* Sprint 3: Native Android Development */}
                  <div className="diet-item-card white-diet-card" onClick={() => navigate("/courses/android")} style={{ cursor: "pointer" }}>
                    <div className="diet-card-details">
                      <h4 className="diet-card-name">Native Android & Kotlin</h4>
                      <p className="diet-card-sub">Jetpack Compose, Room database, Play Store builds.</p>
                      <span className="diet-day-pill">Sprint 3 • Upcoming 🚀</span>
                    </div>
                    <div className="diet-thumb-circle">
                      <img
                        src={IMAGES.salad}
                        alt="Android Architecture"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?auto=format&fit=crop&w=300&q=80";
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

        </main>

        {/* ======================================================== */}
        {/* 3. RIGHT TELEMETRY, CALENDAR & SCHEDULE PANEL             */}
        {/* ======================================================== */}
        <aside className="glassy-right-panel">
          {/* Header Bar: Executive Telemetry & Auth Action */}
          <div className="right-panel-header-title">
            <div className="telemetry-badge">
              <span className="telemetry-live-dot" />
              <span>{user ? `Dev: ${user.name}` : "Executive Telemetry"}</span>
            </div>
            {user ? (
              <button className="telemetry-logout-btn" onClick={handleLogout} title="Logout">
                Logout ↗
              </button>
            ) : (
              <Link to="/login" className="telemetry-signin-btn" title="Sign In">
                Login →
              </Link>
            )}
          </div>

          {/* 3 Developer Profile Pills: Skill Tier / Global Rank / Project Vault */}
          <div className="profile-metrics-row">
            <div className="profile-metric-pill">
              <div className="metric-pill-val">Senior Dev</div>
              <div className="metric-pill-sub">Skill Tier</div>
            </div>
            <div className="profile-metric-pill">
              <div className="metric-pill-val">Top 1%</div>
              <div className="metric-pill-sub">Global Rank</div>
            </div>
            <div className="profile-metric-pill">
              <div className="metric-pill-val">63 ZIPs</div>
              <div className="metric-pill-sub">Unlocked Vault</div>
            </div>
          </div>

          {/* MONTHLY CALENDAR WIDGET */}
          <div className="calendar-widget-card">
            <div className="calendar-header-row">
              <span className="calendar-month-name">{calendarMonth}</span>
              <div className="calendar-nav-arrows">
                <button
                  className="cal-arrow-btn"
                  onClick={() => setCalendarMonth("November 2022")}
                  title="Previous month"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  className="cal-arrow-btn"
                  onClick={() => setCalendarMonth("December 2022")}
                  title="Next month"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Weekdays */}
            <div className="calendar-weekdays-row">
              <span>Su</span>
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
            </div>

            {/* Days Grid (Exact replication of reference screenshot) */}
            <div className="calendar-days-grid">
              {/* Empty placeholder days for alignment */}
              <span className="day-cell muted-cell"></span>
              <span className="day-cell muted-cell"></span>
              <span className="day-cell muted-cell"></span>
              <span className="day-cell muted-cell"></span>
              
              {/* Day 1 to 31 */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map((day) => {
                let pillClass = "";
                if (day === 21) pillClass = "pill-green"; // 21 green
                if (day === 22) pillClass = "pill-orange-active"; // 22 orange
                if (day === 25) pillClass = "pill-coral"; // 25 coral
                if (day === 17) pillClass = "dot-green"; // 17 green dot

                return (
                  <button
                    key={day}
                    className={`day-cell ${pillClass} ${selectedDate === day ? "user-selected" : ""}`}
                    onClick={() => setSelectedDate(day)}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SCHEDULED LIVE LABS & MASTERCLASSES LIST */}
          <div className="scheduled-section-box">
            <div className="scheduled-header-row">
              <div className="section-title-with-bar">
                <span className="accent-bar-orange" />
                <h3 className="section-heading-text">Live Labs & Masterclasses</h3>
              </div>
              <button className="view-all-link-btn" onClick={() => navigate("/courses/web-development")}>
                view all
              </button>
            </div>

            <div className="scheduled-items-stack">
              {/* Scheduled Item 1: Microservices Architecture Lab */}
              <div className="scheduled-item-card" onClick={() => navigate("/courses/web-development")} style={{ cursor: "pointer" }}>
                <img src={IMAGES.cardio1} alt="Microservices Architecture Lab" className="scheduled-thumb" />
                <div className="scheduled-info-col">
                  <span className="scheduled-tag">Engineering</span>
                  <h4 className="scheduled-title">Microservices Architecture Lab</h4>
                  <p className="scheduled-sub">Event-driven scaling with Kafka & Docker</p>
                </div>
                <button className="scheduled-more-btn" title="Options">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="5" cy="12" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="19" cy="12" r="2" />
                  </svg>
                </button>
              </div>

              {/* Scheduled Item 2: LLM Fine-Tuning & Prompt Studio */}
              <div className="scheduled-item-card" onClick={() => navigate("/courses/ai")} style={{ cursor: "pointer" }}>
                <img src={IMAGES.cardio2} alt="LLM Fine-Tuning Studio" className="scheduled-thumb" />
                <div className="scheduled-info-col">
                  <span className="scheduled-tag">AI Masterclass</span>
                  <h4 className="scheduled-title">LLM Fine-Tuning & Prompt Studio</h4>
                  <p className="scheduled-sub">LoRA adaptations & multi-turn reasoning</p>
                </div>
                <button className="scheduled-more-btn" title="Options">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="5" cy="12" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="19" cy="12" r="2" />
                  </svg>
                </button>
              </div>

              {/* Scheduled Item 3: 63 Project ZIPs Walkthrough */}
              <div className="scheduled-item-card" onClick={() => navigate("/courses/android")} style={{ cursor: "pointer" }}>
                <img src={IMAGES.cardio3} alt="63 Project ZIPs Walkthrough" className="scheduled-thumb" />
                <div className="scheduled-info-col">
                  <span className="scheduled-tag">LMS Sprints</span>
                  <h4 className="scheduled-title">63 Project ZIPs Walkthrough</h4>
                  <p className="scheduled-sub">Production deployment & offline archives</p>
                </div>
                <button className="scheduled-more-btn" title="Options">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="5" cy="12" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="19" cy="12" r="2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}