FROM node:22-alpine AS build
WORKDIR /app
COPY package.json prisma.config.ts nest-cli.json tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
RUN corepack enable && pnpm install --frozen-lockfile && pnpm db:generate && pnpm build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/generated ./generated
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
CMD ["node", "dist/main.js"]
