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

    // Save JSON endpoint with auto-sorting and validation
    app.post("/dev/save-json", requireDevToken, async (req, res) => {
      try {
        const { file, content } = req.body as { file: string; content: any };
        
        if (!file?.endsWith(".json") || file.includes("..") || file.includes("/")) {
          return res.status(400).json({ error: "invalid file" });
        }
        
        // Validate JSON is serializable
        JSON.parse(JSON.stringify(content));
        
        let dataToSave = content;
        
        // Auto-sort arrays by displayOrder, then by name/title
        if (Array.isArray(content)) {
          dataToSave = [...content].sort((a, b) => {
            if (a.displayOrder !== b.displayOrder) {
              return (a.displayOrder || 0) - (b.displayOrder || 0);
            }
            const nameA = a.name || a.title || '';
            const nameB = b.name || b.title || '';
            return nameA.localeCompare(nameB);
          });
          
          // Enforce programs limit
          if (file === 'programs.json' && dataToSave.length > 4) {
            return res.status(400).json({ 
              error: "Programs are limited to a maximum of 4 items. Please remove some programs before adding new ones." 
            });
          }
        }
        
        const abs = path.join(DATA_DIR, file);
        await fs.writeFile(abs, JSON.stringify(dataToSave, null, 2), "utf8");
        
        console.log(`[dev-api] Saved ${file} (${Array.isArray(dataToSave) ? dataToSave.length : 1} items)`);
        res.json({ ok: true, count: Array.isArray(dataToSave) ? dataToSave.length : 1 });
      } catch (e: any) {
        console.error("[dev-api] Error saving JSON:", e);
        res.status(500).json({ error: e.message });
      }
    });

    // Image upload endpoint with category support
    const storage = multer.diskStorage({
      destination: async (req, file, cb) => {
        const category = req.query.category as string || 'misc';
        const allowedCategories = ['members', 'news', 'hero', 'programs', 'misc'];
        const finalCategory = allowedCategories.includes(category) ? category : 'misc';
        const destDir = path.join(UPLOAD_DIR, finalCategory);
        await fs.mkdir(destDir, { recursive: true });
        cb(null, destDir);
      },
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext).toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const timestamp = Date.now();
        cb(null, `${basename}-${timestamp}${ext}`);
      }
    });

    const upload = multer({ 
      storage,
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
          return cb(null, true);
        }
        cb(new Error('Only image files (jpeg, jpg, png, webp, gif) are allowed'));
      }
    });

    app.post("/dev/upload", requireDevToken, upload.single("file"), async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ error: "no file" });
        }
        
        const category = req.query.category as string || 'misc';
        const publicPath = `/uploads/${category}/${req.file.filename}`;
        console.log(`[dev-api] Uploaded ${publicPath}`);
        
        res.json({ ok: true, publicPath });
      } catch (e: any) {
        console.error("[dev-api] Error uploading file:", e);
        res.status(500).json({ error: e.message });
      }
    });

    // Delete upload endpoint
    app.delete("/dev/upload", requireDevToken, async (req, res) => {
      try {
        const { path: filePath } = req.body as { path: string };
        
        if (!filePath || !filePath.startsWith('/uploads/')) {
          return res.status(400).json({ error: "invalid file path" });
        }
        
        const abs = path.join(process.cwd(), 'client', 'public', filePath);
        
        // Check if file exists
        try {
          await fs.access(abs);
        } catch {
          return res.status(404).json({ error: "file not found" });
        }
        
        await fs.unlink(abs);
        console.log(`[dev-api] Deleted ${filePath}`);
        
        res.json({ ok: true });
      } catch (e: any) {
        console.error("[dev-api] Error deleting file:", e);
        res.status(500).json({ error: e.message });
      }
    });

    console.log("[dev-api] Dev-only endpoints enabled (/dev/save-json, /dev/upload, /dev/upload [DELETE])");
    console.log(`[dev-api] Auth token ${TOKEN ? "configured" : "NOT SET - set LOCAL_ADMIN_TOKEN"}`);
  }

  const httpServer = createServer(app);
  return httpServer;
}
