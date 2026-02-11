"use client";

export const dynamic = "force-dynamic";
import { Suspense } from "react";
import RandomKural from "@/components/RandomKural";
import KuralFortuneCookie from "@/components/KuralFortuneCookie";
import TestDateOverride from "@/components/TestDateOverride";
import { getDateKeyIST, getKuralOfDay } from "@/lib/kuralOfDay";
import ShareLinkButtons from "@/components/ShareLinkButtons";
import chaptersData from "@/data/chapters.json";

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

export default function Home() {
  const dateKey = getDateKeyIST();
  const kural = getKuralOfDay(dateKey);
  const chapterNum = Math.ceil(kural.Number / 10);
  const chapter = ADHIKARAM[chapterNum];
  const palInfo = getPalInfo(chapterNum);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Thirukkural of the Day</h1>

      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Date: <strong>{dateKey}</strong>
      </p>

      {/* Pal, Kural Number, and Chapter - all on one line */}
      <div className="mt-4 flex items-center justify-between gap-2">
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

      <div className="mt-6 rounded-xl border bg-white p-6 dark:bg-black dark:border-zinc-800">
        <p className="text-xl leading-relaxed">
          {kural.Line1}
          <br />
          {kural.Line2}
        </p>

        {kural.mk && (
          <p className="mt-4 text-gray-700 dark:text-zinc-300">{kural.mk}</p>
        )}

        {kural.english_mk_translation && (
          <p className="mt-4 text-gray-700 dark:text-zinc-300">{kural.english_mk_translation}</p>
        )}

        <div className="mt-6 flex justify-between">
          <ShareLinkButtons/>
        </div>
      </div>

      {/* ✅ Test-only: renders a forced-date kural if ?date=YYYY-MM-DD is present */}
      {process.env.NODE_ENV !== "production" && (
    <Suspense fallback={null}>
       <TestDateOverride />
    </Suspense>
  )}


      <RandomKural />

      <KuralFortuneCookie />

      {/* 👇 DEV ONLY */}
      {process.env.NODE_ENV !== "production" && <TestDateOverride />}


    </main>
  );
}
