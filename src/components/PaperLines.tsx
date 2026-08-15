import { memo } from "react";
import { PAPER_WIDTH, PAPER_HEIGHT } from "../constants";
import type { PaperLinesProps } from "../types";

const PaperLines = memo(function PaperLines({
  lineCount,
  marginTop,
  marginBottom,
  paddingLeft,
  lineHeight,
  lineColor,
  showMarginLine,
  paperPattern = "folio",
}: PaperLinesProps) {
  if (paperPattern === "blank") {
    return null;
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      {/* Garis Margin Kiri (Garis Merah Ganda) */}
      {showMarginLine && (
        <>
          <line
            x1={paddingLeft - 20}
            y1="0"
            x2={paddingLeft - 20}
            y2={PAPER_HEIGHT}
            stroke="#b93b6e"
            strokeWidth="1.5"
            opacity="0.85"
          />
          <line
            x1={paddingLeft - 24}
            y1="0"
            x2={paddingLeft - 24}
            y2={PAPER_HEIGHT}
            stroke="#b93b6e"
            strokeWidth="0.8"
            opacity="0.65"
          />
        </>
      )}

      {/* Garis Header Merah Atas */}
      <line
        x1="0"
        y1={marginTop}
        x2={PAPER_WIDTH}
        y2={marginTop}
        stroke="#b93b6e"
        strokeWidth="1.5"
        opacity="0.85"
      />
      <line
        x1="0"
        y1={marginTop - 4}
        x2={PAPER_WIDTH}
        y2={marginTop - 4}
        stroke="#b93b6e"
        strokeWidth="0.8"
        opacity="0.65"
      />

      {/* Tick marks header */}
      {Array.from({ length: 16 }).map((_, i) => (
        <line
          key={`tick-${i}`}
          x1={paddingLeft + 20 + i * 36}
          y1={marginTop - 6}
          x2={paddingLeft + 20 + i * 36}
          y2={marginTop}
          stroke="#b93b6e"
          strokeWidth="1"
          opacity="0.6"
        />
      ))}

      {/* Garis Horizontal Folio */}
      {Array.from({ length: lineCount }).map((_, i) => {
        const y = marginTop + (i + 1) * lineHeight;
        if (y > PAPER_HEIGHT - marginBottom) return null;
        return (
          <line
            key={`hline-${i}`}
            x1="0"
            y1={y}
            x2={PAPER_WIDTH}
            y2={y}
            stroke={lineColor}
            strokeWidth="1"
            opacity="0.5"
          />
        );
      })}

      {/* Garis Vertikal Tambahan Jika Pattern Grid (Kertas Kotak-kotak) */}
      {paperPattern === "grid" &&
        Array.from({ length: Math.floor((PAPER_WIDTH - paddingLeft) / lineHeight) }).map((_, i) => {
          const x = paddingLeft + (i + 1) * lineHeight;
          return (
            <line
              key={`vline-${i}`}
              x1={x}
              y1={marginTop}
              x2={x}
              y2={PAPER_HEIGHT - marginBottom}
              stroke={lineColor}
              strokeWidth="0.8"
              opacity="0.35"
            />
          );
        })}

      {/* Kotak Page/Date + Logo Saraswati Khas Kertas Folio */}
      <g
        transform={`translate(${PAPER_WIDTH - 220}, 28)`}
        stroke="#b93b6e"
        opacity="0.85"
      >
        <rect x="0" y="0" width="180" height="50" rx="2" fill="none" strokeWidth="1" />
        <line x1="0" y1="25" x2="120" y2="25" strokeWidth="1" />
        <line x1="120" y1="0" x2="120" y2="50" strokeWidth="1" />

        <text x="6" y="16" fontSize="10" fill="#b93b6e" stroke="none" fontFamily="sans-serif" fontWeight="bold">
          Page No.
        </text>
        <line x1="56" y1="16" x2="115" y2="16" stroke="#b93b6e" strokeWidth="0.6" strokeDasharray="2 2" />

        <text x="6" y="41" fontSize="10" fill="#b93b6e" stroke="none" fontFamily="sans-serif" fontWeight="bold">
          Date
        </text>
        <line x1="36" y1="41" x2="115" y2="41" stroke="#b93b6e" strokeWidth="0.6" strokeDasharray="2 2" />

        <g transform="translate(150, 25)">
          <text
            x="0"
            y="5"
            fontSize="30"
            fill="#b93b6e"
            stroke="none"
            fontFamily="serif"
            fontWeight="bold"
            textAnchor="middle"
            opacity="0.75"
          >
            A
          </text>
          <text
            x="-8"
            y="5"
            fontSize="30"
            fill="#b93b6e"
            stroke="none"
            fontFamily="serif"
            fontWeight="bold"
            textAnchor="middle"
            opacity="0.5"
          >
            A
          </text>
          <rect x="-20" y="-18" width="40" height="34" fill="none" strokeWidth="1" />
          <text
            x="0"
            y="22"
            fontSize="5"
            fill="#b93b6e"
            stroke="none"
            fontFamily="sans-serif"
            fontWeight="bold"
            textAnchor="middle"
            letterSpacing="0.2"
          >
            SARASWATI
          </text>
        </g>
      </g>
    </svg>
  );
});

export default PaperLines;
