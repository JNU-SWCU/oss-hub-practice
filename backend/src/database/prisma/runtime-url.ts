const POOLED_DATABASE_URL_EXAMPLE =
  "postgresql://user:password@pooler.example.com:6543/database?pgbouncer=true";

export function assertPooledDatabaseUrl(url: string | undefined): string {
  if (!url?.trim()) {
    throw new Error(
      `DATABASE_URL is required and must be a pooled PostgreSQL URL. Use ${POOLED_DATABASE_URL_EXAMPLE}.`,
    );
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error(
      `DATABASE_URL must be a valid pooled PostgreSQL URL. Use ${POOLED_DATABASE_URL_EXAMPLE}.`,
    );
  }

  if (parsedUrl.protocol !== "postgres:" && parsedUrl.protocol !== "postgresql:") {
    throw new Error(
      `DATABASE_URL must use the postgres:// or postgresql:// protocol, not ${parsedUrl.protocol}. Use ${POOLED_DATABASE_URL_EXAMPLE}.`,
    );
  }

  if (parsedUrl.port !== "6543") {
    throw new Error(
      `DATABASE_URL must use pooler port 6543, not ${parsedUrl.port || "the default port"}; direct port 5432 is not allowed. Use ${POOLED_DATABASE_URL_EXAMPLE}.`,
    );
  }

  if (parsedUrl.searchParams.get("pgbouncer") !== "true") {
    throw new Error(
      `DATABASE_URL must include the pgbouncer=true query parameter. Use ${POOLED_DATABASE_URL_EXAMPLE}.`,
    );
  }

  return url;
}
