import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "ULギアリスト | 日本語の登山ギア重量計算ツール",
  description:
    "選ぶだけでベースウェイト・パックウェイト・スキンアウトを自動計算。日本語のUL/軽量登山ギアリスト作成ツール。円グラフでカテゴリ別内訳を表示し、共有もできる。",
  // 開発中は検索インデックス回避（URLを知っている人だけが見られる状態）。
  // 一般公開（SEO）したくなったら index:true / follow:true に戻し、robots.ts・vercel.json も解除する。
  robots: { index: false, follow: false },
  openGraph: {
    title: "ULギアリスト | 日本語の登山ギア重量計算ツール",
    description:
      "選ぶだけでベースウェイト・パックウェイト・スキンアウトを自動計算。日本語のUL/軽量登山ギアリスト作成ツール。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
