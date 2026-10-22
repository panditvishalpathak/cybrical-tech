import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footers";
import AIAssistant from "./components/AIAssistant";

import Location from "./pages/Location";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Works from "./pages/Works";
import Blog from "./pages/Blog";
import Photos from "./pages/Photos";
import Contact from "./pages/Contact";

// Admin Pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBlogs from "./pages/AdminBlogs";

// User Auth
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

// LMS
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import AdminCourses from "./pages/AdminCourses";
import AdminCourseContent from "./pages/AdminCourseContent";

function App() {
  const location = useLocation();

  // Admin & Dashboard pages par public Navbar/Footer/AI Assistant hide karna
  const isAdminPage = location.pathname.startsWith("/admin");
  const isDashboardPage = location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/ai-dashboard");

  return (
    <>
      {/* ================= PUBLIC NAVBAR ================= */}
      {!isAdminPage && !isDashboardPage && <Navbar />}

      <Routes>
        {/* ================= PUBLIC WEBSITE ================= */}

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/services" element={<Services />} />

        <Route path="/works" element={<Works />} />

        <Route path="/blog" element={<Blog />} />

        <Route path="/location" element={<Location />} />

        <Route path="/photos" element={<Photos />} />

        <Route path="/contact" element={<Contact />} />
        

        {/* ================= LMS ================= */}

        {/* Courses List */}
        <Route
          path="/courses"
          element={<Courses />}
        />

        {/* Course Details */}
        <Route
          path="/courses/:slug"
          element={<CourseDetails />}
        />

        {/* ================= ADMIN PANEL ================= */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/blogs"
          element={<AdminBlogs />}
        />

        {/* ================= USER AUTH ================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/ai-dashboard"
          element={<Dashboard />}
        />

        <Route path="/admin/courses" element={<AdminCourses />} />

        <Route
          path="/admin/courses/:id/content"
          element={<AdminCourseContent />}
        />
        {/* ================= 404 ================= */}

        <Route
          path="*"
          element={
            <div
              style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                fontFamily: "Arial, sans-serif",
                background: "#030807",
                color: "#fff",
              }}
            >
              <h1
                style={{
                  fontSize: "70px",
                  margin: 0,
                }}
              >
                404
              </h1>

              <h2>Page Not Found</h2>

              <a
                href="/"
                style={{
                  marginTop: "20px",
                  padding: "12px 24px",
                  background: "#111827",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: "8px",
                }}
              >
                Go Home
              </a>
            </div>
          }
        />
      </Routes>

      {/* ================= AI ASSISTANT ================= */}
      {!isAdminPage && !isDashboardPage && <AIAssistant />}

      {/* ================= PUBLIC FOOTER ================= */}
      {!isAdminPage && !isDashboardPage && <Footer />}
    </>
  );
}

export default App;