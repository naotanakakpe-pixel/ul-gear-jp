// ギアDB・ユーザーリストの共通型。CLAUDE.md §7 のスキーマに準拠。

export type GearCategory =
  | "backpack"
  | "shelter"
  | "sleep"
  | "cook"
  | "clothing"
  | "electronics"
  | "hydration"
  | "misc";

/** 重量データの出自。数字の信頼性を担保するため必須。 */
export type SourceType = "manufacturer" | "retailer" | "measured";

/** 重量データの確からしさ。 */
export type Confidence = "high" | "medium" | "low";

/** ギアDB（静的JSON）の1アイテム。read-only。 */
export interface GearItem {
  id: string;
  brand: string;
  name: string;
  category: GearCategory;
  /** 1個あたりのグラム重量。 */
  weight_g: number;
  capacity?: string;
  price_jpy?: number;
  source_type: SourceType;
  confidence: Confidence;
  source_url?: string;
  affiliate_url?: string;
  /** 軽量代替候補の id 配列。 */
  lighter_alternatives?: string[];
}

/**
 * ユーザーのギアリスト上の1行。
 * DBから選んだ場合は gearId が入り、手入力の場合は undefined。
 * いずれの場合も brand/name/category/weight_g を自前で保持し、
 * 共有リンクが DB の変更に影響されず自己完結するようにする。
 */
export interface ListItem {
  /** リスト内で一意なID（並べ替え・削除用）。 */
  uid: string;
  /** DB由来なら参照元の GearItem.id。手入力は undefined。 */
  gearId?: string;
  brand: string;
  name: string;
  category: GearCategory;
  /** 1個あたりのグラム重量。 */
  weight_g: number;
  qty: number;
  /** 消耗品（水・食料・燃料）。ベースウェイトから除外。 */
  consumable: boolean;
  /** 着用品（常時着用）。ベース／パックから除外、スキンアウトには含む。 */
  worn: boolean;
}
