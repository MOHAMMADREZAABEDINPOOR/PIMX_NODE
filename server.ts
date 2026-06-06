import express from "express";
import { createServer as createHttpServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import path from "path";
import { createServer as createViteServer } from "vite";

interface PeerConnection {
  ws: WebSocket;
  id: string;
  name: string;
  deviceType: "desktop" | "mobile";
  deviceDetail?: string;
  roomId: string;
}

async function startServer() {
  const app = express();
  const httpServer = createHttpServer(app);
  const PORT = 3000;

  // In-memory registry of active peer connections
  const peers = new Map<string, PeerConnection>();

  // High-performance nested Map index mapping roomId -> Map of peerId -> PeerConnection
  // This reduces room filtering complexity from O(N) linear scans to O(1) constant-time direct indexing,
  // preventing CPU saturation when thousands of concurrent rooms are used simultaneously.
  const rooms = new Map<string, Map<string, PeerConnection>>();

  // Helper to get all peers in a specific room
  function getPeersInRoom(roomId: string): PeerConnection[] {
    const roomMap = rooms.get(roomId);
    if (!roomMap) return [];
    return Array.from(roomMap.values());
  }

  // Helper to send a JSON message to a specific peer
  function sendJson(ws: WebSocket, message: any) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  // Broadcast peer list update to all peers in a room
  function broadcastPeersList(roomId: string) {
    const roomPeers = getPeersInRoom(roomId);
    const peerListData = roomPeers.map((p) => ({
      id: p.id,
      name: p.name,
      deviceType: p.deviceType,
      deviceDetail: p.deviceDetail,
    }));

    for (const peer of roomPeers) {
      sendJson(peer.ws, {
        type: "peers",
        peers: peerListData.filter((p) => p.id !== peer.id), // Send others, not including self
      });
    }
  }

  // Initialize the WebSocket Signaling Server
  const wss = new WebSocketServer({ noServer: true });

  // Passive Ping-Pong Heartbeat checking to automatically prune dead socket connections (ghost connections)
  // that dropped without sending a formal WebSockets close event. This saves system memory under heavy concurrent user spikes.
  const heartbeatInterval = setInterval(() => {
    wss.clients.forEach((client: any) => {
      if (client.isAlive === false) {
        console.log("[HEARTBEAT] Pruning stale websocket connection targeting ghost peer");
        return client.terminate();
      }
      client.isAlive = false;
      client.ping();
    });
  }, 25000); // 25s probe cycle

  wss.on("close", () => {
    clearInterval(heartbeatInterval);
  });

  // Handle standard HTTP Upgrade to WebSocket connections
  httpServer.on("upgrade", (request, socket, head) => {
    const url = request.url || "";
    console.log(`[WS UPGRADE] Received upgrade request for URL: ${url}`);
    
    // Only intercept upgrades intended for the signaling service path
    if (url.includes("/ws-signaling") || url.startsWith("/ws-signaling")) {
      console.log(`[WS UPGRADE] Path matched ws-signaling. Upgrading connection...`);
      wss.handleUpgrade(request, socket, head, (ws) => {
        console.log(`[WS UPGRADE] Upgrade successful, emitting connection...`);
        wss.emit("connection", ws, request);
      });
    } else {
      console.log(`[WS UPGRADE] Path did not match ws-signaling, ignoring upgrading.`);
    }
  });

  wss.on("connection", (ws: any, req) => {
    console.log(`[WSS] New WebSocket connection socket established. URL: ${req.url}`);
    
    // Setup ping-pong state
    ws.isAlive = true;
    ws.on("pong", () => {
      ws.isAlive = true;
    });

    let currentPeerId: string | null = null;
    let currentRoomId: string | null = null;

    ws.on("message", (rawMessage: string) => {
      try {
        const message = JSON.parse(rawMessage);
        const { type } = message;

        switch (type) {
          case "join": {
            const { id, name, deviceType, deviceDetail, roomId } = message;
            if (!id || !roomId) {
              return;
            }

            // Cleanup any existing registration for this peer ID
            if (peers.has(id)) {
              try {
                const oldPeer = peers.get(id);
                if (oldPeer) {
                  oldPeer.ws.close();
                  const roomMap = rooms.get(oldPeer.roomId);
                  if (roomMap) {
                    roomMap.delete(id);
                    if (roomMap.size === 0) {
                      rooms.delete(oldPeer.roomId);
                    }
                  }
                }
              } catch (e) {}
              peers.delete(id);
            }

            currentPeerId = id;
            currentRoomId = roomId;

            const peerObj: PeerConnection = {
              ws,
              id,
              name: name || "Anonymous Peer",
              deviceType: deviceType || "desktop",
              deviceDetail: deviceDetail || "",
              roomId,
            };

            // Register this peer
            peers.set(id, peerObj);

            if (!rooms.has(roomId)) {
              rooms.set(roomId, new Map());
            }
            rooms.get(roomId)!.set(id, peerObj);

            // Confirm registration
            sendJson(ws, { type: "registered", id });

            // Broadcast updated peer list to this room
            broadcastPeersList(roomId);
            break;
          }

          case "signal": {
            // Forward signaling messages (sdp offer, sdp answer, ice candidates) to target peer
            const { to, data } = message;
            if (!to || !data) return;

            const targetPeer = peers.get(to);
            if (targetPeer && currentPeerId) {
              sendJson(targetPeer.ws, {
                type: "signal",
                from: currentPeerId,
                data,
              });
            }
            break;
          }

          default:
            console.warn(`Unknown websocket message type received: ${type}`);
        }
      } catch (err) {
        console.error("Failed to parse websocket message", err);
      }
    });

    ws.on("close", () => {
      if (currentPeerId) {
        peers.delete(currentPeerId);
        if (currentRoomId) {
          const roomMap = rooms.get(currentRoomId);
          if (roomMap) {
            roomMap.delete(currentPeerId);
            if (roomMap.size === 0) {
              rooms.delete(currentRoomId);
            }
          }
        }
      }
      if (currentRoomId) {
        broadcastPeersList(currentRoomId);
      }
    });

    ws.on("error", (err) => {
      console.error(`WebSocket error for peer ${currentPeerId || "unknown"}:`, err);
    });
  });

  // REST API Endpoints
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", activePeers: peers.size });
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
