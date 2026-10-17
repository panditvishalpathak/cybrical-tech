const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const Course = require("../models/Course");

// ==========================================
// SYSTEM DEFAULT COURSES (Including AI & Android)
// ==========================================
const STORE_FILE = path.join(__dirname, "../data/courses_store.json");

const FALLBACK_AI_COURSE = {
  _id: "660000000000000000000004",
  title: "Artificial Intelligence (AI)",
  slug: "ai",
  description:
    "Master Modern Artificial Intelligence, Machine Learning, Deep Learning, Neural Networks, and Generative AI. Download full source code and starter ZIPs for lessons.",
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
          zipUrl: "/uploads/courses/1791286605286-173949088.zip",
          zipName: "Course Introduction TEAMWORK.zip",
          zipSize: "266.07 MB",
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
          zipUrl: "/uploads/courses/1791286656010-391085889.zip",
          zipName: "Python Fundamentals (Part-1).zip",
          zipSize: "457.43 MB",
        },
      ],
    },
  ],
  zipFile: {
    _id: "zf-ai-2",
    title: "Python Fundamentals (Part-1).zip",
    fileName: "Python Fundamentals (Part-1).zip",
    url: "/uploads/courses/1791286656010-391085889.zip",
    fileSize: "457.43 MB",
  },
  zipFiles: [
    {
      _id: "zf-ai-1",
      title: "Course Introduction TEAMWORK.zip",
      fileName: "Course Introduction TEAMWORK.zip",
      url: "/uploads/courses/1791286605286-173949088.zip",
      fileSize: "266.07 MB",
    },
    {
      _id: "zf-ai-2",
      title: "Python Fundamentals (Part-1).zip",
      fileName: "Python Fundamentals (Part-1).zip",
      url: "/uploads/courses/1791286656010-391085889.zip",
      fileSize: "457.43 MB",
    },
  ],
  resources: [
    {
      _id: "res-ai-1",
      title: "Course Introduction TEAMWORK.zip",
      fileName: "Course Introduction TEAMWORK.zip",
      url: "/uploads/courses/1791286605286-173949088.zip",
      fileUrl: "/uploads/courses/1791286605286-173949088.zip",
      fileSize: "266.07 MB",
    },
    {
      _id: "res-ai-2",
      title: "Python Fundamentals (Part-1).zip",
      fileName: "Python Fundamentals (Part-1).zip",
      url: "/uploads/courses/1791286656010-391085889.zip",
      fileUrl: "/uploads/courses/1791286656010-391085889.zip",
      fileSize: "457.43 MB",
    },
  ],
};

const WEB_DEV_ZIP_COURSE = {
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
      description:
        "Foundations of modern web layout, semantic elements, and responsive design with project ZIP archives.",
      lessons: [
        {
          _id: "web-les-1",
          title: "Lesson 1: HTML5 Semantic Structure & Starter Project",
          description:
            "Learn semantic tags, forms, tables, and project directory scaffolding. Download the starter kit ZIP below.",
          duration: "35 min",
          videoUrl: "",
        },
        {
          _id: "web-les-2",
          title: "Lesson 2: CSS3 Flexbox & Grid Responsive Layouts",
          description:
            "Master modern layout techniques, media queries, CSS variables, and layout patterns with full source code.",
          duration: "45 min",
          videoUrl: "",
        },
        {
          _id: "web-les-3",
          title: "Lesson 3: Complete Responsive Agency Landing Page",
          description:
            "Build and deploy a mobile-friendly agency landing page with animations and interactive navigation.",
          duration: "50 min",
          videoUrl: "",
        },
      ],
    },
    {
      _id: "web-mod-2",
      title: "Module 2: JavaScript DOM & Interactive Applications",
      description:
        "Master core JavaScript, DOM manipulation, asynchronous programming, APIs, and interactive applications.",
      lessons: [
        {
          _id: "web-les-4",
          title: "Lesson 4: JavaScript Fundamentals & Dynamic DOM Control",
          description:
            "ES6+ syntax, arrays, objects, functions, event listeners, and dynamic DOM rendering practice project.",
          duration: "55 min",
          videoUrl: "",
        },
        {
          _id: "web-les-5",
          title: "Lesson 5: Async JS, REST APIs & Live Weather Application",
          description:
            "Working with Promises, async/await, Fetch API, error handling, and building a live API-powered app.",
          duration: "60 min",
          videoUrl: "",
        },
        {
          _id: "web-les-6",
          title: "Lesson 6: Interactive CRUD App with LocalStorage",
          description:
            "Create a persistent task management application with state persistence, filtering, and local storage.",
          duration: "50 min",
          videoUrl: "",
        },
      ],
    },
    {
      _id: "web-mod-3",
      title: "Module 3: React.js & Modern Frontend Architecture",
      description:
        "Build robust single-page applications using React components, hooks, routing, and state management.",
      lessons: [
        {
          _id: "web-les-7",
          title: "Lesson 7: React Setup, JSX, Components & Props",
          description:
            "Component architecture, props drilling, conditional rendering, and structured folder layout with Vite.",
          duration: "45 min",
          videoUrl: "",
        },
        {
          _id: "web-les-8",
          title: "Lesson 8: React Hooks (useState, useEffect) & Context API",
          description:
            "Deep dive into state lifecycles, effect hooks, custom hooks, and global state management with Context.",
          duration: "55 min",
          videoUrl: "",
        },
        {
          _id: "web-les-9",
          title: "Lesson 9: Full E-Commerce Product Catalog with Cart",
          description:
            "Build an interactive E-commerce frontend with cart management, checkout modals, and responsive UI.",
          duration: "65 min",
          videoUrl: "",
        },
      ],
    },
    {
      _id: "web-mod-4",
      title: "Module 4: Full-Stack Backend, Database & Deployment",
      description:
        "Build RESTful APIs with Node.js, Express, MongoDB, and deploy full-stack applications to cloud servers.",
      lessons: [
        {
          _id: "web-les-10",
          title: "Lesson 10: Node.js & Express REST API Architecture",
          description:
            "Express routing, middleware, request validation, error handling, and building secure REST endpoints.",
          duration: "50 min",
          videoUrl: "",
        },
        {
          _id: "web-les-11",
          title: "Lesson 11: MongoDB, Mongoose Schemas & JWT Auth",
          description:
            "Database modeling, CRUD operations, password hashing with bcrypt, and JWT user authentication.",
          duration: "60 min",
          videoUrl: "",
        },
        {
          _id: "web-les-12",
          title: "Lesson 12: Full Stack Production Deployment & CI/CD",
          description:
            "Connecting frontend and backend, environment variables, building for production, and live cloud deployment.",
          duration: "60 min",
          videoUrl: "",
        },
      ],
    },
  ],
  zipFiles: [],
  resources: [],
};

const FALLBACK_ANDROID_COURSE = {
  _id: "660000000000000000000005",
  title: "Android App Development",
  slug: "android",
  description:
    "Master Native Android App Development with Kotlin, Jetpack Compose, Android SDK, MVVM Architecture, Room Database, and REST APIs. Includes starter projects & downloadable ZIP files for lessons.",
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
          zipUrl: "/uploads/courses/1791265931186-935533293.zip",
          zipName: "01-Android-Studio-Setup-Starter.zip",
          zipSize: "583 MB",
        },
        {
          _id: "and-les-2",
          title: "Lesson 2: Kotlin Fundamentals, OOP & Coroutines",
          description: "Variables, Null Safety, Lambdas, Coroutines and Asynchronous Kotlin for Android.",
          duration: "45 min",
          videoUrl: "",
          zipUrl: "",
          zipName: "",
          zipSize: "",
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
          zipUrl: "/uploads/courses/1791265885918-768069909.zip",
          zipName: "02-Jetpack-Compose-Layouts.zip",
          zipSize: "534 MB",
        },
        {
          _id: "and-les-4",
          title: "Lesson 4: Compose State, ViewModel & Navigation",
          description: "Remember, MutableState, State Hoisting, and Navigation Component.",
          duration: "45 min",
          videoUrl: "",
          zipUrl: "",
          zipName: "",
          zipSize: "",
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
          zipUrl: "/uploads/courses/1791265849347-992920259.zip",
          zipName: "03-Android-Retrofit-MVVM-App.zip",
          zipSize: "480 MB",
        },
        {
          _id: "and-les-6",
          title: "Lesson 6: Local Persistence with Room Database & DataStore",
          description: "Entities, DAOs, TypeConverters, LiveData/Flow, and Preferences DataStore.",
          duration: "50 min",
          videoUrl: "",
          zipUrl: "",
          zipName: "",
          zipSize: "",
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
          zipUrl: "/uploads/courses/1791265800123-2443587.zip",
          zipName: "04-Android-Full-Ecommerce-App.zip",
          zipSize: "412 MB",
        },
        {
          _id: "and-les-8",
          title: "Lesson 8: App Bundle (AAB), ProGuard & Google Play Release",
          description: "Keystore generation, signing, optimization, and deploying to Google Play Console.",
          duration: "40 min",
          videoUrl: "",
          zipUrl: "",
          zipName: "",
          zipSize: "",
        },
      ],
    },
  ],
  zipFile: {
    _id: "zf-and-1",
    title: "Android Capstone Project Complete Source Code ZIP",
    fileName: "04-Android-Full-Ecommerce-App.zip",
    url: "/uploads/courses/1791265800123-2443587.zip",
    fileSize: "412 MB",
  },
  zipFiles: [
    {
      _id: "zf-and-1",
      title: "01: Android Studio Setup & Starter Project ZIP",
      fileName: "01-Android-Studio-Setup-Starter.zip",
      url: "/uploads/courses/1791265931186-935533293.zip",
      fileSize: "583 MB",
    },
    {
      _id: "zf-and-2",
      title: "02: Jetpack Compose Layouts & Material Design 3 ZIP",
      fileName: "02-Jetpack-Compose-Layouts.zip",
      url: "/uploads/courses/1791265885918-768069909.zip",
      fileSize: "534 MB",
    },
    {
      _id: "zf-and-3",
      title: "03: Android Retrofit REST API & MVVM Architecture ZIP",
      fileName: "03-Android-Retrofit-MVVM-App.zip",
      url: "/uploads/courses/1791265849347-992920259.zip",
      fileSize: "480 MB",
    },
    {
      _id: "zf-and-4",
      title: "04: Android Full Capstone E-Commerce App Project ZIP",
      fileName: "04-Android-Full-Ecommerce-App.zip",
      url: "/uploads/courses/1791265800123-2443587.zip",
      fileSize: "412 MB",
    },
  ],
  resources: [
    {
      _id: "res-and-1",
      title: "01: Android Studio Setup & Starter Project ZIP",
      fileName: "01-Android-Studio-Setup-Starter.zip",
      url: "/uploads/courses/1791265931186-935533293.zip",
      fileUrl: "/uploads/courses/1791265931186-935533293.zip",
      fileSize: "583 MB",
    },
    {
      _id: "res-and-2",
      title: "02: Jetpack Compose Layouts & Material Design 3 ZIP",
      fileName: "02-Jetpack-Compose-Layouts.zip",
      url: "/uploads/courses/1791265885918-768069909.zip",
      fileUrl: "/uploads/courses/1791265885918-768069909.zip",
      fileSize: "534 MB",
    },
    {
      _id: "res-and-3",
      title: "03: Android Retrofit REST API & MVVM Architecture ZIP",
      fileName: "03-Android-Retrofit-MVVM-App.zip",
      url: "/uploads/courses/1791265849347-992920259.zip",
      fileUrl: "/uploads/courses/1791265849347-992920259.zip",
      fileSize: "480 MB",
    },
    {
      _id: "res-and-4",
      title: "04: Android Full Capstone E-Commerce App Project ZIP",
      fileName: "04-Android-Full-Ecommerce-App.zip",
      url: "/uploads/courses/1791265800123-2443587.zip",
      fileUrl: "/uploads/courses/1791265800123-2443587.zip",
      fileSize: "412 MB",
    },
  ],
};

const SYSTEM_DEFAULT_COURSES = [
  WEB_DEV_ZIP_COURSE,
  {
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
  {
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
  FALLBACK_AI_COURSE,
  FALLBACK_ANDROID_COURSE,
];

// ==========================================
// FILE / VIDEO / ZIP UPLOAD CONFIGURATION
// ==========================================

const uploadDir = path.join(__dirname, "../uploads/courses");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const formatBytes = (bytes) => {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 1024, // 1 GB max size
  },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = [
      ".mp4",
      ".webm",
      ".mov",
      ".mkv",
      ".avi",
      ".zip",
      ".rar",
      ".7z",
      ".tar",
      ".gz",
    ];
    const ext = path.extname(file.originalname).toLowerCase();

    if (
      file.mimetype.startsWith("video/") ||
      file.mimetype.includes("zip") ||
      file.mimetype === "application/octet-stream" ||
      allowedExtensions.includes(ext)
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only video files and ZIP archives (.zip, .rar, .7z) are allowed"));
    }
  },
});

// ==========================================
// COURSE LOOKUP HELPERS (SUPPORTS OBJECTID & SLUG/AI/ANDROID)
// ==========================================

const loadFallbackCourses = () => {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const content = fs.readFileSync(STORE_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure all system default courses are present
        const parsedSlugs = new Set(parsed.map((c) => (c.slug || "").toLowerCase()));
        let updated = false;
        SYSTEM_DEFAULT_COURSES.forEach((def) => {
          if (!parsedSlugs.has((def.slug || "").toLowerCase())) {
            parsed.push(def);
            updated = true;
          }
        });
        if (updated) saveFallbackCourses(parsed);
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error loading courses store:", e);
  }
  // Initialize with SYSTEM_DEFAULT_COURSES
  saveFallbackCourses(SYSTEM_DEFAULT_COURSES);
  return [...SYSTEM_DEFAULT_COURSES];
};

const saveFallbackCourses = (coursesList) => {
  try {
    const dir = path.dirname(STORE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(STORE_FILE, JSON.stringify(coursesList, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving courses store:", e);
  }
};

const saveSingleFallbackCourse = (courseObj) => {
  if (!courseObj) return;
  const list = loadFallbackCourses();
  const cleanSlug = (courseObj.slug || "").toLowerCase();
  const cleanId = (courseObj._id || "").toString();

  const idx = list.findIndex(
    (c) =>
      (c._id && c._id.toString() === cleanId) ||
      (c.slug && c.slug.toLowerCase() === cleanSlug) ||
      (cleanSlug.includes("ai") && (c.slug === "ai" || (c._id && c._id.toString().includes("000000000000000000000004")))) ||
      (cleanSlug.includes("android") && (c.slug === "android" || (c._id && c._id.toString().includes("000000000000000000000005"))))
  );

  if (idx >= 0) {
    list[idx] = { ...list[idx], ...courseObj };
  } else {
    list.push(courseObj);
  }
  saveFallbackCourses(list);
};

const getCourseDoc = async (targetId) => {
  if (!targetId) return null;
  const targetStr = targetId.toString().trim();
  let course = null;

  if (mongoose.Types.ObjectId.isValid(targetStr)) {
    try {
      course = await Course.findById(targetStr);
    } catch (e) {
      course = null;
    }
  }

  if (!course) {
    try {
      const cleanSlug = targetStr.toLowerCase().replace(/\s+/g, "-");
      const escaped = targetStr.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
      course = await Course.findOne({
        $or: [
          { slug: targetStr },
          { slug: cleanSlug },
          { slug: new RegExp(`^${escaped}$`, "i") },
          { title: new RegExp(`^${escaped}$`, "i") },
        ],
      });
    } catch (e) {
      course = null;
    }
  }

  if (course) {
    let modified = false;
    if (course.zipFiles && course.zipFiles.length > 0) {
      const filtered = course.zipFiles.filter(
        (z) => !z.url || (!z.url.startsWith("/uploads/courses/179119") && !z.url.includes("179119"))
      );
      if (filtered.length !== course.zipFiles.length) {
        course.zipFiles = filtered;
        modified = true;
      }
    }
    if (course.zipFile && course.zipFile.url && (course.zipFile.url.startsWith("/uploads/courses/179119") || course.zipFile.url.includes("179119"))) {
      course.zipFile = { url: "", fileName: "", fileSize: "" };
      modified = true;
    }
    (course.modules || []).forEach((m) => {
      (m.lessons || []).forEach((l) => {
        if (l.zipUrl && (l.zipUrl.startsWith("/uploads/courses/179119") || l.zipUrl.includes("179119"))) {
          l.zipUrl = "";
          l.zipName = "";
          l.zipSize = "";
          modified = true;
        }
      });
    });
    if (modified) {
      course.markModified("zipFiles");
      course.markModified("zipFile");
      course.markModified("modules");
      course.save().catch(() => {});
    }
  }

  return course;
};

const sanitizeCourseZips = (c) => {
  if (!c) return c;
  if (c.zipFiles) {
    c.zipFiles = c.zipFiles.filter((z) => z && z.url && !z.url.includes("179119"));
  }
  if (c.zipFile && c.zipFile.url && c.zipFile.url.includes("179119")) {
    c.zipFile = { url: "", fileName: "", fileSize: "" };
  }
  if (c.resources) {
    c.resources = c.resources.filter((r) => {
      const u = (r.url || r.fileUrl || "");
      return !u.includes("179119");
    });
  }
  if (c.modules) {
    c.modules.forEach((m) => {
      (m.lessons || []).forEach((l) => {
        if (l.zipUrl && l.zipUrl.includes("179119")) {
          l.zipUrl = "";
          l.zipName = "";
          l.zipSize = "";
        }
      });
    });
  }
  return c;
};

const getFallbackCourse = (targetId) => {
  const storeCourses = loadFallbackCourses();
  if (!targetId) return sanitizeCourseZips(storeCourses.find((c) => c.slug === "ai") || FALLBACK_AI_COURSE);
  const clean = targetId.toString().trim().toLowerCase();

  const found = storeCourses.find(
    (c) =>
      (c._id && c._id.toString() === targetId.toString()) ||
      (c.slug && c.slug.toLowerCase() === clean) ||
      (c.title && c.title.toLowerCase() === clean)
  );
  if (found) return sanitizeCourseZips(found);

  if (clean.includes("ai") || clean.includes("artificial")) {
    return sanitizeCourseZips(storeCourses.find((c) => c.slug === "ai") || FALLBACK_AI_COURSE);
  }
  if (clean.includes("android")) {
    return sanitizeCourseZips(storeCourses.find((c) => c.slug === "android") || FALLBACK_ANDROID_COURSE);
  }
  return sanitizeCourseZips(storeCourses[0] || FALLBACK_AI_COURSE);
};

// ==========================================
// DIRECT FILE DOWNLOAD (MOBILE & DESKTOP COMPATIBLE)
// ==========================================
router.get("/download-file", (req, res) => {
  try {
    const rawUrl = req.query.url || req.query.path || "";
    const customName = req.query.name || "";
    if (!rawUrl) {
      return res.status(400).json({ success: false, message: "File URL is required" });
    }

    // Support external cloud links (Google Drive, Dropbox, AWS S3, etc.)
    if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
      let redirectUrl = rawUrl;
      if (rawUrl.includes("drive.google.com") || rawUrl.includes("drive.usercontent.google.com")) {
        const match = rawUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                      rawUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
                      rawUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
          redirectUrl = `https://drive.google.com/uc?export=download&id=${match[1]}`;
        }
      }
      return res.redirect(redirectUrl);
    }

    const cleanName = path.basename(rawUrl.split("?")[0]);
    const filePath = path.join(uploadDir, cleanName);

    if (fs.existsSync(filePath)) {
      const downloadName = customName || cleanName;
      return res.download(filePath, downloadName, (err) => {
        if (err && !res.headersSent) {
          res.status(500).json({ success: false, message: "Error downloading file" });
        }
      });
    }

    const parentUploadPath = path.join(__dirname, "../uploads", cleanName);
    if (fs.existsSync(parentUploadPath)) {
      return res.download(parentUploadPath, customName || cleanName);
    }

    return res.status(404).json({ success: false, message: "File not found on server" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 1. GET ALL COURSES
// ==========================================

router.get("/", async (req, res) => {
  try {
    let courses = [];
    try {
      courses = await Course.find().sort({
        createdAt: -1,
      });
    } catch (dbErr) {
      courses = [];
    }

    const fallbackList = loadFallbackCourses();

    // Merge with fallbackList so all courses are always present
    const existingSlugs = new Set((courses || []).map((c) => (c.slug || "").toLowerCase()));
    const missingDefaults = fallbackList.filter(
      (def) => !existingSlugs.has((def.slug || "").toLowerCase())
    );

    const merged = [...(courses || []), ...missingDefaults];

    res.json({
      success: true,
      courses: merged,
    });
  } catch (error) {
    res.json({
      success: true,
      courses: loadFallbackCourses(),
    });
  }
});

// ==========================================
// 2. UPLOAD VIDEO / FILE
// ==========================================

router.post("/upload-video", upload.any(), async (req, res) => {
  try {
    const file = req.file || (req.files && req.files[0]);
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Please select a file to upload",
      });
    }

    const videoUrl = `/uploads/courses/${file.filename}`;

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      videoUrl,
      fileUrl: videoUrl,
      fileName: file.originalname,
      fileSize: formatBytes(file.size),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// 3. UPLOAD COURSE ZIP FILE (SUPPORTS 1st, 2nd, 3rd ZIP)
// ==========================================

router.post("/:courseId/upload-zip", upload.any(), async (req, res) => {
  try {
    const file = req.file || (req.files && req.files[0]);
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Please select a ZIP file",
      });
    }

    const fileUrl = `/uploads/courses/${file.filename}`;
    const fileSize = formatBytes(file.size);
    const title = req.body.title || file.originalname;

    const newZipObj = {
      _id: `zf-${Date.now()}`,
      title,
      url: fileUrl,
      fileName: file.originalname,
      fileSize: fileSize,
    };

    let course = null;
    const targetId = req.params.courseId;

    if (mongoose.Types.ObjectId.isValid(targetId)) {
      try {
        course = await Course.findById(targetId);
      } catch (e) {
        course = null;
      }
    }

    if (!course) {
      try {
        course = await Course.findOne({
          $or: [
            { slug: targetId },
            { slug: new RegExp(`^${targetId}$`, "i") },
          ],
        });
      } catch (e) {
        course = null;
      }
    }

    if (course) {
      course.zipFile = {
        url: fileUrl,
        fileName: file.originalname,
        fileSize: fileSize,
      };

      course.zipFiles = course.zipFiles || [];
      course.zipFiles.push(newZipObj);
      course.markModified("zipFiles");

      course.resources = course.resources || [];
      course.resources.push({
        title,
        url: fileUrl,
        fileUrl: fileUrl,
        fileName: file.originalname,
        fileSize: fileSize,
      });
      course.markModified("resources");

      await course.save();

      return res.status(201).json({
        success: true,
        message: `ZIP file "${title}" added successfully! Total ZIPs: ${course.zipFiles.length}`,
        course,
        zipFile: course.zipFile,
        zipFiles: course.zipFiles,
      });
    }

    // Fallback in-memory and disk persistence response if DB is offline or system default course
    const fallbackCourse = getFallbackCourse(targetId);

    fallbackCourse.zipFiles = fallbackCourse.zipFiles || [];
    const existsIdx = fallbackCourse.zipFiles.findIndex((z) => z.url === newZipObj.url);
    if (existsIdx >= 0) {
      fallbackCourse.zipFiles[existsIdx] = newZipObj;
    } else {
      fallbackCourse.zipFiles.push(newZipObj);
    }
    fallbackCourse.zipFile = newZipObj;
    fallbackCourse.resources = fallbackCourse.resources || [];
    if (!fallbackCourse.resources.some((r) => r.url === fileUrl)) {
      fallbackCourse.resources.push({
        title,
        url: fileUrl,
        fileUrl: fileUrl,
        fileName: file.originalname,
        fileSize: fileSize,
      });
    }

    saveSingleFallbackCourse(fallbackCourse);

    res.status(201).json({
      success: true,
      message: `ZIP file "${title}" uploaded successfully!`,
      course: fallbackCourse,
      zipFile: newZipObj,
      zipFiles: fallbackCourse.zipFiles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// 3.5 ADD GOOGLE DRIVE / DIRECT LINK ZIP
// ==========================================

router.post("/:courseId/add-drive-zip", async (req, res) => {
  try {
    const { url, title, fileName, fileSize } = req.body;
    if (!url || typeof url !== "string") {
      return res.status(400).json({
        success: false,
        message: "Google Drive link ya direct ZIP URL zaroori hai.",
      });
    }

    let directUrl = url.trim();
    if (directUrl.includes("drive.google.com") || directUrl.includes("drive.usercontent.google.com")) {
      const match = directUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                    directUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
                    directUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        directUrl = `https://drive.google.com/uc?export=download&id=${match[1]}`;
      }
    }

    const zipTitle = title?.trim() || "Course Material ZIP";
    const zipFileName = fileName?.trim() || (zipTitle.toLowerCase().endsWith(".zip") ? zipTitle : `${zipTitle}.zip`);
    const zipFileSize = fileSize?.trim() || "Google Drive Cloud";

    const newZipObj = {
      _id: `zf-gdrive-${Date.now()}`,
      title: zipTitle,
      url: directUrl,
      fileName: zipFileName,
      fileSize: zipFileSize,
      isExternal: true,
      source: "Google Drive",
    };

    let course = null;
    const targetId = req.params.courseId;

    if (mongoose.Types.ObjectId.isValid(targetId)) {
      try {
        course = await Course.findById(targetId);
      } catch (e) {
        course = null;
      }
    }

    if (!course) {
      try {
        course = await Course.findOne({
          $or: [
            { slug: targetId },
            { slug: new RegExp(`^${targetId}$`, "i") },
          ],
        });
      } catch (e) {
        course = null;
      }
    }

    if (course) {
      course.zipFile = {
        url: directUrl,
        fileName: zipFileName,
        fileSize: zipFileSize,
      };

      course.zipFiles = course.zipFiles || [];
      // Remove any existing duplicate with same url
      course.zipFiles = course.zipFiles.filter((z) => z.url !== directUrl);
      course.zipFiles.push(newZipObj);
      course.markModified("zipFiles");

      course.resources = course.resources || [];
      course.resources = course.resources.filter((r) => r.url !== directUrl && r.fileUrl !== directUrl);
      course.resources.push({
        title: zipTitle,
        url: directUrl,
        fileUrl: directUrl,
        fileName: zipFileName,
        fileSize: zipFileSize,
      });
      course.markModified("resources");

      await course.save();

      return res.status(201).json({
        success: true,
        message: `Google Drive ZIP "${zipTitle}" successfully added! Total ZIPs: ${course.zipFiles.length}`,
        course,
        zipFile: course.zipFile,
        zipFiles: course.zipFiles,
      });
    }

    // Fallback if DB offline or mock course
    const fallbackCourse = getFallbackCourse(targetId);
    fallbackCourse.zipFiles = fallbackCourse.zipFiles || [];
    fallbackCourse.zipFiles = fallbackCourse.zipFiles.filter((z) => z.url !== directUrl);
    fallbackCourse.zipFiles.push(newZipObj);
    fallbackCourse.zipFile = newZipObj;
    saveSingleFallbackCourse(fallbackCourse);

    return res.status(201).json({
      success: true,
      message: `Google Drive ZIP "${zipTitle}" successfully added! Total ZIPs: ${fallbackCourse.zipFiles.length}`,
      course: fallbackCourse,
      zipFile: newZipObj,
      zipFiles: fallbackCourse.zipFiles,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// 4. DELETE SPECIFIC ZIP FILE FROM COURSE
// ==========================================

const deleteZipHandler = async (req, res) => {
  try {
    const course = await getCourseDoc(req.params.courseId);

    const targetId = req.params.zipId || req.query.zipId || (req.body && req.body.zipId);
    const targetUrl = req.query.url || (req.body && req.body.url);
    const targetFileName = req.query.fileName || (req.body && req.body.fileName);

    const isMatch = (item) => {
      if (!item) return false;
      const itemId = item._id ? item._id.toString() : "";
      if (targetId && targetId !== "main-zip" && targetId !== "all" && itemId && itemId === targetId) {
        return true;
      }
      const itemUrl = item.url || item.fileUrl || "";
      if (targetUrl && itemUrl && itemUrl.trim().toLowerCase() === targetUrl.trim().toLowerCase()) {
        return true;
      }
      if (targetFileName && item.fileName && item.fileName.trim().toLowerCase() === targetFileName.trim().toLowerCase()) {
        return true;
      }
      if (targetId && targetId !== "main-zip" && targetId !== "all" && itemUrl && itemUrl.includes(targetId)) {
        return true;
      }
      return false;
    };

    if (!course) {
      const fallback = getFallbackCourse(req.params.courseId);
      if (targetId === "all") {
        fallback.zipFile = { url: "", fileName: "", fileSize: "" };
        fallback.zipFiles = [];
        fallback.resources = (fallback.resources || []).filter((r) => {
          const u = (r.url || r.fileUrl || "").toLowerCase();
          const fn = (r.fileName || "").toLowerCase();
          return !u.endsWith(".zip") && !fn.endsWith(".zip") && !u.endsWith(".rar") && !u.endsWith(".7z");
        });
      } else {
        fallback.zipFiles = (fallback.zipFiles || []).filter((z) => !isMatch(z));
        fallback.resources = (fallback.resources || []).filter((r) => !isMatch(r));
        if (fallback.zipFiles.length > 0) {
          fallback.zipFile = { ...fallback.zipFiles[fallback.zipFiles.length - 1] };
        } else {
          fallback.zipFile = { url: "", fileName: "", fileSize: "" };
        }
      }

      saveSingleFallbackCourse(fallback);

      return res.json({
        success: true,
        message: "ZIP file deleted successfully",
        course: fallback,
        zipFiles: fallback.zipFiles,
      });
    }

    if (targetId === "all") {
      course.zipFile = { url: "", fileName: "", fileSize: "" };
      course.zipFiles = [];
      course.resources = (course.resources || []).filter((r) => {
        const u = (r.url || r.fileUrl || "").toLowerCase();
        const fn = (r.fileName || "").toLowerCase();
        return !u.endsWith(".zip") && !fn.endsWith(".zip") && !u.endsWith(".rar") && !u.endsWith(".7z");
      });
    } else {
      // Filter zipFiles
      course.zipFiles = (course.zipFiles || []).filter((z) => !isMatch(z));

      // Filter resources
      course.resources = (course.resources || []).filter((r) => !isMatch(r));

      // Update or clear course.zipFile
      if (course.zipFiles.length > 0) {
        course.zipFile = {
          url: course.zipFiles[course.zipFiles.length - 1].url,
          fileName: course.zipFiles[course.zipFiles.length - 1].fileName,
          fileSize: course.zipFiles[course.zipFiles.length - 1].fileSize,
        };
      } else {
        course.zipFile = { url: "", fileName: "", fileSize: "" };
      }
    }

    course.markModified("zipFile");
    course.markModified("zipFiles");
    course.markModified("resources");

    // Try to remove physical file if URL matches /uploads/
    if (targetUrl && targetUrl.startsWith("/uploads/")) {
      const filePath = path.join(__dirname, "..", targetUrl);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.error("Failed to delete physical file:", e);
        }
      }
    }

    await course.save();

    res.json({
      success: true,
      message: "ZIP file deleted successfully",
      course,
      zipFiles: course.zipFiles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

router.delete("/:courseId/upload-zip/:zipId", deleteZipHandler);
router.delete("/:courseId/upload-zip", deleteZipHandler);
router.post("/:courseId/delete-zip", deleteZipHandler);
router.post("/:courseId/upload-zip/:zipId/delete", deleteZipHandler);

// ==========================================
// 5. GET COURSE BY ID
// ==========================================

router.get("/id/:id", async (req, res) => {
  try {
    const paramId = req.params.id;
    let course = await getCourseDoc(paramId);

    if (!course) {
      course = getFallbackCourse(paramId);
    }

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.json({
      success: true,
      course,
    });
  } catch (error) {
    const fallback = getFallbackCourse(req.params.id);
    if (fallback) {
      return res.json({ success: true, course: fallback });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// 6. GET COURSE BY SLUG
// ==========================================

router.get("/:slug", async (req, res) => {
  try {
    const rawSlug = decodeURIComponent(req.params.slug || "").trim();
    let course = await getCourseDoc(rawSlug);

    if (!course) {
      course = getFallbackCourse(rawSlug);
    }

    if (!course) {
      return res.status(404).json({
        success: false,
        message: `Course not found for "${rawSlug}"`,
      });
    }

    res.json({
      success: true,
      course,
    });
  } catch (error) {
    const fallback = getFallbackCourse(req.params.slug);
    if (fallback) {
      return res.json({ success: true, course: fallback });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// 7. CREATE COURSE
// ==========================================

router.post("/", async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      category,
      level,
      duration,
      thumbnail,
      price,
      isPublished,
      modules,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a Course Title",
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a Course Description",
      });
    }

    let cleanSlug = (slug || title)
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!cleanSlug) {
      cleanSlug = `course-${Date.now().toString().slice(-6)}`;
    }

    let course = null;
    try {
      const existingSlug = await Course.findOne({ slug: cleanSlug });
      if (existingSlug) {
        cleanSlug = `${cleanSlug}-${Date.now().toString().slice(-4)}`;
      }

      course = await Course.create({
        title: title.trim(),
        slug: cleanSlug,
        description: description.trim(),
        category: category || "General",
        level: level || "Beginner",
        duration: duration || "",
        thumbnail: thumbnail || "",
        price: Number(price) || 0,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        modules: modules || [],
      });
    } catch (dbErr) {
      course = {
        _id: `course-${Date.now()}`,
        title: title.trim(),
        slug: cleanSlug,
        description: description.trim(),
        category: category || "General",
        level: level || "Beginner",
        duration: duration || "",
        thumbnail: thumbnail || "",
        price: Number(price) || 0,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        modules: modules || [],
        zipFiles: [],
        resources: [],
      };
      saveSingleFallbackCourse(course);
    }

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// 8. UPDATE COURSE
// ==========================================

router.put("/:id", async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      category,
      level,
      duration,
      thumbnail,
      price,
      isPublished,
      zipFile,
      zipFiles,
      resources,
      modules,
    } = req.body;

    let course = await getCourseDoc(req.params.id);

    if (!course) {
      const fallback = getFallbackCourse(req.params.id);
      const updatedFallback = {
        ...fallback,
        ...(title ? { title: title.trim() } : {}),
        ...(slug ? { slug } : {}),
        ...(description ? { description: description.trim() } : {}),
        ...(category !== undefined ? { category } : {}),
        ...(level !== undefined ? { level } : {}),
        ...(duration !== undefined ? { duration } : {}),
        ...(thumbnail !== undefined ? { thumbnail } : {}),
        ...(price !== undefined ? { price: Number(price) } : {}),
        ...(isPublished !== undefined ? { isPublished: Boolean(isPublished) } : {}),
        ...(zipFile !== undefined ? { zipFile } : {}),
        ...(zipFiles !== undefined ? { zipFiles } : {}),
        ...(resources !== undefined ? { resources } : {}),
        ...(modules !== undefined ? { modules } : {}),
      };

      saveSingleFallbackCourse(updatedFallback);

      return res.json({
        success: true,
        message: "Course updated successfully",
        course: updatedFallback,
      });
    }

    if (title) course.title = title.trim();
    if (slug) {
      course.slug = slug
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-");
    }
    if (description) course.description = description.trim();
    if (category !== undefined) course.category = category;
    if (level !== undefined) course.level = level;
    if (duration !== undefined) course.duration = duration;
    if (thumbnail !== undefined) course.thumbnail = thumbnail;
    if (price !== undefined) course.price = Number(price);
    if (isPublished !== undefined) course.isPublished = Boolean(isPublished);
    if (zipFile !== undefined) {
      course.zipFile = zipFile;
      course.markModified("zipFile");
    }
    if (zipFiles !== undefined) {
      course.zipFiles = zipFiles;
      course.markModified("zipFiles");
    }
    if (resources !== undefined) {
      course.resources = resources;
      course.markModified("resources");
    }
    if (modules !== undefined) {
      course.modules = modules;
      course.markModified("modules");
    }

    await course.save();

    res.json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// 9. DELETE COURSE
// ==========================================

router.delete("/:id", async (req, res) => {
  try {
    const course = await getCourseDoc(req.params.id);

    if (!course) {
      const fallbackList = loadFallbackCourses().filter(
        (c) => c._id !== req.params.id && c.slug !== req.params.id
      );
      saveFallbackCourses(fallbackList);
      return res.json({
        success: true,
        message: "Course removed",
      });
    }

    await Course.findByIdAndDelete(course._id);

    res.json({
      success: true,
      message: `Course "${course.title}" deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// 10. ADD MODULE
// ==========================================

router.post("/:courseId/modules", async (req, res) => {
  try {
    const { title, description, order } = req.body;
    let course = await getCourseDoc(req.params.courseId);

    if (!course) {
      const fallback = getFallbackCourse(req.params.courseId);
      const newModule = {
        _id: `mod-${Date.now()}`,
        title,
        description: description || "",
        order: order || (fallback.modules ? fallback.modules.length + 1 : 1),
        lessons: [],
      };
      const updatedModules = [...(fallback.modules || []), newModule];
      const updatedFallback = {
        ...fallback,
        modules: updatedModules,
      };

      saveSingleFallbackCourse(updatedFallback);

      return res.status(201).json({
        success: true,
        message: "Module added successfully",
        course: updatedFallback,
      });
    }

    course.modules.push({
      title,
      description,
      order: order || course.modules.length + 1,
      lessons: [],
    });

    await course.save();

    res.status(201).json({
      success: true,
      message: "Module added successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// 11. UPDATE MODULE
// ==========================================

router.put("/:courseId/modules/:moduleId", async (req, res) => {
  try {
    const { title, description, order } = req.body;
    const course = await getCourseDoc(req.params.courseId);

    if (!course) {
      const fallback = getFallbackCourse(req.params.courseId);
      const updatedModules = (fallback.modules || []).map((m) => {
        if (m._id === req.params.moduleId) {
          return {
            ...m,
            ...(title ? { title: title.trim() } : {}),
            ...(description !== undefined ? { description } : {}),
            ...(order !== undefined ? { order: Number(order) } : {}),
          };
        }
        return m;
      });
      const updatedFallback = { ...fallback, modules: updatedModules };
      saveSingleFallbackCourse(updatedFallback);

      return res.json({
        success: true,
        message: "Module updated successfully",
        course: updatedFallback,
      });
    }

    const module = course.modules.id(req.params.moduleId);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    if (title) module.title = title.trim();
    if (description !== undefined) module.description = description;
    if (order !== undefined) module.order = Number(order);

    await course.save();

    res.json({
      success: true,
      message: "Module updated successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// 12. DELETE MODULE
// ==========================================

router.delete("/:courseId/modules/:moduleId", async (req, res) => {
  try {
    const course = await getCourseDoc(req.params.courseId);

    if (!course) {
      const fallback = getFallbackCourse(req.params.courseId);
      const updatedModules = (fallback.modules || []).filter((m) => m._id !== req.params.moduleId);
      const updatedFallback = { ...fallback, modules: updatedModules };
      saveSingleFallbackCourse(updatedFallback);

      return res.json({
        success: true,
        message: "Module deleted successfully",
        course: updatedFallback,
      });
    }

    course.modules.pull({ _id: req.params.moduleId });
    await course.save();

    res.json({
      success: true,
      message: "Module deleted successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// 13. ADD LESSON
// ==========================================

router.post("/:courseId/modules/:moduleId/lessons", async (req, res) => {
  try {
    const { title, description, videoUrl, duration, order, isPreview, zipUrl, zipName, zipSize } = req.body;
    let course = await getCourseDoc(req.params.courseId);

    if (!course) {
      const fallback = getFallbackCourse(req.params.courseId);
      const newLesson = {
        _id: `les-${Date.now()}`,
        title,
        description: description || "",
        videoUrl: videoUrl || "",
        duration: duration || "",
        order: order || 1,
        isPreview: Boolean(isPreview),
        zipUrl: zipUrl || "",
        zipName: zipName || "",
        zipSize: zipSize || "",
      };

      const updatedModules = (fallback.modules || []).map((m) => {
        if (m._id === req.params.moduleId) {
          return {
            ...m,
            lessons: [...(m.lessons || []), newLesson],
          };
        }
        return m;
      });

      const updatedFallback = { ...fallback, modules: updatedModules };
      saveSingleFallbackCourse(updatedFallback);

      return res.status(201).json({
        success: true,
        message: "Lesson added successfully",
        course: updatedFallback,
      });
    }

    const module = course.modules.id(req.params.moduleId);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    module.lessons.push({
      title,
      description,
      videoUrl: videoUrl || "",
      duration: duration || "",
      order: order || module.lessons.length + 1,
      isPreview: Boolean(isPreview),
      zipUrl: zipUrl || "",
      zipName: zipName || "",
      zipSize: zipSize || "",
    });

    await course.save();

    res.status(201).json({
      success: true,
      message: "Lesson added successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// 14. UPDATE LESSON
// ==========================================

router.put("/:courseId/modules/:moduleId/lessons/:lessonId", async (req, res) => {
  try {
    const { title, description, videoUrl, duration, order, isPreview, zipUrl, zipName, zipSize } = req.body;
    const course = await getCourseDoc(req.params.courseId);

    if (!course) {
      const fallback = getFallbackCourse(req.params.courseId);
      const updatedModules = (fallback.modules || []).map((m) => {
        if (m._id === req.params.moduleId) {
          return {
            ...m,
            lessons: (m.lessons || []).map((l) => {
              if (l._id === req.params.lessonId) {
                return {
                  ...l,
                  ...(title ? { title: title.trim() } : {}),
                  ...(description !== undefined ? { description } : {}),
                  ...(videoUrl !== undefined ? { videoUrl } : {}),
                  ...(duration !== undefined ? { duration } : {}),
                  ...(order !== undefined ? { order: Number(order) } : {}),
                  ...(isPreview !== undefined ? { isPreview: Boolean(isPreview) } : {}),
                  ...(zipUrl !== undefined ? { zipUrl } : {}),
                  ...(zipName !== undefined ? { zipName } : {}),
                  ...(zipSize !== undefined ? { zipSize } : {}),
                };
              }
              return l;
            }),
          };
        }
        return m;
      });

      const updatedFallback = { ...fallback, modules: updatedModules };
      saveSingleFallbackCourse(updatedFallback);

      return res.json({
        success: true,
        message: "Lesson updated successfully",
        course: updatedFallback,
      });
    }

    const module = course.modules.id(req.params.moduleId);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    const lesson = module.lessons.id(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    if (title) lesson.title = title.trim();
    if (description !== undefined) lesson.description = description;
    if (videoUrl !== undefined) lesson.videoUrl = videoUrl;
    if (duration !== undefined) lesson.duration = duration;
    if (order !== undefined) lesson.order = Number(order);
    if (isPreview !== undefined) lesson.isPreview = Boolean(isPreview);
    if (zipUrl !== undefined) lesson.zipUrl = zipUrl;
    if (zipName !== undefined) lesson.zipName = zipName;
    if (zipSize !== undefined) lesson.zipSize = zipSize;

    await course.save();

    res.json({
      success: true,
      message: "Lesson updated successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// 15. DELETE LESSON
// ==========================================

router.delete("/:courseId/modules/:moduleId/lessons/:lessonId", async (req, res) => {
  try {
    const course = await getCourseDoc(req.params.courseId);

    if (!course) {
      const fallback = getFallbackCourse(req.params.courseId);
      const updatedModules = (fallback.modules || []).map((m) => {
        if (m._id === req.params.moduleId) {
          return {
            ...m,
            lessons: (m.lessons || []).filter((l) => l._id !== req.params.lessonId),
          };
        }
        return m;
      });

      const updatedFallback = { ...fallback, modules: updatedModules };
      saveSingleFallbackCourse(updatedFallback);

      return res.json({
        success: true,
        message: "Lesson deleted successfully",
        course: updatedFallback,
      });
    }

    const module = course.modules.id(req.params.moduleId);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    module.lessons.pull({ _id: req.params.lessonId });
    await course.save();

    res.json({
      success: true,
      message: "Lesson deleted successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==========================================
// ERROR HANDLER FOR MULTER
// ==========================================

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  next();
});

module.exports = router;
