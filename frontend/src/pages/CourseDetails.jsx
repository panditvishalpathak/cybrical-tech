import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getApiUrl, getAssetUrl, getDownloadUrl } from "../config/api";
import "./CourseDetails.css";

const FALLBACK_COURSES_MAP = {
  ai: {
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
    zipFiles: [],
    resources: [],
  },
  "web-development": {
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
    modules: [],
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
            zipUrl: "/uploads/courses/1791265931186-935533293.zip",
          },
          {
            _id: "and-les-2",
            title: "Lesson 2: Kotlin Fundamentals, OOP & Coroutines",
            description: "Variables, Null Safety, Lambdas, Coroutines and Asynchronous Kotlin for Android.",
            duration: "45 min",
            videoUrl: "",
            zipUrl: "",
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
          },
          {
            _id: "and-les-4",
            title: "Lesson 4: Compose State, ViewModel & Navigation",
            description: "Remember, MutableState, State Hoisting, and Navigation Component.",
            duration: "45 min",
            videoUrl: "",
            zipUrl: "",
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
          },
          {
            _id: "and-les-6",
            title: "Lesson 6: Local Persistence with Room Database & DataStore",
            description: "Entities, DAOs, TypeConverters, LiveData/Flow, and Preferences DataStore.",
            duration: "50 min",
            videoUrl: "",
            zipUrl: "",
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
          },
          {
            _id: "and-les-8",
            title: "Lesson 8: App Bundle (AAB), ProGuard & Google Play Release",
            description: "Keystore generation, signing, optimization, and deploying to Google Play Console.",
            duration: "40 min",
            videoUrl: "",
            zipUrl: "",
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
  },
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
          const raw = localStorage.getItem(k);
          if (raw && raw.includes("179119")) {
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
            localStorage.getItem(`admin_course_${slug}`);
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
            remoteZips.forEach((z) => zipMergeMap.set(z.url, z));
            localZips.forEach((z) => {
              if (!zipMergeMap.has(z.url)) zipMergeMap.set(z.url, z);
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

        // Ensure modules are always present if empty
        if (fetchedCourse && (!fetchedCourse.modules || fetchedCourse.modules.length === 0)) {
          const fallbackMod = FALLBACK_COURSES_MAP[cleanSlug]?.modules || FALLBACK_COURSES_MAP[slug]?.modules || [];
          if (fallbackMod && fallbackMod.length > 0) {
            fetchedCourse.modules = fallbackMod;
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

  // Gather ALL unique ZIP files from zipFiles, resources, zipFile, and all lessons
  const zipMap = new Map();

  // 1. From zipFiles
  (course.zipFiles || []).forEach((z, i) => {
    if (z && z.url && !isStaleDummyZip(z.url)) {
      zipMap.set(z.url, {
        _id: z._id || `zf-${i}`,
        title: z.title || `Project ZIP Part ${i + 1}`,
        fileName: z.fileName || `project-part-${i + 1}.zip`,
        url: z.url,
        fileSize: z.fileSize || "ZIP File",
        isExternal: z.isExternal || z.url.includes("drive.google.com") || z.url.includes("google"),
      });
    }
  });

  // 2. From resources
  (course.resources || []).forEach((r, i) => {
    const url = r.url || r.fileUrl;
    if (url && !isStaleDummyZip(url) && (url.toLowerCase().endsWith(".zip") || (r.fileName && r.fileName.toLowerCase().endsWith(".zip")) || !zipMap.has(url))) {
      if (!zipMap.has(url)) {
        zipMap.set(url, {
          _id: r._id || `res-${i}`,
          title: r.title || r.fileName || `Resource ZIP Part ${i + 1}`,
          fileName: r.fileName || `resource-${i + 1}.zip`,
          url,
          fileSize: r.fileSize || "ZIP File",
          isExternal: r.isExternal || url.includes("drive.google.com") || url.includes("google"),
        });
      }
    }
  });

  // 3. From legacy zipFile
  if (course.zipFile && course.zipFile.url && !isStaleDummyZip(course.zipFile.url) && !zipMap.has(course.zipFile.url)) {
    zipMap.set(course.zipFile.url, {
      _id: "main-zip",
      title: course.zipFile.fileName || "Course Project ZIP",
      fileName: course.zipFile.fileName || "course-project.zip",
      url: course.zipFile.url,
      fileSize: course.zipFile.fileSize || "ZIP Archive",
      isExternal: course.zipFile.isExternal || course.zipFile.url.includes("drive.google.com") || course.zipFile.url.includes("google"),
    });
  }

  // 4. From any lessons with zipUrl (ignoring stale 179119)
  (course.modules || []).forEach((m) => {
    (m.lessons || []).forEach((l) => {
      if (l.zipUrl && !isStaleDummyZip(l.zipUrl) && !zipMap.has(l.zipUrl)) {
        zipMap.set(l.zipUrl, {
          _id: l._id || l.zipUrl,
          title: `${l.title} (Project ZIP)`,
          fileName: l.zipName || `${l.title}.zip`,
          url: l.zipUrl,
          fileSize: l.zipSize || "Lesson ZIP",
          isExternal: l.zipUrl.includes("drive.google.com") || l.zipUrl.includes("google"),
        });
      }
    });
  });

  const allCourseZips = Array.from(zipMap.values());

  const handleDownloadAllZips = () => {
    if (!allCourseZips || allCourseZips.length === 0) return;
    setIsDownloadingAll(true);

    allCourseZips.forEach((z, index) => {
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = getDownloadUrl(z.url, z.fileName);
        link.setAttribute("download", z.fileName || `course-project-part-${index + 1}.zip`);
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
                    <video
                      controls
                      controlsList="nodownload"
                      className="lesson-video-player"
                      src={getAssetUrl(selectedLesson.videoUrl)}
                      key={selectedLesson.videoUrl}
                    >
                      Your browser does not support video playback.
                    </video>
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
                {selectedLesson.zipUrl && (
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
                        {selectedLesson.zipName || `${selectedLesson.title}.zip`} {selectedLesson.zipSize ? `(${selectedLesson.zipSize})` : ""}
                      </h4>
                    </div>

                    <a
                      href={getDownloadUrl(selectedLesson.zipUrl, selectedLesson.zipName || `${selectedLesson.title}.zip`)}
                      download={selectedLesson.zipName || `${selectedLesson.title}.zip`}
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
                    >
                      <span>📥</span> Download Lesson ZIP ⬇
                    </a>
                  </div>
                )}

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
                  {allCourseZips.map((z, idx) => (
                    <div className="materials-card" key={z._id || idx}>
                      <div className="materials-icon">📦</div>
                      <div className="materials-details">
                        <h3>{z.title || z.fileName}</h3>
                        <p>{z.fileName}</p>
                        <span className="materials-badge">
                          {(z.isExternal || (z.url && (z.url.includes("drive.google.com") || z.url.includes("google.com"))))
                            ? `☁️ Google Drive • ${z.fileSize || "Cloud ZIP"}`
                            : (z.fileSize || "ZIP Archive")}
                        </span>
                      </div>
                      <a
                        href={getDownloadUrl(z.url, z.fileName)}
                        download={z.fileName || `project-${idx + 1}.zip`}
                        target="_blank"
                        rel="noreferrer"
                        className="materials-download-btn"
                      >
                        Download ZIP ⬇
                      </a>
                    </div>
                  ))}
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
                    {allCourseZips.map((z, idx) => (
                      <a
                        key={z._id || idx}
                        href={getDownloadUrl(z.url, z.fileName)}
                        download={z.fileName || `project-${idx + 1}.zip`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          padding: "7px 10px",
                          background: "rgba(0,0,0,0.3)",
                          border: "1px solid rgba(34,197,94,0.3)",
                          borderRadius: "6px",
                          color: "#86efac",
                          fontSize: "12px",
                          textDecoration: "none",
                          fontWeight: "600",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginRight: "6px" }}>
                          📦 {z.title || z.fileName}
                        </span>
                        <span style={{ color: "#4ade80", fontWeight: "800", flexShrink: 0 }}>⬇</span>
                      </a>
                    ))}
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