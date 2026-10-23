import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from "../config/api";
import "./AuthNeumorphic.css";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        getApiUrl("/api/users/register"),
        {
          name,
          email,
          password,
        }
      );

      console.log("Signup Response:", response.data);
      setSuccess("Account created successfully! Redirecting...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Signup Error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to create account. Please try again."
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
      <div className="neu-outer-halo signup-halo">
        {/* Main 3D Bevel Disk */}
        <div className="neu-disk-card signup-disk">
          <h1 className="neu-title">Sign Up</h1>
          <p className="neu-subtitle">Create your new account</p>

          {/* Alerts */}
          {error && <div className="neu-alert-error">{error}</div>}
          {success && <div className="neu-alert-success">{success}</div>}

          {/* Form */}
          <form className="neu-form" onSubmit={handleSignup}>
            {/* Full Name */}
            <div className="neu-input-groove">
              <span className="neu-input-icon">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="neu-input-field"
                required
                autoComplete="name"
              />
            </div>

            {/* Email Address */}
            <div className="neu-input-groove">
              <span className="neu-input-icon">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </span>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="neu-input-field"
                required
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="neu-input-groove">
              <span className="neu-input-icon">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
              </span>
              <input
                type="password"
                placeholder="Create Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="neu-input-field"
                required
                autoComplete="new-password"
              />
            </div>

            {/* Confirm Password (with Red Padlock & Accent) */}
            <div className="neu-input-groove password-accent">
              <span className="neu-input-icon red-icon">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
              </span>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="neu-input-field"
                required
                autoComplete="new-password"
              />
            </div>

            {/* Raised 3D Button */}
            <button
              type="submit"
              className="neu-submit-btn"
              disabled={loading}
            >
              {loading ? "CREATING ACCOUNT..." : "SIGN UP"}
            </button>
          </form>

          {/* Footer Text */}
          <p className="neu-footer-text">
            Already have an account?
            <Link to="/login" className="neu-footer-highlight">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}