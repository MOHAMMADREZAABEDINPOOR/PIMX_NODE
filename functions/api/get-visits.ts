/**
 * Cloudflare Pages Function: GET /api/get-visits
 * Returns all stored visit entries from KV namespace PIMX_VISITS.
 * Supports optional ?limit=N query param (default 500, max 1000).
 * Admin-only: protected by a secret query param ?secret=<ADMIN_SECRET>
 */

interface Env {
  PIMX_VISITS: KVNamespace;
  /** Optional: set ADMIN_SECRET env var in CF Pages for basic protection */
  ADMIN_SECRET?: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  const url = new URL(request.url);

  // Basic secret guard (optional — set ADMIN_SECRET in CF Pages env vars)
  const adminSecret = env.ADMIN_SECRET;
  if (adminSecret) {
    const provided = url.searchParams.get("secret");
    if (provided !== adminSecret) {
      return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  try {
    const limitParam = parseInt(url.searchParams.get("limit") || "500", 10);
    const limit = Math.min(Math.max(limitParam, 1), 1000);

    // List all keys with prefix "visit:"
    const listResult = await env.PIMX_VISITS.list({
      prefix: "visit:",
      limit,
    });

    // Fetch all values in parallel
    const entries = await Promise.all(
      listResult.keys.map(async (kv) => {
        try {
          const raw = await env.PIMX_VISITS.get(kv.name, { type: "text" });
          if (!raw) return null;
          return JSON.parse(raw);
        } catch (_) {
          return null;
        }
      })
    );

    // Filter nulls and sort newest first
    const visits = entries
      .filter(Boolean)
      .sort((a: any, b: any) => b.timestamp - a.timestamp);

    return new Response(
      JSON.stringify({
        ok: true,
        visits,
        total: visits.length,
        truncated: listResult.list_complete === false,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ ok: false, error: err?.message ?? "unknown" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};
