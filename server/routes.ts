import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { AIContentService } from "./services/aiContentService";
import { insertPostSchema, insertPlatformConnectionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
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

  // Dashboard routes
  app.get('/api/dashboard/metrics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const metrics = await storage.getDashboardMetrics(userId);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });

  // Posts routes
  app.get('/api/posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const posts = await storage.getUserPosts(userId, limit);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get('/api/posts/scheduled', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const scheduledPosts = await storage.getScheduledPosts(userId);
      res.json(scheduledPosts);
    } catch (error) {
      console.error("Error fetching scheduled posts:", error);
      res.status(500).json({ message: "Failed to fetch scheduled posts" });
    }
  });

  app.post('/api/posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postData = insertPostSchema.parse({ ...req.body, userId });
      const post = await storage.createPost(postData);
      res.json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(400).json({ message: "Failed to create post", error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.get('/api/posts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const post = await storage.getPost(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      // Verify ownership
      if (post.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Access denied" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  app.put('/api/posts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const post = await storage.getPost(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      // Verify ownership
      if (post.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Access denied" });
      }
      const updatedPost = await storage.updatePost(req.params.id, req.body);
      res.json(updatedPost);
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ message: "Failed to update post" });
    }
  });

  app.delete('/api/posts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const post = await storage.getPost(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      // Verify ownership
      if (post.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Access denied" });
      }
      await storage.deletePost(req.params.id);
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  // AI Content Generation routes
  app.post('/api/ai/generate-content', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      const contentRequestSchema = z.object({
        businessType: z.string(),
        contentType: z.enum(['social_post', 'faceless_video', 'before_after', 'educational_tips']),
        platforms: z.array(z.string()),
        tone: z.enum(['professional', 'casual', 'enthusiastic', 'educational']).default('professional'),
        customPrompt: z.string().optional(),
        targetAudience: z.string().optional(),
      });

      const request = contentRequestSchema.parse(req.body);
      
      // Log AI usage
      await storage.createUsageLog({
        userId,
        actionType: 'ai_request',
        resourceUsed: 'gpt-4o',
        quantity: 1,
        estimatedCostCents: 5, // Rough estimate
      });

      const generatedContent = await AIContentService.generateContent(request);
      res.json(generatedContent);
    } catch (error) {
      console.error("Error generating content:", error);
      res.status(500).json({ message: "Failed to generate content", error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.post('/api/ai/generate-video-script', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      const videoRequestSchema = z.object({
        businessType: z.string(),
        topic: z.string(),
        duration: z.number().default(60),
      });

      const request = videoRequestSchema.parse(req.body);
      
      // Log AI usage
      await storage.createUsageLog({
        userId,
        actionType: 'ai_request',
        resourceUsed: 'gpt-4o',
        quantity: 1,
        estimatedCostCents: 7,
      });

      const videoScript = await AIContentService.generateFacelessVideoScript(
        request.businessType,
        request.topic,
        request.duration
      );
      res.json(videoScript);
    } catch (error) {
      console.error("Error generating video script:", error);
      res.status(500).json({ message: "Failed to generate video script", error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Platform connections routes
  app.get('/api/platforms', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const connections = await storage.getUserPlatformConnections(userId);
      res.json(connections);
    } catch (error) {
      console.error("Error fetching platform connections:", error);
      res.status(500).json({ message: "Failed to fetch platform connections" });
    }
  });

  app.post('/api/platforms', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const connectionData = insertPlatformConnectionSchema.parse({ ...req.body, userId });
      const connection = await storage.createPlatformConnection(connectionData);
      res.json(connection);
    } catch (error) {
      console.error("Error creating platform connection:", error);
      res.status(400).json({ message: "Failed to create platform connection", error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Analytics routes
  app.get('/api/analytics/dashboard', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const analytics = await storage.getUserAnalytics(userId, startDate);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  app.get('/api/analytics/posts/:postId', isAuthenticated, async (req: any, res) => {
    try {
      // Verify post ownership
      const post = await storage.getPost(req.params.postId);
      if (!post || post.userId !== req.user.claims.sub) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      const analytics = await storage.getPostAnalytics(req.params.postId);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching post analytics:", error);
      res.status(500).json({ message: "Failed to fetch post analytics" });
    }
  });

  // Business settings routes
  app.put('/api/user/business-settings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const settingsSchema = z.object({
        businessName: z.string().optional(),
        businessType: z.string().optional(),
        defaultTimezone: z.string().optional(),
        notificationPreferences: z.object({}).optional(),
      });

      const settings = settingsSchema.parse(req.body);
      const updatedUser = await storage.upsertUser({ ...user, ...settings });
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating business settings:", error);
      res.status(500).json({ message: "Failed to update business settings" });
    }
  });

  // Usage stats
  app.get('/api/usage/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1); // Last 30 days
      
      const usageLogs = await storage.getUserUsageLogs(userId, startDate);
      
      const stats = {
        aiRequests: usageLogs.filter(log => log.actionType === 'ai_request').length,
        postsCreated: usageLogs.filter(log => log.actionType === 'post_created').length,
        totalCostCents: usageLogs.reduce((sum, log) => sum + (log.estimatedCostCents || 0), 0),
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching usage stats:", error);
      res.status(500).json({ message: "Failed to fetch usage stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
