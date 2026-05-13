import { sql } from "drizzle-orm";
import { text, sqliteTable as table, integer, check, unique } from "drizzle-orm/sqlite-core";

export const users = table("users", {
  userId: text("user_id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  realUsername: text("real_username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["user", "admin"] })
    .notNull()
    .default("user"),
  displayName: text("display_name").notNull(),
  gender: text("gender", { enum: ["male", "female", "other"] }).notNull(),
  avatarId: text("avatar_id"),
  registerDate: integer("register_date", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  lastLogin: integer("last_login", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  userStatus: text("user_status", { enum: ["active", "inactive", "banned"] })
    .notNull()
    .default("active"),
  bannedDate: integer("banned_date", { mode: "timestamp" }),
  bannedReason: text("banned_reason"),
  bio: text("bio"),
}, (t) => [
  check("last_login_check", 
    sql`${t.lastLogin} >= ${t.registerDate}`
  ),
  check("ban_consistency_check",
    sql`(${t.userStatus} = 'banned' AND ${t.bannedDate} IS NOT NULL) 
      OR 
      (${t.userStatus} <> 'banned' AND ${t.bannedDate} IS NULL)`
  ),
]);

export const sessions = table("sessions", {
  sessionId: text("session_id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.userId, { onDelete: "cascade" }),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  userAgent: text("user_agent").notNull(),
  ipAddress: text("ip_address").notNull()
}, (t) => [
  unique("unique_session_constraint").on(t.userId, t.userAgent, t.ipAddress)
]);
