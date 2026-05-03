import { createInsertSchema } from "drizzle-zod";
import { sessions, users } from "@auth/db/schema";
import z from "zod";
import { NO_SPACE_REGEX } from "@common/common.regex";

export const userEntitySchema = createInsertSchema(users, {
  userId: z.uuidv7(),
  email: z.email().toLowerCase(),
  passwordHash: z.string(),

  username: z.string()
    .toLowerCase()
    .regex(NO_SPACE_REGEX)
    .min(2)
    .max(16),
  realUsername: z.string()
    .regex(NO_SPACE_REGEX, "Username cannot contain spaces")
    .min(2, "Username must be 2 characters minimum")
    .max(16, "Username cannot exceed 16 characters"),
  displayName: z.string().min(1).max(64),
  
  role: z.enum(["user", "admin"]).default("user"),
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
