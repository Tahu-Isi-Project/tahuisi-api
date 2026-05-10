import { SanitizedUserRegister, UserSession } from "@auth/auth.types";
import { sessions, users } from "@auth/db/schema";
import { randomUUIDv7 } from "bun";
import { eq, inArray } from "drizzle-orm";
import { authDb } from ".";

export default class AuthRepository {
  async findUserByEmail(
    email: string,
    withPasswordHash: true,
  ): Promise<
    { userId: string; email: string; passwordHash: string } | undefined
  >;

  async findUserByEmail(
    email: string,
    withPasswordHash?: false,
  ): Promise<{ userId: string; email: string } | undefined>;

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
      .select({
        userId: users.userId,
        username: users.username
      })
      .from(users)
      .where(eq(users.username, username.toLowerCase()));

    return res;
  }

  async findDisplayNamesByUserIds(userIds: string[]) {
    return await authDb
      .select({ 
        userId: users.userId,
        displayName: users.displayName,
      })
      .from(users)
      .where(inArray(users.userId, userIds));
  }
  
  async createUser(data: SanitizedUserRegister) {
    const [newUser] = await authDb
      .insert(users)
      .values({
        userId: randomUUIDv7(),
        email: data.email.toLowerCase(),
        username: data.username.toLowerCase(),
        realUsername: data.username,
        passwordHash: data.passwordHash,
        gender: data.gender,
        displayName: data.displayName,
      })
      .returning({ id: users.userId });
    
    return newUser;
  }

  async createSession(sessionData: UserSession) {
    await authDb
      .insert(sessions)
      .values({
        sessionId: sessionData.sessionId,
        userId: sessionData.userId,
        expiresAt: sessionData.expiresAt,
        userAgent: sessionData.userAgent,
        ipAddress: sessionData.ipAddress,
      })
      .onConflictDoUpdate({
        target: [sessions.userId, sessions.userAgent, sessions.ipAddress],
        set: {
          sessionId: sessionData.sessionId,
          expiresAt: sessionData.expiresAt
        }
      });
  }

  async findSessionBySessionId(sessionId: string) {
    const [session] = await authDb
      .select()
      .from(sessions)
      .where(eq(sessions.sessionId, sessionId));

    return session;
  }

  async findSessionByUserId(userId: string) {
    return await authDb
      .select({
        sessionId: sessions.sessionId,
        userId: sessions.userId,
        expiresAt: sessions.expiresAt,
        userAgent: sessions.userAgent,
        ipAddress: sessions.ipAddress,
      })
      .from(sessions)
      .where(eq(sessions.userId, userId));
  }

  async deleteSessionBySessionId(sessionId: string) {
    await authDb
      .delete(sessions)
      .where(eq(sessions.sessionId, sessionId));
  }

  async deleteSessionsByUserId(userId: string) {
    await authDb
      .delete(sessions)
      .where(eq(sessions.userId, userId));
  }

  // for development
  async findAllSessions() {
    return await authDb.select().from(sessions);
  }

  async deleteAllSessions() {
    await authDb.delete(sessions);
  }

  async deleteAllUsers() {
    await authDb.delete(users);
  }
}
