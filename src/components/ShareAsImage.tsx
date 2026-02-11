"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import type { Kural } from "@/lib/kuralOfDay";

type Props = Readonly<{
  kural: Kural;
  dateKey: string;
  palInfo: { name: string; nameEnglish: string };
  chapter: { tamil: string; english: string };
}>;

export default function ShareAsImage({
  kural,
  dateKey,
  palInfo,
  chapter,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleShareAsImage = async () => {
    if (!cardRef.current) return;

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: "#000000",
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      canvas.toBlob((blob) => {
        if (!blob) return;

        const file = new File([blob], `thirukkural-${kural.Number}.png`, {
          type: "image/png",
        });

        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          navigator
            .share({
              files: [file],
              title: `Thirukkural #${kural.Number}`,
              text: `${kural.Line1}\n${kural.Line2}`,
            })
            .catch(() => {
              // User cancelled, ignore
            });
        } else {
          // Fallback: download the image
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `thirukkural-${kural.Number}.png`;
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Color schemes
  const colors = {
    Virtue: {
      border: "#047857",
      bg: "#064e3b",
      text: "#6ee7b7",
    },
    Wealth: {
      border: "#1d4ed8",
      bg: "#1e3a8a",
      text: "#93c5fd",
    },
    Love: {
      border: "#db2777",
      bg: "#831843",
      text: "#f9a8d4",
    },
  };

  const palColor = colors[palInfo.nameEnglish as keyof typeof colors];

  return (
    <>
      <button
        type="button"
        onClick={handleShareAsImage}
        disabled={isGenerating}
        className="text-sm text-purple-600 hover:underline disabled:opacity-50 dark:text-purple-400"
      >
        {isGenerating ? "Generating..." : "Share as Image"}
      </button>

      {/* Hidden card for image generation */}
      <div style={{ position: "fixed", left: "-9999px", top: 0 }}>
        <div
          ref={cardRef}
          style={{
            position: "relative",
            width: "1080px",
            backgroundColor: "#000000",
            padding: "64px",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {/* Decorative corner accents */}
          <div
            style={{
              position: "absolute",
              top: "48px",
              left: "48px",
              width: "48px",
              height: "48px",
              borderTopLeftRadius: "6px",
              borderTop: "4px solid #f59e0b",
              borderLeft: "4px solid #f59e0b",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "48px",
              right: "48px",
              width: "48px",
              height: "48px",
              borderTopRightRadius: "6px",
              borderTop: "4px solid #f59e0b",
              borderRight: "4px solid #f59e0b",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "48px",
              left: "48px",
              width: "48px",
              height: "48px",
              borderBottomLeftRadius: "6px",
              borderBottom: "4px solid #f59e0b",
              borderLeft: "4px solid #f59e0b",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "48px",
              right: "48px",
              width: "48px",
              height: "48px",
              borderBottomRightRadius: "6px",
              borderBottom: "4px solid #f59e0b",
              borderRight: "4px solid #f59e0b",
            }}
          />

          {/* Content */}
          <div
            style={{
              borderRadius: "24px",
              border: "2px solid #27272a",
              backgroundColor: "#09090b",
              padding: "80px",
            }}
          >
            {/* Header */}
            <div style={{ marginBottom: "48px", textAlign: "center" }}>
              <h1
                style={{
                  fontSize: "36px",
                  fontWeight: "bold",
                  color: "#ffffff",
                }}
              >
                Thirukkural of the Day
              </h1>
              <p
                style={{
                  marginTop: "12px",
                  fontSize: "20px",
                  color: "#9ca3af",
                }}
              >
                {dateKey}
              </p>
            </div>

            {/* Badges */}
            <div
              style={{
                marginBottom: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: "9999px",
                  border: `2px solid ${palColor.border}`,
                  backgroundColor: palColor.bg,
                  color: palColor.text,
                  padding: "12px 24px",
                  fontSize: "18px",
                  fontWeight: "500",
                }}
              >
                பால்: {palInfo.name}
              </span>

              <span
                style={{
                  fontSize: "24px",
                  fontWeight: "500",
                  color: "#a1a1aa",
                }}
              >
                Kural #{kural.Number}
              </span>

              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: "9999px",
                  border: `2px solid ${palColor.border}`,
                  backgroundColor: palColor.bg,
                  color: palColor.text,
                  padding: "12px 24px",
                  fontSize: "18px",
                  fontWeight: "500",
                }}
              >
                {chapter.tamil}
              </span>
            </div>

            {/* Top ornament */}
            <div
              style={{
                marginBottom: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                color: "#d97706",
              }}
            >
              <div
                style={{
                  height: "1px",
                  width: "96px",
                  backgroundColor: "#b45309",
                }}
              />
              <span style={{ fontSize: "24px" }}>✦</span>
              <div
                style={{
                  height: "1px",
                  width: "96px",
                  backgroundColor: "#b45309",
                }}
              />
            </div>

            {/* Kural text */}
            <div style={{ marginBottom: "32px", textAlign: "center" }}>
              <p
                style={{
                  fontSize: "48px",
                  lineHeight: "1.5",
                  color: "#fbbf24",
                }}
              >
                {kural.Line1}
              </p>
              <p
                style={{
                  marginTop: "16px",
                  fontSize: "48px",
                  lineHeight: "1.5",
                  color: "#fbbf24",
                }}
              >
                {kural.Line2}
              </p>
            </div>

            {/* Divider */}
            <div
              style={{
                margin: "40px 0",
                height: "1px",
                background:
                  "linear-gradient(to right, transparent, #b45309, transparent)",
              }}
            />

            {/* Tamil meaning */}
            {kural.mk && (
              <p
                style={{
                  marginBottom: "24px",
                  fontSize: "24px",
                  lineHeight: "1.5",
                  color: "#d4d4d8",
                }}
              >
                {kural.mk}
              </p>
            )}

            {/* English translation */}
            {kural.english_mk_translation && (
              <p
                style={{
                  fontSize: "24px",
                  lineHeight: "1.5",
                  fontStyle: "italic",
                  color: "#a1a1aa",
                }}
              >
                &ldquo;{kural.english_mk_translation}&rdquo;
              </p>
            )}

            {/* Bottom ornament */}
            <div
              style={{
                marginTop: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                color: "#d97706",
              }}
            >
              <div
                style={{
                  height: "1px",
                  width: "96px",
                  backgroundColor: "#b45309",
                }}
              />
              <span style={{ fontSize: "24px" }}>✦</span>
              <div
                style={{
                  height: "1px",
                  width: "96px",
                  backgroundColor: "#b45309",
                }}
              />
            </div>

            {/* Footer */}
            <div
              style={{
                marginTop: "48px",
                textAlign: "center",
                fontSize: "20px",
                color: "#6b7280",
              }}
            >
              thirukural-a-day.com
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
