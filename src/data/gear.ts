import type { GearItem } from "@/lib/types";
import raw from "./gear.json";

/**
 * シードギアDB（読み取り専用）。
 *
 * 重量データ検証履歴（CLAUDE.md §8）:
 *   2026-06-16 に全17点を一次情報（メーカー公式／大手店舗）で確認し、weight_g・source_url・
 *   source_type・confidence を更新。medium点も再検証して16点を high に確定。
 *   - confidence "high": 公式スペック等で確認できた値。
 *   - confidence "medium": HMG Southwest 40 のみ。サイズ(S/M/L/Tall)・カラー(白/黒)で重量が実際に
 *     振れるため単一値にできず据え置き（DB値は size M・ホワイト基準の 841g）。
 *   ※ price_jpy: MINI2/NANGA/SOTO/finetrack は公式・希望小売で確定。それ以外（特に輸入品）は
 *     国内実売が流通でばらつくため参考値。収益導線に使う前に要再確認。
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
