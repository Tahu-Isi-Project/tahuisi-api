import { createInsertSchema } from "drizzle-zod";
import { sessions, users } from "@auth/db/auth.db.schema";
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
  role: z.enum(["USER", "ADMIN"]),
  displayName: z.string(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  avatarId: z.uuidv7().nullable(),
  registerDate: z.date(),
  lastLogin: z.date(),
  userStatus: z.enum(["ACTIVE", "INACTIVE", "BANNED"]),
  bio: z.string().nullable()
});

export const userSessionEntitySchema = createInsertSchema(sessions, {
  sessionId: z.uuidv7(),
  userId: z.uuidv7(),
  expiresAt: z.date()
});
