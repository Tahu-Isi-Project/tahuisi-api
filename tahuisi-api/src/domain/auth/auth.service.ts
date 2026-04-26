import AuthRepository from "@auth/auth.repository";
import { UserLogin, UserRegister } from "@auth/auth.types";
import { ConflictError, UnauthorizedError } from "@common/common.error";
import { randomUUIDv7 } from "bun";

export default class AuthService {
  private repo: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.repo = authRepository;
  }

  async registerUser(registerData: UserRegister) {
    const emailExists = await this.repo.findUserByEmail(registerData.email);
    if (emailExists)
      throw new ConflictError("Email already registered to another account.");

    const usernameExists = await this.repo.findUserByUsername(registerData.username);
    if (usernameExists)
      throw new ConflictError("Username already taken.");
    
    const passwordHash = await Bun.password.hash(registerData.password, "argon2id");

    await this.repo.createUser({
      email: registerData.email, 
      username: registerData.username, 
      passwordHash: passwordHash, 
      displayName: registerData.displayName, 
      gender: registerData.gender,
    });
  }

  async loginUser(loginData: UserLogin) {
    const unauthorizedMessage = "Email/password provided is invalid."

    const userData = await this.repo.findUserByEmail(loginData.email, true);
    if (!userData) throw new UnauthorizedError(unauthorizedMessage);

    const isVerified = await Bun.password.verify(loginData.password, userData.passwordHash);
    if (!isVerified) throw new UnauthorizedError(unauthorizedMessage);

    const sessionId = randomUUIDv7();
    const ONE_DAY = 1000 * 60 * 60 * 24;
    await this.repo.createSession({
      sessionId: sessionId,
      userId: userData.userId,
      expiresAt: new Date(Date.now() + ONE_DAY)
    });

    return { sessionId };
  }

  async logoutUser(sessionId: string) {
    const session = await this.repo.findSessionById(sessionId);
    if (!session) return;

    await this.repo.deleteSessionById(sessionId);
  }

  async getSession(sessionId: string) {
    const session = await this.repo.findSessionById(sessionId);
    if (!session)
      throw new UnauthorizedError("Session invalid.");

    return session;
  }
}
