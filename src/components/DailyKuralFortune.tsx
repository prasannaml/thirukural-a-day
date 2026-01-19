"use client";

import { useState } from "react";
import type { Kural } from "@/lib/kuralOfDay";
import { getDateKeyIST, getKuralOfDay } from "@/lib/kuralOfDay";

export default function DailyKuralFortune() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  function openDailyFortune() {
    setIsOpening(true);
    setTimeout(() => {
      setIsOpen(true);
      setIsOpening(false);
    }, 600);
  }

  function closeFortune() {
    setIsOpen(false);
  }

  const dateKey = getDateKeyIST();
  const kural = getKuralOfDay(dateKey);

  return (
    <div className="mt-8">
      <button
        onClick={openDailyFortune}
        className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-zinc-800"
      >
        ✨ What's my Kural for the Day?
      </button>

      {(isOpening || isOpen) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
          <div
            className={`w-full max-w-md transition-all duration-500 ${
              isOpening
                ? "scale-0 rotate-0 opacity-0"
                : "scale-100 rotate-0 opacity-100"
            }`}
          >
            <div className="rounded-full border-4 border-yellow-400 bg-gradient-to-b from-yellow-50 to-yellow-100 p-8 shadow-2xl dark:from-yellow-900 dark:to-yellow-800">
              <div className="text-center">
                <div className="mb-4 text-4xl">🥠</div>

                <p className="text-lg leading-relaxed font-semibold">
                  {kural.Line1}
                  <br />
                  {kural.Line2}
                </p>

                {kural.mk && (
                  <p className="mt-6 text-gray-700 dark:text-zinc-300">
                    {kural.mk}
                  </p>
                )}

                {kural.english_mk_translation && (
                  <p className="mt-4 text-gray-700 dark:text-zinc-300">
                    {kural.english_mk_translation}
                  </p>
                )}

                <div className="mt-6 border-t pt-4 text-xs text-gray-500 dark:text-gray-400">
                  <p>Kural #{kural.Number}</p>
                  <p className="mt-1">Today's Fortune</p>
                </div>

                <button
                  onClick={closeFortune}
                  className="mt-6 rounded-lg bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
