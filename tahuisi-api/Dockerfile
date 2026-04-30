# 1. Build stage
FROM oven/bun:1.3.13-alpine AS build-stage
WORKDIR /app

COPY package.json ./
RUN bun install

COPY . .
RUN bun run build

# 2. Deploy stage
FROM oven/bun:1.3.13-alpine AS deploy-stage
WORKDIR /app

RUN mkdir -p /app/data

COPY --from=build-stage /app/dist /app/dist
COPY --from=build-stage /app/src/domain/auth/db/migrations /app/src/domain/auth/db/migrations

RUN chown -R bun:bun /app/data

USER bun
ENV NODE_ENV=production
EXPOSE 3000

CMD ["bun", "./dist/index.js"]