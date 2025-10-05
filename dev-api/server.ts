import express from "express";
import multer from "multer";
import fs from "fs/promises";
import path from "path";
import cors from "cors";

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors());

// Disable entirely if not in dev
if (process.env.NODE_ENV === "production") {
  throw new Error("Dev API disabled in production");
}

const DATA_DIR = path.resolve(process.cwd(), "client", "src", "data");
const UPLOAD_DIR = path.resolve(process.cwd(), "client", "public", "uploads");

// Ensure directories exist
async function ensureDirs() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

ensureDirs().catch(console.error);

const TOKEN = process.env.LOCAL_ADMIN_TOKEN;

function requireToken(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!TOKEN || req.header("x-admin-token") !== TOKEN) {
    return res.status(401).json({ error: "unauthorized" });
  }
  next();
}

// Save JSON endpoint
app.post("/dev/save-json", requireToken, async (req, res) => {
  try {
    const { file, content } = req.body as { file: string; content: any };
    
    if (!file?.endsWith(".json") || file.includes("..") || file.includes("/")) {
      return res.status(400).json({ error: "invalid file" });
    }
    
    // Validate JSON (throws if circular)
    JSON.parse(JSON.stringify(content));
    
    const abs = path.join(DATA_DIR, file);
    await fs.writeFile(abs, JSON.stringify(content, null, 2), "utf8");
    
    console.log(`[dev-api] Saved ${file}`);
    res.json({ ok: true });
  } catch (e: any) {
    console.error("[dev-api] Error saving JSON:", e);
    res.status(500).json({ error: e.message });
  }
});

// Image upload endpoint
const upload = multer({ 
  dest: UPLOAD_DIR,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

app.post("/dev/upload", requireToken, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "no file" });
    }
    
    // Rename to original filename for better organization
    const ext = path.extname(req.file.originalname);
    const basename = path.basename(req.file.originalname, ext);
    const timestamp = Date.now();
    const newFilename = `${basename}-${timestamp}${ext}`;
    const newPath = path.join(UPLOAD_DIR, newFilename);
    
    await fs.rename(req.file.path, newPath);
    
    const publicPath = `/uploads/${newFilename}`;
    console.log(`[dev-api] Uploaded ${publicPath}`);
    
    res.json({ ok: true, publicPath });
  } catch (e: any) {
    console.error("[dev-api] Error uploading file:", e);
    res.status(500).json({ error: e.message });
  }
});

// Health check
app.get("/dev/health", (req, res) => {
  res.json({ status: "ok", message: "Dev API is running" });
});

const PORT = process.env.DEV_API_PORT || 5174;

app.listen(PORT, () => {
  console.log(`[dev-api] listening on http://localhost:${PORT}`);
  console.log(`[dev-api] Auth token ${TOKEN ? "configured" : "NOT SET - set LOCAL_ADMIN_TOKEN"}`);
});
