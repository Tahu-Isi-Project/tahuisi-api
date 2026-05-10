## 1. Build stage
FROM oven/bun:1.3.13-alpine AS build-stage
WORKDIR /app

ARG TZ=UTC

COPY . .
RUN bun install --frozen-lockfile \
    && bun run build \

    && mkdir -p /app/tmp/data \
    && mkdir -p /app/tmp \
    && mkdir -p /app/tmp/migrations \

    && mkdir -p /app/tmp/node_modules/@img \
    && mv /app/node_modules/@img/colour /app/tmp/node_modules/@img/ \
    && mv /app/node_modules/@img/sharp-libvips-linuxmusl-x64 /app/tmp/node_modules/@img/ \
    && mv /app/node_modules/@img/sharp-linuxmusl-x64 /app/tmp/node_modules/@img/ \

    && mkdir -p /app/tmp/node_modules/detect-libc \
    && mv /app/node_modules/detect-libc /app/tmp/node_modules/ \

    && mkdir -p /app/tmp/node_modules/sharp \
    && mv /app/node_modules/sharp /app/tmp/node_modules/ \

    && mkdir -p /app/tmp/node_modules/semver \
    && mv /app/node_modules/semver /app/tmp/node_modules/ \

    && mv /app/dist /app/tmp/dist/ \
    && mv /app/migrations/* /app/tmp/migrations

## 2. Deploy stage
FROM oven/bun:1.3.13-alpine AS deploy-stage
WORKDIR /app

ENV NODE_ENV=production \
    MIGRATIONS_BASE_PATH=/app/migrations \
    DATABASE_BASE_PATH=/app/data

COPY --from=build-stage --chown=bun:bun /app/tmp/. .

USER bun

EXPOSE 3000

CMD ["bun", "/app/dist/index.js"]