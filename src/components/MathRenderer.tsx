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
    let isMounted = true;
    let timer: NodeJS.Timeout | null = null;

    const renderKatex = () => {
      if (!isMounted || !containerRef.current) return false;

      if (window.katex) {
        try {
          window.katex.render(latex, containerRef.current, {
            throwOnError: false,
            displayMode: false,
            strict: false,
            trust: true,
          });
          return true;
        } catch (e) {
          console.warn("KaTeX render error:", e);
          if (containerRef.current) {
            containerRef.current.textContent = latex;
          }
          return true;
        }
      }
      return false;
    };

    if (!renderKatex()) {
      if (containerRef.current) {
        containerRef.current.textContent = latex;
      }
      // Poll sampai KaTeX script CDN selesai dimuat
      timer = setInterval(() => {
        if (renderKatex() && timer) {
          clearInterval(timer);
        }
      }, 100);
    }

    return () => {
      isMounted = false;
      if (timer) clearInterval(timer);
    };
  }, [latex, fontFamily, fontSize]);

  const baselineShift = fontSize * 0.1;
  const rotation = seededRotation(`math-rot-${latex}`, roughness * 3.5);
  const scaleVar = 1 + (seededRandom(`math-scale-${latex}`) - 0.5) * roughness * 0.04;

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
      className="math-handwritten select-none"
      style={style}
    />
  );
}
