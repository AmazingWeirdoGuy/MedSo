import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProgramSchema, insertNewsSchema, insertMemberSchema, insertHeroImageSchema, insertAdminUserSchema } from "@shared/schema";
import { sendContactEmail } from "./email";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Check if user is admin
  app.get('/api/auth/admin', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const adminUser = await storage.getAdminUser(userId);
      res.json({ isAdmin: !!adminUser, adminUser });
    } catch (error) {
      console.error("Error checking admin status:", error);
      res.status(500).json({ message: "Failed to check admin status" });
    }
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
  const isAdmin = async (req: any, res: any, next: any) => {
    try {
      const userId = req.user.claims.sub;
      const adminUser = await storage.getAdminUser(userId);
      if (!adminUser) {
        return res.status(403).json({ message: "Admin access required" });
      }
      req.adminUser = adminUser;
      next();
    } catch (error) {
      res.status(500).json({ message: "Failed to verify admin status" });
    }
  };

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
      const member = await storage.createMember(validatedData);
      res.status(201).json(member);
    } catch (error) {
      res.status(400).json({ message: "Invalid member data" });
    }
  });

  app.put("/api/admin/members/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertMemberSchema.partial().parse(req.body);
      const member = await storage.updateMember(req.params.id, validatedData);
      res.json(member);
    } catch (error) {
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
