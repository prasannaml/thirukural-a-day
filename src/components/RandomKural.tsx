"use client";

import { useState } from "react";
import type { Kural } from "@/lib/kuralOfDay";
import data from "@/data/thirukkural.json";

export default function RandomKural() {
  const list = (data as { kural: Kural[] }).kural;
  const [kural, setKural] = useState<Kural | null>(null);

  function pickRandom() {
    const index = Math.floor(Math.random() * list.length);
    setKural(list[index]);
  }

  return (
    <div className="mt-8">
      <button
        onClick={pickRandom}
        className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-zinc-800"
      >
        🎲 Random Kural
      </button>

      {kural ? (
        <div className="mt-6 rounded-xl border bg-white p-6 dark:bg-black">
          <p className="text-xl leading-relaxed">
            {kural.Line1}
            <br />
            {kural.Line2}
          </p>

          {kural.mk ? (
            <p className="mt-4 text-gray-700 dark:text-zinc-300">{kural.mk}</p>
          ) : null}

          {kural.explanation ? (
            <p className="mt-4 text-gray-600 dark:text-zinc-400">
              {kural.explanation}
            </p>
          ) : null}

          <p className="mt-3 text-sm text-gray-500">
            Kural #{kural.Number}
          </p>
        </div>
      ) : null}
    </div>
  );
}
