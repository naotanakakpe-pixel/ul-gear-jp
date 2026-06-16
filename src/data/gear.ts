import type { GearItem } from "@/lib/types";
import raw from "./gear.json";

/**
 * シードギアDB（読み取り専用）。
 *
 * 重量データ検証履歴（CLAUDE.md §8）:
 *   2026-06-16 に全48点を一次情報（メーカー公式／大手店舗）で確認し weight_g・source_url・
 *   source_type・confidence を付与。各カテゴリの定番を網羅（backpack7/shelter9/sleep6/cook8/
 *   clothing6/electronics4/hydration5/misc3）。
 *   - confidence "high"（32点）: 公式スペック等で単一値が確認できたもの。
 *   - confidence "medium"（16点）: サイズ/カラー/構成で重量が実際に振れるもの（バックパックの
 *     サイズ差、ウェア類のサイズ差＝公式平均/Mサイズ基準、トレッキングポールの長さ差、TOAKS550の
 *     蓋有無 等）。値は代表構成（例: HMG=M・白841g）で、現物確定でさらに詰められる。
 *   ※ price_jpy は一部のみ（主に山と道/NANGA/SOTO/finetrack/mont-bell/Patagonia/Anker 等の確認済
 *     国内定番）。未記載＝未確認のため省略。輸入品は国内実売がばらつくので収益導線前に要確認。
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
