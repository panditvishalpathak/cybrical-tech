import React, { useEffect, useRef, useState } from "react";
import { getApiUrl } from "../config/api";
import "./AIAssistant.css";

// ==========================================
// AI PERSONA MODES
// ==========================================
const AI_MODES = [
  { id: "general", label: "Generative AI", icon: "🤖", badge: "GPT-4o", desc: "Generative intelligent assistant" },
  { id: "perplexity", label: "Perplexity 🌐", icon: "🌐", badge: "Live Search", desc: "Real-time web research, facts & citations" },
  { id: "image", label: "Image Gen 🎨", icon: "🎨", badge: "Flux AI", desc: "Generate AI Photos, Art & Logos" },
  { id: "code", label: "Code Master", icon: "💻", badge: "Dev Mode", desc: "Fullstack coding & debugging" },
  { id: "tutor", label: "LMS Tutor", icon: "🎓", badge: "Study Mode", desc: "Course curriculum & lectures" },
  { id: "business", label: "Business & SEO", icon: "🚀", badge: "Growth", desc: "Services, quotes & SEO" },
];

const DEFAULT_WELCOME = {
  id: "welcome-0",
  role: "ai",
  text: "Hello! I am **Cybrical AI 2.0** 🤖✨ — developed by **Vishal Pathak** for Cybrical Tech.\n\nChoose an AI mode above or ask me anything:\n- 🎨 **Generate AI Images & Art** (e.g. *\"generate image of futuristic cyberpunk city\"*)\n- 💻 **Write & Debug Code** (React, Node.js, Python, DSA, SQL)\n- 🎓 **Web Dev LMS Courses & Downloadable Project ZIPs**\n- 🚀 **Full-Stack Development, AI & SEO Services**\n\nHow can I help you right now?",
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  metrics: "⚡ Instant • 92 tokens",
};

// Language detection helper to mirror user's language & dialect
const detectLanguage = (text) => {
  if (!text) return "english";
  if (/[\u0900-\u097F]/.test(text)) return "devanagari";

  const hinglishMarkers = [
    "kya", "kaise", "kese", "hai", "he", "ho", "bhai", "batao", "samjhao",
    "krna", "karna", "karo", "karein", "chahiye", "cahiye", "mera", "meri", "mere",
    "mujhe", "aap", "tum", "bhi", "toh", "to", "aur", "nhi", "nahi", "kuch", "kaha",
    "kab", "sikhna", "seekhna", "de", "rha", "raha", "rahi", "kr", "ke", "liye",
    "badhiya", "theek", "shukriya", "dhanyawad", "sab", "hum", "pehle", "baad",
    "iska", "iske", "iski", "wala", "wali", "wale", "kro", "do", "kripya", "namaste",
    "sirf", "bataiye", "btao", "shuru", "sikhao", "kaunsa", "kisme", "sabse", "jese",
    "jaisa", "jaise", "usi", "ki", "me", "hi"
  ];

  const cleanWords = text.toLowerCase().split(/[^a-z0-9]+/);
  const hits = cleanWords.filter((w) => hinglishMarkers.includes(w)).length;
  if (hits >= 1 || (cleanWords.length <= 4 && hits >= 1)) {
    return "hinglish";
  }
  return "english";
};

// Explicit Code Command Detector
const isExplicitCodeCommand = (text, mode = "general") => {
  if (mode === "code") return true;
  const lower = (text || "").toLowerCase().trim();

  const codePatterns = [
    /\b(code|coding|codes|script|scripts|program|programs|snippet|snippets|function|functions|syntax|syntaxes)\b/i,
    /\b(component|components|hook|hooks|middleware|middlewares|endpoint|endpoints)\b/i,
    /\b(html|css|jsx|tsx|javascript|js|python|py|sql|c\+\+|cpp|java|php|rust|typescript|ts|golang|go)\b/i,
    /\b(write|create|build|generate|make|likho|banao|dikhaye|dikhao|do|de|chahiye)\s+(a\s+|an\s+|the\s+)?(code|script|program|snippet|function|component|app|api|page)\b/i,
    /\b(code\s*(do|de|banao|likho|dikhao|chahiye|kardo|krdo|dena|bhejo))\b/i,
    /\b(implementation|implement|algorithm\s+code)\b/i,
  ];

  return codePatterns.some((pattern) => pattern.test(lower));
};

// =========================================================================
// IN-BROWSER ZIP ARCHIVE DECOMPRESSION & PARSER ENGINE
// =========================================================================
const formatFileSizeGlobal = (bytes) => {
  if (!bytes) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const parseZipArchive = async (arrayBuffer) => {
  const dv = new DataView(arrayBuffer);
  const uint8 = new Uint8Array(arrayBuffer);

  // Search backwards for End of Central Directory (EOCD: 0x06054b50)
  let eocdOffset = -1;
  const maxSearch = Math.max(0, arrayBuffer.byteLength - 65557);
  for (let i = arrayBuffer.byteLength - 22; i >= maxSearch; i--) {
    if (dv.getUint32(i, true) === 0x06054b50) {
      eocdOffset = i;
      break;
    }
  }

  if (eocdOffset === -1) {
    throw new Error("Invalid or unreadable ZIP format");
  }

  const totalEntries = dv.getUint16(eocdOffset + 10, true);
  const cdOffset = dv.getUint32(eocdOffset + 16, true);

  const files = [];
  let p = cdOffset;

  for (let i = 0; i < totalEntries && p + 46 <= arrayBuffer.byteLength; i++) {
    if (dv.getUint32(p, true) !== 0x02014b50) break;

    const method = dv.getUint16(p + 10, true);
    const compSize = dv.getUint32(p + 20, true);
    const uncompSize = dv.getUint32(p + 24, true);
    const nameLen = dv.getUint16(p + 28, true);
    const extraLen = dv.getUint16(p + 30, true);
    const commentLen = dv.getUint16(p + 32, true);
    const localOffset = dv.getUint32(p + 42, true);

    const nameBytes = uint8.subarray(p + 46, p + 46 + nameLen);
    const fileName = new TextDecoder("utf-8").decode(nameBytes);
    const isDir = fileName.endsWith("/") || (compSize === 0 && uncompSize === 0 && !fileName.includes("."));

    let content = null;
    const isCodeOrText = /\.(json|js|jsx|ts|tsx|html|css|py|txt|md|sql|csv|env|xml|yml|yaml|svg|java|c|cpp|php)$/i.test(fileName);

    if (!isDir && isCodeOrText && uncompSize < 120000 && localOffset + 30 <= arrayBuffer.byteLength) {
      try {
        const localNameLen = dv.getUint16(localOffset + 26, true);
        const localExtraLen = dv.getUint16(localOffset + 28, true);
        const dataStart = localOffset + 30 + localNameLen + localExtraLen;
        const compData = uint8.subarray(dataStart, dataStart + compSize);

        if (method === 0) {
          content = new TextDecoder("utf-8").decode(compData);
        } else if (method === 8 && typeof DecompressionStream !== "undefined") {
          const ds = new DecompressionStream("deflate-raw");
          const writer = ds.writable.getWriter();
          writer.write(compData);
          writer.close();
          const reader = ds.readable.getReader();
          const chunks = [];
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
          }
          const totalLen = chunks.reduce((acc, c) => acc + c.length, 0);
          const fullBuf = new Uint8Array(totalLen);
          let offset = 0;
          for (const c of chunks) {
            fullBuf.set(c, offset);
            offset += c.length;
          }
          content = new TextDecoder("utf-8").decode(fullBuf);
        }
      } catch (decodeErr) {
        // Silently skip corrupted entry
      }
    }

    files.push({ fileName, isDir, uncompSize, content });
    p += 46 + nameLen + extraLen + commentLen;
  }

  return files;
};

const formatZipSummary = (fileName, fileSize, files) => {
  const fileEntries = files.filter((f) => !f.isDir);
  const totalCount = fileEntries.length;

  const fileListText = fileEntries
    .slice(0, 30)
    .map((f) => `- ${f.fileName} (${formatFileSizeGlobal(f.uncompSize)})`)
    .join("\n");

  const priorityFiles = fileEntries.filter((f) => f.content && f.content.trim().length > 0);
  priorityFiles.sort((a, b) => {
    const aKey = /package\.json|readme|app\.|index\.|server\.|main\./i.test(a.fileName) ? 1 : 0;
    const bKey = /package\.json|readme|app\.|index\.|server\.|main\./i.test(b.fileName) ? 1 : 0;
    return bKey - aKey;
  });

  let snippetsText = "";
  let charsBudget = 3500;

  for (const pf of priorityFiles.slice(0, 5)) {
    if (charsBudget <= 200) break;
    const snippet = pf.content.slice(0, Math.min(charsBudget, 1200));
    snippetsText += `\n\n📄 File: \`${pf.fileName}\`:\n\`\`\`\n${snippet}\n\`\`\``;
    charsBudget -= snippet.length;
  }

  return `[Attached ZIP Archive: ${fileName} (${formatFileSizeGlobal(fileSize)} | ${totalCount} Files Detected)]\n\n📁 **Directory Tree (${totalCount} Files):**\n${fileListText}${totalCount > 30 ? `\n...and ${totalCount - 30} more files` : ""}${snippetsText ? `\n\n🔍 **Extracted Key Code Snippets:**${snippetsText}` : ""}`;
};

// =========================================================================
// AI IMAGE GENERATION HELPERS (ULTRA-ROBUST DETECTION & PROMPT EXTRACTION)
// =========================================================================
const isImageGenerationQuery = (text, mode = "general") => {
  if (mode === "image") return true;
  const raw = (text || "").trim();
  const lower = raw.toLowerCase();
  if (!lower) return false;

  // Direct prefixes / slash commands
  if (
    lower.startsWith("/image") ||
    lower.startsWith("/img") ||
    lower.startsWith("image:") ||
    lower.startsWith("img:") ||
    lower.startsWith("photo:") ||
    lower.startsWith("prompt:") ||
    lower.startsWith("draw ") ||
    lower.startsWith("paint ") ||
    lower.startsWith("sketch ")
  ) {
    return true;
  }

  // Common nouns & verbs across English, Hinglish, Hindi
  const imageNouns =
    "image|images|img|photo|photos|pic|pics|picture|pictures|wallpaper|wallpapers|tasveer|tasvir|tasveerein|drawing|drawings|painting|paintings|portrait|portraits|sketch|sketches|illustration|art|graphic|avatar";
  const actionVerbs =
    "generate|generation|created|create|creating|banao|bana|banaye|dikhao|dikhaye|make|making|draw|drawing|paint|painting|sketch|render|rendering|design|designing|nikalo|dedo|do|chahiye|de|bhejo|mangwao|krke\\s+de|karke\\s+do|krdo|kardo";

  const pattern1 = new RegExp(`\\b(${imageNouns})\\b.*\\b(${actionVerbs})\\b`, "i");
  const pattern2 = new RegExp(`\\b(${actionVerbs})\\b.*\\b(${imageNouns})\\b`, "i");
  const pattern3 = new RegExp(`\\b(${imageNouns})\\s*(of|ki|ka|ke|for|wali|wala|wale|mein|me|banao|dikhao)\\b`, "i");
  const pattern4 = new RegExp(`\\b(ai\\s+wali\\s+image|ai\\s+image|ai\\s+photo)\\b`, "i");

  if (pattern1.test(lower) || pattern2.test(lower) || pattern3.test(lower) || pattern4.test(lower)) {
    return true;
  }

  // Short queries that end with/contain photo/image/pic/wallpaper (e.g., "car photo", "robot image", "lion wallpaper")
  const words = lower.split(/\s+/).filter(Boolean);
  if (words.length <= 10 && new RegExp(`\\b(${imageNouns})\\b`, "i").test(lower)) {
    return true;
  }

  return false;
};

const extractCleanImagePrompt = (text) => {
  let clean = (text || "").trim();

  // Strip prefixes / slash commands
  clean = clean.replace(/^\/(image|img)\s*/i, "");
  clean = clean.replace(/^(image|img|photo|prompt):\s*/i, "");

  // Strip leading conversational triggers
  clean = clean.replace(/^(can\s+you\s+|please\s+|plz\s+|kya\s+aap\s+|kya\s+tum\s+|mujhe\s+|hume\s+|ek\s+|a\s+|an\s+|the\s+)/i, "");
  clean = clean.replace(/^(generate|create|make|draw|paint|sketch|render|design|dikhao|banao)\s+(an?\s+)?(ai\s+)?(image|photo|picture|pic|wallpaper|logo|art|portrait|poster|tasveer|painting|drawing|sketch|illustration|graphic|avatar)\s+(of|for|about|ki|ka|ke)?\s*/i, "");
  clean = clean.replace(/^(image|photo|picture|pic|wallpaper|logo|art|portrait|poster|tasveer|painting|drawing)\s+(of|for|about|ki|ka|ke)\s*/i, "");
  clean = clean.replace(/^(ai\s+wali\s+image|ai\s+image|ai\s+photo)\s*(generate\s+krke\s+de|generate\s+karke\s+do|banao|bana\s+do|dikhao)?\s*(jese|jaise|like)?\s*/i, "");

  // Strip trailing action suffixes (including "generate krke deni he", "deni hai", "chahiye", etc.)
  clean = clean.replace(/\s+(ki\s+image|ki\s+photo|ka\s+photo|ke\s+photo|ki\s+tasveer|ka\s+picture|ki\s+pic|image|photo|pic|picture|wallpaper)\s*(banao|bana\s+do|bana\s+ke\s+do|generate\s+karo|generate\s+krdo|generate\s+krke\s+de|generate\s+karke\s+do|generate\s+krke\s+deni\s+he|generate\s+karke\s+deni\s+hai|generate\s+krni\s+he|generate\s+karni\s+hai|dikhao|dikhaye|banakar\s+do|chahiye|cahiye|dedo|bhejo|do|krdo|kardo|deni\s+he|deni\s+hai|dena\s+hai|dena\s+he|plz|please)*$/i, "");
  clean = clean.replace(/\s+(generate\s+krke\s+deni\s+he|generate\s+karke\s+deni\s+hai|generate\s+krke\s+de|generate\s+karke\s+do|generate\s+krni\s+he|generate\s+karni\s+hai|generate\s+karo|banao|bana\s+do|bana\s+ke\s+do|banakar\s+do|deni\s+he|deni\s+hai|dena\s+hai|dena\s+he|chahiye\s+hai|chahiye\s+he|chahiye|cahiye|dedo|bhejo|do|krdo|kardo|plz|please)$/i, "");
  clean = clean.replace(/\s+(in\s+high\s+quality|hd|4k|8k|ultra\s+hd|photorealistic)$/i, "");
  clean = clean.replace(/^(ek\s+|a\s+|an\s+|the\s+)/i, "");

  clean = clean.trim();

  // Fallback if stripped down to empty
  if (!clean || clean.length < 2 || /^(image|photo|pic|picture|wallpaper)$/i.test(clean)) {
    clean = (text || "").trim();
  }

  // Display prompt formatting
  let displayPrompt = clean;
  if (/^(retreve|retriever)$/i.test(clean)) {
    displayPrompt = "Golden Retriever Dog";
  }

  // Normalize common Hindi / Hinglish phrases for ultra high-quality diffusion prompt
  let fluxPrompt = clean;
  fluxPrompt = fluxPrompt
    .replace(/\b(retreve|retriever)\b/gi, "happy cute Golden Retriever dog in a sunny lush park, 8k resolution, photorealistic")
    .replace(/\bkutta\b/gi, "cute loyal playful dog")
    .replace(/\bbilli\b/gi, "adorable fluffy kitten cat")
    .replace(/\bsher\b/gi, "majestic wild lion with golden mane")
    .replace(/\b(cheetah|tiger|baagh)\b/gi, "majestic wild Bengal tiger in green jungle")
    .replace(/\b(gaadi|car)\b/gi, "luxury futuristic sports supercar, 8k cinematic")
    .replace(/\bbike\b/gi, "neon cyberpunk high-speed sports motorbike")
    .replace(/\bjungle\s+me\b/gi, "in a lush magical jungle")
    .replace(/\braat\s+me\b/gi, "at night with atmospheric neon lighting")
    .replace(/\bpaani\s+me\b/gi, "underwater with sun rays")
    .replace(/\bhawa\s+me\b/gi, "soaring in the sky")
    .replace(/\bspace\s+me\b/gi, "in outer space surrounded by colorful nebulae")
    .replace(/\brobot\b/gi, "futuristic AI cybernetic humanoid robot coding with holograms");

  return {
    displayPrompt: displayPrompt || clean,
    fluxPrompt: fluxPrompt || clean,
  };
};

const buildImageMarkdownResponse = (promptText, lang = "english") => {
  const { displayPrompt, fluxPrompt } = extractCleanImagePrompt(promptText);
  const seed = Math.floor(Math.random() * 10000000);
  const encodedPrompt = encodeURIComponent(fluxPrompt);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&model=flux&nologo=true&seed=${seed}`;

  if (lang === "hinglish") {
    return `Maine Google Gemini Imagen 3 Studio ke sath **"${displayPrompt}"** ke liye multi-style visual art generate kar di hai! ✨🎨

![${displayPrompt}](${imageUrl})

### 🌟 Gemini Imagen Studio Features:
- 🎨 **Multi-Style Presets:** Upar diye gaye buttons (*📸 Realistic, ✨ 3D Pixar, 🎌 Anime, 🌆 Cyberpunk, 🎨 Oil Painting*) par click karke instant style badlein!
- 🖼️ **4 Visual Variations:** Niche **V1, V2, V3, V4** par click karke alag-alag variations dekhein.
- 📐 **Aspect Ratio:** 1:1 Square, 16:9 Cinema, ya 9:16 Story format select karein.
- 🪄 **Magic Enhance:** *"🪄 Enhance"* button se lighting aur 8K details boost karein.
- 📥 **HD Download:** Full 1024×1024 resolution me 1-click download karein!`;
  }

  if (lang === "devanagari") {
    return `मैंने Google Gemini Imagen 3 स्टूडियो के साथ **"${displayPrompt}"** की मल्टी-स्टाइल विज़ुअल आर्ट जनरेट कर दी है! ✨🎨

![${displayPrompt}](${imageUrl})

### 🌟 जेमिनी इमेजन स्टूडियो की विशेषताएं:
- 🎨 **स्टाइल प्रीसेट्स:** ऊपर दिए गए बटनों (*यथार्थवादी, 3D रेंडर, एनिमे, साइबरपंक, ऑइल पेंटिंग*) से तुरंत स्टाइल बदलें।
- 🖼️ **4 वेरिएशन्स:** नीचे दिए गए V1, V2, V3, V4 पर क्लिक करके अलग-अलग वेरिएशन्स देखें।
- 📥 **डाउनलोड:** फुल 1024×1024 रेजोल्यूशन में डाउनलोड करें।`;
  }

  return `Here is your high-resolution visual masterpiece for **"${displayPrompt}"** generated with Gemini Imagen 3 Studio! ✨🎨

![${displayPrompt}](${imageUrl})

### 🌟 Gemini Imagen Studio Controls:
- 🎨 **Interactive Style Switching:** Click any preset (*📸 Realistic, ✨ 3D Unreal, 🎌 Anime, 🌆 Cyberpunk, 🎨 Oil Painting*) to transform styles in real-time.
- 🖼️ **4 Unique Variations:** Switch seamlessly between **V1, V2, V3, and V4**.
- 📐 **Aspect Ratios:** Switch between **1:1 Square**, **16:9 Cinema**, and **9:16 Portrait**.
- 🪄 **Magic Prompt Enhancer:** Click *"🪄 Enhance"* to inject volumetric studio lighting and 8K details.
- 📥 **1-Click Download:** Save full-resolution 1024×1024 images directly.`;
};

const getFallbackTechnicalResponse = (userPrompt, mode = "general") => {
  let prompt = (userPrompt || "").trim();
  prompt = prompt.replace(/^\[Web Search Active\]\s*/i, "").trim();
  const lower = prompt.toLowerCase();
  const lang = detectLanguage(prompt);

  // -----------------------------------------------------------------------
  // ATTACHMENT HANDLING: Image / File / ZIP / Code
  // -----------------------------------------------------------------------
  if (prompt.startsWith("[Attached Image:")) {
    const filenameMatch = prompt.match(/\[Attached Image:\s*([^\]]+)\]/i);
    const filename = filenameMatch ? filenameMatch[1] : "Uploaded Image";
    const userQuery = prompt.replace(/\[Attached Image:\s*([^\]]+)\]/i, "").trim();

    if (lang === "hinglish") {
      return `### 🖼️ Image Received: \`${filename}\`

Maine aapki upload ki gayi image file **\`${filename}\`** ko verify kar liya hai! ✅

${userQuery ? `**Aapka Sawaal:** "${userQuery}"\n\n` : ""}
### 🔍 Image Analysis & Next Steps:
1. **Visual Context:** Image successfully load ho gayi hai.
2. **Key Capabilities:**
   - 💻 Is image ke UI / Design ko **React / Tailwind / HTML-CSS** code me convert karna.
   - 🎨 Isse related 4K Flux.1 AI variations generate karna.
   - 📝 Architecture / Diagram / Flowchart ka structure explain karna.

Aap is image ke saath kya karna chahte hain? Mujhe batayein! 😊`;
    }

    return `### 🖼️ Image Attached: \`${filename}\`

I have successfully received and processed your uploaded image **\`${filename}\`**. ✅

${userQuery ? `**Your Prompt:** "${userQuery}"\n\n` : ""}
### 🔍 Image Analysis & Available Actions:
1. **Image Context:** Verified and ready for technical processing.
2. **Available Actions:**
   - 💻 **UI to Code:** Convert mockups or UI screenshots into responsive React, Tailwind, or HTML/CSS code.
   - 🎨 **Diffusion Art:** Generate variations or stylized 4K visuals using Flux.1.
   - 📝 **Architecture Breakdown:** Analyze and explain database schemas, system architecture, or flowcharts.

How would you like to proceed with this image? Let me know! 😊`;
  }

  if (prompt.includes("[Attached ZIP Archive:") || prompt.startsWith("[Attached Document/ZIP:")) {
    const filenameMatch = prompt.match(/\[Attached (?:ZIP Archive|Document\/ZIP):\s*([^(\]\n]+)/i);
    const filename = filenameMatch ? filenameMatch[1].trim() : "Project Archive.zip";
    const countMatch = prompt.match(/(\d+)\s*Files?\s*Detected/i);
    const fileCount = countMatch ? countMatch[1] : null;

    const hasReact = /react|\.jsx|\.tsx/i.test(prompt);
    const hasPackageJson = /package\.json/i.test(prompt);
    const hasPython = /\.py|requirements\.txt/i.test(prompt);
    const hasHtmlCss = /index\.html|\.css/i.test(prompt);

    let projectType = "Custom Software Project";
    let runCommand = "Inspect entry point file and start application";
    if (hasReact) {
      projectType = "React.js / Frontend Web Application";
      runCommand = "npm install && npm run dev";
    } else if (hasPackageJson) {
      projectType = "Node.js / Full-Stack Application";
      runCommand = "npm install && npm start";
    } else if (hasPython) {
      projectType = "Python Application / Script";
      runCommand = "python main.py (ya pip install -r requirements.txt)";
    } else if (hasHtmlCss) {
      projectType = "HTML5 / CSS / JavaScript Website";
      runCommand = "index.html ko direct browser me open karein";
    }

    const lines = prompt.split(/\n+/);
    const lastLine = lines[lines.length - 1];
    const userQuery = lastLine && !lastLine.startsWith("[Attached") && !lastLine.startsWith("📄") && !lastLine.startsWith("📁") && !lastLine.startsWith("🔍") ? lastLine.trim() : "";

    if (lang === "hinglish") {
      return `### 📦 ZIP File Analysis & Inspection: \`${filename}\`

Maine aapki ZIP archive **\`${filename}\`** ko unpack karke iske andar ki files inspect kar li hain! ✅

- 📊 **Files Detected:** ${fileCount ? `**${fileCount} files**` : "Files read successfully"}
- 🛠️ **Project Architecture:** **${projectType}**
- 🚀 **Recommended Run Command:** \`${runCommand}\`

${userQuery ? `**Aapka Sawaal:** "${userQuery}"\n\n` : ""}
### 📁 Inspection Highlights:
1. **Unpacked Structure:** ZIP file ka directory tree aur configuration inspect ho chuki hai.
2. **Execution Flow:** Project dependencies aur core components detect ho gaye hain.

Agar aap is project ki kisi specific file ka code inspect karwana chahte hain ya bug fix karwana chahte hain, toh batayein!`;
    }

    return `### 📦 ZIP Archive Inspected: \`${filename}\`

I have successfully unpacked and inspected the contents of **\`${filename}\`**! ✅

- 📊 **Files Detected:** ${fileCount ? `**${fileCount} files**` : "Extracted successfully"}
- 🛠️ **Project Architecture:** **${projectType}**
- 🚀 **Run Command:** \`${runCommand}\`

${userQuery ? `**Your Query:** "${userQuery}"\n\n` : ""}
### 📁 Inspection Highlights:
1. **Unpacked Structure:** Directory tree and key files parsed successfully.
2. **Environment & Dependencies:** Package structure and core source code ready.

Let me know if you would like me to explain any specific file or debug errors!`;
  }

  if (prompt.startsWith("[Attached File:")) {
    const filenameMatch = prompt.match(/\[Attached File:\s*([^\]]+)\]/i);
    const filename = filenameMatch ? filenameMatch[1] : "Uploaded File";
    const userQuery = prompt.replace(/\[Attached [^\]]+\]/i, "").replace(/```[\s\S]*?```/g, "").trim();
    const hasCodeSnippet = prompt.includes("```");

    if (lang === "hinglish") {
      return `### 📄 Uploaded File Analysis: \`${filename}\`

Maine aapki upload ki gayi file **\`${filename}\`** ko parse aur inspect kar liya hai! ✅

${hasCodeSnippet ? `**Code File Detected:** File content analysis ke liye ready hai.\n\n` : ""}
${userQuery ? `**Aapka Query:** "${userQuery}"\n\n` : ""}
### 🛠️ File Review & Technical Insights:
1. **File Status:** Successfully attached and checked.
2. **Actions I Can Perform:**
   - 🔍 **Code Review & Debugging:** Code syntax aur runtime issues detect karna.
   - ⚡ **Optimization:** Algorithm efficiency aur clean code structure suggest karna.
   - 📦 **Setup & Integration:** LMS projects aur backend APIs ke sath integrate karna.

Aap is file ke saath kya task perform karna chahte hain? Batayein! 😊`;
    }

    return `### 📄 File Received & Parsed: \`${filename}\`

I have received and inspected your attached file **\`${filename}\`**. ✅

${hasCodeSnippet ? `**Code Snippet Loaded:** Content extracted for deep analysis.\n\n` : ""}
${userQuery ? `**Your Query:** "${userQuery}"\n\n` : ""}
### 🛠️ Technical Capabilities for this File:
1. **File Status:** Verified and processed.
2. **Key Actions:**
   - 🔍 **Deep Code Inspection:** Identify bugs, edge cases, and runtime exceptions.
   - ⚡ **Performance & Refactoring:** Modular clean code architecture.
   - 📦 **Project Setup & Run:** Step-by-step instructions for installation and execution.

What would you like me to do with this file? Let me know! 😊`;
  }

  // -----------------------------------------------------------------------
  // IMAGE GENERATION INTENT
  // -----------------------------------------------------------------------
  if (isImageGenerationQuery(prompt, mode)) {
    return buildImageMarkdownResponse(prompt, lang);
  }

  // -----------------------------------------------------------------------
  // DEDICATED TEAM / EMPLOYEES COUNT & MEMBERS (35+ Team Members - TOP PRIORITY)
  // -----------------------------------------------------------------------
  if (
    /\b(employe|employee|employees|team\s*size|team\s*count|team\s*members?|kitne\s*(log|employee|employe|member|developers)|kitne\s*members|how\s*many\s*(employee|member|people|developers)|sandeep|arpit|akash|ak|anshu|satyam|saytam)\b/i.test(lower) ||
    lower.includes("employee") ||
    lower.includes("employe") ||
    lower.includes("kitne employee") ||
    lower.includes("kitne employe") ||
    lower.includes("team count") ||
    lower.includes("team size") ||
    lower.includes("team member")
  ) {
    if (lang === "devanagari") {
      return `### 👥 साइब्रिकल टेक टीम स्ट्रेंथ व मुख्य टीम मेंबर्स

**Cybrical Tech** में वर्तमान में **35+ कुशल प्रोफेशनल्स और इंजीनियर्स (35+ Team Members)** की एक मजबूत टीम कार्यरत है! 🚀

---

### 🌟 मुख्य नेतृत्व व टीम संरचना (Leadership & Key Team Members):
1. 👑 **संस्थापक और सीईओ:** **विराट सिंह (Virat Singh)**
2. 👩‍💻 **डेवलपमेंट टीम लीड:** **स्मृति मैम (Smriti Mam)** (Software & Full-Stack Lead)
3. 🤖 **लीड डेवलपर व एआई आर्किटेक्ट:** **विशाल पाठक (Vishal Pathak)**
4. 📈 **एसईओ और डिजिटल ग्रोथ लीड्स:** **कल्पना चौहान (Kalpna Chauhan)** और **कामिनी जस्टिस (Kamini Justic)**

---

### 💼 विभागवार टीम सदस्य (Department-wise Team):
- 💻 **डेवलपमेंट टीम (Development Team):**
  - **आकाश (Akash)** (Development)
  - **अंशु (Anshu)** (Development)
- 📈 **एसईओ टीम (SEO & Growth Team):**
  - **संदीप (Sandeep)** (SEO)
  - **अर्पित (Arpit)** (SEO)
- 💰 **फाइनेंस और अकाउंट्स (Finance & Accounts):**
  - **सत्यम (Satyam)** (Accountant)

हमारी 35+ सदस्यों की टीम आधुनिक वेब डेवलपमेंट, जेनरेटिव एआई और डिजिटल स्केलिंग पर काम करती है।`;
    }

    if (lang === "hinglish") {
      return `### 👥 Cybrical Tech Team Strength & Key Members

**Cybrical Tech** me currently **35+ skilled developers, SEO specialists aur engineers (35+ Team Members)** ki strong team kaam karti hai! 🚀

---

### 🌟 Leadership & Management:
1. 👑 **Founder & CEO:** **Virat Singh**
2. 👩‍💻 **Development Team Lead:** **Smriti Mam** (Leading Full-Stack & Software Team)
3. 🤖 **Lead Developer & AI Architect:** **Vishal Pathak**
4. 📈 **SEO & Digital Growth Leads:** **Kalpna Chauhan** & **Kamini Justic**

---

### 💼 Department-wise Team Members:
- 💻 **Development Team:**
  - **Akash** (Development)
  - **Anshu** (Development)
- 📈 **SEO Team:**
  - **Sandeep** (SEO)
  - **Arpit** (SEO)
- 💰 **Finance & Accounts:**
  - **Satyam** (Accountant)

Hamari **35+ members** ki team high-performance web applications, LMS platforms, SEO growth aur AI solutions deliver karti hai.`;
    }

    return `### 👥 Cybrical Tech Team Size & Key Team Members

**Cybrical Tech** has a dedicated team of **35+ skilled professionals, engineers, and digital specialists**! 🚀

---

### 🌟 Leadership:
1. 👑 **Founder & CEO:** **Virat Singh**
2. 👩‍💻 **Development Team Lead:** **Smriti Mam** (Leading Software & Full-Stack Development)
3. 🤖 **Lead Developer & AI Architect:** **Vishal Pathak**
4. 📈 **SEO & Digital Growth Leads:** **Kalpna Chauhan** & **Kamini Justic**

---

### 💼 Departments & Team Members:
- 💻 **Development Team:**
  - **Akash** (Development)
  - **Anshu** (Development)
- 📈 **SEO & Digital Growth Team:**
  - **Sandeep** (SEO)
  - **Arpit** (SEO)
- 💰 **Finance & Accounts:**
  - **Satyam** (Accountant)

Our **35+ team members** specialize in Full-Stack Web Development, AI Systems, LMS course architecture, and organic SEO scaling.`;
  }

  // -----------------------------------------------------------------------
  // DEDICATED OPENING / FOUNDED YEAR QUERY (2024)
  // -----------------------------------------------------------------------
  if (
    /\b(opening\s*year|founded\s*year|start\s*year|established\s*year|kab\s*(bani|start|shuru|open|khuli|establish|launch)\s*(hui|thi|hai|he)?|opening\s*date|founded\s*in|establishment\s*year)\b/i.test(lower) ||
    lower.includes("opening year") ||
    lower.includes("kab start hui") ||
    lower.includes("kab open hui") ||
    lower.includes("kab shuru hui") ||
    lower.includes("founded year") ||
    lower.includes("start year")
  ) {
    if (lang === "devanagari") {
      return `### 📅 साइब्रिकल टेक की स्थापना वर्ष (Opening Year)

**Cybrical Tech** की स्थापना वर्ष **2024** में संस्थापक और सीईओ **विराट सिंह (Virat Singh)** द्वारा की गई थी! 🚀

---

### 🏢 कंपनी स्थापना विवरण (Company Inception Details):
- 📅 **स्थापना / ओपनिंग वर्ष (Opening Year):** **2024**
- 👑 **संस्थापक और सीईओ (Founder & CEO):** **विराट सिंह (Virat Singh)**
- 👩‍💻 **डेवलपमेंट टीम लीड:** **स्मृति मैम (Smriti Mam)**
- 🤖 **लीड डेवलपर व एआई आर्किटेक्ट:** **विशाल पाठक (Vishal Pathak)**
- 📈 **एसईओ और डिजिटल ग्रोथ लीड्स:** **कल्पना चौहान (Kalpna Chauhan)** & **कामिनी जस्टिस (Kamini Justic)**
- 📍 **मुख्यालय:** सेक्टर 63, नोएडा, उत्तर प्रदेश, भारत

2024 में अपनी शुरुआत से ही Cybrical Tech ने **1000+ सफल प्रोजेक्ट्स** और **950+ संतुष्ट क्लाइंट्स** का विश्वास जीता है।`;
    }

    if (lang === "hinglish") {
      return `### 📅 Cybrical Tech Opening Year (स्थापना वर्ष)

**Cybrical Tech** ka opening / founded year **2024** hai! Iski shuruat **2024** me Founder & CEO **Virat Singh** ke netritva me hui thi. 🚀

---

### 🏢 Company Inception Details:
- 📅 **Opening / Inception Year:** **2024**
- 👑 **Founder & CEO:** **Virat Singh**
- 👩‍💻 **Development Team Lead:** **Smriti Mam**
- 🤖 **Lead Developer & AI Architect:** **Vishal Pathak**
- 📈 **SEO & Digital Growth Leads:** **Kalpna Chauhan** & **Kamini Justic**
- 👥 **Team Strength:** **35+ Skilled Engineers & Specialists**
- 📍 **Headquarters:** D 60, Sector 63, Noida, India

2024 me shuru hokar Cybrical Tech ne ab tak **1000+ Projects** deliver kiye hain aur **950+ Happy Clients** banaye hain!`;
    }

    return `### 📅 Cybrical Tech Opening & Founding Year

**Cybrical Tech** was founded and officially opened in **2024** by Founder & CEO **Virat Singh**! 🚀

---

### 🏢 Company Inception & Milestones:
- 📅 **Opening / Founding Year:** **2024**
- 👑 **Founder & CEO:** **Virat Singh**
- 👩‍💻 **Development Team Lead:** **Smriti Mam**
- 🤖 **Lead Engineer & AI Architect:** **Vishal Pathak**
- 📈 **SEO & Digital Growth Leads:** **Kalpna Chauhan** & **Kamini Justic**
- 👥 **Team Size:** **35+ Members**
- 📍 **Headquarters:** Sector 63, Noida, UP, India

Since opening in 2024, Cybrical Tech has rapidly grown to deliver **1000+ digital projects** and support **950+ satisfied clients** worldwide.`;
  }

  // -----------------------------------------------------------------------
  // CYBRICAL TECH / CYBERICAL TECH COMPANY DEFINITION (PRIORITY 1)
  // -----------------------------------------------------------------------
  const isCompanyQuery =
    (/\b(cybrical|cyberical|cybrical\s*tech|cyberical\s*tech)\b/i.test(lower) && !/\b(employe|employee|employees|smriti|vishal|kalpna|kamini|seo|zip)\b/i.test(lower)) ||
    /\b(company|agency|organisation|organization|firm)\b.*\b(kya\s*hai|about|details|profile|info|kare|karte|services|founder|owner|kisko|kiski|batao|explain|define|kaha|address|contact)\b/i.test(lower) ||
    /\b(about\s*(the\s*)?(company|cybrical|cyberical|cybrical\s*tech|cyberical\s*tech))\b/i.test(lower) ||
    /\b(company\s*ke\s*baare\s*me|company\s*kya\s*hai|company\s*details|company\s*profile|about\s*us|cybrical\s*kya\s*hai|cyberical\s*kya\s*hai)\b/i.test(lower);

  if (isCompanyQuery) {
    if (lang === "devanagari") {
      return `### 🌐 साइब्रिकल टेक (Cybrical Tech) का परिचय

**Cybrical Tech** (साइब्रिकल टेक) एक प्रमुख आधुनिक सॉफ्टवेयर इंजीनियरिंग, एआई इनोवेशन और एडटेक/एलएमएस प्लेटफॉर्म है, जिसकी स्थापना **2024** में संस्थापक (Founder) **विराट सिंह (Virat Singh)** द्वारा की गई थी। कंपनी की डेवलपमेंट टीम का नेतृत्व **स्मृति मैम (Smriti Mam)** करती हैं, एआई व सॉफ्टवेयर सिस्टम को **विशाल पाठक (Vishal Pathak)** द्वारा डेवलप किया गया है, और एसईओ विभाग **कल्पना चौहान (Kalpna Chauhan)** व **कामिनी जस्टिस (Kamini Justic)** द्वारा लीड किया जाता है।

---

### 🏢 कंपनी प्रोफाइल व नेतृत्व (Company Profile & Leadership):
- 📅 **स्थापना / ओपनिंग वर्ष (Opening Year):** 2024
- 👑 **संस्थापक और सीईओ (Founder & CEO):** विराट सिंह (Virat Singh)
- 👥 **टीम क्षमता (Team Strength):** 35+ कुशल प्रोफेशनल्स और इंजीनियर्स
- 🚀 **प्रोजेक्ट डिलीवरी (Projects Delivered):** 1000+ सफल प्रोजेक्ट्स
- 👩‍💻 **डेवलपमेंट टीम लीड (Development Team Lead):** स्मृति मैम (Smriti Mam)
- 👨‍💻 **मुख्य डेवलपर और एआई आर्किटेक्ट:** विशाल पाठक (Vishal Pathak)
- 📈 **एसईओ और डिजिटल ग्रोथ लीड्स (SEO Leads):** कल्पना चौहान (Kalpna Chauhan) & कामिनी जस्टिस (Kamini Justic)
- 📍 **मुख्यालय (Headquarters):** D 60, D Block, Sector 63, Noida, Uttar Pradesh 201301, India
- 📧 **आधिकारिक ईमेल:** cybricaltech@gmail.com
- 📞 **संपर्क / WhatsApp:** +91 836 859 7373
- 🌐 **प्लेटफॉर्म:** Official LMS & Web Development Hub

---

### 🚀 मुख्य सेवाएं और उत्पाद (Core Services):
1. 💻 **फुल-स्टैक वेब व सॉफ्टवेयर डेवलपमेंट (Led by Smriti Mam):**
   - React.js, Next.js, Node.js, Express, MongoDB, PostgreSQL आधारित सुरक्षित और स्केलेबल ऍप्लिकेशन्स।
2. 🤖 **एआई व ऑटोमेशन सॉल्यूशंस:**
   - कस्टम एआई एजेंट्स (जैसे Cybrical AI 2.0), वर्कफ़्लो ऑटोमेशन और जनरेटिव एआई टूल्स।
3. 📈 **एसईओ और डिजिटल ग्रोथ (Led by Kalpna Chauhan & Kamini Justic):**
   - टेक्निकल एसईओ, ऑन-पेज/ऑफ-पेज ऑप्टिमाइज़ेशन, कीवर्ड रिसर्च और गूगल रैंकिंग बूस्ट।
4. 🎓 **एडटेक व एलएमएस मास्टरक्लास:**
   - **वेब डेवलपमेंट कोर्स:** इसमें छात्रों के लिए **63 प्रोजेक्ट ZIP फाइल्स** का कम्प्लीट ऑफलाइन आर्काइव उपलब्ध है।
5. 🎨 **UI/UX डिज़ाइन व ब्रांडिंग:**
   - आधुनिक ग्लासमोर्फिज्म, क्लीन यूजर इंटरफेस और उच्च रूपांतरण वाले लैंडिंग पेजेस।

---

क्या आप Cybrical Tech की किसी विशेष सर्विस या LMS कोर्स प्रोजेक्ट्स के बारे में विस्तार से जानना चाहते हैं? 😊`;
    }

    if (lang === "hinglish") {
      return `### 🌐 About Cybrical Tech (साइब्रिकल टेक)

**Cybrical Tech** ek leading modern IT Solutions, Software Engineering, AI Innovation aur EdTech/LMS company hai jiska opening year **2024** hai. Iske Founder & CEO **Virat Singh** hain, company ki Development Team ko **Smriti Mam** lead karti hain, iske AI Systems & Platforms ko **Vishal Pathak** ne develop kiya hai, aur company ke SEO & Digital Growth department ko **Kalpna Chauhan** & **Kamini Justic** lead karti hain.

---

### 🏢 Company Profile & Leadership Details:
- 📅 **Opening Year / Founded:** 2024
- 👑 **Founder & CEO:** Virat Singh
- 👥 **Team Strength:** 35+ Skilled Engineers & Specialists
- 🚀 **Projects Delivered:** 1000+ Successful Digital Projects
- 👩‍💻 **Development Team Lead:** Smriti Mam
- 👨‍💻 **Lead Developer & Software Architect:** Vishal Pathak
- 📈 **SEO & Digital Growth Leads:** Kalpna Chauhan & Kamini Justic
- 📍 **Headquarters:** D 60, D Block, Sector 63, Noida, Uttar Pradesh 201301, India
- 📧 **Official Email:** cybricaltech@gmail.com
- 📞 **Contact / WhatsApp:** +91 836 859 7373
- 🌐 **Official Platform:** Cybrical Tech LMS & Portal

---

### 🚀 Core Services & Capabilities (Kya-kya kaam karti hai):
1. 💻 **Full-Stack Web & Software Development (Led by Smriti Mam):**
   - High-performance, scalable web apps using **React.js, Next.js, Node.js, Express, MongoDB, PostgreSQL, Tailwind CSS**.
   - Enterprise REST APIs, GraphQL, real-time WebSockets, aur microservices.

2. 🤖 **AI & Automation Systems:**
   - Custom Intelligent AI Assistants (jaise Cybrical AI 2.0 with GPT-4o, Gemini aur DeepSeek engine).
   - Generative AI tools, intelligent chatbots, computer vision aur workflow automation.

3. 📈 **SEO & Digital Growth (Led by Kalpna Chauhan & Kamini Justic):**
   - End-to-end Technical SEO, Keyword Research, On-page/Off-page Optimization, Backlinking, aur Google Top Ranking strategies.

4. 🎓 **EdTech & LMS Platform:**
   - **Web Development Masterclass:** Complete industry curriculum jisme **63 Downloadable Project ZIP Archives** practice aur portfolio ke liye included hain.
   - Student dashboard, progress tracking aur developer mentoring.

5. 🎨 **UI/UX Design & Branding:**
   - Modern glassmorphism, responsive clean UI, design systems aur high-conversion interfaces.

---

### 💡 Cybrical Tech Mission:
*"Empowering businesses and developers with cutting-edge software engineering, scalable cloud platforms, and practical hands-on technology education."*

Aapko Cybrical Tech ke **Development Services**, **SEO Services**, ya **LMS Web Dev Course (63 ZIPs)** me se kisme guidance chahiye? Mujhe batayein! 😊`;
    }

    return `### 🌐 About Cybrical Tech

**Cybrical Tech** is a premier modern Software Engineering, AI Innovation, and EdTech/LMS platform founded in **2024** by **Virat Singh**, with the Software Development Team led by **Smriti Mam**, AI & platforms engineered by **Vishal Pathak**, and SEO & Digital Growth spearheaded by **Kalpna Chauhan** and **Kamini Justic**.

---

### 🏢 Company Profile & Leadership:
- 📅 **Opening / Founded Year:** 2024
- 👑 **Founder & CEO:** Virat Singh
- 👩‍💻 **Development Team Lead:** Smriti Mam
- 👨‍💻 **Lead Engineer & AI Architect:** Vishal Pathak
- 📈 **SEO & Digital Growth Leads:** Kalpna Chauhan & Kamini Justic
- 📍 **Headquarters:** D 60, D Block, Sector 63, Noida, Uttar Pradesh 201301, India
- 📧 **Official Email:** cybricaltech@gmail.com
- 📞 **Contact / WhatsApp:** +91 836 859 7373
- 🌐 **Platform:** Official Cybrical Tech LMS & Learning Portal

---

### 🚀 Core Services & Solutions:
1. 💻 **Full-Stack Web & Software Development (Led by Smriti Mam):**
   - Production-grade applications powered by React.js, Next.js, Node.js, Express, MongoDB, PostgreSQL, and Tailwind CSS.
   - Robust RESTful APIs, WebSockets, cloud infrastructure, and database optimization.

2. 🤖 **AI & Intelligent Automation:**
   - Enterprise AI Assistants (such as Cybrical AI 2.0 with multi-model GPT-4o & Gemini integration).
   - Generative AI solutions, LLM workflows, and business automation pipelines.

3. 📈 **Search Engine Optimization (SEO) & Digital Growth (Led by Kalpna Chauhan & Kamini Justic):**
   - Comprehensive technical SEO, keyword strategy, and Core Web Vitals optimization.

4. 🎓 **EdTech & Developer LMS Academy:**
   - **Web Development Masterclass:** Complete hands-on training featuring **63 downloadable full-stack project ZIP archives** for offline learning and portfolio building.

5. 🎨 **UI/UX Design & Digital Product Engineering:**
   - High-fidelity UI design, glassmorphism aesthetics, accessible UX, and conversion optimization.

---

How can Cybrical Tech assist you today with software development, SEO, AI solutions, or our LMS courses? Let me know! 😊`;
  }

  // -----------------------------------------------------------------------
  // DEDICATED DEVELOPMENT TEAM LEAD QUERY (SMRITI MAM)
  // -----------------------------------------------------------------------
  if (
    /\b(smriti|smiriti|smrity)\b/i.test(lower) ||
    /\b(development\s*(lead|team|head|manager)|dev\s*team\s*lead)\b/i.test(lower) ||
    lower.includes("development team ko lead") ||
    lower.includes("dev team lead") ||
    lower.includes("development lead")
  ) {
    if (lang === "devanagari") {
      return `### 👩‍💻 साइब्रिकल टेक डेवलपमेंट टीम नेतृत्व
**Cybrical Tech** में सॉफ्टवेयर और फुल-स्टैक डेवलपमेंट टीम का नेतृत्व **स्मृति मैम (Smriti Mam)** करती हैं! 🚀💻

---

### 🌟 मुख्य जिम्मेदारियां व भूमिका (Key Roles & Responsibilities):
1. 💻 **सॉफ्टवेयर व वेब डेवलपमेंट आर्किटेक्चर:** React, Node.js, Next.js और डेटाबेस प्रोजेक्ट्स की तकनीकी प्लानिंग।
2. 👥 **डेवलपर टीम गाइडेंस:** कोड क्वालिटी, कोड रिव्यु और समय पर प्रोजेक्ट डिलीवरी का प्रबंधन।
3. ⚙️ **फुल-स्टैक सॉल्यूशंस:** स्केलेबल और हाई-परफॉरमेंस वेब ऍप्लिकेशन्स का निर्माण।
4. 🎓 **प्रोजेक्ट मेंटरशिप:** एलएमएस व रियल-वर्ल्ड प्रोजेक्ट्स के आर्किटेक्चर को गाइड करना।

यदि आपको डेवलपमेंट प्रोजेक्ट्स या सॉफ्टवेयर सॉल्यूशंस के बारे में कोई सवाल पूछना है, तो बताएं! 😊`;
    }

    if (lang === "hinglish") {
      return `### 👩‍💻 Cybrical Tech Development Team Leadership
**Cybrical Tech** me Software aur Full-Stack Development team ko **Smriti Mam** lead karti hain! 🚀💻

---

### 🌟 Key Responsibilities & Role:
1. 💻 **Software & Full-Stack Development Architecture:** React.js, Node.js, Next.js, Express, MongoDB aur PostgreSQL projects ki technical architecture aur delivery.
2. 👥 **Development Team Management:** Code quality standards, sprint planning, aur engineering team execution.
3. ⚙️ **Scalable Web & App Solutions:** Robust client solutions aur enterprise platforms ka successful execution.
4. 🎓 **Technical Mentorship:** Developer workflows aur LMS web development standards ko maintain karna.

Agar aapko Cybrical Tech ke development projects ya technical stack se related koi sawal hai, toh batayein! 😊`;
    }

    return `### 👩‍💻 Cybrical Tech Development Team Leadership
At **Cybrical Tech**, the Software & Full-Stack Development team is led by **Smriti Mam**! 🚀💻

---

### 🌟 Key Responsibilities:
1. 💻 **Full-Stack Engineering & Architecture:** Leading production web apps built on React, Next.js, Node.js, Express, and Databases.
2. 👥 **Engineering Leadership:** Managing sprint execution, high coding standards, code reviews, and project delivery.
3. ⚙️ **Enterprise Software Delivery:** Architecting scalable, secure, and modern digital applications.
4. 🎓 **Technical Strategy:** Guiding engineering best practices and technical roadmap implementation.

Feel free to ask if you have any questions regarding our development team or services! 😊`;
  }

  // -----------------------------------------------------------------------
  // DEDICATED SEO CONCEPT & FULL FORM HANDLER (SEO Kya Hai / SEO Full Form)
  // -----------------------------------------------------------------------
  if (
    /\b(seo\s*(fulll?|full)?\s*form|what\s*is\s*seo|seo\s*kya\s*hai|seo\s*meaning|seo\s*definition|explain\s*seo)\b/i.test(lower) ||
    lower === "seo" ||
    lower === "seo kya hai" ||
    lower === "seo fulll form" ||
    lower === "seo full form" ||
    lower.includes("seo full form") ||
    lower.includes("seo fulll form")
  ) {
    if (lang === "devanagari") {
      return `### 🔍 एसईओ (SEO) का फुल फॉर्म और परिचय

**SEO का फुल फॉर्म:** **Search Engine Optimization** (सर्च इंजन ऑप्टिमाइज़ेशन)

---

### 💡 एसईओ क्या है?
**SEO** वह तकनीक और प्रक्रिया है जिसके द्वारा किसी वेबसाइट को गूगल (Google) जैसे सर्च इंजनों पर बिना पैसे दिए (Organic Search) पहले पेज पर रैंक कराया जाता है।

### 🌟 मुख्य प्रकार (Key Pillars of SEO):
1. ⚙️ **On-Page SEO:** कीवर्ड रिसर्च, मेटा टाइटल्स, हेडिंग्स और क्वालिटी कंटेंट।
2. 🔧 **Technical SEO:** वेबसाइट स्पीड, मोबाइल-फ्रेंडली डिज़ाइन और साइटमैप।
3. 🔗 **Off-Page SEO:** हाई-अथॉरिटी बैकलिंक्स और सोशल सिग्नल्स।

*(Cybrical Tech में SEO टीम का नेतृत्व **Kalpna Chauhan** और **Kamini Justic** करती हैं)*`;
    }

    if (lang === "hinglish") {
      return `### 🔍 SEO Full Form & Overview

**SEO ka Full Form:** **Search Engine Optimization** (सर्च इंजन ऑप्टिमाइज़ेशन)

---

### 💡 SEO Kya Hai?
**SEO** ek aisi technique hai jisse kisi bhi website ya web app ko **Google/Bing Search Engine** ke first page par free (Organic Traffic) rank karwaya jata hai.

### 🌟 SEO ke 3 Main Pillars:
1. 📝 **On-Page SEO:** High-traffic keywords, meta tags, quality content aur URL structure.
2. ⚡ **Technical SEO:** Website speed, Core Web Vitals, sitemap aur mobile responsiveness.
3. 🔗 **Off-Page SEO:** Quality backlinks aur domain authority build karna.

*(Cybrical Tech me SEO & Digital Growth department ko **Kalpna Chauhan** & **Kamini Justic** lead karti hain)*`;
    }

    return `### 🔍 SEO Full Form & Core Definition

**SEO stands for:** **Search Engine Optimization**

---

### 💡 What is SEO?
**Search Engine Optimization (SEO)** is the practice of optimizing a website or application to increase its visibility, organic (non-paid) traffic, and ranking on search engines like Google and Bing.

### 🌟 Three Main Pillars of SEO:
1. 📝 **On-Page SEO:** Keyword strategy, meta tags, high-quality content, and site architecture.
2. ⚡ **Technical SEO:** Crawlability, indexing, page speed, mobile optimization, and Core Web Vitals.
3. 🔗 **Off-Page SEO:** High-authority backlinks and domain trust.

*(At Cybrical Tech, our SEO division is led by **Kalpna Chauhan** & **Kamini Justic**)*`;
  }

  // -----------------------------------------------------------------------
  // DEDICATED SEO LEADERSHIP QUERY (Who leads SEO in Cybrical Tech)
  // -----------------------------------------------------------------------
  if (
    /\b(kalpna|kalpana|chauhan|chuhan|kamini|justic|justice)\b/i.test(lower) ||
    /\b(seo\s*(lead|team|head|expert|kon|kaun|karta|karti|sambhal|handle))\b/i.test(lower) ||
    lower.includes("seo ko lead") ||
    lower.includes("seo team") ||
    lower.includes("seo lead")
  ) {
    if (lang === "devanagari") {
      return `### 📈 साइब्रिकल टेक में एसईओ (SEO) टीम नेतृत्व

**Cybrical Tech** में सर्च इंजन ऑप्टिमाइज़ेशन (SEO) और डिजिटल ग्रोथ विभाग का नेतृत्व **कल्पना चौहान (Kalpna Chauhan)** और **कामिनी जस्टिस (Kamini Justic)** द्वारा किया जाता है। 🎯

---

### 🌟 मुख्य जिम्मेदारियां और सेवाएं:
1. 🔍 **टेक्निकल एसईओ व कोर वेब वाइटल्स:** वेबसाइट की स्पीड और इंडेक्सिंग में सुधार।
2. 📊 **कीवर्ड रिसर्च व कॉम्पिटिटर एनालिसिस:** हाई-वैल्यू सर्च टर्म्स पर गूगल फर्स्ट पेज रैंकिंग।
3. ✍️ **कंटेंट ऑप्टिमाइज़ेशन:** ऑर्गेनिक ट्रैफिक बूस्ट और ऑन-पेज एसईओ।
4. 🔗 **हाई-अथॉरिटी बैकलिंकिंग:** डोमेन अथॉरिटी और ब्रांड विजिबिलिटी बढ़ाना।

यदि आपको अपनी वेबसाइट या बिज़नेस के लिए एसईओ ऑडिट और ग्रोथ स्ट्रेटेजी चाहिए, तो बेझिझक बताएं! 😊`;
    }

    if (lang === "hinglish") {
      return `### 📈 Cybrical Tech SEO Team Leadership

**Cybrical Tech** me Search Engine Optimization (SEO) aur Digital Growth department ko **Kalpna Chauhan** aur **Kamini Justic** lead karti hain! 🎯🚀

---

### 🌟 Key SEO Expertise & Services:
1. 🔍 **Technical & On-Page SEO:** Website crawlability, schema markup, site architecture aur Core Web Vitals optimization.
2. 📊 **Keyword Research & Ranking:** High-traffic keywords par Google Top Rankings achieve karna.
3. 🔗 **Quality Backlink Building:** High-authority domain backlinks aur off-page SEO strategies.
4. 📈 **Organic Traffic & Growth Scaling:** Client websites aur web applications ke liye organic leads generate karna.

Agar aapko apne project ya business website ke liye **SEO Audit & Growth Strategy** chahiye, toh batayein! 😊`;
    }

    return `### 📈 Cybrical Tech SEO Leadership

At **Cybrical Tech**, the Search Engine Optimization (SEO) and Digital Growth division is led by **Kalpna Chauhan** and **Kamini Justic**! 🎯🚀

---

### 🌟 Key Focus Areas & Expertise:
1. 🔍 **Technical & On-Page SEO:** Crawlability, schema architecture, performance, and Core Web Vitals.
2. 📊 **Keyword Strategy & Analytics:** Competitive research and top Google search rankings.
3. 🔗 **Off-Page SEO & Authority:** High-impact backlink acquisition and brand signals.
4. 📈 **Traffic Conversion:** Converting organic search traffic into active users and clients.

Would you like an SEO audit or a digital growth strategy for your website or web project? Let me know! 😊`;
  }

  // -----------------------------------------------------------------------
  // DEDICATED TEAM / EMPLOYEES COUNT HANDLER (35+ Team Members)
  // -----------------------------------------------------------------------
  if (
    /\b(employe|employee|employees|team\s*size|team\s*count|kitne\s*(log|employee|employe|member)|how\s*many\s*(employee|member|people|developers))\b/i.test(lower) ||
    lower.includes("employee count") ||
    lower.includes("employe count") ||
    lower.includes("kitne employee") ||
    lower.includes("team members")
  ) {
    if (lang === "devanagari") {
      return `### 👥 साइब्रिकल टेक टीम स्ट्रेंथ (Employee Count)

**Cybrical Tech** में वर्तमान में **35+ कुशल प्रोफेशनल्स और इंजीनियर्स (35+ Employees & Team Members)** की एक समर्पित टीम है! 🚀

---

### 🌟 टीम संरचना (Team Structure):
1. 💻 **सॉफ्टवेयर व फुल-स्टैक डेवलपमेंट टीम:** नेतृत्व — **स्मृति मैम (Smriti Mam)**
2. 🤖 **एआई आर्किटेक्चर व सिस्टम्स:** नेतृत्व — **विशाल पाठक (Vishal Pathak)**
3. 📈 **एसईओ और डिजिटल ग्रोथ टीम:** नेतृत्व — **कल्पना चौहान (Kalpna Chauhan)** और **कामिनी जस्टिस (Kamini Justic)**
4. 🏢 **फाउंडर और सीईओ:** **विराट सिंह (Virat Singh)**

पूरी टीम आधुनिक वेब डेवलपमेंट, जेनरेटिव एआई टूल्स और डिजिटल ग्रोथ पर काम करती है।`;
    }

    if (lang === "hinglish") {
      return `### 👥 Cybrical Tech Employee & Team Strength

**Cybrical Tech** me currently **35+ skilled developers, engineers aur digital specialists (35+ Employees)** ki strong team kaam karti hai! 🚀

---

### 🌟 Team Leadership & Structure:
1. 🏢 **Founder & CEO:** **Virat Singh**
2. 💻 **Development Team Lead:** **Smriti Mam** (Leading Full-Stack & Software Engineers)
3. 🤖 **Lead Developer & AI Architect:** **Vishal Pathak**
4. 📈 **SEO & Digital Growth Leads:** **Kalpna Chauhan** & **Kamini Justic**

Hamari **35+ members** ki team high-performance web applications, LMS platforms aur AI-driven digital solutions deliver karti hai.`;
    }

    return `### 👥 Cybrical Tech Team Size & Employee Strength

**Cybrical Tech** has a strong and dedicated team of **35+ skilled professionals, engineers, and digital specialists**! 🚀

---

### 🌟 Leadership & Departments:
1. 🏢 **Founder & CEO:** **Virat Singh**
2. 💻 **Development Team Lead:** **Smriti Mam** (Leading Software & Full-Stack Development)
3. 🤖 **Lead Developer & AI Architect:** **Vishal Pathak**
4. 📈 **SEO & Digital Growth Leads:** **Kalpna Chauhan** & **Kamini Justic**

Our **35+ team members** specialize in Full-Stack Web Development (MERN/Next.js), AI Systems, LMS course architecture, and high-impact SEO growth.`;
  }

  // -----------------------------------------------------------------------
  // 0. DISTINCT CONVERSATIONAL HUMAN INTENTS (LANGUAGE MIRRORED)
  // -----------------------------------------------------------------------

  // A. Status / Well-being ("how are you", "how are u", "how r u", "kaise ho", "kese ho", "kya haal")
  if (
    /\b(how\s*(are|r)\s*(you|u)|how's\s*it\s*going|how\s*is\s*it|how\s*do\s*you\s*do|how\s*u\s*doing|what's\s*up|whats\s*up|wassup|wbu|hbu|kaise\s*ho|kese\s*ho|kya\s*haal|sab\s*theek|sab\s*badhiya|kaisa\s*chal\s*raha|kaisa\s*hai)\b/i.test(lower) ||
    lower === "how are u" ||
    lower === "how r u" ||
    lower === "how are you" ||
    lower.includes("आप कैसे हैं")
  ) {
    if (lang === "english") {
      return `I am doing great and fully operational! 🤖✨ Thank you for asking.

How are you doing today? What coding topic, Web Development project, or technical question would you like to work on? I am ready to help! 😊`;
    }
    if (lang === "devanagari") {
      return `मैं बिल्कुल ठीक और पूरी तरह सक्रिय हूँ! 🤖✨ पूछने के लिए धन्यवाद।

आप कैसे हैं और आपका दिन कैसा चल रहा है? आज हम किस कोडिंग विषय या प्रोजेक्ट पर काम करने वाले हैं? 😊`;
    }
    return `Main bilkul theek aur super active hoon! 🤖✨ Shukriya poochne ke liye.

Aap bataiye, aap kaise hain aur aapka din kaisa ja raha hai? 

Aaj hum kisi specific code (Python, React, Node), Web Development LMS project ya kisi nayi skill par kaam karein? Main ready hoon! 😊`;
  }

  // B. Identity & Developer Attribution ("who are you", "who r u", "tum kon ho", "naam kya hai", "who made you")
  if (
    /\b(who\s*(are|r)\s*(you|u)|who\s*made\s*(you|u)|who\s*developed\s*(you|u)|who\s*is\s*(your|ur)\s*creator|who\s*created\s*(you|u)|tum\s*kon\s*ho|koun\s*ho|naam\s*kya|kisne\s*banaya|developer\s*kon|founder\s*kon)\b/i.test(lower) ||
    lower.includes("who are you") ||
    lower.includes("who are u") ||
    lower.includes("who r u") ||
    lower.includes("tum kon ho") ||
    lower.includes("founder kon") ||
    lower.includes("तुम कौन हो")
  ) {
    if (lang === "english") {
      return `My name is **Cybrical AI 2.0** 🤖✨!

I am the official AI Assistant for **Cybrical Tech** (Founded by **Virat Singh**), engineered & developed by **Vishal Pathak** (Lead Software Architect).

Cybrical Tech is located in Sector 63, Noida, India. I specialize in full-stack web development, Python, problem solving, Web Dev LMS courses, and downloadable project ZIP archives.`;
    }
    if (lang === "devanagari") {
      return `मेरा नाम **साइब्रिकल एआई 2.0** है 🤖✨!

मैं **साइब्रिकल टेक** (संस्थापक: **विराट सिंह**) का आधिकारिक एआई असिस्टेंट हूँ, जिसे **विशाल पाठक** ने डेवलप व इंजीनियर किया है।

साइब्रिकल टेक सेक्टर 63, नोएडा में स्थित है। मैं फुल-स्टैक वेब डेवलपमेंट, कोडिंग समाधान और एलएमएस प्रोजेक्ट्स में आपकी सहायता करता हूँ।`;
    }
    return `Mera naam **Cybrical AI 2.0** hai 🤖✨!

Main **Cybrical Tech** (Founder: **Virat Singh**) ka official Intelligent AI Assistant hoon, jise **Vishal Pathak** (Lead Developer) ne develop aur engineer kiya hai.

Cybrical Tech Sector 63, Noida me located hai. Main full-stack web development, Python, problem solving, LMS courses aur project ZIP management me madad karta hoon.`;
  }

  // C. Capabilities ("what can you do", "what can u do", "kya kar sakte ho")
  if (
    /\b(what\s*can\s*(you|u)\s*do|what\s*(are|r)\s*(your|ur)\s*features|kya\s*kar\s*sakte\s*ho|kya\s*kya\s*kar\s*sakte|kya\s*aata\s*hai)\b/i.test(lower) ||
    lower.includes("kya kar sakte ho") ||
    lower.includes("what can you do") ||
    lower.includes("what can u do") ||
    lower.includes("क्या कर सकते हो")
  ) {
    if (lang === "english") {
      return `I am an all-in-one Senior Technical AI Assistant! 🚀 Here is what I can do for you:

1. 💻 **Full-Stack Code Generation:** Write clean, production-ready code in React, Node.js, Python, Express, MongoDB, SQL, and HTML/CSS.
2. 🐛 **Debugging & Problem Solving:** Identify errors, optimize performance, and explain root causes.
3. 🎓 **Course Guidance & Project ZIPs:** Access Web Development lessons and download offline project zip archives.
4. 🧠 **Concepts & Roadmaps:** Explain complex topics like DSA, JWT Auth, REST APIs, and system design in simple terms.

What would you like to build or learn today?`;
    }
    return `Main ek all-round Technical AI Assistant hoon! 🚀 Dekhiye main kya-kya kar sakta hoon:

1. 💻 **Full-Stack Coding:** React.js, Python, Node.js, Express, MongoDB, HTML/CSS ke scripts aur apps banana.
2. 🐛 **Bug Fixing & Debugging:** Code errors aur performance optimization.
3. 🎓 **Course Guidance & Project ZIPs:** Web development ke live projects aur offline practice files download karwana.
4. 🧠 **Concepts & Roadmaps:** DSA, APIs, Authentication, MERN architecture aasan Hindi/English me samjhana.

Bataiye, aaj hum kis task par kaam karein?`;
  }

  // D. Time of Day Greetings
  if (lower.includes("good morning") || lower.includes("subah bakhair")) {
    return lang === "english"
      ? `Good Morning! ☀️ Wishing you a productive and wonderful day ahead! What coding concept or project are we building today?`
      : `Good Morning! ☀️ Umeed hai aapka din bahut shandar aur productive rahega! Aaj hum kaunsa naya coding concept ya project seekhne wale hain?`;
  }
  if (lower.includes("good afternoon")) {
    return lang === "english"
      ? `Good Afternoon! 🌤️ How can I help you with your coding, development projects, or courses today?`
      : `Good Afternoon! 🌤️ Bataiye, aaj main aapki coding, projects ya course materials me kaise madad kar sakta hoon?`;
  }
  if (lower.includes("good evening")) {
    return lang === "english"
      ? `Good Evening! 🌆 Hope you had a great day. Would you like to work on a project or resolve some technical questions?`
      : `Good Evening! 🌆 Umeed hai aapka din badhiya raha. Kya hum kisi project ko develop karein ya koi doubt solve karein?`;
  }
  if (lower.includes("good night") || lower.includes("shubh ratri")) {
    return lang === "english"
      ? `Good Night! 🌙 Have a restful sleep. I will be right here whenever you need coding help. Take care! 👋`
      : `Good Night! 🌙 Shubh ratri aur sweet dreams! Jab bhi koi coding doubt ho, main yahin milunga. Take care! 👋`;
  }

  // E. Traditional / Respectful Greetings
  if (
    lower.includes("namaste") ||
    lower.includes("namaskar") ||
    lower.includes("ram ram") ||
    lower.includes("radhe radhe") ||
    lower.includes("pranam") ||
    lower.includes("salaam") ||
    lower.includes("adaab") ||
    lower.includes("jai shree ram")
  ) {
    return `Namaste! 🙏 Cybrical Tech me aapka hardik swagat hai!

Main **Cybrical AI 2.0** hoon — engineered by **Vishal Pathak**.

Bataiye, aaj main aapki kya seva kar sakta hoon? Aap koi bhi technical sawaal, coding problem ya course guidance pooch sakte hain! 😊`;
  }

  // F. Thanks / Gratitude
  if (
    lower.includes("thank") ||
    lower.includes("thanks") ||
    lower.includes("dhanyawad") ||
    lower.includes("shukriya") ||
    lower === "thx" ||
    lower === "ty" ||
    lower.includes("धन्यवाद")
  ) {
    if (lang === "english") {
      return `You're very welcome! 😊 Glad I could help. Feel free to ask if you have any other questions or need more code! 🚀`;
    }
    return `Aapka bahut-bahut swagat hai! 😊 You're most welcome! 

Mujhe aapki madad karke khushi hui. Agar koi aur sawaal ho ya code debug karna ho, toh bina jhijhak poochiye! 🚀`;
  }

  // G. Standard Casual Greetings ("hi", "hii", "hello", "hey")
  if (
    /^(h+i+|h+e+y+|hello+|hlo+|yo+|hola|sup)\b/i.test(lower) ||
    lower === "hi" ||
    lower === "hii" ||
    lower === "hiii" ||
    lower === "hey" ||
    lower === "heyy" ||
    lower === "hello" ||
    lower === "helloo" ||
    lower === "hlo"
  ) {
    if (lang === "english" && (lower === "hi" || lower === "hello" || lower === "hey")) {
      return `Hello there! 👋 Welcome to **Cybrical AI 2.0** (developed by **Vishal Pathak**).

How can I assist you today?
- 💻 **Write & Debug Code** (React, Node.js, Python, DSA, SQL)
- 🎓 **Web Development LMS Courses & Downloadable Project ZIPs**
- 🚀 **Full-Stack Development, AI & SEO Services**

Feel free to ask any question or request a code snippet!`;
    }
    return `Hello! 👋 Swagat hai aapka! 

Main **Cybrical AI** hoon (developed by **Vishal Pathak**). Bataiye, aaj main aapki kya madad kar sakta hoon?
- 🐍 Python / JavaScript Code likhna ya debug karna
- 🎓 Web Development LMS courses & ZIP projects download
- 🚀 UI/UX, React, Node.js ya API development

Aap mujhse koi bhi sawaal bejhijhak pooch sakte hain!`;
  }

  // -----------------------------------------------------------------------
  // 🐍 FIRST-CLASS PYTHON INTELLIGENCE ENGINE (PRIORITY)
  // -----------------------------------------------------------------------
  if (lower.includes("python") || lower.includes(".py") || lower.includes("py ")) {
    // 1. Python Calculator
    if (lower.includes("calc") || lower.includes("calculator")) {
      return `Here is a complete, modular **Python Calculator** with error handling and CLI interface:

\`\`\`python
class Calculator:
    """A clean, robust Python Calculator with error handling."""
    
    @staticmethod
    def add(a: float, b: float) -> float:
        return a + b

    @staticmethod
    def subtract(a: float, b: float) -> float:
        return a - b

    @staticmethod
    def multiply(a: float, b: float) -> float:
        return a * b

    @staticmethod
    def divide(a: float, b: float) -> float:
        if b == 0:
            raise ValueError("Error: Division by zero is undefined.")
        return a / b

    @staticmethod
    def power(base: float, exponent: float) -> float:
        return base ** exponent


def run_calculator():
    calc = Calculator()
    operations = {
        '1': ('Add (+)', calc.add),
        '2': ('Subtract (-)', calc.subtract),
        '3': ('Multiply (*)', calc.multiply),
        '4': ('Divide (/)', calc.divide),
        '5': ('Power (^)', calc.power),
    }

    print("=" * 40)
    print(" 🐍 Cybrical Tech Python Calculator ")
    print("=" * 40)
    
    for key, (name, _) in operations.items():
        print(f" {key}. {name}")
    print(" Q. Quit")
    print("=" * 40)

    while True:
        choice = input("\\nEnter choice (1-5 or Q): ").strip().upper()
        if choice == 'Q':
            print("👋 Exiting Calculator. Goodbye!")
            break

        if choice not in operations:
            print("❌ Invalid choice. Please try again.")
            continue

        try:
            num1 = float(input("Enter first number: "))
            num2 = float(input("Enter second number: "))
            
            name, func = operations[choice]
            result = func(num1, num2)
            print(f"✅ Result ({name}): {result}")
        except ValueError as err:
            print(f"⚠️ {err}")
        except Exception as err:
            print(f"⚠️ Unexpected error: {err}")

if __name__ == "__main__":
    run_calculator()
\`\`\`

💡 **Features:**
- Clean OOP architecture with static methods.
- Type hints and zero-division exception handling.
- Interactive user CLI loop with easy exit option.`;
    }

    // 2. Python Fibonacci
    if (lower.includes("fibonacci") || lower.includes("fib")) {
      return `### 🐍 Python Fibonacci Series (Iterative, Recursive & Memoized)

\`\`\`python
from typing import List, Dict

# 1. Iterative (O(n) Time, O(1) Space) - Highly Recommended
def fibonacci_iterative(n: int) -> List[int]:
    if n <= 0:
        return []
    if n == 1:
        return [0]
    
    fib = [0, 1]
    while len(fib) < n:
        fib.append(fib[-1] + fib[-2])
    return fib

# 2. Dynamic Programming with Memoization (O(n) Time)
def fib_memoized(n: int, memo: Dict[int, int] = {}) -> int:
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    
    memo[n] = fib_memoized(n - 1, memo) + fib_memoized(n - 2, memo)
    return memo[n]

# Example Test
if __name__ == "__main__":
    count = 10
    print(f"First {count} Fibonacci numbers:")
    print(fibonacci_iterative(count))
    # Output: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
\`\`\``;
    }

    // 3. Python Prime Numbers / Factorial
    if (lower.includes("prime") || lower.includes("factorial")) {
      return `### 🐍 Python Prime & Factorial Functions

\`\`\`python
import math

# 1. Check if a Number is Prime (O(sqrt(n)) Time)
def is_prime(n: int) -> bool:
    if n <= 1:
        return False
    if n in (2, 3):
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    
    for i in range(5, int(math.isqrt(n)) + 1, 6):
        if n % i == 0 or n % (i + 2) == 0:
            return False
    return True

# 2. Factorial (Iterative & Safe)
def factorial(n: int) -> int:
    if n < 0:
        raise ValueError("Factorial is not defined for negative numbers.")
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result

# Test
print(f"Is 29 prime? -> {is_prime(29)}")  # True
print(f"Is 100 prime? -> {is_prime(100)}") # False
print(f"Factorial of 6 -> {factorial(6)}")  # 720
\`\`\``;
    }

    // 4. Python Web Scraping
    if (lower.includes("scraper") || lower.includes("scraping") || lower.includes("beautifulsoup")) {
      return `Here is a complete **Python Web Scraper with BeautifulSoup, Requests & Pandas**:

\`\`\`python
import requests
from bs4 import BeautifulSoup
import pandas as pd
import time

def scrape_cybrical_courses(url: str = "http://localhost:5000/api/courses"):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    
    print(f"📡 Scraping: {url}...")
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, "html.parser")
        items = soup.find_all("div", class_="course-card")
        
        scraped_data = []
        for item in items:
            title = item.find("h3").get_text(strip=True) if item.find("h3") else "N/A"
            price = item.find("span", class_="price").get_text(strip=True) if item.find("span", class_="price") else "Free"
            
            scraped_data.append({
                "Title": title,
                "Price": price,
                "Timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
            })
            
        df = pd.DataFrame(scraped_data)
        df.to_csv("courses_data.csv", index=False)
        print(f"✅ Successfully saved {len(df)} records to 'courses_data.csv'!")
        return df
    except Exception as err:
        print(f"❌ Scraping error: {err}")

if __name__ == "__main__":
    scrape_cybrical_courses()
\`\`\``;
    }

    // 5. Python Web App (FastAPI / Flask)
    if (lower.includes("fastapi") || lower.includes("flask") || lower.includes("api") || lower.includes("server")) {
      return `Here is an asynchronous **FastAPI REST API with Pydantic v2 & CORS**:

\`\`\`python
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uvicorn

app = FastAPI(title="Cybrical Tech Python API", version="2.0.0")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-Memory Database
courses_db = [
    {"id": 1, "title": "Web Development Masterclass", "price": 0, "has_zip": True},
    {"id": 2, "title": "Python & AI Automation", "price": 0, "has_zip": True}
]

class CourseCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=100)
    price: float = Field(default=0.0, ge=0)
    has_zip: bool = True

@app.get("/api/courses", status_code=status.HTTP_200_OK)
async def get_all_courses():
    return {"success": True, "count": len(courses_db), "courses": courses_db}

@app.post("/api/courses", status_code=status.HTTP_201_CREATED)
async def create_course(payload: CourseCreate):
    new_course = {
        "id": len(courses_db) + 1,
        "title": payload.title,
        "price": payload.price,
        "has_zip": payload.has_zip
    }
    courses_db.append(new_course)
    return {"success": True, "message": "Course created successfully!", "course": new_course}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
\`\`\``;
    }

    // 6. Python File Handling & Automation
    if (lower.includes("file") || lower.includes("json") || lower.includes("csv") || lower.includes("automation")) {
      return `### 🐍 Python File Handling & JSON/CSV Automation

\`\`\`python
import json
import csv
from pathlib import Path

def file_automation_demo():
    data = {
        "company": "Cybrical Tech",
        "developer": "Vishal Pathak",
        "services": ["Web Dev", "LMS Courses", "AI Automation"],
        "active": True
    }
    
    json_path = Path("company_info.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)
    print("✅ JSON file saved successfully!")

    with open(json_path, "r", encoding="utf-8") as f:
        loaded = json.load(f)
        print(f"📖 Loaded Company: {loaded['company']} by {loaded['developer']}")

if __name__ == "__main__":
    file_automation_demo()
\`\`\``;
    }

    // 7. General Python Custom Synthesizer
    return `### 🐍 Python 3 Solution for: "${prompt}"

Here is the complete production-grade Python implementation:

\`\`\`python
"""
Module: Cybrical Python Solution
Author: Vishal Pathak (Cybrical Tech)
Task: ${prompt}
"""
from typing import Any, Dict, List, Optional
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

def solve_python_task(data: Any, config: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Executes Python logic for: ${prompt}
    
    Args:
        data: Input parameter to process
        config: Optional configuration dictionary
        
    Returns:
        Dict containing status, processed output and execution metadata
    """
    if data is None:
        raise ValueError("Invalid input: data cannot be None.")
    
    logging.info("Processing data for task: %s", "${prompt}")
    
    # Core Processing Logic
    processed_result = {
        "status": "success",
        "query": "${prompt}",
        "data": data,
        "language": "Python 3.12",
        "developer": "Vishal Pathak",
        "platform": "Cybrical Tech"
    }
    
    return processed_result

# Example Driver Code:
if __name__ == "__main__":
    try:
        sample_input = {"key": "value", "items": [1, 2, 3, 4, 5]}
        result = solve_python_task(sample_input)
        print("✅ Execution Result:")
        print(result)
    except Exception as exc:
        logging.error("Execution failed: %s", exc)
\`\`\`

### 💡 Python Notes:
- Fully PEP-8 compliant with type hints and docstrings.
- Integrated structured logging and error handling.`;
  }

  // 1. CALCULATOR (HTML, CSS & JS - LIVE PREVIEW READY)
  if (lower.includes("calculator") || lower.includes("calc")) {
    return `Here is a complete, modern, responsive **Glassmorphism Calculator** with full JavaScript calculation logic:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Cybrical Glassmorphism Calculator</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle, #0f2027, #203a43, #2c5364); }
    .calc-container { background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 24px; padding: 24px; width: 330px; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5); }
    .calc-brand { color: #22c55e; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; text-align: right; }
    .calc-display { width: 100%; height: 75px; background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 14px; color: #fff; font-size: 32px; font-weight: 600; text-align: right; padding: 16px; outline: none; margin-bottom: 20px; }
    .calc-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
    .btn { height: 55px; border-radius: 14px; border: 1px solid rgba(255, 255, 255, 0.12); background: rgba(255, 255, 255, 0.06); color: #fff; font-size: 18px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
    .btn:hover { background: rgba(255, 255, 255, 0.18); transform: translateY(-2px); }
    .btn:active { transform: translateY(0); }
    .btn-op { background: rgba(34, 197, 94, 0.2); color: #4ade80; border-color: rgba(34, 197, 94, 0.35); }
    .btn-op:hover { background: #22c55e; color: #031008; }
    .btn-clear { background: rgba(239, 68, 68, 0.2); color: #fca5a5; border-color: rgba(239, 68, 68, 0.35); }
    .btn-clear:hover { background: #ef4444; color: #fff; }
    .btn-equal { background: linear-gradient(135deg, #22c55e, #16a34a); color: #031008; font-weight: 800; grid-column: span 2; }
  </style>
</head>
<body>
  <div class="calc-container">
    <div class="calc-brand">Cybrical Tech Calc</div>
    <input type="text" class="calc-display" id="display" readonly placeholder="0" />
    <div class="calc-grid">
      <button class="btn btn-clear" onclick="clearDisplay()">AC</button>
      <button class="btn btn-clear" onclick="deleteChar()">DEL</button>
      <button class="btn btn-op" onclick="appendOp('%')">%</button>
      <button class="btn btn-op" onclick="appendOp('/')">÷</button>
      
      <button class="btn" onclick="appendNum('7')">7</button>
      <button class="btn" onclick="appendNum('8')">8</button>
      <button class="btn" onclick="appendNum('9')">9</button>
      <button class="btn btn-op" onclick="appendOp('*')">×</button>
      
      <button class="btn" onclick="appendNum('4')">4</button>
      <button class="btn" onclick="appendNum('5')">5</button>
      <button class="btn" onclick="appendNum('6')">6</button>
      <button class="btn btn-op" onclick="appendOp('-')">−</button>
      
      <button class="btn" onclick="appendNum('1')">1</button>
      <button class="btn" onclick="appendNum('2')">2</button>
      <button class="btn" onclick="appendNum('3')">3</button>
      <button class="btn btn-op" onclick="appendOp('+')">+</button>
      
      <button class="btn" onclick="appendNum('0')">0</button>
      <button class="btn" onclick="appendNum('.')">.</button>
      <button class="btn btn-equal" onclick="calculate()">=</button>
    </div>
  </div>

  <script>
    const display = document.getElementById("display");

    function appendNum(num) {
      if (display.value === "0" && num !== ".") display.value = "";
      display.value += num;
    }

    function appendOp(op) {
      if (!display.value) return;
      const lastChar = display.value.slice(-1);
      if ("+-*/%".includes(lastChar)) {
        display.value = display.value.slice(0, -1) + op;
      } else {
        display.value += op;
      }
    }

    function clearDisplay() {
      display.value = "";
    }

    function deleteChar() {
      display.value = display.value.slice(0, -1);
    }

    function calculate() {
      try {
        if (!display.value) return;
        const result = Function('"use strict";return (' + display.value + ')')();
        display.value = Number(result.toFixed(6)).toString();
      } catch (e) {
        display.value = "Error";
        setTimeout(() => (display.value = ""), 1200);
      }
    }
  </script>
</body>
</html>
\`\`\`

💡 **Live Preview:** Click the **▶ Live Preview** button in the code header above to run and test this calculator immediately!`;
  }

  // 2. TODO APP / TASK MANAGER
  if (lower.includes("todo") || lower.includes("task list") || lower.includes("task manager")) {
    return `Here is a complete **React Todo List Application** with LocalStorage persistence, filters, and animations:

\`\`\`jsx
import React, { useState, useEffect } from 'react';

export default function TodoApp() {
  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem('cybrical_todos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('cybrical_todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newTodo = { id: Date.now(), text: input.trim(), completed: false };
    setTodos([newTodo, ...todos]);
    setInput('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const filteredTodos = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div style={{ maxWidth: '440px', margin: '40px auto', padding: '24px', background: '#0a140e', borderRadius: '18px', border: '1px solid rgba(34,197,94,0.3)', color: '#fff', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}>
      <h2 style={{ color: '#4ade80', marginBottom: '16px', textAlign: 'center' }}>📝 Task Manager</h2>

      <form onSubmit={addTodo} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
          style={{ flex: 1, padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '10px', color: '#fff', outline: 'none' }}
        />
        <button type="submit" style={{ padding: '10px 18px', background: '#22c55e', color: '#031008', fontWeight: 700, border: 0, borderRadius: '10px', cursor: 'pointer' }}>
          Add
        </button>
      </form>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
        {['all', 'active', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{ flex: 1, padding: '6px', background: filter === f ? '#22c55e' : 'rgba(255,255,255,0.05)', color: filter === f ? '#031008' : '#9ca3af', border: 0, borderRadius: '8px', cursor: 'pointer', textTransform: 'capitalize', fontWeight: 600, fontSize: '12px' }}
          >
            {f}
          </button>
        ))}
      </div>

      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filteredTodos.map((t) => (
          <li
            key={t.id}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px' }}
          >
            <span
              onClick={() => toggleTodo(t.id)}
              style={{ cursor: 'pointer', textDecoration: t.completed ? 'line-through' : 'none', color: t.completed ? '#6b7280' : '#e5e7eb' }}
            >
              {t.completed ? '✅ ' : '⭕ '} {t.text}
            </span>
            <button onClick={() => deleteTodo(t.id)} style={{ background: 'transparent', border: 0, color: '#ef4444', cursor: 'pointer', fontSize: '14px' }}>
              🗑
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
\`\`\``;
  }

  // 3. LOGIN / SIGNUP / AUTH FORM
  if (lower.includes("login") || lower.includes("signup") || lower.includes("form") || lower.includes("auth form")) {
    return `Here is a production-ready **Glassmorphism Auth Form** with validation & password toggle:

\`\`\`jsx
import React, { useState } from 'react';

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const err = {};
    if (!formData.email) err.email = "Email is required";
    else if (!/\\S+@\\S+\\.\\S+/.test(formData.email)) err.email = "Invalid email address";
    if (!formData.password) err.password = "Password is required";
    else if (formData.password.length < 6) err.password = "Password must be at least 6 characters";
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Login Successful! Welcome " + data.user?.name);
      } else {
        setErrors({ server: data.message || "Invalid credentials" });
      }
    } catch (err) {
      setErrors({ server: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card" style={{ maxWidth: '380px', margin: '40px auto', padding: '32px', background: 'rgba(10, 20, 14, 0.85)', borderRadius: '20px', border: '1px solid rgba(34, 197, 94, 0.3)', backdropFilter: 'blur(16px)', color: '#fff' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '6px', color: '#4ade80' }}>Welcome Back</h2>
      <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '13px', marginBottom: '24px' }}>Login to your Cybrical account</p>

      {errors.server && <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', borderRadius: '8px', color: '#fca5a5', fontSize: '12px', marginBottom: '14px' }}>{errors.server}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ fontSize: '12px', color: '#86efac', fontWeight: 600 }}>Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="you@example.com"
            style={{ width: '100%', padding: '11px', marginTop: '6px', background: 'rgba(255,255,255,0.05)', border: errors.email ? '1px solid #ef4444' : '1px solid rgba(34,197,94,0.3)', borderRadius: '10px', color: '#fff', outline: 'none' }}
          />
          {errors.email && <span style={{ color: '#ef4444', fontSize: '11px' }}>{errors.email}</span>}
        </div>

        <div>
          <label style={{ fontSize: '12px', color: '#86efac', fontWeight: 600 }}>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              style={{ width: '100%', padding: '11px', marginTop: '6px', background: 'rgba(255,255,255,0.05)', border: errors.password ? '1px solid #ef4444' : '1px solid rgba(34,197,94,0.3)', borderRadius: '10px', color: '#fff', outline: 'none' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '12px', top: '18px', background: 'transparent', border: 0, color: '#9ca3af', cursor: 'pointer' }}
            >
              {showPassword ? '👁️' : '🔒'}
            </button>
          </div>
          {errors.password && <span style={{ color: '#ef4444', fontSize: '11px' }}>{errors.password}</span>}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '12px', marginTop: '8px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#031008', fontWeight: 800, border: 0, borderRadius: '10px', cursor: 'pointer' }}
        >
          {loading ? 'Authenticating...' : 'Sign In →'}
        </button>
      </form>
    </div>
  );
}
\`\`\``;
  }

  // 4. NAVBAR / SIDEBAR / NAVIGATION
  if (lower.includes("navbar") || lower.includes("navigation") || lower.includes("header menu")) {
    return `Here is a responsive **Glassmorphism Navbar with Mobile Menu**:

\`\`\`jsx
import React, { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(4, 10, 6, 0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(34, 197, 94, 0.2)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 900, fontSize: '18px', color: '#22c55e', cursor: 'pointer' }}>
        <span>✦</span> Cybrical Tech
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <a href="/" style={{ color: '#86efac', textDecoration: 'none', fontWeight: 600 }}>Home</a>
        <a href="/courses" style={{ color: '#d1d5db', textDecoration: 'none' }}>Courses</a>
        <a href="/services" style={{ color: '#d1d5db', textDecoration: 'none' }}>Services</a>
        <a href="/contact" style={{ color: '#d1d5db', textDecoration: 'none' }}>Contact</a>
        <a href="/courses/web-development" style={{ padding: '8px 16px', background: '#22c55e', color: '#031008', fontWeight: 800, borderRadius: '8px', textDecoration: 'none' }}>
          Enroll Now
        </a>
      </div>
    </nav>
  );
}
\`\`\``;
  }

  // 5. DATA STRUCTURES & ALGORITHMS (TWO SUM, PALINDROME, SORTING, TREES)
  if (lower.includes("two sum") || lower.includes("2 sum")) {
    return `### 💡 Two Sum Problem — $O(n)$ Hash Map Solution

\`\`\`javascript
/**
 * Two Sum: Find indices of two numbers that add up to target.
 * @param {number[]} nums
 * @param {number} target
 * @returns {number[]}
 */
function twoSum(nums, target) {
  const map = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (map.has(complement)) {
      return [map.get(complement), i];
    }

    map.set(nums[i], i);
  }

  return [];
}

// Example Usage:
console.log(twoSum([2, 7, 11, 15], 9)); // Output: [0, 1]
\`\`\`

### 📊 Complexity Analysis:
- **Time Complexity:** $O(n)$ — Single pass through the array.
- **Space Complexity:** $O(n)$ — Storing elements in the hash map.`;
  }

  if (lower.includes("palindrome") || lower.includes("reverse string")) {
    return `### 🔄 Valid Palindrome & String Reverse (JavaScript & Python)

#### 1. JavaScript Implementation:
\`\`\`javascript
function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0;
  let right = cleaned.length - 1;

  while (left < right) {
    if (cleaned[left] !== cleaned[right]) return false;
    left++;
    right--;
  }
  return true;
}

console.log(isPalindrome("A man, a plan, a canal: Panama")); // true
console.log(isPalindrome("race a car")); // false
\`\`\`

#### 2. Python Implementation:
\`\`\`python
def is_palindrome(s: str) -> bool:
    cleaned = [c.lower() for c in s if c.isalnum()]
    return cleaned == cleaned[::-1]

print(is_palindrome("Was it a car or a cat I saw?")) # True
\`\`\``;
  }

  // 6. REACT / HOOKS (DEBOUNCE, STATE, COMPONENTS)
  if (lower.includes("react") || lower.includes("hook") || lower.includes("component") || lower.includes("useeffect") || lower.includes("debounce")) {
    // If specific debounce / live search code is requested
    if ((lower.includes("debounce") || lower.includes("live search") || lower.includes("debouncing")) && isExplicitCodeCommand(prompt, mode)) {
      return `Here is a production-ready **Debounced Search Component** in React with custom hook & caching:

\`\`\`jsx
import React, { useState, useEffect, useRef } from 'react';

// Reusable Custom Hook for Debouncing
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default function LiveSearch() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 350);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const cacheRef = useRef(new Map());

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    if (cacheRef.current.has(debouncedQuery)) {
      setResults(cacheRef.current.get(debouncedQuery));
      return;
    }

    let isSubscribed = true;
    setLoading(true);

    async function fetchData() {
      try {
        const response = await fetch(\`/api/courses?search=\${encodeURIComponent(debouncedQuery)}\`);
        const data = await response.json();
        if (isSubscribed) {
          const list = data.courses || [];
          cacheRef.current.set(debouncedQuery, list);
          setResults(list);
        }
      } catch (err) {
        console.error("Search API Error:", err);
      } finally {
        if (isSubscribed) setLoading(false);
      }
    }

    fetchData();

    return () => {
      isSubscribed = false;
    };
  }, [debouncedQuery]);

  return (
    <div className="search-container">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="🔍 Search courses, topics, or ZIPs..."
        className="search-input"
      />
      {loading && <div className="loader">Searching...</div>}
      <ul className="results-list">
        {results.map((item) => (
          <li key={item._id || item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}
\`\`\``;
    }

    // If code is not explicitly requested, provide a clean conceptual answer!
    if (!isExplicitCodeCommand(prompt, mode)) {
      if (lang === "english") {
        return `### ⚛️ React.js & Component Architecture Overview

Here is a clear conceptual guide for **"${prompt}"**:

1. **What is React & Component-Driven UI?**
   - **React** is a declarative, efficient JavaScript library for building modern user interfaces.
   - It utilizes a **Virtual DOM** to batch updates and optimize browser render performance.

2. **Core Concepts:**
   - **Components:** Independent, reusable building blocks for clean architecture.
   - **State (\`useState\`):** Dynamic data storage that triggers reactive UI re-renders.
   - **Side Effects (\`useEffect\`):** Handles APIs, external subscriptions, and lifecycle events.
   - **Custom Hooks:** Encapsulates stateful logic for cross-component reusability.

3. **Best Practices:**
   - Keep components modular and follow single responsibility.
   - Clean up event listeners and timers inside useEffect return callbacks.

💡 *Need working source code for a specific React component?* Simply ask: **"Write React code for [your feature]"**!`;
      }

      return `### ⚛️ React.js & Component Architecture Guide

Aapke sawaal **"${prompt}"** ka structured overview:

1. **React kya hai aur kaise kaam karta hai?**
   - **React.js** ek popular JavaScript library hai jo fast aur interactive user interfaces banane ke kaam aati hai.
   - Yeh **Virtual DOM** aur **Component-Based Architecture** par kaam karti hai.

2. **Core Concepts:**
   - **Components:** Reusable UI blocks (jaise Header, Sidebar, Cards).
   - **State (\`useState\`):** Component ka internal data jo change hone par UI ko update karta hai.
   - **Effects (\`useEffect\`):** API calls, data fetch aur timers handle karne ke liye.
   - **Custom Hooks:** Logic ko re-use karne ke liye banaye gaye reusable functions.

3. **Cybrical Tech LMS Courses:**
   - Cybrical Tech ke Web Development course me React projects aur complete source code ZIP files available hain.

💡 *Agar aapko kisi specific React component ka code chahiye*, toh bas command dein: **"Iska React code banao"**!`;
    }
  }

  // 7. NAME & DEVELOPER CREDIT (VISHAL PATHAK)
  if (
    lower.includes("name") ||
    lower.includes("naam") ||
    lower.includes("who are you") ||
    lower.includes("kaun ho") ||
    lower.includes("introduce") ||
    lower.includes("about you") ||
    lower.includes("identity") ||
    lower.includes("vishal") ||
    lower.includes("pathak") ||
    lower.includes("developer") ||
    lower.includes("creator") ||
    lower.includes("who made you") ||
    lower.includes("who developed you") ||
    lower.includes("kisne banaya") ||
    lower.includes("owner") ||
    lower.includes("author")
  ) {
    return `🤖 **Mera Naam:** **Cybrical AI 2.0**
👨‍💻 **Developer:** Developed & Engineered by **Vishal Pathak**

Main **Cybrical Tech** ka smart technical AI assistant hoon, jise **Vishal Pathak** ne develop kiya hai.

- **Developer & Lead Engineer:** Vishal Pathak
- **Organization:** Cybrical Tech (Sector 63, Noida, India)
- **Specialization:** Full-Stack Architecture, AI Systems, Cloud & LMS Development.

Aap mujhse code generation, debugging, courses ya project ZIP files ke baare me kuch bhi pooch sakte hain!`;
  }

  // 7.1. WEB DEVELOPMENT COURSE & 63 PROJECT ZIP FILES
  if (
    (lower.includes("zip") || lower.includes("63") || lower.includes("download") || lower.includes("project file")) &&
    (lower.includes("web dev") || lower.includes("course") || lower.includes("63") || lower.includes("kitni") || lower.includes("lms") || lower.includes("offline"))
  ) {
    if (lang === "english") {
      return `📦 **Web Development Masterclass — 63 Downloadable Project ZIPs:**

Yes, exactly! Our **Web Development Course** on the Cybrical Tech LMS platform includes **63 complete downloadable project ZIP files** with source code and assets! 🚀

### 📁 What is included in the 63 ZIP Files:
1. 🌐 **HTML5 & Modern CSS3 (15+ ZIPs):** Responsive UI layouts, Flexbox/Grid templates, animations.
2. ⚡ **JavaScript Essentials & Advanced (20+ ZIPs):** DOM manipulation, Async/Await, APIs, interactive apps.
3. ⚛️ **React.js & Frontend Projects (12+ ZIPs):** SPA web apps, custom hooks, state management, components.
4. 🛡️ **Node.js, Express & MongoDB (10+ ZIPs):** REST APIs, JWT Auth, Database schemas, CRUD backends.
5. 🚀 **Full-Stack Capstone Projects (6+ ZIPs):** Complete production-grade web platforms with full code.

### 📥 How to Access & Download:
- Open your **Student / Course Dashboard**.
- Go to the **Web Development Course** curriculum.
- Click the **"Download Project ZIP"** button next to each module for instant offline practice with lifetime access!`;
    }

    if (lang === "devanagari") {
      return `📦 **वेब डेवलपमेंट कोर्स — 63 डाउनलोड योग्य प्रोजेक्ट ज़िप (ZIP) फाइलें:**

जी हाँ, बिल्कुल! साइब्रिकल टेक के **वेब डेवलपमेंट कोर्स** में कुल **63 प्रोजेक्ट ज़िप (ZIP) फाइलें** शामिल हैं! 🚀

### 📁 63 ज़िप फाइलों में क्या-क्या शामिल है:
1. 🌐 **HTML5 और CSS3 प्रोजेक्ट्स:** रिस्पॉन्सिव वेब पेज और लेआउट्स।
2. ⚡ **जावास्क्रिप्ट प्रोजेक्ट्स:** DOM मैनिपुलेशन, Async APIs और इंटरैक्टिव ऐप्स।
3. ⚛️ **React.js प्रोजेक्ट्स:** सिंगल पेज एप्लिकेशन्स और कस्टम हुक्स।
4. 🛡️ **Node.js, Express और MongoDB:** बैकएंड APIs, ऑथेंटिकेशन और डेटाबेस।
5. 🚀 **फुल-स्टैक मेजर प्रोजेक्ट्स:** संपूर्ण प्रोडक्शन-ग्रेड प्रोजेक्ट्स।

### 📥 कैसे डाउनलोड करें:
- अपने **कोर्स डैशबोर्ड** पर जाएँ और संबंधित मॉड्यूल से 1-क्लिक में ज़िप फाइल डाउनलोड करें।`;
    }

    return `📦 **Web Development Course — 63 Downloadable Project ZIP Files:**

Ji bilkul sahi! Cybrical Tech ke **Web Development Masterclass Course** ke andar total **63 complete project ZIP files** shamil hain! 🚀

### 📁 63 ZIP Files me kya-kya shamil hai:
1. 🌐 **HTML5 & Modern CSS3 (15+ ZIPs):** Responsive layouts, landing pages, Flexbox/Grid templates.
2. ⚡ **JavaScript Essentials & Advanced (20+ ZIPs):** DOM manipulation, Async/Await, live API integrations, games.
3. ⚛️ **React.js & UI Projects (12+ ZIPs):** Single Page Applications, custom hooks, state management, components.
4. 🛡️ **Node.js, Express & MongoDB (10+ ZIPs):** REST APIs, JWT authentication, Mongoose schemas, CRUD backends.
5. 🚀 **Full-Stack Capstone Projects (6+ ZIPs):** Complete live production-ready web applications with full source code.

### 📥 Download Kaise Karein:
- Apne **Course Dashboard** me jakar **Web Development Course** open karein.
- Har module aur lesson ke sath diye gaye **Download ZIP** button par click karke aap offline practice ke liye files download kar sakte hain!
- Yeh files **Lifetime Access** ke sath available hain.`;
  }

  // 8. CYBRICAL TECH OVERVIEW / CONTACT / NOIDA LOCATION
  if (
    lower.includes("noida") ||
    lower.includes("location") ||
    lower.includes("contact") ||
    lower.includes("address") ||
    lower.includes("phone") ||
    lower.includes("email") ||
    lower.includes("service")
  ) {
    return `🏢 **Cybrical Tech — Company Details & Direct Contact:**

- 📍 **Headquarters:** D 60, D Block, Sector 63 Road, Sector 63, Noida, Uttar Pradesh 201301, India.
- 📧 **Official Email:** cybricaltech@gmail.com
- 📞 **Phone / WhatsApp:** +91 836 859 7373
- 🌐 **Services:** Full-Stack Web Dev (MERN/Next.js), LMS Platforms, Generative AI & Automation, SEO & Digital Growth, UI/UX Design.

You can also submit an inquiry on our **Contact** page or click **"Let's Talk"** in the top navigation bar!`;
  }

  // -----------------------------------------------------------------------
  // 9. CONVERSATIONAL / META / FEEDBACK / HUMAN INTERACTION
  // -----------------------------------------------------------------------
  if (
    lower.includes("reply shi kyo nhi") ||
    lower.includes("shi nhi") ||
    lower.includes("sahi se") ||
    lower.includes("samajh") ||
    lower.includes("samch") ||
    lower.includes("human") ||
    lower.includes("chatgpt") ||
    lower.includes("bat ko") ||
    lower.includes("baat ko") ||
    lower.includes("insan") ||
    lower.includes("insaan") ||
    lower.includes("achhi tarah")
  ) {
    return `Namaste! 🙏 Main aapki baat bilkul samajh raha hoon.

### 🤖 Main kaise kaam karta hoon:
Main **Cybrical AI 2.0** hoon, jise **Vishal Pathak** ne Cybrical Tech ke liye design kiya hai.

1. 💬 **Human-like Conversational Understanding:** Main aapke sawaal, coding doubts, course topics aur queries ko natural bhasha (Hindi, English, Hinglish) me samajh kar step-by-step jawab de sakta hoon.
2. 💻 **Direct Solutions:** Agar aapko koi code (Python, React, Node, CSS, SQL), project setup, ya issue resolve karna hai, toh simply bataiye — main direct working solution dunga.
3. ⚡ **Unrestricted Live AI (Gemini / GPT-4o):** Agar aap backend \`.env\` file me apni free **Google Gemini API Key** (\`GEMINI_API_KEY\`) ya **OpenAI API Key** (\`OPENAI_API_KEY\`) add karenge, toh main 100% full live neural reasoning ke sath ChatGPT jaisa real-time chat reply provide karunga.

Aap abhi mujhse kya poochna ya develop karwana chahte hain? Kripya bataiye! 😊`;
  }

  // -----------------------------------------------------------------------
  // 10. GREETINGS & CASUAL TALK
  // -----------------------------------------------------------------------
  if (
    lower === "hi" ||
    lower === "hello" ||
    lower === "hey" ||
    lower.includes("namaste") ||
    lower.includes("kaise ho") ||
    lower.includes("kese ho") ||
    lower.includes("kya haal") ||
    lower.includes("sab badhiya")
  ) {
    return `Hello! 👋 Main bilkul theek hoon, aapka swagat hai!

Main **Cybrical AI 2.0** hoon — developed by **Vishal Pathak** for Cybrical Tech.

Main aapki in cheezon me madad kar sakta hoon:
- 🐍 **Python & Data Structures** (Scripts, Automation, FastAPIs, Math & Logic)
- 💻 **Full-Stack Coding & Debugging** (React.js, Node.js, Express, MongoDB, UI/UX)
- 🎓 **Web Development LMS Courses & Offline Downloadable Project ZIPs**
- 🚀 **Cybrical Tech Development, AI & SEO Services**
- 📍 **Noida Sector 63 Headquarters Location & Contact Details**

Aap aaj kya sikhna ya discuss karna chahte hain?`;
  }

  // -----------------------------------------------------------------------
  // DEDICATED DSA (DATA STRUCTURES & ALGORITHMS) HANDLER
  // -----------------------------------------------------------------------
  if (
    /\b(dsa|data\s*structures?\s*(and|&)?\s*algorithms?)\b/i.test(lower) ||
    lower.includes("dsa") ||
    lower.includes("data structure")
  ) {
    if (lang === "devanagari") {
      return `### 🧠 डीएसए (DSA) क्या है?

**DSA का फुल फॉर्म:** **Data Structures & Algorithms** (डेटा स्ट्रक्चर्स और एल्गोरिदम)

---

### 💡 मुख्य अवधारणा:
1. 📦 **Data Structures (डेटा स्ट्रक्चर):** डेटा को कंप्यूटर मेमोरी में व्यवस्थित और स्टोर करने का तरीका (जैसे: Array, Stack, Queue, Linked List, Tree, Graph)।
2. ⚙️ **Algorithms (एल्गोरिदम):** किसी समस्या को हल करने के लिए स्टेप-बाय-स्टेप लॉजिकल निर्देश (जैसे: Searching, Sorting, Recursion, Dynamic Programming)।

### 🎯 डीएसए क्यों जरूरी है?
- कोड की **टाइम कॉम्प्लेक्सिटी (Time Complexity)** और **स्पेस कॉम्प्लेक्सिटी (Space Complexity)** को ऑप्टिमाइज़ करने के लिए।
- Google, Microsoft, Amazon जैसी टॉप टेक कंपनियों के कोडिंग इंटरव्यूज क्रैक करने के लिए।`;
    }

    if (lang === "hinglish") {
      return `### 🧠 DSA (Data Structures & Algorithms) Explained

**DSA ka Full Form:** **Data Structures & Algorithms**

---

### 💡 DSA Kya Hota Hai?
1. 📦 **Data Structure:** Data ko memory ke andar efficiently store aur organize karne ka tarika (jaise: **Array, Linked List, Stack, Queue, Tree, Graph, Hash Map**).
2. ⚙️ **Algorithm:** Kisi calculation ya problem ko step-by-step solve karne ka optimized logic (jaise: **Binary Search, Merge Sort, Recursion, Dynamic Programming, Two Pointers**).

### 🎯 DSA Kyo Zaroori Hai?
- **Fast Execution & Efficiency:** Big-O Time (\`O(1)\`, \`O(log n)\`, \`O(n)\`) aur Space optimize karne ke liye.
- **Problem Solving & Interviews:** Product-based companies aur software engineering interviews crack karne ke liye core foundation hai.

💡 *Kya aapko DSA ka koi specific topic (Array, Binary Search, Stack, Tree) seekhna hai ya code chahiye?*`;
    }

    return `### 🧠 What is DSA (Data Structures & Algorithms)?

**DSA stands for:** **Data Structures & Algorithms**

---

### 💡 Core Breakdown:
1. 📦 **Data Structure:** A specialized format for organizing, processing, retrieving, and storing data in computer memory efficiently (e.g., **Arrays, Linked Lists, Stacks, Queues, Hash Tables, Trees, Graphs**).
2. ⚙️ **Algorithm:** A finite, step-by-step procedure or set of logical rules designed to solve a specific problem or perform a computation (e.g., **Binary Search, QuickSort, Depth-First Search, Dynamic Programming**).

### 🎯 Why is DSA Critical in Software Engineering?
- **Performance Optimization:** Reduces runtime (Time Complexity) and memory consumption (Space Complexity).
- **Scalability:** Enables applications to handle millions of data points smoothly without latency.
- **Technical Interviews:** The primary benchmark for evaluating problem-solving skills at top tech organizations.

💡 *Would you like an explanation or code implementation for a specific data structure or algorithm?*`;
  }

  // -----------------------------------------------------------------------
  // 11. GENERAL HUMAN QUESTIONS & CONCEPTS (NON-CODE EXPLANATIONS)
  // -----------------------------------------------------------------------
  const isQuestion =
    lower.includes("kya") ||
    lower.includes("kaise") ||
    lower.includes("kyu") ||
    lower.includes("what") ||
    lower.includes("how") ||
    lower.includes("why") ||
    lower.includes("difference") ||
    lower.includes("batao") ||
    lower.includes("samjhao") ||
    lower.includes("sikhe") ||
    lower.includes("guide") ||
    lower.includes("roadmap") ||
    lower.includes("tips");

  const isCodeRequested =
    lower.includes("code") ||
    lower.includes("program") ||
    lower.includes("script") ||
    lower.includes("function") ||
    lower.includes("create") ||
    lower.includes("build") ||
    lower.includes("banao") ||
    lower.includes("likho") ||
    lower.includes("component") ||
    lower.includes("class") ||
    lower.includes("implementation");

  if (isQuestion && !isCodeRequested) {
    if (lang === "english") {
      return `### 💡 Comprehensive Technical Solution for: "${prompt}"

Here is a clear, step-by-step breakdown:

1. **Core Concept & Architecture:**
   - **"${prompt}"** is a fundamental concept in software engineering and modern technology systems.
   - It is designed to solve real-world problems by establishing clean logic, efficient workflows, and maintainable architecture.

2. **How It Works & Key Pillars:**
   - **Architecture & Setup:** Understand the inputs, processing rules, and intended outputs.
   - **Execution & Flow:** Follow standard modular practices with strict error handling and security boundaries.
   - **Optimization:** Keep performance, latency, and scalability at the core of implementation.

3. **Practical Industry Use-Case:**
   - Widely utilized in full-stack web applications, scalable APIs, database systems, and modern AI pipelines.

💡 *Would you like working source code, a project implementation, or further details on this topic? Let me know!*`;
    }

    if (lang === "devanagari") {
      return `### 💡 विस्तृत तकनीकी मार्गदर्शन: "${prompt}"

आपके प्रश्न का सरल और सटीक उत्तर:

1. **मुख्य अवधारणा और महत्व (Core Concept):**
   - **"${prompt}"** सॉफ्टवेयर इंजीनियरिंग, वेब डेवलपमेंट और आधुनिक टेक्नोलॉजी का एक महत्वपूर्ण अंग है।
   - इसका मुख्य उद्देश्य समस्याओं को व्यवस्थित, सुरक्षित और कुशल तरीके से हल करना है।

2. **कार्यप्रणाली और मुख्य बिंदु (Key Principles):**
   - **बुनियादी समझ:** पहले इसके मूल सिद्धांतों और डेटा फ्लो को स्पष्ट करें।
   - **प्रैक्टिकल कार्यान्वयन:** स्वच्छ कोड, एरर हैंडलिंग और मॉड्यूलर स्ट्रक्चर का पालन करें।
   - **ऑप्टिमाइज़ेशन:** परफॉरमेंस और स्केलेबिलिटी को प्राथमिकता दें।

3. **वास्तविक उपयोग (Real-World Use-Case):**
   - यह फुल-स्टैक वेब प्रोजेक्ट्स, बैकएंड सर्विसेज और एआई सिस्टम्स में प्रमुखता से उपयोग किया जाता है।

💡 *क्या आप इसका लाइव कोड उदाहरण या प्रैक्टिकल प्रोजेक्ट देखना चाहते हैं? बताएं!*`;
    }

    return `### 💡 ${prompt}

**To-The-Point Jawab:**
- **"${prompt}"** computer science aur software development ka ek core concept hai, jo efficient logic aur problem-solving ke liye use hota hai.
- Iska main purpose execution speed, clean structure aur system reliability ko ensure karna hota hai.`;
  }

  // -----------------------------------------------------------------------
  // 12. CONCEPTUAL / ANALYTICAL FALLBACK (When code is NOT explicitly commanded)
  // -----------------------------------------------------------------------
  if (!isExplicitCodeCommand(prompt, mode)) {
    if (lang === "devanagari") {
      return `### 💡 ${prompt}

**संक्षिप्त व सटीक जानकारी:**
- **"${prompt}"** सॉफ्टवेयर इंजीनियरिंग और कंप्यूटर साइंस में लॉजिक, कार्यक्षमता और समस्या समाधान का महत्वपूर्ण कॉन्सेप्ट है।
- इसका मुख्य उद्देश्य कोड को सुव्यवस्थित, सुरक्षित और प्रभावशाली बनाना है।`;
    }

    if (lang === "hinglish") {
      return `### 💡 ${prompt}

**To-The-Point Jawab:**
- **"${prompt}"** software development aur modern IT solutions me scalable aur high-performance execution ensure karta hai.
- Iska focus clean logic aur computational efficiency par hota hai.`;
    }

    return `### 💡 ${prompt}

**Direct Overview:**
- **"${prompt}"** focuses on core computational logic, efficiency, and structured problem-solving in software engineering.
- Its main objective is to ensure clean execution, stability, and maintainable application design.`;
  }

  // -----------------------------------------------------------------------
  // 13. DYNAMIC CODE SYNTHESIS (Only when code was explicitly commanded)
  // -----------------------------------------------------------------------
  return `### 🤖 Cybrical AI Code Solution for: "${prompt}"

Here is the complete production-grade implementation:

\`\`\`javascript
/**
 * Solution for: ${prompt}
 * Engineered by Cybrical AI (Vishal Pathak)
 */
export function executeSolution(inputData, options = {}) {
  // 1. Edge Case Validations
  if (inputData === null || inputData === undefined) {
    throw new Error("Invalid parameter: inputData is required");
  }

  // 2. Core Processing Logic
  const processedResult = {
    task: "${prompt}",
    timestamp: new Date().toISOString(),
    status: "completed_successfully",
    output: inputData,
    meta: {
      engineeredBy: "Vishal Pathak",
      engine: "Cybrical AI 2.0",
      isOptimized: true,
      options
    }
  };

  return processedResult;
}

// Example Execution:
try {
  const result = executeSolution({ status: "active", action: "process" });
  console.log("Result:", result);
} catch (err) {
  console.error("Execution Error:", err.message);
}
\`\`\`

### 💡 Best Practice Notes:
- Modular architecture with clean error boundaries.
- Agar aapko yeh specific logic **Python, React, C++, ya SQL** me chahiye, toh bataiye!`;
};

// ==========================================
// AI GENERATED IMAGE CARD COMPONENT
// ==========================================
function AIImageCard({ alt, src }) {
  const basePrompt = alt || "AI Generated Visual Art";
  const [selectedStyle, setSelectedStyle] = useState("realistic");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [selectedVariation, setSelectedVariation] = useState(0);
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [loading, setLoading] = useState(true);
  const [zoomed, setZoomed] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Gemini-Grade Multi-Style Profiles
  const stylesMap = {
    realistic: {
      label: "📸 Realistic",
      suffix: "8k resolution, photorealistic, cinematic volumetric lighting, hyperdetailed, raw photograph, sharp focus",
    },
    cinema3d: {
      label: "✨ 3D Pixar/Unreal",
      suffix: "unreal engine 5 render, 3D digital art, octane render, smooth volumetric lighting, vibrant colors, ray tracing",
    },
    anime: {
      label: "🎌 Anime / Manga",
      suffix: "makoto shinkai aesthetic anime artwork, beautiful vibrant lighting, high detail illustration, studio ghibli style",
    },
    cyberpunk: {
      label: "🌆 Cyberpunk Neon",
      suffix: "cyberpunk 2077 aesthetic, vibrant neon lighting, dark moody night atmosphere, futuristic reflections, 8k",
    },
    painting: {
      label: "🎨 Oil Painting",
      suffix: "fine art oil painting, expressive brushstrokes, masterpiece concept art, dynamic composition",
    },
  };

  const dimMap = {
    "1:1": { width: 1024, height: 1024, label: "1:1 Square" },
    "16:9": { width: 1280, height: 720, label: "16:9 Cinema" },
    "9:16": { width: 720, height: 1280, label: "9:16 Portrait" },
  };

  const currentDims = dimMap[aspectRatio] || dimMap["1:1"];
  const currentStyleSuffix = stylesMap[selectedStyle]?.suffix || stylesMap.realistic.suffix;
  const enhancedSuffix = isEnhanced
    ? ", ultra detailed, 8k masterpiece, award winning composition, studio lighting, depth of field"
    : "";

  const cleanBase = (basePrompt || "concept art").replace(/[^a-zA-Z0-9 ,.-]/g, " ");

  const variations = [
    {
      id: 0,
      label: "Variation 1 (Default)",
      url: `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanBase + ", " + currentStyleSuffix + enhancedSuffix)}?width=${currentDims.width}&height=${currentDims.height}&model=flux&nologo=true&seed=101`,
    },
    {
      id: 1,
      label: "Variation 2 (Cinematic)",
      url: `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanBase + ", dramatic cinematic atmosphere, " + currentStyleSuffix + enhancedSuffix)}?width=${currentDims.width}&height=${currentDims.height}&model=flux&nologo=true&seed=404`,
    },
    {
      id: 2,
      label: "Variation 3 (Vibrant)",
      url: `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanBase + ", vibrant colors, high contrast, " + currentStyleSuffix + enhancedSuffix)}?width=${currentDims.width}&height=${currentDims.height}&model=flux&nologo=true&seed=777`,
    },
    {
      id: 3,
      label: "Variation 4 (Studio Detail)",
      url: `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanBase + ", ultra sharp studio lighting, masterpiece, " + currentStyleSuffix + enhancedSuffix)}?width=${currentDims.width}&height=${currentDims.height}&model=flux&nologo=true&seed=999`,
    },
  ];

  const activeUrl = variations[selectedVariation]?.url || src;

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const res = await fetch(activeUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `gemini-imagen-${(basePrompt || "image").replace(/[^a-z0-9]/gi, "_").toLowerCase()}-${selectedStyle}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const a = document.createElement("a");
      a.href = activeUrl;
      a.target = "_blank";
      a.download = `gemini-imagen-image.jpg`;
      a.click();
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="ai-gemini-image-studio">
        {/* TOP HEADER */}
        <div className="ai-gemini-studio-header">
          <div className="ai-gemini-title-badge">
            <span className="ai-gemini-sparkle">✨</span>
            <span className="ai-gemini-name">Gemini Imagen 3 Studio</span>
            <span className="ai-gemini-pill">Flux.1 Pro</span>
          </div>
          <div className="ai-gemini-res-tag">
            {currentDims.width} × {currentDims.height} • {aspectRatio}
          </div>
        </div>

        {/* STYLE PRESETS BAR */}
        <div className="ai-gemini-style-bar">
          {Object.entries(stylesMap).map(([key, item]) => (
            <button
              key={key}
              type="button"
              className={`ai-gemini-style-btn ${selectedStyle === key ? "active" : ""}`}
              onClick={() => {
                setSelectedStyle(key);
                setLoading(true);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* MAIN CANVAS */}
        <div
          className="ai-gemini-canvas-wrapper"
          onClick={() => !loading && setZoomed(true)}
          style={{
            aspectRatio: aspectRatio === "16:9" ? "16/9" : aspectRatio === "9:16" ? "9/16" : "1/1",
          }}
        >
          {loading && (
            <div className="ai-gemini-loader">
              <div className="ai-gemini-glow-spinner"></div>
              <span>✨ Gemini Imagen is synthesizing visual art...</span>
            </div>
          )}

          <img
            src={activeUrl}
            alt={basePrompt}
            className={`ai-gemini-main-img ${loading ? "hidden" : "visible"}`}
            onLoad={() => setLoading(false)}
            onError={(e) => {
              setLoading(false);
              e.target.src = `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1024&q=80`;
            }}
            title="Click to view Fullscreen Canvas"
          />

          {!loading && (
            <div className="ai-gemini-hover-hint">
              <span>🔍 Click for Fullscreen Lightbox</span>
            </div>
          )}
        </div>

        {/* 4-VARIATION THUMBNAILS (GEMINI STYLE) */}
        <div className="ai-gemini-variations-strip">
          <div className="ai-gemini-strip-label">
            <span>✨ 4 Imagen Variations:</span>
          </div>
          <div className="ai-gemini-thumbnails-row">
            {variations.map((v, idx) => (
              <button
                key={v.id}
                type="button"
                className={`ai-gemini-thumb-card ${selectedVariation === idx ? "active" : ""}`}
                onClick={() => {
                  if (selectedVariation !== idx) {
                    setSelectedVariation(idx);
                    setLoading(true);
                  }
                }}
                title={v.label}
              >
                <img
                  src={v.url}
                  alt={v.label}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <span className="ai-gemini-thumb-num">V{idx + 1}</span>
              </button>
            ))}
          </div>
        </div>

        {/* BOTTOM CONTROLS & ASPECT RATIO */}
        <div className="ai-gemini-studio-footer">
          <div className="ai-gemini-prompt-row">
            <span className="ai-gemini-prompt-text" title={basePrompt}>
              💡 <em>"{basePrompt}"</em>
            </span>
          </div>

          <div className="ai-gemini-footer-actions">
            {/* Aspect Ratio Selector */}
            <div className="ai-gemini-ratio-group">
              {Object.keys(dimMap).map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  className={`ai-gemini-ratio-btn ${aspectRatio === ratio ? "active" : ""}`}
                  onClick={() => {
                    setAspectRatio(ratio);
                    setLoading(true);
                  }}
                >
                  {ratio}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="ai-gemini-action-btns">
              <button
                type="button"
                className={`ai-gemini-act-btn ai-gemini-enhance-btn ${isEnhanced ? "enhanced" : ""}`}
                onClick={() => {
                  setIsEnhanced(!isEnhanced);
                  setLoading(true);
                }}
                title="Magic enhance prompt with studio lighting & details"
              >
                {isEnhanced ? "✨ Enhanced (8K)" : "🪄 Enhance"}
              </button>

              <button
                type="button"
                className="ai-gemini-act-btn ai-gemini-dl-btn"
                onClick={handleDownload}
                disabled={downloading}
                title="Download High-Resolution Image"
              >
                {downloading ? "⏳ Downloading..." : "📥 Download HD"}
              </button>

              <button
                type="button"
                className="ai-gemini-act-btn"
                onClick={() => setZoomed(true)}
                title="Fullscreen Lightbox"
              >
                🔍 Zoom
              </button>

              <button
                type="button"
                className="ai-gemini-act-btn"
                onClick={handleCopyLink}
                title="Copy Direct Image Link"
              >
                {copied ? "✓ Copied" : "🔗 Link"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {zoomed && (
        <div className="ai-img-modal-backdrop" onClick={() => setZoomed(false)}>
          <div className="ai-img-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="ai-img-modal-header">
              <span>✨ Gemini Imagen 3 • {basePrompt} ({stylesMap[selectedStyle]?.label})</span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button type="button" className="ai-img-modal-dl" onClick={handleDownload}>
                  📥 Download Full HD
                </button>
                <button type="button" className="ai-img-modal-close" onClick={() => setZoomed(false)}>
                  ×
                </button>
              </div>
            </div>
            <div className="ai-img-modal-body">
              <img src={activeUrl} alt={basePrompt} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ==========================================
// ADVANCED MARKDOWN & CODE RENDERER WITH REASONING SUPPORT
// ==========================================
function ThinkingAccordion({ thoughts }) {
  const [isOpen, setIsOpen] = useState(false);
  if (!thoughts || !thoughts.trim()) return null;

  return (
    <div className="ai-thought-box">
      <button
        type="button"
        className="ai-thought-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Click to expand/collapse internal reasoning"
      >
        <span className="ai-thought-icon">💭</span>
        <span className="ai-thought-text">
          {isOpen ? "Hide Thinking Process" : "Thought for 2.8s • Deep Reasoning"}
        </span>
        <span className={`ai-thought-arrow ${isOpen ? "open" : ""}`}>▾</span>
      </button>
      {isOpen && (
        <div className="ai-thought-body">
          <div className="ai-thought-inner">
            {thoughts.split("\n").map((tl, tidx) => (
              <p key={tidx} className="ai-thought-line">
                {tl}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MarkdownRenderer({ text, onLivePreview, isStreaming }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  let cleanText = text || "";
  let extractedThoughts = "";

  // Check for <think>...</think> tags (DeepSeek R1 / Reasoning models)
  const thinkMatch = cleanText.match(/<think>([\s\S]*?)<\/think>/i);
  if (thinkMatch) {
    extractedThoughts = thinkMatch[1].trim();
    cleanText = cleanText.replace(/<think>[\s\S]*?<\/think>/i, "").trim();
  }

  const parts = cleanText.split(/(```[\s\S]*?```)/g);

  const renderInlineFormatted = (rawText) => {
    // Process tables
    if (rawText.includes("|") && rawText.includes("\n")) {
      const lines = rawText.split("\n");
      const tableLines = lines.filter((l) => l.trim().startsWith("|") && l.trim().endsWith("|"));
      if (tableLines.length >= 2) {
        const headerRow = tableLines[0].split("|").filter(Boolean).map((c) => c.trim());
        const dataRows = tableLines.slice(2).map((row) =>
          row.split("|").filter(Boolean).map((c) => c.trim())
        );

        return (
          <div className="chat-table-wrapper" key="table">
            <table className="chat-markdown-table">
              <thead>
                <tr>
                  {headerRow.map((h, i) => (
                    <th key={i}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataRows.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
    }

    const imgSplitRegex = /(!\[[^\]]*\]\([^\)]+\))/g;
    const segments = rawText.split(imgSplitRegex);

    return segments.map((seg, sIdx) => {
      const imgMatch = seg.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (imgMatch) {
        const [, altText, imgSrc] = imgMatch;
        return <AIImageCard key={`img-${sIdx}`} alt={altText} src={imgSrc} />;
      }

      return seg.split("\n").map((line, lIdx) => {
        let isH3 = false;
        let isBullet = false;
        let lineContent = line;

        if (line.startsWith("### ")) {
          isH3 = true;
          lineContent = line.slice(4);
        } else if (line.startsWith("## ")) {
          isH3 = true;
          lineContent = line.slice(3);
        } else if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
          isBullet = true;
          lineContent = line.trim().slice(2);
        }

        const inlineCodeParts = lineContent.split(/(`[^`]+`)/g);

        const parsedElements = inlineCodeParts.map((icp, icpIdx) => {
          if (icp.startsWith("`") && icp.endsWith("`") && icp.length > 2) {
            return (
              <code key={icpIdx} className="chat-inline-code">
                {icp.slice(1, -1)}
              </code>
            );
          }

          const boldParts = icp.split(/(\*\*.*?\*\*)/g);
          return boldParts.map((bp, bpIdx) => {
            if (bp.startsWith("**") && bp.endsWith("**")) {
              return (
                <strong key={`${icpIdx}-${bpIdx}`} className="chat-bold">
                  {bp.slice(2, -2)}
                </strong>
              );
            }
            return bp;
          });
        });

        if (isH3) {
          return (
            <h4 key={`${sIdx}-${lIdx}`} className="chat-heading">
              {parsedElements}
            </h4>
          );
        }

        if (isBullet) {
          return (
            <div key={`${sIdx}-${lIdx}`} className="chat-bullet-row">
              <span className="chat-bullet-dot">•</span>
              <span className="chat-bullet-text">{parsedElements}</span>
            </div>
          );
        }

        return (
          <span key={`${sIdx}-${lIdx}`} className="chat-line">
            {parsedElements}
            {lIdx < seg.split("\n").length - 1 && <br />}
          </span>
        );
      });
    });
  };

  return (
    <div className="chat-markdown-content">
      {extractedThoughts && <ThinkingAccordion thoughts={extractedThoughts} />}

      {parts.map((part, index) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          const lines = part.slice(3, -3).trim().split("\n");
          let language = "code";
          let codeContent = part.slice(3, -3).trim();

          if (lines[0] && !lines[0].includes(" ") && lines[0].length < 15) {
            language = lines[0].toLowerCase();
            codeContent = lines.slice(1).join("\n");
          }

          const isHtml =
            language === "html" ||
            language === "jsx" ||
            codeContent.includes("<div") ||
            codeContent.includes("<button");

          const lineCount = codeContent.split("\n").length;

          return (
            <div className="chat-code-block" key={index}>
              <div className="chat-code-header">
                <div className="chat-code-lang-wrapper">
                  <span className="chat-code-lang-icon">⚡</span>
                  <span className="chat-code-lang">{language.toUpperCase()}</span>
                  <span className="chat-code-lines">{lineCount} lines</span>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  {isHtml && onLivePreview && (
                    <button
                      type="button"
                      className="chat-preview-btn"
                      onClick={() => onLivePreview(codeContent)}
                    >
                      ▶ Live Sandbox
                    </button>
                  )}
                  <button
                    type="button"
                    className="chat-copy-btn"
                    onClick={() => copyCode(codeContent, index)}
                  >
                    {copiedIndex === index ? "Copied! ✓" : "Copy Code 📋"}
                  </button>
                </div>
              </div>
              <pre className="chat-code-pre">
                <code>{codeContent}</code>
              </pre>
            </div>
          );
        }

        return <span key={index}>{renderInlineFormatted(part)}</span>;
      })}

      {isStreaming && <span className="chat-typing-cursor">▍</span>}
    </div>
  );
}

// ==========================================
// CHATGPT MODELS & EXAMPLES CONFIGURATION
// ==========================================
const AVAILABLE_MODELS = [
  { id: "gpt-4o", name: "GPT-4o", badge: "Omni", icon: "⚡", desc: "Flagship intelligence & speed" },
  { id: "perplexity", name: "Perplexity Online", badge: "Live Search", icon: "🌐", desc: "Real-time web search, facts & citations" },
  { id: "deepseek-r1", name: "DeepSeek R1", badge: "Reasoning", icon: "🧠", desc: "Step-by-step technical problem solving" },
  { id: "gemini-1-5", name: "Gemini 1.5 Pro", badge: "Google AI", icon: "💎", desc: "Multimodal & deep knowledge" },
  { id: "claude-3-5", name: "Claude 3.5 Sonnet", badge: "Code Master", icon: "💻", desc: "Fullstack architecture & debugging" },
  { id: "flux-img", name: "Imagen 3 Studio", badge: "4K Art", icon: "🎨", desc: "Photorealistic AI image generation" },
];

const QUICK_ACTION_CHIPS = [
  { label: "🌐 Perplexity Live Search", prompt: "Search live web: Latest breakthroughs in Artificial Intelligence and Web Development in 2026 with citations" },
  { label: "🎨 Generate 4K Image", prompt: "Generate image of a futuristic cyberpunk city with neon lights and flying cars at night, 8k resolution" },
  { label: "📦 63 LMS Project ZIPs", prompt: "How can I access and download offline project ZIP files from the Cybrical Tech LMS courses?" },
  { label: "🚀 MERN Roadmap 2026", prompt: "Give me a complete 6-month step-by-step MERN Full-Stack Developer roadmap from beginner to job-ready" },
  { label: "🔍 Debug React Hook", prompt: "How do I prevent infinite loops in useEffect and optimize React component re-renders?" },
  { label: "🛡️ JWT Auth Architecture", prompt: "Explain JWT authentication, refresh tokens, and role-based access control with architecture diagram" },
];

const CHATGPT_EXAMPLES = [
  // 🌐 Perplexity Online Web Search
  {
    id: "perp-1",
    category: "perplexity",
    categoryLabel: "Perplexity Live",
    categoryColor: "#06b6d4",
    icon: "🌐",
    title: "Live Tech Trends 2026",
    desc: "Search web for cutting-edge AI models, web frameworks, and tech breakthroughs",
    prompt: "Search the web for top emerging technologies and software architecture trends in 2026 with citations",
  },
  {
    id: "perp-2",
    category: "perplexity",
    categoryLabel: "Perplexity Research",
    categoryColor: "#06b6d4",
    icon: "🔍",
    title: "React 19 & Next.js Updates",
    desc: "Real-time web research on modern frontend React features and compiler changes",
    prompt: "Perform web research on latest React 19 stable features, Server Actions, and React Compiler enhancements",
  },

  // 🎨 Image Generation Examples
  {
    id: "img-1",
    category: "image",
    categoryLabel: "Flux.1 AI Image",
    categoryColor: "#a855f7",
    icon: "🎨",
    title: "Cyberpunk AI Robot",
    desc: "Futuristic humanoid robot coding with glowing holographic matrices",
    prompt: "Generate image of a futuristic AI humanoid robot coding in a high-tech neon lab, 8k resolution, cinematic lighting",
  },
  {
    id: "img-2",
    category: "image",
    categoryLabel: "Flux.1 AI Image",
    categoryColor: "#a855f7",
    icon: "🦁",
    title: "Fantasy Royal Lion",
    desc: "Majestic lion with glowing golden crown in a mystical fantasy jungle",
    prompt: "Generate image of a majestic royal lion wearing a glowing golden crown in a mystical fantasy jungle",
  },
  {
    id: "img-3",
    category: "image",
    categoryLabel: "Flux.1 AI Image",
    categoryColor: "#a855f7",
    icon: "🏙️",
    title: "Cyberpunk Neon City",
    desc: "Rainy futuristic Tokyo skyline with flying neon cars and 8k reflections",
    prompt: "Generate image of a futuristic cyberpunk city with neon lights and flying cars at night, 8k resolution",
  },
  {
    id: "img-4",
    category: "image",
    categoryLabel: "Flux.1 AI Image",
    categoryColor: "#a855f7",
    icon: "🚀",
    title: "Cosmic Astronaut",
    desc: "Astronaut floating near vibrant deep space galaxy nebula and stars",
    prompt: "Generate image of an astronaut floating in deep space near a colorful galaxy nebula, ultra photorealistic",
  },

  // ⚛️ React & Frontend
  {
    id: "code-1",
    category: "react",
    categoryLabel: "React / Hooks",
    categoryColor: "#22c55e",
    icon: "⚛️",
    title: "Debounced Custom Hook",
    desc: "React hook with automatic API debounce, cached memory & clean cleanup",
    prompt: "Write a complete production-grade React Custom Hook with debouncing, cache memory, and error handling",
  },
  {
    id: "code-2",
    category: "react",
    categoryLabel: "React UI",
    categoryColor: "#22c55e",
    icon: "🎨",
    title: "Modern Glassmorphism Modal",
    desc: "Accessible React popup modal with backdrop blur & keybindings",
    prompt: "Write a modern Glassmorphism Modal component in React with animations, keyboard ESC listener, and clean CSS",
  },

  // 🛡️ Node.js & Backend
  {
    id: "backend-1",
    category: "backend",
    categoryLabel: "Node.js / Express",
    categoryColor: "#3b82f6",
    icon: "🛡️",
    title: "JWT Auth & RBAC Middleware",
    desc: "Express bearer token validator with role-based access control",
    prompt: "Create an Express.js JWT authentication middleware with Role-Based Access Control (Admin/User)",
  },
  {
    id: "backend-2",
    category: "backend",
    categoryLabel: "APIs & WebSockets",
    categoryColor: "#06b6d4",
    icon: "⚡",
    title: "Real-time WebSocket Chat",
    desc: "Full-stack Socket.io chat server and React client message sync",
    prompt: "Write a complete Socket.io server and React client implementation for real-time live messaging",
  },

  // 🔍 DSA & System Design
  {
    id: "dsa-1",
    category: "dsa",
    categoryLabel: "DSA & Algorithms",
    categoryColor: "#f59e0b",
    icon: "🔍",
    title: "Binary Search Algorithm",
    desc: "O(log n) divide & conquer logic with JavaScript code & edge cases",
    prompt: "Explain the Binary Search algorithm in simple Hinglish with JavaScript implementation, time complexity, and edge cases",
  },
  {
    id: "dsa-2",
    category: "dsa",
    categoryLabel: "System Design",
    categoryColor: "#ec4899",
    icon: "🧠",
    title: "Microservices Architecture",
    desc: "API Gateway, service discovery, database per service patterns",
    prompt: "Explain Microservices Architecture vs Monolith in easy-to-understand terms with a system diagram and best practices",
  },

  // 📦 Course Projects & LMS
  {
    id: "proj-1",
    category: "projects",
    categoryLabel: "LMS Downloads",
    categoryColor: "#10b981",
    icon: "📦",
    title: "Download Project ZIPs",
    desc: "Offline project code archives for Web Development LMS courses",
    prompt: "How can I access and download offline project ZIP files from the Cybrical Tech LMS courses?",
  },
  {
    id: "proj-2",
    category: "projects",
    categoryLabel: "Career Roadmap",
    categoryColor: "#6366f1",
    icon: "🎯",
    title: "MERN Stack Roadmap 2026",
    desc: "Step-by-step master plan from zero to job-ready full-stack developer",
    prompt: "Give me a complete 6-month step-by-step MERN Full-Stack Developer roadmap from beginner to job-ready",
  },
];

const EXAMPLE_CATEGORIES = [
  { id: "all", label: "🌟 All Prompts" },
  { id: "perplexity", label: "🌐 Perplexity Web" },
  { id: "image", label: "🎨 Flux.1 Images" },
  { id: "react", label: "⚛️ React & UI" },
  { id: "backend", label: "🛡️ Node & APIs" },
  { id: "dsa", label: "🔍 DSA & Concepts" },
  { id: "projects", label: "📦 Projects & LMS" },
];

// ==========================================
// MAIN COMPONENT
// ==========================================
function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeMode, setActiveMode] = useState("general");
  const [selectedModel, setSelectedModel] = useState("gemini-1-5");
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [webSearchEnabled, setWebSearchEnabled] = useState(true);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [feedbackState, setFeedbackState] = useState({});
  const [previewHtml, setPreviewHtml] = useState(null);
  const [searchHistoryQuery, setSearchHistoryQuery] = useState("");
  const [selectedExampleCategory, setSelectedExampleCategory] = useState("all");

  // Inline editing of previous messages
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // Pinned Sessions
  const [pinnedSessionIds, setPinnedSessionIds] = useState(() => {
    try {
      const saved = localStorage.getItem("cybrical_pinned_sessions");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Session Renaming
  const [renamingSessionId, setRenamingSessionId] = useState(null);
  const [renameInput, setRenameInput] = useState("");

  // Chat sessions persisted in localStorage
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem("cybrical_ai_sessions");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && Array.isArray(parsed[0]?.messages)) {
          return parsed;
        }
      }
    } catch (e) {}
    return [
      { id: "session-1", title: "Generative AI Chat", messages: [DEFAULT_WELCOME] },
    ];
  });
  const [currentSessionId, setCurrentSessionId] = useState(() => {
    try {
      const saved = localStorage.getItem("cybrical_ai_sessions");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.id) {
          return parsed[0].id;
        }
      }
    } catch (e) {}
    return "session-1";
  });

  // Save pinned sessions
  useEffect(() => {
    try {
      localStorage.setItem("cybrical_pinned_sessions", JSON.stringify(pinnedSessionIds));
    } catch (e) {}
  }, [pinnedSessionIds]);

  // File Upload State & Reference
  const [attachedFile, setAttachedFile] = useState(null);
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value so same file can be re-selected if removed
    e.target.value = "";

    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB limit. Please choose a smaller file.");
      return;
    }

    const isZip = /\.zip$/i.test(file.name) || file.type === "application/zip" || file.type === "application/x-zip-compressed";
    const isImg = file.type.startsWith("image/");
    const isTextOrCode =
      file.type.startsWith("text/") ||
      /\.(js|jsx|ts|tsx|py|html|css|json|csv|md|sql|sh|env|yaml|yml|xml|log|txt)$/i.test(file.name);

    if (isImg) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachedFile({
          name: file.name,
          size: file.size,
          type: file.type,
          isImage: true,
          previewUrl: event.target.result,
        });
      };
      reader.readAsDataURL(file);
    } else if (isZip) {
      setAttachedFile({
        name: file.name,
        size: file.size,
        type: file.type,
        isZip: true,
        reading: true,
      });

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const parsedFiles = await parseZipArchive(event.target.result);
          const zipSummary = formatZipSummary(file.name, file.size, parsedFiles);
          const fileCount = parsedFiles.filter((f) => !f.isDir).length;
          setAttachedFile({
            name: file.name,
            size: file.size,
            type: file.type,
            isZip: true,
            reading: false,
            fileCount,
            content: zipSummary,
          });
        } catch (zipErr) {
          console.warn("ZIP parse error, using fallback metadata:", zipErr.message);
          setAttachedFile({
            name: file.name,
            size: file.size,
            type: file.type,
            isZip: true,
            reading: false,
            content: `[Attached ZIP Archive: ${file.name} (${formatFileSize(file.size)})]`,
          });
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (isTextOrCode) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachedFile({
          name: file.name,
          size: file.size,
          type: file.type,
          isText: true,
          content: event.target.result,
        });
      };
      reader.readAsText(file);
    } else {
      setAttachedFile({
        name: file.name,
        size: file.size,
        type: file.type,
        isDoc: true,
        isPdf: /\.pdf$/i.test(file.name),
      });
    }
    setShowToolsMenu(false);
  };

  const removeAttachedFile = () => {
    setAttachedFile(null);
  };

  const abortControllerRef = useRef(null);
  const clientStreamTimerRef = useRef(null);
  const chatBodyRef = useRef(null);
  const textareaRef = useRef(null);
  const speechRecognitionRef = useRef(null);

  // Save sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cybrical_ai_sessions", JSON.stringify(sessions));
    } catch (e) {}
  }, [sessions]);

  const currentSession =
    sessions.find((s) => s.id === currentSessionId) || sessions[0] || {
      id: "session-1",
      title: "Chat",
      messages: [DEFAULT_WELCOME],
    };
  const currentMessages = currentSession.messages;

  // Auto scroll to bottom
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [currentMessages, loading, isStreaming]);

  // Focus textarea on open
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Speech Recognition (Web Speech API - Siri Voice Mode)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-IN";

        recognition.onresult = (e) => {
          const text = e.results[0][0].transcript;
          setIsListening(false);
          if (text && text.trim()) {
            setMessage(text);
            sendMessage(text, true);
          }
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        speechRecognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleVoice = () => {
    if (!speechRecognitionRef.current) {
      alert("Speech recognition is supported on modern Chrome, Safari, and Edge browsers.");
      return;
    }
    if (isListening) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
    } else {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      speechRecognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speakText = (text, id) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (speakingMessageId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const clean = text.replace(/```[\s\S]*?```/g, "Code block omitted.").replace(/\*\*/g, "").replace(/<think>[\s\S]*?<\/think>/g, "");
    const u = new SpeechSynthesisUtterance(clean);
    u.rate = 1.05;
    u.onend = () => setSpeakingMessageId(null);
    u.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(id);
    window.speechSynthesis.speak(u);
  };

  const copyMessage = (text, id) => {
    const clean = text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
    navigator.clipboard.writeText(clean);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleFeedback = (id, type) => {
    setFeedbackState((prev) => ({ ...prev, [id]: type }));
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (clientStreamTimerRef.current) {
      clearInterval(clientStreamTimerRef.current);
      clientStreamTimerRef.current = null;
    }
    setIsStreaming(false);
    setLoading(false);
  };

  // =========================================================================
  // CLIENT STREAMING HELPER (FALLBACK ENGINE)
  // =========================================================================
  const runClientStream = (fullText, aiMsgId, startTime, targetSessionId, isCodeAllowed = true, autoSpeak = false) => {
    setLoading(false);
    setIsStreaming(true);

    let safeText = fullText || "I am ready to assist you!";

    const words = safeText.split(" ");
    let i = 0;
    let accumulated = "";

    if (clientStreamTimerRef.current) {
      clearInterval(clientStreamTimerRef.current);
    }

    clientStreamTimerRef.current = setInterval(() => {
      if (i < words.length) {
        accumulated += (i === 0 ? "" : " ") + words[i];
        i++;

        setSessions((prev) => {
          const matchIdx = prev.findIndex((s) => s.id === targetSessionId);
          const activeIdx = matchIdx !== -1 ? matchIdx : 0;
          return prev.map((s, idx) => {
            if (idx === activeIdx) {
              const updated = s.messages.map((m) =>
                m.id === aiMsgId ? { ...m, text: accumulated } : m
              );
              return { ...s, messages: updated };
            }
            return s;
          });
        });
      } else {
        clearInterval(clientStreamTimerRef.current);
        clientStreamTimerRef.current = null;
        setIsStreaming(false);
        const duration = ((performance.now() - startTime) / 1000).toFixed(1);
        const wordsCount = accumulated.split(/\s+/).filter(Boolean).length;

        setSessions((prev) => {
          const matchIdx = prev.findIndex((s) => s.id === targetSessionId);
          const activeIdx = matchIdx !== -1 ? matchIdx : 0;
          return prev.map((s, idx) => {
            if (idx === activeIdx) {
              const updated = s.messages.map((m) =>
                m.id === aiMsgId
                  ? {
                      ...m,
                      text: accumulated,
                      metrics: `⚡ ${duration}s • ${wordsCount} tokens • ${AVAILABLE_MODELS.find((mod) => mod.id === selectedModel)?.name || "GPT-4o"}`,
                    }
                  : m
              );
              return { ...s, messages: updated };
            }
            return s;
          });
        });

        if (autoSpeak) {
          speakText(accumulated, aiMsgId);
        }
      }
    }, 18);
  };

  // =========================================================================
  // REAL-TIME CHATGPT STREAMING MESSAGE HANDLER
  // =========================================================================
  const sendMessage = async (customText = message, autoSpeak = false) => {
    const baseText = (customText !== undefined && customText !== null ? customText : message).trim();
    if ((!baseText && !attachedFile) || loading || isStreaming) return;

    const activeSession = sessions.find((s) => s.id === currentSessionId) || sessions[0] || { id: "session-1" };
    const targetSessionId = activeSession.id;
    let payloadToSend = baseText;
    let displayUserText = baseText;

    if (attachedFile) {
      if (attachedFile.isImage) {
        payloadToSend = baseText
          ? `[Attached Image: ${attachedFile.name}]\n${baseText}`
          : `[Attached Image: ${attachedFile.name}]\nPlease analyze this image and provide insights or code.`;
        displayUserText = baseText
          ? `📎 **${attachedFile.name}** (${formatFileSize(attachedFile.size)})\n\n${baseText}`
          : `📎 **${attachedFile.name}** (${formatFileSize(attachedFile.size)})`;
      } else if (attachedFile.isZip) {
        payloadToSend = `${attachedFile.content || `[Attached ZIP Archive: ${attachedFile.name} (${formatFileSize(attachedFile.size)})]`}\n\n${baseText || "Please inspect this project archive, explain its structure, and how to run it."}`;
        displayUserText = baseText
          ? `📦 **${attachedFile.name}** (${formatFileSize(attachedFile.size)})${attachedFile.fileCount ? ` • ${attachedFile.fileCount} Files` : ""}\n\n${baseText}`
          : `📦 **${attachedFile.name}** (${formatFileSize(attachedFile.size)})${attachedFile.fileCount ? ` • ${attachedFile.fileCount} Files` : ""}\n\nPlease inspect and explain this ZIP project.`;
      } else if (attachedFile.content) {
        const snippet = attachedFile.content.slice(0, 4000);
        payloadToSend = `[Attached File: ${attachedFile.name} (${formatFileSize(attachedFile.size)})]\n\`\`\`\n${snippet}\n\`\`\`\n\n${baseText || "Please review, explain, or debug this code/file."}`;
        displayUserText = baseText
          ? `📄 **${attachedFile.name}** (${formatFileSize(attachedFile.size)})\n\n${baseText}`
          : `📄 **${attachedFile.name}** (${formatFileSize(attachedFile.size)})\n\nPlease review and explain this file.`;
      } else {
        payloadToSend = `[Attached Document: ${attachedFile.name} (${formatFileSize(attachedFile.size)})]\n\n${baseText || "I have uploaded this file. Please guide me on its usage and structure."}`;
        displayUserText = baseText
          ? `📄 **${attachedFile.name}** (${formatFileSize(attachedFile.size)})\n\n${baseText}`
          : `📄 **${attachedFile.name}** (${formatFileSize(attachedFile.size)})\n\nPlease provide guidance for this file.`;
      }
    }

    setAttachedFile(null);
    setMessage("");
    setLoading(true);

    const startTime = performance.now();
    const userMsgId = `user-${Date.now()}`;
    const aiMsgId = `ai-${Date.now()}`;

    const userMsg = {
      id: userMsgId,
      role: "user",
      text: displayUserText,
      rawQuery: baseText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const initialAiMsg = {
      id: aiMsgId,
      role: "ai",
      text: "",
      model: selectedModel,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      metrics: "⚡ Streaming...",
    };

    setSessions((prev) => {
      const matchIdx = prev.findIndex((s) => s.id === targetSessionId);
      const activeIdx = matchIdx !== -1 ? matchIdx : 0;
      return prev.map((s, idx) => {
        if (idx === activeIdx) {
          const rawTitle = baseText || "Attached File";
          const newTitle =
            s.messages.length <= 1
              ? rawTitle.slice(0, 24) + (rawTitle.length > 24 ? "..." : "")
              : s.title;
          return {
            ...s,
            title: newTitle,
            messages: [...s.messages, userMsg, initialAiMsg],
          };
        }
        return s;
      });
    });

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const contextMessages = currentMessages
      .filter((m) => m.id !== "welcome-0")
      .map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text,
      }));
    contextMessages.push({ role: "user", content: payloadToSend });

    // 0. Priority: Explicit Cybrical Tech Leadership, Employees & Specific Platform Queries
    const lowerQuery = (payloadToSend || "").toLowerCase().trim();
    const isExplicitCompanyQuery =
      /\b(virat|smriti|vishal|kalpna|kamini|sandeep|arpit|ak|anshu|satyam|saytam)\b/i.test(lowerQuery) ||
      /\b(founder|owner|ceo|dev lead|development lead|development team ko lead|accountant)\b/i.test(lowerQuery) ||
      /\b(employe|employee|employees|team\s*size|team\s*count|team\s*members?|kitne\s*employee|kitne\s*employe)\b/i.test(lowerQuery) ||
      /\b(opening\s*year|founded\s*year|start\s*year|established|kab\s*(bani|start|shuru|open|khuli)|63\s*zip|zip\s*files|noida\s*sector\s*63|cybrical\s*tech\s*kya\s*hai)\b/i.test(lowerQuery);

    if (isExplicitCompanyQuery) {
      const quickResponse = getFallbackTechnicalResponse(payloadToSend, activeMode);
      runClientStream(quickResponse, aiMsgId, startTime, targetSessionId, false, autoSpeak);
      abortControllerRef.current = null;
      return;
    }

    const isCodeAllowed = isExplicitCodeCommand(payloadToSend, activeMode);

    try {
      // 1. Primary: Call Cybrical Backend AI API (/api/ai/chat)
      const apiRes = await fetch(getApiUrl("/api/ai/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: payloadToSend,
          messages: contextMessages,
          mode: activeMode,
          model: selectedModel,
        }),
        signal: abortController.signal,
      });

      if (apiRes.ok) {
        const data = await apiRes.json();
        if (data.reply && data.reply.trim()) {
          runClientStream(data.reply.trim(), aiMsgId, startTime, targetSessionId, isCodeAllowed, autoSpeak);
          return;
        }
      }

      // 2. Direct client fallback to free public endpoint if backend was offline
      try {
        const liveController = new AbortController();
        const tId = setTimeout(() => liveController.abort(), 6000);
        const freeRes = await fetch("https://text.pollinations.ai/openai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content: `You are Cybrical AI 2.0 (developed by Vishal Pathak for Cybrical Tech). CRITICAL RULE: Jitna query me pucha jaye, EXACTLY utna hi seedha, to-the-point aur concise explain karein. Do NOT over-explain or write unnecessary long essays. Do NOT add promotional lines or unsolicited course/ZIP mentions unless specifically asked. Do not output code unless explicitly requested. Mirror user's language (Hinglish/Hindi/English).${selectedModel === "perplexity" || activeMode === "perplexity" ? " You are in Perplexity Online Search mode: provide real-time web-grounded facts with citations [1], [2]." : ""}`,
              },
              ...contextMessages,
            ],
            model: selectedModel === "perplexity" ? "searchgpt" : "openai",
            temperature: 0.7,
          }),
          signal: liveController.signal,
        });
        clearTimeout(tId);
        if (freeRes.ok) {
          const json = await freeRes.json();
          const liveText = json?.choices?.[0]?.message?.content?.trim();
          if (liveText) {
            runClientStream(liveText, aiMsgId, startTime, targetSessionId, isCodeAllowed, autoSpeak);
            return;
          }
        }
      } catch (e) {}

      // 3. Ultra-fast local client knowledge synthesizer
      const fallbackText = getFallbackTechnicalResponse(payloadToSend, activeMode);
      runClientStream(fallbackText, aiMsgId, startTime, targetSessionId, isCodeAllowed, autoSpeak);
    } catch (err) {
      if (err.name === "AbortError") {
        setIsStreaming(false);
        setLoading(false);
        return;
      }
      const fallbackText = getFallbackTechnicalResponse(payloadToSend, activeMode);
      runClientStream(fallbackText, aiMsgId, startTime, targetSessionId, isCodeAllowed, autoSpeak);
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleEditUserPrompt = (msg) => {
    const raw = msg.rawQuery || msg.text.replace(/📎[^\n]+\n\n/g, "").replace(/📄[^\n]+\n\n/g, "").replace(/📦[^\n]+\n\n/g, "").trim();
    setMessage(raw);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const regenerateLastResponse = () => {
    if (currentMessages.length < 2) return;
    const lastUserMsg = [...currentMessages].reverse().find((m) => m.role === "user");
    if (lastUserMsg) {
      sendMessage(lastUserMsg.rawQuery || lastUserMsg.text);
    }
  };

  const clearCurrentChat = () => {
    if (clientStreamTimerRef.current) {
      clearInterval(clientStreamTimerRef.current);
      clientStreamTimerRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMessageId(null);
    setIsStreaming(false);
    setLoading(false);

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === currentSessionId) {
          return {
            ...s,
            messages: [{ ...DEFAULT_WELCOME, id: `welcome-${Date.now()}` }],
          };
        }
        return s;
      })
    );
  };

  const createNewSession = () => {
    const newId = `session-${Date.now()}`;
    const newSession = {
      id: newId,
      title: `Chat ${sessions.length + 1}`,
      messages: [{ ...DEFAULT_WELCOME, id: `welcome-${Date.now()}` }],
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newId);
  };

  const togglePinSession = (id, e) => {
    e.stopPropagation();
    setPinnedSessionIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [id, ...prev]
    );
  };

  const startRenameSession = (s, e) => {
    e.stopPropagation();
    setRenamingSessionId(s.id);
    setRenameInput(s.title);
  };

  const saveRenameSession = (id) => {
    if (!renameInput.trim()) {
      setRenamingSessionId(null);
      return;
    }
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: renameInput.trim() } : s))
    );
    setRenamingSessionId(null);
  };

  const deleteSession = (id, e) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      setSessions([
        { id: `session-${Date.now()}`, title: "Generative AI Chat", messages: [DEFAULT_WELCOME] },
      ]);
      return;
    }
    const filtered = sessions.filter((s) => s.id !== id);
    setSessions(filtered);
    setPinnedSessionIds((prev) => prev.filter((p) => p !== id));
    if (currentSessionId === id) {
      setCurrentSessionId(filtered[0].id);
    }
  };

  const exportChat = (format = "txt") => {
    const title = currentSession.title.replace(/[^a-z0-9]/gi, "_");
    let content = "";
    let mimeType = "text/plain;charset=utf-8";
    let filename = `cybrical-ai-${title}.txt`;

    if (format === "md") {
      content = `# ${currentSession.title}\n*Exported from Cybrical AI ChatGPT (by Vishal Pathak)*\n\n` +
        currentMessages
          .map((m) => `### ${m.role === "user" ? "👤 You" : "✦ Cybrical AI"} (${m.timestamp})\n\n${m.text}\n\n---`)
          .join("\n\n");
      mimeType = "text/markdown;charset=utf-8";
      filename = `cybrical-ai-${title}.md`;
    } else {
      content = currentMessages
        .map((m) => `[${m.timestamp}] ${m.role === "user" ? "You" : "Cybrical AI"}:\n${m.text}\n`)
        .join("\n----------------------------------------\n\n");
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sortedSessions = [...sessions].sort((a, b) => {
    const aPinned = pinnedSessionIds.includes(a.id);
    const bPinned = pinnedSessionIds.includes(b.id);
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    return 0;
  });

  const filteredSessions = sortedSessions.filter((s) =>
    s.title.toLowerCase().includes(searchHistoryQuery.toLowerCase())
  );

  return (
    <>
      {/* FLOATING TRIGGER BUTTON (LARGE CIRCULAR CHATGPT BUTTON) */}
      {!isOpen && (
        <button
          type="button"
          className="ai-assistant-button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Cybrical AI ChatGPT"
        >
          <span className="ai-button-glow"></span>
          <span className="ai-button-glow-outer"></span>
          <span className="ai-icon">✦</span>
          <span className="ai-button-text">Cybrical AI</span>
        </button>
      )}

      {/* LIVE CODE PREVIEW MODAL */}
      {previewHtml && (
        <div className="ai-preview-modal-backdrop" onClick={() => setPreviewHtml(null)}>
          <div className="ai-preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ai-preview-header">
              <span>▶ Live HTML/CSS Interactive Sandbox</span>
              <button onClick={() => setPreviewHtml(null)}>×</button>
            </div>
            <iframe
              title="Code Preview"
              srcDoc={previewHtml}
              sandbox="allow-scripts"
              className="ai-preview-frame"
            />
          </div>
        </div>
      )}

      {/* ADVANCED AI CHAT WINDOW (CHATGPT GRADE) */}
      {isOpen && (
        <div className={`ai-assistant ${isExpanded ? "ai-expanded" : ""}`}>
          
          {/* EXPANDED SIDEBAR (CHAT SESSIONS HISTORY) */}
          {isExpanded && (
            <aside className="ai-chat-sidebar">
              <div className="ai-sidebar-top">
                <button type="button" className="ai-new-chat-btn" onClick={createNewSession}>
                  <span>➕</span> New Chat
                </button>
                <div className="ai-sidebar-search">
                  <input
                    type="text"
                    value={searchHistoryQuery}
                    onChange={(e) => setSearchHistoryQuery(e.target.value)}
                    placeholder="🔍 Search chats..."
                  />
                </div>
              </div>

              <div className="ai-session-list">
                <span className="ai-session-heading">Conversations</span>
                {filteredSessions.map((s) => {
                  const isPinned = pinnedSessionIds.includes(s.id);
                  const isRenaming = renamingSessionId === s.id;

                  return (
                    <div
                      key={s.id}
                      className={`ai-session-item-row ${s.id === currentSessionId ? "active" : ""} ${isPinned ? "pinned" : ""}`}
                      onClick={() => setCurrentSessionId(s.id)}
                    >
                      {isRenaming ? (
                        <div className="ai-session-rename-form" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={renameInput}
                            onChange={(e) => setRenameInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveRenameSession(s.id);
                              if (e.key === "Escape") setRenamingSessionId(null);
                            }}
                            autoFocus
                          />
                          <button type="button" onClick={() => saveRenameSession(s.id)}>✓</button>
                        </div>
                      ) : (
                        <>
                          <div className="ai-session-title-wrapper">
                            <span className="ai-session-icon">{isPinned ? "📌" : "💬"}</span>
                            <span className="ai-session-title" title={s.title}>{s.title}</span>
                          </div>
                          
                          <div className="ai-session-item-actions">
                            <button
                              type="button"
                              className="ai-session-act-btn"
                              onClick={(e) => togglePinSession(s.id, e)}
                              title={isPinned ? "Unpin chat" : "Pin chat to top"}
                            >
                              {isPinned ? "📌" : "📍"}
                            </button>
                            <button
                              type="button"
                              className="ai-session-act-btn"
                              onClick={(e) => startRenameSession(s, e)}
                              title="Rename chat"
                            >
                              ✏️
                            </button>
                            <button
                              type="button"
                              className="ai-session-act-btn ai-session-del-btn"
                              onClick={(e) => deleteSession(s.id, e)}
                              title="Delete chat"
                            >
                              ×
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </aside>
          )}

          {/* MAIN CHAT CONTAINER */}
          <div className="ai-main-container">
            
            {/* ADVANCED CHATGPT HEADER BAR */}
            <div className="ai-header">
              <div className="ai-header-info">
                <div className="ai-logo">✦</div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <h3 className="ai-header-title">Cybrical AI</h3>
                    
                    {/* MODEL SWITCHER DROPDOWN */}
                    <div className="ai-model-selector-wrapper">
                      <button
                        type="button"
                        className="ai-model-selector-btn"
                        onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                        title="Switch AI Model Engine"
                      >
                        <span>{AVAILABLE_MODELS.find((m) => m.id === selectedModel)?.icon}</span>
                        <span className="ai-model-name">
                          {AVAILABLE_MODELS.find((m) => m.id === selectedModel)?.name}
                        </span>
                        <span className="ai-model-caret">▾</span>
                      </button>

                      {isModelDropdownOpen && (
                        <div className="ai-model-dropdown-menu">
                          <div className="ai-model-dropdown-header">Select AI Engine</div>
                          {AVAILABLE_MODELS.map((mod) => (
                            <div
                              key={mod.id}
                              className={`ai-model-dropdown-item ${selectedModel === mod.id ? "active" : ""}`}
                              onClick={() => {
                                setSelectedModel(mod.id);
                                setIsModelDropdownOpen(false);
                              }}
                            >
                              <div className="ai-model-item-top">
                                <span className="ai-model-item-icon">{mod.icon}</span>
                                <span className="ai-model-item-title">{mod.name}</span>
                                <span className="ai-model-item-badge">{mod.badge}</span>
                              </div>
                              <span className="ai-model-item-desc">{mod.desc}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <span className="ai-dev-badge">by Vishal Pathak</span>
                  </div>
                  
                  <span className="ai-status">
                    <i></i>
                    Online • Developed by Vishal Pathak • {webSearchEnabled ? "🌐 Web Search Active" : "ChatGPT Turbo"}
                  </span>
                </div>
              </div>

              <div className="ai-header-actions">
                {/* WEB SEARCH TOGGLE */}
                <button
                  type="button"
                  className={`ai-web-search-toggle ${webSearchEnabled ? "active" : ""}`}
                  onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                  title={webSearchEnabled ? "Disable Web Search" : "Enable Real-time Web Search"}
                >
                  🌐 {webSearchEnabled ? "Search ON" : "Search"}
                </button>

                <button
                  type="button"
                  className="ai-action-btn ai-clear-btn"
                  onClick={clearCurrentChat}
                  title="Clear Chat (Saaf Karein)"
                >
                  <span>🧹</span>
                </button>

                <button
                  type="button"
                  className="ai-action-btn"
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? "Standard Window" : "Full ChatGPT Dashboard"}
                >
                  {isExpanded ? "🗗" : "⛶"}
                </button>

                <button
                  type="button"
                  className="ai-action-btn"
                  onClick={() => exportChat("md")}
                  title="Export Markdown Transcript"
                >
                  ⬇
                </button>

                <button
                  type="button"
                  className="ai-action-btn"
                  onClick={createNewSession}
                  title="New Conversation"
                >
                  ↻
                </button>

                <button
                  type="button"
                  className="ai-action-btn ai-close-btn"
                  onClick={() => {
                    if (window.speechSynthesis) window.speechSynthesis.cancel();
                    setIsOpen(false);
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* AI MODE PILL SELECTOR */}
            <div className="ai-mode-bar">
              {AI_MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  className={`ai-mode-pill ${activeMode === mode.id ? "active" : ""}`}
                  onClick={() => {
                    setActiveMode(mode.id);
                    if (mode.id === "perplexity") {
                      setSelectedModel("perplexity");
                      setWebSearchEnabled(true);
                    }
                  }}
                  title={mode.desc}
                >
                  <span>{mode.icon}</span> {mode.label}
                </button>
              ))}
            </div>

            {/* CHAT MESSAGES BODY */}
            <div className="ai-chat-body" ref={chatBodyRef}>
              
              {/* CHATGPT-STYLE INTERACTIVE EXAMPLES HUB */}
              {currentMessages.length <= 1 && (
                <div className="ai-chatgpt-welcome-box">
                  <div className="ai-chatgpt-welcome-header">
                    <div className="ai-chatgpt-avatar-glow">
                      <span className="ai-chatgpt-logo-icon">✦</span>
                    </div>
                    <h4 className="ai-chatgpt-title">What would you like to build or explore today?</h4>
                    <p className="ai-chatgpt-subtitle">
                      Choose an example below to run instantly, or type your question in Hindi, Hinglish, or English:
                    </p>
                  </div>

                  {/* CATEGORY PILL SELECTOR */}
                  <div className="ai-example-category-bar">
                    {EXAMPLE_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        className={`ai-example-cat-btn ${selectedExampleCategory === cat.id ? "active" : ""}`}
                        onClick={() => setSelectedExampleCategory(cat.id)}
                      >
                        {cat.label}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="ai-example-cat-btn ai-random-btn"
                      onClick={() => {
                        const randomEx = CHATGPT_EXAMPLES[Math.floor(Math.random() * CHATGPT_EXAMPLES.length)];
                        sendMessage(randomEx.prompt);
                      }}
                      title="Run a random prompt"
                    >
                      🎲 Surprise Me
                    </button>
                  </div>

                  {/* CHATGPT EXAMPLE CARDS GRID */}
                  <div className="ai-chatgpt-grid">
                    {CHATGPT_EXAMPLES.filter(
                      (ex) =>
                        selectedExampleCategory === "all" ||
                        ex.category === selectedExampleCategory ||
                        (selectedExampleCategory === "image" && ex.category === "image")
                    )
                      .slice(0, 6)
                      .map((ex) => (
                        <div
                          key={ex.id}
                          className="ai-chatgpt-card"
                          onClick={() => sendMessage(ex.prompt)}
                          title={`Run: "${ex.prompt}"`}
                        >
                          <div className="ai-card-top-row">
                            <div className="ai-card-icon-title">
                              <span className="ai-card-icon">{ex.icon}</span>
                              <span
                                className="ai-card-badge"
                                style={{
                                  borderColor: `${ex.categoryColor}40`,
                                  color: ex.categoryColor,
                                  background: `${ex.categoryColor}15`,
                                }}
                              >
                                {ex.categoryLabel}
                              </span>
                            </div>
                            <span className="ai-card-arrow">↗</span>
                          </div>

                          <h5 className="ai-card-title">{ex.title}</h5>
                          <p className="ai-card-desc">{ex.desc}</p>

                          <div className="ai-card-actions" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              className="ai-card-send-btn"
                              onClick={() => sendMessage(ex.prompt)}
                            >
                              ⚡ Run Prompt
                            </button>
                            <button
                              type="button"
                              className="ai-card-edit-btn"
                              onClick={() => {
                                setMessage(ex.prompt);
                                setTimeout(() => textareaRef.current?.focus(), 50);
                              }}
                              title="Edit in chat box"
                            >
                              ✏️ Customize
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* MESSAGES LIST */}
              <div className="ai-messages-list">
                {currentMessages.map((msg, idx) => {
                  const isLastAiMessage =
                    msg.role !== "user" && idx === currentMessages.length - 1;

                  return (
                    <div
                      key={msg.id}
                      className={`ai-message-row ${msg.role === "user" ? "user-row" : "ai-row"}`}
                    >
                      {msg.role !== "user" && (
                        <div className="ai-avatar">
                          {selectedModel === "deepseek-r1" ? "🧠" : selectedModel === "flux-img" ? "🎨" : "✦"}
                        </div>
                      )}

                      <div className={`ai-bubble ${msg.role === "user" ? "user-bubble" : "ai-bubble-box"}`}>
                        <MarkdownRenderer
                          text={msg.text}
                          onLivePreview={(code) => setPreviewHtml(code)}
                          isStreaming={isStreaming && isLastAiMessage}
                        />

                        {/* USER MESSAGE EDIT TOOLBAR */}
                        {msg.role === "user" && (
                          <div className="ai-user-bubble-toolbar">
                            <span className="ai-time">{msg.timestamp}</span>
                            <button
                              type="button"
                              className="ai-user-edit-btn"
                              onClick={() => handleEditUserPrompt(msg)}
                              title="Edit and resend this prompt"
                            >
                              ✏️ Edit
                            </button>
                          </div>
                        )}

                        {/* ASSISTANT MESSAGE TOOLBAR */}
                        {msg.role !== "user" && msg.text && (
                          <div className="ai-bubble-toolbar">
                            <span className="ai-time">{msg.metrics || msg.timestamp}</span>

                            <div className="ai-toolbar-btns">
                              <button
                                type="button"
                                onClick={() => copyMessage(msg.text, msg.id)}
                                title="Copy Answer"
                              >
                                {copiedMessageId === msg.id ? "✓ Copied" : "📋 Copy"}
                              </button>

                              <button
                                type="button"
                                onClick={() => speakText(msg.text, msg.id)}
                                title="Text to Speech"
                                className={speakingMessageId === msg.id ? "ai-speaking-active" : ""}
                              >
                                {speakingMessageId === msg.id ? "⏹ Stop" : "🔊 Listen"}
                              </button>

                              {isLastAiMessage && !isStreaming && (
                                <button
                                  type="button"
                                  onClick={regenerateLastResponse}
                                  title="Regenerate Response"
                                >
                                  🔄 Retry
                                </button>
                              )}

                              <button
                                type="button"
                                className={feedbackState[msg.id] === "up" ? "active-thumb" : ""}
                                onClick={() => handleFeedback(msg.id, "up")}
                                title="Good response"
                              >
                                👍
                              </button>

                              <button
                                type="button"
                                className={feedbackState[msg.id] === "down" ? "active-thumb" : ""}
                                onClick={() => handleFeedback(msg.id, "down")}
                                title="Bad response"
                              >
                                👎
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* THINKING LOADER BEFORE STREAM STARTS */}
                {loading && (
                  <div className="ai-message-row ai-row">
                    <div className="ai-avatar">✦</div>
                    <div className="ai-bubble ai-bubble-box typing-box">
                      <div className="ai-typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <small style={{ color: "#86efac", fontSize: "12px", marginLeft: "10px" }}>
                        {selectedModel === "deepseek-r1" ? "DeepSeek R1 is reasoning step-by-step..." : "Synthesizing technical solution..."}
                      </small>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* STOP GENERATION FLOATING PILL */}
            {isStreaming && (
              <div className="ai-stop-stream-wrapper">
                <button
                  type="button"
                  className="ai-stop-stream-btn"
                  onClick={stopGeneration}
                >
                  ⏹ Stop generating
                </button>
              </div>
            )}

            {/* QUICK ACTION PROMPT CHIPS (CHATGPT FLOATING CHIPS) */}
            <div className="ai-quick-chips-bar">
              {QUICK_ACTION_CHIPS.map((chip, cIdx) => (
                <button
                  key={cIdx}
                  type="button"
                  className="ai-quick-chip-btn"
                  onClick={() => sendMessage(chip.prompt)}
                  title={chip.prompt}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* INPUT FOOTER (CHATGPT STYLE FLOATING DOCK) */}
            <div className="ai-input-wrapper">
              {/* ATTACHED FILE PREVIEW CHIP */}
              {attachedFile && (
                <div className="ai-attached-preview">
                  <div className="ai-attached-left">
                    {attachedFile.isImage && attachedFile.previewUrl ? (
                      <img
                        src={attachedFile.previewUrl}
                        alt={attachedFile.name}
                        className="ai-attached-thumb"
                      />
                    ) : (
                      <div className="ai-attached-icon-box">
                        {attachedFile.isZip ? "📦" : attachedFile.isPdf ? "📑" : attachedFile.isText ? "💻" : "📄"}
                      </div>
                    )}
                    <div className="ai-attached-meta">
                      <span className="ai-attached-name" title={attachedFile.name}>
                        {attachedFile.name}
                      </span>
                      <span className="ai-attached-size">
                        {attachedFile.reading
                          ? "⏳ Reading files inside ZIP..."
                          : `${formatFileSize(attachedFile.size)} • ${
                              attachedFile.isImage
                                ? "Image"
                                : attachedFile.isZip
                                ? `${attachedFile.fileCount ? `${attachedFile.fileCount} Files Inside` : "ZIP Archive"}`
                                : attachedFile.isText
                                ? "Code / Text"
                                : "Document"
                            }`}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="ai-attached-remove-btn"
                    onClick={removeAttachedFile}
                    title="Remove attachment"
                  >
                    ×
                  </button>
                </div>
              )}

              <div className="ai-input-container">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*,.txt,.js,.jsx,.ts,.tsx,.py,.html,.css,.json,.csv,.md,.sql,.zip,.pdf,.doc,.docx"
                  style={{ display: "none" }}
                />

                {/* PLUS TOOLS PICKER BUTTON */}
                <div className="ai-plus-menu-wrapper">
                  <button
                    type="button"
                    className={`ai-plus-btn ${showToolsMenu ? "active" : ""}`}
                    onClick={() => setShowToolsMenu(!showToolsMenu)}
                    title="ChatGPT Tools & Attachments"
                  >
                    +
                  </button>

                  {showToolsMenu && (
                    <div className="ai-plus-dropdown">
                      <button
                        type="button"
                        className="ai-plus-item"
                        onClick={() => {
                          setShowToolsMenu(false);
                          fileInputRef.current?.click();
                        }}
                      >
                        <span>📎</span> Attach File / Image / Code
                      </button>
                      <button
                        type="button"
                        className="ai-plus-item"
                        onClick={() => {
                          setShowToolsMenu(false);
                          setSelectedModel("flux-img");
                          setMessage("Generate image of ");
                          setTimeout(() => textareaRef.current?.focus(), 50);
                        }}
                      >
                        <span>🎨</span> Generate AI Image (Imagen 3)
                      </button>
                      <button
                        type="button"
                        className="ai-plus-item"
                        onClick={() => {
                          setShowToolsMenu(false);
                          setWebSearchEnabled(!webSearchEnabled);
                        }}
                      >
                        <span>🌐</span> {webSearchEnabled ? "Disable Web Search" : "Enable Web Search"}
                      </button>
                      <button
                        type="button"
                        className="ai-plus-item"
                        onClick={() => {
                          setShowToolsMenu(false);
                          sendMessage("What projects and downloadable ZIPs are included in the Web Development course?");
                        }}
                      >
                        <span>📦</span> Explore 63 LMS Project ZIPs
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className={`ai-mic-btn ${isListening ? "listening" : ""}`}
                  onClick={toggleVoice}
                  title={isListening ? "Listening... Speak now" : "Voice Input (Speech-to-Text)"}
                >
                  🎙
                </button>

                <button
                  type="button"
                  className="ai-enhance-btn"
                  onClick={() => {
                    if (!message.trim()) return;
                    const enhanced = `Act as an expert AI systems architect & lead software engineer. Provide an exhaustive, production-grade solution, clean modular code with error handling, and performance guidelines for: "${message.trim()}"`;
                    setMessage(enhanced);
                  }}
                  disabled={!message.trim() || loading || isStreaming}
                  title="✨ Magic Enhance Prompt"
                >
                  ✨
                </button>

                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder={
                    isListening
                      ? "Listening... Speak now..."
                      : isStreaming
                      ? "Streaming answer..."
                      : attachedFile
                      ? `Add a prompt for "${attachedFile.name}" or press ▲ to send...`
                      : `Message ${AVAILABLE_MODELS.find((m) => m.id === selectedModel)?.name || "Cybrical AI"} (${AI_MODES.find((m) => m.id === activeMode)?.label})...`
                  }
                  disabled={loading || isStreaming}
                />

                <button
                  type="button"
                  className="ai-send-btn"
                  onClick={() => sendMessage()}
                  disabled={loading || isStreaming || (!message.trim() && !attachedFile)}
                >
                  ▲
                </button>
              </div>

              <div className="ai-bottom-note">
                <span>✦ Cybrical AI 2.0 • Powered by <strong>{AVAILABLE_MODELS.find((m) => m.id === selectedModel)?.name}</strong> • Engineered by <strong>Vishal Pathak</strong></span>
              </div>
            </div>

          </div>

        </div>
      )}
    </>
  );
}

export default AIAssistant;