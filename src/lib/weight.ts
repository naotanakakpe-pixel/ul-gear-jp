import type { GearCategory, ListItem } from "./types";

/**
 * UL用語（CLAUDE.md §13）:
 * - ベースウェイト = 消耗品・着用品を除いた装備重量
 * - パックウェイト = 消耗品を含む、背負う総重量（着用品は身につけているので含まない）
 * - スキンアウト   = 着用品も含めた全部
 *
 * 各アイテムは worn → consumable → base の優先で1バケットに排他的に振り分ける。
 */
export type Bucket = "worn" | "consumable" | "base";

export function bucketOf(item: ListItem): Bucket {
  if (item.worn) return "worn";
  if (item.consumable) return "consumable";
  return "base";
}

export interface CategorySlice {
  category: GearCategory;
  grams: number;
}

export interface WeightResult {
  /** ベースウェイト（消耗品・着用品を除く）。 */
  baseG: number;
  /** 消耗品の合計。 */
  consumableG: number;
  /** 着用品の合計。 */
  wornG: number;
  /** パックウェイト = base + consumable。 */
  packG: number;
  /** スキンアウト = base + consumable + worn。 */
  skinoutG: number;
  /** 総アイテム数（数量込み）。 */
  itemCount: number;
  /** カテゴリ別の合計重量（全アイテム基準）。重い順。 */
  byCategory: CategorySlice[];
}

export function computeWeights(items: ListItem[]): WeightResult {
  let baseG = 0;
  let consumableG = 0;
  let wornG = 0;
  let itemCount = 0;
  const catTotals = new Map<GearCategory, number>();

  for (const it of items) {
    const w = it.weight_g * it.qty;
    itemCount += it.qty;
    catTotals.set(it.category, (catTotals.get(it.category) ?? 0) + w);
    switch (bucketOf(it)) {
      case "worn":
        wornG += w;
        break;
      case "consumable":
        consumableG += w;
        break;
      default:
        baseG += w;
    }
  }

  const byCategory: CategorySlice[] = [...catTotals.entries()]
    .map(([category, grams]) => ({ category, grams }))
    .sort((a, b) => b.grams - a.grams);

  return {
    baseG,
    consumableG,
    wornG,
    packG: baseG + consumableG,
    skinoutG: baseG + consumableG + wornG,
    itemCount,
    byCategory,
  };
}

/** グラムを読みやすい表記へ（1000g以上は kg）。 */
export function formatWeight(grams: number): string {
  if (grams >= 1000) {
    return `${(grams / 1000).toFixed(2)} kg`;
  }
  return `${Math.round(grams)} g`;
}

/** UL基準のベースウェイト目標（g）。CLAUDE.md §13: 4.5kg以下。 */
export const DEFAULT_GOAL_BASE_G = 4500;
