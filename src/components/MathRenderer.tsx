import { useRef, useEffect } from "react";
import type { MathRendererProps } from "../types";
import { seededRotation, seededRandom } from "../utils/seededRandom";

export default function MathRenderer({
  latex,
  color,
  fontSize,
  fontFamily,
  lineHeight,
  roughness = 0.3,
}: MathRendererProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.katex && containerRef.current) {
      try {
        window.katex.render(latex, containerRef.current, {
          throwOnError: false,
          displayMode: false,
          strict: false,
          trust: true,
        });
      } catch (e) {
        console.error("KaTeX error:", e);
        if (containerRef.current) {
          containerRef.current.textContent = latex;
        }
      }
    }
  }, [latex, fontFamily, fontSize]);

  const baselineShift = fontSize * 0.12;

  // Gunakan seeded random agar TIDAK berubah setiap render
  const rotation = seededRotation(`math-rot-${latex}`, roughness * 4);
  const scaleVar =
    1 + (seededRandom(`math-scale-${latex}`) - 0.5) * roughness * 0.05;

  const style: React.CSSProperties = {
    color,
    fontSize: `${fontSize}px`,
    fontFamily,
    display: "inline-flex",
    alignItems: "center",
    verticalAlign: "baseline",
    transform: `translateY(${baselineShift}px) rotate(${rotation}deg) scale(${scaleVar})`,
    lineHeight: `${lineHeight}px`,
    height: `${lineHeight}px`,
    position: "relative",
  };

  return (
    <span
      ref={containerRef}
      data-latex={latex}
      className="math-handwritten"
      style={style}
    />
  );
}