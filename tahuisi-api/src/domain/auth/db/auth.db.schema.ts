import { sql } from "drizzle-orm";
import { text, sqliteTable as table, integer, check } from "drizzle-orm/sqlite-core";

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
  bio: text("bio"),
}, (table) => [
  check("last_login_check", 
    sql`${table.lastLogin} >= ${table.registerDate}`
  )
]);

export const sessions = table("sessions", {
  sessionId: text("session_id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.userId, { onDelete: "cascade" }),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  userAgent: text("user_agent").notNull(),
  ipAddress: text("ip_address").notNull()
});
