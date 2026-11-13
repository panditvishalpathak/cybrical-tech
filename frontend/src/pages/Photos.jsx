import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { getApiUrl, getAssetUrl } from "../config/api";
import "./Photos.css";

import team1 from "../assets/images/team/team-1.jpeg";
import team2 from "../assets/images/team/team-2.jpeg";
import team3 from "../assets/images/team/team-3.jpeg";

const DEFAULT_PHOTOS = [
  {
    _id: "670000000000000000000001",
    id: "01",
    image: team1,
    publicPath: "/images/team/team-1.jpeg",
    fallback: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80",
    title: "Our Team at Work",
    description: "Collaboration, creativity and technology working together.",
    isDefault: true,
  },
  {
    _id: "670000000000000000000002",
    id: "02",
    image: team2,
    publicPath: "/images/team/team-2.jpeg",
    fallback: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&auto=format&fit=crop&q=80",
    title: "Team Spirit",
    description: "Great ideas become stronger when we build them together.",
    isDefault: true,
  },
  {
    _id: "670000000000000000000003",
    id: "03",
    image: team3,
    publicPath: "/images/team/team-3.jpeg",
    fallback: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&auto=format&fit=crop&q=80",
    title: "Our Team Family",
    description: "Celebrating people, teamwork and memorable moments.",
    isDefault: true,
  },
];

const LOCAL_STORAGE_KEY = "cybrical_uploaded_photos";

function Photos() {
  const [photos, setPhotos] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge unique with DEFAULT_PHOTOS
          const defaults = [...DEFAULT_PHOTOS];
          parsed.forEach((p) => {
            if (!defaults.some((d) => d._id === p._id || d.id === p.id)) {
              defaults.push(p);
            }
          });
          return defaults;
        }
      }
    } catch (e) {
      // ignore
    }
    return DEFAULT_PHOTOS;
  });

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Upload Form State
  const [uploadMode, setUploadMode] = useState("file"); // "file" | "url"
  const [photoTitle, setPhotoTitle] = useState("");
  const [photoDesc, setPhotoDesc] = useState("");
  const [photoUrlInput, setPhotoUrlInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [formError, setFormError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const fileInputRef = useRef(null);

  // Fetch photos from backend
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await axios.get(getApiUrl("/api/photos")).catch(() => null);
        if (res?.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const backendPhotos = res.data.data.map((p, idx) => {
            // Match with default bundled imports if applicable
            let img = p.image;
            if (p.id === "01" || p.image?.includes("team-1.jpeg")) img = team1;
            if (p.id === "02" || p.image?.includes("team-2.jpeg")) img = team2;
            if (p.id === "03" || p.image?.includes("team-3.jpeg")) img = team3;

            return {
              ...p,
              image: img,
            };
          });

          setPhotos(backendPhotos);

          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(backendPhotos));
          } catch (e) {
            // ignore
          }
        }
      } catch (err) {
        console.error("Photos fetch error:", err);
      }
    };

    fetchPhotos();
  }, []);

  // Show Toast
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 4000);
  };

  // Handle File selection
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Please select a valid image file (JPEG, PNG, WEBP, etc.)");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setFormError("File size exceeds 25 MB limit.");
      return;
    }

    setFormError("");
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle Drag & Drop
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        setFormError("");
        const reader = new FileReader();
        reader.onload = (event) => {
          setPreviewUrl(event.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setFormError("Please drop an image file.");
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Close upload modal
  const handleCloseModal = () => {
    setIsUploadOpen(false);
    setPhotoTitle("");
    setPhotoDesc("");
    setPhotoUrlInput("");
    setSelectedFile(null);
    setPreviewUrl("");
    setFormError("");
  };

  // Handle Submit Upload
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const trimmedTitle = photoTitle.trim();
    if (!trimmedTitle) {
      setFormError("Please provide a title for the photo.");
      return;
    }

    if (uploadMode === "file" && !selectedFile && !previewUrl) {
      setFormError("Please choose an image file from your device.");
      return;
    }

    if (uploadMode === "url" && !photoUrlInput.trim()) {
      setFormError("Please enter an image URL.");
      return;
    }

    setIsUploading(true);

    try {
      let newPhoto = null;

      // 1. If uploading file to backend
      if (uploadMode === "file" && selectedFile) {
        const formData = new FormData();
        formData.append("title", trimmedTitle);
        formData.append("description", photoDesc.trim());
        formData.append("image", selectedFile);

        const res = await axios.post(getApiUrl("/api/photos"), formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data?.success && res.data.data) {
          newPhoto = res.data.data;
        }
      } else {
        // 2. If submitting URL
        const targetUrl = (photoUrlInput.trim() || previewUrl);
        const res = await axios.post(getApiUrl("/api/photos"), {
          title: trimmedTitle,
          description: photoDesc.trim(),
          image: targetUrl,
        });

        if (res.data?.success && res.data.data) {
          newPhoto = res.data.data;
        }
      }

      // Fallback local creation if backend couldn't connect
      if (!newPhoto) {
        const nextId = photos.length + 1;
        newPhoto = {
          _id: "photo-" + Date.now(),
          id: nextId < 10 ? `0${nextId}` : `${nextId}`,
          title: trimmedTitle,
          description: photoDesc.trim(),
          image: previewUrl || photoUrlInput.trim(),
          publicPath: previewUrl || photoUrlInput.trim(),
          fallback: previewUrl || photoUrlInput.trim(),
          createdAt: new Date().toISOString(),
        };
      }

      const updatedList = [newPhoto, ...photos];
      setPhotos(updatedList);

      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
      } catch (err) {
        // ignore
      }

      showToast(`Photo "${trimmedTitle}" uploaded successfully! 📸`);
      handleCloseModal();
    } catch (err) {
      console.error("Upload error:", err);
      // Even if network fails, add locally so user never loses work!
      const nextId = photos.length + 1;
      const localPhoto = {
        _id: "photo-" + Date.now(),
        id: nextId < 10 ? `0${nextId}` : `${nextId}`,
        title: trimmedTitle,
        description: photoDesc.trim(),
        image: previewUrl || photoUrlInput.trim(),
        publicPath: previewUrl || photoUrlInput.trim(),
        fallback: previewUrl || photoUrlInput.trim(),
        createdAt: new Date().toISOString(),
      };

      const updatedList = [localPhoto, ...photos];
      setPhotos(updatedList);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
      } catch (e) {}

      showToast(`Photo added locally to gallery! ✅`);
      handleCloseModal();
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Delete Photo
  const handleDeletePhoto = async (e, photo) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to remove "${photo.title}"?`)) return;

    try {
      const photoId = photo._id || photo.id;
      await axios.delete(getApiUrl(`/api/photos/${photoId}`)).catch(() => null);

      const filtered = photos.filter((p) => (p._id || p.id) !== photoId);
      setPhotos(filtered);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
      } catch (err) {}

      showToast(`Photo removed successfully.`);
      if (selectedPhoto && (selectedPhoto._id === photo._id || selectedPhoto.id === photo.id)) {
        setSelectedPhoto(null);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete photo");
    }
  };

  // Resolve image display URL
  const getDisplayImage = (photo) => {
    if (!photo) return "";
    if (typeof photo.image === "string") {
      if (photo.image.startsWith("data:") || photo.image.startsWith("blob:")) {
        return photo.image;
      }
      return getAssetUrl(photo.image);
    }
    return photo.image;
  };

  return (
    <main className="photos-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="photos-toast">
          <span>✅</span>
          <p>{toastMessage}</p>
        </div>
      )}

      {/* =========================
          HERO
      ========================= */}
      <section className="photos-hero">
        <div className="photos-hero-glow glow-one"></div>
        <div className="photos-hero-glow glow-two"></div>
        <div className="photos-hero-grid"></div>

        <div className="photos-container photos-hero-content">
          <div className="photos-eyebrow">
            <span className="eyebrow-dot"></span>
            CYBRICAL TECH
            <span className="eyebrow-line"></span>
            OUR TEAM & GALLERY
          </div>

          <h1>
            The people behind
            <br />
            <span>the technology.</span>
          </h1>

          <p>
            Meet the passionate people behind Cybrical Tech. We combine technology,
            creativity and teamwork to build meaningful digital experiences.
          </p>

          <div className="photos-hero-actions">
            <a href="#team-gallery" className="photos-primary-btn">
              Explore Our Team <span>↓</span>
            </a>

            <button
              type="button"
              className="photos-hero-upload-btn"
              onClick={() => setIsUploadOpen(true)}
              title="Upload a new photo"
            >
              <span>📸</span> Upload Photo
            </button>

            <div className="photos-mini-stat">
              <strong>{photos.length < 10 ? `0${photos.length}` : photos.length}</strong>
              <span>Team Moments</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          GALLERY
      ========================= */}
      <section className="team-gallery" id="team-gallery">
        <div className="photos-container">
          <div className="gallery-heading">
            <div>
              <span className="section-label">COMPANY GALLERY</span>
              <h2>
                Inside <span>Cybrical Tech.</span>
              </h2>
            </div>

            <div className="gallery-heading-right">
              <p>
                A glimpse into our workplace, our people and the moments that make
                our team special.
              </p>
              <button
                type="button"
                className="gallery-upload-trigger-btn"
                onClick={() => setIsUploadOpen(true)}
              >
                <span>+</span> Upload Photo
              </button>
            </div>
          </div>

          <div className="team-gallery-grid">
            {photos.map((photo, index) => {
              const displaySrc = getDisplayImage(photo);

              return (
                <article
                  className={`team-card ${index === 0 ? "team-card-featured" : ""}`}
                  key={photo._id || photo.id || index}
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <div className="team-card-image">
                    <img
                      src={displaySrc}
                      alt={photo.title}
                      loading="lazy"
                      onError={(e) => {
                        if (!e.target.dataset.triedPublic && photo.publicPath) {
                          e.target.dataset.triedPublic = "true";
                          e.target.src = getAssetUrl(photo.publicPath);
                        } else if (photo.fallback && e.target.src !== photo.fallback) {
                          e.target.src = photo.fallback;
                        }
                      }}
                    />

                    <div className="team-card-gradient"></div>

                    <div className="team-card-number">
                      {photo.id || (index < 9 ? `0${index + 1}` : `${index + 1}`)}
                    </div>

                    {/* Delete Action Button */}
                    <button
                      type="button"
                      className="team-card-delete-action"
                      onClick={(e) => handleDeletePhoto(e, photo)}
                      title="Delete this photo"
                      aria-label="Delete photo"
                    >
                      🗑
                    </button>

                    <button
                      type="button"
                      className="team-view-button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedPhoto(photo);
                      }}
                      aria-label={`View ${photo.title}`}
                    >
                      <span>↗</span>
                    </button>
                  </div>

                  <div className="team-card-content">
                    <div className="team-card-title-row">
                      <div>
                        <span className="team-card-label">TEAM MOMENT</span>
                        <h3>{photo.title}</h3>
                      </div>

                      <span className="team-card-arrow">↗</span>
                    </div>

                    <p>{photo.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================
          TEAM MESSAGE
      ========================= */}
      <section className="team-message">
        <div className="team-message-glow"></div>

        <div className="photos-container">
          <div className="team-message-box">
            <div className="message-icon">✦</div>

            <div className="message-content">
              <span>MORE THAN JUST A TEAM</span>
              <h2>
                We build together.
                <br />
                <strong>We grow together.</strong>
              </h2>
              <p>
                At Cybrical Tech, every idea starts with people. Our team brings
                different skills, perspectives and experiences together to create
                technology that makes a difference.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          LIGHTBOX MODAL
      ========================= */}
      {selectedPhoto && (
        <div className="photo-lightbox" onClick={() => setSelectedPhoto(null)}>
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setSelectedPhoto(null)}
            aria-label="Close image"
          >
            ×
          </button>

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={getDisplayImage(selectedPhoto)}
              alt={selectedPhoto.title}
              onError={(e) => {
                if (!e.target.dataset.triedPublic && selectedPhoto.publicPath) {
                  e.target.dataset.triedPublic = "true";
                  e.target.src = getAssetUrl(selectedPhoto.publicPath);
                } else if (selectedPhoto.fallback && e.target.src !== selectedPhoto.fallback) {
                  e.target.src = selectedPhoto.fallback;
                }
              }}
            />

            <div className="lightbox-caption">
              <span>{selectedPhoto.id || "01"} / CYBRICAL TECH</span>
              <h3>{selectedPhoto.title}</h3>
              {selectedPhoto.description && <p>{selectedPhoto.description}</p>}
            </div>
          </div>
        </div>
      )}

      {/* =========================
          UPLOAD PHOTO MODAL
      ========================= */}
      {isUploadOpen && (
        <div className="photo-upload-overlay" onClick={handleCloseModal}>
          <div
            className="photo-upload-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="upload-modal-header">
              <div className="upload-modal-title-box">
                <span className="upload-eyebrow">✦ CYBRICAL TECH GALLERY ✦</span>
                <h2>Upload New Photo</h2>
                <p>Add a high-resolution team photo or event moment to the gallery.</p>
              </div>
              <button
                type="button"
                className="upload-modal-close"
                onClick={handleCloseModal}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            {formError && (
              <div className="upload-modal-error">
                <span>⚠️</span> {formError}
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="upload-modal-form">
              {/* Upload Mode Selector */}
              <div className="upload-mode-toggle">
                <button
                  type="button"
                  className={`mode-btn ${uploadMode === "file" ? "active" : ""}`}
                  onClick={() => {
                    setUploadMode("file");
                    setFormError("");
                  }}
                >
                  📁 Upload from Device
                </button>
                <button
                  type="button"
                  className={`mode-btn ${uploadMode === "url" ? "active" : ""}`}
                  onClick={() => {
                    setUploadMode("url");
                    setFormError("");
                  }}
                >
                  🔗 Image URL / Link
                </button>
              </div>

              {/* File Dropzone */}
              {uploadMode === "file" ? (
                <div
                  className={`upload-dropzone ${previewUrl ? "has-preview" : ""}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />

                  {previewUrl ? (
                    <div className="dropzone-preview-box">
                      <img src={previewUrl} alt="Preview" className="dropzone-img" />
                      <div className="dropzone-change-overlay">
                        <span>🔄 Click to change photo</span>
                      </div>
                    </div>
                  ) : (
                    <div className="dropzone-empty-content">
                      <span className="dropzone-icon">📷</span>
                      <strong>Choose a photo from your computer or phone</strong>
                      <p>Click to browse or drag & drop (JPG, PNG, WEBP, GIF)</p>
                      <span className="dropzone-badge">Max size: 25 MB</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="upload-form-group">
                  <label htmlFor="photo-url-input">Direct Image Link / URL *</label>
                  <input
                    id="photo-url-input"
                    type="url"
                    className="upload-input"
                    placeholder="https://images.unsplash.com/... or Google Drive Image URL"
                    value={photoUrlInput}
                    onChange={(e) => {
                      setPhotoUrlInput(e.target.value);
                      setPreviewUrl(e.target.value);
                    }}
                  />
                  {photoUrlInput && (
                    <div className="url-preview-wrapper">
                      <img
                        src={photoUrlInput}
                        alt="URL Preview"
                        className="url-preview-img"
                        onError={() => setFormError("Could not load preview from this URL.")}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Title Input */}
              <div className="upload-form-group">
                <label htmlFor="photo-title-input">Photo Title *</label>
                <input
                  id="photo-title-input"
                  type="text"
                  className="upload-input"
                  placeholder="e.g., Annual Team Meetup & Tech Showcase"
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  required
                />
              </div>

              {/* Description Input */}
              <div className="upload-form-group">
                <label htmlFor="photo-desc-input">Description / Caption (Optional)</label>
                <textarea
                  id="photo-desc-input"
                  className="upload-textarea"
                  rows="3"
                  placeholder="Write a brief caption or moment description..."
                  value={photoDesc}
                  onChange={(e) => setPhotoDesc(e.target.value)}
                />
              </div>

              {/* Modal Actions */}
              <div className="upload-modal-actions">
                <button
                  type="button"
                  className="upload-cancel-btn"
                  onClick={handleCloseModal}
                  disabled={isUploading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="upload-submit-btn"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <span className="upload-spinner"></span> Uploading...
                    </>
                  ) : (
                    <>
                      <span>🚀</span> Publish Photo to Gallery
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default Photos;