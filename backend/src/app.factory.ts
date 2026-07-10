import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";

export function createApp(): Promise<NestExpressApplication> {
  return NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter());
}
