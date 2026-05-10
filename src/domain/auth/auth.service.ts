import AuthRepository from "@auth/auth.repository";
import { UserLogin, UserRegister } from "@auth/auth.types";
import { UNIQUE_CONSTRAINT_ERROR } from "@common/common.constants";
import { BadRequestError, ConflictError, UnauthorizedError } from "@common/common.http-error";
import { randomUUIDv7 } from "bun";

export default class AuthService {
  private repo: AuthRepository;
  private expirationTime: number; 

  constructor(authRepository: AuthRepository) {
    this.repo = authRepository;

    const DEFAULT_EXPIRATION_TIME = 1000 * 60 * 60 * 3; // 3 hours

    this.expirationTime = Bun.env.AUTH_SESSION_EXPIRATION 
      ? Number.parseInt(Bun.env.AUTH_SESSION_EXPIRATION) 
      : DEFAULT_EXPIRATION_TIME;
  }

  async registerUser(registerData: UserRegister) {
    const [existingEmail, existingUsername] = await Promise.all([
      await this.repo.findUserByEmail(registerData.email),
      await this.repo.findUserByUsername(registerData.username)
    ]);

    if (existingEmail) 
      throw new ConflictError("Email already registered");
    if (existingUsername) 
      throw new ConflictError("Username already registered");
    
    const passwordHash = await Bun.password.hash(registerData.password, "argon2id");

    const sanitizedRegisterData = {
      email: registerData.email, 
      username: registerData.username, 
      passwordHash, 
      displayName: registerData.displayName, 
      gender: registerData.gender,
    }

    try {
      return await this.repo.createUser(sanitizedRegisterData);
    } catch (err: any) {
      if (err.code === UNIQUE_CONSTRAINT_ERROR) {
        const msg = err.message as string;
        if (msg.includes("users.username") || msg.includes("users.real_username") || msg.includes("users.email"))
          throw new ConflictError("Username/email already registered.");
      }

      throw err;
    }
  }

  async loginUser(loginData: UserLogin): Promise<string> {
    const userData = await this.repo.findUserByEmail(loginData.email, true);

    const isVerified = userData && await Bun.password.verify(loginData.password, userData.passwordHash);
    if (!isVerified) throw new UnauthorizedError("Email/password provided is invalid.");

    const sessionId = randomUUIDv7();
    
    await this.repo.createSession({
      sessionId,
      userId: userData.userId,
      expiresAt: new Date(Date.now() + this.expirationTime),
      userAgent: loginData.userAgent,
      ipAddress: loginData.ipAddress
    });

    return sessionId;
  }

  async logoutUser(sessionId: string) {
    await this.repo.deleteSessionBySessionId(sessionId);
  }

  async logoutAllDevices(userId: string) {
    await this.repo.deleteSessionsByUserId(userId);
  }

  /**
   * Get a list of display names & userIds
   * @param userIds
   * @returns Array of { userId: string; displayName: string; }
   * @throws HTTP 400 error if there are any duplicate userIds provided
   */
  async getDisplayNames(userIds: string[]) {
    const seen = new Set<string>();
    const duplicates = new Set<string>();
    
    for (const id of userIds) {
      if (seen.has(id))
        duplicates.add(id);
      else 
        seen.add(id);
    }

    if (duplicates.size > 0)
      throw new BadRequestError(
        `Duplicate authorIds provided: ${Array.from(duplicates).join(", ")}`
      );

    return await this.repo.findDisplayNamesByUserIds(userIds);
  }

  async getSession(sessionId: string) {
    return await this.repo.findSessionBySessionId(sessionId);
  }

  // for development
  async getSessions() {
    return await this.repo.findAllSessions();
  }

  async deleteAllSessions() {
    await this.repo.deleteAllSessions();
  }

  async deleteAllUsers() {
    await this.repo.deleteAllUsers();
  }
}
