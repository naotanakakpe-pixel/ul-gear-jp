"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { searchGear } from "@/data/gear";
import { CATEGORIES, categoryColor, categoryLabel } from "@/lib/categories";
import { CONFIDENCE_LABEL, CONFIDENCE_STYLE } from "@/lib/gear-meta";
import { formatWeight } from "@/lib/weight";
import { gearPath } from "@/lib/site";
import type { GearCategory, GearItem, ListItem } from "@/lib/types";

export type NewItem = Omit<ListItem, "uid">;

interface GearPickerProps {
  onAdd: (item: NewItem) => void;
}

export default function GearPicker({ onAdd }: GearPickerProps) {
  const [mode, setMode] = useState<"db" | "manual">("db");
  const [query, setQuery] = useState("");

  const results = useMemo(() => searchGear(query), [query]);

  function addFromDb(g: GearItem) {
    onAdd({
      gearId: g.id,
      brand: g.brand,
      name: g.name,
      category: g.category,
      weight_g: g.weight_g,
      qty: 1,
      consumable: false,
      worn: false,
    });
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex gap-1 rounded-lg bg-slate-100 p-1 text-sm">
        <button
          type="button"
          onClick={() => setMode("db")}
          className={`flex-1 rounded-md px-3 py-1.5 font-medium transition ${
            mode === "db" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
          }`}
        >
          DBから選ぶ
        </button>
        <button
          type="button"
          onClick={() => setMode("manual")}
          className={`flex-1 rounded-md px-3 py-1.5 font-medium transition ${
            mode === "manual" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
          }`}
        >
          手入力
        </button>
      </div>

      {mode === "db" ? (
        <div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ブランド・製品名で検索（例: 山と道、テント）"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <ul className="mt-3 max-h-72 overflow-y-auto pr-1">
            {results.map((g) => (
              <li key={g.id} className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => addFromDb(g)}
                  className="group flex flex-1 items-center gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-blue-50"
                >
                  <span
                    className="h-8 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: categoryColor(g.category) }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-slate-800">
                      {g.brand} {g.name}
                    </span>
                    <span className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{categoryLabel(g.category)}</span>
                      <span
                        className={`rounded px-1 py-0.5 text-[10px] ${CONFIDENCE_STYLE[g.confidence]}`}
                      >
                        {CONFIDENCE_LABEL[g.confidence]}
                      </span>
                    </span>
                  </span>
                  <span className="tabular shrink-0 text-sm font-semibold text-slate-700">
                    {formatWeight(g.weight_g)}
                  </span>
                  <span className="shrink-0 text-blue-500 opacity-0 transition group-hover:opacity-100">
                    ＋追加
                  </span>
                </button>
                <Link
                  href={gearPath(g.id)}
                  className="shrink-0 rounded-lg px-2 py-2 text-xs text-slate-400 transition hover:text-blue-600"
                  title="スペック詳細ページ"
                >
                  詳細
                </Link>
              </li>
            ))}
            {results.length === 0 && (
              <li className="px-2 py-6 text-center text-sm text-slate-400">
                該当なし。「手入力」で追加できます。
              </li>
            )}
          </ul>
        </div>
      ) : (
        <ManualForm onAdd={onAdd} />
      )}
    </div>
  );
}

function ManualForm({ onAdd }: { onAdd: (item: NewItem) => void }) {
  const [brand, setBrand] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<GearCategory>("misc");
  const [weight, setWeight] = useState("");

  const weightNum = Number(weight);
  const canAdd = name.trim() !== "" && Number.isFinite(weightNum) && weightNum > 0;

  function submit() {
    if (!canAdd) return;
    onAdd({
      brand: brand.trim(),
      name: name.trim(),
      category,
      weight_g: Math.round(weightNum),
      qty: 1,
      consumable: false,
      worn: false,
    });
    setBrand("");
    setName("");
    setWeight("");
    setCategory("misc");
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        <input
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="ブランド（任意）"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="製品名 *"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as GearCategory)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <div className="flex items-center rounded-lg border border-slate-300 px-3 focus-within:border-blue-500">
          <input
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            inputMode="numeric"
            placeholder="重量 *"
            className="w-full py-2 text-sm outline-none"
          />
          <span className="text-sm text-slate-400">g</span>
        </div>
      </div>
      <button
        type="button"
        onClick={submit}
        disabled={!canAdd}
        className="mt-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        リストに追加
      </button>
    </div>
  );
}
