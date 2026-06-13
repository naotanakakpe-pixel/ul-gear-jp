import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静的書き出し（SSG）。`next build` で out/ を生成し Vercel 無料枠 / 任意の静的ホストに置ける。
  output: "export",
  // 静的書き出しでは next/image の最適化サーバーが無いので無効化。
  images: { unoptimized: true },
  // 各ルートを /path/ 形式にして静的ホストの相性を良くする。
  trailingSlash: true,
};

export default nextConfig;
