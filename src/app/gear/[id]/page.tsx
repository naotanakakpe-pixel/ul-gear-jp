import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { allGear, getGear } from "@/data/gear";
import { categoryColor, categoryLabel } from "@/lib/categories";
import {
  CONFIDENCE_DESC,
  CONFIDENCE_LABEL,
  CONFIDENCE_STYLE,
  SOURCE_TYPE_LABEL,
} from "@/lib/gear-meta";
import { formatWeight } from "@/lib/weight";
import { formatPriceJpy, gearPath, gearUrl, SITE_NAME } from "@/lib/site";

export function generateStaticParams() {
  return allGear().map((g) => ({ id: g.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const g = getGear(id);
  if (!g) return { title: `ギアが見つかりません | ${SITE_NAME}` };

  const title = `${g.brand} ${g.name} の重量・スペック | ${SITE_NAME}`;
  const price = formatPriceJpy(g.price_jpy);
  const description = `${g.brand} ${g.name}（${categoryLabel(g.category)}）の重量は${formatWeight(
    g.weight_g,
  )}${g.capacity ? `、容量${g.capacity}` : ""}${
    price ? `、参考価格${price}` : ""
  }。UL/軽量登山のギアリスト計算に使えます。`;

  return {
    title,
    description,
    alternates: { canonical: gearUrl(g.id) },
    openGraph: { title, description, type: "website", url: gearUrl(g.id) },
  };
}

export default async function GearDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const g = getGear(id);
  if (!g) notFound();

  const price = formatPriceJpy(g.price_jpy);
  const alternatives = (g.lighter_alternatives ?? [])
    .map((altId) => getGear(altId))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  const buyHref = g.affiliate_url || g.source_url || null;
  const isAffiliate = Boolean(g.affiliate_url);

  // 構造化データ（Product）。SEOのリッチリザルト向け。
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${g.brand} ${g.name}`,
    brand: { "@type": "Brand", name: g.brand },
    category: categoryLabel(g.category),
    weight: { "@type": "QuantitativeValue", value: g.weight_g, unitCode: "GRM" },
    ...(g.price_jpy
      ? {
          offers: {
            "@type": "Offer",
            price: g.price_jpy,
            priceCurrency: "JPY",
            ...(g.source_url ? { url: g.source_url } : {}),
          },
        }
      : {}),
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* パンくず */}
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-700">
          計算機
        </Link>
        <span>/</span>
        <Link href="/gear/" className="hover:text-slate-700">
          ギア一覧
        </Link>
        <span>/</span>
        <span className="text-slate-700">
          {g.brand} {g.name}
        </span>
      </nav>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: categoryColor(g.category) }}
          />
          <span className="text-sm text-slate-500">{categoryLabel(g.category)}</span>
          <span
            className={`rounded px-1.5 py-0.5 text-[11px] ${CONFIDENCE_STYLE[g.confidence]}`}
          >
            {CONFIDENCE_LABEL[g.confidence]}
          </span>
        </div>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          <span className="text-slate-500">{g.brand}</span> {g.name}
        </h1>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="tabular text-4xl font-bold text-slate-900">
            {formatWeight(g.weight_g)}
          </span>
          <span className="text-sm text-slate-400">（重量）</span>
        </div>

        {/* スペック表 */}
        <dl className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 text-sm sm:grid-cols-2">
          <SpecRow label="カテゴリ" value={categoryLabel(g.category)} />
          <SpecRow label="重量" value={formatWeight(g.weight_g)} />
          {g.capacity && <SpecRow label="容量" value={g.capacity} />}
          {price && <SpecRow label="参考価格" value={price} />}
          <SpecRow label="データ出典" value={SOURCE_TYPE_LABEL[g.source_type]} />
          <SpecRow label="重量データの確度" value={CONFIDENCE_LABEL[g.confidence]} />
        </dl>

        {/* 出典開示（数字の信頼性のため） */}
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          {CONFIDENCE_DESC[g.confidence]}
          {g.source_url && (
            <>
              {" "}
              <a
                href={g.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                出典を確認
              </a>
            </>
          )}
        </p>

        {/* CTA */}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link
            href={`/?add=${g.id}`}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-blue-700"
          >
            この装備をリストに追加
          </Link>
          {buyHref && (
            <a
              href={buyHref}
              target="_blank"
              rel={isAffiliate ? "sponsored noopener noreferrer" : "noopener noreferrer"}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              {isAffiliate ? "購入ページを見る" : "公式情報を見る"}
            </a>
          )}
        </div>
      </div>

      {/* 軽量代替候補 */}
      {alternatives.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-slate-800">軽量な代替候補</h2>
          <ul className="flex flex-col gap-2">
            {alternatives.map((alt) => {
              const delta = alt.weight_g - g.weight_g;
              return (
                <li key={alt.id}>
                  <Link
                    href={gearPath(alt.id)}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-blue-300 hover:bg-blue-50"
                  >
                    <span
                      className="h-8 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: categoryColor(alt.category) }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-slate-800">
                        {alt.brand} {alt.name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {categoryLabel(alt.category)}
                      </span>
                    </span>
                    <span className="tabular shrink-0 text-right">
                      <span className="block text-sm font-semibold text-slate-700">
                        {formatWeight(alt.weight_g)}
                      </span>
                      {delta !== 0 && (
                        <span
                          className={`text-xs ${delta < 0 ? "text-green-600" : "text-slate-400"}`}
                        >
                          {delta < 0 ? "" : "+"}
                          {formatWeight(delta)}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <div className="mt-8 text-center">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← 計算機でギアリストを作る
        </Link>
      </div>
    </main>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between bg-white px-4 py-2.5">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-800">{value}</dd>
    </div>
  );
}
