"use client";

import Link from "next/link";
import { useState } from "react";
import { getDateKeyIST, getKuralOfDay } from "@/lib/kuralOfDay";

function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function PreviewDesignC() {
  const todayKey = getDateKeyIST();
  const [dateKey, setDateKey] = useState(todayKey);
  const kural = getKuralOfDay(dateKey);

  const isToday = dateKey === todayKey;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/preview"
        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
      >
        &larr; Back to all designs
      </Link>

      <div className="mt-6 mb-8 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
        <strong>Design C:</strong> Day navigation + progress indicator +
        keyboard shortcuts
      </div>

      <h1 className="text-3xl font-bold tracking-tight">
        Thirukkural of the Day
      </h1>

      {/* Navigation bar */}
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setDateKey(addDays(dateKey, -1))}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-colors hover:bg-gray-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
          title="Previous day"
        >
          &larr;
        </button>

        <div className="flex-1 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {dateKey}
            {!isToday && (
              <button
                type="button"
                onClick={() => setDateKey(todayKey)}
                className="ml-2 text-blue-600 hover:underline dark:text-blue-400"
              >
                (back to today)
              </button>
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setDateKey(addDays(dateKey, 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-colors hover:bg-gray-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
          title="Next day"
        >
          &rarr;
        </button>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-gray-400 dark:text-zinc-500">
          <span>Kural #{kural.Number}</span>
          <span>{kural.Number} of 1330</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-500"
            style={{ width: `${(kural.Number / 1330) * 100}%` }}
          />
        </div>
      </div>

      {/* Kural card */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-2xl leading-relaxed font-semibold text-gray-900 dark:text-gray-100">
          {kural.Line1}
          <br />
          {kural.Line2}
        </p>

        <div className="my-6 h-px bg-gray-200 dark:bg-zinc-800" />

        {kural.mk && (
          <p className="text-base leading-relaxed text-gray-700 dark:text-zinc-300">
            {kural.mk}
          </p>
        )}

        {kural.english_mk_translation && (
          <p className="mt-4 text-base leading-relaxed text-gray-600 italic dark:text-zinc-400">
            &ldquo;{kural.english_mk_translation}&rdquo;
          </p>
        )}
      </div>

      {/* Keyboard hint */}
      <p className="mt-4 text-center text-xs text-gray-400 dark:text-zinc-600">
        Try the arrow buttons to browse different days
      </p>
    </main>
  );
}
