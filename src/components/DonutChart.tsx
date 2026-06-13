"use client";

import { formatWeight } from "@/lib/weight";

export interface DonutSlice {
  label: string;
  grams: number;
  color: string;
}

interface DonutChartProps {
  slices: DonutSlice[];
  /** 中央に出す総重量（g）。 */
  totalG: number;
  /** 中央ラベル下段の説明（例: スキンアウト）。 */
  centerSub?: string;
}

const SIZE = 200;
const STROKE = 30;
const R = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;
const CX = SIZE / 2;

/** 依存ライブラリ無しのSVGドーナツチャート。静的書き出しと相性が良い。 */
export default function DonutChart({ slices, totalG, centerSub }: DonutChartProps) {
  const total = slices.reduce((s, x) => s + x.grams, 0);

  let acc = 0;

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="h-48 w-48"
        role="img"
        aria-label="カテゴリ別の重量内訳"
      >
        {/* ベースのリング（データ無し時のプレースホルダ兼背景） */}
        <circle
          cx={CX}
          cy={CX}
          r={R}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={STROKE}
        />
        {total > 0 &&
          slices.map((s) => {
            const frac = s.grams / total;
            const len = frac * CIRC;
            const dasharray = `${len} ${CIRC - len}`;
            const dashoffset = -acc;
            acc += len;
            return (
              <circle
                key={s.label}
                cx={CX}
                cy={CX}
                r={R}
                fill="none"
                stroke={s.color}
                strokeWidth={STROKE}
                strokeDasharray={dasharray}
                strokeDashoffset={dashoffset}
                transform={`rotate(-90 ${CX} ${CX})`}
              />
            );
          })}
        <text
          x={CX}
          y={CX - 4}
          textAnchor="middle"
          className="tabular"
          style={{ fontSize: 26, fontWeight: 700, fill: "var(--foreground)" }}
        >
          {formatWeight(totalG)}
        </text>
        {centerSub && (
          <text
            x={CX}
            y={CX + 20}
            textAnchor="middle"
            style={{ fontSize: 13, fill: "#64748b" }}
          >
            {centerSub}
          </text>
        )}
      </svg>

      {/* 凡例 */}
      <ul className="flex w-full flex-col gap-1.5 text-sm">
        {slices.map((s) => {
          const pct = total > 0 ? Math.round((s.grams / total) * 100) : 0;
          return (
            <li key={s.label} className="flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 shrink-0 rounded-sm"
                style={{ backgroundColor: s.color }}
              />
              <span className="flex-1 truncate text-slate-700">{s.label}</span>
              <span className="tabular text-slate-500">{pct}%</span>
              <span className="tabular w-20 text-right font-medium text-slate-800">
                {formatWeight(s.grams)}
              </span>
            </li>
          );
        })}
        {slices.length === 0 && (
          <li className="py-2 text-center text-slate-400">
            ギアを追加すると内訳が表示されます
          </li>
        )}
      </ul>
    </div>
  );
}
