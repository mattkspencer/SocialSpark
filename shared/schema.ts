import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  real,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  businessName: varchar("business_name"),
  businessType: varchar("business_type").default("general"),
  subscriptionTier: varchar("subscription_tier").default("free"),
  subscriptionStatus: varchar("subscription_status").default("active"),
  monthlyPostsCount: integer("monthly_posts_count").default(0),
  monthlyAiRequests: integer("monthly_ai_requests").default(0),
  lastUsageReset: timestamp("last_usage_reset").defaultNow(),
  defaultTimezone: varchar("default_timezone").default("UTC"),
  notificationPreferences: jsonb("notification_preferences").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Platform connections (OAuth tokens)
export const platformConnections = pgTable("platform_connections", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  platform: varchar("platform").notNull(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  tokenExpiresAt: timestamp("token_expires_at"),
  platformUserId: varchar("platform_user_id"),
  platformUsername: varchar("platform_username"),
  platformData: jsonb("platform_data").default({}),
  isActive: boolean("is_active").default(true),
  lastUsedAt: timestamp("last_used_at"),
  connectedAt: timestamp("connected_at").defaultNow(),
});

// Content posts
export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  title: varchar("title", { length: 500 }),
  content: text("content").notNull(),
  contentType: varchar("content_type").default("social_post"),
  mediaUrls: text("media_urls").array(),
  thumbnailUrl: varchar("thumbnail_url"),
  targetPlatforms: varchar("target_platforms").array().notNull(),
  scheduledTime: timestamp("scheduled_time").notNull(),
  timezone: varchar("timezone").default("UTC"),
  status: varchar("status").default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  publishedAt: timestamp("published_at"),
  aiModelUsed: varchar("ai_model_used"),
  generationPrompt: text("generation_prompt"),
  businessType: varchar("business_type"),
  contentTemplate: varchar("content_template"),
  platformResults: jsonb("platform_results").default([]),
  videoScript: jsonb("video_script"),
  estimatedDuration: integer("estimated_duration"),
  totalViews: integer("total_views").default(0),
  totalEngagement: integer("total_engagement").default(0),
  leadsGenerated: integer("leads_generated").default(0),
});

// Media files
export const mediaFiles = pgTable("media_files", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  filename: varchar("filename").notNull(),
  originalName: varchar("original_name"),
  filePath: varchar("file_path").notNull(),
  fileType: varchar("file_type").notNull(),
  fileSize: integer("file_size"),
  width: integer("width"),
  height: integer("height"),
  duration: real("duration"),
  thumbnailPath: varchar("thumbnail_path"),
  usedInPosts: integer("used_in_posts").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Content templates
export const contentTemplates = pgTable("content_templates", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category"),
  businessTypes: varchar("business_types").array(),
  templateStructure: jsonb("template_structure").notNull(),
  aiPromptTemplate: text("ai_prompt_template"),
  estimatedEngagement: varchar("estimated_engagement"),
  estimatedDuration: integer("estimated_duration"),
  difficultyLevel: varchar("difficulty_level").default("beginner"),
  createdAt: timestamp("created_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

// Analytics tracking
export const postAnalytics = pgTable("post_analytics", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }).notNull(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  platform: varchar("platform").notNull(),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  shares: integer("shares").default(0),
  comments: integer("comments").default(0),
  clicks: integer("clicks").default(0),
  saves: integer("saves").default(0),
  watchTimeSeconds: real("watch_time_seconds"),
  completionRate: real("completion_rate"),
  leadsGenerated: integer("leads_generated").default(0),
  websiteClicks: integer("website_clicks").default(0),
  phoneCalls: integer("phone_calls").default(0),
  recordedAt: timestamp("recorded_at").defaultNow(),
  dataSource: varchar("data_source").default("api"),
});

// Usage logs
export const usageLogs = pgTable("usage_logs", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  actionType: varchar("action_type").notNull(),
  resourceUsed: varchar("resource_used"),
  quantity: integer("quantity").default(1),
  estimatedCostCents: integer("estimated_cost_cents").default(0),
  postId: uuid("post_id").references(() => posts.id, { onDelete: "set null" }),
  platform: varchar("platform"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  platformConnections: many(platformConnections),
  mediaFiles: many(mediaFiles),
  postAnalytics: many(postAnalytics),
  usageLogs: many(usageLogs),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, { fields: [posts.userId], references: [users.id] }),
  analytics: many(postAnalytics),
  usageLogs: many(usageLogs),
}));

export const platformConnectionsRelations = relations(platformConnections, ({ one }) => ({
  user: one(users, { fields: [platformConnections.userId], references: [users.id] }),
}));

export const mediaFilesRelations = relations(mediaFiles, ({ one }) => ({
  user: one(users, { fields: [mediaFiles.userId], references: [users.id] }),
}));

export const postAnalyticsRelations = relations(postAnalytics, ({ one }) => ({
  post: one(posts, { fields: [postAnalytics.postId], references: [posts.id] }),
  user: one(users, { fields: [postAnalytics.userId], references: [users.id] }),
}));

export const usageLogsRelations = relations(usageLogs, ({ one }) => ({
  user: one(users, { fields: [usageLogs.userId], references: [users.id] }),
  post: one(posts, { fields: [usageLogs.postId], references: [posts.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPlatformConnectionSchema = createInsertSchema(platformConnections).omit({
  id: true,
  connectedAt: true,
});

export const insertMediaFileSchema = createInsertSchema(mediaFiles).omit({
  id: true,
  createdAt: true,
});

export const insertPostAnalyticsSchema = createInsertSchema(postAnalytics).omit({
  id: true,
  recordedAt: true,
});

export const insertUsageLogSchema = createInsertSchema(usageLogs).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

export type PlatformConnection = typeof platformConnections.$inferSelect;
export type InsertPlatformConnection = z.infer<typeof insertPlatformConnectionSchema>;

export type MediaFile = typeof mediaFiles.$inferSelect;
export type InsertMediaFile = z.infer<typeof insertMediaFileSchema>;

export type ContentTemplate = typeof contentTemplates.$inferSelect;

export type PostAnalytics = typeof postAnalytics.$inferSelect;
export type InsertPostAnalytics = z.infer<typeof insertPostAnalyticsSchema>;

export type UsageLog = typeof usageLogs.$inferSelect;
export type InsertUsageLog = z.infer<typeof insertUsageLogSchema>;
