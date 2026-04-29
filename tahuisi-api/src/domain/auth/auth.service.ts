import AuthRepository from "@auth/auth.repository";
import { UserLogin, UserRegister } from "@auth/auth.types";
import { ConflictError, UnauthorizedError } from "@common/common.error";
import { randomUUIDv7 } from "bun";

export default class AuthService {
  private repo: AuthRepository;
  private expirationTime: number; 
  private static UNAUTHORIZED_MSG = "Email/password provided is invalid.";

  constructor(authRepository: AuthRepository) {
    this.repo = authRepository;

    const DEFAULT_EXPIRATION_TIME = 1000 * 60 * 60 * 3; // 3 hours

    this.expirationTime = Bun.env.AUTH_SESSION_EXPIRATION 
      ? Number.parseInt(Bun.env.AUTH_SESSION_EXPIRATION) 
      : DEFAULT_EXPIRATION_TIME;
  }

  async registerUser(registerData: UserRegister) {
    const emailExists = await this.repo.findUserByEmail(registerData.email);
    if (emailExists) throw new ConflictError("Email already registered to another account.");

    const usernameExists = await this.repo.findUserByUsername(registerData.username);
    if (usernameExists) throw new ConflictError("Username already taken.");
    
    const passwordHash = await Bun.password.hash(registerData.password, "argon2id");

    const sanitizedRegisterData = {
      email: registerData.email, 
      username: registerData.username, 
      passwordHash, 
      displayName: registerData.displayName, 
      gender: registerData.gender,
    }

    await this.repo.createUser(sanitizedRegisterData);
  }

  async loginUser(loginData: UserLogin): Promise<string> {
    const userData = await this.repo.findUserByEmail(loginData.email, true);
    if (!userData) throw new UnauthorizedError(AuthService.UNAUTHORIZED_MSG);

    const isVerified = await Bun.password.verify(loginData.password, userData.passwordHash);
    if (!isVerified) throw new UnauthorizedError(AuthService.UNAUTHORIZED_MSG);

    const currentSessions = await this.repo.findSessionByUserId(userData.userId);
    if (currentSessions.length !== 0) {
      await this.repo.deleteSessionByUserIdAndUserAgentAndIpAddress({ 
        userId: userData.userId, 
        userAgent: loginData.userAgent, 
        ipAddress: loginData.ipAddress
      });
    }

    const sessionId = randomUUIDv7();

    await this.repo.createSession({
      sessionId: sessionId,
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

  // for development
  // async getSessions() {
  //   return await this.repo.findAllSessions();
  // }

  // async deleteAllSessions() {
  //   await this.repo.deleteAllSessions();
  // }
}
