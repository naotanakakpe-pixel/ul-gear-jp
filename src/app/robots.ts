import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // 開発中は全クローラーを拒否（noindex運用：URLを知っている人だけが見られる状態）。
  // 一般公開（SEO）時に { allow: "/" } ＋ sitemap 参照へ戻す。
  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
