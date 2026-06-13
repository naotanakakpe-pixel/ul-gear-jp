import type { GearCategory, ListItem } from "./types";

/**
 * 共有とローカル保存。
 * - localStorage に作業中リストを自動保存（再訪時に復元）。
 * - URL の ?l= に圧縮エンコードして共有リンクを生成（サーバー不要・自己完結）。
 *
 * 共有ペイロードは DB の変更に影響されないよう、各アイテムの実データを丸ごと持つ。
 * URL を短くするため短いキー名を使う。
 */

const STORAGE_KEY = "ulgear:list:v1";

interface CompactItem {
  i?: string; // gearId
  b: string; // brand
  n: string; // name
  c: GearCategory; // category
  w: number; // weight_g
  q: number; // qty
  f: number; // flags: consumable=1, worn=2
}

interface Payload {
  v: 1;
  t?: string; // リスト名（任意）
  g?: number; // 目標ベースウェイト(g)（任意）
  items: CompactItem[];
}

export interface ListState {
  items: ListItem[];
  title?: string;
  goalBaseG?: number;
}

let uidCounter = 0;
function newUid(): string {
  uidCounter += 1;
  return `${Date.now().toString(36)}-${uidCounter.toString(36)}`;
}

function toCompact(it: ListItem): CompactItem {
  const f = (it.consumable ? 1 : 0) | (it.worn ? 2 : 0);
  const c: CompactItem = { b: it.brand, n: it.name, c: it.category, w: it.weight_g, q: it.qty, f };
  if (it.gearId) c.i = it.gearId;
  return c;
}

function fromCompact(c: CompactItem): ListItem {
  return {
    uid: newUid(),
    gearId: c.i,
    brand: c.b,
    name: c.n,
    category: c.c,
    weight_g: c.w,
    qty: c.q,
    consumable: (c.f & 1) === 1,
    worn: (c.f & 2) === 2,
  };
}

// --- UTF-8 安全な base64url（日本語名対応） ---

function bytesToBase64(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function toBase64Url(b64: string): string {
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): string {
  let b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  return b64;
}

export function encodeListState(state: ListState): string {
  const payload: Payload = { v: 1, items: state.items.map(toCompact) };
  if (state.title) payload.t = state.title;
  if (state.goalBaseG) payload.g = state.goalBaseG;
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  return toBase64Url(bytesToBase64(bytes));
}

export function decodeListState(encoded: string): ListState | null {
  try {
    const bytes = base64ToBytes(fromBase64Url(encoded));
    const json = new TextDecoder().decode(bytes);
    const payload = JSON.parse(json) as Payload;
    if (!payload || payload.v !== 1 || !Array.isArray(payload.items)) return null;
    return {
      items: payload.items.map(fromCompact),
      title: payload.t,
      goalBaseG: payload.g,
    };
  } catch {
    return null;
  }
}

// --- localStorage ---

export function saveLocal(state: ListState): void {
  if (typeof window === "undefined") return;
  try {
    const payload: Payload = { v: 1, items: state.items.map(toCompact) };
    if (state.title) payload.t = state.title;
    if (state.goalBaseG) payload.g = state.goalBaseG;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // 容量超過などは黙って無視
  }
}

export function loadLocal(): ListState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const payload = JSON.parse(raw) as Payload;
    if (!payload || payload.v !== 1 || !Array.isArray(payload.items)) return null;
    return {
      items: payload.items.map(fromCompact),
      title: payload.t,
      goalBaseG: payload.g,
    };
  } catch {
    return null;
  }
}

export { newUid };
