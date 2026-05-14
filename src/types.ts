export type AppEnv = {
  Variables: {
    user: {
      userId: string;
      username: string;
      role: "admin" | "user";
    };
    sessionId: string;
  };
};
