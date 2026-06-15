import type { GearItem } from "@/lib/types";
import raw from "./gear.json";

/**
 * シードギアDB（読み取り専用）。
 *
 * 重量データ検証履歴（CLAUDE.md §8）:
 *   2026-06-16 に全17点を一次情報（メーカー公式／大手店舗）で確認し、weight_g・source_url・
 *   source_type・confidence を更新済み。
 *   - confidence "high": 公式スペック等で確認できた値。
 *   - confidence "medium": サイズ/カラー/モデル違いで重量が振れる、または店舗値由来で要再確認のもの
 *     （HMG Southwest 40＝サイズ/カラー差、mont-bell バーサライト＝平均重量、PaaGo RUSH28、
 *      NANGA ミニマリズム180＝総重量・店舗値、Anker＝型番差）。
 *   ※ price_jpy は今回の検証対象外。参考値であり要再確認。
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
