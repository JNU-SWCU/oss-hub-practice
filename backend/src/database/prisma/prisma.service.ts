import { Injectable, type OnModuleDestroy } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../../../generated/prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error("DATABASE_URL is required for Prisma runtime.");
    }

    // D1: physical connections are established lazily by the first query, not at startup.
    // Keep each warm serverless instance to one connection to bound database usage.
    const pool = new Pool({
      connectionString,
      max: 1,
      connectionTimeoutMillis: 5_000,
    });

    super({ adapter: new PrismaPg(pool) });
  }

  // This runs only when Nest tears down the application instance, never per request.
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
