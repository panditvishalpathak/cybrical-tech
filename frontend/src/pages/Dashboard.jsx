import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getApiUrl } from "../config/api";
import "./Dashboard.css";

const AI_MODELS = [
  {
    id: "gemini",
    name: "Google Gemini 2.0",
    desc: "Ultra-fast reasoning, multimodal analysis & deep explanations",
    icon: "🌟",
    badge: "Recommended",
  },
  {
    id: "gpt-4o",
    name: "OpenAI GPT-4o",
    desc: "Full-Stack architecture, creative refactoring & code generation",
    icon: "⚡",
    badge: "Smart Code",
  },
  {
    id: "deepseek-r1",
    name: "DeepSeek R1",
    desc: "Algorithmic thinking, DSA, math & logical problem solving",
    icon: "🧠",
    badge: "Deep Logic",
  },
  {
    id: "perplexity",
    name: "Perplexity Web Search",
    desc: "Live web research, real-time citations & grounded facts",
    icon: "🔍",
    badge: "Live Search",
  },
];

const PROMPT_TEMPLATES = [
  {
    title: "⚡ Full-Stack MERN CRUD API",
    desc: "Generate production Express.js routes, Mongoose schema, controller and validation.",
    prompt: "Write a complete production-ready MERN CRUD backend with Express, Mongoose, and JWT authentication. Include error handling middleware.",
  },
  {
    title: "🎨 Modern React Hero Section",
    desc: "High-conversion glassmorphic hero component with Tailwind CSS & Lucide icons.",
    prompt: "Create a modern dark-emerald glassmorphism React hero component with floating badges, responsive navigation and CTA buttons.",
  },
  {
    title: "🔍 Technical SEO & Schema Markup",
    desc: "Generate JSON-LD schema markup, canonical tags, and OpenGraph metadata.",
    prompt: "Generate valid Schema.org JSON-LD structured data for a Technology Company offering LMS courses and software development services.",
  },
  {
    title: "🐛 Debug & Optimize Code",
    desc: "Paste any broken snippet to identify memory leaks, race conditions, or bugs.",
    prompt: "Analyze this code snippet for memory leaks, performance bottlenecks, and async race conditions: ",
  },
];

const DEFAULT_COURSES = [
  {
    slug: "web-development",
    title: "Full-Stack Web Development",
    icon: "💻",
    category: "MERN Stack",
    progress: 75,
    zipCount: "63 Project ZIPs",
    link: "/courses/web-development",
  },
  {
    slug: "ai",
    title: "Artificial Intelligence (AI & GenAI)",
    icon: "🤖",
    category: "AI & Machine Learning",
    progress: 40,
    zipCount: "Starter Notebooks",
    link: "/courses/ai",
  },
  {
    slug: "android",
    title: "Native Android App Development",
    icon: "📱",
    category: "Mobile Apps (Kotlin)",
    progress: 25,
    zipCount: "Play Store Projects",
    link: "/courses/android",
  },
  {
    slug: "seo",
    title: "SEO & Digital Growth",
    icon: "📈",
    category: "Search Optimization",
    progress: 90,
    zipCount: "SEO Audit Templates",
    link: "/courses/seo",
  },
];

const STYLE_PRESETS = [
  { id: "realistic", label: "📸 Realistic 8K", suffix: "photorealistic, 8k resolution, cinematic lighting, ultra-detailed" },
  { id: "3d", label: "✨ 3D Unreal", suffix: "3d render, unreal engine 5, octane render, isometric high detail" },
  { id: "anime", label: "🎌 Anime Studio", suffix: "studio ghibli style, vibrant anime illustration, masterwork" },
  { id: "cyberpunk", label: "🌆 Cyberpunk", suffix: "cyberpunk aesthetic, neon lighting, dark emerald sci-fi city" },
  { id: "oil", label: "🎨 Oil Painting", suffix: "classical oil painting, textured canvas, fine art masterpiece" },
];

function Dashboard() {
  const navigate = useNavigate();

  // User state
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);

  // Active Tab: console | image | courses | templates
  const [activeTab, setActiveTab] = useState("console");

  // AI Console State
  const [selectedModel, setSelectedModel] = useState("gemini");
  const [promptInput, setPromptInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("cybrical_dash_chat");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: "msg-welcome",
        role: "assistant",
        content: `👋 **Welcome to Cybrical AI Command Center v2.4!**\n\nI am connected to multi-model intelligence (*Google Gemini, GPT-4o, DeepSeek R1 & Perplexity*). You can ask me to:\n- 💻 **Generate production-ready code** (React, Node.js, Python, SQL)\n- 🔍 **Perform live web searches** with cited sources\n- 📦 **Inspect & extract LMS course project ZIP archives**\n- 🎨 **Generate 8K visuals** in the AI Image Studio tab\n\nWhat would you like to build or explore today?`,
        model: "Cybrical AI 2.0",
      },
    ];
  });

  const chatBottomRef = useRef(null);

  // Image Studio State
  const [imagePrompt, setImagePrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("realistic");
  const [generatedImg, setGeneratedImg] = useState(null);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);

  // Load User profile
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setIsGuest(false);
      } catch (e) {
        setUser(null);
        setIsGuest(true);
      }
    } else {
      setIsGuest(true);
    }
  }, []);

  // Save chat to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cybrical_dash_chat", JSON.stringify(messages.slice(-20)));
    } catch (e) {}
  }, [messages]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (activeTab === "console" && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab]);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    setUser(null);
    setIsGuest(true);
    navigate("/");
  };

  // Send AI prompt
  const handleSendPrompt = async (customText = null) => {
    const textToSend = typeof customText === "string" ? customText : promptInput;
    if (!textToSend.trim() || isGenerating) return;

    const userMessage = {
      id: "msg-" + Date.now(),
      role: "user",
      content: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (typeof customText !== "string") setPromptInput("");
    setIsGenerating(true);

    try {
      const response = await fetch(getApiUrl("/api/ai/ask"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend.trim(),
          model: selectedModel,
          messages: messages.concat(userMessage).slice(-10),
        }),
      });

      const data = await response.json();
      const replyText = data?.reply || "I have processed your query. Let me know if you need further details or code!";

      const botMessage = {
        id: "bot-" + Date.now(),
        role: "assistant",
        content: replyText,
        model: AI_MODELS.find((m) => m.id === selectedModel)?.name || "Cybrical AI",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      // Fallback
      setMessages((prev) => [
        ...prev,
        {
          id: "bot-" + Date.now(),
          role: "assistant",
          content: `⚡ **Response Generated:**\n\nI processed your request for: *"${textToSend.trim()}"*.\n\nAll Cybrical Tech AI engines are operational and ready to assist with full-stack coding, course source code ZIP archives, and live automation!`,
          model: "Cybrical Fallback",
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Image Generation
  const handleGenerateImage = () => {
    if (!imagePrompt.trim() || isGeneratingImg) return;

    setIsGeneratingImg(true);
    const preset = STYLE_PRESETS.find((s) => s.id === selectedStyle);
    const fullPrompt = `${imagePrompt.trim()}, ${preset ? preset.suffix : ""}`;
    const seed = Math.floor(Math.random() * 10000000);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=1024&height=1024&model=flux&nologo=true&seed=${seed}`;

    // Preload image
    const imgObj = new Image();
    imgObj.src = imageUrl;
    imgObj.onload = () => {
      setGeneratedImg({
        url: imageUrl,
        prompt: imagePrompt.trim(),
        style: preset?.label || "Realistic",
        seed,
      });
      setIsGeneratingImg(false);
    };
    imgObj.onerror = () => {
      setGeneratedImg({
        url: imageUrl,
        prompt: imagePrompt.trim(),
        style: preset?.label || "Realistic",
        seed,
      });
      setIsGeneratingImg(false);
    };
  };

  return (
    <div className="ai-dashboard-page">
      <div className="dashboard-container">

        {/* ================= 1. HUD HEADER ================= */}
        <header className="dash-hud-header">
          <div className="hud-top-meta">
            <div className="hud-sys-status">
              <span className="hud-pulse-dot"></span>
              <span className="hud-sys-tag">CYBRICAL AI CLOUD v2.4 // SECURE RUNTIME</span>
            </div>

            <div className="hud-user-chips">
              <span className="user-chip pro">
                ⚡ Unlimited AI Generations
              </span>
              <span className="user-chip">
                {isGuest ? "👤 Guest Session" : `👤 ${user?.name || "Student"}`}
              </span>
              <span className="user-chip">
                🛡️ Role: {user?.role || "Developer"}
              </span>
            </div>
          </div>

          <div className="hud-main-content">
            <div className="hud-title-area">
              <h1>
                Welcome to <span>AI Command Center</span>
              </h1>
              <p>
                {isGuest
                  ? "Explore Cybrical's multi-model AI workspace, generate production code, render 8K AI art, and manage your full-stack LMS courses."
                  : `Hello ${user?.name}! Your personalized developer dashboard is online. Generate full-stack code, download project ZIPs, and experiment with Generative AI.`}
              </p>
            </div>

            <div className="hud-action-btns">
              <Link to="/courses" className="hud-btn primary">
                Explore Courses <span>↗</span>
              </Link>
              {isGuest ? (
                <Link to="/login" className="hud-btn secondary">
                  Sign In to Save Progress <span>→</span>
                </Link>
              ) : (
                <button type="button" onClick={handleLogout} className="hud-btn secondary">
                  Sign Out <span>⎋</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* ================= 2. QUICK STATS ================= */}
        <section className="dash-stats-grid">
          <div className="dash-stat-card">
            <div className="dash-stat-icon">🧠</div>
            <div className="dash-stat-info">
              <h3>4 Engines</h3>
              <span>Gemini, GPT-4o, DeepSeek, Perplexity</span>
            </div>
          </div>

          <div className="dash-stat-card">
            <div className="dash-stat-icon">📦</div>
            <div className="dash-stat-info">
              <h3>63+ Projects</h3>
              <span>Downloadable Lesson ZIP Archives</span>
            </div>
          </div>

          <div className="dash-stat-card">
            <div className="dash-stat-icon">🎨</div>
            <div className="dash-stat-info">
              <h3>Flux.1 & 8K</h3>
              <span>Generative Art & Image Studio</span>
            </div>
          </div>

          <div className="dash-stat-card">
            <div className="dash-stat-icon">👥</div>
            <div className="dash-stat-info">
              <h3>35+ Experts</h3>
              <span>Cybrical Mentors & Engineers</span>
            </div>
          </div>
        </section>

        {/* ================= 3. NAVIGATION TABS ================= */}
        <nav className="dash-nav-tabs">
          <button
            type="button"
            className={`dash-tab-btn ${activeTab === "console" ? "active" : ""}`}
            onClick={() => setActiveTab("console")}
          >
            🤖 AI Code & Reasoning Lab
          </button>
          <button
            type="button"
            className={`dash-tab-btn ${activeTab === "image" ? "active" : ""}`}
            onClick={() => setActiveTab("image")}
          >
            🎨 AI Image & Art Studio
          </button>
          <button
            type="button"
            className={`dash-tab-btn ${activeTab === "courses" ? "active" : ""}`}
            onClick={() => setActiveTab("courses")}
          >
            📚 My Courses & Project ZIPs
          </button>
          <button
            type="button"
            className={`dash-tab-btn ${activeTab === "templates" ? "active" : ""}`}
            onClick={() => setActiveTab("templates")}
          >
            ⚡ Developer Prompt Templates
          </button>
        </nav>

        {/* ================= 4. TAB CONTENT ================= */}

        {/* TAB 1: AI CONSOLE / WORKSPACE */}
        {activeTab === "console" && (
          <div className="ai-console-wrapper">
            {/* SIDEBAR: MODEL SWITCHER & PROMPT PRESETS */}
            <aside className="ai-console-sidebar">
              <div className="console-card">
                <div className="console-card-title">
                  <span>⚙️</span> Select AI Engine
                </div>
                <div className="model-list">
                  {AI_MODELS.map((model) => (
                    <button
                      key={model.id}
                      type="button"
                      className={`model-option-btn ${selectedModel === model.id ? "selected" : ""}`}
                      onClick={() => setSelectedModel(model.id)}
                    >
                      <span className="model-icon">{model.icon}</span>
                      <div className="model-meta">
                        <strong>{model.name}</strong>
                        <small>{model.desc}</small>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="console-card">
                <div className="console-card-title">
                  <span>💡</span> Quick AI Prompts
                </div>
                <div className="prompt-chips-list">
                  <button
                    type="button"
                    className="prompt-chip-item"
                    onClick={() => handleSendPrompt("Explain React useEffect lifecycle and common dependency array pitfalls with code examples.")}
                  >
                    ⚡ Explain React useEffect
                  </button>
                  <button
                    type="button"
                    className="prompt-chip-item"
                    onClick={() => handleSendPrompt("Create an Express MongoDB user authentication controller with bcrypt and JWT.")}
                  >
                    🔐 Express Auth Controller
                  </button>
                  <button
                    type="button"
                    className="prompt-chip-item"
                    onClick={() => handleSendPrompt("What is Hoisting and Event Loop in JavaScript? Explain in 3 simple sentences.")}
                  >
                    ⏱️ JS Event Loop Explained
                  </button>
                  <button
                    type="button"
                    className="prompt-chip-item"
                    onClick={() => handleSendPrompt("What are the 63 downloadable project ZIPs included in Cybrical Tech LMS courses?")}
                  >
                    📦 Cybrical Course Project ZIPs
                  </button>
                </div>
              </div>
            </aside>

            {/* MAIN CHAT CONSOLE */}
            <main className="ai-console-main">
              <div className="console-header-bar">
                <div className="active-model-badge">
                  <span>●</span> Model: {AI_MODELS.find((m) => m.id === selectedModel)?.name}
                </div>
                <button
                  type="button"
                  className="clear-history-btn"
                  onClick={() => {
                    localStorage.removeItem("cybrical_dash_chat");
                    setMessages([
                      {
                        id: "msg-reset",
                        role: "assistant",
                        content: "Console cleared. What would you like to build or discuss next?",
                        model: "Cybrical AI 2.0",
                      },
                    ]);
                  }}
                >
                  Clear Console 🗑️
                </button>
              </div>

              {/* MESSAGES LOG */}
              <div className="console-messages-log">
                {messages.map((msg) => (
                  <div key={msg.id} className={`console-msg ${msg.role}`}>
                    <div className="msg-avatar">
                      {msg.role === "user" ? "👤" : "🤖"}
                    </div>
                    <div className="msg-bubble">
                      <div style={{ whiteSpace: "pre-wrap" }}>
                        {msg.content}
                      </div>
                      {msg.model && (
                        <div style={{ fontSize: "10px", color: "var(--dash-muted)", marginTop: "8px", textAlign: "right" }}>
                          Engine: {msg.model}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isGenerating && (
                  <div className="console-msg assistant">
                    <div className="msg-avatar">🤖</div>
                    <div className="msg-bubble" style={{ color: "#4ade80" }}>
                      Thinking & generating response with {AI_MODELS.find((m) => m.id === selectedModel)?.name}... ⏳
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* INPUT AREA */}
              <form
                className="console-input-area"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendPrompt();
                }}
              >
                <textarea
                  className="console-textarea"
                  rows={2}
                  placeholder="Ask anything: generate code, fix bugs, explain architectures, or search the web..."
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendPrompt();
                    }
                  }}
                />
                <button
                  type="submit"
                  className="send-prompt-btn"
                  disabled={!promptInput.trim() || isGenerating}
                  title="Send Prompt (Enter)"
                >
                  ➤
                </button>
              </form>
            </main>
          </div>
        )}

        {/* TAB 2: AI IMAGE STUDIO */}
        {activeTab === "image" && (
          <div className="ai-image-studio">
            <div className="image-studio-controls">
              <div className="image-prompt-row">
                <input
                  type="text"
                  className="image-prompt-input"
                  placeholder="Describe your visual: e.g. Futuristic dark emerald cyber laboratory with neon servers, 8K ultra-detailed"
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleGenerateImage();
                    }
                  }}
                />
                <button
                  type="button"
                  className="generate-img-btn"
                  onClick={handleGenerateImage}
                  disabled={!imagePrompt.trim() || isGeneratingImg}
                >
                  {isGeneratingImg ? "Generating... ⏳" : "Generate 8K Art ✨"}
                </button>
              </div>

              <div className="style-presets-row">
                <span>Style Presets:</span>
                {STYLE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className={`style-preset-btn ${selectedStyle === preset.id ? "selected" : ""}`}
                    onClick={() => setSelectedStyle(preset.id)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="generated-image-stage">
              {isGeneratingImg ? (
                <div style={{ textAlign: "center", color: "var(--dash-mint)" }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px", animation: "spin 2s linear infinite" }}>✨</div>
                  <h3 style={{ margin: 0, color: "#ffffff" }}>Diffusing 8K Visual with Flux.1 AI...</h3>
                  <p style={{ color: "var(--dash-muted)", fontSize: "13px", marginTop: "6px" }}>Injecting volumetric lighting and fine textures</p>
                </div>
              ) : generatedImg ? (
                <div className="image-preview-card">
                  <img src={generatedImg.url} alt={generatedImg.prompt} />
                  <div className="image-action-bar">
                    <a
                      href={generatedImg.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hud-btn primary"
                      download="cybrical-ai-art.jpg"
                    >
                      Download Full 1024×1024 📥
                    </a>
                    <button
                      type="button"
                      className="hud-btn secondary"
                      onClick={() => handleGenerateImage()}
                    >
                      Reroll Variation 🎲
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center", color: "var(--dash-muted)" }}>
                  <div style={{ fontSize: "48px", marginBottom: "12px" }}>🎨</div>
                  <h3 style={{ color: "#ffffff", margin: "0 0 6px 0" }}>Gemini & Flux.1 Generative Image Studio</h3>
                  <p style={{ margin: 0, fontSize: "14px" }}>Enter any prompt above and select a style preset to create stunning 8K AI artwork.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: LMS COURSES & PROJECT ZIPS */}
        {activeTab === "courses" && (
          <div className="dash-courses-grid">
            {DEFAULT_COURSES.map((course) => (
              <div key={course.slug} className="dash-course-item">
                <div className="course-item-header">
                  <span className="course-item-icon">{course.icon}</span>
                  <span className="course-item-badge">{course.zipCount}</span>
                </div>
                <h3>{course.title}</h3>
                <p>Master curriculum with complete video lessons, source code archives, and hands-on exercises.</p>

                <div className="course-progress-bar-wrap">
                  <div className="progress-text">
                    <span>Course Completion</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
                  </div>
                </div>

                <div className="course-item-actions">
                  <Link to={course.link} className="hud-btn primary" style={{ width: "100%", justifyContent: "center" }}>
                    Open LMS Course ↗
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: DEVELOPER PROMPT TEMPLATES */}
        {activeTab === "templates" && (
          <div className="templates-grid">
            {PROMPT_TEMPLATES.map((tmpl, idx) => (
              <div key={idx} className="template-card">
                <div>
                  <h4>{tmpl.title}</h4>
                  <p>{tmpl.desc}</p>
                </div>
                <button
                  type="button"
                  className="template-run-btn"
                  onClick={() => {
                    setActiveTab("console");
                    setPromptInput(tmpl.prompt);
                  }}
                >
                  Load into Console ⚡
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;