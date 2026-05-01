import { createInsertSchema } from "drizzle-zod";
import { sessions, users } from "@auth/db/schema";
import z from "zod";

export const userEntitySchema = createInsertSchema(users, {
  userId: z.uuidv7(),
  email: z.email().toLowerCase(),
  username: z.string()
    .toLowerCase()
    .min(3)
    .max(16),
  realUsername: z.string(),
  passwordHash: z.string(),
  role: z.enum(["user", "admin"]),
  displayName: z.string(),
  gender: z.enum(["male", "female", "other"]),
  avatarId: z.uuidv7().nullable(),
  registerDate: z.date(),
  lastLogin: z.date(),
  userStatus: z.enum(["active", "inactive", "banned"]),
  bio: z.string().nullable()
});

export const userSessionEntitySchema = createInsertSchema(sessions, {
  sessionId: z.uuidv7(),
  userId: z.uuidv7(),
  expiresAt: z.date(),
  userAgent: z.string(),
  ipAddress: z.string()
});
