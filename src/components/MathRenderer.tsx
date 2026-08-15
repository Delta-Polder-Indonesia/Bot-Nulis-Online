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

  const rotation = seededRotation(`math-rot-${latex}`, roughness * 3.5);
  const scaleVar =
    1 + (seededRandom(`math-scale-${latex}`) - 0.5) * roughness * 0.04;

  const style: React.CSSProperties = {
    color,
    fontSize: `${fontSize}px`,
    fontFamily,
    // Wrapper "nol-tinggi" (height: 0) dengan overflow visible:
    // - KaTeX yang lebih tinggi dari satu baris (pecahan, akar, matrix) tetap
    //   digambar utuh melewati batas baris, TAPI
    // - tidak ikut menentukan tinggi line box, sehingga baris-baris berikutnya
    //   tidak terdorong turun (offsaid) seperti sebelumnya.
    // vertical-align: baseline membuat baseline rumus otomatis sejajar dengan
    // baseline teks di baris yang sama (baseline internal wrapper dihitung dari
    // line-height & font-size yang sama dengan blok teks).
    display: "inline-block",
    height: 0,
    overflow: "visible",
    verticalAlign: "baseline",
    lineHeight: `${lineHeight}px`,
    transform: `rotate(${rotation}deg) scale(${scaleVar})`,
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
