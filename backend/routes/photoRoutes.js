const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const Photo = require("../models/Photo");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../uploads/photos");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const basename = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    cb(null, `${Date.now()}_${basename}${ext}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30 MB
  fileFilter: function (req, file, cb) {
    const allowed = /jpeg|jpg|png|webp|gif|svg/;
    const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
    const mime = file.mimetype.toLowerCase();
    if (allowed.test(ext) || mime.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

// JSON file store path
const jsonStorePath = path.join(__dirname, "../data/photos_store.json");

function readJsonPhotos() {
  try {
    if (fs.existsSync(jsonStorePath)) {
      const raw = fs.readFileSync(jsonStorePath, "utf-8");
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Error reading photos_store.json:", e);
  }
  return [];
}

function writeJsonPhotos(photos) {
  try {
    const dataDir = path.dirname(jsonStorePath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(jsonStorePath, JSON.stringify(photos, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing photos_store.json:", e);
  }
}

// GET /api/photos
router.get("/", async (req, res) => {
  try {
    let photos = [];
    if (mongoose.connection.readyState === 1) {
      photos = await Photo.find().sort({ createdAt: -1 }).lean();
    }
    if (!photos || photos.length === 0) {
      photos = readJsonPhotos();
    }
    res.json({
      success: true,
      data: photos,
    });
  } catch (err) {
    console.error("GET /api/photos error:", err);
    const fallback = readJsonPhotos();
    res.json({
      success: true,
      data: fallback,
    });
  }
});

// POST /api/photos
router.post("/", upload.any(), async (req, res) => {
  try {
    const title = (req.body.title || "").trim();
    const description = (req.body.description || "").trim();

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required for the photo.",
      });
    }

    let imageUrl = "";
    if (req.files && req.files.length > 0) {
      const file = req.files[0];
      imageUrl = `/uploads/photos/${file.filename}`;
    } else if (req.body.image && req.body.image.trim()) {
      imageUrl = req.body.image.trim();
    } else if (req.body.imageUrl && req.body.imageUrl.trim()) {
      imageUrl = req.body.imageUrl.trim();
    }

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Please select an image file or provide an image URL.",
      });
    }

    const currentJson = readJsonPhotos();
    const nextIdNum = currentJson.length + 1;
    const formattedId = nextIdNum < 10 ? `0${nextIdNum}` : `${nextIdNum}`;

    const newPhotoData = {
      id: formattedId,
      title: title,
      description: description,
      image: imageUrl,
      publicPath: imageUrl,
      fallback: imageUrl,
      createdAt: new Date().toISOString(),
    };

    let savedPhoto = null;
    if (mongoose.connection.readyState === 1) {
      try {
        const photoDoc = new Photo(newPhotoData);
        savedPhoto = await photoDoc.save();
        newPhotoData._id = savedPhoto._id.toString();
      } catch (dbErr) {
        console.error("DB Photo save fallback to JSON:", dbErr);
        newPhotoData._id = "photo-" + Date.now();
      }
    } else {
      newPhotoData._id = "photo-" + Date.now();
    }

    // Persist in JSON file
    currentJson.unshift(newPhotoData);
    writeJsonPhotos(currentJson);

    return res.status(201).json({
      success: true,
      message: "Photo uploaded and saved successfully!",
      data: newPhotoData,
    });
  } catch (err) {
    console.error("POST /api/photos error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to upload photo",
    });
  }
});

// DELETE /api/photos/:id
router.delete("/:id", async (req, res) => {
  try {
    const targetId = req.params.id;
    let deletedUrl = null;

    if (mongoose.connection.readyState === 1) {
      try {
        const doc = await Photo.findById(targetId);
        if (doc) {
          deletedUrl = doc.image;
          await Photo.findByIdAndDelete(targetId);
        }
      } catch (e) {
        // ignore
      }
    }

    const currentJson = readJsonPhotos();
    const filtered = currentJson.filter((p) => {
      const match = (p._id && p._id.toString() === targetId) || (p.id && p.id === targetId);
      if (match && !deletedUrl) {
        deletedUrl = p.image;
      }
      return !match;
    });

    writeJsonPhotos(filtered);

    // Delete local file if in /uploads/photos/
    if (deletedUrl && deletedUrl.startsWith("/uploads/photos/")) {
      const filename = path.basename(deletedUrl);
      const filePath = path.join(uploadDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    return res.json({
      success: true,
      message: "Photo deleted successfully",
    });
  } catch (err) {
    console.error("DELETE /api/photos/:id error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to delete photo",
    });
  }
});

module.exports = router;
