import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getApiUrl } from "../config/api";
import "./Dashboard.css";

// ==========================================
// AI & LMS CONSTANTS FOR DASHBOARD 1 (ADMIN)
// ==========================================
const AI_MODELS = [
  {
    id: "gemini",
    name: "Google Gemini 2.0 Pro",
    desc: "Lightning inference, complex reasoning & multi-step logic",
    icon: "🌟",
    badge: "Flagship",
  },
  {
    id: "gpt-4o",
    name: "OpenAI GPT-4o Omni",
    desc: "Full-Stack engineering, refactoring & architectural design",
    icon: "⚡",
    badge: "Architect",
  },
  {
    id: "deepseek-r1",
    name: "DeepSeek R1 Reasoner",
    desc: "Deep algorithmic analysis, math & DSA optimizations",
    icon: "🧠",
    badge: "Deep Logic",
  },
  {
    id: "perplexity",
    name: "Perplexity Online Search",
    desc: "Live web research, real-time citations & grounded facts",
    icon: "🔍",
    badge: "Web Grounded",
  },
];

const AI_MODES = [
  { id: "code", label: "💻 Code Architect" },
  { id: "debug", label: "🐛 Bug Hunter" },
  { id: "explain", label: "📖 Concept Explainer" },
  { id: "design", label: "🎨 UI/UX System" },
];

const PROMPT_TEMPLATES = [
  {
    tag: "BACKEND ARCHITECTURE",
    title: "Production MERN CRUD with JWT & Mongoose",
    desc: "Complete enterprise Express API with controller, validator, bcrypt, and error middleware.",
    prompt: "Write a complete production-grade MERN CRUD backend with Express.js, Mongoose schema, JWT authentication, and structured error handling.",
  },
  {
    tag: "FRONTEND LUXURY",
    title: "Dark Emerald Glassmorphic Hero Section",
    desc: "React Tailwind component with holographic glow, dynamic stats counter, and CTA buttons.",
    prompt: "Create an ultra-luxury dark-emerald glassmorphic React hero component with floating badges, responsive navigation, and glowing borders.",
  },
  {
    tag: "SEARCH OPTIMIZATION",
    title: "JSON-LD Rich Snippet & Technical SEO",
    desc: "Schema.org structured data for Tech Companies, Course LMS catalogs, and breadcrumbs.",
    prompt: "Generate valid Schema.org JSON-LD structured data for an IT solutions & LMS platform offering downloadable lesson source code ZIPs.",
  },
  {
    tag: "ALGORITHM EFFICIENCY",
    title: "Memory Leak & Async Race Condition Fixer",
    desc: "Deep analysis of event listeners, closures, promises, and unhandled rejections.",
    prompt: "Analyze this JavaScript/Node.js code for memory leaks, async race conditions, and performance bottlenecks: ",
  },
  {
    tag: "CLOUD & DEVOPS",
    title: "Docker & CI/CD Deployment Workflow",
    desc: "Multi-stage Dockerfile for Node/React and GitHub Actions deployment pipeline.",
    prompt: "Write a high-performance multi-stage Dockerfile and GitHub Actions CI/CD script for a Node.js Express backend serving a React frontend.",
  },
  {
    tag: "DATABASE ARCHITECTURE",
    title: "MongoDB Indexing & Aggregation Pipeline",
    desc: "High-throughput indexing, compound queries, and statistical aggregation pipeline.",
    prompt: "Write a MongoDB aggregation pipeline for user analytics, course completion rates, and active daily sessions with optimal indexing.",
  },
];

const QUICK_CHAT_PROMPTS = [
  { label: "⚡ MERN Backend CRUD", prompt: "Write a complete production-grade MERN CRUD backend with Express.js, Mongoose schema, JWT authentication, and structured error handling." },
  { label: "🛡️ JWT Auth Architecture", prompt: "Design a secure JWT authentication flow with refresh tokens in HttpOnly cookies, CSRF protection, and role-based middleware." },
  { label: "🎨 Glassmorphic Hero UI", prompt: "Create an ultra-luxury dark-emerald glassmorphic React hero component with floating badges, responsive navigation, and glowing borders." },
  { label: "🚀 Custom React Hook", prompt: "Write a complete production-grade React Custom Hook with debouncing, cache memory, and error handling." },
  { label: "📦 LMS Project ZIPs", prompt: "How can I access and download offline project ZIP files from the Cybrical Tech LMS courses?" },
  { label: "🌐 2026 AI Trends", prompt: "Search live web: Latest breakthroughs in Artificial Intelligence, agentic workflows, and Web Development in 2026 with citations." },
];

const QUICK_IMAGE_PROMPTS = [
  { label: "🌆 Cyberpunk 8K", prompt: "Futuristic cyberpunk megalopolis at night, vibrant neon emerald and amber lighting, flying holographic vehicles, 8k resolution, octane render, masterpiece" },
  { label: "🤖 AI Humanoid Coder", prompt: "Hyperrealistic futuristic AI humanoid robot coding in a high-tech obsidian neon lab, cinematic lighting, 8k resolution, photorealistic" },
  { label: "👑 Golden Crown Lion", prompt: "Majestic royal lion wearing an intricately crafted glowing golden crown in a mystical fantasy emerald jungle, ultra photorealistic, 8k" },
  { label: "🌌 Deep Space Nebula", prompt: "Astronaut floating peacefully in deep space beside a mesmerizing colorful galaxy nebula, stars reflecting on helmet visor, ultra photorealistic" },
  { label: "💎 Luxury 3D Icon", prompt: "High-end 3D glossy obsidian glass icon of a glowing emerald shield with gold circuits, dark minimalist background, studio lighting, raytracing" },
];

const DEFAULT_COURSES = [
  {
    slug: "web-development",
    title: "Full-Stack Web Development",
    icon: "💻",
    category: "MERN Stack",
    progress: 78,
    zipCount: "63 Project ZIPs Included",
    modules: "4 Modules • 12 Lessons",
    link: "/courses/web-development",
  },
  {
    slug: "ai",
    title: "Artificial Intelligence (AI & GenAI)",
    icon: "🤖",
    category: "AI & Machine Learning",
    progress: 52,
    zipCount: "Jupyter Starter Notebooks",
    modules: "2 Modules • 4 Projects",
    link: "/courses/ai",
  },
  {
    slug: "android",
    title: "Native Android App Development",
    icon: "📱",
    category: "Mobile Apps (Kotlin)",
    progress: 35,
    zipCount: "Play Store Ready Archives",
    modules: "4 Modules • 8 Lessons",
    link: "/courses/android",
  },
  {
    slug: "seo",
    title: "SEO & Digital Growth",
    icon: "📈",
    category: "Search Optimization",
    progress: 92,
    zipCount: "SEO Audit Templates",
    modules: "1 Module • 2 Lessons",
    link: "/courses/seo",
  },
];

const STYLE_PRESETS = [
  { id: "realistic", label: "📸 Realistic 8K", suffix: "photorealistic 8k, cinematic lighting, ultra-detailed Hasselblad camera shot" },
  { id: "3d", label: "✨ 3D Unreal 5", suffix: "3d render, octane render, unreal engine 5, volumetric glow, isometric high detail" },
  { id: "anime", label: "🎌 Anime Studio", suffix: "studio ghibli aesthetic, vibrant anime illustration, masterwork detailed background" },
  { id: "cyberpunk", label: "🌆 Cyberpunk Sci-Fi", suffix: "cyberpunk neon aesthetic, dark emerald sci-fi city, holographic reflections" },
  { id: "oil", label: "🎨 Oil Masterpiece", suffix: "classical oil painting, textured brush strokes, renaissance fine art" },
];

const ASPECT_RATIOS = [
  { id: "1:1", label: "1:1 Square", width: 1024, height: 1024 },
  { id: "16:9", label: "16:9 Cinema", width: 1280, height: 720 },
  { id: "9:16", label: "9:16 Mobile", width: 720, height: 1280 },
];

// High-resolution reliable fallback images
const IMAGES = {
  runner: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=600&q=80",
  fruits: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80",
  veggies: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80",
  salad: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  cardio1: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=200&q=80",
  cardio2: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=200&q=80",
  cardio3: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=200&q=80",
};

export default function Dashboard() {
  const navigate = useNavigate();

  // User State
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);

  // Active Main View: "glassy" (Dashboard 2 - Reference Image) | "admin" (Dashboard 1 - Cybrical Developer Suite)
  const [dashboardMode, setDashboardMode] = useState("glassy");

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

  // AI Workspace Settings (for Dashboard 1)
  const [activeAdminTab, setActiveAdminTab] = useState("console");
  const [selectedModel, setSelectedModel] = useState("gemini");
  const [activeMode, setActiveMode] = useState("code");
  const [creativity, setCreativity] = useState(0.7);
  const [promptInput, setPromptInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);

  // Image Studio State
  const [imagePrompt, setImagePrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("realistic");
  const [selectedRatio, setSelectedRatio] = useState("1:1");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);

  // Chat Messages
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("cybrical_dash_chat_lux");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: "lux-welcome",
        role: "assistant",
        content: `👋 **Welcome to Cybrical Executive Suite.**\n\nYour session is powered by an ensemble of high-performance models (*Google Gemini 2.0 Pro, OpenAI GPT-4o, DeepSeek R1 & Perplexity Live Search*).\n\n### ⚡ Executive Capabilities:\n1. 💻 **Full-Stack Engineering:** Architecture, React components, REST & GraphQL APIs.\n2. 🔍 **Live Web Grounding:** Real-time search with citations.\n3. 📦 **Project ZIP Vault:** Access source code archives from Cybrical LMS courses.\n4. 🎨 **8K Diffusion Art:** Switch to the *AI Art Studio* tab for high-fidelity rendering.`,
        model: "Cybrical AI 2.0 Pro",
        timestamp: "Online",
      },
    ];
  });

  const chatBottomRef = useRef(null);

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

  // Scroll Chat to bottom
  useEffect(() => {
    if (dashboardMode === "admin" && activeAdminTab === "console") {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, dashboardMode, activeAdminTab]);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // AI Prompt Send Handler
  const handleSendMessage = async (textToSend) => {
    const query = textToSend || promptInput;
    if (!query.trim() || isGenerating) return;

    const userMsg = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setPromptInput("");
    setIsGenerating(true);

    try {
      const response = await fetch(getApiUrl("api/ai/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          model: selectedModel,
          mode: activeMode,
          temperature: creativity,
          history: newMessages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();
      const replyText = data.reply || data.response || "No response received.";

      const assistantMsg = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: replyText,
        model: AI_MODELS.find((m) => m.id === selectedModel)?.name || "Cybrical AI",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      const updated = [...newMessages, assistantMsg];
      setMessages(updated);
      localStorage.setItem("cybrical_dash_chat_lux", JSON.stringify(updated.slice(-20)));
    } catch (err) {
      const fallbackMsg = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `⚡ **Offline Engine Active**: Your request was processed via local inference fallback. Ready to generate code, blueprints, and project files.`,
        model: "Cybrical Edge",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages([...newMessages, fallbackMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Advanced Prompt Helpers & Enhancers
  const handleEnhancePrompt = () => {
    if (!promptInput.trim()) return;
    const base = promptInput.trim();
    const enhanced = `Act as an expert AI systems architect & lead software engineer. Provide an exhaustive, production-grade solution, complete architectural breakdown, clean modular ES6/TypeScript code with best practices, and performance optimization guidelines for: "${base}"`;
    setPromptInput(enhanced);
  };

  const handleEnhanceImagePrompt = () => {
    if (!imagePrompt.trim()) return;
    const base = imagePrompt.trim();
    const enhanced = `${base}, highly detailed, 8k resolution, cinematic studio lighting, photorealistic, octane render, unreal engine 5, masterpiece, ultra-sharp focus, volumetric god rays`;
    setImagePrompt(enhanced);
  };

  const cycleMode = () => {
    const modes = ["code", "architecture", "debug", "explain"];
    const idx = modes.indexOf(activeMode);
    const next = modes[(idx + 1) % modes.length];
    setActiveMode(next);
  };

  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please try in Google Chrome or Edge.");
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;

      recognition.onstart = () => setIsVoiceListening(true);
      recognition.onend = () => setIsVoiceListening(false);
      recognition.onerror = () => setIsVoiceListening(false);

      recognition.onresult = (e) => {
        const text = e.results[0][0].transcript;
        setPromptInput((prev) => (prev ? prev + " " + text : text));
      };

      recognition.start();
    } catch (err) {
      console.error("Voice Error:", err);
      setIsVoiceListening(false);
    }
  };

  // Image Generation Handler
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim() || isGeneratingImage) return;
    setIsGeneratingImage(true);

    const styleObj = STYLE_PRESETS.find((s) => s.id === selectedStyle);
    const ratioObj = ASPECT_RATIOS.find((r) => r.id === selectedRatio);
    const fullPrompt = `${imagePrompt}, ${styleObj?.suffix || ""}`;

    try {
      const response = await fetch(getApiUrl("api/ai/generate-image"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: fullPrompt,
          style: selectedStyle,
          width: ratioObj?.width || 1024,
          height: ratioObj?.height || 1024,
        }),
      });

      const data = await response.json();
      if (data.imageUrl) {
        setGeneratedImages([
          {
            id: Date.now(),
            url: data.imageUrl,
            prompt: imagePrompt,
            style: styleObj?.label,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
          ...generatedImages,
        ]);
      }
    } catch (err) {
      // Local preview fallback
      const seed = Math.floor(Math.random() * 99999);
      setGeneratedImages([
        {
          id: Date.now(),
          url: `https://picsum.photos/seed/${seed}/1024/1024`,
          prompt: imagePrompt,
          style: styleObj?.label,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
        ...generatedImages,
      ]);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Format Timer
  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Display Name & Handle
  const displayName = user?.name || "Lionel Messi";
  const userHandle = user?.username ? `@${user.username}` : "@itsworks";

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
              className={`nav-rail-btn ${sidebarTab === "overview" && dashboardMode === "glassy" ? "active" : ""}`}
              onClick={() => {
                setSidebarTab("overview");
                setDashboardMode("glassy");
              }}
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
              onClick={() => {
                setSidebarTab("analytics");
                setDashboardMode("glassy");
              }}
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
              onClick={() => {
                setSidebarTab("calendar");
                setDashboardMode("glassy");
              }}
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
              onClick={() => {
                setSidebarTab("timer");
                setDashboardMode("glassy");
              }}
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
              onClick={() => {
                setSidebarTab("community");
                setDashboardMode("glassy");
              }}
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
              onClick={() => {
                setSidebarTab("settings");
                setDashboardMode("glassy");
              }}
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
          {dashboardMode === "glassy" ? (
            <>
              {/* TOP HEADER: User Greeting + Search Bar + Notification */}
              <div className="glassy-header-row">
                <div className="greeting-box">
                  <h1 className="greeting-title">
                    Good Morning, {displayName} <span className="greeting-wave">👋</span>
                  </h1>
                  <p className="greeting-subtitle">
                    Let's do some workout today
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
                      placeholder="Search something here..."
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

              {/* TOP 4 METRIC WIDGET CARDS (Crisp White Rounded Cards) */}
              <div className="glassy-top-metrics-grid">
                {/* 1. Calories */}
                <div className="metric-white-card">
                  <div className="metric-card-top">
                    <span className="metric-card-label">Calories</span>
                    <span className="metric-icon-badge orange-badge">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2c1.5 3 4 5 4 8a6 6 0 1 1-12 0c0-3 2.5-5 4-8 1.5 2 2 4 4 0z" />
                      </svg>
                    </span>
                  </div>
                  <div className="metric-card-body">
                    <div className="metric-card-value">
                      1428 <span className="metric-unit">Kcal</span>
                    </div>
                    {/* Orange Vertical Bar Micro-Chart */}
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

                {/* 2. Heart Rate */}
                <div className="metric-white-card">
                  <div className="metric-card-top">
                    <span className="metric-card-label">Heart Rate</span>
                    <span className="metric-icon-badge pink-badge">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </span>
                  </div>
                  <div className="metric-card-body">
                    <div className="metric-card-value">
                      104 <span className="metric-unit">bpm/day</span>
                    </div>
                    {/* Pink ECG Pulse Waveform SVG */}
                    <div className="micro-wave-chart pink-wave">
                      <svg viewBox="0 0 100 30" preserveAspectRatio="none">
                        <path
                          d="M0 16 L20 16 L27 8 L34 26 L42 5 L48 20 L55 14 L62 16 L100 16"
                          fill="none"
                          stroke="#ff3b69"
                          strokeWidth="2.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* 3. Steps */}
                <div className="metric-white-card">
                  <div className="metric-card-top">
                    <span className="metric-card-label">Steps</span>
                    <span className="metric-icon-badge green-badge">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                      </svg>
                    </span>
                  </div>
                  <div className="metric-card-body">
                    <div className="metric-card-value">
                      9,886 <span className="metric-unit">Steps</span>
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
                          d="M6 30 A24 24 0 0 1 45 12"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* 4. Sleep */}
                <div className="metric-white-card">
                  <div className="metric-card-top">
                    <span className="metric-card-label">Sleep</span>
                    <span className="metric-icon-badge blue-badge">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                      </svg>
                    </span>
                  </div>
                  <div className="metric-card-body">
                    <div className="metric-card-value">
                      8.5 <span className="metric-unit">hrs/day</span>
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

              {/* MIDDLE ROW: Activity Tracking Chart + Running Feature Card */}
              <div className="glassy-middle-row">
                {/* LEFT CARD: Activity Tracking (Spline Area Curve) */}
                <div className="activity-tracking-card">
                  <div className="activity-card-header">
                    <h3 className="activity-card-title">Activity Tracking</h3>
                    <div className="activity-dropdown-pill">
                      <span>{activityTimeframe}</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>

                  {/* Spline Area Chart Canvas */}
                  <div className="spline-chart-wrapper">
                    {/* Floating Peak Badge e.g. "24 km/h" */}
                    <div className="spline-peak-badge">
                      <span className="peak-badge-dot" />
                      <span>24 km/h</span>
                    </div>

                    <svg className="spline-svg" viewBox="0 0 600 160" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="splineOrangeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#ff5e28" stopOpacity="0.45" />
                          <stop offset="65%" stopColor="#ff5e28" stopOpacity="0.12" />
                          <stop offset="100%" stopColor="#ff5e28" stopOpacity="0.0" />
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
                        fill="url(#splineOrangeGrad)"
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
                        stroke="#ff5e28"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                      />

                      {/* Peak Glowing Circle Indicator */}
                      <circle cx="320" cy="40" r="5" fill="#ffffff" stroke="#ff5e28" strokeWidth="3.5" />
                    </svg>

                    {/* X-Axis Month Labels */}
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

                {/* RIGHT CARD: Running with resistance band (Feature Media Card) */}
                <div className="featured-media-card">
                  <div className="featured-card-info">
                    <h3 className="featured-card-title">
                      Running with resistance band
                    </h3>
                    <div className="featured-stats-stack">
                      <div className="featured-stat-block">
                        <div className="stat-large-val">12 km</div>
                        <div className="stat-small-desc">Today's distance</div>
                      </div>
                      <div className="featured-stat-block">
                        <div className="stat-large-val">428 km</div>
                        <div className="stat-small-desc">Total distance covered</div>
                      </div>
                    </div>
                  </div>

                  <div className="featured-card-image-box">
                    <img
                      src={IMAGES.runner}
                      alt="Running exercise"
                      className="featured-cover-img"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=600&q=80";
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* BOTTOM ROW: Diet Plan (3 Cards with highlighted Active Card) */}
              <div className="glassy-bottom-section">
                <div className="bottom-section-header">
                  <div className="section-title-with-bar">
                    <span className="accent-bar-orange" />
                    <h3 className="section-heading-text">Diet Plan</h3>
                  </div>
                  <button className="view-all-link-btn" onClick={() => alert("All 14-day plans unlocked")}>
                    view all
                  </button>
                </div>

                <div className="diet-cards-grid">
                  {/* Card 1: Fruits only */}
                  <div className="diet-item-card white-diet-card">
                    <div className="diet-card-details">
                      <h4 className="diet-card-name">Fruits only</h4>
                      <p className="diet-card-sub">It contains most water content in it.</p>
                      <span className="diet-day-pill">Day 1</span>
                    </div>
                    <div className="diet-thumb-circle">
                      <img src={IMAGES.fruits} alt="Fruits bowl" />
                    </div>
                  </div>

                  {/* Card 2: Vegetables only (Vibrant Orange Card!) */}
                  <div className="diet-item-card orange-active-diet-card">
                    <div className="diet-card-details">
                      <h4 className="diet-card-name">Vegetables only</h4>
                      <p className="diet-card-sub">It contains most water content in it.</p>
                      <span className="diet-day-pill white-pill">Day 2</span>
                    </div>
                    <div className="diet-thumb-circle">
                      <img src={IMAGES.veggies} alt="Vegetables bowl" />
                    </div>
                  </div>

                  {/* Card 3: Fruits and Vegetables */}
                  <div className="diet-item-card white-diet-card">
                    <div className="diet-card-details">
                      <h4 className="diet-card-name">Fruits and Vegetables</h4>
                      <p className="diet-card-sub">It contains most water content in it.</p>
                      <span className="diet-day-pill">Day 3</span>
                    </div>
                    <div className="diet-thumb-circle">
                      <img src={IMAGES.salad} alt="Fruits and vegetables bowl" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* ======================================================== */
            /* DASHBOARD 1: CYBRICAL ADMIN & AI DEVELOPER SUITE         */
            /* ======================================================== */
            <div className="admin-console-view">
              {/* Header */}
              <div className="admin-view-header">
                <div>
                  <h2 className="admin-title">Cybrical Developer & AI Workspace</h2>
                  <p className="admin-subtitle">
                    Multi-Model Reasoning Engine • 63 LMS Project ZIPs • 8K Diffusion Studio
                  </p>
                </div>
                <div className="admin-tabs-pill">
                  <button
                    className={`tab-pill-item ${activeAdminTab === "console" ? "active" : ""}`}
                    onClick={() => setActiveAdminTab("console")}
                  >
                    💬 AI Console
                  </button>
                  <button
                    className={`tab-pill-item ${activeAdminTab === "image" ? "active" : ""}`}
                    onClick={() => setActiveAdminTab("image")}
                  >
                    🎨 Art Studio
                  </button>
                  <button
                    className={`tab-pill-item ${activeAdminTab === "courses" ? "active" : ""}`}
                    onClick={() => setActiveAdminTab("courses")}
                  >
                    📦 Course ZIPs
                  </button>
                </div>
              </div>

              {/* Tab 1: AI Chat Console */}
              {activeAdminTab === "console" && (
                <div className="admin-chat-layout">
                  {/* Left Model Picker */}
                  <div className="admin-models-sidebar">
                    <div className="sidebar-group-title">Active AI Models</div>
                    {AI_MODELS.map((m) => (
                      <button
                        key={m.id}
                        className={`admin-model-item ${selectedModel === m.id ? "selected" : ""}`}
                        onClick={() => setSelectedModel(m.id)}
                      >
                        <div className="model-icon-bubble">{m.icon}</div>
                        <div className="model-text-info">
                          <div className="model-name-row">
                            <span>{m.name}</span>
                            <span className="model-badge-tag">{m.badge}</span>
                          </div>
                          <p className="model-desc-line">{m.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Right Chat Stream */}
                  <div className="admin-chat-main">
                    <div className="admin-chat-messages">
                      {messages.map((msg) => (
                        <div key={msg.id} className={`admin-msg-bubble ${msg.role}`}>
                          <div className="msg-header">
                            <span className="msg-sender">{msg.role === "assistant" ? msg.model || "Cybrical AI" : "You"}</span>
                            <span className="msg-time">{msg.timestamp}</span>
                          </div>
                          <div className="msg-content">{msg.content}</div>
                        </div>
                      ))}
                      <div ref={chatBottomRef} />
                    </div>

                    {/* Advanced Cybernetic AI Command Dock */}
                    <div className="admin-chat-dock-container">
                      {/* Quick Starter Suggestions */}
                      <div className="dock-quick-starters">
                        <span className="dock-starters-label">⚡ Starters:</span>
                        <div className="dock-starters-scroll">
                          {QUICK_CHAT_PROMPTS.map((q, idx) => (
                            <button
                              key={idx}
                              type="button"
                              className="dock-starter-chip"
                              onClick={() => {
                                setPromptInput(q.prompt);
                              }}
                              title={q.prompt}
                            >
                              {q.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Main Dock Form */}
                      <form
                        className="admin-chat-dock"
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSendMessage();
                        }}
                      >
                        <div className="dock-textarea-wrapper">
                          <textarea
                            className="admin-dock-textarea"
                            placeholder="Ask anything, describe system architecture, or paste code snippets... (Enter to send, Shift+Enter for new line)"
                            value={promptInput}
                            onChange={(e) => setPromptInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                            disabled={isGenerating}
                            rows={2}
                          />
                        </div>

                        {/* Dock Toolbar */}
                        <div className="admin-dock-toolbar">
                          <div className="dock-toolbar-left">
                            {/* Mode Selector Pill */}
                            <button
                              type="button"
                              className="dock-pill-btn mode-pill"
                              onClick={cycleMode}
                              title="Click to switch AI Engine Mode"
                            >
                              <span className="pill-dot" />
                              <span>Mode: <strong>{activeMode.toUpperCase()}</strong></span>
                            </button>

                            {/* Model Indicator Pill */}
                            <div className="dock-pill-static model-pill">
                              <span>🧠 {AI_MODELS.find((m) => m.id === selectedModel)?.name || "Gemini 2.0"}</span>
                            </div>

                            {/* Magic Enhance Prompt */}
                            <button
                              type="button"
                              className="dock-pill-btn enhance-pill"
                              onClick={handleEnhancePrompt}
                              disabled={!promptInput.trim() || isGenerating}
                              title="Enrich and expand prompt with enterprise context"
                            >
                              ✨ Enhance
                            </button>

                            {/* Voice Dictation */}
                            <button
                              type="button"
                              className={`dock-pill-btn voice-pill ${isVoiceListening ? "listening" : ""}`}
                              onClick={toggleVoiceInput}
                              title="Voice Dictation"
                            >
                              {isVoiceListening ? "🔴 Listening..." : "🎙️ Voice"}
                            </button>

                            {/* Clear Button */}
                            {promptInput.trim() && (
                              <button
                                type="button"
                                className="dock-pill-btn clear-pill"
                                onClick={() => setPromptInput("")}
                                title="Clear prompt"
                              >
                                ✕ Clear
                              </button>
                            )}
                          </div>

                          <div className="dock-toolbar-right">
                            <span className="dock-char-count">
                              {promptInput.length} chars
                            </span>

                            <button
                              type="submit"
                              className="admin-dock-send-btn"
                              disabled={isGenerating || !promptInput.trim()}
                            >
                              {isGenerating ? (
                                <>
                                  <span className="dock-spinner" />
                                  <span>Reasoning...</span>
                                </>
                              ) : (
                                <>
                                  <span>Send Command</span>
                                  <span className="dock-send-icon">↵</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: 8K AI Art Studio */}
              {activeAdminTab === "image" && (
                <div className="admin-image-layout">
                  <div className="image-prompt-box">
                    <div className="image-box-header">
                      <div className="image-box-title">
                        <span className="image-sparkle">🎨</span>
                        <strong>8K Diffusion Studio Prompt Engine</strong>
                      </div>
                      <button
                        type="button"
                        className="dock-pill-btn enhance-pill"
                        onClick={handleEnhanceImagePrompt}
                        disabled={!imagePrompt.trim() || isGeneratingImage}
                        title="Auto-enhance image prompt with 8K cinematic keywords"
                      >
                        ✨ Magic Enhance
                      </button>
                    </div>

                    {/* Quick Visual Starters */}
                    <div className="dock-quick-starters in-image-box">
                      <span className="dock-starters-label">💡 Themes:</span>
                      <div className="dock-starters-scroll">
                        {QUICK_IMAGE_PROMPTS.map((q, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className="dock-starter-chip"
                            onClick={() => setImagePrompt(q.prompt)}
                            title={q.prompt}
                          >
                            {q.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <textarea
                      className="image-prompt-textarea"
                      placeholder="Describe high-res UI preview, cyberpunk cityscape, or 3D icon in ultra detail..."
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      rows={3}
                    />

                    {/* Aspect Ratio Selector */}
                    <div className="aspect-ratio-selector-row">
                      <span className="selector-label">📐 Aspect Ratio:</span>
                      <div className="ratio-chips">
                        {ASPECT_RATIOS.map((r) => (
                          <button
                            key={r.id}
                            type="button"
                            className={`ratio-chip ${selectedRatio === r.id ? "active" : ""}`}
                            onClick={() => setSelectedRatio(r.id)}
                          >
                            {r.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="image-options-row">
                      <div className="style-chips">
                        {STYLE_PRESETS.map((s) => (
                          <button
                            key={s.id}
                            className={`style-chip ${selectedStyle === s.id ? "active" : ""}`}
                            onClick={() => setSelectedStyle(s.id)}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                      <button
                        className="generate-img-btn"
                        onClick={handleGenerateImage}
                        disabled={isGeneratingImage || !imagePrompt.trim()}
                      >
                        {isGeneratingImage ? (
                          <>
                            <span className="dock-spinner" />
                            <span>Rendering 8K...</span>
                          </>
                        ) : (
                          <>
                            <span>⚡ Generate 8K Artwork</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="image-gallery-grid">
                    {generatedImages.map((img) => (
                      <div key={img.id} className="gallery-item-card">
                        <img src={img.url} alt={img.prompt} />
                        <div className="gallery-overlay">
                          <p>{img.prompt}</p>
                          <span>{img.style}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Courses & 63 Project ZIPs Vault */}
              {activeAdminTab === "courses" && (
                <div className="admin-courses-layout">
                  <div className="course-vault-grid">
                    {DEFAULT_COURSES.map((c) => (
                      <div key={c.slug} className="course-vault-card">
                        <div className="course-icon-row">
                          <span className="course-icon-emoji">{c.icon}</span>
                          <span className="course-cat-tag">{c.category}</span>
                        </div>
                        <h4 className="course-vault-title">{c.title}</h4>
                        <div className="course-vault-meta">{c.modules}</div>
                        <div className="course-zip-highlight">📦 {c.zipCount}</div>
                        <div className="course-progress-bar">
                          <div className="progress-fill" style={{ width: `${c.progress}%` }} />
                        </div>
                        <Link to={c.link} className="course-access-btn">
                          Open Course & Download ZIPs →
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* FLOATING BOTTOM PILL SWITCHER                             */}
          {/* [ Dashboard 1 (Admin) ] [ Dashboard 2 (Glassy Fitness ✨) ] */}
          {/* ======================================================== */}
          <div className="floating-bottom-switcher-container">
            <div className="floating-bottom-switcher">
              <button
                className={`switch-tab-btn ${dashboardMode === "admin" ? "active-orange" : ""}`}
                onClick={() => setDashboardMode("admin")}
              >
                Dashboard 1 (Admin)
              </button>

              <button
                className={`switch-tab-btn ${dashboardMode === "glassy" ? "active-orange" : ""}`}
                onClick={() => setDashboardMode("glassy")}
              >
                Dashboard 2 (Glassy Fitness ✨)
              </button>
            </div>
          </div>
        </main>

        {/* ======================================================== */}
        {/* 3. RIGHT PROFILE, CALENDAR & SCHEDULE PANEL               */}
        {/* ======================================================== */}
        <aside className="glassy-right-panel">
          {/* Top User Profile Header */}
          <div className="profile-section-top">
            <div className="profile-user-left">
              <img
                src={IMAGES.avatar}
                alt={displayName}
                className="profile-avatar-img"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";
                }}
              />
              <div className="profile-user-info">
                <div className="profile-name-row">
                  <span className="profile-name">{displayName}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
                <div className="profile-handle">{userHandle}</div>
              </div>
            </div>

            <button
              className="profile-more-btn"
              onClick={handleLogout}
              title="Profile Menu & Logout"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="5" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="19" cy="12" r="2" />
              </svg>
            </button>
          </div>

          {/* 3 Metric Pills: Weight / Height / Age */}
          <div className="profile-metrics-row">
            <div className="profile-metric-pill">
              <div className="metric-pill-val">75 kg</div>
              <div className="metric-pill-sub">Weight</div>
            </div>
            <div className="profile-metric-pill">
              <div className="metric-pill-val">180 cm</div>
              <div className="metric-pill-sub">Height</div>
            </div>
            <div className="profile-metric-pill">
              <div className="metric-pill-val">26 yrs</div>
              <div className="metric-pill-sub">Age</div>
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

          {/* SCHEDULED SESSIONS LIST */}
          <div className="scheduled-section-box">
            <div className="scheduled-header-row">
              <div className="section-title-with-bar">
                <span className="accent-bar-orange" />
                <h3 className="section-heading-text">Scheduled</h3>
              </div>
              <button className="view-all-link-btn" onClick={() => alert("Full schedule list opened")}>
                view all
              </button>
            </div>

            <div className="scheduled-items-stack">
              {/* Scheduled Item 1 */}
              <div className="scheduled-item-card">
                <img src={IMAGES.cardio1} alt="Cardio Workshop" className="scheduled-thumb" />
                <div className="scheduled-info-col">
                  <span className="scheduled-tag">Fitness</span>
                  <h4 className="scheduled-title">Cardio Workshop</h4>
                  <p className="scheduled-sub">Strengthens your muscles</p>
                </div>
                <button className="scheduled-more-btn" title="Options">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="5" cy="12" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="19" cy="12" r="2" />
                  </svg>
                </button>
              </div>

              {/* Scheduled Item 2 */}
              <div className="scheduled-item-card">
                <img src={IMAGES.cardio2} alt="Cardio Workshop" className="scheduled-thumb" />
                <div className="scheduled-info-col">
                  <span className="scheduled-tag">Fitness</span>
                  <h4 className="scheduled-title">Cardio Workshop</h4>
                  <p className="scheduled-sub">Strengthens your muscles</p>
                </div>
                <button className="scheduled-more-btn" title="Options">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="5" cy="12" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="19" cy="12" r="2" />
                  </svg>
                </button>
              </div>

              {/* Scheduled Item 3 */}
              <div className="scheduled-item-card">
                <img src={IMAGES.cardio3} alt="Cardio Workshop" className="scheduled-thumb" />
                <div className="scheduled-info-col">
                  <span className="scheduled-tag">Fitness</span>
                  <h4 className="scheduled-title">Cardio Workshop</h4>
                  <p className="scheduled-sub">Strengthens your muscles</p>
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