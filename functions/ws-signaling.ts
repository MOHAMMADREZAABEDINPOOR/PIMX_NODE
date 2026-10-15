export const onRequestGet: PagesFunction<PagesSignalEnv> = async ({
  request,
  env,
}) => {
  if (request.headers.get("Upgrade")?.toLowerCase() !== "websocket")
    return new Response("WebSocket upgrade required", { status: 426 });
  const url = new URL(request.url);
  const origin = request.headers.get("Origin");
  if (origin && origin !== url.origin)
    return new Response("Origin not allowed", { status: 403 });
  const room = url.searchParams.get("room") || "";
  if (!/^[a-zA-Z0-9_-]{6,80}$/.test(room))
    return new Response("Invalid room", { status: 400 });
  return env.SIGNALING.get(env.SIGNALING.idFromName(room)).fetch(request);
};
