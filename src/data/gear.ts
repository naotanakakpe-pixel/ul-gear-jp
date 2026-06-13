import type { GearItem } from "@/lib/types";
import raw from "./gear.json";

/**
 * シードギアDB（読み取り専用）。
 *
 * ⚠️ ガードレール（CLAUDE.md §8）:
 *   現状の weight_g の多くは AI が起こした「下書き」。confidence が high 以外のものは
 *   公開前に必ず一次情報（メーカー／店舗ページ）で検証してから confidence を上げること。
 *   検証時は source_url を実際の製品ページに更新し、source_type を確定させる。
 */
export const GEAR: GearItem[] = raw as GearItem[];

const BY_ID = new Map<string, GearItem>(GEAR.map((g) => [g.id, g]));

export function getGear(id: string): GearItem | undefined {
  return BY_ID.get(id);
}

export function allGear(): GearItem[] {
  return GEAR;
}

/** ブランド・名前での簡易検索（日本語前方一致/部分一致）。 */
export function searchGear(query: string): GearItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return GEAR;
  return GEAR.filter(
    (g) =>
      g.name.toLowerCase().includes(q) ||
      g.brand.toLowerCase().includes(q) ||
      `${g.brand} ${g.name}`.toLowerCase().includes(q),
  );
}
