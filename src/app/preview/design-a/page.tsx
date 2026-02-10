"use client";

import Link from "next/link";
import { getDateKeyIST, getKuralOfDay, type Kural } from "@/lib/kuralOfDay";

type KuralWithTranslit = Kural & {
  transliteration1?: string;
  transliteration2?: string;
};

export default function PreviewDesignA() {
  const dateKey = getDateKeyIST();
  const kural = getKuralOfDay(dateKey) as KuralWithTranslit;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/preview"
        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
      >
        &larr; Back to all designs
      </Link>

      <div className="mt-6 mb-8 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
        <strong>Design A:</strong> Animated entrance + gradient kural text +
        refined typography
      </div>

      {/* Animated entrance wrapper */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold tracking-tight">
          Thirukkural of the Day
        </h1>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {dateKey} &middot; Kural #{kural.Number}
        </p>

        <div className="mt-6 animate-fade-in-up-delayed rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          {/* Gradient kural text */}
          <p className="bg-gradient-to-r from-amber-700 via-rose-600 to-amber-700 bg-clip-text text-2xl leading-relaxed font-semibold text-transparent dark:from-amber-400 dark:via-rose-400 dark:to-amber-400">
            {kural.Line1}
            <br />
            {kural.Line2}
          </p>

          {/* Transliteration */}
          {kural.transliteration1 && (
            <p className="mt-3 font-mono text-xs tracking-wide text-gray-400 italic dark:text-zinc-500">
              {kural.transliteration1}
              <br />
              {kural.transliteration2}
            </p>
          )}

          {/* Subtle divider */}
          <div className="my-6 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-zinc-700" />

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
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out both;
        }
        .animate-fade-in-up-delayed {
          animation: fadeInUp 0.6s ease-out 0.2s both;
        }
      `}</style>
    </main>
  );
}
