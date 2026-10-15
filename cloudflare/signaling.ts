import { DurableObject } from "cloudflare:workers";

interface Env {
  SIGNALING: DurableObjectNamespace<SignalingRoom>;
}
type Peer = { id: string; name: string; deviceType: "mobile" | "desktop" };
type Attachment = {
  peer?: Peer;
  opened: number;
  windowStart: number;
  messages: number;
};
type Room = {
  id: string;
  host: string;
  locked: boolean;
  maxPeers: number;
  expiresAt: number;
  blocked: string[];
};

// Each room owns its sockets. Only signaling metadata is persisted, never file bytes or keys.
export class SignalingRoom extends DurableObject<Env> {
  private room: Room | null = null;
  private sessions = new Map<WebSocket, Attachment>();
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.ctx.blockConcurrencyWhile(async () => {
      this.room = (await this.ctx.storage.get<Room>("room")) || null;
      for (const ws of this.ctx.getWebSockets()) {
        const attachment = ws.deserializeAttachment() as Attachment | null;
        if (attachment) this.sessions.set(ws, attachment);
      }
    });
  }
  private send(ws: WebSocket, message: unknown) {
    try {
      ws.send(JSON.stringify(message));
    } catch {
      /* close callback removes it */
    }
  }
  private peers() {
    return [...this.sessions].filter(([, attachment]) => attachment.peer);
  }
  private publish() {
    if (!this.room) return;
    const peers = this.peers();
    for (const [ws, attachment] of peers)
      this.send(ws, {
        type: "peers",
        peers: peers
          .filter(([other]) => other !== ws)
          .map(([, value]) => value.peer),
        room: {
          host: this.room.host,
          locked: this.room.locked,
          maxPeers: this.room.maxPeers,
          expiresAt: this.room.expiresAt,
        },
      });
  }
  private async persist() {
    if (this.room) await this.ctx.storage.put("room", this.room);
  }
  private async schedule() {
    const deadlines = [...this.sessions.values()]
      .filter((a) => !a.peer)
      .map((a) => a.opened + 10_000);
    if (this.room) deadlines.push(this.room.expiresAt);
    if (deadlines.length)
      await this.ctx.storage.setAlarm(
        Math.max(Date.now() + 100, Math.min(...deadlines)),
      );
  }
  async fetch(request: Request) {
    const url = new URL(request.url);
    if (url.pathname === "/api/health")
      return Response.json({
        status: "healthy",
        activePeers: this.peers().length,
        activeRooms: this.room && this.room.expiresAt > Date.now() ? 1 : 0,
      });
    if (request.headers.get("Upgrade")?.toLowerCase() !== "websocket")
      return new Response("WebSocket upgrade required", { status: 426 });
    if (this.sessions.size >= 24)
      return new Response("Room capacity reached", { status: 429 });
    const roomId = url.searchParams.get("room") || "";
    if (!/^[a-zA-Z0-9_-]{6,80}$/.test(roomId))
      return new Response("Invalid room", { status: 400 });
    if (this.room && this.room.id !== roomId)
      return new Response("Wrong room", { status: 400 });
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.ctx.acceptWebSocket(server);
    const attachment: Attachment = {
      opened: Date.now(),
      windowStart: Date.now(),
      messages: 0,
    };
    server.serializeAttachment(attachment);
    this.sessions.set(server, attachment);
    // The room id comes from the same namespace key used by Pages.
    if (!this.room) {
      this.room = {
        id: roomId,
        host: "",
        locked: false,
        maxPeers: 8,
        expiresAt: Date.now() + 3_600_000,
        blocked: [],
      };
      await this.persist();
    }
    await this.schedule();
    return new Response(null, { status: 101, webSocket: client });
  }
  async webSocketMessage(ws: WebSocket, raw: string | ArrayBuffer) {
    const attachment = this.sessions.get(ws);
    if (!attachment || !this.room) return ws.close(1008, "Unknown connection");
    if (
      typeof raw !== "string" ||
      new TextEncoder().encode(raw).byteLength > 128 * 1024
    )
      return ws.close(1009, "Message too large");
    if (Date.now() - attachment.windowStart > 1000) {
      attachment.windowStart = Date.now();
      attachment.messages = 0;
    }
    if (++attachment.messages > 100) return ws.close(1008, "Rate limit");
    ws.serializeAttachment(attachment);
    if (this.room.expiresAt <= Date.now()) {
      this.send(ws, { type: "error", code: "expired" });
      return ws.close(1008, "Room expired");
    }
    let message: Record<string, any>;
    try {
      message = JSON.parse(raw);
      if (!message || typeof message !== "object") throw new Error();
    } catch {
      return this.send(ws, { type: "error", code: "invalid" });
    }
    if (message.type === "join") {
      if (attachment.peer) return;
      if (
        message.roomId !== this.room.id ||
        typeof message.id !== "string" ||
        !/^[a-zA-Z0-9-]{16,64}$/.test(message.id)
      )
        return ws.close(1008, "Invalid room");
      const peers = this.peers();
      const error = this.room.blocked.includes(message.id)
        ? "removed"
        : peers.some(([, a]) => a.peer!.id === message.id)
          ? "duplicate"
          : this.room.locked && this.room.host !== message.id
            ? "locked"
            : peers.length >= this.room.maxPeers
              ? "full"
              : "";
      if (error) {
        this.send(ws, { type: "error", code: error });
        return ws.close(1008, error);
      }
      if (!peers.length) this.room.host = message.id;
      attachment.peer = {
        id: message.id,
        name: String(message.name || "Device").slice(0, 40),
        deviceType: message.deviceType === "mobile" ? "mobile" : "desktop",
      };
      ws.serializeAttachment(attachment);
      await this.persist();
      await this.schedule();
      this.send(ws, { type: "registered", id: message.id });
      this.publish();
      return;
    }
    const peer = attachment.peer;
    if (!peer) return;
    if (message.type === "signal") {
      const target = this.peers().find(
        ([, a]) => a.peer!.id === message.to,
      )?.[0];
      if (
        target &&
        message.data &&
        JSON.stringify(message.data).length < 100_000
      )
        this.send(target, {
          type: "signal",
          from: peer.id,
          data: message.data,
        });
    } else if (message.type === "rename") {
      peer.name = String(message.name || "Device").slice(0, 40);
      ws.serializeAttachment(attachment);
      this.publish();
    } else if (message.type === "room-settings" && this.room.host === peer.id) {
      this.room.locked = !!message.locked;
      this.room.maxPeers = Math.max(
        2,
        Math.min(16, Number(message.maxPeers) || 8),
      );
      this.room.expiresAt =
        Date.now() +
        Math.max(5, Math.min(1440, Number(message.minutes) || 60)) * 60_000;
      await this.persist();
      await this.schedule();
      this.publish();
    } else if (
      message.type === "kick" &&
      this.room.host === peer.id &&
      message.id !== peer.id
    ) {
      const target = this.peers().find(
        ([, a]) => a.peer!.id === message.id,
      )?.[0];
      if (target) {
        this.room.blocked.push(message.id);
        await this.persist();
        this.send(target, { type: "error", code: "removed" });
        target.close(1008, "Removed by room owner");
        await this.remove(target);
      }
    }
  }
  private async remove(ws: WebSocket) {
    const peer = this.sessions.get(ws)?.peer;
    this.sessions.delete(ws);
    if (this.room?.host === peer?.id) {
      const next = this.peers()[0]?.[1].peer;
      if (next) {
        this.room!.host = next.id;
        this.room!.locked = false;
      }
    }
    await this.persist();
    this.publish();
  }
  async webSocketClose(ws: WebSocket, code: number, reason: string) {
    ws.close(code === 1006 ? 1000 : code, reason);
    await this.remove(ws);
  }
  async webSocketError(ws: WebSocket) {
    ws.close(1011, "Connection error");
    await this.remove(ws);
  }
  async alarm() {
    for (const [ws, attachment] of this.sessions)
      if (!attachment.peer && attachment.opened + 10_000 <= Date.now()) {
        ws.close(1008, "Join timeout");
        this.sessions.delete(ws);
      }
    if (this.room && this.room.expiresAt <= Date.now()) {
      for (const [ws] of this.sessions) {
        this.send(ws, { type: "error", code: "expired" });
        ws.close(1000, "Room expired");
      }
      this.sessions.clear();
      this.room = null;
      await this.ctx.storage.deleteAll();
    } else await this.schedule();
  }
}

// Pages reaches the class through its namespace binding; the public Worker has no API.
export default {
  fetch() {
    return new Response("Not found", { status: 404 });
  },
};
