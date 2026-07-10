import type { Request, Response } from "express";
import { createApp } from "../src/app.factory";
import { assertPooledDatabaseUrl } from "../src/database/prisma/runtime-url";

type RequestHandler = (request: Request, response: Response) => void;

let requestHandlerPromise: Promise<RequestHandler> | undefined;

async function bootstrap(): Promise<RequestHandler> {
  try {
    assertPooledDatabaseUrl(process.env.DATABASE_URL);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid DATABASE_URL.";
    throw new Error(`Serverless handler DATABASE_URL validation failed: ${message}`);
  }

  const app = await createApp();
  await app.init();

  return app.getHttpAdapter().getInstance() as RequestHandler;
}

function getRequestHandler(): Promise<RequestHandler> {
  if (!requestHandlerPromise) {
    const bootstrapPromise = bootstrap();
    requestHandlerPromise = bootstrapPromise;
    void bootstrapPromise.catch(() => {
      if (requestHandlerPromise === bootstrapPromise) {
        requestHandlerPromise = undefined;
      }
    });
  }

  return requestHandlerPromise;
}

export default async function handler(request: Request, response: Response): Promise<void> {
  const requestHandler = await getRequestHandler();
  requestHandler(request, response);
}

export function __resetForTest(): void {
  requestHandlerPromise = undefined;
}
