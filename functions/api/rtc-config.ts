interface Env {
  TURN_URL?: string;
  TURN_SHARED_SECRET?: string;
  TURN_USERNAME?: string;
  TURN_CREDENTIAL?: string;
}
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const iceServers: Record<string, unknown>[] = [
    { urls: "stun:stun.l.google.com:19302" },
  ];
  if (env.TURN_URL && env.TURN_SHARED_SECRET) {
    const username = `${Math.floor(Date.now() / 1000) + 3600}:${crypto.randomUUID()}`;
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(env.TURN_SHARED_SECRET),
      { name: "HMAC", hash: "SHA-1" },
      false,
      ["sign"],
    );
    const signature = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(username),
    );
    iceServers.push({
      urls: env.TURN_URL.split(","),
      username,
      credential: btoa(String.fromCharCode(...new Uint8Array(signature))),
    });
  } else if (env.TURN_URL && env.TURN_USERNAME && env.TURN_CREDENTIAL) {
    iceServers.push({
      urls: env.TURN_URL.split(","),
      username: env.TURN_USERNAME,
      credential: env.TURN_CREDENTIAL,
    });
  }
  return Response.json(
    { iceServers, relayAvailable: iceServers.length > 1 },
    { headers: { "Cache-Control": "no-store" } },
  );
};
