import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from "../config/api";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      let response;
      try {
        response = await axios.post(
          getApiUrl("/api/users/login"),
          { email, password }
        );
      } catch (userErr) {
        // Fallback to /api/auth/login
        response = await axios.post(
          getApiUrl("/api/auth/login"),
          { email, password }
        );
      }

      const token = response.data?.token;
      const user = response.data?.user || response.data?.admin || { name: "Master Admin", email, role: "admin" };

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("userToken", token);
      }

      localStorage.setItem("user", JSON.stringify(user));
      navigate("/admin/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid admin credentials. (Default: admin@cybrical.com / Admin@123)"
      );
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      width: "100%",
      background:
        "radial-gradient(circle at 20% 20%, rgba(34,197,94,0.12), transparent 30%), radial-gradient(circle at 80% 80%, rgba(16,185,129,0.10), transparent 30%), #030807",
      color: "#ffffff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "30px 20px",
      boxSizing: "border-box",
      fontFamily: "Arial, sans-serif",
      position: "relative",
      overflow: "hidden",
    },

    grid: {
      position: "absolute",
      inset: 0,
      backgroundImage:
        "linear-gradient(rgba(34,197,94,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.035) 1px, transparent 1px)",
      backgroundSize: "55px 55px",
      pointerEvents: "none",
    },

    glowOne: {
      position: "absolute",
      width: "300px",
      height: "300px",
      borderRadius: "50%",
      background: "rgba(34,197,94,0.10)",
      filter: "blur(80px)",
      top: "-100px",
      left: "-100px",
    },

    glowTwo: {
      position: "absolute",
      width: "300px",
      height: "300px",
      borderRadius: "50%",
      background: "rgba(16,185,129,0.08)",
      filter: "blur(80px)",
      bottom: "-100px",
      right: "-100px",
    },

    card: {
      position: "relative",
      zIndex: 2,
      width: "100%",
      maxWidth: "430px",
      padding: "42px",
      background: "rgba(7, 17, 12, 0.88)",
      border: "1px solid rgba(34,197,94,0.18)",
      borderRadius: "24px",
      boxShadow:
        "0 25px 80px rgba(0,0,0,0.55), 0 0 50px rgba(34,197,94,0.06)",
      backdropFilter: "blur(20px)",
      boxSizing: "border-box",
    },

    logoBox: {
      width: "54px",
      height: "54px",
      margin: "0 auto 18px",
      borderRadius: "16px",
      background: "linear-gradient(135deg, #22c55e, #10b981)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "#021006",
      fontSize: "28px",
      fontWeight: "900",
      boxShadow: "0 10px 35px rgba(34,197,94,0.25)",
    },

    badge: {
      display: "block",
      width: "fit-content",
      margin: "0 auto 14px",
      padding: "7px 13px",
      borderRadius: "50px",
      background: "rgba(34,197,94,0.08)",
      border: "1px solid rgba(34,197,94,0.18)",
      color: "#86efac",
      fontSize: "11px",
      fontWeight: "700",
      letterSpacing: "1.5px",
    },

    title: {
      textAlign: "center",
      margin: "0 0 8px",
      fontSize: "30px",
      fontWeight: "800",
      letterSpacing: "-0.8px",
    },

    greenText: {
      color: "#4ade80",
    },

    subtitle: {
      textAlign: "center",
      color: "#7f9185",
      margin: "0 0 32px",
      fontSize: "14px",
      lineHeight: "1.6",
    },

    formGroup: {
      marginBottom: "18px",
    },

    label: {
      display: "block",
      marginBottom: "8px",
      color: "#b7c8bd",
      fontSize: "13px",
      fontWeight: "600",
    },

    input: {
      width: "100%",
      padding: "15px 16px",
      boxSizing: "border-box",
      borderRadius: "12px",
      border: "1px solid rgba(255,255,255,0.10)",
      outline: "none",
      background: "rgba(255,255,255,0.045)",
      color: "#ffffff",
      fontSize: "14px",
      transition: "0.25s",
    },

    error: {
      marginBottom: "18px",
      padding: "12px 14px",
      borderRadius: "10px",
      background: "rgba(239,68,68,0.08)",
      border: "1px solid rgba(239,68,68,0.25)",
      color: "#fca5a5",
      fontSize: "13px",
      lineHeight: "1.5",
    },

    button: {
      width: "100%",
      padding: "15px",
      marginTop: "5px",
      background: "linear-gradient(135deg, #22c55e, #10b981)",
      color: "#021006",
      border: "none",
      borderRadius: "12px",
      fontSize: "15px",
      fontWeight: "800",
      cursor: loading ? "not-allowed" : "pointer",
      opacity: loading ? 0.7 : 1,
      boxShadow: "0 12px 30px rgba(34,197,94,0.18)",
    },

    footer: {
      textAlign: "center",
      marginTop: "25px",
      paddingTop: "22px",
      borderTop: "1px solid rgba(255,255,255,0.07)",
      color: "#68786e",
      fontSize: "12px",
    },

    backButton: {
      display: "block",
      margin: "12px auto 0",
      background: "transparent",
      border: "none",
      color: "#4ade80",
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: "600",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.grid}></div>
      <div style={styles.glowOne}></div>
      <div style={styles.glowTwo}></div>

      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoBox}>C</div>

        {/* Badge */}
        <span style={styles.badge}>CYBRICAL ADMIN</span>

        {/* Heading */}
        <h1 style={styles.title}>
          Admin <span style={styles.greenText}>Login</span>
        </h1>

        <p style={styles.subtitle}>
          Secure access to your Cybrical Tech control center.
        </p>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>

            <input
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>

            <div style={{ position: "relative", width: "100%" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...styles.input, paddingRight: "44px" }}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px",
                }}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && <div style={styles.error}>{error}</div>}

          {/* Quick Fill Master Admin Button */}
          <button
            type="button"
            onClick={() => {
              setEmail("admin@cybrical.com");
              setPassword("Admin@123");
            }}
            style={{
              width: "100%",
              marginBottom: "12px",
              padding: "10px",
              background: "rgba(34, 197, 94, 0.12)",
              border: "1px solid rgba(34, 197, 94, 0.3)",
              borderRadius: "10px",
              color: "#4ade80",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ⚡ 1-Click Fill: admin@cybrical.com / Admin@123
          </button>

          {/* Login */}
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Authenticating..." : "Login to Dashboard →"}
          </button>
        </form>

        <div style={styles.footer}>
          <div>Protected Admin Area</div>

          <button
            type="button"
            style={styles.backButton}
            onClick={() => navigate("/")}
          >
            ← Back to Website
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;