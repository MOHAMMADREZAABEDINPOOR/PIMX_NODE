/**
 * Cloudflare Pages Function: POST /api/track-visit
 * Records a real visitor entry into KV storage.
 * Uses Cloudflare request headers for accurate IP / country detection.
 * Binding name: PIMX_VISITS (KV Namespace)
 */

interface Env {
  PIMX_VISITS: KVNamespace;
}

interface VisitEntry {
  timestamp: number;
  ip: string;
  country: string;
  city: string;
  region: string;
  device: string;
  os: string;
  browser: string;
  ua: string;
  peerName: string;
  roomId: string;
  referrer: string;
  path: string;
}

/** Detect device type, OS, and browser from User-Agent string */
function parseUserAgent(ua: string): { device: string; os: string; browser: string } {
  const uaLow = ua.toLowerCase();

  let device = "Windows";
  if (/android/.test(uaLow)) device = "Android";
  else if (/iphone/.test(uaLow)) device = "iPhone";
  else if (/ipad/.test(uaLow)) device = "iPad";
  else if (/macintosh|mac os x/.test(uaLow)) device = "macOS";
  else if (/linux/.test(uaLow)) device = "Linux";
  else if (/windows/.test(uaLow)) device = "Windows";

  let os = device;
  if (/android ([\d.]+)/.test(uaLow)) os = `Android ${uaLow.match(/android ([\d.]+)/)?.[1] ?? ""}`;
  else if (/os ([\d_]+) like mac/.test(uaLow)) {
    const v = uaLow.match(/os ([\d_]+) like mac/)?.[1]?.replace(/_/g, ".") ?? "";
    os = device === "iPad" ? `iPadOS ${v}` : `iOS ${v}`;
  } else if (/windows nt ([\d.]+)/.test(uaLow)) {
    const winVer: Record<string, string> = {
      "10.0": "Windows 10/11",
      "6.3": "Windows 8.1",
      "6.2": "Windows 8",
      "6.1": "Windows 7",
    };
    const v = uaLow.match(/windows nt ([\d.]+)/)?.[1] ?? "";
    os = winVer[v] ?? `Windows NT ${v}`;
  } else if (/mac os x ([\d_]+)/.test(uaLow)) {
    const v = uaLow.match(/mac os x ([\d_]+)/)?.[1]?.replace(/_/g, ".") ?? "";
    os = `macOS ${v}`;
  }

  let browser = "Other";
  if (/edg\//.test(uaLow)) browser = "Edge";
  else if (/opr\/|opera/.test(uaLow)) browser = "Opera";
  else if (/chrome\//.test(uaLow) && !/chromium/.test(uaLow)) browser = "Chrome";
  else if (/firefox\//.test(uaLow)) browser = "Firefox";
  else if (/safari\//.test(uaLow) && !/chrome/.test(uaLow)) browser = "Safari";
  else if (/chromium\//.test(uaLow)) browser = "Chromium";
  else if (/samsungbrowser/.test(uaLow)) browser = "Samsung Browser";

  return { device, os, browser };
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    // Real IP from Cloudflare
    const ip =
      request.headers.get("CF-Connecting-IP") ||
      request.headers.get("X-Forwarded-For")?.split(",")[0].trim() ||
      "unknown";

    // Real geo from Cloudflare (available automatically on CF Pages)
    const country = request.headers.get("CF-IPCountry") || "XX";
    const cfData = (request as any).cf as Record<string, string> | undefined;
    const city = cfData?.city || "";
    const region = cfData?.region || "";
    const timezone = cfData?.timezone || "";

    // User-Agent parsing
    const ua = request.headers.get("User-Agent") || "";
    const { device, os, browser } = parseUserAgent(ua);

    // Optional body fields (peerName, roomId, path, referrer)
    let bodyData: Partial<VisitEntry> = {};
    try {
      bodyData = await request.json();
    } catch (_) {}

    const entry: VisitEntry = {
      timestamp: Date.now(),
      ip,
      country,
      city,
      region,
      device,
      os,
      browser,
      ua: ua.slice(0, 200), // cap length
      peerName: (bodyData.peerName || "").slice(0, 60),
      roomId: (bodyData.roomId || "").slice(0, 20),
      referrer: (bodyData.referrer || "").slice(0, 200),
      path: (bodyData.path || "/").slice(0, 100),
    };

    // Store in KV:  key = "visit:<timestamp>:<random>" for uniqueness
    const key = `visit:${entry.timestamp}:${Math.random().toString(36).slice(2, 8)}`;

    // Keep up to 90 days (TTL 7776000s)
    await env.PIMX_VISITS.put(key, JSON.stringify(entry), {
      expirationTtl: 7776000,
    });

    return new Response(JSON.stringify({ ok: true, key }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, error: err?.message ?? "unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

// Handle CORS preflight
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};
