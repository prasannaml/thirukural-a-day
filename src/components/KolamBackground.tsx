/**
 * Generative kolam background — produces a unique, subtle geometric
 * kolam-inspired SVG pattern each day based on a date hash.
 *
 * Inspired by traditional Tamil pulli kolam: dots arranged in a grid
 * with sikku (loop) curves weaving around them in rotational symmetry.
 */

/** Simple seeded PRNG (Lehmer / Park-Miller) */
function makeRng(dateKey: string) {
  let s = 0;
  for (let i = 0; i < dateKey.length; i++) {
    s = (s * 31 + dateKey.charCodeAt(i)) | 0;
  }
  // Ensure positive seed
  s = Math.abs(s) || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s & 0x7fffffff) / 2147483647;
  };
}

/** Pick a random element from an array using the rng */
function pick<T>(arr: readonly T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

/**
 * Generate SVG elements for a kolam-like radial pattern.
 *
 * Parameters controlled by date hash:
 * - folds: rotational symmetry (4, 5, 6, 8, 10, 12)
 * - layers: concentric rings of petals (2–4)
 * - petal curvature & length
 * - whether to include inner star, dots, connecting arcs
 */
function generateKolam(dateKey: string) {
  const rand = makeRng(dateKey);
  const cx = 200;
  const cy = 200;
  const folds = pick([4, 5, 6, 8, 10, 12], rand);
  const layers = 2 + Math.floor(rand() * 3); // 2-4
  const hasInnerStar = rand() > 0.4;
  const hasDots = rand() > 0.25;
  const hasConnectors = rand() > 0.5;

  const paths: string[] = [];
  const dots: Array<{ x: number; y: number; r: number }> = [];

  // Central dot
  dots.push({ x: cx, y: cy, r: 3 });

  // Concentric petal rings
  for (let l = 1; l <= layers; l++) {
    const baseR = 30 + l * 38;
    const petalLen = 12 + rand() * 22;
    const angleStep = (Math.PI * 2) / folds;

    let d = "";
    for (let f = 0; f < folds; f++) {
      const angle = f * angleStep;
      const nextAngle = (f + 1) * angleStep;
      const midAngle = (angle + nextAngle) / 2;

      // Petal tip
      const outerR = baseR + petalLen;
      const ox = cx + outerR * Math.cos(midAngle);
      const oy = cy + outerR * Math.sin(midAngle);

      // Base points (slightly inset from grid intersections)
      const inset = angleStep * 0.12;
      const sx = cx + baseR * Math.cos(angle + inset);
      const sy = cy + baseR * Math.sin(angle + inset);
      const ex = cx + baseR * Math.cos(nextAngle - inset);
      const ey = cy + baseR * Math.sin(nextAngle - inset);

      // Quadratic bezier petal
      d += `M${sx.toFixed(1)},${sy.toFixed(1)} Q${ox.toFixed(1)},${oy.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)} `;
    }
    paths.push(d);

    // Dots at grid intersections on this ring
    if (hasDots) {
      for (let f = 0; f < folds; f++) {
        const angle = f * angleStep;
        dots.push({
          x: cx + baseR * Math.cos(angle),
          y: cy + baseR * Math.sin(angle),
          r: 2,
        });
        // Dots at petal tips
        const midAngle = (angle + (f + 1) * angleStep) / 2;
        const outerR2 = baseR + petalLen;
        dots.push({
          x: cx + outerR2 * Math.cos(midAngle),
          y: cy + outerR2 * Math.sin(midAngle),
          r: 1.5,
        });
      }
    }

    // Connecting arcs between petal rings
    if (hasConnectors && l < layers) {
      const nextBaseR = 30 + (l + 1) * 38;
      let cd = "";
      for (let f = 0; f < folds; f++) {
        const angle = f * angleStep;
        const r1 = baseR + petalLen * 0.5;
        const r2 = nextBaseR - 10;
        const x1 = cx + r1 * Math.cos(angle);
        const y1 = cy + r1 * Math.sin(angle);
        const x2 = cx + r2 * Math.cos(angle);
        const y2 = cy + r2 * Math.sin(angle);
        cd += `M${x1.toFixed(1)},${y1.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)} `;
      }
      paths.push(cd);
    }
  }

  // Inner star / diamond
  if (hasInnerStar) {
    const innerR = 18 + rand() * 8;
    const outerR = 35 + rand() * 10;
    let d = "";
    for (let f = 0; f < folds; f++) {
      const angle = (f / folds) * Math.PI * 2;
      const midAngle = ((f + 0.5) / folds) * Math.PI * 2;
      const ox = cx + outerR * Math.cos(angle);
      const oy = cy + outerR * Math.sin(angle);
      const ix = cx + innerR * Math.cos(midAngle);
      const iy = cy + innerR * Math.sin(midAngle);
      d += `${f === 0 ? "M" : "L"}${ox.toFixed(1)},${oy.toFixed(1)} L${ix.toFixed(1)},${iy.toFixed(1)} `;
    }
    d += "Z";
    paths.push(d);
  }

  // Outermost circle border
  const outerR = 30 + layers * 38 + 25;
  paths.push(
    `M${cx + outerR},${cy} A${outerR},${outerR} 0 1,1 ${cx - outerR},${cy} A${outerR},${outerR} 0 1,1 ${cx + outerR},${cy}Z`,
  );

  return { paths, dots, folds };
}

export function KolamBackground({
  dateKey,
  className = "",
}: Readonly<{ dateKey: string; className?: string }>) {
  const { paths, dots } = generateKolam(dateKey);

  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {paths.map((d, i) => (
        <path
          key={`p${
            // biome-ignore lint/suspicious/noArrayIndexKey: stable generative output
            i
          }`}
          d={d}
          stroke="currentColor"
          strokeWidth={i === paths.length - 1 ? "0.8" : "1"}
          opacity={i === paths.length - 1 ? 0.15 : 0.2}
        />
      ))}
      {dots.map((dot, i) => (
        <circle
          key={`d${
            // biome-ignore lint/suspicious/noArrayIndexKey: stable generative output
            i
          }`}
          cx={dot.x}
          cy={dot.y}
          r={dot.r}
          fill="currentColor"
          opacity={0.2}
        />
      ))}
    </svg>
  );
}
