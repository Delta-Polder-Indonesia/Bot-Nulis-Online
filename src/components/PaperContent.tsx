import { useMemo, useState, useEffect } from "react";
import MathRenderer from "./MathRenderer";
import ShapeRenderer from "./ShapeRenderer";
import { seededRotation } from "../utils/seededRandom";
import { computeTextVerticalLayout } from "../utils/textVerticalPosition";
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
  textVerticalPosition = "line",
  shrinkMathToLine = true,
  onContentRef,
}: PaperContentProps) {
  // Pecah teks menjadi segments (LaTeX, Shapes, dan Plain Text)
  const segments = useMemo(
    () => text.split(/(\$\$.*?\$\$|\[shape:.*?\])/gs),
    [text]
  );

  // Tick untuk memaksa re-render setelah font web selesai dimuat, agar metrik
  // font (ascent/descent) yang dipakai untuk posisi vertikal akurat.
  const [fontsTick, setFontsTick] = useState(0);
  useEffect(() => {
    let mounted = true;
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (mounted) setFontsTick((t) => t + 1);
      });
    }
    return () => {
      mounted = false;
    };
  }, [fontFamily]);

  // Geser blok tulisan: "line" = duduk di atas garis, "middle" = tengah-tengah.
  // `overflow` adalah ruang ekstra di bawah baris terakhir tiap halaman untuk
  // menampung "kaki" huruf ber-descender (g, j, p, q, y) di mode "line".
  const { offset: verticalOffset, overflow } = useMemo(
    () =>
      computeTextVerticalLayout(textVerticalPosition, fontSize, fontFamily, lineHeight),
    [textVerticalPosition, fontSize, fontFamily, lineHeight, fontsTick]
  );

  const pageHeight = lineCount * lineHeight;

  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        height: `${pageHeight + overflow}px`,
        overflow: "hidden",
      }}
    >
      <div
        ref={pageIndex === 0 ? onContentRef : undefined}
        style={{
          position: "absolute",
          top: `-${pageIndex * pageHeight + overflow}px`,
          left: 0,
          right: 0,
          paddingLeft: `${paddingLeft}px`,
          paddingRight: "40px",
          fontFamily,
          fontSize: `${fontSize}px`,
          lineHeight: `${lineHeight}px`,
          color: inkColor,
          transform: `translateY(${verticalOffset}px)`,
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
                  shrinkToLine={shrinkMathToLine}
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
