import type { Request, Response } from "express";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

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
    process.env.DATABASE_URL = "file:serverless-handler-test.db";
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
    process.env.DATABASE_URL = "file:serverless-handler-test.db";
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
      "DATABASE_URL must be set for the serverless handler.",
    );

    expect(createAppMock).not.toHaveBeenCalled();
    process.env.DATABASE_URL = "file:serverless-handler-test.db";
    await handler({ url: "/" } as Request, createResponse());

    expect(createAppMock).toHaveBeenCalledOnce();
  });

  it("delegates an unknown route to Nest's 404 response", async () => {
    const response = createResponse();

    await handler({ url: "/does-not-exist" } as Request, response);

    expect(expressHandler).toHaveBeenCalledOnce();
    expect(response.statusCode).toBe(404);
  });
});
