import type { TextVerticalPosition } from "../types";

interface FontMetrics {
  ascent: number;
  descent: number;
}

/**
 * Mengukur metrik font (tinggi ascender & descender sebenarnya) menggunakan Canvas.
 * Dipakai agar posisi "duduk di garis" / "tengah-tengah" presisi untuk setiap font,
 * karena tiap font memiliki tinggi ascender/descender yang berbeda.
 */
export function measureFontMetrics(
  fontSize: number,
  fontFamily: string
): FontMetrics {
  if (typeof document === "undefined") {
    return { ascent: fontSize * 0.8, descent: fontSize * 0.2 };
  }

  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return { ascent: fontSize * 0.8, descent: fontSize * 0.2 };
    }

    const safeFamily = fontFamily.includes(" ")
      ? `"${fontFamily}"`
      : fontFamily;
    ctx.font = `${fontSize}px ${safeFamily}, cursive, sans-serif`;

    // Probe berisi huruf ber-ascender tinggi & ber-descender dalam agar metrik
    // yang diukur mewakili font secara keseluruhan.
    const probe = "MHgjpqyQW0123456789";
    const metrics = ctx.measureText(probe);

    const ascent = Math.abs(metrics.actualBoundingBoxAscent) || fontSize * 0.8;
    const descent =
      Math.abs(metrics.actualBoundingBoxDescent) || fontSize * 0.2;

    return { ascent, descent };
  } catch {
    return { ascent: fontSize * 0.8, descent: fontSize * 0.2 };
  }
}

export interface TextVerticalLayout {
  /** Pergeseran vertikal (translateY) blok tulisan dalam px. */
  offset: number;
  /**
   * Ruang ekstra (px) di bawah baris terakhir tiap halaman untuk menampung
   * "kaki" huruf ber-descender (g, j, p, q, y) yang turun melewati garis.
   */
  overflow: number;
}

/**
 * Menghitung tata letak vertikal tulisan terhadap garis-garis kertas:
 * - "line"   : garis dasar (baseline) huruf duduk tepat di atas garis kertas,
 *              sehingga badan huruf (a, m, n, x, dst.) menempel di garis dan
 *              huruf ber-ekor (g, j, p, q, y) turun sedikit melewati garis —
 *              persis seperti tulisan tangan di kertas folio sungguhan.
 * - "middle" : tulisan berada tepat di tengah-tengah jarak antar garis.
 *
 * Setiap baris teks berada dalam "line box" setinggi `lineHeight`, dan secara
 * default (CSS half-leading) isi baris sudah terpusat di dalam box tersebut.
 */
export function computeTextVerticalLayout(
  position: TextVerticalPosition | undefined,
  fontSize: number,
  fontFamily: string,
  lineHeight: number
): TextVerticalLayout {
  if (position !== "line" && position !== "middle") {
    return { offset: 0, overflow: 0 };
  }

  const { ascent, descent } = measureFontMetrics(fontSize, fontFamily);
  const contentArea = ascent + descent;

  // Kasus ekstrem: tinggi glyph melebihi tinggi baris (mis. font 28px di baris
  // 24px). Biarkan seperti perilaku default agar tidak memotong ascender.
  if (contentArea > lineHeight) {
    return { offset: 0, overflow: 0 };
  }

  const halfLeading = Math.max(0, (lineHeight - contentArea) / 2);
  const baselineFromTop = halfLeading + ascent;

  let offset: number;
  if (position === "line") {
    // Turunkan blok agar baseline tepat berada di garis bawah line box.
    offset = lineHeight - baselineFromTop;
  } else {
    // Pusatkan blok glyph (ascender..descender) di tengah line box.
    offset = lineHeight / 2 - baselineFromTop - (descent - ascent) / 2;
  }

  // Amankan agar tidak keluar dari line box dalam kasus ekstrem.
  const clamped = Math.max(
    -lineHeight * 0.5,
    Math.min(lineHeight * 0.5, offset)
  );

  // Seberapa jauh "kaki" huruf terakhir menjorok di bawah garis bawah line box
  // (hanya terjadi pada mode "line" karena descender turun melewati garis).
  const glyphBottom = clamped + baselineFromTop + descent;
  const overflow =
    position === "line" ? Math.max(0, glyphBottom - lineHeight) : 0;

  return {
    offset: Math.round(clamped * 10) / 10,
    overflow: Math.ceil(overflow),
  };
}
