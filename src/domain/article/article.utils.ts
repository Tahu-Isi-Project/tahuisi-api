if (!Bun.env.CF_ZONE_ID)
  throw new Error("CF_ZONE_ID is undefined");

if (!Bun.env.CF_API_TOKEN)
  throw new Error("CF_API_TOKEN is undefined");

if (!Bun.env.FRONTEND_HOST)
  throw new Error("FRONTEND_HOST is undefined");

const zoneId = Bun.env.CF_ZONE_ID;
const token = Bun.env.CF_API_TOKEN;
const frontendHost = Bun.env.FRONTEND_HOST;

export async function purgeArticleCache(slug: string) {
  await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      prefixes: [frontendHost, `${frontendHost}/article/${slug}`]
    })
  });
}
