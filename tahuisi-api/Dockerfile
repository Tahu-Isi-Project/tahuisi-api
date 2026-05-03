# 1. Build stage
FROM oven/bun:1.3.13-alpine AS build-stage
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# 2. Deploy stage
FROM oven/bun:1.3.13-alpine AS deploy-stage
WORKDIR /app

USER root

RUN mkdir -p /app/data && chown -R 1000:1000 /app/data

COPY --from=build-stage /app/dist/index.js ./index.js
COPY --from=build-stage /app/migrations ./migrations

# Sharp dependencies (still waiting for native Bun image library)
COPY --from=build-stage /app/node_modules/@img ./node_modules/@img
COPY --from=build-stage /app/node_modules/sharp ./node_modules/sharp
COPY --from=build-stage /app/node_modules/detect-libc ./node_modules/detect-libc
COPY --from=build-stage /app/node_modules/semver ./node_modules/semver

RUN chown -R 1000:1000 /app
USER bun

ENV NODE_ENV=production
ENV MIGRATIONS_BASE_PATH=/app/migrations
ENV DATABASE_BASE_PATH=/app/data

EXPOSE 3000

CMD ["bun", "index.js"]