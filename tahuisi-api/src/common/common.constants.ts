if (!Bun.env.COOKIE_SECRET)
  throw new Error("COOKIE_SECRET is undefined.");

export const COOKIE_SECRET = Bun.env.COOKIE_SECRET;