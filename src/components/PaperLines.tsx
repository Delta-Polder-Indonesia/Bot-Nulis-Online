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
}: PaperLinesProps) {
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
      {/* Garis Margin Kiri */}
      {showMarginLine && (
        <>
          <line
            x1={paddingLeft - 20}
            y1="0"
            x2={paddingLeft - 20}
            y2={PAPER_HEIGHT}
            stroke="#b93b6e"
            strokeWidth="1.5"
            opacity="0.8"
          />
          <line
            x1={paddingLeft - 24}
            y1="0"
            x2={paddingLeft - 24}
            y2={PAPER_HEIGHT}
            stroke="#b93b6e"
            strokeWidth="0.8"
            opacity="0.6"
          />
        </>
      )}

      {/* Garis Header Merah */}
      <line
        x1="0"
        y1={marginTop}
        x2={PAPER_WIDTH}
        y2={marginTop}
        stroke="#b93b6e"
        strokeWidth="1.5"
        opacity="0.8"
      />
      <line
        x1="0"
        y1={marginTop - 4}
        x2={PAPER_WIDTH}
        y2={marginTop - 4}
        stroke="#b93b6e"
        strokeWidth="0.8"
        opacity="0.6"
      />

      {/* Tick marks header */}
      {Array.from({ length: 15 }).map((_, i) => (
        <line
          key={`tick-${i}`}
          x1={paddingLeft + 30 + i * 40}
          y1={marginTop - 6}
          x2={paddingLeft + 30 + i * 40}
          y2={marginTop}
          stroke="#b93b6e"
          strokeWidth="1"
          opacity="0.6"
        />
      ))}

      {/* Garis Horizontal */}
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

      {/* Kotak Page/Date + Logo Saraswati */}
      <g
        transform={`translate(${PAPER_WIDTH - 220}, 30)`}
        stroke="#b93b6e"
        opacity="0.8"
      >
        <rect x="0" y="0" width="180" height="50" fill="none" strokeWidth="1" />
        <line x1="0" y1="25" x2="120" y2="25" strokeWidth="1" />
        <line x1="120" y1="0" x2="120" y2="50" strokeWidth="1" />

        <text x="5" y="16" fontSize="10" fill="#b93b6e" stroke="none" fontFamily="sans-serif">
          Page No.
        </text>
        <line x1="55" y1="16" x2="115" y2="16" stroke="#b93b6e" strokeWidth="0.5" strokeDasharray="1 2" />

        <text x="5" y="41" fontSize="10" fill="#b93b6e" stroke="none" fontFamily="sans-serif">
          Date
        </text>
        <line x1="35" y1="41" x2="115" y2="41" stroke="#b93b6e" strokeWidth="0.5" strokeDasharray="1 2" />

        <g transform="translate(150, 25)">
          <text x="0" y="5" fontSize="30" fill="#b93b6e" stroke="none"
                fontFamily="serif" fontWeight="bold" textAnchor="middle" opacity="0.7">
            A
          </text>
          <text x="-8" y="5" fontSize="30" fill="#b93b6e" stroke="none"
                fontFamily="serif" fontWeight="bold" textAnchor="middle" opacity="0.5">
            A
          </text>
          <rect x="-20" y="-18" width="40" height="34" fill="none" strokeWidth="1" />
          <text x="0" y="22" fontSize="5" fill="#b93b6e" stroke="none"
                fontFamily="sans-serif" fontWeight="bold" textAnchor="middle" letterSpacing="0.2">
            SARASWATI
          </text>
        </g>
      </g>
    </svg>
  );
});

export default PaperLines;