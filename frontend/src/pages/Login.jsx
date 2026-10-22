import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from "../config/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

      console.log("Login Response:", response.data);

      // Save JWT token
      localStorage.setItem("userToken", response.data.token);

      // Save user information
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      // Go to home
      navigate("/");
    } catch (error) {
      console.error("Login Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Background effects */}
      <div style={styles.glowOne}></div>
      <div style={styles.glowTwo}></div>
      <div style={styles.grid}></div>

      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>
          <span style={styles.logoMark}>C</span>
          CYBRICAL <span style={styles.logoTech}>TECH</span>
        </div>

        {/* Small badge */}
        <div style={styles.badge}>
          <span style={styles.badgeDot}></span>
          SECURE LOGIN
        </div>

        {/* Heading */}
        <h1 style={styles.title}>
          Welcome <span style={styles.titleGreen}>Back</span>
        </h1>

        <p style={styles.subtitle}>
          Login to your Cybrical Tech account
        </p>

        {/* Error */}
        {error && (
          <div style={styles.error}>
            <span>!</span>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          {/* Email */}
          <label style={styles.label}>EMAIL ADDRESS</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          {/* Password */}
          <label style={styles.label}>PASSWORD</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          {/* Quick Fill Button */}
          <button
            type="button"
            onClick={() => {
              setEmail("admin@cybrical.com");
              setPassword("Admin@123");
            }}
            style={{
              width: "100%",
              margin: "10px 0 14px",
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
            ⚡ 1-Click Demo Fill: admin@cybrical.com / Admin@123
          </button>

          {/* Login Button */}
          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
          >
            <span>
              {loading ? "Logging in..." : "Login"}
            </span>

            {!loading && <b>↗</b>}
          </button>
        </form>

        {/* Signup */}
        <p style={styles.bottomText}>
          Don't have an account?{" "}
          <Link to="/signup" style={styles.link}>
            Sign Up
          </Link>
        </p>

        {/* Home */}
        <button
          type="button"
          onClick={() => navigate("/")}
          style={styles.backButton}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    background:
      "radial-gradient(circle at 20% 20%, rgba(34,197,94,0.08), transparent 30%), radial-gradient(circle at 80% 80%, rgba(16,185,129,0.06), transparent 30%), #030807",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
    color: "#f1fdf5",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box",
  },

  /* Background glow */
  glowOne: {
    position: "absolute",
    width: "420px",
    height: "420px",
    borderRadius: "50%",
    top: "-180px",
    left: "-120px",
    background: "rgba(34,197,94,0.08)",
    filter: "blur(90px)",
    pointerEvents: "none",
  },

  glowTwo: {
    position: "absolute",
    width: "380px",
    height: "380px",
    borderRadius: "50%",
    right: "-150px",
    bottom: "-150px",
    background: "rgba(16,185,129,0.07)",
    filter: "blur(90px)",
    pointerEvents: "none",
  },

  grid: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(34,197,94,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.025) 1px, transparent 1px)",
    backgroundSize: "65px 65px",
    pointerEvents: "none",
  },

  /* Main card */
  card: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    maxWidth: "440px",
    boxSizing: "border-box",
    background:
      "linear-gradient(145deg, rgba(9,22,14,0.97), rgba(4,12,8,0.97))",
    padding: "42px",
    borderRadius: "22px",
    border: "1px solid rgba(34,197,94,0.18)",
    boxShadow:
      "0 30px 90px rgba(0,0,0,0.55), 0 0 50px rgba(34,197,94,0.04)",
    backdropFilter: "blur(20px)",
  },

  /* Logo */
  logo: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "6px",
    fontSize: "22px",
    fontWeight: "800",
    letterSpacing: "2px",
    marginBottom: "22px",
    color: "#f1fdf5",
  },

  logoMark: {
    width: "31px",
    height: "31px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
    background:
      "linear-gradient(135deg, #22c55e, #34d399)",
    color: "#031008",
    fontSize: "18px",
    fontWeight: "900",
    letterSpacing: "0",
    boxShadow: "0 0 25px rgba(34,197,94,0.18)",
  },

  logoTech: {
    color: "#22c55e",
  },

  /* Badge */
  badge: {
    width: "fit-content",
    margin: "0 auto 20px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "7px 11px",
    borderRadius: "50px",
    border: "1px solid rgba(34,197,94,0.18)",
    background: "rgba(34,197,94,0.05)",
    color: "#86efac",
    fontSize: "8px",
    fontWeight: "800",
    letterSpacing: "0.18em",
  },

  badgeDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#22c55e",
    boxShadow: "0 0 10px rgba(34,197,94,0.8)",
  },

  /* Heading */
  title: {
    textAlign: "center",
    fontSize: "34px",
    lineHeight: "1.1",
    letterSpacing: "-0.04em",
    margin: "0 0 10px",
    color: "#f1fdf5",
  },

  titleGreen: {
    color: "#22c55e",
  },

  subtitle: {
    textAlign: "center",
    color: "#81958a",
    margin: "0 0 30px",
    fontSize: "14px",
    lineHeight: "1.6",
  },

  /* Error */
  error: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    background: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.25)",
    color: "#fca5a5",
    padding: "12px",
    borderRadius: "9px",
    marginBottom: "20px",
    fontSize: "13px",
  },

  /* Labels */
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#8da197",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "0.15em",
  },

  /* Inputs */
  input: {
    width: "100%",
    boxSizing: "border-box",
    height: "52px",
    padding: "0 15px",
    marginBottom: "20px",
    borderRadius: "9px",
    border: "1px solid rgba(134,239,172,0.12)",
    background: "rgba(3,10,6,0.8)",
    color: "#ffffff",
    fontSize: "14px",
    outline: "none",
    transition: "0.25s ease",
  },

  /* Button */
  button: {
    width: "100%",
    minHeight: "54px",
    padding: "14px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background:
      "linear-gradient(100deg, #22c55e, #34d399)",
    color: "#031008",
    border: "none",
    borderRadius: "9px",
    fontSize: "15px",
    fontWeight: "800",
    transition: "0.3s ease",
  },

  bottomText: {
    textAlign: "center",
    color: "#718579",
    marginTop: "25px",
    marginBottom: "0",
    fontSize: "13px",
  },

  link: {
    color: "#34d399",
    textDecoration: "none",
    fontWeight: "700",
  },

  backButton: {
    display: "block",
    margin: "18px auto 0",
    padding: "5px",
    background: "transparent",
    border: "none",
    color: "#718579",
    cursor: "pointer",
    fontSize: "13px",
    width: "auto",
    minHeight: "auto",
  },
};

export default Login;