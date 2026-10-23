import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from "../config/api";
import "./AuthNeumorphic.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Interactive 3D Holographic Gyroscope Mouse Parallax
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6.5;
    const rotateY = ((x - centerX) / centerX) * 6.5;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const response = await axios.post(
        getApiUrl("/api/users/login"),
        {
          email,
          password,
        }
      );

      // Save JWT token
      if (response.data?.token) {
        localStorage.setItem("userToken", response.data.token);
        localStorage.setItem("token", response.data.token);
      }

      // Save user information
      if (response.data?.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login Error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to login. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="neu-auth-page">
      {/* Top Back To Website Button */}
      <Link to="/" className="neu-back-home">
        <span>←</span>
        <span>Back to Website</span>
      </Link>

      {/* 3D Neumorphic Sculpted Outer Halo */}
      <div
        className="neu-outer-halo"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg) translateY(-8px) scale(1.02)`
            : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)",
          transition: isHovered
            ? "transform 0.12s ease-out, box-shadow 0.45s ease"
            : "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s ease",
        }}
      >
        {/* Main 3D Circular Bevel Disk */}
        <div className="neu-disk-card">
          <div className="neu-brand-badge">
            <span className="neu-brand-dot" />
            CYBRICAL TECH
          </div>
          <h1 className="neu-title">Login</h1>
          <p className="neu-subtitle">Sign in to your account</p>

          {/* Error Alert */}
          {error && <div className="neu-alert-error">{error}</div>}

          {/* Form */}
          <form className="neu-form" onSubmit={handleLogin}>
            {/* Username / Email Inset Field */}
            <div className="neu-input-groove">
              <span className="neu-input-icon">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Username or Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="neu-input-field"
                required
                autoComplete="username"
              />
            </div>

            {/* Password Inset Field with Red Padlock & Accent (Reference Image Match) */}
            <div className="neu-input-groove password-accent">
              <span className="neu-input-icon red-icon">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
              </span>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="neu-input-field"
                required
                autoComplete="current-password"
              />
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="neu-controls-row">
              <label
                className="neu-toggle-label"
                onClick={() => setRememberMe(!rememberMe)}
              >
                <div className={`neu-toggle-switch ${rememberMe ? "active" : ""}`}>
                  <div className="neu-toggle-thumb" />
                </div>
                <span>Remember me</span>
              </label>

              <a
                href="#forgot"
                className="neu-forgot-link"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Please contact admin@cybrical.com to reset your credentials.");
                }}
              >
                Forgot password?
              </a>
            </div>

            {/* Raised 3D SIGN IN Button */}
            <button
              type="submit"
              className="neu-submit-btn"
              disabled={loading}
            >
              {loading ? "SIGNING IN..." : "SIGN IN"}
            </button>

            {/* Quick 1-Click Demo Fill */}
            <button
              type="button"
              className="neu-demo-pill"
              onClick={() => {
                setEmail("admin@cybrical.com");
                setPassword("Admin@123");
              }}
            >
              ⚡ 1-Click Demo: admin@cybrical.com / Admin@123
            </button>
          </form>

          {/* Footer Text */}
          <p className="neu-footer-text">
            Don't have an account?
            <Link to="/signup" className="neu-footer-highlight">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}