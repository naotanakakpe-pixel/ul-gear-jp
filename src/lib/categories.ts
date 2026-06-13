import type { GearCategory } from "./types";

export interface CategoryDef {
  id: GearCategory;
  /** 日本語ラベル。 */
  label: string;
  /** 円グラフ等で使う色（hex）。 */
  color: string;
}

/** カテゴリ定義。表示順もこの順。 */
export const CATEGORIES: CategoryDef[] = [
  { id: "backpack", label: "バックパック", color: "#2563eb" },
  { id: "shelter", label: "シェルター", color: "#16a34a" },
  { id: "sleep", label: "スリープ", color: "#9333ea" },
  { id: "cook", label: "調理", color: "#ea580c" },
  { id: "clothing", label: "衣類", color: "#0891b2" },
  { id: "electronics", label: "電子機器", color: "#ca8a04" },
  { id: "hydration", label: "水分", color: "#0ea5e9" },
  { id: "misc", label: "その他", color: "#6b7280" },
];

export const CATEGORY_MAP: Record<GearCategory, CategoryDef> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<GearCategory, CategoryDef>;

export function categoryLabel(id: GearCategory): string {
  return CATEGORY_MAP[id]?.label ?? id;
}

export function categoryColor(id: GearCategory): string {
  return CATEGORY_MAP[id]?.color ?? "#6b7280";
}
