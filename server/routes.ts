import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProgramSchema, insertNewsSchema, insertMemberSchema, insertMemberClassSchema, insertHeroImageSchema, insertAdminUserSchema } from "../shared/schema";
import { processImage, cleanupOldImages } from "./imageProcessor";
import { randomUUID } from 'crypto';
import { sendContactEmail } from "./email";
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { pool } from './db';
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
  // Setup session middleware
  app.set("trust proxy", 1);
  
  const PgStore = connectPgSimple(session);
  app.use(session({
    store: new PgStore({ pool, tableName: 'sessions' }),
    secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    }
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
  // Programs routes
  app.get("/api/programs", async (req, res) => {
    try {
      const programs = await storage.getPrograms();
      res.json(programs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch programs" });
    }
  });

  app.get("/api/programs/:id", async (req, res) => {
    try {
      const program = await storage.getProgram(req.params.id);
      if (!program) {
        return res.status(404).json({ message: "Program not found" });
      }
      res.json(program);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch program" });
    }
  });

  app.post("/api/programs", async (req, res) => {
    try {
      const validatedData = insertProgramSchema.parse(req.body);
      const program = await storage.createProgram(validatedData);
      res.status(201).json(program);
    } catch (error) {
      res.status(400).json({ message: "Invalid program data" });
    }
  });

  // News routes
  app.get("/api/news", async (req, res) => {
    try {
      const news = await storage.getNews();
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  app.get("/api/news/:id", async (req, res) => {
    try {
      const newsItem = await storage.getNewsItem(req.params.id);
      if (!newsItem) {
        return res.status(404).json({ message: "News item not found" });
      }
      res.json(newsItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news item" });
    }
  });

  app.post("/api/news", async (req, res) => {
    try {
      const validatedData = insertNewsSchema.parse(req.body);
      const news = await storage.createNews(validatedData);
      res.status(201).json(news);
    } catch (error) {
      res.status(400).json({ message: "Invalid news data" });
    }
  });

  // Member classes routes (public)
  app.get("/api/member-classes", async (req, res) => {
    try {
      const memberClasses = await storage.getMemberClasses();
      res.json(memberClasses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch member classes" });
    }
  });

  // Members routes (public)
  app.get("/api/members", async (req, res) => {
    try {
      const members = await storage.getMembers();
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch members" });
    }
  });

  // Hero images routes (public)
  app.get("/api/hero-images", async (req, res) => {
    try {
      const heroImages = await storage.getHeroImages();
      res.json(heroImages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hero images" });
    }
  });

  // Contact form route
  const contactFormSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Valid email is required"),
    grade: z.string().optional(),
    subject: z.string().min(1, "Subject is required"),
    message: z.string().min(1, "Message is required"),
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = contactFormSchema.parse(req.body);
      const success = await sendContactEmail(validatedData);
      
      if (success) {
        res.json({ message: "Email sent successfully" });
      } else {
        res.status(500).json({ message: "Failed to send email" });
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid form data" });
    }
  });

  // Admin-only routes

  // Member classes management routes
  app.get("/api/admin/member-classes", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const memberClasses = await storage.getMemberClasses();
      res.json(memberClasses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch member classes" });
    }
  });

  app.post("/api/admin/member-classes", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertMemberClassSchema.parse(req.body);
      const memberClass = await storage.createMemberClass(validatedData);
      res.status(201).json(memberClass);
    } catch (error) {
      res.status(400).json({ message: "Invalid member class data" });
    }
  });

  app.put("/api/admin/member-classes/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertMemberClassSchema.partial().parse(req.body);
      const memberClass = await storage.updateMemberClass(req.params.id, validatedData);
      res.json(memberClass);
    } catch (error) {
      res.status(400).json({ message: "Failed to update member class" });
    }
  });

  app.delete("/api/admin/member-classes/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      await storage.deleteMemberClass(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete member class" });
    }
  });

  // Members management routes
  app.get("/api/admin/members", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const members = await storage.getMembers();
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch members" });
    }
  });

  app.post("/api/admin/members", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertMemberSchema.parse(req.body);
      
      // Get member class to determine validation rules
      const memberClass = await storage.getMemberClass(validatedData.memberClassId!);
      if (!memberClass) {
        return res.status(400).json({ message: "Invalid member class" });
      }
      
      // Apply conditional validation based on member class
      if (memberClass.name === "Active Member") {
        // Active Members only need name - role is optional
        validatedData.role = null;
        
        // Process image if provided for Active Members too
        if (validatedData.image) {
          const memberId = randomUUID();
          const processedImages = await processImage(validatedData.image, memberId);
          
          // Store the JPG fallback URLs (most compatible)
          validatedData.image = processedImages.original.jpg;
          (validatedData as any).thumbnail = processedImages.thumbnail.jpg;
        }
      } else {
        // Other classes need name and role (image is optional)
        if (!validatedData.role?.trim()) {
          return res.status(400).json({ message: "Role is required for " + memberClass.name });
        }
        
        // Process image if provided
        if (validatedData.image) {
          const memberId = randomUUID();
          const processedImages = await processImage(validatedData.image, memberId);
          
          // Store the JPG fallback URLs (most compatible)
          validatedData.image = processedImages.original.jpg;
          (validatedData as any).thumbnail = processedImages.thumbnail.jpg;
        }
      }
      
      const member = await storage.createMember(validatedData);
      res.status(201).json(member);
    } catch (error) {
      console.error("Member creation error:", error);
      res.status(400).json({ message: "Invalid member data" });
    }
  });

  app.put("/api/admin/members/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertMemberSchema.partial().parse(req.body);
      
      // Get the current member to determine class if not being changed
      const currentMember = await storage.getMember(req.params.id);
      if (!currentMember) {
        return res.status(404).json({ message: "Member not found" });
      }
      
      // Use provided memberClassId or current member's class
      const targetClassId = validatedData.memberClassId || currentMember.memberClassId;
      
      if (targetClassId) {
        const memberClass = await storage.getMemberClass(targetClassId);
        if (!memberClass) {
          return res.status(400).json({ message: "Invalid member class" });
        }
        
        if (memberClass.name === "Active Member") {
          // Active Members only need name - role is optional
          validatedData.role = null;
          
          // Process new image if provided for Active Members too
          if (validatedData.image && validatedData.image.startsWith('data:')) {
            // Clean up old images first
            if (currentMember.image) {
              await cleanupOldImages(currentMember.image, currentMember.thumbnail || '');
            }
            
            const processedImages = await processImage(validatedData.image, req.params.id);
            
            // Store the JPG fallback URLs (most compatible)
            validatedData.image = processedImages.original.jpg;
            (validatedData as any).thumbnail = processedImages.thumbnail.jpg;
          }
        } else {
          // Other classes need name and role (image is optional)
          if (validatedData.role !== undefined && !validatedData.role?.trim()) {
            return res.status(400).json({ message: "Role is required for " + memberClass.name });
          }
          
          // Process new image if provided
          if (validatedData.image && validatedData.image.startsWith('data:')) {
            // Clean up old images first
            if (currentMember.image) {
              await cleanupOldImages(currentMember.image, currentMember.thumbnail || '');
            }
            
            const processedImages = await processImage(validatedData.image, req.params.id);
            
            // Store the JPG fallback URLs (most compatible)
            validatedData.image = processedImages.original.jpg;
            (validatedData as any).thumbnail = processedImages.thumbnail.jpg;
          }
        }
      }
      
      
      const member = await storage.updateMember(req.params.id, validatedData);
      res.json(member);
    } catch (error) {
      console.error("Member update error:", error);
      res.status(400).json({ message: "Failed to update member" });
    }
  });

  app.delete("/api/admin/members/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      await storage.deleteMember(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete member" });
    }
  });

  // Hero images management routes
  app.get("/api/admin/hero-images", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const heroImages = await storage.getHeroImages();
      res.json(heroImages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hero images" });
    }
  });

  app.post("/api/admin/hero-images", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertHeroImageSchema.parse(req.body);
      const heroImage = await storage.createHeroImage(validatedData);
      res.status(201).json(heroImage);
    } catch (error) {
      res.status(400).json({ message: "Invalid hero image data" });
    }
  });

  app.put("/api/admin/hero-images/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertHeroImageSchema.partial().parse(req.body);
      const heroImage = await storage.updateHeroImage(req.params.id, validatedData);
      res.json(heroImage);
    } catch (error) {
      res.status(400).json({ message: "Failed to update hero image" });
    }
  });

  app.delete("/api/admin/hero-images/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      await storage.deleteHeroImage(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete hero image" });
    }
  });

  // Admin news management routes
  app.get("/api/admin/news", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const news = await storage.getNews();
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  app.post("/api/admin/news", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertNewsSchema.parse(req.body);
      const news = await storage.createNews(validatedData);
      res.status(201).json(news);
    } catch (error) {
      res.status(400).json({ message: "Invalid news data" });
    }
  });

  app.put("/api/admin/news/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertNewsSchema.partial().parse(req.body);
      const news = await storage.updateNews(req.params.id, validatedData);
      res.json(news);
    } catch (error) {
      res.status(400).json({ message: "Failed to update news" });
    }
  });

  app.delete("/api/admin/news/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      await storage.deleteNews(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete news" });
    }
  });

  // Published news route for public access
  app.get("/api/news/published", async (req, res) => {
    try {
      const news = await storage.getPublishedNews();
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch published news" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
