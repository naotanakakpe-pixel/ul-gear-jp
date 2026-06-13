"use client";

import { useEffect, useMemo, useState } from "react";
import GearPicker, { type NewItem } from "@/components/GearPicker";
import WeightSummary from "@/components/WeightSummary";
import DonutChart, { type DonutSlice } from "@/components/DonutChart";
import { categoryColor, categoryLabel } from "@/lib/categories";
import { computeWeights, DEFAULT_GOAL_BASE_G, formatWeight } from "@/lib/weight";
import {
  decodeListState,
  encodeListState,
  loadLocal,
  newUid,
  saveLocal,
} from "@/lib/share";
import type { ListItem } from "@/lib/types";

export default function Home() {
  const [items, setItems] = useState<ListItem[]>([]);
  const [title, setTitle] = useState("マイギアリスト");
  const [goalBaseG, setGoalBaseG] = useState(DEFAULT_GOAL_BASE_G);
  const [hydrated, setHydrated] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // 初回マウント: URL の ?l= → localStorage の順で復元。
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const l = params.get("l");
    const initial = (l && decodeListState(l)) || loadLocal();
    if (initial) {
      setItems(initial.items);
      if (initial.title) setTitle(initial.title);
      if (initial.goalBaseG) setGoalBaseG(initial.goalBaseG);
    }
    setHydrated(true);
  }, []);

  // 変更を localStorage に自動保存（復元後のみ）。
  useEffect(() => {
    if (!hydrated) return;
    saveLocal({ items, title, goalBaseG });
    // リストが変わったら古い共有URLは無効扱いに
    setShareUrl(null);
  }, [items, title, goalBaseG, hydrated]);

  const result = useMemo(() => computeWeights(items), [items]);

  const slices: DonutSlice[] = useMemo(
    () =>
      result.byCategory.map((s) => ({
        label: categoryLabel(s.category),
        grams: s.grams,
        color: categoryColor(s.category),
      })),
    [result],
  );

  function addItem(draft: NewItem) {
    setItems((prev) => [...prev, { ...draft, uid: newUid() }]);
  }

  function updateItem(uid: string, patch: Partial<ListItem>) {
    setItems((prev) => prev.map((it) => (it.uid === uid ? { ...it, ...patch } : it)));
  }

  function removeItem(uid: string) {
    setItems((prev) => prev.filter((it) => it.uid !== uid));
  }

  function handleShare() {
    const encoded = encodeListState({ items, title, goalBaseG });
    const url = `${window.location.origin}${window.location.pathname}?l=${encoded}`;
    setShareUrl(url);
    navigator.clipboard
      ?.writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  }

  function handleReset() {
    if (items.length === 0) return;
    if (confirm("リストを空にします。よろしいですか？")) {
      setItems([]);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          ULギアリスト
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          選ぶだけで、ベースウェイト・パックウェイト・スキンアウトを自動計算。
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* 左: エディタ */}
        <section className="flex flex-col gap-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-lg font-semibold text-slate-800 outline-none focus:border-blue-500"
            placeholder="リスト名"
          />

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            {items.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-sm text-slate-500">
                  下の「DBから選ぶ」または「手入力」でギアを追加してください。
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {items.map((it) => (
                  <GearRow
                    key={it.uid}
                    item={it}
                    onUpdate={updateItem}
                    onRemove={removeItem}
                  />
                ))}
              </ul>
            )}
            {items.length > 0 && (
              <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5 text-sm">
                <span className="text-slate-500">{result.itemCount}点</span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-slate-400 transition hover:text-red-500"
                >
                  すべて消去
                </button>
              </div>
            )}
          </div>

          <GearPicker onAdd={addItem} />
        </section>

        {/* 右: サマリー */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
          <WeightSummary result={result} goalBaseG={goalBaseG} />

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <label className="flex items-center justify-between text-sm text-slate-600">
              <span className="font-medium">目標ベースウェイト</span>
              <span className="flex items-center gap-1">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={(goalBaseG / 1000).toString()}
                  onChange={(e) => {
                    const kg = Number(e.target.value);
                    if (Number.isFinite(kg) && kg >= 0) setGoalBaseG(Math.round(kg * 1000));
                  }}
                  className="tabular w-20 rounded-lg border border-slate-300 px-2 py-1 text-right outline-none focus:border-blue-500"
                />
                <span className="text-slate-400">kg</span>
              </span>
            </label>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <DonutChart
              slices={slices}
              totalG={result.skinoutG}
              centerSub="スキンアウト"
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <button
              type="button"
              onClick={handleShare}
              disabled={items.length === 0}
              className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {copied ? "コピーしました ✓" : "共有リンクを作成"}
            </button>
            {shareUrl && (
              <input
                readOnly
                value={shareUrl}
                onFocus={(e) => e.currentTarget.select()}
                className="mt-2 w-full truncate rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 outline-none"
              />
            )}
            <p className="mt-2 text-[11px] leading-snug text-slate-400">
              リストはこの端末にも自動保存されます（ログイン不要）。
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function GearRow({
  item,
  onUpdate,
  onRemove,
}: {
  item: ListItem;
  onUpdate: (uid: string, patch: Partial<ListItem>) => void;
  onRemove: (uid: string) => void;
}) {
  const lineTotal = item.weight_g * item.qty;

  return (
    <li className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3">
      <span
        className="h-9 w-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: categoryColor(item.category) }}
        title={categoryLabel(item.category)}
      />
      <div className="min-w-0 flex-1 basis-40">
        <p className="truncate text-sm font-medium text-slate-800">
          {item.brand && <span className="text-slate-500">{item.brand} </span>}
          {item.name}
        </p>
        <p className="text-xs text-slate-400">{categoryLabel(item.category)}</p>
      </div>

      {/* 重量（編集可） */}
      <div className="flex items-center rounded-lg border border-slate-200 px-2 focus-within:border-blue-500">
        <input
          type="number"
          min="0"
          value={item.weight_g}
          onChange={(e) => {
            const w = Number(e.target.value);
            if (Number.isFinite(w) && w >= 0) onUpdate(item.uid, { weight_g: Math.round(w) });
          }}
          className="tabular w-14 py-1 text-right text-sm outline-none"
        />
        <span className="text-xs text-slate-400">g</span>
      </div>

      {/* 数量ステッパー */}
      <div className="flex items-center rounded-lg border border-slate-200">
        <button
          type="button"
          onClick={() => onUpdate(item.uid, { qty: Math.max(1, item.qty - 1) })}
          className="px-2 py-1 text-slate-500 hover:text-slate-900"
          aria-label="数量を減らす"
        >
          −
        </button>
        <span className="tabular w-7 text-center text-sm">{item.qty}</span>
        <button
          type="button"
          onClick={() => onUpdate(item.uid, { qty: item.qty + 1 })}
          className="px-2 py-1 text-slate-500 hover:text-slate-900"
          aria-label="数量を増やす"
        >
          ＋
        </button>
      </div>

      {/* フラグ */}
      <div className="flex gap-1">
        <FlagChip
          active={item.consumable}
          onClick={() => onUpdate(item.uid, { consumable: !item.consumable })}
          activeClass="bg-orange-100 text-orange-700 ring-orange-300"
          title="消耗品（水・食料・燃料）"
        >
          消
        </FlagChip>
        <FlagChip
          active={item.worn}
          onClick={() => onUpdate(item.uid, { worn: !item.worn })}
          activeClass="bg-cyan-100 text-cyan-700 ring-cyan-300"
          title="着用品（常時着用）"
        >
          着
        </FlagChip>
      </div>

      <span className="tabular w-16 shrink-0 text-right text-sm font-semibold text-slate-700">
        {formatWeight(lineTotal)}
      </span>

      <button
        type="button"
        onClick={() => onRemove(item.uid)}
        className="shrink-0 px-1 text-slate-300 transition hover:text-red-500"
        aria-label="削除"
      >
        ✕
      </button>
    </li>
  );
}

function FlagChip({
  active,
  onClick,
  activeClass,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  activeClass: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`h-7 w-7 rounded-lg text-xs font-bold ring-1 transition ${
        active ? activeClass : "bg-slate-50 text-slate-400 ring-slate-200 hover:bg-slate-100"
      }`}
    >
      {children}
    </button>
  );
}
