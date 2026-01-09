export const dynamic = "force-dynamic";

import RandomKural from "@/components/RandomKural";
import TestDateOverride from "@/components/TestDateOverride";
import { getDateKeyIST, getKuralOfDay } from "@/lib/kuralOfDay";

export default function Home() {
  const dateKey = getDateKeyIST();
  const kural = getKuralOfDay(dateKey);

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold">Thirukkural of the Day</h1>

      <p className="mt-2 text-sm text-gray-500">
        Date key: <strong>{dateKey}</strong> · Kural #{kural.Number}
      </p>

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
          <p className="mt-4 text-gray-600 dark:text-zinc-400">{kural.explanation}</p>
        ) : null}
      </div>

      {/* ✅ Test-only: renders a forced-date kural if ?date=YYYY-MM-DD is present */}
      <TestDateOverride />

      <RandomKural />

      {/* 👇 DEV ONLY */}
      {process.env.NODE_ENV !== "production" && <TestDateOverride />}


    </main>
  );
}
