"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getDateKeyIST, getKuralOfDay, type Kural } from "@/lib/kuralOfDay";
import chaptersData from "@/data/chapters.json";

type KuralWithTranslit = Kural & {
  transliteration1?: string;
  transliteration2?: string;
};

// Daily rotating gradient palettes for kural text
const GRADIENTS = [
  // amber -> rose (original)
  {
    light: "from-amber-700 via-rose-600 to-amber-700",
    dark: "dark:from-amber-400 dark:via-rose-400 dark:to-amber-400",
  },
  // emerald -> teal
  {
    light: "from-emerald-700 via-teal-600 to-emerald-700",
    dark: "dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-400",
  },
  // purple -> indigo
  {
    light: "from-purple-700 via-indigo-600 to-purple-700",
    dark: "dark:from-purple-400 dark:via-indigo-400 dark:to-purple-400",
  },
  // orange -> red
  {
    light: "from-orange-700 via-red-600 to-orange-700",
    dark: "dark:from-orange-400 dark:via-red-400 dark:to-orange-400",
  },
  // sky -> blue
  {
    light: "from-sky-700 via-blue-600 to-sky-700",
    dark: "dark:from-sky-400 dark:via-blue-400 dark:to-sky-400",
  },
  // pink -> fuchsia
  {
    light: "from-pink-700 via-fuchsia-600 to-pink-700",
    dark: "dark:from-pink-400 dark:via-fuchsia-400 dark:to-pink-400",
  },
  // yellow -> amber
  {
    light: "from-yellow-700 via-amber-600 to-yellow-700",
    dark: "dark:from-yellow-400 dark:via-amber-400 dark:to-yellow-400",
  },
];

function getGradientForDate(dateKey: string) {
  // Simple hash of date string to pick a gradient
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash * 31 + dateKey.charCodeAt(i)) | 0;
  }
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Convert chapters array to lookup map
const ADHIKARAM = chaptersData.adhikarams.reduce(
  (acc, ch) => {
    acc[ch.number] = { tamil: ch.tamil, english: ch.english };
    return acc;
  },
  {} as Record<number, { tamil: string; english: string }>,
);

// Helper to get Pal info
function getPalInfo(chapterNum: number) {
  for (const pal of chaptersData.pals) {
    if (chapterNum >= pal.chapters[0] && chapterNum <= pal.chapters[1]) {
      return {
        name: pal.nameShort,
        nameEnglish: pal.nameShortEnglish,
      };
    }
  }
  return { name: "அறம்", nameEnglish: "Virtue" }; // fallback
}

export default function PreviewDesignD() {
  const todayKey = getDateKeyIST();
  const [dateKey, setDateKey] = useState(todayKey);
  const [animKey, setAnimKey] = useState(0);
  const kural = getKuralOfDay(dateKey) as KuralWithTranslit;

  const isToday = dateKey === todayKey;
  const chapterNum = Math.ceil(kural.Number / 10);
  const chapter = ADHIKARAM[chapterNum];
  const palInfo = getPalInfo(chapterNum);
  const gradient = getGradientForDate(dateKey);

  const navigate = useCallback(
    (days: number) => {
      setDateKey((prev) => {
        const next = addDays(prev, days);
        // Don't allow navigating past today
        if (next > todayKey) return prev;
        return next;
      });
      setAnimKey((prev) => prev + 1);
    },
    [todayKey],
  );

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return (
    <main className="relative mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/preview"
        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
      >
        &larr; Back to all designs
      </Link>

      <div className="mt-6 mb-8 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
        <strong>Design D (Combined):</strong> All improvements together &mdash;
        animations, cultural borders, chapter context, navigation, progress bar,
        gradient text, keyboard support.
      </div>

      {/* Header with animation */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold tracking-tight">
          Thirukkural of the Day
        </h1>

        {/* Navigation */}
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-colors hover:bg-gray-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
            title="Previous day (← key)"
          >
            &larr;
          </button>

          <div className="flex-1 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {dateKey}
              {!isToday && (
                <button
                  type="button"
                  onClick={() => {
                    setDateKey(todayKey);
                    setAnimKey((prev) => prev + 1);
                  }}
                  className="ml-2 text-blue-600 hover:underline dark:text-blue-400"
                >
                  (today)
                </button>
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(1)}
            disabled={isToday}
            className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
              isToday
                ? "cursor-not-allowed border-gray-200 text-gray-300 dark:border-zinc-800 dark:text-zinc-600"
                : "border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
            title={isToday ? "You're on today's kural" : "Next day (→ key)"}
          >
            &rarr;
          </button>
        </div>

      </div>

      {/* Pal, Kural Number, and Chapter - all on one line */}
      <div className="mt-6 flex items-center justify-between gap-2">
        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
            palInfo.nameEnglish === "Virtue"
              ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              : palInfo.nameEnglish === "Wealth"
                ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300"
                : "border-pink-300 bg-pink-50 text-pink-700 dark:border-pink-600 dark:bg-pink-950 dark:text-pink-400"
          }`}
        >
          பால்: {palInfo.name} (Section: {palInfo.nameEnglish})
        </span>

        <span className="text-sm font-medium text-gray-600 dark:text-zinc-400">
          Kural #{kural.Number}
        </span>

        {chapter && (
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
              palInfo.nameEnglish === "Virtue"
                ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                : palInfo.nameEnglish === "Wealth"
                  ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300"
                  : "border-pink-300 bg-pink-50 text-pink-700 dark:border-pink-600 dark:bg-pink-950 dark:text-pink-400"
            }`}
          >
            அதிகாரம்: {chapter.tamil} (Chapter: {chapter.english})
          </span>
        )}
      </div>

      {/* Card with decorative borders */}
      <div className="relative mt-6" key={animKey}>
        {/* Decorative corner accents */}
        <div className="absolute -top-1 -left-1 h-6 w-6 rounded-tl-md border-t-2 border-l-2 border-amber-500" />
        <div className="absolute -top-1 -right-1 h-6 w-6 rounded-tr-md border-t-2 border-r-2 border-amber-500" />
        <div className="absolute -bottom-1 -left-1 h-6 w-6 rounded-bl-md border-b-2 border-l-2 border-amber-500" />
        <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-br-md border-b-2 border-r-2 border-amber-500" />

        <div className="animate-card-enter relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-6 py-6 shadow-sm sm:px-8 sm:py-8 dark:border-zinc-800 dark:bg-zinc-950">
          {/* Simple top ornament line */}
          <div className="mb-4 flex items-center justify-center gap-2 text-amber-400 dark:text-amber-600">
            <div className="h-px w-12 bg-amber-300 dark:bg-amber-700" />
            <span className="text-sm">&#10045;</span>
            <div className="h-px w-12 bg-amber-300 dark:bg-amber-700" />
          </div>

          {/* Gradient kural text — sized to fit 2 lines on mobile */}
          <p className="text-center text-base leading-relaxed font-semibold sm:text-2xl">
            <span
              className={`bg-gradient-to-r ${gradient.light} ${gradient.dark} bg-clip-text text-transparent`}
            >
              {kural.Line1}
              <br />
              {kural.Line2}
            </span>
          </p>

          {/* Transliteration */}
          {kural.transliteration1 && (
            <p className="mt-3 text-center font-mono text-xs tracking-wide text-gray-400 italic dark:text-zinc-500">
              {kural.transliteration1}
              <br />
              {kural.transliteration2}
            </p>
          )}

          {/* Simple flat divider */}
          <div className="my-5 flex items-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent dark:via-amber-700" />
          </div>

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

          {/* Simple bottom ornament line */}
          <div className="mt-4 flex items-center justify-center gap-2 text-amber-400 dark:text-amber-600">
            <div className="h-px w-12 bg-amber-300 dark:bg-amber-700" />
            <span className="text-sm">&#10045;</span>
            <div className="h-px w-12 bg-amber-300 dark:bg-amber-700" />
          </div>
        </div>
      </div>

      {/* Keyboard hint */}
      <p className="mt-4 text-center text-xs text-gray-400 dark:text-zinc-600">
        Use{" "}
        <kbd className="rounded border border-gray-300 px-1.5 py-0.5 font-mono text-xs dark:border-zinc-700">
          ←
        </kbd>{" "}
        <kbd className="rounded border border-gray-300 px-1.5 py-0.5 font-mono text-xs dark:border-zinc-700">
          →
        </kbd>{" "}
        arrow keys to browse past kurals
      </p>

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
        @keyframes cardEnter {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out both;
        }
        .animate-card-enter {
          animation: cardEnter 0.5s ease-out both;
        }
      `}</style>
    </main>
  );
}
