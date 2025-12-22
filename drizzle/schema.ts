import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Historical ranking snapshots table.
 * Stores daily snapshots of node rankings for trend analysis.
 */
export const rankingSnapshots = mysqlTable("rankingSnapshots", {
  id: int("id").autoincrement().primaryKey(),
  /** Node address (IP:port) */
  nodeAddress: varchar("nodeAddress", { length: 255 }).notNull(),
  /** Node public key */
  nodePubkey: text("nodePubkey"),
  /** Ranking position (1 = top) */
  rank: int("rank").notNull(),
  /** Score (0-100) */
  score: int("score").notNull(),
  /** Node version */
  version: varchar("version", { length: 64 }),
  /** Geographic location (country code) */
  country: varchar("country", { length: 2 }),
  /** City name */
  city: varchar("city", { length: 255 }),
  /** Snapshot timestamp */
  snapshotDate: timestamp("snapshotDate").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RankingSnapshot = typeof rankingSnapshots.$inferSelect;
export type InsertRankingSnapshot = typeof rankingSnapshots.$inferInsert;

/**
 * Node badges table.
 * Stores achievement badges earned by nodes.
 */
export const nodeBadges = mysqlTable("nodeBadges", {
  id: int("id").autoincrement().primaryKey(),
  /** Node address (IP:port) */
  nodeAddress: varchar("nodeAddress", { length: 255 }).notNull(),
  /** Badge type */
  badgeType: mysqlEnum("badgeType", [
    "stable_champion",
    "latest_version",
    "geographic_pioneer",
    "uptime_hero",
  ]).notNull(),
  /** Badge display name */
  badgeName: varchar("badgeName", { length: 255 }).notNull(),
  /** Badge description */
  badgeDescription: text("badgeDescription"),
  /** Date badge was earned */
  earnedAt: timestamp("earnedAt").defaultNow().notNull(),
  /** Whether badge is currently active */
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type NodeBadge = typeof nodeBadges.$inferSelect;
export type InsertNodeBadge = typeof nodeBadges.$inferInsert;