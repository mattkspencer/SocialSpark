import {
  users,
  posts,
  platformConnections,
  mediaFiles,
  postAnalytics,
  usageLogs,
  type User,
  type UpsertUser,
  type Post,
  type InsertPost,
  type PlatformConnection,
  type InsertPlatformConnection,
  type MediaFile,
  type InsertMediaFile,
  type PostAnalytics,
  type InsertPostAnalytics,
  type UsageLog,
  type InsertUsageLog,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Post operations
  createPost(post: InsertPost): Promise<Post>;
  getPost(id: string): Promise<Post | undefined>;
  getUserPosts(userId: string, limit?: number): Promise<Post[]>;
  updatePost(id: string, updates: Partial<Post>): Promise<Post>;
  deletePost(id: string): Promise<void>;
  getScheduledPosts(userId: string): Promise<Post[]>;
  
  // Platform connections
  createPlatformConnection(connection: InsertPlatformConnection): Promise<PlatformConnection>;
  getUserPlatformConnections(userId: string): Promise<PlatformConnection[]>;
  updatePlatformConnection(id: string, updates: Partial<PlatformConnection>): Promise<PlatformConnection>;
  deletePlatformConnection(id: string): Promise<void>;
  
  // Media files
  createMediaFile(file: InsertMediaFile): Promise<MediaFile>;
  getUserMediaFiles(userId: string): Promise<MediaFile[]>;
  deleteMediaFile(id: string): Promise<void>;
  
  // Analytics
  createPostAnalytics(analytics: InsertPostAnalytics): Promise<PostAnalytics>;
  getPostAnalytics(postId: string): Promise<PostAnalytics[]>;
  getUserAnalytics(userId: string, startDate?: Date): Promise<PostAnalytics[]>;
  
  // Usage logs
  createUsageLog(log: InsertUsageLog): Promise<UsageLog>;
  getUserUsageLogs(userId: string, startDate?: Date): Promise<UsageLog[]>;
  
  // Dashboard metrics
  getDashboardMetrics(userId: string): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Post operations
  async createPost(post: InsertPost): Promise<Post> {
    const [createdPost] = await db.insert(posts).values(post).returning();
    return createdPost;
  }

  async getPost(id: string): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post;
  }

  async getUserPosts(userId: string, limit = 50): Promise<Post[]> {
    return await db
      .select()
      .from(posts)
      .where(eq(posts.userId, userId))
      .orderBy(desc(posts.createdAt))
      .limit(limit);
  }

  async updatePost(id: string, updates: Partial<Post>): Promise<Post> {
    const [updatedPost] = await db
      .update(posts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning();
    return updatedPost;
  }

  async deletePost(id: string): Promise<void> {
    await db.delete(posts).where(eq(posts.id, id));
  }

  async getScheduledPosts(userId: string): Promise<Post[]> {
    return await db
      .select()
      .from(posts)
      .where(and(eq(posts.userId, userId), eq(posts.status, "scheduled")))
      .orderBy(posts.scheduledTime);
  }

  // Platform connections
  async createPlatformConnection(connection: InsertPlatformConnection): Promise<PlatformConnection> {
    const [created] = await db.insert(platformConnections).values(connection).returning();
    return created;
  }

  async getUserPlatformConnections(userId: string): Promise<PlatformConnection[]> {
    return await db
      .select()
      .from(platformConnections)
      .where(eq(platformConnections.userId, userId));
  }

  async updatePlatformConnection(id: string, updates: Partial<PlatformConnection>): Promise<PlatformConnection> {
    const [updated] = await db
      .update(platformConnections)
      .set(updates)
      .where(eq(platformConnections.id, id))
      .returning();
    return updated;
  }

  async deletePlatformConnection(id: string): Promise<void> {
    await db.delete(platformConnections).where(eq(platformConnections.id, id));
  }

  // Media files
  async createMediaFile(file: InsertMediaFile): Promise<MediaFile> {
    const [created] = await db.insert(mediaFiles).values(file).returning();
    return created;
  }

  async getUserMediaFiles(userId: string): Promise<MediaFile[]> {
    return await db
      .select()
      .from(mediaFiles)
      .where(eq(mediaFiles.userId, userId))
      .orderBy(desc(mediaFiles.createdAt));
  }

  async deleteMediaFile(id: string): Promise<void> {
    await db.delete(mediaFiles).where(eq(mediaFiles.id, id));
  }

  // Analytics
  async createPostAnalytics(analytics: InsertPostAnalytics): Promise<PostAnalytics> {
    const [created] = await db.insert(postAnalytics).values(analytics).returning();
    return created;
  }

  async getPostAnalytics(postId: string): Promise<PostAnalytics[]> {
    return await db
      .select()
      .from(postAnalytics)
      .where(eq(postAnalytics.postId, postId));
  }

  async getUserAnalytics(userId: string, startDate?: Date): Promise<PostAnalytics[]> {
    const whereConditions = [eq(postAnalytics.userId, userId)];
    if (startDate) {
      whereConditions.push(gte(postAnalytics.recordedAt, startDate));
    }
    
    return await db
      .select()
      .from(postAnalytics)
      .where(and(...whereConditions))
      .orderBy(desc(postAnalytics.recordedAt));
  }

  // Usage logs
  async createUsageLog(log: InsertUsageLog): Promise<UsageLog> {
    const [created] = await db.insert(usageLogs).values(log).returning();
    return created;
  }

  async getUserUsageLogs(userId: string, startDate?: Date): Promise<UsageLog[]> {
    const whereConditions = [eq(usageLogs.userId, userId)];
    if (startDate) {
      whereConditions.push(gte(usageLogs.createdAt, startDate));
    }
    
    return await db
      .select()
      .from(usageLogs)
      .where(and(...whereConditions))
      .orderBy(desc(usageLogs.createdAt));
  }

  // Dashboard metrics
  async getDashboardMetrics(userId: string): Promise<any> {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    // Get posts this month
    const [postsThisMonth] = await db
      .select({ count: sql<number>`count(*)` })
      .from(posts)
      .where(and(eq(posts.userId, userId), gte(posts.createdAt, thisMonth)));
    
    // Get posts last month for comparison
    const [postsLastMonth] = await db
      .select({ count: sql<number>`count(*)` })
      .from(posts)
      .where(and(
        eq(posts.userId, userId), 
        gte(posts.createdAt, lastMonth),
        sql`${posts.createdAt} < ${thisMonth}`
      ));
    
    // Get scheduled posts
    const [scheduledPosts] = await db
      .select({ count: sql<number>`count(*)` })
      .from(posts)
      .where(and(eq(posts.userId, userId), eq(posts.status, "scheduled")));
    
    // Get total analytics
    const [totalAnalytics] = await db
      .select({
        totalViews: sql<number>`coalesce(sum(${postAnalytics.views}), 0)`,
        totalLikes: sql<number>`coalesce(sum(${postAnalytics.likes}), 0)`,
        totalShares: sql<number>`coalesce(sum(${postAnalytics.shares}), 0)`,
        totalComments: sql<number>`coalesce(sum(${postAnalytics.comments}), 0)`,
      })
      .from(postAnalytics)
      .where(eq(postAnalytics.userId, userId));
    
    const totalEngagement = (totalAnalytics?.totalLikes || 0) + 
                           (totalAnalytics?.totalShares || 0) + 
                           (totalAnalytics?.totalComments || 0);
    
    const engagementRate = totalAnalytics?.totalViews > 0 
      ? ((totalEngagement / totalAnalytics.totalViews) * 100).toFixed(1)
      : 0;
    
    const postsTrend = postsLastMonth?.count && postsLastMonth.count > 0 
      ? (((postsThisMonth?.count || 0) - postsLastMonth.count) / postsLastMonth.count * 100).toFixed(1)
      : "0";
    
    return {
      postsThisMonth: postsThisMonth?.count || 0,
      postsTrend: `${Number(postsTrend) > 0 ? '+' : ''}${postsTrend}%`,
      totalReach: totalAnalytics?.totalViews || 0,
      engagementRate: `${engagementRate}%`,
      scheduledPosts: scheduledPosts?.count || 0,
      totalEngagement,
    };
  }
}

export const storage = new DatabaseStorage();
