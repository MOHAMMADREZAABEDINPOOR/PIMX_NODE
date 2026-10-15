import { createSHA256 } from "hash-wasm";
export const CHUNK = 16 * 1024;
export function randomId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  const values = crypto.getRandomValues(new Uint8Array(16));
  values[6] = (values[6] & 15) | 64;
  values[8] = (values[8] & 63) | 128;
  const hex = Array.from(values, (value) =>
    value.toString(16).padStart(2, "0"),
  ).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
const stagingKey = "pimx-staged-files";
function staged(): string[] {
  try {
    return JSON.parse(sessionStorage.getItem(stagingKey) || "[]");
  } catch {
    return [];
  }
}
function rememberStaged(name: string, add: boolean) {
  try {
    const names = staged().filter((n) => n !== name);
    if (add) names.push(name);
    sessionStorage.setItem(stagingKey, JSON.stringify(names));
  } catch {
    /* session storage disabled */
  }
}
// Only clean this tab's old staging files; other tabs may have active transfers.
const stale = staged();
const cleanup = navigator.storage?.getDirectory
  ? navigator.storage
      .getDirectory()
      .then(async (root) => {
        for (const name of stale) {
          if (!/^pimx-[a-f0-9-]{36}$/.test(name)) continue;
          try {
            await root.removeEntry(name);
            rememberStaged(name, false);
          } catch {
            /* writer may still be closing */
          }
        }
      })
      .catch(() => {})
  : Promise.resolve();
export async function fingerprint(blob: Blob) {
  const hash = await createSHA256();
  hash.init();
  const reader = blob.stream().getReader();
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      hash.update(value);
    }
  } finally {
    reader.releaseLock();
  }
  return hash.digest("hex");
}
export class ReceiveStore {
  private root?: FileSystemDirectoryHandle;
  private handle?: FileSystemFileHandle;
  private writer?: FileSystemWritableFileStream;
  private chunks: Uint8Array[] = [];
  private storageName: string;
  offset = 0;
  constructor(
    public id: string,
    public size: number,
    public mime: string,
  ) {
    this.storageName = `pimx-${id}`;
  }
  async init() {
    await cleanup;
    if (navigator.storage?.getDirectory) {
      const estimate = await navigator.storage.estimate();
      if (estimate.quota && this.size > estimate.quota - (estimate.usage || 0))
        throw new Error("storage");
      this.root = await navigator.storage.getDirectory();
      this.handle = await this.root.getFileHandle(this.storageName, {
        create: true,
      });
      this.writer = await this.handle.createWritable();
      rememberStaged(this.storageName, true);
    } else if (this.size > 256 * 1024 * 1024) throw new Error("memory");
  }
  async append(index: number, data: Uint8Array) {
    if (
      index !== this.offset ||
      !data.length ||
      this.offset + data.length > this.size
    )
      throw new Error("sequence");
    if (this.writer)
      await this.writer.write({
        type: "write",
        position: this.offset,
        data: data as Uint8Array<ArrayBuffer>,
      });
    else this.chunks.push(data.slice());
    this.offset += data.length;
  }
  async finish() {
    if (this.offset !== this.size) throw new Error("incomplete");
    if (this.writer) {
      await this.writer.close();
      this.writer = undefined;
    }
    return this.handle
      ? await this.handle.getFile()
      : new Blob(this.chunks as BlobPart[], { type: this.mime });
  }
  async dispose() {
    try {
      await this.writer?.abort();
    } catch {
      /* closed */
    }
    this.writer = undefined;
    this.chunks = [];
    try {
      await this.root?.removeEntry(this.storageName);
      rememberStaged(this.storageName, false);
    } catch {
      /* cleaned */
    }
  }
}
export type HistoryEntry = {
  id: string;
  name: string;
  path: string;
  size: number;
  peer: string;
  direction: "sending" | "receiving";
  date: number;
  hash: string;
};
export function readHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem("pimx-history") || "[]");
  } catch {
    return [];
  }
}
export function saveHistory(entry: HistoryEntry) {
  const history = [
    entry,
    ...readHistory().filter((e) => e.id !== entry.id),
  ].slice(0, 200);
  try {
    localStorage.setItem("pimx-history", JSON.stringify(history));
  } catch {
    /* storage unavailable */
  }
  return history;
}
export function bytes(n: number) {
  if (!n) return "0 B";
  const unit = Math.min(4, Math.floor(Math.log(n) / Math.log(1024)));
  return `${(n / 1024 ** unit).toFixed(unit ? 1 : 0)} ${["B", "KB", "MB", "GB", "TB"][unit]}`;
}
export function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = name.split("/").pop() || "download";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
