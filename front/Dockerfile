FROM node:22-alpine AS build
WORKDIR /app
COPY package.json next.config.ts tsconfig.json next-env.d.ts ./
COPY src ./src
RUN corepack enable && pnpm install --frozen-lockfile && pnpm build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
CMD ["node", "server.js"]
