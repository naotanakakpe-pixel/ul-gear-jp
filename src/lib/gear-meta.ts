import type { Confidence, SourceType } from "./types";

// 重量データの確からしさ・出典の表示ラベル（クライアント/サーバー両用）。

export const CONFIDENCE_LABEL: Record<Confidence, string> = {
  high: "確度高",
  medium: "要確認",
  low: "下書き",
};

export const CONFIDENCE_STYLE: Record<Confidence, string> = {
  high: "bg-green-100 text-green-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-slate-100 text-slate-500",
};

export const CONFIDENCE_DESC: Record<Confidence, string> = {
  high: "一次情報（メーカー公称など）で確認済み。",
  medium: "未検証の下書き値。公開前に一次情報での確認が必要。",
  low: "暫定の下書き値。実測または公式情報での確認が必要。",
};

export const SOURCE_TYPE_LABEL: Record<SourceType, string> = {
  manufacturer: "メーカー公称",
  retailer: "店舗掲載",
  measured: "実測",
};
