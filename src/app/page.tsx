import RandomKural from "@/components/RandomKural";
import { getDateKeyIST, getKuralOfDay } from "@/lib/kuralOfDay";

export default function Home() {
  const dateKey = getDateKeyIST();
  const kural = getKuralOfDay(dateKey);

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold">Thirukkural of the Day</h1>

      <p className="mt-2 text-sm text-gray-500">
        {dateKey} · Kural #{kural.Number}
      </p>

      <div className="mt-6 rounded-xl border bg-white p-6 dark:bg-black">
        <p className="text-xl leading-relaxed">
          {kural.Line1}
          <br />
          {kural.Line2}
        </p>

        {kural.mk ? (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
              விளக்கம் (தமிழ்)
            </h2>
            <p className="mt-2 text-gray-700 dark:text-zinc-300">{kural.mk}</p>
          </div>
        ) : null}

        {kural.explanation ? (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
              Explanation (English)
            </h2>
            <p className="mt-2 text-gray-700 dark:text-zinc-300">{kural.explanation}</p>
          </div>
        ) : null}
      </div>
      <RandomKural />
    </main>
  );
}
