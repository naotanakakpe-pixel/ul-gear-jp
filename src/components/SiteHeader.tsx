import Link from "next/link";

/** 全ページ共通のヘッダーナビ。SEOの内部リンクも兼ねる。 */
export default function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-base font-bold tracking-tight text-slate-900">
          UL<span className="text-blue-600">ギアリスト</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-slate-600 transition hover:text-slate-900">
            計算機
          </Link>
          <Link href="/gear/" className="text-slate-600 transition hover:text-slate-900">
            ギア一覧
          </Link>
        </div>
      </nav>
    </header>
  );
}
