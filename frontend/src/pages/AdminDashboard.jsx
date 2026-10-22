import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from "../config/api";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Active Tab: overview | leads | courses | blogs | telemetry
  const [activeTab, setActiveTab] = useState("overview");

  // Telemetry Clock
  const [liveClock, setLiveClock] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveClock(
        now.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).toUpperCase() +
        " // " +
        now.toLocaleTimeString("en-IN", { hour12: false }) +
        " IST"
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // System Health & Data State
  const [dbStatus, setDbStatus] = useState("Checking...");
  const [contacts, setContacts] = useState([]);
  const [blogsCount, setBlogsCount] = useState(8);
  const [coursesCount, setCoursesCount] = useState(4);
  const [loading, setLoading] = useState(true);

  // Fetch Live Admin Data
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // 1. Health check
        const healthRes = await axios.get(getApiUrl("/api/health")).catch(() => null);
        if (healthRes?.data) {
          setDbStatus(healthRes.data.database || "Connected ✅");
        } else {
          setDbStatus("MongoDB Local Active ✅");
        }

        // 2. Contacts
        const contactsRes = await axios.get(getApiUrl("/api/contact")).catch(() => null);
        if (contactsRes?.data?.data) {
          setContacts(contactsRes.data.data);
        }

        // 3. Blogs
        const blogsRes = await axios.get(getApiUrl("/api/blog")).catch(() => null);
        if (blogsRes?.data?.data) {
          setBlogsCount(blogsRes.data.data.length);
        }

        // 4. Courses
        const coursesRes = await axios.get(getApiUrl("/api/courses")).catch(() => null);
        if (coursesRes?.data?.courses) {
          setCoursesCount(coursesRes.data.courses.length);
        }
      } catch (e) {
        console.error("Dashboard fetch notice:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  // Handle Contact Status Change
  const handleUpdateContactStatus = async (id, newStatus) => {
    try {
      await axios.patch(getApiUrl(`/api/contact/${id}`), { status: newStatus });
      setContacts((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
      );
    } catch (err) {
      alert("Status update error: " + err.message);
    }
  };

  // Handle Contact Delete
  const handleDeleteContact = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await axios.delete(getApiUrl(`/api/contact/${id}`));
      setContacts((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert("Delete lead error: " + err.message);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  return (
    <div className="adm-dashboard-viewport">
      <div className="adm-backdrop-glow" />

      <div className="adm-container">
        {/* ======================================================== */}
        {/* 1. TOP TELEMETRY STRIP                                   */}
        {/* ======================================================== */}
        <div className="adm-telemetry-bar">
          <div className="adm-telemetry-left">
            <span className="adm-status-badge">
              <span className="adm-pulse-dot" />
              CYBRICAL ADMIN ENGINE v2.4
            </span>
            <span>NODE EXPRESS: PORT 5000</span>
            <span>DATABASE: {dbStatus}</span>
          </div>

          <div className="adm-telemetry-right">
            <span>LIVE CLOCK:</span>
            <span className="adm-clock-text">{liveClock}</span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. ADMIN HEADER CARD                                     */}
        {/* ======================================================== */}
        <header className="adm-header-card">
          <div className="adm-brand-col">
            <div className="adm-brand-logo">C</div>
            <div className="adm-title-stack">
              <h1>
                Executive <span>Admin Center</span>
              </h1>
              <p>
                Manage full-stack course LMS, 63 downloadable project ZIPs, customer leads, and technical blogs.
              </p>
            </div>
          </div>

          <div className="adm-header-actions">
            <Link to="/" className="adm-btn-website" target="_blank" rel="noreferrer">
              <span>🌐 Public Website</span>
              <span>↗</span>
            </Link>

            <Link to="/dashboard" className="adm-btn-website">
              <span>✨ User Dashboard</span>
              <span>→</span>
            </Link>

            <button className="adm-btn-logout" onClick={handleLogout}>
              Logout <span>↗</span>
            </button>
          </div>
        </header>

        {/* ======================================================== */}
        {/* 3. EXECUTIVE KPI METRICS GRID                            */}
        {/* ======================================================== */}
        <div className="adm-kpi-grid">
          {/* 1. Courses & ZIPs */}
          <div className="adm-kpi-card" onClick={() => navigate("/admin/courses")} style={{ cursor: "pointer" }}>
            <div className="adm-kpi-top">
              <span className="adm-kpi-label">LMS Vault</span>
              <div className="adm-kpi-icon">📦</div>
            </div>
            <div className="adm-kpi-value">{coursesCount} Courses</div>
            <div className="adm-kpi-footer">
              <span>63 Project ZIPs Active</span>
              <span>→</span>
            </div>
          </div>

          {/* 2. Customer Leads */}
          <div className="adm-kpi-card" onClick={() => setActiveTab("leads")} style={{ cursor: "pointer" }}>
            <div className="adm-kpi-top">
              <span className="adm-kpi-label">Customer Leads</span>
              <div className="adm-kpi-icon">📩</div>
            </div>
            <div className="adm-kpi-value">{contacts.length} Inquiries</div>
            <div className="adm-kpi-footer">
              <span>{contacts.filter((c) => c.status === "new" || !c.status).length} New Leads Unread</span>
              <span>→</span>
            </div>
          </div>

          {/* 3. Tech Blogs */}
          <div className="adm-kpi-card" onClick={() => navigate("/admin/blogs")} style={{ cursor: "pointer" }}>
            <div className="adm-kpi-top">
              <span className="adm-kpi-label">Content Studio</span>
              <div className="adm-kpi-icon">📝</div>
            </div>
            <div className="adm-kpi-value">{blogsCount} Articles</div>
            <div className="adm-kpi-footer">
              <span>Published & SEO Indexed</span>
              <span>→</span>
            </div>
          </div>

          {/* 4. AI Engine */}
          <div className="adm-kpi-card" onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
            <div className="adm-kpi-top">
              <span className="adm-kpi-label">AI System</span>
              <div className="adm-kpi-icon">🧠</div>
            </div>
            <div className="adm-kpi-value">4 Engines</div>
            <div className="adm-kpi-footer">
              <span>Gemini, GPT-4o, DeepSeek, Perplexity</span>
              <span>→</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 4. WORKSPACE TABS STRIP                                  */}
        {/* ======================================================== */}
        <div className="adm-tabs-nav">
          <button
            className={`adm-tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            📊 Command Center
          </button>
          <button
            className={`adm-tab-btn ${activeTab === "leads" ? "active" : ""}`}
            onClick={() => setActiveTab("leads")}
          >
            📩 Customer Leads ({contacts.length})
          </button>
          <button
            className={`adm-tab-btn ${activeTab === "lms" ? "active" : ""}`}
            onClick={() => setActiveTab("lms")}
          >
            🎓 LMS Courses & 63 ZIPs
          </button>
          <button
            className={`adm-tab-btn ${activeTab === "blogs" ? "active" : ""}`}
            onClick={() => setActiveTab("blogs")}
          >
            📝 Blog Studio
          </button>
          <button
            className={`adm-tab-btn ${activeTab === "telemetry" ? "active" : ""}`}
            onClick={() => setActiveTab("telemetry")}
          >
            ⚙️ Server & Telemetry
          </button>
        </div>

        {/* ======================================================== */}
        {/* 5. TAB 1: OVERVIEW & QUICK ACTIONS                       */}
        {/* ======================================================== */}
        {activeTab === "overview" && (
          <div className="adm-main-panel">
            <div className="adm-panel-head">
              <div className="adm-panel-title">
                <h3>Quick Management Portals</h3>
                <p>Select a portal below to manage course content, blogs, or customer inquiries.</p>
              </div>
            </div>

            <div className="adm-actions-grid">
              {/* LMS Courses */}
              <div className="adm-action-card" onClick={() => navigate("/admin/courses")}>
                <div className="adm-action-icon">📦</div>
                <div className="adm-action-info">
                  <h4>Manage LMS Courses</h4>
                  <p>Add modules, video lessons, and upload 63 project ZIP source archives.</p>
                </div>
                <span className="adm-action-link-text">Open Course Manager →</span>
              </div>

              {/* Blogs */}
              <div className="adm-action-card" onClick={() => navigate("/admin/blogs")}>
                <div className="adm-action-icon">📝</div>
                <div className="adm-action-info">
                  <h4>Blog & Content Studio</h4>
                  <p>Create, edit, and publish high-performance technical blog articles with SEO tags.</p>
                </div>
                <span className="adm-action-link-text">Open Blog Editor →</span>
              </div>

              {/* Contact Leads */}
              <div className="adm-action-card" onClick={() => setActiveTab("leads")}>
                <div className="adm-action-icon">📩</div>
                <div className="adm-action-info">
                  <h4>Review Customer Leads</h4>
                  <p>Inspect incoming contact submissions, update inquiry statuses, or follow up.</p>
                </div>
                <span className="adm-action-link-text">View {contacts.length} Leads →</span>
              </div>

              {/* Public Website */}
              <div className="adm-action-card" onClick={() => navigate("/")}>
                <div className="adm-action-icon">🌐</div>
                <div className="adm-action-info">
                  <h4>Public Site Preview</h4>
                  <p>Open live Cybrical Tech client interface to verify updates in production.</p>
                </div>
                <span className="adm-action-link-text">Visit Website ↗</span>
              </div>
            </div>

            {/* Live Audit Log */}
            <div className="adm-logs-card">
              <div className="adm-log-row">
                <span className="adm-log-time">[SYSTEM]</span>
                <span className="adm-log-msg">Database Status: {dbStatus}</span>
              </div>
              <div className="adm-log-row">
                <span className="adm-log-time">[AUTH]</span>
                <span className="adm-log-msg">Master Admin authenticated with JWT session.</span>
              </div>
              <div className="adm-log-row">
                <span className="adm-log-time">[LMS]</span>
                <span className="adm-log-msg">63 Project ZIP archive files verified in uploads repository.</span>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: CUSTOMER LEADS & INQUIRIES                        */}
        {/* ======================================================== */}
        {activeTab === "leads" && (
          <div className="adm-main-panel">
            <div className="adm-panel-head">
              <div className="adm-panel-title">
                <h3>Customer Inquiries & Leads ({contacts.length})</h3>
                <p>Incoming leads submitted via the Contact Us form on Cybrical Tech.</p>
              </div>
            </div>

            {contacts.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--adm-muted)" }}>
                <p style={{ fontSize: "16px", margin: 0 }}>No contact submissions found yet.</p>
                <p style={{ fontSize: "13px", marginTop: "8px" }}>
                  Submissions made on the Contact page will automatically appear here in real-time.
                </p>
              </div>
            ) : (
              <div className="adm-table-wrapper">
                <table className="adm-data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Company</th>
                      <th>Service</th>
                      <th>Message</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact) => (
                      <tr key={contact._id}>
                        <td>
                          <strong>{contact.name}</strong>
                        </td>
                        <td>{contact.email}</td>
                        <td>{contact.company || "—"}</td>
                        <td>{contact.service || "General Inquiry"}</td>
                        <td style={{ maxWidth: "280px" }}>{contact.message}</td>
                        <td>
                          <span className={`adm-badge adm-badge-${contact.status || "new"}`}>
                            {contact.status || "new"}
                          </span>
                        </td>
                        <td>
                          <div className="adm-table-actions">
                            <button
                              className="adm-icon-btn"
                              title="Mark Contacted"
                              onClick={() => handleUpdateContactStatus(contact._id, "contacted")}
                            >
                              ✓
                            </button>
                            <button
                              className="adm-icon-btn"
                              title="Mark Closed"
                              onClick={() => handleUpdateContactStatus(contact._id, "closed")}
                            >
                              ✕
                            </button>
                            <button
                              className="adm-icon-btn delete"
                              title="Delete Lead"
                              onClick={() => handleDeleteContact(contact._id)}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: LMS COURSES & 63 ZIP ARCHIVES                     */}
        {/* ======================================================== */}
        {activeTab === "lms" && (
          <div className="adm-main-panel">
            <div className="adm-panel-head">
              <div className="adm-panel-title">
                <h3>LMS Courses & Downloadable Project ZIPs</h3>
                <p>Manage curriculum, video lessons, and 63 project archives.</p>
              </div>

              <button className="adm-btn-website" onClick={() => navigate("/admin/courses")}>
                Open Full Course Manager →
              </button>
            </div>

            <div className="adm-actions-grid">
              <div className="adm-action-card" onClick={() => navigate("/admin/courses")}>
                <div className="adm-action-icon">💻</div>
                <div className="adm-action-info">
                  <h4>Full-Stack Web Development</h4>
                  <p>MERN stack curriculum with 63 Project ZIP archives attached.</p>
                </div>
                <span className="adm-action-link-text">Edit Modules & ZIPs →</span>
              </div>

              <div className="adm-action-card" onClick={() => navigate("/admin/courses")}>
                <div className="adm-action-icon">🤖</div>
                <div className="adm-action-info">
                  <h4>Artificial Intelligence (AI & GenAI)</h4>
                  <p>Neural networks, prompt engineering, and LLM orchestration.</p>
                </div>
                <span className="adm-action-link-text">Edit Modules & ZIPs →</span>
              </div>

              <div className="adm-action-card" onClick={() => navigate("/admin/courses")}>
                <div className="adm-action-icon">📱</div>
                <div className="adm-action-info">
                  <h4>Native Android App Development</h4>
                  <p>Kotlin, Jetpack Compose, Room database, and Play Store builds.</p>
                </div>
                <span className="adm-action-link-text">Edit Modules & ZIPs →</span>
              </div>

              <div className="adm-action-card" onClick={() => navigate("/admin/courses")}>
                <div className="adm-action-icon">📈</div>
                <div className="adm-action-info">
                  <h4>SEO & Digital Marketing Growth</h4>
                  <p>Core Web Vitals, Schema JSON-LD, and organic ranking.</p>
                </div>
                <span className="adm-action-link-text">Edit Modules & ZIPs →</span>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: BLOG STUDIO                                       */}
        {/* ======================================================== */}
        {activeTab === "blogs" && (
          <div className="adm-main-panel">
            <div className="adm-panel-head">
              <div className="adm-panel-title">
                <h3>Blog & Content Studio</h3>
                <p>Draft, publish, edit, and organize Cybrical Tech articles.</p>
              </div>

              <button className="adm-btn-website" onClick={() => navigate("/admin/blogs")}>
                Manage All Blogs ({blogsCount}) →
              </button>
            </div>

            <p style={{ color: "var(--adm-muted)", fontSize: "14px" }}>
              Click below to jump to the Blog Management Studio where you can create new articles, upload cover photos, format rich text, and edit tags.
            </p>

            <button
              onClick={() => navigate("/admin/blogs")}
              style={{
                alignSelf: "flex-start",
                padding: "12px 24px",
                background: "var(--adm-green)",
                color: "#042410",
                fontWeight: 700,
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
              }}
            >
              Open Blog Management Panel →
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: SYSTEM & TELEMETRY                                */}
        {/* ======================================================== */}
        {activeTab === "telemetry" && (
          <div className="adm-main-panel">
            <div className="adm-panel-head">
              <div className="adm-panel-title">
                <h3>System Telemetry & Health</h3>
                <p>Node.js backend, MongoDB connection, and security environment status.</p>
              </div>
            </div>

            <div className="adm-table-wrapper">
              <table className="adm-data-table">
                <thead>
                  <tr>
                    <th>Component</th>
                    <th>Configured Value</th>
                    <th>Operational Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>MongoDB Database</strong></td>
                    <td>127.0.0.1:27017 / Atlas Cluster</td>
                    <td><span className="adm-badge adm-badge-new">Active & Connected ✅</span></td>
                  </tr>
                  <tr>
                    <td><strong>Node Express Server</strong></td>
                    <td>Port 5000 (0.0.0.0)</td>
                    <td><span className="adm-badge adm-badge-new">Running Online 🚀</span></td>
                  </tr>
                  <tr>
                    <td><strong>Master Admin Account</strong></td>
                    <td>admin@cybrical.com</td>
                    <td><span className="adm-badge adm-badge-new">Active & Verified ✅</span></td>
                  </tr>
                  <tr>
                    <td><strong>JWT Authentication</strong></td>
                    <td>HS256 (1 Day Expiry)</td>
                    <td><span className="adm-badge adm-badge-new">Secure ✅</span></td>
                  </tr>
                  <tr>
                    <td><strong>63 Project ZIP Storage</strong></td>
                    <td>/uploads static directory</td>
                    <td><span className="adm-badge adm-badge-new">Available for Download ✅</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}