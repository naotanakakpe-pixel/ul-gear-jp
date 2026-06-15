import Link from "next/link";
import type { Metadata } from "next";
import { allGear } from "@/data/gear";
import { CATEGORIES, categoryColor } from "@/lib/categories";
import { CONFIDENCE_LABEL, CONFIDENCE_STYLE } from "@/lib/gear-meta";
import { formatWeight } from "@/lib/weight";
import { formatPriceJpy, gearPath, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: `ギア一覧（重量・スペック） | ${SITE_NAME}`,
  description:
    "UL/軽量登山の定番ギアを重量・カテゴリ別に一覧。各ギアの重量データとスペックを確認し、ギアリスト計算に追加できます。",
  alternates: { canonical: `${SITE_URL}/gear/` },
};

export default function GearIndexPage() {
  const gear = allGear();

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        ギア一覧
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        重量・カテゴリ別。クリックでスペック詳細、計算機への追加もできます。
      </p>

      <div className="mt-8 flex flex-col gap-8">
        {CATEGORIES.map((cat) => {
          const items = gear.filter((g) => g.category === cat.id);
          if (items.length === 0) return null;
          return (
            <section key={cat.id}>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-800">
                <span
                  className="inline-block h-3 w-3 rounded-sm"
                  style={{ backgroundColor: cat.color }}
                />
                {cat.label}
                <span className="text-sm font-normal text-slate-400">
                  {items.length}点
                </span>
              </h2>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {items.map((g) => {
                  const price = formatPriceJpy(g.price_jpy);
                  return (
                    <li key={g.id}>
                      <Link
                        href={gearPath(g.id)}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-blue-300 hover:bg-blue-50"
                      >
                        <span
                          className="h-9 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: categoryColor(g.category) }}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-slate-800">
                            {g.brand} {g.name}
                          </span>
                          <span className="flex items-center gap-2 text-xs text-slate-500">
                            {price && <span>{price}</span>}
                            <span
                              className={`rounded px-1 py-0.5 text-[10px] ${CONFIDENCE_STYLE[g.confidence]}`}
                            >
                              {CONFIDENCE_LABEL[g.confidence]}
                            </span>
                          </span>
                        </span>
                        <span className="tabular shrink-0 text-sm font-semibold text-slate-700">
                          {formatWeight(g.weight_g)}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← 計算機でギアリストを作る
        </Link>
      </div>
    </main>
  );
}
