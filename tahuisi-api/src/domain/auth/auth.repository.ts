import { SanitizedUserRegister, UserSession } from "@auth/auth.types";
import { authDb } from "@auth/db/auth.db.client";
import { sessions, users } from "@auth/db/auth.db.schema";
import { eq, inArray } from "drizzle-orm";

export default class AuthRepository {
  async findUserByEmail(email: string, withPasswordHash: true): Promise<{ userId: string; email: string; passwordHash: string } | undefined>;
  async findUserByEmail(email: string, withPasswordHash?: false): Promise<{ userId: string; email: string } | undefined>;
  async findUserByEmail(email: string, withPasswordHash: boolean = false) {
    const [res] = await authDb
      .select({
        userId: users.userId,
        email: users.email,
        ...(withPasswordHash && { passwordHash: users.passwordHash }),
      })
      .from(users)
      .where(eq(users.email, email.toLowerCase()));

    return res;
  }

  async findUserByUsername(username: string) {
    const [res] = await authDb
      .select({ username: users.username })
      .from(users)
      .where(eq(users.username, username.toLowerCase()));

    return res;
  }

  async createUser(data: SanitizedUserRegister) {
    await authDb.insert(users).values({
      email: data.email.toLowerCase(),
      username: data.username.toLowerCase(),
      realUsername: data.username,
      passwordHash: data.passwordHash,
      gender: data.gender,
      displayName: data.displayName,
    });
  }

  async createSession(sessionData: UserSession) {
    await authDb.insert(sessions).values({
      sessionId: sessionData.sessionId,
      userId: sessionData.userId,
      expiresAt: sessionData.expiresAt
    });
  }

  async findSessionById(sessionId: string) {
    const [session] = await authDb
      .select({ sessionId: sessions.sessionId })
      .from(sessions)
      .where(eq(sessions.sessionId, sessionId));

    return session;
  }

  async deleteSessionById(sessionId: string) {
    await authDb
      .delete(sessions)
      .where(eq(sessions.sessionId, sessionId));
  }
}
