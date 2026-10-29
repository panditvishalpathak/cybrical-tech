const getBaseUrl = () => {
  if (import.meta.env && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/+$/, "");
  }
  if (typeof window !== "undefined" && window.location) {
    const host = window.location.hostname;
    // When developing on Vite dev server (port 5173 or other dev ports)
    if ((host === "localhost" || host === "127.0.0.1") && window.location.port !== "5000") {
      return "http://localhost:5000";
    }
    // Local LAN dev server (e.g. mobile testing on port 5173)
    if (/^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/.test(host) && window.location.port !== "5000") {
      return `http://${host}:5000`;
    }
    // In production or when frontend is served directly by backend
    return window.location.origin || "https://cybrical-tech.onrender.com";
  }
  return "https://cybrical-tech.onrender.com";
};

export const isGoogleDriveUrl = (url = "") => {
  if (!url || typeof url !== "string") return false;
  const lower = url.toLowerCase();
  return lower.includes("drive.google.com") || lower.includes("drive.usercontent.google.com") || lower.includes("docs.google.com");
};

export const getGoogleDriveViewUrl = (url = "") => {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  const folderMatch = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch && folderMatch[1]) {
    return `https://drive.google.com/drive/folders/${folderMatch[1]}?usp=sharing`;
  }
  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                    trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
                    trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch && fileMatch[1]) {
    return `https://drive.google.com/file/d/${fileMatch[1]}/view?usp=sharing`;
  }
  return trimmed;
};

export const formatGoogleDriveUrl = (url = "") => {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (isGoogleDriveUrl(trimmed)) {
    // Check if it's a folder link
    const folderMatch = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    if (folderMatch && folderMatch[1]) {
      return `https://drive.google.com/drive/folders/${folderMatch[1]}?usp=sharing`;
    }
    // Check if it's a file link
    const match = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                  trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
                  trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      // Direct download URL
      return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
  }
  return trimmed;
};

export const getApiUrl = (endpoint = "") => {
  const base = getBaseUrl();
  const cleanEndpoint = endpoint ? (endpoint.startsWith("/") ? endpoint : `/${endpoint}`) : "";
  return `${base}${cleanEndpoint}`;
};

export const getAssetUrl = (path = "") => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  const base = getBaseUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
};

export const getDownloadUrl = (path = "", customName = "") => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return formatGoogleDriveUrl(path);
  }
  const nameParam = customName ? `&name=${encodeURIComponent(customName)}` : "";
  return getApiUrl(`/api/courses/download-file?url=${encodeURIComponent(path)}${nameParam}`);
};

export default { getApiUrl, getAssetUrl, getDownloadUrl, formatGoogleDriveUrl, isGoogleDriveUrl, getGoogleDriveViewUrl };
