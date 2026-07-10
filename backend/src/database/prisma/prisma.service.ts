import { Injectable, type OnModuleDestroy } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../../../generated/prisma/client";
import { assertPooledDatabaseUrl } from "./runtime-url";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor() {
    const connectionString = assertPooledDatabaseUrl(process.env.DATABASE_URL);

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
