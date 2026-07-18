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
  // Pecah teks menjadi segments — di-memo agar tidak re-split setiap render
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
            lineHeight: `${lineHeight}px`,
          }}
        >
          {segments.map((part, i) => {
            // Render LaTeX
            if (part.startsWith("$$") && part.endsWith("$$")) {
              return (
                <MathRenderer
                  key={`math-${i}`}
                  latex={part.slice(2, -2)}
                  color={inkColor}
                  fontSize={fontSize}
                  fontFamily={fontFamily}
                  lineHeight={lineHeight}
                  roughness={handwritingRoughness}
                />
              );
            }

            // Render Shape
            if (part.startsWith("[shape:") && part.endsWith("]")) {
              return (
                <ShapeRenderer
                  key={`shape-${i}`}
                  type={part.slice(7, -1)}
                  color={inkColor}
                  size={lineHeight * 1.2}
                  lineHeight={lineHeight}
                  roughness={handwritingRoughness * 3}
                />
              );
            }

            // Render teks biasa dengan rotasi seeded
            const rotation = seededRotation(
              `text-seg-${i}-${part.slice(0, 8)}`,
              handwritingRoughness * 2
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
                  // Rotasi kecil untuk efek tidak rapi
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