# ---------- Base ----------
FROM node:22-alpine AS base

RUN corepack enable

WORKDIR /app


# ---------- Dependencies ----------
FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY apps/api/package.json ./apps/api/package.json

RUN pnpm install --frozen-lockfile


# ---------- Build ----------
FROM deps AS build

COPY apps/api ./apps/api

RUN pnpm --filter @repo/api build

RUN pnpm --filter @repo/api deploy --prod /app/deployed


# ---------- Production ----------
FROM node:22-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /app/deployed ./

COPY --from=build /app/apps/api/dist ./dist

USER node

EXPOSE 3000

CMD ["node", "dist/server.js"]