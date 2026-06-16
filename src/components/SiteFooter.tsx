import Link from "next/link";

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold text-slate-800">
              UL<span className="text-blue-600">ギアリスト</span>
            </p>
            <p className="mt-1 max-w-md text-xs leading-relaxed text-slate-500">
              日本語のUL/軽量登山ギアリスト＋重量計算ツール。選ぶだけで
              ベースウェイト・パックウェイト・スキンアウトを自動計算します。
            </p>
          </div>
          <nav className="flex flex-col gap-1.5 text-sm">
            <Link href="/" className="text-slate-600 hover:text-slate-900">
              計算機
            </Link>
            <Link href="/gear/" className="text-slate-600 hover:text-slate-900">
              ギア一覧
            </Link>
            <Link href="/about/" className="text-slate-600 hover:text-slate-900">
              データについて
            </Link>
          </nav>
        </div>

        <p className="mt-6 text-[11px] leading-relaxed text-slate-400">
          重量・価格は各メーカー／店舗の公表値・実測値をもとに掲載していますが、
          サイズやモデル、ロットにより変動し、正確性を保証するものではありません。
          実際の重量はご自身でご確認ください。詳しくは
          <Link href="/about/" className="text-slate-500 underline">
            データについて
          </Link>
          をご覧ください。
        </p>
        <p className="mt-2 text-[11px] text-slate-400">© {year} ULギアリスト</p>
      </div>
    </footer>
  );
}
