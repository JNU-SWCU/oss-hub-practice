import type { NestExpressApplication } from "@nestjs/platform-express";
import type { Request, Response } from "express";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { assertPooledDatabaseUrl } from "./database/prisma/runtime-url";

const POOLED_DATABASE_URL =
  "postgresql://placeholder:placeholder@pooler.local:6543/postgres?pgbouncer=true";
const { createAppMock } = vi.hoisted(() => ({ createAppMock: vi.fn() }));

vi.mock("./app.factory", () => ({ createApp: createAppMock }));

type ServerlessHandler = (request: Request, response: Response) => Promise<void>;
type ServerlessModule = {
  __resetForTest: () => void;
  default: ServerlessHandler;
};

function createResponse(): Response {
  return {
    end: vi.fn(),
    statusCode: 0,
  } as unknown as Response;
}

describe("pooled database URL validator", () => {
  it("rejects non-PostgreSQL protocols with a pooler example", () => {
    expect(() => assertPooledDatabaseUrl("file:serverless-handler-test.db")).toThrow(
      "must use the postgres:// or postgresql:// protocol",
    );
  });

  it("rejects direct database URLs with a pooler example", () => {
    expect(() =>
      assertPooledDatabaseUrl(
        "postgresql://placeholder:placeholder@localhost:5432/postgres?pgbouncer=true",
      ),
    ).toThrow("must use pooler port 6543");
  });

  it("rejects URLs without pgbouncer=true with a pooler example", () => {
    expect(() =>
      assertPooledDatabaseUrl("postgresql://placeholder:placeholder@pooler.local:6543/postgres"),
    ).toThrow("must include the pgbouncer=true query parameter");
  });

  it("accepts a pooled PostgreSQL URL", () => {
    expect(assertPooledDatabaseUrl(POOLED_DATABASE_URL)).toBe(POOLED_DATABASE_URL);
  });
});

describe("serverless handler", () => {
  const originalDatabaseUrl = process.env.DATABASE_URL;
  let handler: ServerlessHandler;
  let resetHandler: () => void;
  let expressHandler: ReturnType<typeof vi.fn>;
  let nestApp: {
    getHttpAdapter: ReturnType<typeof vi.fn>;
    init: ReturnType<typeof vi.fn>;
  };

  beforeAll(() => {
    process.env.DATABASE_URL = POOLED_DATABASE_URL;
  });

  afterAll(() => {
    if (originalDatabaseUrl) {
      process.env.DATABASE_URL = originalDatabaseUrl;
    } else {
      Reflect.deleteProperty(process.env, "DATABASE_URL");
    }
  });

  beforeEach(async () => {
    vi.resetModules();
    createAppMock.mockReset();
    expressHandler = vi.fn((request: Request, response: Response) => {
      response.statusCode = request.url === "/does-not-exist" ? 404 : 200;
      response.end();
    });
    nestApp = {
      getHttpAdapter: vi.fn(() => ({ getInstance: () => expressHandler })),
      init: vi.fn(),
    };
    createAppMock.mockResolvedValue(nestApp);

    const serverlessModule = (await import("../api/index")) as ServerlessModule;
    handler = serverlessModule.default;
    resetHandler = serverlessModule.__resetForTest;
    resetHandler();
    process.env.DATABASE_URL = POOLED_DATABASE_URL;
  });

  it("bootstraps once for a cold request", async () => {
    const response = createResponse();

    await handler({ url: "/" } as Request, response);

    expect(createAppMock).toHaveBeenCalledOnce();
    expect(nestApp.init).toHaveBeenCalledOnce();
    expect(expressHandler).toHaveBeenCalledWith(expect.anything(), response);
  });

  it("shares one bootstrap promise between concurrent cold requests", async () => {
    let resolveApp: ((app: typeof nestApp) => void) | undefined;
    const delayedApp = new Promise<typeof nestApp>((resolve) => {
      resolveApp = resolve;
    });
    createAppMock.mockReturnValueOnce(delayedApp);
    const firstResponse = createResponse();
    const secondResponse = createResponse();

    const firstRequest = handler({ url: "/first" } as Request, firstResponse);
    const secondRequest = handler({ url: "/second" } as Request, secondResponse);

    expect(createAppMock).toHaveBeenCalledOnce();
    resolveApp?.(nestApp);
    await Promise.all([firstRequest, secondRequest]);

    expect(nestApp.init).toHaveBeenCalledOnce();
    expect(expressHandler).toHaveBeenCalledTimes(2);
  });

  it("reuses the initialized application for warm requests", async () => {
    await handler({ url: "/first" } as Request, createResponse());
    await handler({ url: "/second" } as Request, createResponse());

    expect(createAppMock).toHaveBeenCalledOnce();
    expect(nestApp.init).toHaveBeenCalledOnce();
  });

  it("fails explicitly when DATABASE_URL is missing", async () => {
    Reflect.deleteProperty(process.env, "DATABASE_URL");

    await expect(handler({ url: "/" } as Request, createResponse())).rejects.toThrow(
      "Serverless handler DATABASE_URL validation failed: DATABASE_URL is required",
    );

    expect(createAppMock).not.toHaveBeenCalled();
    process.env.DATABASE_URL = POOLED_DATABASE_URL;
    await handler({ url: "/" } as Request, createResponse());

    expect(createAppMock).toHaveBeenCalledOnce();
  });
});

describe("Nest HTTP boundary", () => {
  const originalDatabaseUrl = process.env.DATABASE_URL;
  let app: NestExpressApplication | undefined;

  beforeAll(async () => {
    process.env.DATABASE_URL = POOLED_DATABASE_URL;
    const { createApp } = await vi.importActual<typeof import("./app.factory")>("./app.factory");
    app = await createApp();
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
    if (originalDatabaseUrl) {
      process.env.DATABASE_URL = originalDatabaseUrl;
    } else {
      Reflect.deleteProperty(process.env, "DATABASE_URL");
    }
  });

  it("returns Nest's real 404 response for an unknown route", async () => {
    if (!app) {
      throw new Error("Nest application did not initialize.");
    }

    await request(app.getHttpServer()).get("/does-not-exist").expect(404);
  });
});
