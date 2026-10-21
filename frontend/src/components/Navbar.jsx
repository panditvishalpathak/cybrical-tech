import { useEffect, useState } from "react";


import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import logo from "../assets/logo/cybrical-logo.jpg";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // ===============================
  // CHECK LOGGED-IN USER
  // ===============================
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("User data error:", error);
        localStorage.removeItem("user");
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  // ===============================
  // SCROLL EFFECT
  // ===============================
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ===============================
  // CLOSE MOBILE MENU
  // ===============================
  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // ===============================
  // ACTIVE LINK
  // ===============================
  const isActive = (path) => {
    return location.pathname === path;
  };

  // ===============================
  // LOGOUT
  // ===============================
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");

    setUser(null);
    setMenuOpen(false);

    navigate("/");
  };

  return (
    <header
      className={`navbar ${
        scrolled ? "navbar-scrolled" : ""
      }`}
    >
      <div className="navbar-container">

        {/* ===============================
            LOGO
        =============================== */}

        <Link to="/" className="brand">

          <div className="brand-mark">
            <img
              src={logo}
              alt="Cybrical Tech Logo"
              onError={(e) => {
                if (!e.target.dataset.fallbackTried) {
                  e.target.dataset.fallbackTried = "true";
                  e.target.src = "/images/cybrical-logo.jpg";
                }
              }}
            />
          </div>

          <div className="brand-name">
            <strong>CYBRICAL</strong>
            <span>TECH</span>
          </div>

        </Link>

        {/* ===============================
            NAVIGATION
        =============================== */}

        <nav
          className={`navbar-menu ${
            menuOpen ? "open" : ""
          }`}
        >
          <Link
            to="/"
            className={isActive("/") ? "active" : ""}
          >
            Home
          </Link>

          <Link
            to="/about"
            className={isActive("/about") ? "active" : ""}
          >
            About
          </Link>

          <Link
            to="/services"
            className={isActive("/services") ? "active" : ""}
          >
            Services
          </Link>

          <Link
          to="/courses"
          className={isActive("/courses") ? "active" : ""}
            >
            Courses
          </Link>

          <Link
            to="/works"
            className={isActive("/works") ? "active" : ""}
          >
            Our Works
          </Link>

          <Link
            to="/blog"
            className={isActive("/blog") ? "active" : ""}
          >
            Blog
          </Link>

          <Link
            to="/location"
            className={isActive("/location") ? "active" : ""}
          >
            Location
          </Link>

          <Link
            to="/photos"
            className={isActive("/photos") ? "active" : ""}
          >
            Photos
          </Link>

          <Link
            to="/contact"
            className={isActive("/contact") ? "active" : ""}
          >
            Contact
          </Link>
        </nav>

        {/* ===============================
            RIGHT SIDE
        =============================== */}

        <div className="navbar-right">

          {/* SEARCH */}
          <button
            className="navbar-search"
            type="button"
            aria-label="Search"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
          </button>

          {/* USER */}
          {!user ? (
            <Link
              to="/login"
              className="navbar-user"
            >
              <span className="user-icon">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
                </svg>
              </span>

              <span>Hi, Guest</span>

              <span className="user-arrow">
                ↓
              </span>
            </Link>
          ) : (
            <div className="logged-user">

              <span className="user-icon">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
                </svg>
              </span>

              <span>
                Hi, {user.name || "User"}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="logout-btn"
              >
                Logout
              </button>

            </div>
          )}

          {/* CTA */}
          <Link
            to="/contact"
            className="navbar-cta"
          >
            Let's Talk
            <span>↗</span>
          </Link>

        </div>

        {/* ===============================
            MOBILE MENU
        =============================== */}

        <button
          className={`mobile-toggle ${
            menuOpen ? "active" : ""
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

      </div>
    </header>
  );
}

export default Navbar;