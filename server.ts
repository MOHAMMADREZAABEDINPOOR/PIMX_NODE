import "dotenv/config";
import express from "express";
import { createServer } from "node:http";
import path from "node:path";
import { createHmac, randomUUID } from "node:crypto";
import { WebSocketServer, WebSocket } from "ws";
import { createServer as createViteServer } from "vite";

type Peer = {
  ws: WebSocket;
  id: string;
  name: string;
  deviceType: string;
  roomId: string;
  alive: boolean;
};
type Room = {
  peers: Map<string, Peer>;
  host: string;
  locked: boolean;
  maxPeers: number;
  expiresAt: number;
  blocked: Set<string>;
};
const rooms = new Map<string, Room>();
const send = (ws: WebSocket, value: unknown) => {
  if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(value));
};
function publish(room: Room) {
  for (const peer of room.peers.values())
    send(peer.ws, {
      type: "peers",
      peers: [...room.peers.values()]
        .filter((p) => p.id !== peer.id)
        .map(({ id, name, deviceType }) => ({ id, name, deviceType })),
      room: {
        host: room.host,
        locked: room.locked,
        maxPeers: room.maxPeers,
        expiresAt: room.expiresAt,
      },
    });
}
async function start() {
  const app = express(),
    http = createServer(app);
  const wss = new WebSocketServer({ noServer: true, maxPayload: 128 * 1024 });
  http.on("upgrade", (req, socket, head) => {
    if (
      new URL(req.url || "/", "http://localhost").pathname === "/ws-signaling"
    )
      wss.handleUpgrade(req, socket, head, (ws) =>
        wss.emit("connection", ws, req),
      );
  });
  wss.on("connection", (ws: WebSocket) => {
    let current: Peer | undefined;
    const idle = setTimeout(() => {
      if (!current) ws.close(1008, "Join timeout");
    }, 10_000);
    let windowStart = Date.now(),
      messages = 0;
    ws.on("pong", () => {
      if (current) current.alive = true;
    });
    ws.on("message", (raw) => {
      if (Date.now() - windowStart > 1000) {
        messages = 0;
        windowStart = Date.now();
      }
      if (++messages > 100) return ws.close(1008, "Rate limit");
      try {
        const m = JSON.parse(raw.toString());
        if (m.type === "join") {
          if (current) return;
          if (
            !/^[a-zA-Z0-9_-]{6,80}$/.test(m.roomId) ||
            !/^[a-zA-Z0-9-]{16,64}$/.test(m.id)
          )
            return ws.close(1008, "Invalid room");
          let room = rooms.get(m.roomId);
          if (room && room.expiresAt <= Date.now())
            return send(ws, { type: "error", code: "expired" });
          if (room?.blocked.has(m.id))
            return send(ws, { type: "error", code: "removed" });
          if (room?.peers.has(m.id))
            return send(ws, { type: "error", code: "duplicate" });
          if (
            room &&
            ((room.locked && room.host !== m.id) ||
              room.peers.size >= room.maxPeers)
          )
            return send(ws, {
              type: "error",
              code: room.locked ? "locked" : "full",
            });
          if (!room) {
            room = {
              peers: new Map(),
              host: m.id,
              locked: false,
              maxPeers: 8,
              expiresAt: Date.now() + 3600_000,
              blocked: new Set(),
            };
            rooms.set(m.roomId, room);
          }
          if (!room.peers.size) room.host = m.id;
          current = {
            ws,
            id: m.id,
            name: String(m.name || "Device").slice(0, 40),
            deviceType: m.deviceType === "mobile" ? "mobile" : "desktop",
            roomId: m.roomId,
            alive: true,
          };
          room.peers.set(current.id, current);
          clearTimeout(idle);
          send(ws, { type: "registered", id: current.id });
          publish(room);
          return;
        }
        if (!current) return;
        const room = rooms.get(current.roomId);
        if (!room) return;
        if (m.type === "signal") {
          const target = room.peers.get(m.to);
          if (target && m.data && JSON.stringify(m.data).length < 100_000)
            send(target.ws, { type: "signal", from: current.id, data: m.data });
        } else if (m.type === "rename") {
          current.name = String(m.name || "Device").slice(0, 40);
          publish(room);
        } else if (m.type === "room-settings" && room.host === current.id) {
          room.locked = !!m.locked;
          room.maxPeers = Math.max(2, Math.min(16, Number(m.maxPeers) || 8));
          room.expiresAt =
            Date.now() +
            Math.max(5, Math.min(1440, Number(m.minutes) || 60)) * 60_000;
          publish(room);
        } else if (
          m.type === "kick" &&
          room.host === current.id &&
          m.id !== current.id
        ) {
          const target = room.peers.get(m.id);
          if (target) {
            room.blocked.add(target.id);
            send(target.ws, { type: "error", code: "removed" });
            target.ws.close(1008, "Removed by room owner");
          }
        }
      } catch {
        send(ws, { type: "error", code: "invalid" });
      }
    });
    ws.on("close", () => {
      clearTimeout(idle);
      if (!current) return;
      const room = rooms.get(current.roomId);
      if (!room || room.peers.get(current.id)?.ws !== ws) return;
      room.peers.delete(current.id);
      if (room.host === current.id && room.peers.size) {
        room.host = room.peers.keys().next().value!;
        room.locked = false;
      }
      publish(room);
    });
    ws.on("error", () => ws.close());
  });
  const heartbeat = setInterval(() => {
    for (const [id, room] of rooms) {
      if (room.expiresAt <= Date.now()) {
        for (const peer of room.peers.values()) {
          send(peer.ws, { type: "error", code: "expired" });
          peer.ws.close();
        }
        rooms.delete(id);
        continue;
      }
      for (const peer of room.peers.values()) {
        if (!peer.alive) peer.ws.terminate();
        else {
          peer.alive = false;
          peer.ws.ping();
        }
      }
    }
  }, 25_000);
  heartbeat.unref();
  wss.on("close", () => clearInterval(heartbeat));
  app.get("/api/health", (_req, res) =>
    res.json({
      status: "healthy",
      activePeers: [...rooms.values()].reduce((n, r) => n + r.peers.size, 0),
      activeRooms: rooms.size,
    }),
  );
  app.get("/api/rtc-config", (_req, res) => {
    const iceServers: unknown[] = [{ urls: "stun:stun.l.google.com:19302" }];
    if (process.env.TURN_URL && process.env.TURN_SHARED_SECRET) {
      const username = `${Math.floor(Date.now() / 1000) + 3600}:${randomUUID()}`;
      iceServers.push({
        urls: process.env.TURN_URL.split(","),
        username,
        credential: createHmac("sha1", process.env.TURN_SHARED_SECRET)
          .update(username)
          .digest("base64"),
      });
    } else if (
      process.env.TURN_URL &&
      process.env.TURN_USERNAME &&
      process.env.TURN_CREDENTIAL
    )
      iceServers.push({
        urls: process.env.TURN_URL.split(","),
        username: process.env.TURN_USERNAME,
        credential: process.env.TURN_CREDENTIAL,
      });
    res.setHeader("Cache-Control", "no-store");
    res.json({ iceServers, relayAvailable: iceServers.length > 1 });
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === "true" ? false : { server: http },
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const dist = path.join(process.cwd(), "dist");
    app.use(express.static(dist));
    app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));
  }
  http.listen(Number(process.env.PORT) || 3000, "0.0.0.0", () =>
    console.log(`PIMXNODE http://localhost:${process.env.PORT || 3000}`),
  );
}
start().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
