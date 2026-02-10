/**
 * Pulli Kolam SVG patterns — dots (pulli) with looping curves (neli)
 * inspired by traditional Tamil kolam floor art.
 */

/** A small 3x3 pulli kolam with sikku (loop) lines weaving around dots */
export function KolamOrnament({
  className = "",
  size = 80,
}: Readonly<{ className?: string; size?: number }>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Pulli (dots) — 3x3 grid */}
      <circle cx="20" cy="20" r="2.5" fill="currentColor" opacity="0.5" />
      <circle cx="40" cy="20" r="2.5" fill="currentColor" opacity="0.5" />
      <circle cx="60" cy="20" r="2.5" fill="currentColor" opacity="0.5" />
      <circle cx="20" cy="40" r="2.5" fill="currentColor" opacity="0.5" />
      <circle cx="40" cy="40" r="2.5" fill="currentColor" opacity="0.5" />
      <circle cx="60" cy="40" r="2.5" fill="currentColor" opacity="0.5" />
      <circle cx="20" cy="60" r="2.5" fill="currentColor" opacity="0.5" />
      <circle cx="40" cy="60" r="2.5" fill="currentColor" opacity="0.5" />
      <circle cx="60" cy="60" r="2.5" fill="currentColor" opacity="0.5" />

      {/* Sikku loops weaving around dots */}
      {/* Outer diamond loop */}
      <path
        d="M40 6 C52 18, 68 24, 74 40 C68 56, 52 62, 40 74 C28 62, 12 56, 6 40 C12 24, 28 18, 40 6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.6"
      />
      {/* Inner four-petal loop — curves weave between center and edge dots */}
      <path
        d="M40 16 C48 28, 48 28, 40 40 C28 28, 28 28, 40 16Z"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.4"
      />
      <path
        d="M64 40 C52 48, 52 48, 40 40 C52 28, 52 28, 64 40Z"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.4"
      />
      <path
        d="M40 64 C28 52, 28 52, 40 40 C52 52, 52 52, 40 64Z"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.4"
      />
      <path
        d="M16 40 C28 28, 28 28, 40 40 C28 52, 28 52, 16 40Z"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.4"
      />
    </svg>
  );
}

/** Horizontal kolam divider — a row of dots with looping S-curves threading through */
export function KolamDivider({
  className = "",
}: Readonly<{ className?: string }>) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent dark:via-amber-700" />
      <svg
        width="120"
        height="20"
        viewBox="0 0 120 20"
        fill="none"
        className="shrink-0"
        aria-hidden="true"
      >
        {/* Five dots in a row */}
        <circle cx="20" cy="10" r="2" fill="currentColor" opacity="0.5" />
        <circle cx="40" cy="10" r="2" fill="currentColor" opacity="0.5" />
        <circle cx="60" cy="10" r="2" fill="currentColor" opacity="0.5" />
        <circle cx="80" cy="10" r="2" fill="currentColor" opacity="0.5" />
        <circle cx="100" cy="10" r="2" fill="currentColor" opacity="0.5" />

        {/* Continuous sikku loop weaving around dots */}
        <path
          d="M8 10 C14 2, 26 2, 30 10 C34 18, 46 18, 50 10 C54 2, 66 2, 70 10 C74 18, 86 18, 90 10 C94 2, 106 2, 112 10"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.5"
        />
        <path
          d="M8 10 C14 18, 26 18, 30 10 C34 2, 46 2, 50 10 C54 18, 66 18, 70 10 C74 2, 86 2, 90 10 C94 18, 106 18, 112 10"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.5"
        />
      </svg>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent dark:via-amber-700" />
    </div>
  );
}

/** Corner kolam — a small 2x2 pulli pattern with a loop, for card corners */
export function KolamCorner({
  className = "",
  position,
}: Readonly<{
  className?: string;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}>) {
  const rotation = {
    "top-left": 0,
    "top-right": 90,
    "bottom-right": 180,
    "bottom-left": 270,
  }[position];

  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <g transform={`rotate(${rotation} 14 14)`}>
        {/* Corner dots */}
        <circle cx="6" cy="6" r="1.8" fill="currentColor" opacity="0.4" />
        <circle cx="16" cy="6" r="1.8" fill="currentColor" opacity="0.4" />
        <circle cx="6" cy="16" r="1.8" fill="currentColor" opacity="0.4" />

        {/* Loop curve connecting the three dots */}
        <path
          d="M2 2 C2 12, 2 12, 6 16 C10 20, 14 14, 16 6 C18 -2, 8 -2, 2 2Z"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.5"
        />
      </g>
    </svg>
  );
}
