import { useRef, useLayoutEffect, useEffect, useState } from "react";
import type { MathRendererProps } from "../types";
import { seededRotation, seededRandom } from "../utils/seededRandom";

export default function MathRenderer({
  latex,
  color,
  fontSize,
  fontFamily,
  lineHeight,
  roughness = 0.3,
  shrinkToLine = false,
}: MathRendererProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [fontScale, setFontScale] = useState(1);
  const [fontsTick, setFontsTick] = useState(0);

  // Ukuran font efektif setelah penskalaan "muat satu baris"
  const effectiveFontSize = fontSize * fontScale;

  // Ukur ulang sekali setelah semua font (termasuk font KaTeX dari CDN) dimuat
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
  }, []);

  useLayoutEffect(() => {
    let isMounted = true;
    let timer: NodeJS.Timeout | null = null;

    /**
     * Jika `shrinkToLine` aktif: ukur tinggi hasil render KaTeX; jika melebihi
     * satu baris, kecilkan font-size secara proporsional. Semua elemen KaTeX
     * berbasis em, sehingga rumus mengecil proporsional dan baseline-nya tetap
     * sejajar dengan baseline teks di baris yang sama.
     */
    const maybeShrink = () => {
      if (!isMounted || !containerRef.current) return;

      if (!shrinkToLine) {
        if (fontScale !== 1) setFontScale(1);
        return;
      }

      const katexEl = containerRef.current.querySelector<HTMLElement>(".katex");
      if (!katexEl) return;

      const height = katexEl.getBoundingClientRect().height;
      if (height <= 0) return;

      // Skala yang dibutuhkan relatif terhadap ukuran penuh — hasilnya tidak
      // bergantung pada fontScale saat ini, jadi konvergen dalam satu langkah.
      const target = lineHeight * 0.94;
      const baseScale = (target / height) * fontScale;
      const next = Math.min(1, Math.max(0.45, baseScale));

      if (Math.abs(next - fontScale) > 0.01) {
        setFontScale(next);
      }
    };

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
        } catch (e) {
          console.warn("KaTeX render error:", e);
          if (containerRef.current) {
            containerRef.current.textContent = latex;
          }
        }
        maybeShrink();
        return true;
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
  }, [
    latex,
    fontFamily,
    effectiveFontSize,
    lineHeight,
    shrinkToLine,
    fontScale,
    fontsTick,
  ]);

  const rotation = seededRotation(`math-rot-${latex}`, roughness * 3.5);
  const scaleVar =
    1 + (seededRandom(`math-scale-${latex}`) - 0.5) * roughness * 0.04;

  const style: React.CSSProperties = {
    color,
    fontSize: `${effectiveFontSize}px`,
    fontFamily,
    // Wrapper "nol-tinggi" (height: 0) dengan overflow visible:
    // - KaTeX yang lebih tinggi dari satu baris (pecahan, akar, matrix) tetap
    //   digambar utuh melewati batas baris, TAPI
    // - tidak ikut menentukan tinggi line box, sehingga baris-baris berikutnya
    //   tidak terdorong turun (offsaid).
    // vertical-align: baseline membuat baseline rumus otomatis sejajar dengan
    // baseline teks di baris yang sama.
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
