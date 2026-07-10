import type { Request, Response } from "express";
import { createApp } from "../src/app.factory";

type RequestHandler = (request: Request, response: Response) => void;

let requestHandlerPromise: Promise<RequestHandler> | undefined;

async function bootstrap(): Promise<RequestHandler> {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set for the serverless handler.");
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
