export const onRequestGet: PagesFunction<PagesSignalEnv> = async ({
  request,
  env,
}) => {
  const room = new URL(request.url).searchParams.get("room");
  if (room && /^[a-zA-Z0-9_-]{6,80}$/.test(room))
    return env.SIGNALING.get(env.SIGNALING.idFromName(room)).fetch(request);
  return Response.json(
    { status: "healthy", activePeers: 0, activeRooms: 0 },
    { headers: { "Cache-Control": "no-store" } },
  );
};
