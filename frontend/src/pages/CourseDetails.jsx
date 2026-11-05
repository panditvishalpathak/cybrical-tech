import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getApiUrl,
  getAssetUrl,
  getDownloadUrl,
  isGoogleDriveUrl,
  isGoogleDriveFolder,
  extractGoogleDriveId,
  getGoogleDriveViewUrl,
  getGoogleDriveDownloadUrl,
} from "../config/api";
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
  thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
  modules: [],
  zipFile: {
    _id: "zf-wd-drive-folder",
    title: "Web Development Complete Project & Source Code (Google Drive Folder)",
    fileName: "Web-Development-Google-Drive-Projects",
    url: "https://drive.google.com/drive/folders/1C10i264a0xaytSIhoNeW0j1seO75J8qt",
    fileSize: "Google Drive Folder",
    isExternal: true,
    source: "Google Drive",
  },
  zipFiles: [
    {
      _id: "zf-wd-drive-folder",
      title: "📁 Web Development Complete Project & Source Code (Google Drive Folder)",
      fileName: "Web-Development-Google-Drive-Projects",
      url: "https://drive.google.com/drive/folders/1C10i264a0xaytSIhoNeW0j1seO75J8qt",
      fileSize: "Google Drive Folder",
      isExternal: true,
      source: "Google Drive",
      summary: "Master Google Drive folder containing all daily project folders, assets, and full-stack source code.",
      highlights: ["HTML5 Starter Pack", "CSS3 Responsive Projects", "JavaScript DOM Apps", "Full-Stack MERN Capstone", "Starter Assets"],
    },
    {
      _id: "zf-wd-day1",
      title: "📦 Day 1: WELCOME + HTML5 Starter Kit (ZIP)",
      fileName: "Day 1 WELCOME + HTML.zip",
      url: "https://drive.google.com/uc?export=download&id=1aBkTT6RZphi0YKcPt25Og0yBTolgWWfr",
      fileSize: "506.7 MB",
      isExternal: true,
      source: "Google Drive",
      summary: "HTML5 foundations, semantic layout boilerplate, forms, and welcome starter kit.",
      highlights: ["index.html Boilerplate", "Semantic Tags", "Forms & Input Elements", "Welcome Guide & Assets"],
    },
    {
      _id: "zf-wd-day2",
      title: "📦 Day 2: HTML & CSS Projects Complete (ZIP)",
      fileName: "Day 2 HTML.zip",
      url: "https://drive.google.com/uc?export=download&id=1lWxj29iac2Ssdve-dIvfENu6HBI98omo",
      fileSize: "350.6 MB",
      isExternal: true,
      source: "Google Drive",
      summary: "Modern CSS3 responsive styling, Flexbox layouts, Grid systems, and landing page builds.",
      highlights: ["Flexbox & Grid Systems", "Responsive Mobile Layouts", "Modern UI Components", "Landing Page Projects"],
    },
    {
      _id: "zf-wd-day3",
      title: "📦 Day 3: JavaScript DOM & Async REST API Projects (ZIP)",
      fileName: "02-JavaScript-DOM-Async-Projects.zip",
      url: "https://drive.google.com/file/d/1SINj1Bz_LZNafdzzK_algyuE0Tberpcf/view?usp=drive_link",
      fileSize: "Google Drive Cloud",
      isExternal: true,
      source: "Google Drive",
      summary: "Dynamic JavaScript apps, DOM events, fetch API integrations, and async project builds.",
      highlights: ["DOM Manipulation & Events", "Fetch API & Async/Await", "Interactive Weather App", "Quiz App with LocalStorage"],
    },
    {
      _id: "zf-wd-day4",
      title: "📦 Day 4: Full-Stack MERN Capstone Projects (ZIP)",
      fileName: "04-FullStack-MERN-Capstone-Project.zip",
      url: "https://drive.google.com/file/d/1cgldLQPh2jjt-z4Epaet4G8AhR1lN3EI/view?usp=drive_link",
      fileSize: "Google Drive Cloud",
      isExternal: true,
      source: "Google Drive",
      summary: "Production-ready MERN stack web app with Node/Express backend, MongoDB, and React frontend.",
      highlights: ["React.js Modern Frontend", "Node & Express REST API", "MongoDB Database Schemas", "JWT Auth & Protected Routes"],
    },
  ],
  resources: [
    {
      _id: "res-wd-drive-folder",
      title: "Web Development Complete Project & Source Code (Google Drive Folder)",
      fileName: "Web-Development-Google-Drive-Projects",
      url: "https://drive.google.com/drive/folders/1C10i264a0xaytSIhoNeW0j1seO75J8qt",
      fileUrl: "https://drive.google.com/drive/folders/1C10i264a0xaytSIhoNeW0j1seO75J8qt",
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
      url: "https://drive.google.com/file/d/1SINj1Bz_LZNafdzzK_algyuE0Tberpcf/view?usp=drive_link",
      fileUrl: "https://drive.google.com/file/d/1SINj1Bz_LZNafdzzK_algyuE0Tberpcf/view?usp=drive_link",
      fileSize: "Google Drive Cloud",
      isExternal: true,
      source: "Google Drive",
    },
    {
      _id: "res-wd-day4",
      title: "Day 4: Full-Stack MERN Capstone Projects (ZIP)",
      fileName: "04-FullStack-MERN-Capstone-Project.zip",
      url: "https://drive.google.com/file/d/1cgldLQPh2jjt-z4Epaet4G8AhR1lN3EI/view?usp=drive_link",
      fileUrl: "https://drive.google.com/file/d/1cgldLQPh2jjt-z4Epaet4G8AhR1lN3EI/view?usp=drive_link",
      fileSize: "Google Drive Cloud",
      isExternal: true,
      source: "Google Drive",
    },
  ],
};

const DATA_SCIENCE_FALLBACK_DATA = {
  _id: "660000000000000000000006",
  title: "Data Science",
  slug: "data-science",
  description:
    "Master Data Science, Python, Data Analysis, Statistics, Pandas, NumPy, Machine Learning, and Data Visualization with hands-on Google Drive projects and source datasets.",
  category: "Data Science",
  level: "Beginner to Advanced",
  duration: "14 Weeks",
  price: 0,
  isPublished: true,
  thumbnail:
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
  modules: [],
  zipFiles: [
    {
      _id: "zf-ds-drive-folder",
      title: "📁 Data Science Complete Projects & Datasets (Google Drive Folder)",
      fileName: "Data-Science-Google-Drive-Projects",
      url: "https://drive.google.com/drive/folders/14StHo9kxA0Umf_KpoGnQB22zmUNQKyjS",
      fileSize: "Google Drive Folder",
      isExternal: true,
      source: "Google Drive",
      summary: "Master Google Drive folder containing all Data Science Jupyter notebooks, Python datasets, machine learning models, and source code.",
      highlights: [
        "Python & NumPy Notebooks",
        "Pandas Data Wrangling Scripts",
        "Real-World CSV & SQL Datasets",
        "Scikit-Learn ML Models",
        "Data Visualization Dashboards",
      ],
    },
  ],
  resources: [
    {
      _id: "res-ds-drive-folder",
      title: "Data Science Complete Projects & Datasets (Google Drive Folder)",
      fileName: "Data-Science-Google-Drive-Projects",
      url: "https://drive.google.com/drive/folders/14StHo9kxA0Umf_KpoGnQB22zmUNQKyjS",
      fileUrl: "https://drive.google.com/drive/folders/14StHo9kxA0Umf_KpoGnQB22zmUNQKyjS",
      fileSize: "Google Drive Folder",
      isExternal: true,
      source: "Google Drive",
    },
  ],
  zipFile: {
    _id: "zf-ds-drive-folder",
    title: "Data Science Complete Projects & Datasets (Google Drive Folder)",
    fileName: "Data-Science-Google-Drive-Projects",
    url: "https://drive.google.com/drive/folders/14StHo9kxA0Umf_KpoGnQB22zmUNQKyjS",
    fileSize: "Google Drive Folder",
    isExternal: true,
    source: "Google Drive",
  },
};

const FALLBACK_COURSES_MAP = {
  "web-development": WEB_DEV_FALLBACK_DATA,
  "660000000000000000000001": WEB_DEV_FALLBACK_DATA,
  "data-science": DATA_SCIENCE_FALLBACK_DATA,
  "660000000000000000000006": DATA_SCIENCE_FALLBACK_DATA,
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
    modules: [],
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
  const [copiedId, setCopiedId] = useState(null);

  const fallbackCopy = (text, id) => {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {}
  };

  const handleCopyLink = (text, id) => {
    if (!text) return;
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopiedId(id);
          setTimeout(() => setCopiedId(null), 2000);
        })
        .catch(() => fallbackCopy(text, id));
    } else {
      fallbackCopy(text, id);
    }
  };

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
            (cleanSlug.includes("data") ? (localStorage.getItem("admin_course_data-science") || localStorage.getItem("admin_course_660000000000000000000006")) : null) ||
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
            (cleanSlug.includes("data") || cleanSlug.includes("science") ? FALLBACK_COURSES_MAP["data-science"] : null) ||
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

        // Ensure Web Development and Data Science courses are recognized
        const isCurrentWeb =
          cleanSlug.includes("web") ||
          cleanSlug === "660000000000000000000001" ||
          cleanSlug === "6ac3757e77cb85107a5ab348" ||
          (fetchedCourse && (fetchedCourse.slug === "web-development" || (fetchedCourse.title && fetchedCourse.title.toLowerCase().includes("web"))));

        const isCurrentDataScience =
          cleanSlug.includes("data") ||
          cleanSlug === "660000000000000000000006" ||
          (fetchedCourse && (fetchedCourse.slug === "data-science" || (fetchedCourse.title && fetchedCourse.title.toLowerCase().includes("data"))));

        const isCurrentAI =
          cleanSlug === "ai" ||
          cleanSlug.includes("artificial") ||
          cleanSlug === "660000000000000000000004" ||
          (fetchedCourse && (fetchedCourse.slug === "ai" || (fetchedCourse.title && fetchedCourse.title.toLowerCase().includes("artificial"))));

        // User request: remove all lesson names / modules from Web Development, Data Science, and AI courses
        if (isCurrentWeb || isCurrentDataScience || isCurrentAI) {
          fetchedCourse.modules = [];
        } else if (!fetchedCourse.modules || fetchedCourse.modules.length === 0) {
          const fallbackMod = FALLBACK_COURSES_MAP[cleanSlug]?.modules || FALLBACK_COURSES_MAP[slug]?.modules || [];
          if (fallbackMod && fallbackMod.length > 0) {
            fetchedCourse.modules = fallbackMod;
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
        } else if (fetchedCourse && isCurrentDataScience) {
          const hasValidZips =
            fetchedCourse.zipFiles &&
            fetchedCourse.zipFiles.some(
              (z) => z && z.url && z.url.trim() && !isStaleDummyZip(z.url)
            );

          if (!hasValidZips) {
            fetchedCourse.zipFiles = DATA_SCIENCE_FALLBACK_DATA.zipFiles;
            fetchedCourse.zipFile = DATA_SCIENCE_FALLBACK_DATA.zipFile;
            fetchedCourse.resources = DATA_SCIENCE_FALLBACK_DATA.resources;
          }
        } else if (fetchedCourse && !isCurrentWeb && !isCurrentDataScience) {
          // STRICT RULE: ONLY Web Development & Data Science courses should show ZIP / Drive files
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

  const isWebDevCourse =
    (course.slug && course.slug.toLowerCase().includes("web")) ||
    (course.title && course.title.toLowerCase().includes("web")) ||
    (course._id && course._id.toString().includes("000000000000000000000001")) ||
    (slug && slug.toLowerCase().includes("web"));

  const isDataScienceCourse =
    (course.slug && course.slug.toLowerCase().includes("data")) ||
    (course.title && course.title.toLowerCase().includes("data")) ||
    (course._id && course._id.toString().includes("000000000000000000000006")) ||
    (slug && slug.toLowerCase().includes("data"));

  const isGoogleDriveHubCourse = isWebDevCourse || isDataScienceCourse;

  const mainDriveFolderUrl = isDataScienceCourse
    ? "https://drive.google.com/drive/folders/14StHo9kxA0Umf_KpoGnQB22zmUNQKyjS"
    : "https://drive.google.com/drive/folders/1C10i264a0xaytSIhoNeW0j1seO75J8qt";

  // Gather ALL unique ZIP files from standard projects, zipFiles, and resources
  const allCourseZips = (() => {
    if (isDataScienceCourse) {
      const zips = (course?.zipFiles && course.zipFiles.length > 0)
        ? course.zipFiles
        : (DATA_SCIENCE_FALLBACK_DATA.zipFiles || []);
      return zips.filter((z) => z && (z.url || z.fileUrl) && !isStaleDummyZip(z.url || z.fileUrl));
    }
    if (!isWebDevCourse) {
      return (course?.zipFiles || []).filter((z) => z && (z.url || z.fileUrl) && !isStaleDummyZip(z.url || z.fileUrl));
    }

    const getCanonicalKey = (z) => {
      if (!z) return null;
      if (z._id && typeof z._id === "string" && z._id.startsWith("zf-wd-")) {
        if (z._id.includes("folder")) return "std-folder";
        if (z._id.includes("day1")) return "std-day1";
        if (z._id.includes("day2")) return "std-day2";
        if (z._id.includes("day3")) return "std-day3";
        if (z._id.includes("day4")) return "std-day4";
      }
      const str = ((z.fileName || "") + " " + (z.title || "") + " " + (z._id || "")).toLowerCase();
      if (str.includes("day 1") || str.includes("day-1") || str.includes("welcome")) return "std-day1";
      if (str.includes("day 2") || str.includes("day-2")) return "std-day2";
      if (str.includes("day 3") || str.includes("day-3") || str.includes("javascript") || str.includes("02-javascript")) return "std-day3";
      if (str.includes("day 4") || str.includes("day-4") || str.includes("capstone") || str.includes("mern") || str.includes("04-fullstack")) return "std-day4";
      if (str.includes("folder") || str.includes("master") || str.includes("web-development-google-drive")) return "std-folder";
      return null;
    };

    const zipMap = new Map();

    // 1. ALWAYS initialize with standard projects first!
    (WEB_DEV_FALLBACK_DATA.zipFiles || []).forEach((std) => {
      const canon = getCanonicalKey(std);
      if (canon) {
        zipMap.set(canon, { ...std, isExternal: true });
      }
    });

    // 2. Enhance with course.zipFiles
    (course.zipFiles || []).forEach((z, i) => {
      const u = z && (z.url || z.fileUrl);
      if (u && !isStaleDummyZip(u)) {
        const canon = getCanonicalKey(z);
        if (canon && zipMap.has(canon)) {
          const existing = zipMap.get(canon);
          zipMap.set(canon, {
            ...existing,
            ...z,
            _id: z._id || existing._id,
            title: z.title || existing.title,
            fileName: z.fileName || existing.fileName,
            url: u || existing.url,
            fileSize: z.fileSize || existing.fileSize,
            summary: z.summary || existing.summary,
            highlights: (z.highlights && z.highlights.length > 0) ? z.highlights : existing.highlights,
            isExternal: true,
          });
        } else {
          const customKey = z._id || `custom-zf-${i}-${z.fileName || z.title || u}`;
          zipMap.set(customKey, {
            _id: z._id || `zf-custom-${i}`,
            title: z.title || `Project ZIP Part ${i + 1}`,
            fileName: z.fileName || `project-part-${i + 1}.zip`,
            url: u,
            fileSize: z.fileSize || "Google Drive Cloud",
            isExternal: z.isExternal || isGoogleDriveUrl(u),
            summary: z.summary || "",
            highlights: z.highlights || [],
          });
        }
      }
    });

    // 3. Enhance with resources
    (course.resources || []).forEach((r, i) => {
      const url = r.url || r.fileUrl;
      if (url && !isStaleDummyZip(url) && (url.toLowerCase().endsWith(".zip") || (r.fileName && r.fileName.toLowerCase().endsWith(".zip")) || isGoogleDriveUrl(url))) {
        const canon = getCanonicalKey(r);
        if (canon && zipMap.has(canon)) {
          const existing = zipMap.get(canon);
          if (!existing.url && url) {
            existing.url = url;
          }
        } else {
          const customKey = r._id || `custom-res-${i}-${r.fileName || r.title || url}`;
          if (!zipMap.has(customKey)) {
            zipMap.set(customKey, {
              _id: r._id || `res-${i}`,
              title: r.title || r.fileName || `Resource ZIP Part ${i + 1}`,
              fileName: r.fileName || `resource-${i + 1}.zip`,
              url,
              fileSize: r.fileSize || "Google Drive Cloud",
              isExternal: r.isExternal || isGoogleDriveUrl(url),
              summary: r.summary || "",
              highlights: r.highlights || [],
            });
          }
        }
      }
    });

    return Array.from(zipMap.values());
  })();

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
            {totalLessons > 0 ? (
              <span>📚 {totalLessons} Lessons</span>
            ) : allCourseZips.length > 0 ? (
              <span>📦 {allCourseZips.length} Project ZIPs</span>
            ) : null}
          </div>

        </div>
      </section>

      {/* MAIN CONTENT GRID */}
      <section className="course-content-section">

        <div className="container course-details-grid">

          <div className="course-main-content">

            {/* GOOGLE DRIVE HUB BANNER FOR WEB DEVELOPMENT & DATA SCIENCE */}
            {isGoogleDriveHubCourse ? (
              <section className="google-drive-hub-hero">
                <div className="google-drive-hub-content">
                  <span className="google-drive-badge">
                    ☁️ OFFICIAL GOOGLE DRIVE CLOUD STORAGE
                  </span>
                  <h2>{course.title || "Course"} Projects & Source Code</h2>
                  <p>
                    All practical project source code archives, datasets, starter kits, and full-stack capstone projects are permanently hosted on <strong>Google Drive</strong>. You can open any project directly in Google Drive or download ZIP files for offline practice.
                  </p>

                  <div className="google-drive-hub-actions">
                    <a
                      href={mainDriveFolderUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="google-drive-main-btn"
                    >
                      <span>📁</span> Open Google Drive Folder ↗
                    </a>
                    {allCourseZips.length > 0 && (
                      <button
                        type="button"
                        onClick={handleDownloadAllZips}
                        disabled={isDownloadingAll}
                        className="google-drive-download-all-btn"
                      >
                        <span>⚡</span> {isDownloadingAll ? `Downloading ${allCourseZips.length} Files...` : `Download All (${allCourseZips.length}) ZIPs ⬇`}
                      </button>
                    )}
                  </div>
                </div>
              </section>
            ) : selectedLesson ? (
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
              </section>
            ) : totalLessons > 0 ? (
              <section className="video-empty-state">
                <div>🎬</div>
                <h2>Select a lesson to start learning</h2>
                <p>Choose any lesson from the course curriculum below to start watching video lectures.</p>
              </section>
            ) : null}

            {/* ALL COURSE ZIP FILES LIST IN MAIN CONTENT */}
            {allCourseZips.length > 0 && (
              <section className="course-materials-section" style={{ marginTop: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
                  <div>
                    <h2 style={{ margin: 0 }}>☁️ Google Drive Source Code & Project ZIPs ({allCourseZips.length})</h2>
                    <p style={{ color: "#8da096", fontSize: "14px", margin: "6px 0 0 0" }}>
                      Direct links to all Google Drive source code archives and downloadable project ZIPs:
                    </p>
                  </div>

                  <a
                    href={mainDriveFolderUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 16px",
                      background: "rgba(37, 99, 235, 0.15)",
                      border: "1px solid rgba(59, 130, 246, 0.4)",
                      borderRadius: "8px",
                      color: "#93c5fd",
                      fontWeight: "700",
                      fontSize: "13px",
                      textDecoration: "none",
                    }}
                  >
                    📁 Main Drive Folder ↗
                  </a>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {allCourseZips.map((z, idx) => {
                    const isFolder = isGoogleDriveFolder(z.url);
                    const driveViewUrl = getGoogleDriveViewUrl(z.url) || z.url;
                    const driveDownloadUrl = isGoogleDriveUrl(z.url)
                      ? (getGoogleDriveDownloadUrl(z.url) || z.url)
                      : getDownloadUrl(z.url, z.fileName);
                    const isCopied = copiedId === (z._id || idx);

                    return (
                      <div className="materials-card google-drive-card" key={z._id || idx}>
                        <div className="materials-icon">{isFolder ? "📁" : "📦"}</div>
                        <div className="materials-details">
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                            <span className="materials-badge" style={{ background: "rgba(37, 99, 235, 0.15)", borderColor: "rgba(59, 130, 246, 0.4)", color: "#93c5fd" }}>
                              ☁️ Google Drive
                            </span>
                            <span className="materials-badge">
                              {isFolder ? "Project Folder" : (z.fileSize || "Cloud ZIP")}
                            </span>
                          </div>

                          <h3>{z.title || z.fileName}</h3>
                          <p style={{ color: "#94a3b8", fontSize: "13px", margin: "2px 0 6px 0" }}>{z.fileName}</p>

                          {/* Summary / Description of the ZIP */}
                          {z.summary && (
                            <p style={{ color: "#cbd5e1", fontSize: "14px", margin: "6px 0 10px 0", lineHeight: "1.5" }}>
                              {z.summary}
                            </p>
                          )}

                          {/* Included Files & Topics to Read */}
                          {z.highlights && z.highlights.length > 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", margin: "8px 0 12px 0" }}>
                              <span style={{ fontSize: "11px", fontWeight: "700", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "0.5px", alignSelf: "center", marginRight: "2px" }}>
                                📖 Included:
                              </span>
                              {z.highlights.map((h, hIdx) => (
                                <span
                                  key={hIdx}
                                  style={{
                                    fontSize: "12px",
                                    padding: "3px 9px",
                                    background: "rgba(56, 189, 248, 0.12)",
                                    border: "1px solid rgba(56, 189, 248, 0.3)",
                                    borderRadius: "6px",
                                    color: "#bae6fd",
                                    fontWeight: "500",
                                  }}
                                >
                                  ✓ {h}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Direct Google Drive URL display */}
                          <div
                            style={{
                              marginTop: "8px",
                              padding: "7px 12px",
                              background: "rgba(0, 0, 0, 0.35)",
                              border: "1px solid rgba(255, 255, 255, 0.08)",
                              borderRadius: "8px",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              flexWrap: "wrap",
                            }}
                          >
                            <span style={{ fontSize: "11px", fontWeight: "700", color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                              🔗 Drive Link:
                            </span>
                            <a
                              href={driveViewUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                color: "#93c5fd",
                                fontSize: "12px",
                                textDecoration: "underline",
                                wordBreak: "break-all",
                              }}
                              title="Click to view and read file in Google Drive"
                            >
                              {driveViewUrl}
                            </a>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                          {/* 1. Read & Open in Google Drive Button */}
                          <a
                            href={driveViewUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="materials-download-btn"
                            style={{
                              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                              color: "#ffffff",
                              boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                            title="Read files and inspect source code in Google Drive"
                          >
                            <span>📖</span> Read in Google Drive ↗
                          </a>

                          {/* 2. Download ZIP Button */}
                          {!isFolder && (
                            <a
                              href={driveDownloadUrl}
                              download={z.isExternal || isGoogleDriveUrl(z.url) ? undefined : (z.fileName || `project-${idx + 1}.zip`)}
                              target="_blank"
                              rel="noreferrer"
                              className="materials-download-btn"
                              style={{
                                background: "rgba(34, 197, 94, 0.15)",
                                border: "1px solid rgba(34, 197, 94, 0.4)",
                                color: "#4ade80",
                              }}
                              title="Direct Download ZIP file"
                            >
                              <span>⬇</span> Download ZIP
                            </a>
                          )}

                          {/* 3. Copy Link Button */}
                          <button
                            type="button"
                            onClick={() => handleCopyLink(driveViewUrl, z._id || idx)}
                            style={{
                              padding: "11px 14px",
                              background: isCopied ? "rgba(34, 197, 94, 0.2)" : "rgba(255, 255, 255, 0.08)",
                              border: isCopied ? "1px solid rgba(34, 197, 94, 0.5)" : "1px solid rgba(255, 255, 255, 0.18)",
                              borderRadius: "10px",
                              color: isCopied ? "#4ade80" : "#e2e8f0",
                              fontSize: "13px",
                              fontWeight: "700",
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                            }}
                            title="Copy Google Drive URL"
                          >
                            {isCopied ? "Copied! ✅" : "📋 Copy Link"}
                          </button>
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
                ) : isGoogleDriveHubCourse ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ padding: "14px 18px", background: "rgba(37, 99, 235, 0.08)", borderRadius: "10px", border: "1px solid rgba(59, 130, 246, 0.25)", color: "#cbd5e1", fontSize: "14px", lineHeight: "1.5" }}>
                      <strong style={{ color: "#93c5fd", display: "block", marginBottom: "4px" }}>☁️ All Project ZIP Files & Source Code ({allCourseZips.length})</strong>
                      All source code packages, starter kits, and full-stack projects are hosted on Google Drive. Click below to open directly in Google Drive or download:
                    </div>

                    {allCourseZips.map((z, idx) => {
                      const isFolder = isGoogleDriveFolder(z.url);
                      const driveUrl = getGoogleDriveViewUrl(z.url) || z.url;
                      const downloadUrl = isGoogleDriveUrl(z.url)
                        ? (getGoogleDriveDownloadUrl(z.url) || z.url)
                        : getDownloadUrl(z.url, z.fileName);

                      return (
                        <div
                          key={`curr-${z._id || idx}`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "16px 20px",
                            background: "rgba(15, 23, 42, 0.6)",
                            border: "1px solid rgba(59, 130, 246, 0.25)",
                            borderRadius: "12px",
                            flexWrap: "wrap",
                            gap: "12px",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: "240px" }}>
                            <span style={{ fontSize: "28px" }}>{isFolder ? "📁" : "📦"}</span>
                            <div style={{ flex: 1 }}>
                              <h4 style={{ margin: "0 0 4px 0", color: "#f8fafc", fontSize: "15px", fontWeight: "700" }}>
                                {z.title || z.fileName}
                              </h4>
                              <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", marginBottom: "6px" }}>
                                <span style={{ background: "rgba(37, 99, 235, 0.2)", color: "#93c5fd", padding: "2px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700" }}>
                                  ☁️ Google Drive
                                </span>
                                <span style={{ color: "#94a3b8", fontSize: "12px" }}>
                                  {isFolder ? "Project Folder" : (z.fileSize || "Cloud ZIP")}
                                </span>
                              </div>
                              {z.summary && (
                                <p style={{ color: "#cbd5e1", fontSize: "13px", margin: "4px 0 6px 0", lineHeight: "1.4" }}>
                                  {z.summary}
                                </p>
                              )}
                              {z.highlights && z.highlights.length > 0 && (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginTop: "4px" }}>
                                  {z.highlights.map((h, i) => (
                                    <span
                                      key={i}
                                      style={{
                                        fontSize: "11px",
                                        padding: "2px 7px",
                                        background: "rgba(56, 189, 248, 0.1)",
                                        border: "1px solid rgba(56, 189, 248, 0.25)",
                                        borderRadius: "4px",
                                        color: "#bae6fd",
                                      }}
                                    >
                                      ✓ {h}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                            <a
                              href={driveUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                padding: "9px 16px",
                                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                                color: "#ffffff",
                                borderRadius: "8px",
                                fontSize: "13px",
                                fontWeight: "700",
                                textDecoration: "none",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.35)",
                              }}
                              title="Read files and inspect source code in Google Drive"
                            >
                              <span>📖</span> Read in Google Drive ↗
                            </a>

                            {!isFolder && (
                              <a
                                href={downloadUrl}
                                download={z.isExternal || isGoogleDriveUrl(z.url) ? undefined : (z.fileName || `project-${idx + 1}.zip`)}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  padding: "9px 14px",
                                  background: "rgba(34, 197, 94, 0.15)",
                                  border: "1px solid rgba(34, 197, 94, 0.4)",
                                  color: "#4ade80",
                                  borderRadius: "8px",
                                  fontSize: "13px",
                                  fontWeight: "700",
                                  textDecoration: "none",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "6px",
                                }}
                                title="Download ZIP"
                              >
                                <span>⬇</span> Download
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
                <div style={{ marginTop: "16px", padding: "14px", background: "rgba(37, 99, 235, 0.08)", border: "1px solid rgba(59, 130, 246, 0.3)", borderRadius: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <strong style={{ color: "#93c5fd", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>☁️</span> Google Drive ZIPs ({allCourseZips.length}):
                    </strong>
                    {allCourseZips.length > 1 && (
                      <button
                        type="button"
                        onClick={handleDownloadAllZips}
                        disabled={isDownloadingAll}
                        style={{
                          background: "#2563eb",
                          color: "#ffffff",
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
                      const driveUrl = getGoogleDriveViewUrl(z.url) || z.url;
                      return (
                        <a
                          key={z._id || idx}
                          href={driveUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            padding: "8px 10px",
                            background: "rgba(0,0,0,0.3)",
                            border: "1px solid rgba(59,130,246,0.3)",
                            borderRadius: "6px",
                            color: "#93c5fd",
                            fontSize: "12px",
                            textDecoration: "none",
                            fontWeight: "600",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                          title={`Open ${z.title} on Google Drive`}
                        >
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginRight: "6px" }}>
                            {isFolder ? "📁" : "📦"} {z.title || z.fileName}
                          </span>
                          <span style={{ color: "#60a5fa", fontWeight: "800", flexShrink: 0, fontSize: "11px" }}>
                            📖 Read ↗
                          </span>
                        </a>
                      );
                    })}
                  </div>

                  <a
                    href={mainDriveFolderUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      width: "100%",
                      marginTop: "10px",
                      padding: "8px 12px",
                      background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                      color: "#ffffff",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "700",
                      textDecoration: "none",
                    }}
                  >
                    <span>📁</span> Open Google Drive Folder ↗
                  </a>
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