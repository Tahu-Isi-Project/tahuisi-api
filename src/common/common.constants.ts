if (!Bun.env.COOKIE_SECRET)
  throw new Error("COOKIE_SECRET is undefined.");

export const COOKIE_SECRET = Bun.env.COOKIE_SECRET;
export const UNIQUE_CONSTRAINT_ERROR = "SQLITE_CONSTRAINT_UNIQUE";