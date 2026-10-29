import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getApiUrl } from "../config/api";
import "./AdminCourses.css";

const ADMIN_DEFAULT_COURSES = [
  {
    _id: "660 000000000000000000001",
    title: "Web Development",
    slug: "web-development",
    description: "Complete Full-Stack Web Development: HTML, CSS, JavaScript, React, Node.js & Full Project Source Code ZIPs for each lesson.",
    category: "Web Development",
    level: "Beginner to Advanced",
    duration: "12 Weeks",
    price: 0,
    isPublished: true,
    modules: [
      { title: "Module 1: HTML5 & Modern Responsive CSS", lessons: [{}, {}, {}] },
      { title: "Module 2: JavaScript DOM & Interactive Applications", lessons: [{}, {}, {}] },
      { title: "Module 3: React.js & Modern Frontend Architecture", lessons: [{}, {}, {}] },
      { title: "Module 4: Full-Stack Backend, Database & Deployment", lessons: [{}, {}, {}] },
    ],
  },
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
    modules: [{ title: "Module 1", lessons: [{}, {}] }],
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
    modules: [{ title: "Module 1", lessons: [{}, {}] }],
  },
  {
    _id: "660000000000000000000004",
    title: "Artificial Intelligence (AI)",
    slug: "ai",
    description: "Master Modern Artificial Intelligence, Machine Learning, Deep Learning, Neural Networks, and Generative AI (LLMs & Agents). Upload and manage your project files and resources.",
    category: "Artificial Intelligence",
    level: "Beginner to Advanced",
    duration: "16 Weeks",
    price: 0,
    isPublished: true,
    modules: [],
  },
  {
    _id: "660000000000000000000005",
    title: "Android App Development",
    slug: "android",
    description: "Master Native Android App Development with Kotlin, Jetpack Compose, Android SDK, MVVM Architecture, Room Database, and REST APIs.",
    category: "Mobile Development",
    level: "Beginner to Advanced",
    duration: "14 Weeks",
    price: 0,
    isPublished: true,
    modules: [
      { title: "Module 1", lessons: [{}, {}] },
      { title: "Module 2", lessons: [{}, {}] },
      { title: "Module 3", lessons: [{}, {}] },
      { title: "Module 4", lessons: [{}, {}] },
    ],
  },
];

function AdminCourses() {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    category: "",
    level: "Beginner",
    duration: "",
    thumbnail: "",
    price: 0,
    isPublished: true,
  });

  const [coursesList, setCoursesList] = useState(ADMIN_DEFAULT_COURSES);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Edit Course Modal State
  const [editingCourse, setEditingCourse] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    slug: "",
    description: "",
    category: "",
    level: "Beginner",
    duration: "",
    thumbnail: "",
    price: 0,
    isPublished: true,
  });
  const [updating, setUpdating] = useState(false);

  const loadCourses = async () => {
    try {
      const response = await fetch(getApiUrl("/api/courses"));
      const data = await response.json();
      if (data.success && data.courses && data.courses.length > 0) {
        setCoursesList(data.courses);
      } else {
        setCoursesList(ADMIN_DEFAULT_COURSES);
      }
    } catch (error) {
      console.error("Failed to load courses list:", error);
      setCoursesList(ADMIN_DEFAULT_COURSES);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "title" && (!prev.slug || prev.slug === prev.title.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))) {
        const generatedSlug = value
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
          .replace(/-+/g, "-");
        updated.slug = generatedSlug;
      }

      return updated;
    });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ==========================================
  // CREATE COURSE (POST)
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(getApiUrl("/api/courses"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price) || 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Course creation failed");
      }

      setMessage("✅ Course successfully created! You can now upload lessons below.");

      setFormData({
        title: "",
        slug: "",
        description: "",
        category: "",
        level: "Beginner",
        duration: "",
        thumbnail: "",
        price: 0,
        isPublished: true,
      });

      loadCourses();
    } catch (error) {
      if (error.message === "Failed to fetch" || error.message.includes("NetworkError")) {
        setMessage("❌ Backend server se connect nahi ho pa raha hai. Make sure `npm start` is running in backend folder on port 5000.");
      } else {
        setMessage(`❌ ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================
  const openEditModal = (course) => {
    setEditingCourse(course);
    setEditFormData({
      title: course.title || "",
      slug: course.slug || "",
      description: course.description || "",
      category: course.category || "",
      level: course.level || "Beginner",
      duration: course.duration || "",
      thumbnail: course.thumbnail || "",
      price: course.price || 0,
      isPublished: Boolean(course.isPublished),
    });
    setMessage("");
  };

  const closeEditModal = () => {
    setEditingCourse(null);
  };

  // ==========================================
  // UPDATE COURSE (PUT)
  // ==========================================
  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    if (!editingCourse) return;

    setUpdating(true);
    setMessage("");

    try {
      const response = await fetch(getApiUrl(`/api/courses/${editingCourse._id}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editFormData,
          price: Number(editFormData.price) || 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Update course failed");
      }

      setMessage(`✅ Course "${editFormData.title}" updated successfully!`);
      setEditingCourse(null);
      loadCourses();
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  // ==========================================
  // QUICK TOGGLE PUBLISH STATUS
  // ==========================================
  const handleTogglePublish = async (course) => {
    try {
      const updatedStatus = !course.isPublished;
      const response = await fetch(getApiUrl(`/api/courses/${course._id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: updatedStatus }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setMessage(`✅ Course "${course.title}" is now ${updatedStatus ? "Published (Live)" : "Draft (Hidden)"}.`);
      loadCourses();
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  // ==========================================
  // DELETE COURSE (DELETE)
  // ==========================================
  const handleDeleteCourse = async (courseId, courseTitle) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete course "${courseTitle}"? This will delete all its modules and lessons.`
    );
    if (!confirmed) return;

    try {
      const response = await fetch(getApiUrl(`/api/courses/${courseId}`), {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete course");
      }

      setMessage(`✅ Course "${courseTitle}" deleted successfully.`);
      loadCourses();
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  return (
    <div className="admin-course-page">
      <div className="admin-course-container">

        <div className="admin-course-header">
          <span>LMS ADMIN</span>
          <h1>Course Management</h1>
          <p>Create, manage, edit, and delete video courses and curriculum lessons.</p>
        </div>

        {message && (
          <div className="admin-course-message">
            {message}
          </div>
        )}

        {/* CREATE COURSE FORM */}
        <form
          className="admin-course-form"
          onSubmit={handleSubmit}
        >
          <h2 style={{ fontSize: "20px", marginBottom: "20px", color: "#4ade80", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>➕</span> Create New Course
          </h2>

          <div className="form-group">
            <label>Course Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Full Stack Web Development"
              required
            />
          </div>

          <div className="form-group">
            <label>Course Slug (URL identifier) *</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="e.g. web-development"
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter course overview..."
              rows="3"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Web Development"
              />
            </div>

            <div className="form-group">
              <label>Level</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 12 Weeks / 40 Hours"
              />
            </div>

            <div className="form-group">
              <label>Price (₹ / $)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                placeholder="0 for Free"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Thumbnail Image URL</label>
            <input
              type="text"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <label className="publish-checkbox">
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
            />
            <span>Publish immediately</span>
          </label>

          <button
            type="submit"
            className="admin-course-submit"
            disabled={loading}
          >
            {loading ? "Creating Course..." : "➕ Create Course →"}
          </button>
        </form>

        {/* EXISTING COURSES */}
        <div className="admin-courses-list-section" style={{ marginTop: "50px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h2 style={{ fontSize: "24px", margin: "0 0 6px 0", color: "#f0fdf4" }}>
                All Courses ({coursesList.length})
              </h2>
              <p style={{ color: "#8da096", margin: 0, fontSize: "14px" }}>
                Manage modules, upload video lectures, or edit course information.
              </p>
            </div>
            <button
              onClick={loadCourses}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#e2e8f0",
                padding: "8px 14px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              🔄 Refresh List
            </button>
          </div>

          {coursesList.length === 0 ? (
            <div style={{ padding: "30px", background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.15)", borderRadius: "14px", color: "#8da096", textAlign: "center" }}>
              No courses found. Create your first course above!
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {coursesList.map((c) => {
                const totalLessons = (c.modules || []).reduce(
                  (acc, m) => acc + (m.lessons || []).length,
                  0
                );
                return (
                  <div
                    key={c._id}
                    className="admin-course-card-item"
                  >
                    <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", flex: 1, minWidth: "260px" }}>
                      {c.thumbnail && (
                        <img
                          src={c.thumbnail}
                          alt={c.title}
                          style={{ width: "70px", height: "50px", objectFit: "cover", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }}
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      )}
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "6px" }}>
                          <h3 style={{ margin: 0, fontSize: "18px", color: "#f0fdf4" }}>
                            {c.title}
                          </h3>
                          <button
                            onClick={() => handleTogglePublish(c)}
                            className={`status-badge ${c.isPublished ? "published" : "draft"}`}
                          >
                            {c.isPublished ? "● Live (Published)" : "○ Draft (Hidden)"}
                          </button>
                        </div>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", color: "#8da096", fontSize: "13px" }}>
                          <span>📁 Slug: <code>{c.slug}</code></span>
                          <span>🏷 {c.category || "General"}</span>
                          <span>📶 {c.level}</span>
                          <span>⏱ {c.duration || "N/A"}</span>
                          <span>💰 {c.price === 0 ? "Free" : `₹${c.price}`}</span>
                          <span>📑 {c.modules ? c.modules.length : 0} Modules</span>
                          <span>🎬 {totalLessons} Lessons</span>
                        </div>
                      </div>
                    </div>

                    <div className="course-action-buttons">
                      <Link
                        to={`/admin/courses/${c._id}/content`}
                        className="btn-action-content"
                      >
                        🎬 Manage Lessons & Videos
                      </Link>

                      <button
                        onClick={() => openEditModal(c)}
                        className="btn-action-edit"
                      >
                        ✏️ Edit
                      </button>

                      <Link
                        to={`/courses/${c.slug}`}
                        target="_blank"
                        className="btn-action-view"
                      >
                        👁 View
                      </Link>

                      <button
                        onClick={() => handleDeleteCourse(c._id, c.title)}
                        className="btn-action-delete"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* EDIT MODAL */}
        {editingCourse && (
          <div className="admin-modal-backdrop" onClick={closeEditModal}>
            <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <h2>✏️ Edit Course: {editingCourse.title}</h2>
                <button className="admin-modal-close" onClick={closeEditModal}>✕</button>
              </div>

              <form onSubmit={handleUpdateCourse} className="admin-modal-form">
                <div className="form-group">
                  <label>Course Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={editFormData.title}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Course Slug *</label>
                  <input
                    type="text"
                    name="slug"
                    value={editFormData.slug}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditChange}
                    rows="3"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <input
                      type="text"
                      name="category"
                      value={editFormData.category}
                      onChange={handleEditChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Level</label>
                    <select
                      name="level"
                      value={editFormData.level}
                      onChange={handleEditChange}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Duration</label>
                    <input
                      type="text"
                      name="duration"
                      value={editFormData.duration}
                      onChange={handleEditChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Price (₹ / $)</label>
                    <input
                      type="number"
                      name="price"
                      value={editFormData.price}
                      onChange={handleEditChange}
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Thumbnail URL</label>
                  <input
                    type="text"
                    name="thumbnail"
                    value={editFormData.thumbnail}
                    onChange={handleEditChange}
                  />
                </div>

                <label className="publish-checkbox">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={editFormData.isPublished}
                    onChange={handleEditChange}
                  />
                  <span>Published (Visible on website)</span>
                </label>

                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="modal-cancel-btn"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="modal-save-btn"
                  >
                    {updating ? "Saving Changes..." : "💾 Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminCourses;