import Link from "next/link";

const designs = [
  {
    href: "/preview/design-a",
    title: "Design A: Animated Entrance + Gradient Text",
    description:
      "Smooth fade-in-up animation on page load. Kural text uses an amber-to-rose gradient. Transliteration shown in mono font. Refined card with subtle shadow and gradient dividers.",
    features: [
      "Page entrance animation (fade + slide up)",
      "Gradient Tamil kural text",
      "Transliteration display",
      "Refined card styling with subtle shadow",
      "Gradient divider between sections",
    ],
  },
  {
    href: "/preview/design-b",
    title: "Design B: Cultural Borders + Chapter Context",
    description:
      "Decorative corner accents and Tamil-inspired ornamental dividers. Color-coded chapter badges showing Pal (Aram/Porul/Inbam) and Adhikaram name.",
    features: [
      "Decorative amber corner accents on card",
      "Tamil ornamental patterns (top/bottom/divider)",
      "Color-coded section badge (Aram/Porul/Inbam)",
      "Chapter name in Tamil + English",
      "Centered kural layout",
    ],
  },
  {
    href: "/preview/design-c",
    title: "Design C: Day Navigation + Progress Bar",
    description:
      "Browse previous and upcoming kurals with arrow buttons. Progress bar shows current kural position out of 1330. Quick 'back to today' link.",
    features: [
      "Previous/next day navigation arrows",
      "Animated progress bar (kural N of 1330)",
      '"Back to today" quick link',
      "Clean, minimal card design",
    ],
  },
  {
    href: "/preview/design-d",
    title: "Design D: Combined (Recommended)",
    description:
      "The best elements from all designs combined: animations, cultural borders, chapter context, navigation, progress bar, gradient text, and keyboard navigation.",
    features: [
      "Everything from A + B + C combined",
      "Keyboard arrow key navigation",
      "Animated card transitions on navigate",
      "Full cultural + modern design fusion",
    ],
  },
];

export default function PreviewIndex() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/"
        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
      >
        &larr; Back to home
      </Link>

      <h1 className="mt-6 text-3xl font-bold tracking-tight">
        UI Design Previews
      </h1>
      <p className="mt-2 text-gray-600 dark:text-zinc-400">
        Compare different design directions for the Thirukkural of the Day page.
        Each preview shows the same daily kural with different visual
        treatments.
      </p>

      <div className="mt-8 space-y-6">
        {designs.map((design) => (
          <Link
            key={design.href}
            href={design.href}
            className="block rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {design.title}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-zinc-400">
              {design.description}
            </p>
            <ul className="mt-3 space-y-1">
              {design.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-sm text-gray-500 dark:text-zinc-500"
                >
                  <span className="mt-0.5 text-amber-500">&#9679;</span>
                  {f}
                </li>
              ))}
            </ul>
            <span className="mt-4 inline-block text-sm font-medium text-blue-600 dark:text-blue-400">
              View preview &rarr;
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
