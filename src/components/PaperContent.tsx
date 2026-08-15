import { useMemo } from "react";
import MathRenderer from "./MathRenderer";
import ShapeRenderer from "./ShapeRenderer";
import { seededRotation } from "../utils/seededRandom";
import type { PaperContentProps } from "../types";

export default function PaperContent({
  text,
  pageIndex,
  lineCount,
  paddingLeft,
  fontFamily,
  fontSize,
  lineHeight,
  inkColor,
  handwritingRoughness,
  onContentRef,
}: PaperContentProps) {
  // Pecah teks menjadi segments (LaTeX, Shapes, dan Plain Text)
  const segments = useMemo(
    () => text.split(/(\$\$.*?\$\$|\[shape:.*?\])/gs),
    [text]
  );

  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        height: `${lineCount * lineHeight}px`,
        overflow: "hidden",
      }}
    >
      <div
        ref={pageIndex === 0 ? onContentRef : undefined}
        style={{
          position: "absolute",
          top: `-${pageIndex * (lineCount * lineHeight)}px`,
          left: 0,
          right: 0,
          paddingLeft: `${paddingLeft}px`,
          paddingRight: "40px",
          fontFamily,
          fontSize: `${fontSize}px`,
          lineHeight: `${lineHeight}px`,
          color: inkColor,
        }}
      >
        <div
          style={{
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            wordBreak: "break-word",
            lineHeight: `${lineHeight}px`,
          }}
        >
          {segments.map((part, i) => {
            // 1. Render Rumus LaTeX
            if (part.startsWith("$$") && part.endsWith("$$")) {
              const latexCode = part.slice(2, -2).trim();
              return (
                <MathRenderer
                  key={`math-${i}-${latexCode}`}
                  latex={latexCode}
                  color={inkColor}
                  fontSize={fontSize}
                  fontFamily={fontFamily}
                  lineHeight={lineHeight}
                  roughness={handwritingRoughness}
                />
              );
            }

            // 2. Render Bentuk Geometri
            if (part.startsWith("[shape:") && part.endsWith("]")) {
              const shapeType = part.slice(7, -1).trim();
              return (
                <ShapeRenderer
                  key={`shape-${i}-${shapeType}`}
                  type={shapeType}
                  color={inkColor}
                  size={lineHeight * 1.15}
                  lineHeight={lineHeight}
                  roughness={handwritingRoughness * 2.5}
                />
              );
            }

            // 3. Render Teks Biasa dengan seeded jitter rotation
            const rotation = seededRotation(
              `text-seg-${i}-${part.slice(0, 10)}`,
              handwritingRoughness * 1.8
            );

            return (
              <span
                key={`text-${i}`}
                style={{
                  fontFamily,
                  fontSize: `${fontSize}px`,
                  lineHeight: `${lineHeight}px`,
                  color: inkColor,
                  verticalAlign: "baseline",
                  display: "inline",
                  transform:
                    handwritingRoughness > 0
                      ? `rotate(${rotation}deg)`
                      : undefined,
                }}
              >
                {part}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
