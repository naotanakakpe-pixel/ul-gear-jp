import Link from "next/link";
import type { Metadata } from "next";
import { allGear } from "@/data/gear";
import { CONFIDENCE_LABEL, CONFIDENCE_STYLE, SOURCE_TYPE_LABEL } from "@/lib/gear-meta";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: `データについて | ${SITE_NAME}`,
  description:
    "ULギアリストの重量データの収集方針・確度の見方・出典・免責について。重量は各メーカー／店舗の一次情報をもとに掲載しています。",
  alternates: { canonical: `${SITE_URL}/about/` },
};

export default function AboutPage() {
  const gear = allGear();
  const total = gear.length;
  const high = gear.filter((g) => g.confidence === "high").length;
  const medium = gear.filter((g) => g.confidence === "medium").length;
  const low = gear.filter((g) => g.confidence === "low").length;

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        データについて
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        このサイトは日本語ネイティブのUL/軽量登山者向けの、ギアリスト作成＋重量計算ツールです。
        ギアの重量は「選ぶだけ」で入る一方、その数字の信頼性を何より大切にしています。
      </p>

      <Section title="重量データの方針">
        <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-600">
          <li>重量は原則として一次情報（メーカー公式・大手店舗の公表値、または実測値）に基づきます。</li>
          <li>各ギアには出典の種類（{Object.values(SOURCE_TYPE_LABEL).join("／")}）と、
            数字の確からしさ（確度）を必ず持たせています。</li>
          <li>各ギアの詳細ページに出典リンクを掲載しています。気になる数字は一次情報でご確認ください。</li>
          <li>サイズ・カラー・構成（袋やゴトクの有無等）で重量は変わります。代表的な構成の値を掲載しています。</li>
        </ul>
      </Section>

      <Section title="確度の見方">
        <div className="space-y-3 text-sm leading-relaxed text-slate-600">
          <Confidence c="high" desc="公式スペック等で単一の値が確認できたもの。" />
          <Confidence
            c="medium"
            desc="サイズ・カラー・構成で重量が振れる、または店舗値由来で、現物・公式での再確認が望ましいもの。"
          />
          <Confidence c="low" desc="暫定の下書き値。実測または公式での確認が必要なもの。" />
        </div>
        <p className="mt-3 text-xs text-slate-500">
          現在の収録 {total} 点の内訳：
          <span className="ml-1">
            確度高 {high}／要確認 {medium}
            {low > 0 ? `／下書き ${low}` : ""}
          </span>
        </p>
      </Section>

      <Section title="価格について">
        <p className="text-sm leading-relaxed text-slate-600">
          価格は参考値です。確認できた国内定番品のみ掲載し、為替や流通で変動する輸入品などは
          省略している場合があります。最新・正確な価格は各販売ページでご確認ください。
        </p>
      </Section>

      <Section title="免責">
        <p className="text-sm leading-relaxed text-slate-600">
          掲載情報の正確性・完全性を保証するものではありません。実際の重量・価格・仕様はご自身で
          ご確認のうえ、装備の最終判断は自己責任でお願いします。本サイトの利用により生じた
          いかなる損害についても責任を負いかねます。
        </p>
      </Section>

      <div className="mt-10 flex flex-wrap gap-4 text-sm">
        <Link href="/" className="text-blue-600 hover:underline">
          ← 計算機でリストを作る
        </Link>
        <Link href="/gear/" className="text-blue-600 hover:underline">
          ギア一覧を見る →
        </Link>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-2 text-lg font-semibold text-slate-800">{title}</h2>
      {children}
    </section>
  );
}

function Confidence({ c, desc }: { c: "high" | "medium" | "low"; desc: string }) {
  return (
    <div className="flex items-start gap-2">
      <span
        className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-xs ${CONFIDENCE_STYLE[c]}`}
      >
        {CONFIDENCE_LABEL[c]}
      </span>
      <span>{desc}</span>
    </div>
  );
}
