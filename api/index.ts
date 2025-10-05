import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import { z } from "zod";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import connectPgSimple from "connect-pg-simple";

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Database setup for session store
const PgSession = connectPgSimple(session);
const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

// Session middleware with PostgreSQL store
app.set("trust proxy", 1);
app.use(session({
  store: new PgSession({
    conString: DATABASE_URL,
    tableName: 'sessions',
    createTableIfMissing: false,
  }),
  secret: process.env.SESSION_SECRET || 'isb-medical-society-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
  },
}));

// Authentication middleware
const isAuthenticated = (req: any, res: any, next: any) => {
  if (req.session && (req.session as any).isAuthenticated) {
    return next();
  }
  return res.status(401).json({ message: "Authentication required" });
};

// Admin check middleware
const isAdmin = (req: any, res: any, next: any) => {
  if (req.session && (req.session as any).isAuthenticated && (req.session as any).isAdmin) {
    return next();
  }
  return res.status(403).json({ message: "Admin access required" });
};

// Login route
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

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

export default app;
