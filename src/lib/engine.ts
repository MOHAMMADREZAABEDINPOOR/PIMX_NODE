import {
  CHUNK,
  fingerprint,
  ReceiveStore,
  saveHistory,
  randomId,
  type HistoryEntry,
} from "./storage";

export type Peer = {
  id: string;
  name: string;
  deviceType: "desktop" | "mobile";
  state?: "connecting" | "ready" | "failed";
  transport?: string;
};
export type Status =
  | "queued"
  | "offered"
  | "pending"
  | "transferring"
  | "paused"
  | "waiting"
  | "verifying"
  | "completed"
  | "cancelled"
  | "failed";
export type Transfer = {
  id: string;
  name: string;
  path: string;
  size: number;
  mime: string;
  peerId: string;
  peerName: string;
  direction: "sending" | "receiving";
  status: Status;
  progress: number;
  offset: number;
  speed: number;
  eta: number;
  hash?: string;
  blob?: Blob;
  error?: string;
  priority: number;
};
export type Note = {
  id: string;
  text: string;
  peer: string;
  incoming: boolean;
  date: number;
};
export type RoomInfo = {
  host: string;
  locked: boolean;
  maxPeers: number;
  expiresAt: number;
};
export type Snapshot = {
  peers: Peer[];
  transfers: Transfer[];
  notes: Note[];
  online: boolean;
  error: string;
  room?: RoomInfo;
  relayAvailable: boolean;
  history: HistoryEntry[];
};
type Link = {
  pc: RTCPeerConnection;
  dc?: RTCDataChannel;
  ready: boolean;
  receiving: Promise<void>;
  sending: Promise<void>;
  candidates: RTCIceCandidateInit[];
  retry?: ReturnType<typeof setTimeout>;
};
const encode = new TextEncoder(),
  decode = new TextDecoder();
const terminal = (s: Status) =>
  ["completed", "cancelled", "failed"].includes(s);

export class Exchange {
  readonly id = randomId();
  private ws?: WebSocket;
  private links = new Map<string, Link>();
  private files = new Map<string, File>();
  private stores = new Map<string, ReceiveStore>();
  private jobs = new Map<string, Transfer>();
  private running = new Set<string>();
  private hashes = new WeakMap<File, Promise<string>>();
  private key!: CryptoKey;
  private rtc: RTCConfiguration = {};
  private disposed = false;
  private reconnect?: ReturnType<typeof setTimeout>;
  private state: Snapshot = {
    peers: [],
    transfers: [],
    notes: [],
    online: false,
    error: "",
    relayAvailable: false,
    history: [],
  };
  private lastPublish = 0;
  constructor(
    readonly roomId: string,
    readonly secret: string,
    public name: string,
    private change: (state: Snapshot) => void,
  ) {}
  private emit(force = true) {
    if (this.disposed || (!force && Date.now() - this.lastPublish < 140))
      return;
    this.lastPublish = Date.now();
    this.state = {
      ...this.state,
      transfers: [...this.jobs.values()].map((t) => ({ ...t })),
      peers: [...this.state.peers],
    };
    this.change(this.state);
  }
  async start() {
    if (!crypto.subtle) {
      this.state.error = "https";
      this.emit();
      return;
    }
    const material = await crypto.subtle.importKey(
      "raw",
      encode.encode(this.secret),
      "PBKDF2",
      false,
      ["deriveKey"],
    );
    this.key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: encode.encode(`pimx-v2:${this.roomId}`),
        iterations: 150_000,
        hash: "SHA-256",
      },
      material,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"],
    );
    try {
      const res = await fetch("/api/rtc-config");
      const config = await res.json();
      this.rtc = { iceServers: config.iceServers };
      this.state.relayAvailable = config.relayAvailable;
    } catch {
      this.rtc = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
    }
    if (!this.disposed) this.connect();
  }
  private connect() {
    const ws = new WebSocket(
      `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/ws-signaling?room=${encodeURIComponent(this.roomId)}`,
    );
    this.ws = ws;
    ws.onopen = () =>
      this.signal({
        type: "join",
        roomId: this.roomId,
        id: this.id,
        name: this.name,
        deviceType: /Mobi|Android|iPhone/i.test(navigator.userAgent)
          ? "mobile"
          : "desktop",
      });
    ws.onmessage = async (event) => {
      try {
        const m = JSON.parse(event.data);
        if (m.type === "registered") {
          this.state.online = true;
          this.state.error = "";
          this.emit();
        }
        if (m.type === "error") {
          this.state.error = m.code;
          this.state.online = false;
          if (
            ["expired", "removed", "locked", "full", "duplicate"].includes(
              m.code,
            )
          ) {
            this.state.peers = [];
            for (const link of this.links.values()) {
              clearTimeout(link.retry);
              link.pc.close();
            }
            this.links.clear();
            for (const job of this.jobs.values())
              if (!terminal(job.status)) job.status = "cancelled";
          }
          this.emit();
        }
        if (m.type === "peers") {
          this.state.room = m.room;
          this.state.peers = m.peers.map((p: Peer) => ({
            ...p,
            state: this.links.get(p.id)?.ready ? "ready" : "connecting",
          }));
          for (const [id, link] of this.links)
            if (!m.peers.some((p: Peer) => p.id === id)) {
              link.pc.close();
              clearTimeout(link.retry);
              this.links.delete(id);
              this.waitForPeer(id);
            }
          for (const peer of this.state.peers)
            if (this.id < peer.id && !this.links.has(peer.id))
              void this.offer(peer.id);
          this.emit();
        }
        if (m.type === "signal") await this.handleSignal(m.from, m.data);
      } catch (error) {
        console.warn("Connection negotiation failed", error);
      }
    };
    ws.onclose = () => {
      this.state.online = false;
      this.emit();
      if (
        !this.disposed &&
        !["expired", "removed", "locked", "full", "duplicate"].includes(
          this.state.error,
        )
      )
        this.reconnect = setTimeout(() => this.connect(), 2000);
    };
    ws.onerror = () => {
      this.state.error = "network";
      this.emit();
    };
  }
  private signal(value: unknown) {
    if (this.ws?.readyState === WebSocket.OPEN)
      this.ws.send(JSON.stringify(value));
  }
  rename(name: string) {
    this.name = name;
    this.signal({ type: "rename", name });
  }
  clearHistory() {
    localStorage.removeItem("pimx-history");
    this.state.history = [];
    this.emit();
  }
  settings(locked: boolean, maxPeers: number, minutes: number) {
    this.signal({ type: "room-settings", locked, maxPeers, minutes });
  }
  kick(id: string) {
    this.signal({ type: "kick", id });
  }
  private createLink(id: string) {
    const pc = new RTCPeerConnection(this.rtc);
    const link: Link = {
      pc,
      ready: false,
      receiving: Promise.resolve(),
      sending: Promise.resolve(),
      candidates: [],
    };
    this.links.set(id, link);
    pc.onicecandidate = (event) => {
      if (event.candidate)
        this.signal({
          type: "signal",
          to: id,
          data: { candidate: event.candidate },
        });
    };
    pc.ondatachannel = (event) => this.channel(id, link, event.channel);
    pc.onconnectionstatechange = () => {
      if (
        pc.connectionState === "connected" &&
        link.dc?.readyState === "open" &&
        !link.ready
      )
        void this.control(id, { type: "hello", version: 2 }).catch(() => {});
      if (["failed", "disconnected", "closed"].includes(pc.connectionState)) {
        link.ready = false;
        this.waitForPeer(id);
        this.state.peers = this.state.peers.map((p) =>
          p.id === id ? { ...p, state: "connecting" } : p,
        );
        this.emit();
        clearTimeout(link.retry);
        if (!this.disposed)
          link.retry = setTimeout(() => {
            if (
              (pc.connectionState === "connected" &&
                link.dc?.readyState === "open") ||
              this.disposed ||
              this.links.get(id) !== link
            )
              return;
            pc.close();
            if (this.links.get(id) === link) this.links.delete(id);
            if (this.id < id && this.state.peers.some((p) => p.id === id))
              void this.offer(id);
          }, 3000);
      }
    };
    return link;
  }
  private async offer(id: string) {
    try {
      const link = this.createLink(id);
      this.channel(
        id,
        link,
        link.pc.createDataChannel("pimx-v2", { ordered: true }),
      );
      await link.pc.setLocalDescription(await link.pc.createOffer());
      this.signal({
        type: "signal",
        to: id,
        data: { description: link.pc.localDescription },
      });
    } catch {
      this.state.error = "connection";
      this.emit();
    }
  }
  private async handleSignal(
    id: string,
    data: {
      description?: RTCSessionDescriptionInit;
      candidate?: RTCIceCandidateInit;
    },
  ) {
    let link = this.links.get(id);
    if (data.description?.type === "offer") {
      if (link) {
        clearTimeout(link.retry);
        link.pc.close();
      }
      link = this.createLink(id);
      await link.pc.setRemoteDescription(data.description);
      for (const candidate of link.candidates.splice(0))
        await link.pc.addIceCandidate(candidate);
      await link.pc.setLocalDescription(await link.pc.createAnswer());
      this.signal({
        type: "signal",
        to: id,
        data: { description: link.pc.localDescription },
      });
    } else if (data.description && link) {
      await link.pc.setRemoteDescription(data.description);
      for (const candidate of link.candidates.splice(0))
        await link.pc.addIceCandidate(candidate);
    } else if (data.candidate) {
      if (!link) link = this.createLink(id);
      if (link.pc.remoteDescription)
        await link.pc.addIceCandidate(data.candidate);
      else link.candidates.push(data.candidate);
    }
  }
  private channel(id: string, link: Link, dc: RTCDataChannel) {
    link.dc = dc;
    dc.binaryType = "arraybuffer";
    dc.bufferedAmountLowThreshold = 256 * 1024;
    dc.onopen = () => {
      void this.control(id, { type: "hello", version: 2 });
    };
    dc.onclose = () => {
      link.ready = false;
      this.waitForPeer(id);
      this.emit();
      clearTimeout(link.retry);
      if (!this.disposed)
        link.retry = setTimeout(() => {
          if (
            this.disposed ||
            this.links.get(id) !== link ||
            !this.state.peers.some((p) => p.id === id)
          )
            return;
          link.pc.close();
          this.links.delete(id);
          if (this.id < id) void this.offer(id);
        }, 3000);
    };
    dc.onmessage = (event) => {
      link.receiving = link.receiving
        .then(async () => {
          const packet = new Uint8Array(event.data as ArrayBuffer);
          if (packet.length < 29) throw new Error("packet");
          const raw = new Uint8Array(
            await crypto.subtle.decrypt(
              { name: "AES-GCM", iv: packet.slice(0, 12) },
              this.key,
              packet.slice(12),
            ),
          );
          if (raw[0] === 0)
            await this.message(id, JSON.parse(decode.decode(raw.slice(1))));
          else if (raw[0] === 1) await this.chunk(id, raw);
        })
        .catch(() => {
          this.state.error = "key";
          this.emit();
        });
    };
  }
  private transmit(id: string, raw: Uint8Array) {
    const link = this.links.get(id);
    if (!link?.dc) return Promise.reject(new Error("offline"));
    const task = link.sending
      .catch(() => {})
      .then(async () => {
        const dc = link.dc!;
        if (dc.readyState !== "open" || this.disposed)
          throw new Error("offline");
        if (dc.bufferedAmount > 1024 * 1024)
          await new Promise<void>((resolve, reject) => {
            const timer = setTimeout(() => finish(false), 15_000);
            const low = () => finish(true),
              closed = () => finish(false);
            const finish = (ok: boolean) => {
              clearTimeout(timer);
              dc.removeEventListener("bufferedamountlow", low);
              dc.removeEventListener("close", closed);
              ok ? resolve() : reject(new Error("offline"));
            };
            dc.addEventListener("bufferedamountlow", low, { once: true });
            dc.addEventListener("close", closed, { once: true });
          });
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encrypted = await crypto.subtle.encrypt(
          { name: "AES-GCM", iv },
          this.key,
          raw as Uint8Array<ArrayBuffer>,
        );
        const packet = new Uint8Array(12 + encrypted.byteLength);
        packet.set(iv);
        packet.set(new Uint8Array(encrypted), 12);
        dc.send(packet.buffer);
      });
    link.sending = task;
    return task;
  }
  private control(id: string, message: object) {
    const body = encode.encode(JSON.stringify(message)),
      raw = new Uint8Array(body.length + 1);
    raw.set(body, 1);
    return this.transmit(id, raw);
  }
  private waitForPeer(id: string) {
    for (const t of this.jobs.values())
      if (
        t.peerId === id &&
        !terminal(t.status) &&
        t.status !== "pending" &&
        t.status !== "paused"
      )
        t.status = "waiting";
  }
  private async message(peerId: string, m: any) {
    const peerName =
      this.state.peers.find((p) => p.id === peerId)?.name || "Device";
    if (m.type === "hello") {
      const link = this.links.get(peerId)!;
      link.ready = true;
      this.state.peers = this.state.peers.map((p) =>
        p.id === peerId ? { ...p, state: "ready" } : p,
      );
      this.emit();
      void this.inspectTransport(peerId);
      for (const t of this.jobs.values())
        if (
          t.peerId === peerId &&
          t.direction === "sending" &&
          t.status === "waiting"
        )
          t.status = "queued";
      this.schedule();
      return;
    }
    if (!this.links.get(peerId)?.ready) return;
    if (m.type === "offer") {
      if (
        !/^[a-f0-9-]{36}$/.test(m.id) ||
        !Number.isSafeInteger(m.size) ||
        m.size < 0 ||
        m.size > 1024 ** 4
      )
        return;
      const existing = this.jobs.get(m.id);
      if (existing) {
        if (existing.peerId !== peerId || existing.direction !== "receiving")
          return;
        if (existing.status === "completed")
          await this.control(peerId, {
            type: "verified",
            id: m.id,
            hash: existing.hash,
          });
        else if (
          existing.status === "cancelled" ||
          existing.status === "failed"
        )
          await this.control(peerId, { type: "reject", id: m.id });
        else if (this.stores.has(m.id)) {
          existing.status = "transferring";
          await this.control(peerId, {
            type: "accept",
            id: m.id,
            offset: this.stores.get(m.id)!.offset,
          });
        }
        this.emit();
        return;
      }
      if (
        [...this.jobs.values()].filter((t) => t.status === "pending").length >=
        50
      )
        return this.control(peerId, { type: "reject", id: m.id });
      const name = String(m.name || "file")
        .replace(/[\\/\x00-\x1f]/g, "_")
        .slice(0, 255);
      const safePath = String(m.path || name)
        .split(/[\\/]/)
        .filter((s: string) => s && s !== "." && s !== "..")
        .map((s: string) => s.replace(/[\x00-\x1f]/g, "_"))
        .join("/")
        .slice(0, 1500);
      this.jobs.set(m.id, {
        id: m.id,
        name,
        path: safePath || name,
        mime: String(m.mime || "application/octet-stream").slice(0, 100),
        size: m.size,
        peerId,
        peerName,
        direction: "receiving",
        status: "pending",
        offset: 0,
        progress: 0,
        speed: 0,
        eta: 0,
        priority: 0,
      });
      this.notify(`${peerName}: ${name}`);
      this.emit();
      return;
    }
    const t = this.jobs.get(m.id);
    if (
      m.type === "text" &&
      typeof m.text === "string" &&
      m.text.length <= 20_000
    ) {
      this.state.notes = [
        ...this.state.notes,
        {
          id: randomId(),
          text: m.text,
          peer: peerName,
          incoming: true,
          date: Date.now(),
        },
      ].slice(-100);
      this.emit();
      return;
    }
    if (!t || t.peerId !== peerId) return;
    if (
      m.type === "accept" &&
      t.direction === "sending" &&
      ["offered", "waiting", "paused"].includes(t.status)
    ) {
      if (!Number.isSafeInteger(m.offset) || m.offset < 0 || m.offset > t.size)
        return;
      t.offset = m.offset;
      t.status = "queued";
      this.run(t);
      return;
    }
    if (m.type === "reject" || m.type === "cancel") {
      t.status = "cancelled";
      await this.stores.get(t.id)?.dispose();
      this.stores.delete(t.id);
      this.emit();
      this.schedule();
    }
    if (m.type === "pause") {
      t.status = "paused";
      this.emit();
    }
    if (
      m.type === "resume" &&
      t.direction === "receiving" &&
      this.stores.has(t.id)
    ) {
      t.status = "transferring";
      await this.control(peerId, {
        type: "accept",
        id: t.id,
        offset: this.stores.get(t.id)!.offset,
      });
      this.emit();
    }
    if (
      m.type === "complete" &&
      t.direction === "receiving" &&
      !terminal(t.status)
    ) {
      try {
        t.status = "verifying";
        this.emit();
        const blob = await this.stores.get(t.id)!.finish(),
          hash = await fingerprint(blob);
        if (terminal(t.status)) return;
        if (hash !== m.hash) throw new Error("integrity");
        t.blob = blob;
        t.hash = hash;
        t.status = "completed";
        t.progress = 100;
        t.speed = 0;
        await this.control(peerId, { type: "verified", id: t.id, hash }).catch(
          () => {},
        );
        this.record(t);
        this.notify(t.name);
        this.emit();
      } catch {
        t.status = "failed";
        t.error = "integrity";
        await this.control(peerId, { type: "failed", id: t.id });
        this.emit();
      }
    }
    if (
      m.type === "verified" &&
      t.direction === "sending" &&
      m.hash === t.hash
    ) {
      t.status = "completed";
      t.progress = 100;
      t.speed = 0;
      this.record(t);
      this.notify(t.name);
      this.emit();
      this.schedule();
    }
    if (m.type === "failed") {
      t.status = "failed";
      t.error = "integrity";
      this.emit();
      this.schedule();
    }
  }
  private receiveTimes = new Map<string, { time: number; offset: number }>();
  private async chunk(peerId: string, raw: Uint8Array) {
    const id = decode.decode(raw.slice(1, 37)),
      t = this.jobs.get(id),
      store = this.stores.get(id);
    if (!t || t.peerId !== peerId || !store || terminal(t.status)) return;
    const offset = new DataView(raw.buffer, raw.byteOffset + 37, 8).getFloat64(
      0,
    );
    if (offset < store.offset) return; // A reconnect can resend a buffered packet.
    try {
      await store.append(offset, raw.slice(45));
      t.offset = store.offset;
      t.progress = t.size ? (t.offset / t.size) * 100 : 100;
      const base = this.receiveTimes.get(id) || {
        time: Date.now(),
        offset: t.offset,
      };
      this.receiveTimes.set(id, base);
      t.speed =
        (t.offset - base.offset) /
        Math.max(0.01, (Date.now() - base.time) / 1000);
      t.eta = t.speed ? (t.size - t.offset) / t.speed : 0;
      this.emit(false);
    } catch {
      if (terminal(t.status)) return;
      t.status = "failed";
      t.error = "storage";
      await this.control(peerId, { type: "failed", id });
      this.emit();
    }
  }
  enqueue(files: File[], recipients: string[]) {
    for (const peerId of recipients)
      for (const file of files) {
        const id = randomId(),
          peerName =
            this.state.peers.find((p) => p.id === peerId)?.name || "Device";
        this.files.set(id, file);
        this.jobs.set(id, {
          id,
          name: file.name,
          path: file.webkitRelativePath || file.name,
          size: file.size,
          mime: file.type,
          peerId,
          peerName,
          direction: "sending",
          status: "queued",
          offset: 0,
          progress: 0,
          speed: 0,
          eta: 0,
          priority: 0,
          blob: file,
        });
      }
    this.emit();
    this.schedule();
  }
  private schedule() {
    if (this.disposed) return;
    const busy = new Set(
      [...this.jobs.values()]
        .filter(
          (t) =>
            t.direction === "sending" &&
            ["offered", "transferring", "verifying", "paused"].includes(
              t.status,
            ),
        )
        .map((t) => t.peerId),
    );
    for (const t of [...this.jobs.values()].sort(
      (a, b) => b.priority - a.priority,
    )) {
      if (
        t.direction !== "sending" ||
        t.status !== "queued" ||
        busy.has(t.peerId) ||
        busy.size >= 3
      )
        continue;
      if (!this.links.get(t.peerId)?.ready) {
        t.status = "waiting";
        continue;
      }
      busy.add(t.peerId);
      t.status = "offered";
      void this.control(t.peerId, {
        type: "offer",
        id: t.id,
        name: t.name,
        path: t.path,
        size: t.size,
        mime: t.mime,
      }).catch(() => {
        t.status = "waiting";
        this.emit();
      });
    }
    this.emit();
  }
  private async run(t: Transfer) {
    if (this.running.has(t.id)) return;
    const file = this.files.get(t.id);
    if (!file) return;
    this.running.add(t.id);
    t.status = "transferring";
    this.emit();
    const start = Date.now(),
      initial = t.offset;
    try {
      if (!this.hashes.has(file)) this.hashes.set(file, fingerprint(file));
      while (t.offset < file.size && t.status === "transferring") {
        const chunk = new Uint8Array(
          await file.slice(t.offset, t.offset + CHUNK).arrayBuffer(),
        );
        const raw = new Uint8Array(45 + chunk.length);
        raw[0] = 1;
        raw.set(encode.encode(t.id), 1);
        new DataView(raw.buffer).setFloat64(37, t.offset);
        raw.set(chunk, 45);
        await this.transmit(t.peerId, raw);
        t.offset += chunk.length;
        t.progress = (t.offset / t.size) * 100;
        t.speed =
          (t.offset - initial) / Math.max(0.01, (Date.now() - start) / 1000);
        t.eta = t.speed ? (t.size - t.offset) / t.speed : 0;
        this.emit(false);
      }
      if (t.status === "transferring") {
        t.status = "verifying";
        this.emit();
        t.hash = await this.hashes.get(file)!;
        if ((t.status as Status) === "verifying")
          await this.control(t.peerId, {
            type: "complete",
            id: t.id,
            hash: t.hash,
          });
      }
    } catch {
      if (!terminal(t.status) && (t.status as Status) !== "paused")
        t.status = "waiting";
      this.emit();
    } finally {
      this.running.delete(t.id);
      this.emit();
      this.schedule();
    }
  }
  async accept(id: string) {
    const t = this.jobs.get(id);
    if (!t || t.status !== "pending") return;
    try {
      const store = new ReceiveStore(id, t.size, t.mime);
      await store.init();
      this.stores.set(id, store);
      t.status = "transferring";
      await this.control(t.peerId, { type: "accept", id, offset: 0 });
      this.emit();
    } catch (error) {
      t.status = "failed";
      t.error = (error as Error).message;
      void this.control(t.peerId, { type: "reject", id }).catch(() => {});
      this.emit();
    }
  }
  async action(
    id: string,
    action: "pause" | "resume" | "cancel" | "priority" | "retry",
  ) {
    const t = this.jobs.get(id);
    if (!t) return;
    if (action === "priority") {
      t.priority += 1;
      this.schedule();
      return;
    }
    if (action === "cancel") {
      t.status = "cancelled";
      await this.stores.get(id)?.dispose();
      this.stores.delete(id);
      await this.control(t.peerId, { type: "cancel", id }).catch(() => {});
    }
    if (
      action === "pause" &&
      ["transferring", "offered", "queued", "waiting"].includes(t.status)
    ) {
      t.status = "paused";
      await this.control(t.peerId, { type: "pause", id }).catch(() => {});
    }
    if (action === "resume" && t.status === "paused") {
      t.status = "waiting";
      if (t.direction === "sending") {
        t.status = "queued";
      } else {
        t.status = "transferring";
        await this.control(t.peerId, {
          type: "accept",
          id,
          offset: this.stores.get(id)?.offset || 0,
        }).catch(() => {
          t.status = "waiting";
        });
      }
    }
    if (action === "retry" && t.direction === "sending") {
      const file = this.files.get(id);
      if (file) this.enqueue([file], [t.peerId]);
    }
    this.emit();
    this.schedule();
  }
  async text(text: string, recipients: string[]) {
    const value = text.trim().slice(0, 20_000);
    if (!value) return;
    await Promise.all(
      recipients.map((id) => this.control(id, { type: "text", text: value })),
    );
    this.state.notes = [
      ...this.state.notes,
      {
        id: randomId(),
        text: value,
        peer: this.name,
        incoming: false,
        date: Date.now(),
      },
    ].slice(-100);
    this.emit();
  }
  private record(t: Transfer) {
    this.state.history = saveHistory({
      id: t.id,
      name: t.name,
      path: t.path,
      size: t.size,
      peer: t.peerName,
      direction: t.direction,
      date: Date.now(),
      hash: t.hash!,
    });
  }
  private notify(body: string) {
    if (
      document.hidden &&
      "Notification" in window &&
      Notification.permission === "granted"
    )
      new Notification("PIMXNODE", { body, icon: "/icon.svg" });
  }
  private async inspectTransport(id: string) {
    const link = this.links.get(id);
    if (!link) return;
    try {
      const stats = await link.pc.getStats();
      let transport = "direct";
      stats.forEach((s) => {
        if (s.type === "candidate-pair" && s.state === "succeeded") {
          const local = stats.get(s.localCandidateId),
            remote = stats.get(s.remoteCandidateId);
          if (
            local?.candidateType === "relay" ||
            remote?.candidateType === "relay"
          )
            transport = "relay";
        }
      });
      this.state.peers = this.state.peers.map((p) =>
        p.id === id ? { ...p, transport } : p,
      );
      this.emit();
    } catch {
      /* connection may have closed */
    }
  }
  async diagnostics() {
    const started = performance.now();
    const res = await fetch(`/api/health?room=${encodeURIComponent(this.roomId)}`);
    if (!res.ok) throw new Error("network");
    const health = await res.json();
    for (const id of this.links.keys()) await this.inspectTransport(id);
    const storage = await navigator.storage?.estimate();
    return {
      latency: Math.round(performance.now() - started),
      peers: health.activePeers,
      relay: this.state.relayAvailable,
      available: storage?.quota ? storage.quota - (storage.usage || 0) : null,
      secure: window.isSecureContext,
      rtc: !!window.RTCPeerConnection,
    };
  }
  dispose() {
    this.disposed = true;
    clearTimeout(this.reconnect);
    this.ws?.close();
    for (const l of this.links.values()) {
      clearTimeout(l.retry);
      l.pc.close();
    }
    for (const store of this.stores.values()) void store.dispose();
    this.files.clear();
    this.jobs.clear();
  }
}
