const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

dotenv.config();

const contactRoutes = require("./routes/contactRoutes");
const blogRoutes = require("./routes/blogRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const aiRoutes = require("./routes/aiRoutes");
const courseRoutes = require("./routes/courseRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

/* =========================
   MIDDLEWARE & CORS
========================= */

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, filePath) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
      const ext = path.extname(filePath).toLowerCase();
      if (ext === ".zip" || ext === ".rar" || ext === ".7z" || ext === ".tar" || ext === ".gz") {
        const basename = path.basename(filePath);
        res.setHeader("Content-Disposition", `attachment; filename="${basename}"`);
        res.setHeader("Content-Type", "application/zip");
      }
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   API ROUTES
========================= */

app.use("/api/contact", contactRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/courses", courseRoutes);

/* =========================
   SERVE FRONTEND STATIC FILES
========================= */

const publicPath = path.join(__dirname, "public");
if (fs.existsSync(publicPath)) {
  app.use(
    express.static(publicPath, {
      maxAge: "1d",
      setHeaders: (res, filePath) => {
        // Never cache index.html so users always get fresh bundles
        if (filePath.endsWith("index.html")) {
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
          res.setHeader("Pragma", "no-cache");
          res.setHeader("Expires", "0");
        }
      },
    })
  );
}

/* =========================
   HEALTH CHECK & STATUS
========================= */

app.get("/api/health", (req, res) => {
  const dbStates = ["Disconnected ❌", "Connected ✅", "Connecting ⏳", "Disconnecting ⚠️"];
  const dbState = mongoose.connection.readyState;

  res.json({
    success: true,
    status: "OK",
    database: dbStates[dbState] || "Unknown",
    dbReady: dbState === 1,
    message: dbState === 1 ? "Backend & Database connected successfully ✅" : "Database is not connected. Check MongoDB Atlas / Local MongoDB.",
  });
});

/* =========================
   SPA FALLBACK ROUTE
========================= */

app.use((req, res, next) => {
  if (req.method !== "GET") return next();
  if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
    return next();
  }

  // Prevent returning index.html for missing static assets (images, scripts, styles)
  if (
    req.path.startsWith("/assets") ||
    req.path.startsWith("/images") ||
    /\.(jpg|jpeg|png|gif|svg|ico|webp|js|css|woff2?|ttf|eot|map)$/i.test(req.path)
  ) {
    return res.status(404).send("Asset not found");
  }

  const indexPath = path.join(publicPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    return res.sendFile(indexPath);
  }
  res.json({
    success: true,
    message: "Cybrical Tech API is running 🚀",
  });
});

/* =========================
   MONGODB CONNECTION
========================= */

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;

  const atlasURI = process.env.MONGO_URI;
  const localURI = process.env.LOCAL_MONGO_URI || "mongodb://127.0.0.1:27017/cybricaltech";

  // 1. Try MongoDB Atlas if configured
  if (atlasURI && !atlasURI.includes("127.0.0.1") && !atlasURI.includes("localhost")) {
    try {
      console.log("Connecting to MongoDB Atlas...");
      await mongoose.connect(atlasURI, {
        serverSelectionTimeoutMS: 3000,
      });
      console.log("MongoDB Atlas connected successfully ✅");
      return;
    } catch (atlasError) {
      console.warn(`MongoDB Atlas connection warning: ${atlasError.message} ⚠️`);
    }
  }

  // 2. Fallback to Local MongoDB
  try {
    console.log(`Connecting to local MongoDB (${localURI})...`);
    await mongoose.connect(localURI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log("Local MongoDB connected successfully ✅");
  } catch (localError) {
    console.warn("MongoDB connection note:", localError.message);
  }
};

connectDB();

/* =========================
   ERROR HANDLERS
========================= */

app.use(notFound);
app.use(errorHandler);

/* =========================
   SERVER START
========================= */

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Cybrical Tech backend running on http://localhost:${PORT}`);
});
