"use client";

import { useState } from "react";
import type { Kural } from "@/lib/kuralOfDay";

type Props = Readonly<{
  kural: Kural;
  dateKey: string;
  palInfo: { name: string; nameEnglish: string };
  chapter: { tamil: string; english: string };
}>;

// Color schemes per section
const COLORS = {
  Virtue: { border: "#047857", bg: "#064e3b", text: "#6ee7b7" },
  Wealth: { border: "#1d4ed8", bg: "#1e3a8a", text: "#93c5fd" },
  Love: { border: "#db2777", bg: "#831843", text: "#f9a8d4" },
};

/** Draw a rounded rectangle path */
function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/** Draw a pill-shaped badge */
function drawBadge(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  colors: { border: string; bg: string; text: string },
) {
  ctx.font = "500 20px system-ui, sans-serif";
  const metrics = ctx.measureText(text);
  const padX = 24;
  const padY = 14;
  const w = metrics.width + padX * 2;
  const h = 20 + padY * 2;
  const x = cx - w / 2;
  const y = cy - h / 2;

  roundedRect(ctx, x, y, w, h, h / 2);
  ctx.fillStyle = colors.bg;
  ctx.fill();
  ctx.strokeStyle = colors.border;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = colors.text;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, cx, cy);
}

/** Wrap text into multiple lines */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = word;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
  return currentY + lineHeight;
}

/** Draw corner accent (L-shaped bracket) */
function drawCorner(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  dx: number,
  dy: number,
  len: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + dx * len, y);
  ctx.lineTo(x, y);
  ctx.lineTo(x, y + dy * len);
  ctx.strokeStyle = "#f59e0b";
  ctx.lineWidth = 4;
  ctx.stroke();
}

/** Generate the kural image on a canvas and return as Blob */
async function generateKuralImage(
  kural: Kural,
  dateKey: string,
  palInfo: { name: string; nameEnglish: string },
  chapter: { tamil: string; english: string },
): Promise<Blob> {
  const W = 1080;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  const palColor = COLORS[palInfo.nameEnglish as keyof typeof COLORS];
  const pad = 64; // outer padding
  const cardPad = 60; // inner card padding
  const cardX = pad;
  const cardW = W - pad * 2;

  // --- First pass: measure height ---
  let cursorY = pad + 24; // start below corner accent

  // Card top
  const cardTop = cursorY;
  cursorY += cardPad; // card inner padding top

  // Title
  ctx.font = "bold 36px system-ui, sans-serif";
  cursorY += 36 + 16; // title + gap

  // Date
  ctx.font = "20px system-ui, sans-serif";
  cursorY += 20 + 32; // date + gap

  // Badges row
  cursorY += 48 + 24; // badge height + gap

  // Top ornament
  cursorY += 24 + 24; // ornament + gap

  // Kural text (2 lines)
  ctx.font = "bold 44px system-ui, sans-serif";
  cursorY += 44 + 16 + 44 + 32; // line1 + gap + line2 + gap

  // Divider
  cursorY += 1 + 32; // line + gap

  // Tamil meaning (estimate wrapped lines)
  const mkText = kural.mk || "";
  if (mkText) {
    ctx.font = "24px system-ui, sans-serif";
    const mkMaxWidth = cardW - cardPad * 2;
    const mkWords = mkText.split(" ");
    let mkLine = "";
    let mkLines = 1;
    for (const word of mkWords) {
      const testLine = mkLine ? `${mkLine} ${word}` : word;
      if (ctx.measureText(testLine).width > mkMaxWidth && mkLine) {
        mkLines++;
        mkLine = word;
      } else {
        mkLine = testLine;
      }
    }
    cursorY += mkLines * 36 + 24; // lines + gap
  }

  // English translation (estimate wrapped lines)
  const enText = kural.english_mk_translation || "";
  if (enText) {
    ctx.font = "italic 24px system-ui, sans-serif";
    const enMaxWidth = cardW - cardPad * 2;
    const enFullText = `\u201C${enText}\u201D`;
    const enWords = enFullText.split(" ");
    let enLine = "";
    let enLines = 1;
    for (const word of enWords) {
      const testLine = enLine ? `${enLine} ${word}` : word;
      if (ctx.measureText(testLine).width > enMaxWidth && enLine) {
        enLines++;
        enLine = word;
      } else {
        enLine = testLine;
      }
    }
    cursorY += enLines * 36 + 24; // lines + gap
  }

  // Bottom ornament
  cursorY += 24 + 32; // ornament + gap

  // Footer
  cursorY += 20 + cardPad; // footer text + card inner padding bottom

  const cardBottom = cursorY;
  const cardH = cardBottom - cardTop;
  const H = cardBottom + pad + 24; // bottom corner accent space

  // Set canvas size
  canvas.width = W;
  canvas.height = H;

  // --- Second pass: draw ---

  // Background
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, W, H);

  // Corner accents
  const cornerLen = 48;
  const cornerInset = pad - 16;
  drawCorner(ctx, cornerInset, cornerInset, 1, 1, cornerLen);
  drawCorner(ctx, W - cornerInset, cornerInset, -1, 1, cornerLen);
  drawCorner(ctx, cornerInset, H - cornerInset, 1, -1, cornerLen);
  drawCorner(ctx, W - cornerInset, H - cornerInset, -1, -1, cornerLen);

  // Card background
  roundedRect(ctx, cardX, cardTop, cardW, cardH, 24);
  ctx.fillStyle = "#09090b";
  ctx.fill();
  ctx.strokeStyle = "#27272a";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Reset cursor for drawing
  let y = cardTop + cardPad;

  // Title
  ctx.font = "bold 36px system-ui, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("Thirukkural of the Day", W / 2, y);
  y += 36 + 16;

  // Date
  ctx.font = "20px system-ui, sans-serif";
  ctx.fillStyle = "#9ca3af";
  ctx.fillText(dateKey, W / 2, y);
  y += 20 + 32;

  // Badges
  const badgeCenterY = y + 24;
  drawBadge(ctx, `பால்: ${palInfo.name}`, W * 0.22, badgeCenterY, palColor);

  ctx.font = "500 24px system-ui, sans-serif";
  ctx.fillStyle = "#a1a1aa";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`Kural #${kural.Number}`, W / 2, badgeCenterY);

  drawBadge(ctx, chapter.tamil, W * 0.78, badgeCenterY, palColor);
  y += 48 + 24;

  // Top ornament
  const ornY = y + 12;
  ctx.strokeStyle = "#b45309";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 72, ornY);
  ctx.lineTo(W / 2 - 16, ornY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(W / 2 + 16, ornY);
  ctx.lineTo(W / 2 + 72, ornY);
  ctx.stroke();
  ctx.font = "24px system-ui, sans-serif";
  ctx.fillStyle = "#d97706";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("✦", W / 2, ornY);
  y += 24 + 24;

  // Kural text
  ctx.font = "bold 44px system-ui, sans-serif";
  ctx.fillStyle = "#fbbf24";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(kural.Line1, W / 2, y);
  y += 44 + 16;
  ctx.fillText(kural.Line2, W / 2, y);
  y += 44 + 32;

  // Divider
  const gradient = ctx.createLinearGradient(cardX + cardPad, 0, cardX + cardW - cardPad, 0);
  gradient.addColorStop(0, "transparent");
  gradient.addColorStop(0.5, "#b45309");
  gradient.addColorStop(1, "transparent");
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cardX + cardPad, y);
  ctx.lineTo(cardX + cardW - cardPad, y);
  ctx.stroke();
  y += 1 + 32;

  // Tamil meaning
  if (kural.mk) {
    ctx.font = "24px system-ui, sans-serif";
    ctx.fillStyle = "#d4d4d8";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    y = wrapText(
      ctx,
      kural.mk,
      cardX + cardPad,
      y,
      cardW - cardPad * 2,
      36,
    );
    y += 24;
  }

  // English translation
  if (kural.english_mk_translation) {
    ctx.font = "italic 24px system-ui, sans-serif";
    ctx.fillStyle = "#a1a1aa";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    y = wrapText(
      ctx,
      `\u201C${kural.english_mk_translation}\u201D`,
      cardX + cardPad,
      y,
      cardW - cardPad * 2,
      36,
    );
    y += 24;
  }

  // Bottom ornament
  const ornY2 = y + 12;
  ctx.strokeStyle = "#b45309";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 72, ornY2);
  ctx.lineTo(W / 2 - 16, ornY2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(W / 2 + 16, ornY2);
  ctx.lineTo(W / 2 + 72, ornY2);
  ctx.stroke();
  ctx.font = "24px system-ui, sans-serif";
  ctx.fillStyle = "#d97706";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("✦", W / 2, ornY2);
  y += 24 + 32;

  // Footer
  ctx.font = "20px system-ui, sans-serif";
  ctx.fillStyle = "#6b7280";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("thirukural-a-day.com", W / 2, y);

  // Export as blob
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to generate image"));
      },
      "image/png",
    );
  });
}

export default function ShareAsImage({
  kural,
  dateKey,
  palInfo,
  chapter,
}: Props) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleShareAsImage = async () => {
    setIsGenerating(true);
    try {
      const blob = await generateKuralImage(kural, dateKey, palInfo, chapter);
      const file = new File([blob], `thirukkural-${kural.Number}.png`, {
        type: "image/png",
      });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Thirukkural #${kural.Number}`,
          text: `${kural.Line1}\n${kural.Line2}`,
        });
      } else {
        // Fallback: download
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `thirukkural-${kural.Number}.png`;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      // User cancelled share or error occurred
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShareAsImage}
      disabled={isGenerating}
      className="text-sm text-purple-600 hover:underline disabled:opacity-50 dark:text-purple-400"
    >
      {isGenerating ? "Generating..." : "Share as Image"}
    </button>
  );
}
