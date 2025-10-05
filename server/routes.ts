import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { z } from "zod";

// Simple authentication middleware
const isAuthenticated = (req: any, res: any, next: any) => {
  if (req.session && (req.session as any).isAuthenticated) {
    return next();
  }
  return res.status(401).json({ message: "Authentication required" });
};

// Simple admin check middleware
const isAdmin = (req: any, res: any, next: any) => {
  if (req.session && (req.session as any).isAuthenticated && (req.session as any).isAdmin) {
    return next();
  }
  return res.status(403).json({ message: "Admin access required" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup simple session middleware with memory store
  app.set("trust proxy", 1);
  app.use(session({
    secret: process.env.SESSION_SECRET || 'isb-medical-society-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
  }));

  // Simple login route
  const loginSchema = z.object({
    username: z.string(),
    password: z.string(),
  });

  app.post('/api/login', async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      // Check hardcoded credentials
      if (username === 'admin' && password === 'password') {
        (req.session as any).isAuthenticated = true;
        (req.session as any).isAdmin = true;
        (req.session as any).user = {
          id: 'admin',
          username: 'admin',
          role: 'admin'
        };
        res.json({ message: "Login successful" });
      } else {
        res.status(401).json({ message: "Invalid username or password" });
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Logout route
  app.post('/api/logout', (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  // Auth status route
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    res.json((req.session as any).user);
  });

  // Check if user is admin
  app.get('/api/auth/admin', isAuthenticated, async (req: any, res) => {
    res.json({ 
      isAdmin: (req.session as any).isAdmin || false, 
      adminUser: (req.session as any).isAdmin ? { 
        id: 'admin',
        role: 'admin' 
      } : null 
    });
  });

  // Dev-only JSON save endpoint (for editing content on Replit)
  if (process.env.NODE_ENV === "development") {
    const fs = await import("fs/promises");
    const path = await import("path");
    const multer = (await import("multer")).default;
    
    const DATA_DIR = path.resolve(process.cwd(), "client", "public", "data");
    const UPLOAD_DIR = path.resolve(process.cwd(), "client", "public", "uploads");
    
    // Ensure directories exist
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const TOKEN = process.env.LOCAL_ADMIN_TOKEN;
    
    const requireDevToken = (req: any, res: any, next: any) => {
      if (!TOKEN || req.header("x-admin-token") !== TOKEN) {
        return res.status(401).json({ error: "unauthorized" });
      }
      next();
    };

    // Save JSON endpoint
    app.post("/dev/save-json", requireDevToken, async (req, res) => {
      try {
        const { file, content } = req.body as { file: string; content: any };
        
        if (!file?.endsWith(".json") || file.includes("..") || file.includes("/")) {
          return res.status(400).json({ error: "invalid file" });
        }
        
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
      limits: { fileSize: 10 * 1024 * 1024 }
    });

    app.post("/dev/upload", requireDevToken, upload.single("file"), async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ error: "no file" });
        }
        
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

    console.log("[dev-api] Dev-only endpoints enabled (/dev/save-json, /dev/upload)");
    console.log(`[dev-api] Auth token ${TOKEN ? "configured" : "NOT SET - set LOCAL_ADMIN_TOKEN"}`);
  }

  const httpServer = createServer(app);
  return httpServer;
}
