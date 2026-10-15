// Minimal Pages contracts keep worker globals separate from browser DOM types.
interface KVNamespace {
  get(key: string, options?: { type: "text" }): Promise<string | null>;
  put(
    key: string,
    value: string,
    options?: { expirationTtl?: number },
  ): Promise<void>;
  list(options?: {
    prefix?: string;
    limit?: number;
    cursor?: string;
  }): Promise<{
    keys: { name: string }[];
    list_complete: boolean;
    cursor?: string;
  }>;
}
type PagesFunction<Env = Record<string, unknown>> = (context: {
  request: Request;
  env: Env;
  waitUntil(promise: Promise<unknown>): void;
}) => Response | Promise<Response>;

interface PagesSignalEnv {
  SIGNALING: {
    idFromName(name: string): unknown;
    get(id: unknown): { fetch(request: Request): Promise<Response> };
  };
}
