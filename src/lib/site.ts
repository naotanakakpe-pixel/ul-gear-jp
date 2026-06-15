// サイト全体の定数・小さなヘルパー。

// TODO: 本番ドメイン確定後に更新（Vercelデプロイ時の URL に合わせる）。
export const SITE_URL = "https://ul-gear-jp.vercel.app";
export const SITE_NAME = "ULギアリスト";

export function gearPath(id: string): string {
  return `/gear/${id}/`;
}

export function gearUrl(id: string): string {
  return `${SITE_URL}${gearPath(id)}`;
}

export function formatPriceJpy(yen?: number): string | null {
  if (!yen || yen <= 0) return null;
  return `¥${yen.toLocaleString("ja-JP")}`;
}
