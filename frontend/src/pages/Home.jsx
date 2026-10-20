import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getApiUrl } from "../config/api";
import "./Home.css";
import logo from "../assets/logo/cybrical logo.jpg";
import team1 from "../assets/images/team/team-1.jpeg";
import team2 from "../assets/images/team/team-2.jpeg";
import team3 from "../assets/images/team/team-3.jpeg";

const defaultHomePhotos = [
  {
    id: "01",
    image: team1,
    title: "Our Team at Work",
    subtitle: "Everyday problem solving, rapid development, and creative collaboration.",
    tag: "Workplace",
  },
  {
    id: "02",
    image: team2,
    title: "Team Spirit & Patriotism",
    subtitle: "Unified energy, engineering passion, and building world-class tech together.",
    tag: "Team Spirit",
  },
  {
    id: "03",
    image: team3,
    title: "Life at Cybrical Tech",
    subtitle: "Celebrations, shared victories, and a warm community of builders.",
    tag: "Community",
  },
];

const defaultFeaturedCourses = [
  {
    slug: "web-development",
    title: "Full-Stack Web Development",
    category: "Full Stack MERN",
    description:
      "Master modern web development: HTML5, CSS3, JavaScript, React.js, Node.js, Express & MongoDB with downloadable project ZIPs for each lesson.",
    level: "Beginner to Advanced",
    duration: "12 Weeks",
    icon: "💻",
    badge: "Most Popular",
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "ai",
    title: "Artificial Intelligence (AI & GenAI)",
    category: "AI & Machine Learning",
    description:
      "Deep dive into Python, Machine Learning, Deep Neural Networks, and Generative AI models with starter project archives and notebooks.",
    level: "Beginner to Advanced",
    duration: "16 Weeks",
    icon: "🤖",
    badge: "Trending",
    thumbnail:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "android",
    title: "Native Android App Development",
    category: "Mobile Apps",
    description:
      "Build production-grade Android apps with Kotlin, Jetpack Compose, MVVM Architecture, Room Database, and Google Play Store deployment.",
    level: "Beginner to Advanced",
    duration: "14 Weeks",
    icon: "📱",
    badge: "High Demand",
    thumbnail:
      "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800&auto=format&fit=crop&q=80",
  },
  {
    slug: "seo",
    title: "SEO & Digital Growth",
    category: "Search Optimization",
    description:
      "Master Technical SEO, keyword research, on-page optimization, analytics, and data-driven organic traffic growth.",
    level: "Beginner to Pro",
    duration: "8 Weeks",
    icon: "📈",
    badge: "Career Track",
    thumbnail:
      "https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?w=800&auto=format&fit=crop&q=80",
  },
];

const getCourseThumbnail = (course, idx) => {
  if (course.thumbnail) return course.thumbnail;
  const s = (course.slug || "").toLowerCase();
  if (s.includes("web"))
    return "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80";
  if (s.includes("ai") || s.includes("artificial"))
    return "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80";
  if (s.includes("android"))
    return "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800&auto=format&fit=crop&q=80";
  if (s.includes("seo"))
    return "https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?w=800&auto=format&fit=crop&q=80";
  if (s.includes("marketing"))
    return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80";
  const defaults = [
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?w=800&auto=format&fit=crop&q=80",
  ];
  return defaults[idx % defaults.length];
};

function Home() {
  const [coursesList, setCoursesList] = useState(defaultFeaturedCourses);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(getApiUrl("/api/courses"));
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.courses && data.courses.length > 0) {
            const published = data.courses.filter((c) => c.isPublished !== false);
            if (published.length > 0) {
              setCoursesList(published.slice(0, 4));
            }
          }
        }
      } catch (e) {
        // Fallback to defaultFeaturedCourses
      }
    };
    fetchCourses();
  }, []);

  const stats = [
    { number: "35+", label: "Expert Team Members", icon: "👥" },
    { number: "1000+", label: "Projects Delivered", icon: "↗" },
    { number: "950+", label: "Happy Clients", icon: "♧" },
    { number: "100%", label: "Client Satisfaction", icon: "✦" },
  ];

  const aboutPillars = [
    {
      number: "01",
      icon: "✦",
      title: "Think Different",
      desc: "Challenging conventional boundaries to invent smarter, scalable digital solutions.",
    },
    {
      number: "02",
      icon: "◈",
      title: "Build Better",
      desc: "Pixel-perfect engineering, modern web & mobile architecture with rock-solid security.",
    },
    {
      number: "03",
      icon: "∞",
      title: "Empower Future",
      desc: "Equipping businesses with high-impact software and students with industry-grade LMS training.",
    },
  ];

  const services = [
    {
      icon: "AI",
      title: "AI & GenAI",
      subtitle: "Smarter Solutions",
      className: "ai",
    },
    {
      icon: "</>",
      title: "Web Development",
      subtitle: "Fast & Scalable",
      className: "web",
    },
    {
      icon: "↗",
      title: "Digital Growth",
      subtitle: "More Visibility",
      className: "growth",
    },
    {
      icon: "◈",
      title: "UI/UX Design",
      subtitle: "Better Experiences",
      className: "design",
    },
  ];

  return (
    <main className="home-page">

      {/* ================= HERO ================= */}
      <section className="home-hero">

        <div className="hero-bg">
          <div className="hero-glow hero-glow-purple"></div>
          <div className="hero-glow hero-glow-blue"></div>
          <div className="hero-glow hero-glow-pink"></div>
          <div className="hero-grid"></div>
        </div>

        <div className="home-container hero-container">

          {/* LEFT CONTENT */}
          <div className="hero-content">

            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              <span>INNOVATION</span>
              <b>×</b>
              <span>TECHNOLOGY</span>
              <b>×</b>
              <span>GROWTH</span>
            </div>

            <h1>
              Turning Ideas Into
              <br />
              <span className="hero-gradient">
                Digital Solutions.
              </span>
            </h1>

            <p>
              Cybrical Tech is a modern technology company focused
              on building innovative web solutions, AI-powered tools
              and digital experiences that help businesses grow.
            </p>

            <div className="hero-buttons">

              <Link
                to="/works"
                className="hero-primary-btn"
              >
                Explore Our Work
                <span>↗</span>
              </Link>

              <Link
                to="/contact"
                className="hero-secondary-btn"
              >
                Get In Touch
              </Link>

            </div>

          </div>

          {/* RIGHT VISUAL */}
          <div className="hero-visual">

            <div className="visual-orbit orbit-1"></div>
            <div className="visual-orbit orbit-2"></div>
            <div className="visual-orbit orbit-3"></div>

            <div className="visual-platform"></div>

            {/* LAPTOP */}
            <div className="hero-laptop">

              <div className="laptop-screen">

                <div className="screen-top">
                  <span></span>
                  <span></span>
                  <span></span>

                  <small>CYBRICAL TECH</small>
                </div>

                <div className="screen-code">
                  <span className="code-line long"></span>
                  <span className="code-line medium"></span>
                  <span className="code-line short"></span>
                  <span className="code-line long"></span>
                  <span className="code-line tiny"></span>
                  <span className="code-line medium"></span>
                  <span className="code-line long"></span>
                </div>

                <img
                  src={logo}
                  alt="Cybrical Tech"
                  className="screen-logo"
                />

              </div>

              <div className="laptop-base">
                <div className="laptop-keyboard"></div>
                <div className="laptop-trackpad"></div>
              </div>

            </div>

            {/* FLOATING SERVICE CARDS */}
            {services.map((service) => (
              <div
                className={`hero-service-card ${service.className}`}
                key={service.title}
              >
                <div className="service-card-icon">
                  {service.icon}
                </div>

                <div>
                  <strong>{service.title}</strong>
                  <small>{service.subtitle}</small>
                </div>
              </div>
            ))}

            <div className="floating-ball ball-purple"></div>
            <div className="floating-ball ball-cyan"></div>

          </div>

        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="home-stats">

        <div className="home-container stats-container">

          {stats.map((stat) => (
            <div
              className="stat-card"
              key={stat.label}
            >
              <div className="stat-icon">
                {stat.icon}
              </div>

              <div>
                <strong>{stat.number}</strong>
                <span>{stat.label}</span>
              </div>
            </div>
          ))}

        </div>

      </section>

      {/* ================= ABOUT CYBRICAL TECH ================= */}
      <section className="home-about-intro">

        <div className="home-container">

          <div className="section-pill-badge">
            <span></span>
            ABOUT CYBRICAL TECH
            <span></span>
          </div>

          <div className="home-about-grid">

            <div className="home-about-left">

              <h2>
                Crafting digital experiences
                <br />
                that <span>drive real growth.</span>
              </h2>

              <p>
                Cybrical Tech is a modern technology company blending creative design, 
                engineering excellence, and AI-driven intelligence. We partner with ambitious 
                businesses to turn complex ideas into scalable digital products, while empowering 
                learners with industry-grade software education and hands-on LMS training.
              </p>

              <div className="home-about-pillars">
                {aboutPillars.map((p) => (
                  <div className="pillar-item" key={p.number}>
                    <div className="pillar-num">{p.number}</div>
                    <div className="pillar-info">
                      <h4>{p.title}</h4>
                      <p>{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="home-about-buttons">
                <Link to="/about" className="hero-primary-btn">
                  Discover More About Us <span>↗</span>
                </Link>
                <Link to="/works" className="hero-secondary-btn">
                  Explore Our Works
                </Link>
              </div>

            </div>

            <div className="home-about-right">

              <div className="about-spotlight-card">
                <div className="spotlight-glow"></div>

                <div className="spotlight-badge">
                  <span className="live-dot"></span>
                  CYBRICAL ADVANTAGE
                </div>

                <h3>Innovation. Speed. Scalability.</h3>

                <p>
                  From full-stack web applications and AI automations to mobile apps and professional developer training, we create measurable value at every touchpoint.
                </p>

                <div className="about-card-metrics">
                  <div className="metric-box">
                    <strong>35+</strong>
                    <span>Core Engineers</span>
                  </div>
                  <div className="metric-box">
                    <strong>1000+</strong>
                    <span>Shipped Projects</span>
                  </div>
                  <div className="metric-box">
                    <strong>100%</strong>
                    <span>Commitment</span>
                  </div>
                </div>

                <div className="about-tech-stack">
                  <span>React.js</span>
                  <span>Node.js</span>
                  <span>Python</span>
                  <span>GenAI</span>
                  <span>Kotlin</span>
                  <span>MongoDB</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================= SERVICES INTRO ================= */}
      <section className="home-services-intro">

        <div className="home-container">

          <div className="services-line">
            <span></span>
            OUR SERVICES
            <span></span>
          </div>

          <div className="services-heading">

            <h2>
              Everything you need
              <br />
              to build your
              <span> digital future.</span>
            </h2>

            <p>
              Strategy, design, development, AI and growth —
              everything works together to turn your ideas
              into meaningful digital experiences.
            </p>

          </div>

          <div className="services-preview">

            <div className="preview-card preview-purple">
              <div className="preview-card-cover">
                <img
                  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80"
                  alt="Web Development"
                  className="preview-cover-img"
                  loading="lazy"
                />
                <div className="preview-cover-overlay"></div>
                <span className="preview-service-num">01</span>
                <span className="preview-service-badge">ENGINEERING</span>
                <div className="preview-icon-bubble">💻</div>
              </div>

              <div className="preview-card-body">
                <div className="preview-tags-row">
                  <span>React.js</span>
                  <span>Node.js</span>
                  <span>Cloud APIs</span>
                </div>

                <h3>Web Development</h3>

                <p>
                  Modern web applications, robust digital products and scalable high-performance architecture built for growth.
                </p>

                <div className="preview-action-row">
                  <Link to="/services" className="preview-explore-btn">
                    Explore Capabilities <span>↗</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="preview-card preview-blue ai-highlight-card">
              <div className="ai-card-glow"></div>

              <div className="preview-card-cover">
                <img
                  src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80"
                  alt="AI & Automation"
                  className="preview-cover-img"
                  loading="lazy"
                />
                <div className="preview-cover-overlay"></div>

                {/* MINI HOLOGRAPHIC AI WORKFLOW TERMINAL */}
                <div className="ai-mini-terminal">
                  <div className="terminal-header">
                    <span className="terminal-dot red"></span>
                    <span className="terminal-dot yellow"></span>
                    <span className="terminal-dot green"></span>
                    <small>CYBRICAL-AGENT // v2.4</small>
                  </div>
                  <div className="terminal-prompt">
                    <code>&gt; auto_pipeline.run(LLM + RAG)</code>
                    <span className="terminal-badge-live">ACTIVE ⚡</span>
                  </div>
                </div>

                <span className="preview-service-num">02</span>
                <span className="preview-service-badge ai-badge">✦ NEXT-GEN AI</span>
                <div className="preview-icon-bubble ai-bubble">🤖</div>
              </div>

              <div className="preview-card-body">
                <div className="preview-tags-row">
                  <span className="tag-highlight">✦ Autonomous Agents</span>
                  <span className="tag-highlight">✦ Custom LLMs</span>
                  <span className="tag-highlight">✦ RAG Pipelines</span>
                  <span>Auto-Workflows</span>
                </div>

                <div className="ai-title-row">
                  <h3>AI &amp; Automation</h3>
                  <span className="ai-popular-pill">Flagship</span>
                </div>

                <p>
                  Intelligent systems, generative AI integrations, neural search, and autonomous agent workflows engineered to multiply enterprise productivity.
                </p>

                <div className="preview-action-row ai-action-row">
                  <span className="ai-stat-hint">⚡ 10x Operational Speed</span>
                  <Link to="/services" className="preview-explore-btn ai-btn">
                    Explore AI Systems <span>↗</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="preview-card preview-pink">
              <div className="preview-card-cover">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80"
                  alt="SEO & Growth"
                  className="preview-cover-img"
                  loading="lazy"
                />
                <div className="preview-cover-overlay"></div>
                <span className="preview-service-num">03</span>
                <span className="preview-service-badge">OPTIMIZATION</span>
                <div className="preview-icon-bubble">📈</div>
              </div>

              <div className="preview-card-body">
                <div className="preview-tags-row">
                  <span>Rank #1</span>
                  <span>Audits</span>
                  <span>Analytics</span>
                </div>

                <h3>SEO & Growth</h3>

                <p>
                  Data-driven search strategies, technical optimization and conversion growth to consistently capture organic market share.
                </p>

                <div className="preview-action-row">
                  <Link to="/services" className="preview-explore-btn">
                    Explore Capabilities <span>↗</span>
                  </Link>
                </div>
              </div>
            </div>

          </div>

          {/* SERVICES BOTTOM ACTION BANNER */}
          <div className="services-bottom-action">
            <div className="services-cta-copy">
              <span className="services-badge-pill">✦ FULL RANGE OF CAPABILITIES</span>
              <h3>Need UI/UX Design, Branding, or Performance Ads?</h3>
              <p>We provide full-spectrum engineering, creative design, and growth marketing tailored for ambitious enterprises.</p>
            </div>
            <Link to="/services" className="hero-primary-btn">
              Explore All 6 Services <span>↗</span>
            </Link>
          </div>

        </div>

      </section>

      {/* ================= COURSES INTRO ================= */}
      <section className="home-courses-intro">

        <div className="home-container">

          <div className="section-pill-badge">
            <span></span>
            CYBRICAL LMS & ONLINE COURSES
            <span></span>
          </div>

          <div className="courses-heading">

            <div className="courses-heading-left">
              <h2>
                Industry-Ready Courses.
                <br />
                <span>Build real skills.</span>
              </h2>
            </div>

            <div className="courses-heading-right">
              <p>
                Learn in-demand technologies with step-by-step video lectures, complete source code ZIP archives for each lesson, and practical project builds.
              </p>
              <Link to="/courses" className="view-all-courses-btn">
                Browse Full Course Catalog <span>↗</span>
              </Link>
            </div>

          </div>

          <div className="home-courses-grid">
            {coursesList.map((course, idx) => {
              const icons = ["💻", "🤖", "📱", "📈"];
              const badges = ["Most Popular", "Trending", "High Demand", "Career Track"];
              const colors = ["purple", "blue", "cyan", "pink"];
              const icon = course.icon || icons[idx % icons.length];
              const badge = course.badge || badges[idx % badges.length];
              const color = colors[idx % colors.length];
              const thumbUrl = getCourseThumbnail(course, idx);

              return (
                <div className={`home-course-card course-${color}`} key={course.slug || idx}>
                  {/* COURSE COVER PHOTO */}
                  <div className="course-card-image-wrapper">
                    <img
                      src={thumbUrl}
                      alt={course.title}
                      className="course-card-cover-img"
                      loading="lazy"
                    />
                    <div className="course-image-overlay"></div>
                    <span className="course-status-badge">{badge}</span>
                    <div className="course-icon-bubble">{icon}</div>
                  </div>

                  <div className="course-card-body">
                    <span className="course-category-tag">{course.category || "Professional Track"}</span>
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>

                    <div className="course-meta-pills">
                      <span>⏱ {course.duration || "Self-Paced"}</span>
                      <span>📊 {course.level || "Beginner to Pro"}</span>
                      {course.modules && course.modules.length > 0 && (
                        <span>📚 {course.modules.length} Modules</span>
                      )}
                    </div>

                    <div className="course-card-action">
                      <span className="course-zip-notice">📦 Includes Project ZIPs</span>
                      <Link to={`/courses/${course.slug}`} className="course-enroll-btn">
                        View Course ↗
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* COURSES BOTTOM BANNER */}
          <div className="courses-bottom-banner">
            <div className="banner-left">
              <span className="banner-badge">⚡ 100% HANDS-ON LEARNING</span>
              <h3>Need full source code and starter templates?</h3>
              <p>Every single lesson in our courses includes downloadable project ZIP archives ready to run on your machine.</p>
            </div>
            <div className="banner-right">
              <Link to="/courses" className="hero-primary-btn">
                Explore Full LMS Catalog <span>↗</span>
              </Link>
            </div>
          </div>

        </div>

      </section>

      {/* ================= PHOTOS & CULTURE ================= */}
      <section className="home-photos-intro">

        <div className="home-container">

          <div className="section-pill-badge">
            <span></span>
            LIFE AT CYBRICAL TECH
            <span></span>
          </div>

          <div className="courses-heading">

            <div className="courses-heading-left">
              <h2>
                The people behind
                <br />
                <span>our innovation.</span>
              </h2>
            </div>

            <div className="courses-heading-right">
              <p>
                Behind every line of code, design system, and digital product is a dedicated team passionate about solving problems and creating real impact.
              </p>
              <Link to="/photos" className="view-all-courses-btn">
                View Full Team Gallery <span>↗</span>
              </Link>
            </div>

          </div>

          <div className="home-photos-grid">
            {defaultHomePhotos.map((photo) => (
              <div className="home-photo-card" key={photo.id}>
                <div className="home-photo-img-wrapper">
                  <img src={photo.image} alt={photo.title} loading="lazy" />
                  <div className="home-photo-overlay"></div>
                  <span className="photo-tag-pill">{photo.tag}</span>
                  <span className="photo-id-pill">{photo.id}</span>
                </div>
                <div className="home-photo-content">
                  <span className="photo-subtitle-tag">TEAM MOMENT</span>
                  <h3>{photo.title}</h3>
                  <p>{photo.subtitle}</p>
                  <Link to="/photos" className="photo-explore-link">
                    Explore Photos <span>↗</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="photos-bottom-cta">
            <div className="photos-cta-left">
              <span className="banner-badge">✦ OUR WORKPLACE CULTURE</span>
              <h3>Want to experience our culture firsthand?</h3>
              <p>Explore all team stories, celebrations, and life at our Noida development center.</p>
            </div>
            <Link to="/photos" className="hero-primary-btn">
              Explore Our Team Photos <span>↗</span>
            </Link>
          </div>

        </div>

      </section>

      {/* ================= CTA ================= */}
      <section className="home-cta">

        <div className="cta-glow"></div>

        <div className="home-container cta-content">

          <span>READY TO BUILD SOMETHING?</span>

          <h2>
            Your idea.
            <br />
            <strong>Our technology.</strong>
          </h2>

          <p>
            Let's turn your vision into a digital experience
            people remember.
          </p>

          <Link
            to="/contact"
            className="cta-button"
          >
            Start a Project
            <span>↗</span>
          </Link>

        </div>

      </section>

    </main>
  );
}

export default Home;