"use client";

import Link from "next/link";
import { getDateKeyIST, getKuralOfDay } from "@/lib/kuralOfDay";

// Thirukkural chapter mapping (simplified - first 10 chapters as example)
const ADHIKARAM: Record<
  number,
  { tamil: string; english: string; pal: string }
> = {
  1: { tamil: "கடவுள் வாழ்த்து", english: "Praise of God", pal: "Aram" },
  2: { tamil: "வான்சிறப்பு", english: "The Blessing of Rain", pal: "Aram" },
  3: {
    tamil: "நீத்தார் பெருமை",
    english: "The Greatness of Ascetics",
    pal: "Aram",
  },
  4: { tamil: "அறன் வலியுறுத்தல்", english: "Assertion of Virtue", pal: "Aram" },
  5: { tamil: "இல்வாழ்க்கை", english: "Domestic Life", pal: "Aram" },
  6: { tamil: "வாழ்க்கைத் துணைநலம்", english: "Wife", pal: "Aram" },
  7: { tamil: "மக்கட்பேறு", english: "Obtaining Children", pal: "Aram" },
  8: { tamil: "அன்புடைமை", english: "Possession of Love", pal: "Aram" },
  9: { tamil: "விருந்தோம்பல்", english: "Hospitality", pal: "Aram" },
  10: { tamil: "இனியவை கூறல்", english: "Sweet Speech", pal: "Aram" },
};

const PAL_COLORS: Record<string, { bg: string; text: string; border: string }> =
  {
    Aram: {
      bg: "bg-emerald-50 dark:bg-emerald-950",
      text: "text-emerald-700 dark:text-emerald-300",
      border: "border-emerald-300 dark:border-emerald-700",
    },
    Porul: {
      bg: "bg-blue-50 dark:bg-blue-950",
      text: "text-blue-700 dark:text-blue-300",
      border: "border-blue-300 dark:border-blue-700",
    },
    Inbam: {
      bg: "bg-rose-50 dark:bg-rose-950",
      text: "text-rose-700 dark:text-rose-300",
      border: "border-rose-300 dark:border-rose-700",
    },
  };

export default function PreviewDesignB() {
  const dateKey = getDateKeyIST();
  const kural = getKuralOfDay(dateKey);

  const chapterNum = Math.ceil(kural.Number / 10);
  const chapter = ADHIKARAM[chapterNum] || {
    tamil: `அதிகாரம் ${chapterNum}`,
    english: `Chapter ${chapterNum}`,
    pal: chapterNum <= 38 ? "Aram" : chapterNum <= 108 ? "Porul" : "Inbam",
  };
  const palColor = PAL_COLORS[chapter.pal] || PAL_COLORS.Aram;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/preview"
        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
      >
        &larr; Back to all designs
      </Link>

      <div className="mt-6 mb-8 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
        <strong>Design B:</strong> Cultural decorative borders + chapter/section
        context badges
      </div>

      <h1 className="text-3xl font-bold tracking-tight">
        Thirukkural of the Day
      </h1>

      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {dateKey} &middot; Kural #{kural.Number}
      </p>

      {/* Chapter context badge */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${palColor.bg} ${palColor.text} ${palColor.border}`}
        >
          {chapter.pal === "Aram"
            ? "அறம் (Virtue)"
            : chapter.pal === "Porul"
              ? "பொருள் (Wealth)"
              : "இன்பம் (Love)"}
        </span>
        <span className="inline-flex items-center rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
          {chapter.tamil} &middot; {chapter.english}
        </span>
      </div>

      {/* Card with decorative Tamil-inspired border */}
      <div className="relative mt-6">
        {/* Decorative corner accents */}
        <div className="absolute -top-1 -left-1 h-6 w-6 border-t-2 border-l-2 border-amber-500 rounded-tl-md" />
        <div className="absolute -top-1 -right-1 h-6 w-6 border-t-2 border-r-2 border-amber-500 rounded-tr-md" />
        <div className="absolute -bottom-1 -left-1 h-6 w-6 border-b-2 border-l-2 border-amber-500 rounded-bl-md" />
        <div className="absolute -bottom-1 -right-1 h-6 w-6 border-b-2 border-r-2 border-amber-500 rounded-br-md" />

        <div className="rounded-xl border border-gray-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
          {/* Decorative top pattern */}
          <div className="mb-6 flex items-center justify-center gap-2 text-amber-400 dark:text-amber-600">
            <span className="text-sm">&#9670;</span>
            <div className="h-px w-16 bg-amber-300 dark:bg-amber-700" />
            <span className="text-base">&#10045;</span>
            <div className="h-px w-16 bg-amber-300 dark:bg-amber-700" />
            <span className="text-sm">&#9670;</span>
          </div>

          <p className="text-center text-2xl leading-relaxed font-semibold text-gray-900 dark:text-gray-100">
            {kural.Line1}
            <br />
            {kural.Line2}
          </p>

          {/* Decorative divider */}
          <div className="my-6 flex items-center justify-center gap-2 text-amber-400 dark:text-amber-600">
            <div className="h-px flex-1 bg-amber-200 dark:bg-amber-800" />
            <span className="text-xs">&#9672;</span>
            <div className="h-px flex-1 bg-amber-200 dark:bg-amber-800" />
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

          {/* Decorative bottom pattern */}
          <div className="mt-6 flex items-center justify-center gap-2 text-amber-400 dark:text-amber-600">
            <span className="text-sm">&#9670;</span>
            <div className="h-px w-16 bg-amber-300 dark:bg-amber-700" />
            <span className="text-base">&#10045;</span>
            <div className="h-px w-16 bg-amber-300 dark:bg-amber-700" />
            <span className="text-sm">&#9670;</span>
          </div>
        </div>
      </div>
    </main>
  );
}
