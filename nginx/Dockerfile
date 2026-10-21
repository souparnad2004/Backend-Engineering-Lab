FROM node:22-alpine

WORKDIR /app

RUN corepack enable
RUN corepack prepare pnpm@12.11.2 --activate

COPY package.json ./

RUN pnpm install --no-frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["pnpm", "start"]
