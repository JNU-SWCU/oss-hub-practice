import "dotenv/config";
import { defineConfig } from "prisma/config";

const directUrl = process.env.DIRECT_URL;

if (!directUrl) {
  throw new Error(
    "DIRECT_URL is required for Prisma CLI (migrations/generate); use a non-secret placeholder for generate.",
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: directUrl },
});
