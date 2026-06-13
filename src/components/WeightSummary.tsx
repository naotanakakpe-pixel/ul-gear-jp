"use client";

import { formatWeight, type WeightResult } from "@/lib/weight";

interface WeightSummaryProps {
  result: WeightResult;
  goalBaseG: number;
}

export default function WeightSummary({ result, goalBaseG }: WeightSummaryProps) {
  const { baseG, packG, skinoutG } = result;
  const pct = goalBaseG > 0 ? Math.min((baseG / goalBaseG) * 100, 100) : 0;
  const underGoal = baseG <= goalBaseG;
  const diff = baseG - goalBaseG;

  const barColor = underGoal ? "#16a34a" : "#dc2626";

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-2">
        <StatCard
          label="ベースウェイト"
          value={baseG}
          hint="消耗品・着用品を除く"
          emphasize
        />
        <StatCard label="パックウェイト" value={packG} hint="消耗品込み・背負う総重量" />
        <StatCard label="スキンアウト" value={skinoutG} hint="着用品も含む全部" />
      </div>

      {/* 目標達成メーター */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-sm font-medium text-slate-600">
            目標ベースウェイト
          </span>
          <span className="tabular text-sm text-slate-500">
            目標 {formatWeight(goalBaseG)}
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${pct}%`, backgroundColor: barColor }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="tabular font-semibold" style={{ color: barColor }}>
            {formatWeight(baseG)}
          </span>
          <span className="text-slate-500">
            {underGoal ? (
              <>
                目標まで残り{" "}
                <span className="tabular font-medium text-green-700">
                  {formatWeight(Math.abs(diff))}
                </span>
              </>
            ) : (
              <>
                目標を{" "}
                <span className="tabular font-medium text-red-600">
                  {formatWeight(diff)}
                </span>{" "}
                超過
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  emphasize = false,
}: {
  label: string;
  value: number;
  hint: string;
  emphasize?: boolean;
}) {
  return (
    <div
      className={`flex flex-col rounded-xl border p-3 ${
        emphasize
          ? "border-green-300 bg-green-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <span className="text-xs text-slate-500">{label}</span>
      <span
        className={`tabular mt-0.5 text-lg font-bold leading-tight ${
          emphasize ? "text-green-700" : "text-slate-800"
        }`}
      >
        {formatWeight(value)}
      </span>
      <span className="mt-1 text-[10px] leading-tight text-slate-400">{hint}</span>
    </div>
  );
}
