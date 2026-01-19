"use client";

export const dynamic = "force-dynamic";
import { Suspense } from "react";
import RandomKural from "@/components/RandomKural";
import KuralFortuneCookie from "@/components/KuralFortuneCookie";
import TestDateOverride from "@/components/TestDateOverride";
import { getDateKeyIST, getKuralOfDay } from "@/lib/kuralOfDay";

export default function Home() {
  const dateKey = getDateKeyIST();
  const kural = getKuralOfDay(dateKey);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Thirukkural of the Day</h1>

      <p className="mt-2 text-sm text-gray-500">
        Date: <strong>{dateKey}</strong> · Kural #{kural.Number}
      </p>

      <div className="mt-6 rounded-xl border bg-white p-6 dark:bg-black">
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
          <a
            href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`}      
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-green-600 hover:underline dark:text-green-400"
          >
            Share on WhatsApp
          </a>
          <button
            onClick={() => {
              const text = `Thirukkural ${kural.Number}\n\n${kural.Line1}\n${kural.Line2}`;
              navigator.clipboard.writeText(text);
            }}
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            Copy to Clipboard
          </button>
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
