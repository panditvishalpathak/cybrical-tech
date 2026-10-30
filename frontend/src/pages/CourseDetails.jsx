import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getApiUrl, getAssetUrl, getDownloadUrl, isGoogleDriveUrl, isGoogleDriveFolder, getGoogleDriveViewUrl, getGoogleDriveDownloadUrl } from "../config/api";
import "./CourseDetails.css";

const WEB_DEV_FALLBACK_DATA = {
  _id: "660000000000000000000001",
  title: "Web Development",
  slug: "web-development",
  description:
    "Complete Web Development Bootcamp from Scratch — HTML, CSS, JavaScript, React, Node.js & Full-Stack Projects with downloadable Source Code ZIPs for every lesson.",
  category: "Web Development",
  level: "Beginner to Advanced",
  duration: "12 Weeks",
  price: 0,
  isPublished: true,
  thumbnail:
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
  modules: [
    {
      _id: "web-mod-1",
      title: "Module 1: HTML5 & Modern Responsive CSS",
      description: "Foundations of modern web layout, semantic elements, and responsive design with project ZIP archives.",
      lessons: [
        {
          _id: "web-les-1",
          title: "Lesson 1: HTML5 Semantic Structure & Starter Project",
          description: "Learn semantic tags, forms, tables, and project directory scaffolding. Download the starter kit ZIP below.",
          duration: "35 min",
          videoUrl: "",
          zipUrl: "https://drive.google.com/uc?export=download&id=1aBkTT6RZphi0YKcPt25Og0yBTolgWWfr",
          zipName: "Day 1 WELCOME + HTML.zip",
          zipSize: "506.7 MB",
        },
        {
          _id: "web-les-2",
          title: "Lesson 2: CSS3 Flexbox & Grid Responsive Layouts",
          description: "Master modern layout techniques, media queries, CSS variables, and layout patterns with full source code.",
          duration: "45 min",
          videoUrl: "",
          zipUrl: "https://drive.google.com/uc?export=download&id=1lWxj29iac2Ssdve-dIvfENu6HBI98omo",
          zipName: "Day 2 HTML.zip",
          zipSize: "350.6 MB",
        },
        {
          _id: "web-les-3",
          title: "Lesson 3: Complete Responsive Agency Landing Page",
          description: "Build and deploy a mobile-friendly agency landing page with animations and interactive navigation.",
          duration: "50 min",
          videoUrl: "",
          zipUrl: "https://drive.google.com/drive/folders/1C10i264a0xaytSIhoNeW0j1seO75J8qt?usp=sharing",
          zipName: "Web-Development-Complete-Projects",
          zipSize: "Google Drive Folder",
        },
      ],
    },
    {
      _id: "web-mod-2",
      title: "Module 2: JavaScript DOM & Interactive Applications",
      description: "Master core JavaScript, DOM manipulation, asynchronous programming, APIs, and interactive applications.",
      lessons: [
        {
          _id: "web-les-4",
          title: "Lesson 4: JavaScript Fundamentals & Dynamic DOM Control",
          description: "ES6+ syntax, arrays, objects, functions, event listeners, and dynamic DOM rendering practice project.",
          duration: "55 min",
          videoUrl: "",
          zipUrl: "https://drive.google.com/drive/folders/1C10i264a0xaytSIhoNeW0j1seO75J8qt?usp=sharing",
          zipName: "02-JavaScript-DOM-Async-Projects.zip",
          zipSize: "Google Drive Cloud",
        },
        {
          _id: "web-les-5",
          title: "Lesson 5: Async JS, REST APIs & Live Weather Application",
          description: "Working with Promises, async/await, Fetch API, error handling, and building a live API-powered app.",
          duration: "60 min",
          videoUrl: "",
          zipUrl: "https://drive.google.com/drive/folders/1C10i264a0xaytSIhoNeW0j1seO75J8qt?usp=sharing",
          zipName: "02-JavaScript-DOM-Async-Projects.zip",
          zipSize: "Google Drive Cloud",
        },
        {
          _id: "web-les-6",
          title: "Lesson 6: Interactive CRUD App with LocalStorage",
          description: "Create a persistent task management application with state persistence, filtering, and local storage.",
          duration: "50 min",
          videoUrl: "",
          zipUrl: "https://drive.google.com/drive/folders/1C10i264a0xaytSIhoNeW0j1seO75J8qt?usp=sharing",
          zipName: "02-JavaScript-DOM-Async-Projects.zip",
          zipSize: "Google Drive Cloud",
        },
      ],
    },
    {
      _id: "web-mod-3",
      title: "Module 3: React.js & Modern Frontend Architecture",
      description: "Build robust single-page applications using React components, hooks, routing, and state management.",
      lessons: [
        {
          _id: "web-les-7",
          title: "Lesson 7: React Setup, JSX, Components & Props",
          description: "Component architecture, props drilling, conditional rendering, and structured folder layout with Vite.",
          duration: "45 min",
          videoUrl: "",
          zipUrl: "https://drive.google.com/drive/folders/1C10i264a0xaytSIhoNeW0j1seO75J8qt?usp=sharing",
          zipName: "03-React-Ecommerce-App-Source.zip",
          zipSize: "Google Drive Cloud",
        },
        {
          _id: "web-les-8",
          title: "Lesson 8: React Hooks (useState, useEffect) & Context API",
          description: "Deep dive into state lifecycles, effect hooks, custom hooks, and global state management with Context.",
          duration: "55 min",
          videoUrl: "",
          zipUrl: "https://drive.google.com/drive/folders/1C10i264a0xaytSIhoNeW0j1seO75J8qt?usp=sharing",
          zipName: "03-React-Ecommerce-App-Source.zip",
          zipSize: "Google Drive Cloud",
        },
        {
          _id: "web-les-9",
          title: "Lesson 9: Full E-Commerce Product Catalog with Cart",
          description: "Build an interactive E-commerce frontend with cart management, checkout modals, and responsive UI.",
          duration: "65 min",
          videoUrl: "",
          zipUrl: "https://drive.google.com/drive/folders/1C10i264a0xaytSIhoNeW0j1seO75J8qt?usp=sharing",
          zipName: "03-React-Ecommerce-App-Source.zip",
          zipSize: "Google Drive Cloud",
        },
      ],
    },
    {
      _id: "web-mod-4",
      title: "Module 4: Full-Stack Backend, Database & Deployment",
      description: "Build RESTful APIs with Node.js, Express, MongoDB, and deploy full-stack applications to cloud servers.",
      lessons: [
        {
          _id: "web-les-10",
          title: "Lesson 10: Node.js & Express REST API Architecture",
          description: "Express routing, middleware, request validation, error handling, and building secure REST endpoints.",
          duration: "50 min",
          videoUrl: "",
          zipUrl: "https://drive.google.com/drive/folders/1C10i264a0xaytSIhoNeW0j1seO75J8qt?usp=sharing",
          zipName: "04-FullStack-MERN-Capstone-Project.zip",
          zipSize: "Google Drive Cloud",
        },
        {
          _id: "web-les-11",
          title: "Lesson 11: MongoDB, Mongoose Schemas & JWT Auth",
          description: "Database modeling, CRUD operations, password hashing with bcrypt, and JWT user authentication.",
          duration: "60 min",
          videoUrl: "",
          zipUrl: "https://drive.google.com/drive/folders/1C10i264a0xaytSIhoNeW0j1seO75J8qt?usp=sharing",
          zipName: "04-FullStack-MERN-Capstone-Project.zip",
          zipSize: "Google Drive Cloud",
        },
        {
          _id: "web-les-12",
          title: "Lesson 12: Full Stack Production Deployment & CI/CD",
          description: "Connecting frontend and backend, environment variables, building for production, and live cloud deployment.",
          duration: "60 min",
          videoUrl: "",
          zipUrl: "https://drive.google.com/drive/folders/1C10i264a0xaytSIhoNeW0j1seO75J8qt?usp=sharing",
          zipName: "04-FullStack-MERN-Capstone-Project.zip",
          zipSize: "Google Drive Cloud",
        },
      ],
    },
  ],
  zipFile: {
    _id: "zf-wd-drive-folder",
    title: "Web Development Complete Project & Source Code (Google Drive Folder)",
    fileName: "Web-Development-Google-Drive-Projects",
    url: "https://drive.google.com/drive/folders/1C10i264a0xaytSIhoNeW0j1seO75J8qt?usp=sharing",
    fileSize: "Google Drive Folder",
    isExternal: true,
    source: "Google Drive",
  },
  zipFiles: [
    {
      _id: "zf-wd-drive-folder",
      title: "📁 Web Development Complete Project & Source Code (Google Drive Folder)",
      fileName: "Web-Development-Google-Drive-Projects",
      url: "https://drive.google.com/drive/folders/1C10i264a0xaytSIhoNeW0j1seO75J8qt?usp=sharing",
      fileSize: "Google Drive Folder",
      isExternal: true,
      source: "Google Drive",
    },
    {
      _id: "zf-wd-day1",
      title: "📦 Day 1: WELCOME + HTML5 Starter Kit (ZIP)",
      fileName: "Day 1 WELCOME + HTML.zip",
      url: "https://drive.google.com/uc?export=download&id=1aBkTT6RZphi0YKcPt25Og0yBTolgWWfr",
      fileSize: "506.7 MB",
      isExternal: true,
      source: "Google Drive",
    },
    {
      _id: "zf-wd-day2",
      title: "📦 Day 2: HTML & CSS Projects Complete (ZIP)",
      fileName: "Day 2 HTML.zip",
      url: "https://drive.google.com/uc?export=download&id=1lWxj29iac2Ssdve-dIvfENu6HBI98omo",
      fileSize: "350.6 MB",
      isExternal: true,
      source: "Google Drive",
    },
    {
      _id: "zf-wd-day3",
      title: "📦 Day 3: JavaScript DOM & Async REST API Projects (ZIP)",
      fileName: "02-JavaScript-DOM-Async-Projects.zip",
      url: "https://drive.google.com/drive/folders/1C10i264a0xaytSIhoNeW0j1seO75J8qt?usp=sharing",
      fileSize: "Google Drive Cloud",
      isExternal: true,
      source: "Google Drive",
    },
    {
      _id: "zf-wd-day4",
      title: "📦 Day 4: Full-Stack MERN Capstone Projects (ZIP)",
      fileName: "04-FullStack-MERN-Capstone-Project.zip",
      url: "https://drive.google.com/drive/folders/1C10i264a0xaytSIhoNeW0j1seO75J8qt?usp=sharing",
      fileSize: "Google Drive Cloud",
      isExternal: true,
      source: "Google Drive",
    },
  ],
  resources: [
    {
      _id: "res-wd-drive-folder",
      title: "Web Development Complete Project & Source Code (Google Drive Folder)",
      fileName: "Web-Development-Google-Drive-Projects",
      url: "https://drive.google.com/drive/folders/1C10i264a0xaytSIhoNeW0j1seO75J8qt?usp=sharing",
      fileUrl: "https://drive.google.com/drive/folders/1C10i264a0xaytSIhoNeW0j1seO75J8qt?usp=sharing",
      fileSize: "Google Drive Folder",
      isExternal: true,
      source: "Google Drive",
    },
    {
      _id: "res-wd-day1",
      title: "Day 1: WELCOME + HTML5 Starter Kit (ZIP)",
      fileName: "Day 1 WELCOME + HTML.zip",
      url: "https://drive.google.com/uc?export=download&id=1aBkTT6RZphi0YKcPt25Og0yBTolgWWfr",
      fileUrl: "https://drive.google.com/uc?export=download&id=1aBkTT6RZphi0YKcPt25Og0yBTolgWWfr",
      fileSize: "506.7 MB",
      isExternal: true,
      source: "Google Drive",
    },
    {
      _id: "res-wd-day2",
      title: "Day 2: HTML & CSS Projects Complete (ZIP)",
      fileName: "Day 2 HTML.zip",
      url: "https://drive.google.com/uc?export=download&id=1lWxj29iac2Ssdve-dIvfENu6HBI98omo",
      fileUrl: "https://drive.google.com/uc?export=download&id=1lWxj29iac2Ssdve-dIvfENu6HBI98omo",
      fileSize: "350.6 MB",
      isExternal: true,
      source: "Google Drive",
    },
    {
      _id: "res-wd-day3",
      title: "Day 3: JavaScript DOM & Async REST API Projects (ZIP)",
      fileName: "02-JavaScript-DOM-Async-Projects.zip",
      url: "https://drive.google.com/drive/folders/1C10i264a0xaytSIhoNeW0j1seO75J8qt?usp=sharing",
      fileUrl: "https://drive.google.com/drive/folders/1C10i264a0xaytSIhoNeW0j1seO75J8qt?usp=sharing",
      fileSize: "Google Drive Cloud",
      isExternal: true,
      source: "Google Drive",
    },
    {
      _id: "res-wd-day4",
      title: "Day 4: Full-Stack MERN Capstone Projects (ZIP)",
      fileName: "04-FullStack-MERN-Capstone-Project.zip",
      url: "https://drive.google.com/drive/folders/1C10i264a0xaytSIhoNeW0j1seO75J8qt?usp=sharing",
      fileUrl: "https://drive.google.com/drive/folders/1C10i264a0xaytSIhoNeW0j1seO75J8qt?usp=sharing",
      fileSize: "Google Drive Cloud",
      isExternal: true,
      source: "Google Drive",
    },
  ],
};

const FALLBACK_COURSES_MAP = {
  "web-development": WEB_DEV_FALLBACK_DATA,
  "660000000000000000000001": WEB_DEV_FALLBACK_DATA,
  ai: {
    _id: "660000000000000000000004",
    title: "Artificial Intelligence (AI)",
    slug: "ai",
    description:
      "Master Modern Artificial Intelligence, Machine Learning, Deep Learning, Neural Networks, and Generative AI.",
    category: "Artificial Intelligence",
    level: "Beginner to Advanced",
    duration: "16 Weeks",
    price: 0,
    isPublished: true,
    thumbnail:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80",
    modules: [
      {
        _id: "ai-mod-1",
        title: "Module 1: Course Introduction & Setup",
        description: "Welcome to the Artificial Intelligence course and team setup.",
        lessons: [
          {
            _id: "ai-les-1",
            title: "Lesson 1: Course Introduction TEAMWORK",
            description: "Introduction to AI bootcamp, collaboration workflow, and environment setup.",
            duration: "30 min",
            videoUrl: "",
          },
        ],
      },
      {
        _id: "ai-mod-2",
        title: "Module 2: Python Fundamentals for AI",
        description: "Core Python programming, variables, data structures, and algorithms for AI.",
        lessons: [
          {
            _id: "ai-les-2",
            title: "Lesson 2: Python Fundamentals (Part-1)",
            description: "Python syntax, control flow, functions, and fundamental data science libraries.",
            duration: "45 min",
            videoUrl: "",
          },
        ],
      },
    ],
    zipFile: null,
    zipFiles: [],
    resources: [],
  },
  seo: {
    _id: "660000000000000000000002",
    title: "SEO",
    slug: "seo",
    description: "Learn On-Page SEO, Off-Page SEO, Technical SEO and Local SEO.",
    category: "Search Engine Optimization",
    level: "Beginner",
    duration: "8 Weeks",
    price: 0,
    isPublished: true,
    modules: [
      {
        _id: "seo-mod-1",
        title: "Module 1: SEO Fundamentals",
        lessons: [
          { _id: "seo-les-1", title: "Keyword Research & Strategy", duration: "35 min", videoUrl: "" },
          { _id: "seo-les-2", title: "On-Page & Technical Optimization", duration: "45 min", videoUrl: "" },
        ],
      },
    ],
    zipFiles: [],
    resources: [],
  },
  "digital-marketing": {
    _id: "660000000000000000000003",
    title: "Digital Marketing",
    slug: "digital-marketing",
    description: "Learn the fundamentals of digital marketing and online growth.",
    category: "Digital Marketing",
    level: "Beginner",
    duration: "10 Weeks",
    price: 0,
    isPublished: true,
    modules: [
      {
        _id: "dm-mod-1",
        title: "Module 1: Digital Marketing Strategy",
        lessons: [
          { _id: "dm-les-1", title: "Social Media Strategy & Ads", duration: "40 min", videoUrl: "" },
          { _id: "dm-les-2", title: "Email Marketing & Analytics", duration: "35 min", videoUrl: "" },
        ],
      },
    ],
    zipFiles: [],
    resources: [],
  },
  android: {
    _id: "660000000000000000000005",
    title: "Android App Development",
    slug: "android",
    description:
      "Master Native Android App Development with Kotlin, Jetpack Compose, Android SDK, MVVM Architecture, Room Database, and REST APIs.",
    category: "Mobile Development",
    level: "Beginner to Advanced",
    duration: "14 Weeks",
    price: 0,
    isPublished: true,
    thumbnail:
      "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800&auto=format&fit=crop&q=80",
    modules: [
      {
        _id: "and-mod-1",
        title: "Module 1: Kotlin & Android Studio Setup",
        description: "Kotlin programming essentials, Android Studio IDE setup, and Project Anatomy.",
        lessons: [
          {
            _id: "and-les-1",
            title: "Lesson 1: Android Studio Installation & Project Anatomy",
            description: "Install Android Studio, configure Android Virtual Device (AVD), and understand project file hierarchy.",
            duration: "30 min",
            videoUrl: "",
          },
          {
            _id: "and-les-2",
            title: "Lesson 2: Kotlin Fundamentals, OOP & Coroutines",
            description: "Variables, Null Safety, Lambdas, Coroutines and Asynchronous Kotlin for Android.",
            duration: "45 min",
            videoUrl: "",
          },
        ],
      },
      {
        _id: "and-mod-2",
        title: "Module 2: Modern UI with Jetpack Compose",
        description: "Declarative UI, State management, Navigation, Material 3 Design.",
        lessons: [
          {
            _id: "and-les-3",
            title: "Lesson 3: Jetpack Compose Layouts & Material Design 3",
            description: "Column, Row, Box, Scaffold, LazyColumn and dynamic UI state manipulation.",
            duration: "50 min",
            videoUrl: "",
          },
          {
            _id: "and-les-4",
            title: "Lesson 4: Compose State, ViewModel & Navigation",
            description: "Remember, MutableState, State Hoisting, and Navigation Component.",
            duration: "45 min",
            videoUrl: "",
          },
        ],
      },
      {
        _id: "and-mod-3",
        title: "Module 3: Networking, Storage & MVVM Architecture",
        description: "Retrofit, Room SQLite Database, Repository Pattern, and Hilt Dependency Injection.",
        lessons: [
          {
            _id: "and-les-5",
            title: "Lesson 5: REST API Integration with Retrofit & OkHttp",
            description: "Fetching JSON data, Moshi/Gson serialization, error handling, and internet permissions.",
            duration: "55 min",
            videoUrl: "",
          },
          {
            _id: "and-les-6",
            title: "Lesson 6: Local Persistence with Room Database & DataStore",
            description: "Entities, DAOs, TypeConverters, LiveData/Flow, and Preferences DataStore.",
            duration: "50 min",
            videoUrl: "",
          },
        ],
      },
      {
        _id: "and-mod-4",
        title: "Module 4: Full App Project, Testing & Play Store Deployment",
        description: "Capstone project, Unit testing, App bundle creation, and Play Console release.",
        lessons: [
          {
            _id: "and-les-7",
            title: "Lesson 7: Full E-Commerce / Social App Project with Firebase",
            description: "Firebase Auth, Firestore, Push Notifications with FCM, and Cloud Storage.",
            duration: "65 min",
            videoUrl: "",
          },
          {
            _id: "and-les-8",
            title: "Lesson 8: App Bundle (AAB), ProGuard & Google Play Release",
            description: "Keystore generation, signing, optimization, and deploying to Google Play Console.",
            duration: "40 min",
            videoUrl: "",
          },
        ],
      },
    ],
    zipFile: null,
    zipFiles: [],
    resources: [],
  },
};

const getVideoEmbedInfo = (url) => {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();

  // YouTube match (watch, embed, short url)
  const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return {
      type: "iframe",
      src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0`,
    };
  }

  // Google Drive match (/file/d/.../view or id=...)
  if (trimmed.includes("drive.google.com")) {
    const fileIdMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/id=([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return {
        type: "iframe",
        src: `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`,
      };
    }
  }

  // Vimeo match
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: "iframe",
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  // Direct video file or server path
  return {
    type: "video",
    src: getAssetUrl(trimmed),
  };
};

function CourseDetails() {
  const { slug } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  const isStaleDummyZip = (url) => {
    if (!url || typeof url !== "string") return false;
    return url.includes("179119") || url.startsWith("/uploads/courses/179119");
  };

  // Auto-sanitize stale dummy zip records in user's browser localStorage on mount
  useEffect(() => {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith("admin_course_")) {
          let raw = localStorage.getItem(k);
          if (raw && (raw.includes("179119") || raw.includes("1Cybrical-WebDev"))) {
            if (raw.includes("1Cybrical-WebDev")) {
              raw = raw
                .replaceAll("https://drive.google.com/drive/folders/1Cybrical-WebDev-HTML5-CSS3", "https://drive.google.com/file/d/1C10i264a0xaytSIhoNeW0j1seO75J8qt/view")
                .replaceAll("https://drive.google.com/drive/folders/1Cybrical-WebDev-JavaScript-Apps", "https://drive.google.com/file/d/1C10i264a0xaytSIhoNeW0j1seO75J8qt/view")
                .replaceAll("https://drive.google.com/drive/folders/1Cybrical-WebDev-React-Vite-App", "https://drive.google.com/file/d/1C10i264a0xaytSIhoNeW0j1seO75J8qt/view")
                .replaceAll("https://drive.google.com/drive/folders/1Cybrical-WebDev-MERN-FullStack", "https://drive.google.com/file/d/1C10i264a0xaytSIhoNeW0j1seO75J8qt/view");
              localStorage.setItem(k, raw);
            }
            try {
              const obj = JSON.parse(raw);
              if (obj.zipFiles) {
                obj.zipFiles = obj.zipFiles.filter((z) => z && z.url && !isStaleDummyZip(z.url));
              }
              if (obj.zipFile && isStaleDummyZip(obj.zipFile.url)) {
                obj.zipFile = { url: "", fileName: "", fileSize: "" };
              }
              if (obj.resources) {
                obj.resources = obj.resources.filter((r) => !isStaleDummyZip(r.url || r.fileUrl));
              }
              if (obj.modules) {
                obj.modules.forEach((m) => {
                  (m.lessons || []).forEach((l) => {
                    if (isStaleDummyZip(l.zipUrl)) {
                      l.zipUrl = "";
                      l.zipName = "";
                      l.zipSize = "";
                    }
                  });
                });
              }
              localStorage.setItem(k, JSON.stringify(obj));
            } catch (e) {
              localStorage.removeItem(k);
            }
          }
        }
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");

        let fetchedCourse = null;

        try {
          let response = await fetch(getApiUrl(`/api/courses/${slug}`));
          if (!response.ok) {
            response = await fetch(getApiUrl(`/api/courses/id/${slug}`));
          }
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.course) {
              fetchedCourse = data.course;
            }
          }
        } catch (apiErr) {
          console.warn("API fetch error, using fallback if available:", apiErr);
        }

        // Check localStorage and fallback map if not fetched from backend
        const cleanSlug = (slug || "").toLowerCase();
        let savedLocal = null;
        try {
          const raw =
            localStorage.getItem(`admin_course_${cleanSlug}`) ||
            localStorage.getItem(`admin_course_${slug}`) ||
            (cleanSlug.includes("web") ? (localStorage.getItem("admin_course_web-development") || localStorage.getItem("admin_course_660000000000000000000001")) : null) ||
            (cleanSlug.includes("ai") ? (localStorage.getItem("admin_course_ai") || localStorage.getItem("admin_course_660000000000000000000004")) : null) ||
            (cleanSlug.includes("android") ? (localStorage.getItem("admin_course_android") || localStorage.getItem("admin_course_660000000000000000000005")) : null);
          if (raw) {
            savedLocal = JSON.parse(raw);
            if (savedLocal.zipFiles) {
              savedLocal.zipFiles = savedLocal.zipFiles.filter((z) => z && z.url && !isStaleDummyZip(z.url));
            }
            if (savedLocal.zipFile && isStaleDummyZip(savedLocal.zipFile.url)) {
              savedLocal.zipFile = null;
            }
          }
        } catch (e) {}

        if (!fetchedCourse) {
          fetchedCourse =
            savedLocal ||
            FALLBACK_COURSES_MAP[cleanSlug] ||
            FALLBACK_COURSES_MAP[slug] ||
            (cleanSlug.includes("web") ? WEB_DEV_FALLBACK_DATA : null) ||
            (cleanSlug.includes("ai") || cleanSlug.includes("artificial")
              ? FALLBACK_COURSES_MAP["ai"]
              : null);
        } else {
          // Clean fetchedCourse from any dead dummy links
          if (fetchedCourse.zipFiles) {
            fetchedCourse.zipFiles = fetchedCourse.zipFiles.filter((z) => z && z.url && !isStaleDummyZip(z.url));
          }
          if (fetchedCourse.zipFile && isStaleDummyZip(fetchedCourse.zipFile.url)) {
            fetchedCourse.zipFile = null;
          }
          if (savedLocal) {
            // Cleanly merge unique zipFiles between remote and local
            const remoteZips = (fetchedCourse.zipFiles || []).filter((z) => z && z.url && !isStaleDummyZip(z.url));
            const localZips = (savedLocal.zipFiles || []).filter((z) => z && z.url && !isStaleDummyZip(z.url));
            const zipMergeMap = new Map();
            remoteZips.forEach((z, i) => zipMergeMap.set(z._id || `remote-${z.title || ""}-${i}`, z));
            localZips.forEach((z, i) => {
              const k = z._id || `local-${z.title || ""}-${i}`;
              if (!zipMergeMap.has(k)) zipMergeMap.set(k, z);
            });
            fetchedCourse.zipFiles = Array.from(zipMergeMap.values());

            if (!fetchedCourse.zipFile && savedLocal.zipFile && !isStaleDummyZip(savedLocal.zipFile.url)) {
              fetchedCourse.zipFile = savedLocal.zipFile;
            }
            if (savedLocal.resources && savedLocal.resources.length > 0) {
              fetchedCourse.resources = savedLocal.resources.filter((r) => !isStaleDummyZip(r.url || r.fileUrl));
            }
          }
        }

        // Ensure Web Development always has its complete Google Drive ZIP resources
        const isCurrentWeb =
          cleanSlug.includes("web") ||
          cleanSlug === "660000000000000000000001" ||
          cleanSlug === "6ac3757e77cb85107a5ab348" ||
          (fetchedCourse && (fetchedCourse.slug === "web-development" || (fetchedCourse.title && fetchedCourse.title.toLowerCase().includes("web"))));

        // Ensure modules are always present if empty
        if (fetchedCourse && (!fetchedCourse.modules || fetchedCourse.modules.length === 0)) {
          if (isCurrentWeb) {
            fetchedCourse.modules = WEB_DEV_FALLBACK_DATA.modules;
          } else {
            const fallbackMod = FALLBACK_COURSES_MAP[cleanSlug]?.modules || FALLBACK_COURSES_MAP[slug]?.modules || [];
            if (fallbackMod && fallbackMod.length > 0) {
              fetchedCourse.modules = fallbackMod;
            }
          }
        }

        if (fetchedCourse && isCurrentWeb) {
          const hasValidZips =
            fetchedCourse.zipFiles &&
            fetchedCourse.zipFiles.some(
              (z) => z && z.url && z.url.trim() && !isStaleDummyZip(z.url)
            );

          if (!hasValidZips || (fetchedCourse.zipFiles && fetchedCourse.zipFiles.length < 3)) {
            fetchedCourse.zipFiles = WEB_DEV_FALLBACK_DATA.zipFiles;
            fetchedCourse.zipFile = WEB_DEV_FALLBACK_DATA.zipFile;
            fetchedCourse.resources = WEB_DEV_FALLBACK_DATA.resources;
          } else {
            fetchedCourse.zipFiles = fetchedCourse.zipFiles.map((z) => {
              let u = z ? (z.url || z.fileUrl || "") : "";
              if (u.includes("1Cybrical-WebDev") || (u.includes("1C10i264a0xaytSIhoNeW0j1seO75J8qt") && u.includes("/file/d/"))) {
                u = "https://drive.google.com/drive/folders/1C10i264a0xaytSIhoNeW0j1seO75J8qt?usp=sharing";
              }
              return { ...z, url: u };
            });
            if (fetchedCourse.zipFile && fetchedCourse.zipFile.url) {
              if (fetchedCourse.zipFile.url.includes("1Cybrical-WebDev") || (fetchedCourse.zipFile.url.includes("1C10i264a0xaytSIhoNeW0j1seO75J8qt") && fetchedCourse.zipFile.url.includes("/file/d/"))) {
                fetchedCourse.zipFile.url = "https://drive.google.com/drive/folders/1C10i264a0xaytSIhoNeW0j1seO75J8qt?usp=sharing";
              }
            }
          }
        } else if (fetchedCourse && !isCurrentWeb) {
          // STRICT RULE: ONLY Web Development course should show ZIP files!
          fetchedCourse.zipFiles = [];
          fetchedCourse.zipFile = null;
          if (fetchedCourse.resources) {
            fetchedCourse.resources = fetchedCourse.resources.filter((r) => {
              const u = (r.url || r.fileUrl || "").toLowerCase();
              return !u.endsWith(".zip") && !u.includes("drive.google.com");
            });
          }
          if (fetchedCourse.modules) {
            fetchedCourse.modules.forEach((m) => {
              (m.lessons || []).forEach((l) => {
                l.zipUrl = "";
                l.zipName = "";
                l.zipSize = "";
              });
            });
          }
        }

        if (!fetchedCourse) {
          throw new Error("Course not found");
        }

        setCourse(fetchedCourse);

        // Auto-select first lesson if available
        if (fetchedCourse.modules && fetchedCourse.modules.length > 0) {
          const firstMod = fetchedCourse.modules.find((m) => m.lessons && m.lessons.length > 0);
          if (firstMod && firstMod.lessons.length > 0) {
            setSelectedLesson(firstMod.lessons[0]);
          }
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Course not found");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  if (loading) {
    return (
      <main className="course-not-found">
        <h1>Loading Course...</h1>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="course-not-found">
        <h1>Course Not Found</h1>
        <p>{error}</p>
        <Link to="/courses">
          ← Back to Courses
        </Link>
      </main>
    );
  }

  const totalLessons = course.modules
    ? course.modules.reduce((t, m) => t + (m.lessons ? m.lessons.length : 0), 0)
    : 0;

  // STRICT RULE: ONLY Web Development course should show ZIP files!
  const isWebDevCourse =
    (course.slug && course.slug.toLowerCase().includes("web")) ||
    (course.title && course.title.toLowerCase().includes("web")) ||
    (course._id && course._id.toString().includes("000000000000000000000001")) ||
    (slug && slug.toLowerCase().includes("web"));

  // Gather ALL unique ZIP files from zipFiles, resources, zipFile, and all lessons
  const zipMap = new Map();

  if (isWebDevCourse) {
    // 1. From zipFiles
    (course.zipFiles || []).forEach((z, i) => {
      const u = z && (z.url || z.fileUrl);
      if (u && !isStaleDummyZip(u)) {
        const key = z._id || `zf-${i}-${z.title || u}`;
        zipMap.set(key, {
          _id: z._id || `zf-${i}`,
          title: z.title || `Project ZIP Part ${i + 1}`,
          fileName: z.fileName || `project-part-${i + 1}.zip`,
          url: u,
          fileSize: z.fileSize || "ZIP File",
          isExternal: z.isExternal || isGoogleDriveUrl(u),
        });
      }
    });

    // 2. From resources
    (course.resources || []).forEach((r, i) => {
      const url = r.url || r.fileUrl;
      if (url && !isStaleDummyZip(url) && (url.toLowerCase().endsWith(".zip") || (r.fileName && r.fileName.toLowerCase().endsWith(".zip")) || isGoogleDriveUrl(url))) {
        const key = r._id || `res-${i}-${r.title || url}`;
        if (!zipMap.has(key)) {
          zipMap.set(key, {
            _id: r._id || `res-${i}`,
            title: r.title || r.fileName || `Resource ZIP Part ${i + 1}`,
            fileName: r.fileName || `resource-${i + 1}.zip`,
            url,
            fileSize: r.fileSize || "ZIP File",
            isExternal: r.isExternal || isGoogleDriveUrl(url),
          });
        }
      }
    });

    // 3. From legacy zipFile
    if (course.zipFile && course.zipFile.url && !isStaleDummyZip(course.zipFile.url)) {
      const u = course.zipFile.url;
      const key = course.zipFile._id || `main-zip-${u}`;
      if (!zipMap.has(key)) {
        zipMap.set(key, {
          _id: "main-zip",
          title: course.zipFile.title || course.zipFile.fileName || "Course Project ZIP",
          fileName: course.zipFile.fileName || "course-project.zip",
          url: u,
          fileSize: course.zipFile.fileSize || "ZIP Archive",
          isExternal: course.zipFile.isExternal || isGoogleDriveUrl(u),
        });
      }
    }

    // 4. From any lessons with zipUrl (ignoring stale 179119)
    (course.modules || []).forEach((m) => {
      (m.lessons || []).forEach((l) => {
        if (l.zipUrl && !isStaleDummyZip(l.zipUrl)) {
          const key = `lesson-zip-${l._id || l.title}`;
          if (!zipMap.has(key)) {
            zipMap.set(key, {
              _id: l._id || l.zipUrl,
              title: `${l.title} (Project ZIP)`,
              fileName: l.zipName || `${l.title}.zip`,
              url: l.zipUrl,
              fileSize: l.zipSize || "Lesson ZIP",
              isExternal: isGoogleDriveUrl(l.zipUrl),
            });
          }
        }
      });
    });

    // Guaranteed fallback: If WebDev course has 0 items in zipMap, populate with standard 5 Google Drive ZIPs
    if (zipMap.size === 0) {
      (WEB_DEV_FALLBACK_DATA.zipFiles || []).forEach((z, i) => {
        if (z && z.url) {
          zipMap.set(z._id || `zf-${i}`, {
            _id: z._id || `zf-${i}`,
            title: z.title || `Project ZIP Part ${i + 1}`,
            fileName: z.fileName || `project-part-${i + 1}.zip`,
            url: z.url,
            fileSize: z.fileSize || "Google Drive Cloud",
            isExternal: true,
          });
        }
      });
    }
  }

  const allCourseZips = isWebDevCourse ? Array.from(zipMap.values()) : [];

  const handleDownloadAllZips = () => {
    if (!allCourseZips || allCourseZips.length === 0) return;
    setIsDownloadingAll(true);

    allCourseZips.forEach((z, index) => {
      setTimeout(() => {
        const link = document.createElement("a");
        const isDrive = z.isExternal || isGoogleDriveUrl(z.url);
        link.href = isDrive
          ? (getGoogleDriveDownloadUrl(z.url) || getGoogleDriveViewUrl(z.url) || getDownloadUrl(z.url, z.fileName))
          : getDownloadUrl(z.url, z.fileName);
        if (!isDrive) {
          link.setAttribute("download", z.fileName || `course-project-part-${index + 1}.zip`);
        }
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noreferrer");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        if (index === allCourseZips.length - 1) {
          setTimeout(() => setIsDownloadingAll(false), 1000);
        }
      }, index * 450);
    });
  };

  return (
    <main className="course-details-page">

      {/* HERO SECTION */}
      <section className="course-details-hero">
        <div className="container">

          <Link
            to="/courses"
            className="back-link"
          >
            ← Back to Courses
          </Link>

          <span className="details-badge">
            {course.category || "Development"}
          </span>

          <h1>{course.title}</h1>

          <p>{course.description}</p>

          <div className="course-meta">
            <span>📊 {course.level || "Beginner"}</span>
            <span>⏱ {course.duration || "Self-Paced"}</span>
            <span>📚 {totalLessons} Lessons</span>
          </div>

        </div>
      </section>

      {/* MAIN CONTENT GRID */}
      <section className="course-content-section">

        <div className="container course-details-grid">

          <div className="course-main-content">

            {/* LESSON VIEWER / PLAYER */}
            {selectedLesson ? (
              <section className="lesson-video-section">

                <div className="lesson-video-header">
                  <span>🎬 Now Playing</span>
                  <h2>{selectedLesson.title}</h2>
                </div>

                {selectedLesson.videoUrl ? (
                  <div className="video-player-wrapper">
                    {(() => {
                      const embed = getVideoEmbedInfo(selectedLesson.videoUrl);
                      if (embed?.type === "iframe") {
                        return (
                          <iframe
                            className="lesson-video-player"
                            src={embed.src}
                            title={selectedLesson.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ width: "100%", height: "460px", minHeight: "360px", borderRadius: "12px", border: "none", background: "#000" }}
                          />
                        );
                      }
                      return (
                        <video
                          controls
                          controlsList="nodownload"
                          className="lesson-video-player"
                          src={embed?.src || getAssetUrl(selectedLesson.videoUrl)}
                          key={selectedLesson.videoUrl}
                        >
                          Your browser does not support video playback.
                        </video>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="video-empty-state" style={{ minHeight: "180px", padding: "30px 20px" }}>
                    <div>📖</div>
                    <h2>{selectedLesson.title}</h2>
                    <p>{selectedLesson.description || "Video lecture for this lesson will be available soon."}</p>
                  </div>
                )}

                {selectedLesson.description && selectedLesson.videoUrl && (
                  <p className="lesson-video-description">
                    {selectedLesson.description}
                  </p>
                )}

                {/* LESSON SPECIFIC ZIP DOWNLOAD BUTTON */}
                {isWebDevCourse && (selectedLesson.zipUrl || allCourseZips.length > 0) && (() => {
                  const zipUrl = selectedLesson.zipUrl || allCourseZips[0]?.url || "https://drive.google.com/drive/folders/1C10i264a0xaytSIhoNeW0j1seO75J8qt?usp=sharing";
                  const isFolder = isGoogleDriveFolder(zipUrl);
                  const zipTitle = selectedLesson.zipName || (selectedLesson.zipUrl ? `${selectedLesson.title}.zip` : (allCourseZips[0]?.title || "Web-Development-Complete-Projects.zip"));
                  const zipSize = selectedLesson.zipSize || allCourseZips[0]?.fileSize || "Google Drive Cloud";

                  return (
                    <div
                      style={{
                        marginTop: "16px",
                        padding: "14px 18px",
                        background: "rgba(34, 197, 94, 0.08)",
                        border: "1px solid rgba(34, 197, 94, 0.3)",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "12px",
                      }}
                    >
                      <div>
                        <span style={{ fontSize: "12px", fontWeight: "700", color: "#4ade80", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          📦 Lesson Project Code & Assets
                        </span>
                        <h4 style={{ margin: "4px 0 0 0", color: "#f0fdf4", fontSize: "15px" }}>
                          {zipTitle} {zipSize ? `(${zipSize})` : ""}
                        </h4>
                      </div>

                      <div style={{ display: "inline-flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                        {isFolder ? (
                          <a
                            href={getGoogleDriveViewUrl(zipUrl)}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "8px 16px",
                              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                              color: "#ffffff",
                              fontWeight: "800",
                              fontSize: "13px",
                              borderRadius: "8px",
                              textDecoration: "none",
                              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
                            }}
                            title="Open Google Drive Project Folder"
                          >
                            <span>📁</span> Open Drive Folder ↗
                          </a>
                        ) : (
                          <a
                            href={isGoogleDriveUrl(zipUrl) ? (getGoogleDriveDownloadUrl(zipUrl) || zipUrl) : getDownloadUrl(zipUrl, zipTitle)}
                            download={isGoogleDriveUrl(zipUrl) ? undefined : zipTitle}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "8px 16px",
                              background: "#22c55e",
                              color: "#031007",
                              fontWeight: "800",
                              fontSize: "13px",
                              borderRadius: "8px",
                              textDecoration: "none",
                              boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
                            }}
                            title="Direct Download ZIP file"
                          >
                            <span>📥</span> Download Lesson ZIP ⬇
                          </a>
                        )}
                        {isGoogleDriveUrl(zipUrl) && !isFolder && (
                          <a
                            href={getGoogleDriveViewUrl(zipUrl)}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              padding: "8px 14px",
                              background: "rgba(255, 255, 255, 0.08)",
                              border: "1px solid rgba(255, 255, 255, 0.2)",
                              borderRadius: "8px",
                              color: "#e2e8f0",
                              fontSize: "13px",
                              fontWeight: "700",
                              textDecoration: "none",
                            }}
                            title="Open single ZIP preview"
                          >
                            <span>👁️</span> Open ZIP ↗
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })()}

              </section>
            ) : (
              <section className="video-empty-state">
                <div>🎬</div>
                <h2>Select a lesson to start learning</h2>
                <p>Choose any lesson from the course curriculum below to start watching video lectures.</p>
              </section>
            )}

            {/* ALL COURSE ZIP FILES LIST IN MAIN CONTENT */}
            {allCourseZips.length > 0 && (
              <section className="course-materials-section" style={{ marginTop: "30px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
                  <div>
                    <h2 style={{ margin: 0 }}>📦 Course Resources & Project ZIP Files ({allCourseZips.length})</h2>
                    <p style={{ color: "#8da096", fontSize: "14px", margin: "6px 0 0 0" }}>
                      Download all project source codes, assets, and practice files for offline use:
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadAllZips}
                    disabled={isDownloadingAll}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "11px 20px",
                      background: isDownloadingAll
                        ? "linear-gradient(135deg, #10b981, #059669)"
                        : "linear-gradient(135deg, #22c55e, #16a34a)",
                      color: "#031007",
                      fontWeight: "800",
                      fontSize: "14px",
                      borderRadius: "10px",
                      border: "none",
                      cursor: isDownloadingAll ? "wait" : "pointer",
                      boxShadow: "0 6px 18px rgba(34, 197, 94, 0.4)",
                      transition: "all 0.2s ease",
                      opacity: isDownloadingAll ? 0.85 : 1,
                    }}
                  >
                    <span>⚡</span> {isDownloadingAll ? `Downloading ${allCourseZips.length} Files...` : `Download All ZIPs (${allCourseZips.length}) ⬇`}
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {allCourseZips.map((z, idx) => {
                    const isFolder = isGoogleDriveFolder(z.url);
                    return (
                      <div className="materials-card" key={z._id || idx}>
                        <div className="materials-icon">{isFolder ? "📁" : "📦"}</div>
                        <div className="materials-details">
                          <h3>{z.title || z.fileName}</h3>
                          <p>{z.fileName}</p>
                          <span className="materials-badge">
                            {isFolder
                              ? "☁️ Google Drive • Project Folder"
                              : ((z.isExternal || (z.url && (z.url.includes("drive.google.com") || z.url.includes("google.com"))))
                                ? `☁️ Google Drive • ${z.fileSize || "Cloud ZIP"}`
                                : (z.fileSize || "ZIP Archive"))}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                          {isFolder ? (
                            <a
                              href={getGoogleDriveViewUrl(z.url)}
                              target="_blank"
                              rel="noreferrer"
                              className="materials-download-btn"
                              style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "#ffffff" }}
                              title="Open Google Drive Project Folder"
                            >
                              📁 Open Drive Folder ↗
                            </a>
                          ) : (
                            <>
                              <a
                                href={isGoogleDriveUrl(z.url) ? (getGoogleDriveDownloadUrl(z.url) || z.url) : getDownloadUrl(z.url, z.fileName)}
                                download={z.isExternal || isGoogleDriveUrl(z.url) ? undefined : (z.fileName || `project-${idx + 1}.zip`)}
                                target="_blank"
                                rel="noreferrer"
                                className="materials-download-btn"
                                title="Direct Download ZIP file"
                              >
                                Download ZIP ⬇
                              </a>
                              {isGoogleDriveUrl(z.url) && (
                                <a
                                  href={getGoogleDriveViewUrl(z.url)}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "5px",
                                    padding: "11px 16px",
                                    background: "rgba(255, 255, 255, 0.08)",
                                    border: "1px solid rgba(255, 255, 255, 0.2)",
                                    borderRadius: "10px",
                                    color: "#e2e8f0",
                                    fontSize: "13px",
                                    fontWeight: "700",
                                    textDecoration: "none",
                                    transition: "all 0.2s ease",
                                  }}
                                  title="Open single ZIP preview"
                                >
                                  Open ZIP 👁️
                                </a>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* WHAT YOU WILL LEARN */}
            <section className="learn-section" style={{ marginTop: "35px" }}>
              <h2>What You'll Learn</h2>
              <div className="learn-grid">
                {[
                  "Complete course fundamentals & hands-on practical skills",
                  "Industry-standard tools and modern workflow",
                  "Step-by-step real-world project development",
                  "Best practices and professional coding techniques",
                  "Certification of completion upon finishing all lessons",
                ].map((item) => (
                  <div className="learn-item" key={item}>
                    <span>✓</span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* COURSE CURRICULUM */}
            <section className="curriculum-section" style={{ marginTop: "35px" }}>
              <h2>Course Curriculum</h2>
              <div className="modules">
                {course.modules && course.modules.length > 0 ? (
                  course.modules.map((module, moduleIndex) => (
                    <div className="module" key={module._id || moduleIndex}>
                      <h3>
                        Module {moduleIndex + 1} — {module.title}
                      </h3>

                      <div className="lesson-list">
                        {(!module.lessons || module.lessons.length === 0) ? (
                          <p style={{ color: "#718096", fontSize: "13px", padding: "10px 0" }}>
                            No lessons added in this module yet.
                          </p>
                        ) : (
                          module.lessons.map((lesson, lessonIndex) => (
                            <button
                              type="button"
                              className={`lesson ${
                                selectedLesson?._id === lesson._id ? "active-lesson" : ""
                              }`}
                              key={lesson._id || lessonIndex}
                              onClick={() => setSelectedLesson(lesson)}
                            >
                              <span className="lesson-number">{lessonIndex + 1}</span>
                              <span className="lesson-title">
                                {lesson.title}
                                {lesson.zipUrl && (
                                  <span style={{ marginLeft: "8px", fontSize: "10px", background: "rgba(34,197,94,0.15)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.3)", padding: "2px 6px", borderRadius: "4px", fontWeight: "700" }}>
                                    📦 ZIP
                                  </span>
                                )}
                              </span>
                              <span className="lesson-duration">{lesson.duration || "Lesson"}</span>
                              <span className="lesson-play">
                                {lesson.videoUrl ? "▶" : "📖"}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#8da096" }}>Curriculum content is being updated.</p>
                )}
              </div>
            </section>

          </div>

          {/* SIDEBAR */}
          <aside className="course-sidebar">
            <div className="enroll-card">
              <div className="course-preview">
                {course.thumbnail ? (
                  <img
                    src={getAssetUrl(course.thumbnail)}
                    alt={course.title}
                    style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.1)" }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                ) : (
                  <span>🎓</span>
                )}
              </div>

              <h3>{course.title}</h3>

              <div className="price-box">
                <span className="price">
                  {course.price === 0 ? "Free" : `₹${course.price}`}
                </span>
                <span className="price-tag">Lifetime Access</span>
              </div>

              {/* SIDEBAR MULTIPLE ZIP DOWNLOADS */}
              {allCourseZips.length > 0 && (
                <div style={{ marginTop: "16px", padding: "14px", background: "rgba(34, 197, 94, 0.08)", border: "1px solid rgba(34, 197, 94, 0.3)", borderRadius: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <strong style={{ color: "#4ade80", fontSize: "13px" }}>
                      📦 Project ZIPs ({allCourseZips.length}):
                    </strong>
                    {allCourseZips.length > 1 && (
                      <button
                        type="button"
                        onClick={handleDownloadAllZips}
                        disabled={isDownloadingAll}
                        style={{
                          background: "#22c55e",
                          color: "#031007",
                          fontSize: "11px",
                          fontWeight: "800",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          border: "none",
                          cursor: isDownloadingAll ? "wait" : "pointer",
                        }}
                      >
                        {isDownloadingAll ? "..." : "All ⬇"}
                      </button>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {allCourseZips.map((z, idx) => {
                      const isFolder = isGoogleDriveFolder(z.url);
                      const href = isFolder
                        ? getGoogleDriveViewUrl(z.url)
                        : (isGoogleDriveUrl(z.url) ? (getGoogleDriveDownloadUrl(z.url) || z.url) : getDownloadUrl(z.url, z.fileName));
                      return (
                        <a
                          key={z._id || idx}
                          href={href}
                          download={isFolder || z.isExternal || isGoogleDriveUrl(z.url) ? undefined : (z.fileName || `project-${idx + 1}.zip`)}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            padding: "7px 10px",
                            background: "rgba(0,0,0,0.3)",
                            border: isFolder ? "1px solid rgba(59,130,246,0.4)" : "1px solid rgba(34,197,94,0.3)",
                            borderRadius: "6px",
                            color: isFolder ? "#93c5fd" : "#86efac",
                            fontSize: "12px",
                            textDecoration: "none",
                            fontWeight: "600",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginRight: "6px" }}>
                            {isFolder ? "📁" : "📦"} {z.title || z.fileName}
                          </span>
                          <span style={{ color: isFolder ? "#60a5fa" : "#4ade80", fontWeight: "800", flexShrink: 0 }}>
                            {isFolder ? "📁 ↗" : (z.isExternal || isGoogleDriveUrl(z.url) ? "☁️" : "⬇")}
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="course-includes">
                <h4>This course includes:</h4>
                <ul>
                  <li>📹 {totalLessons} Video Lectures</li>
                  {allCourseZips.length > 0 && (
                    <li>📦 {allCourseZips.length} Downloadable ZIP File{allCourseZips.length > 1 ? "s" : ""}</li>
                  )}
                  <li>💻 Full Interactive Curriculum</li>
                  <li>📱 Mobile & Desktop Access</li>
                  <li>⚡ Self-Paced Learning</li>
                  <li>🏆 Certificate of Completion</li>
                </ul>
              </div>

              <button className="enroll-btn" onClick={() => alert("Enrollment is active! Select any lesson to start learning.")}>
                Enroll Now →
              </button>
            </div>
          </aside>

        </div>

      </section>

    </main>
  );
}

export default CourseDetails;