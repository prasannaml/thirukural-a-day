"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import data from "@/data/thirukkural.json";
import type { Kural } from "@/lib/kuralOfDay";

// Copy the same hash used in lib so results match exactly
function fnv1a32(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function isValidDateKey(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

export default function TestDateOverride() {
  const sp = useSearchParams();
  const date = sp.get("date"); // YYYY-MM-DD

  const forced = useMemo(() => {
    if (!date || !isValidDateKey(date)) return null;

    const list = (data as { kural: Kural[] }).kural;
    if (!list?.length) return null;

    const idx = fnv1a32(date) % list.length;
    return { date, kural: list[idx] };
  }, [date]);

  if (!forced) return null;

  return (
    <div className="mt-10 rounded-xl border border-dashed p-6">
      <p className="text-sm text-gray-500">
        Test override active: <strong>?date={forced.date}</strong>
      </p>

      <div className="mt-4 rounded-xl border bg-white p-6 dark:bg-black">
        <p className="text-xl leading-relaxed">
          {forced.kural.Line1}
          <br />
          {forced.kural.Line2}
        </p>

        {forced.kural.mk ? (
          <p className="mt-4 text-gray-700 dark:text-zinc-300">{forced.kural.mk}</p>
        ) : null}

        {forced.kural.explanation ? (
          <p className="mt-4 text-gray-600 dark:text-zinc-400">
            {forced.kural.explanation}
          </p>
        ) : null}

        <p className="mt-3 text-sm text-gray-500">Kural #{forced.kural.Number}</p>
      </div>
    </div>
  );
}

