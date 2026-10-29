import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getApiUrl, getAssetUrl, getDownloadUrl, formatGoogleDriveUrl } from "../config/api";
import "./AdminCourseContent.css";

const AI_FALLBACK_DATA = {
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
};

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
        { _id: "web-les-1", title: "Lesson 1: HTML5 Semantic Structure & Starter Project", duration: "35 min", videoUrl: "", zipUrl: "https://drive.google.com/file/d/1C10i264a0xaytSIhoNeW0j1seO75J8qt/view", zipName: "01-HTML5-CSS3-Responsive-Starter.zip", zipSize: "185 MB" },
        { _id: "web-les-2", title: "Lesson 2: CSS3 Flexbox & Grid Responsive Layouts", duration: "45 min", videoUrl: "", zipSize: "507 MB" },
        { _id: "web-les-3", title: "Lesson 3: Complete Responsive Agency Landing Page", duration: "50 min", videoUrl: "", zipSize: "185 MB" },
      ],
    },
    {
      _id: "web-mod-2",
      title: "Module 2: JavaScript DOM & Interactive Applications",
      description: "Master core JavaScript, DOM manipulation, asynchronous programming, APIs, and interactive applications.",
      lessons: [
        { _id: "web-les-4", title: "Lesson 4: JavaScript Fundamentals & Dynamic DOM Control", duration: "55 min", videoUrl: "", zipUrl: "https://drive.google.com/file/d/1C10i264a0xaytSIhoNeW0j1seO75J8qt/view", zipName: "02-JavaScript-DOM-Async-Projects.zip", zipSize: "351 MB" },
        { _id: "web-les-5", title: "Lesson 5: Async JS, REST APIs & Live Weather Application", duration: "60 min", videoUrl: "", zipSize: "436 MB" },
        { _id: "web-les-6", title: "Lesson 6: Interactive CRUD App with LocalStorage", duration: "50 min", videoUrl: "", zipSize: "707 MB" },
      ],
    },
    {
      _id: "web-mod-3",
      title: "Module 3: React.js & Modern Frontend Architecture",
      description: "Build robust single-page applications using React components, hooks, routing, and state management.",
      lessons: [
        { _id: "web-les-7", title: "Lesson 7: React Setup, JSX, Components & Props", duration: "45 min", videoUrl: "", zipUrl: "https://drive.google.com/file/d/1C10i264a0xaytSIhoNeW0j1seO75J8qt/view", zipName: "03-React-Ecommerce-App-Source.zip", zipSize: "586 MB" },
        { _id: "web-les-8", title: "Lesson 8: React Hooks (useState, useEffect) & Context API", duration: "55 min", videoUrl: "", zipSize: "356 MB" },
        { _id: "web-les-9", title: "Lesson 9: Full E-Commerce Product Catalog with Cart", duration: "65 min", videoUrl: "", zipSize: "301 MB" },
      ],
    },
    {
      _id: "web-mod-4",
      title: "Module 4: Full-Stack Backend, Database & Deployment",
      description: "Build RESTful APIs with Node.js, Express, MongoDB, and deploy full-stack applications to cloud servers.",
      lessons: [
        { _id: "web-les-10", title: "Lesson 10: Node.js & Express REST API Architecture", duration: "50 min", videoUrl: "", zipUrl: "https://drive.google.com/file/d/1C10i264a0xaytSIhoNeW0j1seO75J8qt/view", zipName: "04-FullStack-MERN-Capstone-Project.zip", zipSize: "420 MB" },
        { _id: "web-les-11", title: "Lesson 11: MongoDB, Mongoose Schemas & JWT Auth", duration: "60 min", videoUrl: "", zipSize: "197 MB" },
        { _id: "web-les-12", title: "Lesson 12: Full Stack Production Deployment & CI/CD", duration: "60 min", videoUrl: "", zipSize: "333 MB" },
      ],
    },
  ],
  zipFile: {
    _id: "zf-wd-main",
    title: "Web Development Complete Course Project & Source Code (Google Drive)",
    fileName: "Web-Development-Complete-Projects.zip",
    url: "https://drive.google.com/file/d/1C10i264a0xaytSIhoNeW0j1seO75J8qt/view",
    fileSize: "Google Drive Cloud Folder",
    isExternal: true,
    source: "Google Drive",
  },
  zipFiles: [
    {
      _id: "zf-wd-main",
      title: "01: Web Development Complete Project & Source Code (Google Drive)",
      fileName: "Web-Development-Complete-Projects.zip",
      url: "https://drive.google.com/file/d/1C10i264a0xaytSIhoNeW0j1seO75J8qt/view",
      fileSize: "Google Drive Cloud",
      isExternal: true,
      source: "Google Drive",
    },
    {
      _id: "zf-wd-1",
      title: "02: HTML5 & Modern Responsive CSS Starter Kit ZIP",
      fileName: "01-HTML5-CSS3-Responsive-Starter.zip",
      url: "https://drive.google.com/file/d/1C10i264a0xaytSIhoNeW0j1seO75J8qt/view",
      fileSize: "Google Drive Cloud",
      isExternal: true,
      source: "Google Drive",
    },
    {
      _id: "zf-wd-2",
      title: "03: JavaScript DOM & Async REST API Projects ZIP",
      fileName: "02-JavaScript-DOM-Async-Projects.zip",
      url: "https://drive.google.com/file/d/1C10i264a0xaytSIhoNeW0j1seO75J8qt/view",
      fileSize: "Google Drive Cloud",
      isExternal: true,
      source: "Google Drive",
    },
    {
      _id: "zf-wd-3",
      title: "04: React.js E-Commerce Catalog & Modern UI ZIP",
      fileName: "03-React-Ecommerce-App-Source.zip",
      url: "https://drive.google.com/file/d/1C10i264a0xaytSIhoNeW0j1seO75J8qt/view",
      fileSize: "Google Drive Cloud",
      isExternal: true,
      source: "Google Drive",
    },
    {
      _id: "zf-wd-4",
      title: "05: Full-Stack MERN Capstone Project Complete ZIP",
      fileName: "04-FullStack-MERN-Capstone-Project.zip",
      url: "https://drive.google.com/file/d/1C10i264a0xaytSIhoNeW0j1seO75J8qt/view",
      fileSize: "Google Drive Cloud",
      isExternal: true,
      source: "Google Drive",
    },
  ],
  resources: [
    {
      _id: "res-wd-main",
      title: "Web Development Complete Course Project & Source Code (Google Drive)",
      fileName: "Web-Development-Complete-Projects.zip",
      url: "https://drive.google.com/file/d/1C10i264a0xaytSIhoNeW0j1seO75J8qt/view",
      fileUrl: "https://drive.google.com/file/d/1C10i264a0xaytSIhoNeW0j1seO75J8qt/view",
      fileSize: "Google Drive Cloud",
      isExternal: true,
      source: "Google Drive",
    },
    {
      _id: "res-wd-1",
      title: "02: HTML5 & Modern Responsive CSS Starter Kit ZIP",
      fileName: "01-HTML5-CSS3-Responsive-Starter.zip",
      url: "https://drive.google.com/file/d/1C10i264a0xaytSIhoNeW0j1seO75J8qt/view",
      fileUrl: "https://drive.google.com/file/d/1C10i264a0xaytSIhoNeW0j1seO75J8qt/view",
      fileSize: "Google Drive Cloud",
      isExternal: true,
      source: "Google Drive",
    },
    {
      _id: "res-wd-2",
      title: "03: JavaScript DOM & Async REST API Projects ZIP",
      fileName: "02-JavaScript-DOM-Async-Projects.zip",
      url: "https://drive.google.com/file/d/1C10i264a0xaytSIhoNeW0j1seO75J8qt/view",
      fileUrl: "https://drive.google.com/file/d/1C10i264a0xaytSIhoNeW0j1seO75J8qt/view",
      fileSize: "Google Drive Cloud",
      isExternal: true,
      source: "Google Drive",
    },
    {
      _id: "res-wd-3",
      title: "04: React.js E-Commerce Catalog & Modern UI ZIP",
      fileName: "03-React-Ecommerce-App-Source.zip",
      url: "https://drive.google.com/file/d/1C10i264a0xaytSIhoNeW0j1seO75J8qt/view",
      fileUrl: "https://drive.google.com/file/d/1C10i264a0xaytSIhoNeW0j1seO75J8qt/view",
      fileSize: "Google Drive Cloud",
      isExternal: true,
      source: "Google Drive",
    },
    {
      _id: "res-wd-4",
      title: "05: Full-Stack MERN Capstone Project Complete ZIP",
      fileName: "04-FullStack-MERN-Capstone-Project.zip",
      url: "https://drive.google.com/file/d/1C10i264a0xaytSIhoNeW0j1seO75J8qt/view",
      fileUrl: "https://drive.google.com/file/d/1C10i264a0xaytSIhoNeW0j1seO75J8qt/view",
      fileSize: "Google Drive Cloud",
      isExternal: true,
      source: "Google Drive",
    },
  ],
};

const FALLBACK_COURSES_MAP = {
  ai: AI_FALLBACK_DATA,
  "660000000000000000000004": AI_FALLBACK_DATA,
  "web-development": WEB_DEV_FALLBACK_DATA,
  "660000000000000000000001": WEB_DEV_FALLBACK_DATA,
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
          { _id: "and-les-1", title: "Lesson 1: Android Studio Installation & Project Anatomy", duration: "30 min", videoUrl: "" },
          { _id: "and-les-2", title: "Lesson 2: Kotlin Fundamentals, OOP & Coroutines", duration: "45 min", videoUrl: "" },
        ],
      },
      {
        _id: "and-mod-2",
        title: "Module 2: Modern UI with Jetpack Compose",
        description: "Declarative UI, State management, Navigation, Material 3 Design.",
        lessons: [
          { _id: "and-les-3", title: "Lesson 3: Jetpack Compose Layouts & Material Design 3", duration: "50 min", videoUrl: "" },
          { _id: "and-les-4", title: "Lesson 4: Compose State, ViewModel & Navigation", duration: "45 min", videoUrl: "" },
        ],
      },
      {
        _id: "and-mod-3",
        title: "Module 3: Networking, Storage & MVVM Architecture",
        description: "Retrofit, Room SQLite Database, Repository Pattern, and Hilt Dependency Injection.",
        lessons: [
          { _id: "and-les-5", title: "Lesson 5: REST API Integration with Retrofit & OkHttp", duration: "55 min", videoUrl: "" },
          { _id: "and-les-6", title: "Lesson 6: Local Persistence with Room Database & DataStore", duration: "50 min", videoUrl: "" },
        ],
      },
      {
        _id: "and-mod-4",
        title: "Module 4: Full App Project, Testing & Play Store Deployment",
        description: "Capstone project, Unit testing, App bundle creation, and Play Console release.",
        lessons: [
          { _id: "and-les-7", title: "Lesson 7: Full E-Commerce / Social App Project with Firebase", duration: "65 min", videoUrl: "" },
          { _id: "and-les-8", title: "Lesson 8: App Bundle (AAB), ProGuard & Google Play Release", duration: "40 min", videoUrl: "" },
        ],
      },
    ],
    zipFile: null,
    zipFiles: [],
    resources: [],
  },
  "660000000000000000000005": {
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
          { _id: "and-les-1", title: "Lesson 1: Android Studio Installation & Project Anatomy", duration: "30 min", videoUrl: "" },
          { _id: "and-les-2", title: "Lesson 2: Kotlin Fundamentals, OOP & Coroutines", duration: "45 min", videoUrl: "" },
        ],
      },
      {
        _id: "and-mod-2",
        title: "Module 2: Modern UI with Jetpack Compose",
        description: "Declarative UI, State management, Navigation, Material 3 Design.",
        lessons: [
          { _id: "and-les-3", title: "Lesson 3: Jetpack Compose Layouts & Material Design 3", duration: "50 min", videoUrl: "" },
          { _id: "and-les-4", title: "Lesson 4: Compose State, ViewModel & Navigation", duration: "45 min", videoUrl: "" },
        ],
      },
      {
        _id: "and-mod-3",
        title: "Module 3: Networking, Storage & MVVM Architecture",
        description: "Retrofit, Room SQLite Database, Repository Pattern, and Hilt Dependency Injection.",
        lessons: [
          { _id: "and-les-5", title: "Lesson 5: REST API Integration with Retrofit & OkHttp", duration: "55 min", videoUrl: "" },
          { _id: "and-les-6", title: "Lesson 6: Local Persistence with Room Database & DataStore", duration: "50 min", videoUrl: "" },
        ],
      },
      {
        _id: "and-mod-4",
        title: "Module 4: Full App Project, Testing & Play Store Deployment",
        description: "Capstone project, Unit testing, App bundle creation, and Play Console release.",
        lessons: [
          { _id: "and-les-7", title: "Lesson 7: Full E-Commerce / Social App Project with Firebase", duration: "65 min", videoUrl: "" },
          { _id: "and-les-8", title: "Lesson 8: App Bundle (AAB), ProGuard & Google Play Release", duration: "40 min", videoUrl: "" },
        ],
      },
    ],
    zipFile: null,
    zipFiles: [],
    resources: [],
  },
};

function AdminCourseContent() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);

  // Module state
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");

  // Selected module for adding lessons
  const [selectedModule, setSelectedModule] = useState(null);

  // Lesson state
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [lessonDuration, setLessonDuration] = useState("");
  const [lessonIsPreview, setLessonIsPreview] = useState(false);
  const [lessonVideoMode, setLessonVideoMode] = useState("url"); // "url" | "file"
  const [lessonVideoUrl, setLessonVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [uploadingLesson, setUploadingLesson] = useState(false);

  // Course ZIP Upload State
  const [zipMode, setZipMode] = useState("drive"); // "drive" | "file"
  const [zipTitle, setZipTitle] = useState("");
  const [driveUrl, setDriveUrl] = useState("");
  const [driveFileSize, setDriveFileSize] = useState("");
  const [zipFile, setZipFile] = useState(null);
  const [uploadingZip, setUploadingZip] = useState(false);

  const [message, setMessage] = useState("");

  // Edit Module Modal State
  const [editingModule, setEditingModule] = useState(null);
  const [editModuleData, setEditModuleData] = useState({
    title: "",
    description: "",
  });

  // Edit Lesson Modal State
  const [editingLesson, setEditingLesson] = useState(null);
  const [editLessonParentModuleId, setEditLessonParentModuleId] = useState(null);
  const [editLessonData, setEditLessonData] = useState({
    title: "",
    description: "",
    duration: "",
    videoUrl: "",
    isPreview: false,
  });
  const [savingLessonEdit, setSavingLessonEdit] = useState(false);

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

  // Helper to persist course changes across all relevant localStorage keys
  const saveCourseToLocal = (courseData) => {
    if (!courseData) return;
    try {
      const cleanKey = (courseData.slug || id || "").toLowerCase();
      const raw = JSON.stringify(courseData);
      localStorage.setItem(`admin_course_${cleanKey}`, raw);
      localStorage.setItem(`admin_course_${id}`, raw);
      if (cleanKey.includes("web") || id === "660000000000000000000001") {
        localStorage.setItem("admin_course_web-development", raw);
        localStorage.setItem("admin_course_660000000000000000000001", raw);
      } else if (cleanKey.includes("ai") || id === "660000000000000000000002") {
        localStorage.setItem("admin_course_ai", raw);
        localStorage.setItem("admin_course_660000000000000000000002", raw);
      } else if (cleanKey.includes("android") || id === "660000000000000000000003") {
        localStorage.setItem("admin_course_android", raw);
        localStorage.setItem("admin_course_660000000000000000000003", raw);
      }
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  };

  // ==========================================
  // LOAD COURSE
  // ==========================================
  const loadCourse = async () => {
    let resolvedCourse = null;

    try {
      let response = await fetch(getApiUrl(`/api/courses/id/${id}`));
      if (!response.ok) {
        response = await fetch(getApiUrl(`/api/courses/${id}`));
      }
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.course) {
          resolvedCourse = data.course;
        }
      }
    } catch (apiError) {
      console.warn("Backend fetch failed, checking local fallbacks:", apiError);
    }

    const cleanId = (id || "").toLowerCase();
    let savedLocal = null;
    try {
      const candidateKeys = [
        `admin_course_${cleanId}`,
        `admin_course_${id}`,
        (cleanId === "660000000000000000000001" || cleanId.includes("web")) ? "admin_course_web-development" : null,
        (cleanId === "660000000000000000000001" || cleanId.includes("web")) ? "admin_course_660000000000000000000001" : null,
        (cleanId === "660000000000000000000002" || cleanId.includes("ai")) ? "admin_course_ai" : null,
        (cleanId === "660000000000000000000002" || cleanId.includes("ai")) ? "admin_course_660000000000000000000002" : null,
        (cleanId === "660000000000000000000003" || cleanId.includes("android")) ? "admin_course_android" : null,
        (cleanId === "660000000000000000000003" || cleanId.includes("android")) ? "admin_course_660000000000000000000003" : null,
      ].filter(Boolean);

      for (const k of candidateKeys) {
        const saved = localStorage.getItem(k);
        if (saved) {
          savedLocal = JSON.parse(saved);
          if (savedLocal.zipFiles) {
            savedLocal.zipFiles = savedLocal.zipFiles.filter((z) => z && z.url && !isStaleDummyZip(z.url));
          }
          if (savedLocal.zipFile && isStaleDummyZip(savedLocal.zipFile.url)) {
            savedLocal.zipFile = null;
          }
          break;
        }
      }
    } catch (e) {}

    if (!resolvedCourse) {
      resolvedCourse =
        savedLocal ||
        FALLBACK_COURSES_MAP[cleanId] ||
        FALLBACK_COURSES_MAP[id] ||
        (cleanId.includes("ai") || cleanId.includes("artificial")
          ? FALLBACK_COURSES_MAP["ai"]
          : cleanId.includes("web")
          ? FALLBACK_COURSES_MAP["web-development"]
          : cleanId.includes("android")
          ? FALLBACK_COURSES_MAP["android"]
          : null);
    } else {
      // Merge any clean extra zips from local
      if (savedLocal && savedLocal.zipFiles) {
        const remoteZips = (resolvedCourse.zipFiles || []).filter((z) => z && z.url && !isStaleDummyZip(z.url));
        const localZips = (savedLocal.zipFiles || []).filter((z) => z && z.url && !isStaleDummyZip(z.url));
        const zipMergeMap = new Map();
        remoteZips.forEach((z) => zipMergeMap.set(z.url, z));
        localZips.forEach((z) => {
          if (!zipMergeMap.has(z.url)) zipMergeMap.set(z.url, z);
        });
        resolvedCourse.zipFiles = Array.from(zipMergeMap.values());
      }
    }

    if (resolvedCourse) {
      if (!resolvedCourse.modules || resolvedCourse.modules.length === 0) {
        const fallback = FALLBACK_COURSES_MAP[cleanId] || FALLBACK_COURSES_MAP[id];
        if (fallback?.modules && fallback.modules.length > 0) {
          resolvedCourse.modules = fallback.modules;
        }
      }

      // Ensure WebDev zipFiles are populated with exact Google Drive link
      const isWebCourse =
        cleanId.includes("web") ||
        cleanId === "660000000000000000000001" ||
        cleanId === "000000000000000000000001" ||
        resolvedCourse.slug === "web-development" ||
        (resolvedCourse.title && resolvedCourse.title.toLowerCase().includes("web"));

      if (isWebCourse) {
        if (!resolvedCourse.zipFiles || resolvedCourse.zipFiles.length === 0) {
          resolvedCourse.zipFiles = WEB_DEV_FALLBACK_DATA.zipFiles;
          resolvedCourse.zipFile = WEB_DEV_FALLBACK_DATA.zipFile;
          resolvedCourse.resources = WEB_DEV_FALLBACK_DATA.resources;
        } else {
          resolvedCourse.zipFiles = resolvedCourse.zipFiles.map((z) => ({
            ...z,
            url: (z && z.url && z.url.includes("1Cybrical-WebDev")) ? "https://drive.google.com/file/d/1C10i264a0xaytSIhoNeW0j1seO75J8qt/view" : (z ? z.url : ""),
          }));
          if (resolvedCourse.zipFile && resolvedCourse.zipFile.url && resolvedCourse.zipFile.url.includes("1Cybrical-WebDev")) {
            resolvedCourse.zipFile.url = "https://drive.google.com/file/d/1C10i264a0xaytSIhoNeW0j1seO75J8qt/view";
          }
        }
      } else {
        // Enforce: ONLY Web Development course shows zip files!
        resolvedCourse.zipFiles = [];
        resolvedCourse.zipFile = { url: "", fileName: "", fileSize: "" };
        if (resolvedCourse.resources) {
          resolvedCourse.resources = resolvedCourse.resources.filter((r) => {
            const u = (r.url || r.fileUrl || "").toLowerCase();
            return !u.endsWith(".zip") && !u.includes("drive.google.com");
          });
        }
        if (resolvedCourse.modules) {
          resolvedCourse.modules.forEach((m) => {
            (m.lessons || []).forEach((l) => {
              l.zipUrl = "";
              l.zipName = "";
              l.zipSize = "";
            });
          });
        }
      }

      // Filter out any dead dummy zip files
      if (resolvedCourse.zipFiles) {
        resolvedCourse.zipFiles = resolvedCourse.zipFiles.filter(
          (z) => z && z.url && !isStaleDummyZip(z.url)
        );
      }
      if (resolvedCourse.zipFile && isStaleDummyZip(resolvedCourse.zipFile.url)) {
        resolvedCourse.zipFile = { url: "", fileName: "", fileSize: "" };
      }
      if (resolvedCourse.resources) {
        resolvedCourse.resources = resolvedCourse.resources.filter(
          (r) => !isStaleDummyZip(r.url || r.fileUrl)
        );
      }

      setCourse(resolvedCourse);
      if (!selectedModule && resolvedCourse.modules && resolvedCourse.modules.length > 0) {
        setSelectedModule(resolvedCourse.modules[0]._id);
      }
    } else {
      setMessage(`❌ Course not found for identifier: ${id}`);
    }
  };

  useEffect(() => {
    loadCourse();
  }, [id]);

  // ==========================================
  // DIRECT VIDEO UPLOAD HELPER
  // ==========================================
  const uploadVideoDirect = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("video", file);
    const response = await fetch(getApiUrl("/api/courses/upload-video"), {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Video upload failed");
    return data;
  };

  // ==========================================
  // UPLOAD COURSE ZIP FILE (SUPPORTS 1st, 2nd, 3rd ZIP)
  // ==========================================
  const handleUploadCourseZip = async (e) => {
    e.preventDefault();
    if (!zipFile) {
      setMessage("❌ Please choose a ZIP file first");
      return;
    }

    setUploadingZip(true);
    setMessage("⏳ Uploading course ZIP file...");

    try {
      const formData = new FormData();
      formData.append("zipFile", zipFile);
      if (zipTitle.trim()) {
        formData.append("title", zipTitle.trim());
      }

      let fileUrl = "";
      let fileName = zipFile.name;
      let fileSize = `${(zipFile.size / (1024 * 1024)).toFixed(2)} MB`;

      let uploadRes = await fetch(getApiUrl(`/api/courses/${id}/upload-zip`), {
        method: "POST",
        body: formData,
      });

      if (uploadRes.ok) {
        const uploadData = await uploadRes.json();
        fileUrl = uploadData.zipFile?.url || uploadData.fileUrl || uploadData.videoUrl || "";
        fileName = uploadData.zipFile?.fileName || uploadData.fileName || zipFile.name;
        fileSize = uploadData.zipFile?.fileSize || uploadData.fileSize || fileSize;
      } else {
        const fallbackForm = new FormData();
        fallbackForm.append("video", zipFile);
        const fallbackRes = await fetch(getApiUrl("/api/courses/upload-video"), {
          method: "POST",
          body: fallbackForm,
        });
        const fallbackData = await fallbackRes.json();
        if (!fallbackRes.ok) throw new Error(fallbackData.message || "Upload failed");
        fileUrl = fallbackData.videoUrl || fallbackData.fileUrl || "";
        fileName = fallbackData.fileName || zipFile.name;
        fileSize = fallbackData.fileSize || fileSize;
      }

      if (!fileUrl) {
        throw new Error("Could not obtain file URL after upload");
      }

      const newZipItem = {
        title: zipTitle.trim() || zipFile.name,
        url: fileUrl,
        fileName: fileName,
        fileSize: fileSize,
      };

      // Collect all current unique ZIPs
      const currentList = Array.from(zipMap.values()).map((z) => ({
        title: z.title || z.fileName,
        url: z.url,
        fileName: z.fileName,
        fileSize: z.fileSize,
      }));

      const updatedZipFiles = [
        ...currentList.filter((z) => z.url !== newZipItem.url),
        newZipItem,
      ];

      // Save via PUT /api/courses/:id
      let updatedCourseObj = null;
      try {
        const updateRes = await fetch(getApiUrl(`/api/courses/${id}`), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            zipFiles: updatedZipFiles,
            zipFile: newZipItem,
          }),
        });
        if (updateRes.ok) {
          const updateData = await updateRes.json();
          if (updateData.course) updatedCourseObj = updateData.course;
        }
      } catch (err) {
        console.warn("Backend update failed, using local update:", err);
      }

      setCourse((prev) => {
        const merged = {
          ...(updatedCourseObj || prev),
          zipFiles: updatedZipFiles,
          zipFile: newZipItem,
        };
        saveCourseToLocal(merged);
        return merged;
      });

      setMessage(`✅ ZIP file "${newZipItem.title}" added successfully! Total ZIPs: ${updatedZipFiles.length}`);
      setZipFile(null);
      setZipTitle("");
      const zipInput = document.getElementById("course-zip-file-input");
      if (zipInput) zipInput.value = "";
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setUploadingZip(false);
    }
  };

  // ==========================================
  // ADD GOOGLE DRIVE / DIRECT LINK ZIP
  // ==========================================
  const handleAddDriveZip = async (e) => {
    e.preventDefault();
    if (!driveUrl.trim()) {
      setMessage("❌ Please enter a Google Drive link or direct ZIP URL");
      return;
    }

    setUploadingZip(true);
    setMessage("⏳ Adding Google Drive ZIP file...");

    try {
      const formattedUrl = formatGoogleDriveUrl(driveUrl.trim());
      const customTitle = zipTitle.trim() || "Course Material ZIP";
      const customFileName = customTitle.toLowerCase().endsWith(".zip") ? customTitle : `${customTitle}.zip`;
      const customSize = driveFileSize.trim() || "Google Drive Cloud";

      const newZipItem = {
        _id: `zf-gdrive-${Date.now()}`,
        title: customTitle,
        url: formattedUrl,
        fileName: customFileName,
        fileSize: customSize,
        isExternal: true,
        source: "Google Drive",
      };

      // 1. Immediately update local state and localStorage
      setCourse((prevCourse) => {
        const base = prevCourse || {};
        const oldZips = (base.zipFiles || []).filter(
          (z) => z && z.url && !isStaleDummyZip(z.url) && z.url !== formattedUrl
        );
        const updated = {
          ...base,
          zipFiles: [...oldZips, newZipItem],
          zipFile: newZipItem,
        };
        saveCourseToLocal(updated);
        return updated;
      });

      // 2. Persist to Backend API
      let success = false;
      try {
        const res = await fetch(getApiUrl(`/api/courses/${id}/add-drive-zip`), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: formattedUrl,
            title: customTitle,
            fileName: customFileName,
            fileSize: customSize,
            slug: course?.slug || (id === "660000000000000000000001" ? "web-development" : undefined),
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.course) {
            setCourse(data.course);
            saveCourseToLocal(data.course);
            success = true;
          }
        }
      } catch (err) {
        console.warn("Direct /add-drive-zip error, using PUT fallback:", err);
      }

      if (!success) {
        try {
          const currentList = (course?.zipFiles || []).filter(
            (z) => z && z.url && !isStaleDummyZip(z.url) && z.url !== formattedUrl
          );
          const updatedZipFiles = [...currentList, newZipItem];
          const updateRes = await fetch(getApiUrl(`/api/courses/${id}`), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              zipFiles: updatedZipFiles,
              zipFile: newZipItem,
            }),
          });
          if (updateRes.ok) {
            const updateData = await updateRes.json();
            if (updateData.course) {
              setCourse(updateData.course);
              saveCourseToLocal(updateData.course);
            }
          }
        } catch (e) {
          console.warn("PUT update fallback failed:", e);
        }
      }

      setDriveUrl("");
      setZipTitle("");
      setDriveFileSize("");
      setMessage(`✅ Google Drive ZIP "${customTitle}" added successfully!`);
      await loadCourse();
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setUploadingZip(false);
    }
  };

  // ==========================================
  // DELETE SPECIFIC ZIP FILE FROM COURSE
  // ==========================================
  const handleDeleteSpecificZip = async (zipObj) => {
    const zipName = zipObj.title || zipObj.fileName || "ZIP File";
    const confirmed = window.confirm(`Are you sure you want to remove ZIP file "${zipName}"?`);
    if (!confirmed) return;

    setMessage("⏳ Removing ZIP file...");

    try {
      const isTarget = (item) => {
        if (!item) return false;
        if (zipObj._id && item._id && item._id.toString() === zipObj._id.toString()) return true;
        const itemUrl = (item.url || item.fileUrl || "").trim().toLowerCase();
        const targetUrl = (zipObj.url || "").trim().toLowerCase();
        if (targetUrl && itemUrl && itemUrl === targetUrl) return true;
        const itemFn = (item.fileName || "").trim().toLowerCase();
        const targetFn = (zipObj.fileName || "").trim().toLowerCase();
        if (targetFn && itemFn && itemFn === targetFn) return true;
        return false;
      };

      const updatedZipFiles = (course?.zipFiles || []).filter((z) => !isTarget(z));
      const updatedResources = (course?.resources || []).filter((r) => !isTarget(r));
      const updatedZipFile =
        updatedZipFiles.length > 0
          ? {
              url: updatedZipFiles[updatedZipFiles.length - 1].url,
              fileName: updatedZipFiles[updatedZipFiles.length - 1].fileName,
              fileSize: updatedZipFiles[updatedZipFiles.length - 1].fileSize,
            }
          : { url: "", fileName: "", fileSize: "" };

      let updatedCourse = {
        ...course,
        zipFiles: updatedZipFiles,
        zipFile: updatedZipFile,
        resources: updatedResources,
      };

      try {
        const response = await fetch(getApiUrl(`/api/courses/${id}`), {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            zipFiles: updatedZipFiles,
            zipFile: updatedZipFile,
            resources: updatedResources,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.course) updatedCourse = data.course;
        }
      } catch (e) {
        console.warn("Backend update failed, applying local delete:", e);
      }

      setCourse(updatedCourse);
      saveCourseToLocal(updatedCourse);

      setMessage(`✅ ZIP file "${zipName}" removed successfully.`);
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  // ==========================================
  // DELETE ALL ZIP FILES FROM COURSE
  // ==========================================
  const handleDeleteAllZips = async () => {
    const confirmed = window.confirm("Are you sure you want to remove ALL ZIP files from this course?");
    if (!confirmed) return;

    setMessage("⏳ Removing all ZIP files...");

    try {
      const updatedResources = (course?.resources || []).filter((r) => {
        const u = (r.url || r.fileUrl || "").toLowerCase();
        const fn = (r.fileName || "").toLowerCase();
        return !u.endsWith(".zip") && !fn.endsWith(".zip") && !u.endsWith(".rar") && !u.endsWith(".7z");
      });

      let updatedCourse = {
        ...course,
        zipFiles: [],
        zipFile: { url: "", fileName: "", fileSize: "" },
        resources: updatedResources,
      };

      try {
        const response = await fetch(getApiUrl(`/api/courses/${id}`), {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            zipFiles: [],
            zipFile: { url: "", fileName: "", fileSize: "" },
            resources: updatedResources,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.course) updatedCourse = data.course;
        }
      } catch (e) {
        console.warn("Backend update failed, applying local delete all:", e);
      }

      setCourse(updatedCourse);
      saveCourseToLocal(updatedCourse);

      setMessage("✅ All ZIP files removed successfully.");
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  // ==========================================
  // MODULE CRUD: CREATE
  // ==========================================
  const addModule = async (e) => {
    e.preventDefault();

    if (!moduleTitle.trim()) {
      setMessage("❌ Please enter module title");
      return;
    }

    try {
      let updatedCourse = course;
      const newModule = {
        _id: `mod-${Date.now()}`,
        title: moduleTitle.trim(),
        description: moduleDescription.trim(),
        order: (course?.modules?.length || 0) + 1,
        lessons: [],
      };

      try {
        const response = await fetch(getApiUrl(`/api/courses/${id}/modules`), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: moduleTitle,
            description: moduleDescription,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.course) updatedCourse = data.course;
        } else {
          updatedCourse = {
            ...course,
            modules: [...(course?.modules || []), newModule],
          };
        }
      } catch (err) {
        updatedCourse = {
          ...course,
          modules: [...(course?.modules || []), newModule],
        };
      }

      setMessage("✅ Module added successfully!");
      setModuleTitle("");
      setModuleDescription("");
      setCourse(updatedCourse);
      saveCourseToLocal(updatedCourse);

      if (updatedCourse.modules && updatedCourse.modules.length > 0) {
        setSelectedModule(updatedCourse.modules[updatedCourse.modules.length - 1]._id);
      }
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  // ==========================================
  // MODULE CRUD: EDIT
  // ==========================================
  const openEditModuleModal = (module) => {
    setEditingModule(module);
    setEditModuleData({
      title: module.title || "",
      description: module.description || "",
    });
  };

  const handleUpdateModule = async (e) => {
    e.preventDefault();
    if (!editingModule) return;

    try {
      let updatedCourse = {
        ...course,
        modules: (course?.modules || []).map((m) =>
          m._id === editingModule._id
            ? { ...m, ...editModuleData }
            : m
        ),
      };

      try {
        const response = await fetch(
          getApiUrl(`/api/courses/${id}/modules/${editingModule._id}`),
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editModuleData),
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.course) updatedCourse = data.course;
        }
      } catch (err) {
        console.warn("Backend update failed, using local module update:", err);
      }

      setMessage("✅ Module updated successfully!");
      setEditingModule(null);
      setCourse(updatedCourse);
      saveCourseToLocal(updatedCourse);
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  // ==========================================
  // MODULE CRUD: DELETE
  // ==========================================
  const handleDeleteModule = async (moduleId, modTitle) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete module "${modTitle}" and all its lessons?`
    );
    if (!confirmed) return;

    try {
      let updatedCourse = {
        ...course,
        modules: (course?.modules || []).filter((m) => m._id !== moduleId),
      };

      try {
        const response = await fetch(
          getApiUrl(`/api/courses/${id}/modules/${moduleId}`),
          { method: "DELETE" }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.course) updatedCourse = data.course;
        }
      } catch (err) {
        console.warn("Backend delete module failed, applying locally:", err);
      }

      setMessage(`✅ Module "${modTitle}" deleted successfully.`);
      setCourse(updatedCourse);
      saveCourseToLocal(updatedCourse);

      if (selectedModule === moduleId) {
        setSelectedModule(updatedCourse.modules?.[0]?._id || null);
      }
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  // ==========================================
  // LESSON CRUD: CREATE (ADD VIDEO LESSON)
  // ==========================================
  const addLesson = async (e) => {
    e.preventDefault();

    if (!selectedModule) {
      setMessage("❌ Please select a module first");
      return;
    }

    if (!lessonTitle.trim()) {
      setMessage("❌ Please enter lesson title");
      return;
    }

    setUploadingLesson(true);
    setMessage("⏳ Uploading lesson & video...");

    try {
      let uploadedVideoUrl = "";

      if (lessonVideoMode === "file" && videoFile) {
        const vData = await uploadVideoDirect(videoFile);
        if (vData) {
          uploadedVideoUrl = vData.videoUrl || vData.fileUrl;
        }
      } else if (lessonVideoUrl.trim()) {
        uploadedVideoUrl = lessonVideoUrl.trim();
      }

      const newLesson = {
        _id: `les-${Date.now()}`,
        title: lessonTitle.trim(),
        description: lessonDescription.trim(),
        videoUrl: uploadedVideoUrl,
        duration: lessonDuration,
        isPreview: lessonIsPreview,
      };

      let updatedCourse = {
        ...course,
        modules: (course?.modules || []).map((m) =>
          m._id === selectedModule
            ? { ...m, lessons: [...(m.lessons || []), newLesson] }
            : m
        ),
      };

      try {
        const response = await fetch(
          getApiUrl(`/api/courses/${id}/modules/${selectedModule}/lessons`),
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: lessonTitle,
              description: lessonDescription,
              videoUrl: uploadedVideoUrl,
              duration: lessonDuration,
              isPreview: lessonIsPreview,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.course) updatedCourse = data.course;
        }
      } catch (err) {
        console.warn("Backend add lesson failed, using local fallback:", err);
      }

      setMessage("✅ Lesson added successfully!");
      setLessonTitle("");
      setLessonDescription("");
      setLessonDuration("");
      setLessonIsPreview(false);
      setLessonVideoUrl("");
      setVideoFile(null);

      const videoInput = document.getElementById("lesson-video");
      if (videoInput) videoInput.value = "";

      setCourse(updatedCourse);
      saveCourseToLocal(updatedCourse);
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setUploadingLesson(false);
    }
  };

  // ==========================================
  // LESSON CRUD: EDIT
  // ==========================================
  const openEditLessonModal = (moduleId, lesson) => {
    setEditLessonParentModuleId(moduleId);
    setEditingLesson(lesson);
    setEditLessonData({
      title: lesson.title || "",
      description: lesson.description || "",
      duration: lesson.duration || "",
      videoUrl: lesson.videoUrl || "",
      isPreview: Boolean(lesson.isPreview),
    });
  };

  const handleUpdateLesson = async (e) => {
    e.preventDefault();
    if (!editingLesson || !editLessonParentModuleId) return;

    setSavingLessonEdit(true);

    try {
      let updatedCourse = {
        ...course,
        modules: (course?.modules || []).map((m) =>
          m._id === editLessonParentModuleId
            ? {
                ...m,
                lessons: (m.lessons || []).map((l) =>
                  l._id === editingLesson._id ? { ...l, ...editLessonData } : l
                ),
              }
            : m
        ),
      };

      try {
        const response = await fetch(
          getApiUrl(`/api/courses/${id}/modules/${editLessonParentModuleId}/lessons/${editingLesson._id}`),
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editLessonData),
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.course) updatedCourse = data.course;
        }
      } catch (err) {
        console.warn("Backend update lesson failed, using local update:", err);
      }

      setMessage(`✅ Lesson "${editLessonData.title}" updated successfully!`);
      setEditingLesson(null);
      setCourse(updatedCourse);
      saveCourseToLocal(updatedCourse);
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setSavingLessonEdit(false);
    }
  };

  // ==========================================
  // LESSON CRUD: DELETE
  // ==========================================
  const handleDeleteLesson = async (moduleId, lessonId, lessonTitle) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete lesson "${lessonTitle}"?`
    );
    if (!confirmed) return;

    try {
      let updatedCourse = {
        ...course,
        modules: (course?.modules || []).map((m) =>
          m._id === moduleId
            ? {
                ...m,
                lessons: (m.lessons || []).filter((l) => l._id !== lessonId),
              }
            : m
        ),
      };

      try {
        const response = await fetch(
          getApiUrl(`/api/courses/${id}/modules/${moduleId}/lessons/${lessonId}`),
          { method: "DELETE" }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.course) updatedCourse = data.course;
        }
      } catch (err) {
        console.warn("Backend delete lesson failed, applying locally:", err);
      }

      setMessage(`✅ Lesson "${lessonTitle}" deleted successfully.`);
      setCourse(updatedCourse);
      saveCourseToLocal(updatedCourse);
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  if (!course) {
    return (
      <div className="admin-content-loading">
        Loading course content...
      </div>
    );
  }

  // Gather ALL unique ZIP files from zipFiles, resources, and zipFile (ONLY for Web Development)
  const isWebDevCourse =
    course &&
    ((course.slug && course.slug.toLowerCase().includes("web")) ||
      (course.title && course.title.toLowerCase().includes("web")) ||
      id === "660000000000000000000001" ||
      id === "000000000000000000000001" ||
      course._id === "660000000000000000000001" ||
      course._id === "000000000000000000000001");

  const zipMap = new Map();

  if (isWebDevCourse) {
    (course.zipFiles || []).forEach((z, i) => {
      if (z && z.url && !isStaleDummyZip(z.url)) {
        zipMap.set(z.url, {
          _id: z._id || `zf-${i}`,
          title: z.title || `Project ZIP Part ${i + 1}`,
          fileName: z.fileName || `project-part-${i + 1}.zip`,
          url: z.url,
          fileSize: z.fileSize || "",
          isExternal: z.isExternal || z.url.includes("drive.google.com") || z.url.includes("google"),
        });
      }
    });

    (course.resources || []).forEach((r, i) => {
      const url = r.url || r.fileUrl;
      if (url && !isStaleDummyZip(url) && (url.toLowerCase().endsWith(".zip") || (r.fileName && r.fileName.toLowerCase().endsWith(".zip")) || !zipMap.has(url))) {
        if (!zipMap.has(url)) {
          zipMap.set(url, {
            _id: r._id || `res-${i}`,
            title: r.title || r.fileName || `Resource ZIP Part ${i + 1}`,
            fileName: r.fileName || `resource-${i + 1}.zip`,
            url,
            fileSize: r.fileSize || "",
            isExternal: r.isExternal || url.includes("drive.google.com") || url.includes("google"),
          });
        }
      }
    });

    if (course.zipFile && course.zipFile.url && !isStaleDummyZip(course.zipFile.url) && !zipMap.has(course.zipFile.url)) {
      zipMap.set(course.zipFile.url, {
        _id: "main-zip",
        title: course.zipFile.fileName || "Course Project ZIP",
        fileName: course.zipFile.fileName || "course-project.zip",
        url: course.zipFile.url,
        fileSize: course.zipFile.fileSize || "",
        isExternal: course.zipFile.isExternal || course.zipFile.url.includes("drive.google.com") || course.zipFile.url.includes("google"),
      });
    }
  }

  const allZips = isWebDevCourse ? Array.from(zipMap.values()) : [];

  return (
    <div className="admin-content-page">
      <div className="admin-content-container">

        {/* HEADER */}
        <div className="admin-content-header">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <span>LMS CONTENT & ZIP MANAGER</span>
              <h1>{course.title}</h1>
              <p>{course.description}</p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <Link to="/admin/courses" className="btn-back-courses">
                ← Back to Courses
              </Link>
              <Link to={`/courses/${course.slug}`} target="_blank" className="btn-view-live">
                👁 View Course Page
              </Link>
            </div>
          </div>
        </div>

        {/* MESSAGE */}
        {message && (
          <div className="content-message">
            {message}
          </div>
        )}

        {/* =====================================
            01. COURSE ZIP FILES (UPLOAD 1ST, 2ND, 3RD ZIP)
        ====================================== */}
        <section className="content-box">
          <div className="content-box-heading" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span>01</span>
              <div>
                <h2>Course ZIP Files & Project Archives ({allZips.length})</h2>
                <p>Upload 1st ZIP, 2nd ZIP, or multiple project archives. All uploaded ZIPs will be visible on the View Course page.</p>
              </div>
            </div>
            {allZips.length > 0 && (
              <button
                type="button"
                onClick={handleDeleteAllZips}
                style={{
                  padding: "8px 16px",
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                  color: "#f87171",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "700",
                }}
              >
                🗑 Remove All ZIPs
              </button>
            )}
          </div>

          {/* LIST OF ALL CURRENTLY ATTACHED ZIP FILES */}
          {allZips.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
              {allZips.map((z, idx) => (
                <div
                  key={z._id || idx}
                  className="current-zip-badge"
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", background: "rgba(34, 197, 94, 0.08)", border: "1px solid rgba(34, 197, 94, 0.3)", borderRadius: "12px", flexWrap: "wrap", gap: "10px" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "26px" }}>📦</span>
                    <div>
                      <strong style={{ color: "#4ade80", fontSize: "14px", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                        ZIP {idx + 1}: {z.title || z.fileName}
                        {(z.isExternal || (z.url && (z.url.includes("drive.google.com") || z.url.includes("google.com")))) && (
                          <span style={{ background: "rgba(56, 189, 248, 0.2)", color: "#38bdf8", padding: "2px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700" }}>
                            ☁️ Google Drive
                          </span>
                        )}
                      </strong>
                      <small style={{ color: "#9ca3af", display: "block", marginTop: "2px" }}>
                        {z.fileName} {z.fileSize ? `• ${z.fileSize}` : ""}
                      </small>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <a
                      href={getDownloadUrl(z.url, z.fileName)}
                      download={z.fileName || `project-${idx + 1}.zip`}
                      target="_blank"
                      rel="noreferrer"
                      className="download-zip-link"
                      style={{ padding: "7px 14px", background: "#16a34a", color: "#fff", textDecoration: "none", fontWeight: "700", borderRadius: "8px", fontSize: "12px" }}
                    >
                      Download ⬇
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDeleteSpecificZip(z)}
                      style={{ padding: "7px 12px", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.35)", color: "#f87171", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "700" }}
                    >
                      🗑 Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ZIP MODE TOGGLE (GOOGLE DRIVE vs LOCAL FILE) */}
          <div style={{ borderTop: allZips.length > 0 ? "1px solid rgba(255,255,255,0.08)" : "none", paddingTop: allZips.length > 0 ? "15px" : "0", marginBottom: "15px" }}>
            <h3 style={{ fontSize: "15px", color: "#4ade80", margin: "0 0 12px 0" }}>
              {allZips.length > 0 ? "➕ Nayi / Next ZIP File Add Karein:" : "➕ 1st ZIP File Add Karein:"}
            </h3>

            <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
              <button
                type="button"
                onClick={() => setZipMode("drive")}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: "10px",
                  fontWeight: "700",
                  fontSize: "13px",
                  cursor: "pointer",
                  border: zipMode === "drive" ? "2px solid #38bdf8" : "1px solid rgba(255,255,255,0.12)",
                  background: zipMode === "drive" ? "rgba(56, 189, 248, 0.18)" : "rgba(255,255,255,0.04)",
                  color: zipMode === "drive" ? "#38bdf8" : "rgba(255,255,255,0.7)",
                  transition: "all 0.2s ease",
                }}
              >
                🌐 Google Drive Link (Recommended)
              </button>
              <button
                type="button"
                onClick={() => setZipMode("file")}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: "10px",
                  fontWeight: "700",
                  fontSize: "13px",
                  cursor: "pointer",
                  border: zipMode === "file" ? "2px solid #4ade80" : "1px solid rgba(255,255,255,0.12)",
                  background: zipMode === "file" ? "rgba(74, 222, 128, 0.18)" : "rgba(255,255,255,0.04)",
                  color: zipMode === "file" ? "#4ade80" : "rgba(255,255,255,0.7)",
                  transition: "all 0.2s ease",
                }}
              >
                💻 Laptop Se File Upload (.zip)
              </button>
            </div>
          </div>

          {/* OPTION 1: GOOGLE DRIVE LINK FORM */}
          {zipMode === "drive" && (
            <form onSubmit={handleAddDriveZip} style={{ background: "rgba(56, 189, 248, 0.05)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(56, 189, 248, 0.2)" }}>
              <div style={{ background: "rgba(56, 189, 248, 0.12)", padding: "10px 14px", borderRadius: "8px", marginBottom: "14px", fontSize: "12px", color: "#bae6fd", lineHeight: "1.5" }}>
                💡 <strong>Google Drive Tip:</strong> Google Drive par ZIP upload karein ➔ Share ➔ <strong>"Anyone with the link"</strong> set karein ➔ Link copy karke yahan paste karein. Yeh link <strong>hamesha permanent</strong> rahega aur server restart hone par bhi kabhi delete nahi hoga!
              </div>

              <div className="form-group">
                <label>ZIP Title / Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Web Development Full Course Material ZIP, or React Source Code"
                  value={zipTitle}
                  onChange={(e) => setZipTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Google Drive Share Link / Direct ZIP URL *</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/d/1AbC...XyZ/view?usp=sharing"
                  value={driveUrl}
                  onChange={(e) => setDriveUrl(e.target.value)}
                  required
                />
                {driveUrl && (driveUrl.includes("drive.google.com") || driveUrl.includes("drive.usercontent.google.com")) && (
                  <p style={{ margin: "6px 0 0 0", fontSize: "12px", color: "#4ade80", fontWeight: "600" }}>
                    ✅ Google Drive Link Detected! Automatic 1-Click Direct Download will be activated.
                  </p>
                )}
              </div>

              <div className="form-group">
                <label>File Size Display (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 150 MB, 500 MB, 1.2 GB"
                  value={driveFileSize}
                  onChange={(e) => setDriveFileSize(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={uploadingZip || !driveUrl.trim()}
                className="add-module-btn"
                style={{ marginTop: "10px", background: "linear-gradient(135deg, #0284c7, #38bdf8)" }}
              >
                {uploadingZip ? "⏳ Adding Google Drive ZIP..." : "🚀 Add Google Drive ZIP to Course →"}
              </button>
            </form>
          )}

          {/* OPTION 2: LOCAL FILE UPLOAD FORM */}
          {zipMode === "file" && (
            <form onSubmit={handleUploadCourseZip}>
              <div className="form-group">
                <label>ZIP Title / Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Web Development Part 2 ZIP, or React Source Code"
                  value={zipTitle}
                  onChange={(e) => setZipTitle(e.target.value)}
                />
              </div>

              <div className="video-upload-box">
                <label htmlFor="course-zip-file-input">
                  📁 Select ZIP File (.zip, .rar, .7z)
                </label>
                <input
                  id="course-zip-file-input"
                  type="file"
                  accept=".zip,.rar,.7z,.tar,.gz,application/zip,application/x-zip-compressed"
                  onChange={(e) => setZipFile(e.target.files[0] || null)}
                />
                {zipFile && (
                  <p className="selected-video">
                    📦 Selected: {zipFile.name} • {(zipFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={uploadingZip || !zipFile}
                className="add-module-btn"
                style={{ marginTop: "14px" }}
              >
                {uploadingZip ? "⏳ Uploading ZIP..." : allZips.length > 0 ? "➕ Upload Dusri ZIP File →" : "⬆ Upload Course ZIP File →"}
              </button>
            </form>
          )}
        </section>

        {/* =====================================
            02. ADD MODULE
        ====================================== */}
        <section className="content-box">
          <div className="content-box-heading">
            <span>02</span>
            <div>
              <h2>Add Module</h2>
              <p>Create a chapter or section for your course curriculum.</p>
            </div>
          </div>

          <form onSubmit={addModule} className="module-create-form">
            <div className="form-group">
              <label>Module Title *</label>
              <input
                type="text"
                placeholder="e.g. Module 1: Introduction to Web Development"
                value={moduleTitle}
                onChange={(e) => setModuleTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Module Description</label>
              <textarea
                placeholder="Brief summary of what this module covers..."
                value={moduleDescription}
                onChange={(e) => setModuleDescription(e.target.value)}
                rows="2"
              />
            </div>

            <button type="submit" className="add-module-btn">
              ➕ Add Module →
            </button>
          </form>
        </section>

        {/* =====================================
            03. COURSE CURRICULUM (MODULES & LESSONS)
        ====================================== */}
        <section className="curriculum-box">
          <div className="content-box-heading">
            <span>03</span>
            <div>
              <h2>Course Curriculum & Lessons</h2>
              <p>Manage modules and lessons. Click "+ Add Lessons Here" to select a module.</p>
            </div>
          </div>

          {(!course.modules || course.modules.length === 0) ? (
            <div className="empty-content">
              No modules added yet. Add your first module in Section 02 above.
            </div>
          ) : (
            course.modules.map((module, index) => {
              const isSelected = selectedModule === module._id;
              return (
                <div
                  className={`module-card ${isSelected ? "selected-module-card" : ""}`}
                  key={module._id}
                >
                  <div className="module-top">
                    <div>
                      <span className="module-badge">MODULE {index + 1}</span>
                      <h3>{module.title}</h3>
                      {module.description && <p>{module.description}</p>}
                    </div>

                    <div className="module-actions">
                      <button
                        type="button"
                        className={`select-module-btn ${isSelected ? "active" : ""}`}
                        onClick={() => setSelectedModule(module._id)}
                      >
                        {isSelected ? "✓ Active Module" : "+ Add Lessons Here"}
                      </button>

                      <button
                        type="button"
                        className="edit-module-btn"
                        onClick={() => openEditModuleModal(module)}
                        title="Edit Module"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        type="button"
                        className="delete-module-btn"
                        onClick={() => handleDeleteModule(module._id, module.title)}
                        title="Delete Module"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>

                  {/* LESSON LIST */}
                  <div className="lesson-list">
                    {(!module.lessons || module.lessons.length === 0) ? (
                      <p className="no-lessons">
                        No lessons yet in this module. Select this module below to add video lessons.
                      </p>
                    ) : (
                      module.lessons.map((lesson, lessonIndex) => (
                        <div className="lesson-item" key={lesson._id}>
                          <span className="lesson-index-number">
                            {lessonIndex + 1}
                          </span>

                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                              <strong>{lesson.title}</strong>
                              {lesson.isPreview && (
                                <span className="preview-pill">Free Preview</span>
                              )}
                            </div>

                            {lesson.description && (
                              <p style={{ margin: "4px 0 2px", color: "#8da096", fontSize: "12px" }}>
                                {lesson.description}
                              </p>
                            )}

                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "4px" }}>
                              <small style={{ color: "#a0aec0" }}>
                                ⏱ {lesson.duration || "N/A"}
                                {lesson.videoUrl ? " • 🎬 Video Uploaded" : " • ⚠️ No Video"}
                              </small>
                            </div>
                          </div>

                          <div className="lesson-actions-group">
                            <button
                              type="button"
                              className="btn-edit-lesson"
                              onClick={() => openEditLessonModal(module._id, lesson)}
                              title="Edit Lesson"
                            >
                              ✏️ Edit
                            </button>

                            <button
                              type="button"
                              className="btn-delete-lesson"
                              onClick={() => handleDeleteLesson(module._id, lesson._id, lesson.title)}
                              title="Delete Lesson"
                            >
                              🗑 Delete
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })
          )}
        </section>

        {/* =====================================
            04. ADD LESSON TO SELECTED MODULE
        ====================================== */}
        {selectedModule && (
          <section className="content-box">
            <div className="content-box-heading">
              <span>04</span>
              <div>
                <h2>
                  Add Lesson to:{" "}
                  <span style={{ color: "#4ade80" }}>
                    {course.modules.find((m) => m._id === selectedModule)?.title || "Selected Module"}
                  </span>
                </h2>
                <p>Upload a video lecture and add details for this lesson.</p>
              </div>
            </div>

            <form onSubmit={addLesson} className="single-lesson-form">
              <div className="form-group">
                <label>Lesson Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Lesson 1: Introduction to HTML5"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Lesson Description</label>
                <textarea
                  placeholder="What will students learn in this lesson?"
                  value={lessonDescription}
                  onChange={(e) => setLessonDescription(e.target.value)}
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 15 min"
                    value={lessonDuration}
                    onChange={(e) => setLessonDuration(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ display: "flex", alignItems: "center", marginTop: "24px" }}>
                  <label className="publish-checkbox" style={{ margin: 0 }}>
                    <input
                      type="checkbox"
                      checked={lessonIsPreview}
                      onChange={(e) => setLessonIsPreview(e.target.checked)}
                    />
                    <span>Free Preview (Available without login)</span>
                  </label>
                </div>
              </div>

              {/* VIDEO SOURCE SELECTOR (URL vs FILE) */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "13px", color: "#e2e8f0" }}>
                  Video Source:
                </label>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => setLessonVideoMode("url")}
                    style={{
                      flex: 1,
                      minWidth: "160px",
                      padding: "9px 14px",
                      borderRadius: "8px",
                      fontWeight: "700",
                      fontSize: "13px",
                      cursor: "pointer",
                      border: lessonVideoMode === "url" ? "2px solid #38bdf8" : "1px solid rgba(255,255,255,0.12)",
                      background: lessonVideoMode === "url" ? "rgba(56, 189, 248, 0.18)" : "rgba(255,255,255,0.04)",
                      color: lessonVideoMode === "url" ? "#38bdf8" : "rgba(255,255,255,0.7)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    🌐 Video URL / Link (YouTube, Drive, MP4)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLessonVideoMode("file")}
                    style={{
                      flex: 1,
                      minWidth: "160px",
                      padding: "9px 14px",
                      borderRadius: "8px",
                      fontWeight: "700",
                      fontSize: "13px",
                      cursor: "pointer",
                      border: lessonVideoMode === "file" ? "2px solid #4ade80" : "1px solid rgba(255,255,255,0.12)",
                      background: lessonVideoMode === "file" ? "rgba(74, 222, 128, 0.18)" : "rgba(255,255,255,0.04)",
                      color: lessonVideoMode === "file" ? "#4ade80" : "rgba(255,255,255,0.7)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    💻 Laptop Se Video Upload (.mp4)
                  </button>
                </div>
              </div>

              {lessonVideoMode === "url" ? (
                <div className="form-group">
                  <label>Video URL / Embed Link (YouTube, Google Drive, Direct MP4 URL)</label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=... or https://drive.google.com/file/d/.../view"
                    value={lessonVideoUrl}
                    onChange={(e) => setLessonVideoUrl(e.target.value)}
                  />
                  {lessonVideoUrl && (
                    <p style={{ margin: "6px 0 0", fontSize: "12px", color: "#38bdf8", fontWeight: "600" }}>
                      🔗 Video link detected! Students will be able to play this video directly in the course viewer.
                    </p>
                  )}
                </div>
              ) : (
                <div className="video-upload-box">
                  <label htmlFor="lesson-video">
                    🎬 Choose Lesson Video File (.mp4, .webm, .mov, .mkv)
                  </label>
                  <input
                    id="lesson-video"
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime,video/x-matroska"
                    onChange={(e) => setVideoFile(e.target.files[0] || null)}
                  />
                  {videoFile && (
                    <p className="selected-video">
                      🎬 {videoFile.name} • {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={uploadingLesson}
                className="add-lesson-submit-btn"
              >
                {uploadingLesson ? "⏳ Uploading Video & Adding Lesson..." : "➕ Add Lesson →"}
              </button>
            </form>
          </section>
        )}

        {/* =====================================
            EDIT MODULE MODAL
        ====================================== */}
        {editingModule && (
          <div className="admin-modal-backdrop" onClick={() => setEditingModule(null)}>
            <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <h2>✏️ Edit Module</h2>
                <button className="admin-modal-close" onClick={() => setEditingModule(null)}>✕</button>
              </div>

              <form onSubmit={handleUpdateModule} className="admin-modal-form">
                <div className="form-group">
                  <label>Module Title *</label>
                  <input
                    type="text"
                    value={editModuleData.title}
                    onChange={(e) => setEditModuleData({ ...editModuleData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Module Description</label>
                  <textarea
                    value={editModuleData.description}
                    onChange={(e) => setEditModuleData({ ...editModuleData, description: e.target.value })}
                    rows="3"
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => setEditingModule(null)}
                    className="modal-cancel-btn"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="modal-save-btn">
                    💾 Save Module
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =====================================
            EDIT LESSON MODAL
        ====================================== */}
        {editingLesson && (
          <div className="admin-modal-backdrop" onClick={() => setEditingLesson(null)}>
            <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <h2>✏️ Edit Lesson: {editingLesson.title}</h2>
                <button className="admin-modal-close" onClick={() => setEditingLesson(null)}>✕</button>
              </div>

              <form onSubmit={handleUpdateLesson} className="admin-modal-form">
                <div className="form-group">
                  <label>Lesson Title *</label>
                  <input
                    type="text"
                    value={editLessonData.title}
                    onChange={(e) => setEditLessonData({ ...editLessonData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Lesson Description</label>
                  <textarea
                    value={editLessonData.description}
                    onChange={(e) => setEditLessonData({ ...editLessonData, description: e.target.value })}
                    rows="3"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Duration</label>
                    <input
                      type="text"
                      value={editLessonData.duration}
                      onChange={(e) => setEditLessonData({ ...editLessonData, duration: e.target.value })}
                      placeholder="e.g. 15 min"
                    />
                  </div>

                  <div className="form-group">
                    <label>Video URL / Path</label>
                    <input
                      type="text"
                      value={editLessonData.videoUrl}
                      onChange={(e) => setEditLessonData({ ...editLessonData, videoUrl: e.target.value })}
                      placeholder="/uploads/courses/... or https://..."
                    />
                  </div>
                </div>

                <label className="publish-checkbox">
                  <input
                    type="checkbox"
                    checked={editLessonData.isPreview}
                    onChange={(e) => setEditLessonData({ ...editLessonData, isPreview: e.target.checked })}
                  />
                  <span>Free Preview</span>
                </label>

                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => setEditingLesson(null)}
                    className="modal-cancel-btn"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingLessonEdit}
                    className="modal-save-btn"
                  >
                    {savingLessonEdit ? "Saving..." : "💾 Save Lesson"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminCourseContent;