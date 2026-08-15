import type { Preset } from "../types";

export const PAPER_WIDTH = 794;
export const PAPER_HEIGHT = 1224;
export const LINE_HEIGHT_DEFAULT = 32;
export const MARGIN_TOP_DEFAULT = 110;
export const MARGIN_LEFT_DEFAULT = 140;

// Font utama yang ditampilkan sebagai tombol grid
export const FONT_OPTIONS = [
  "Kalam",
  "Caveat",
  "Indie Flower",
  "Patrick Hand",
  "Shadows Into Light",
  "Coming Soon",
];

// Font tambahan dalam select/dropdown
export const FONT_OPTIONS_EXTRA = [
  {
    group: "Handwriting Klasik",
    fonts: [
      "Dancing Script",
      "Great Vibes",
      "Pacifico",
      "Sacramento",
      "Satisfy",
      "Marck Script",
      "Cookie",
      "Tangerine",
    ],
  },
  {
    group: "Tulisan Tangan Kasual",
    fonts: [
      "Architects Daughter",
      "Reenie Beanie",
      "Rock Salt",
      "Homemade Apple",
      "Just Another Hand",
      "Waiting for the Sunrise",
      "Covered By Your Grace",
      "Cedarville Cursive",
      "La Belle Aurore",
      "Give You Glory",
    ],
  },
  {
    group: "Catatan & Papan Tulis",
    fonts: [
      "Permanent Marker",
      "Handlee",
      "Schoolbell",
      "Short Stack",
      "Nothing You Could Do",
      "Annie Use Your Telescope",
      "Amatic SC",
      "Gloria Hallelujah",
      "Neucha",
      "Sue Ellen Francisco",
    ],
  },
  {
    group: "Kursif Elegan",
    fonts: [
      "Alex Brush",
      "Allura",
      "Parisienne",
      "Courgette",
      "Italianno",
      "Damion",
      "Mr Dafoe",
      "Ruthie",
      "Monsieur La Doulaise",
      "Mrs Saint Delafield",
    ],
  },
  {
    group: "Modern Handwriting",
    fonts: [
      "Satisfy",
      "Yellowtail",
      "Bad Script",
      "Yesteryear",
      "Rochester",
      "Herr Von Muellerhoff",
      "Leckerli One",
      "Norican",
      "Niconne",
      "Euphoria Script",
    ],
  },
  {
    group: "Gaya Anak & Playful",
    fonts: [
      "Pangolin",
      "Patrick Hand SC",
      "Mali",
      "Sriracha",
      "Itim",
      "Charm",
      "Maitree",
      "Kanit",
      "Prompt",
      "Sarabun",
    ],
  },
];

// Gabungan semua font (untuk loading)
export const ALL_FONTS = [
  ...FONT_OPTIONS,
  ...FONT_OPTIONS_EXTRA.flatMap((group) => group.fonts),
];

export const INK_COLORS = [
  "#1a237e", // Biru Gelap Standar
  "#0d47a1", // Biru Tinta Pulpen
  "#1b1b1b", // Hitam Natural
  "#0a3d62", // Biru Dongker
  "#004d40", // Hijau Gelap
  "#78350f", // Cokelat Vintage
  "#991b1b", // Merah Pulpen
  "#4c1d95", // Ungu Tinta
];

export const LINE_COLORS = [
  { color: "#1e3a8a", label: "Biru Tua (Standar)" },
  { color: "#000000", label: "Hitam" },
  { color: "#64748b", label: "Abu-abu Kertas" },
  { color: "#dc2626", label: "Merah" },
  { color: "#16a34a", label: "Hijau" },
  { color: "#9333ea", label: "Ungu" },
];

export interface SymbolCategory {
  category: string;
  items: { label: string; value: string; display: string }[];
}

export const MATH_SYMBOLS = [
  // Rumus Utama
  { label: "Pecahan", value: "$$\\frac{a}{b}$$", display: "a/b" },
  { label: "Akar", value: "$$\\sqrt{x}$$", display: "√x" },
  { label: "Pangkat", value: "$$x^2$$", display: "x²" },
  { label: "Subskrip", value: "$$x_1$$", display: "x₁" },
  { label: "Limit", value: "$$\\lim_{x \\to 0}$$", display: "lim" },
  { label: "Sigma / Jumlah", value: "$$\\sum_{i=1}^{n}$$", display: "Σ" },
  { label: "Integral", value: "$$\\int_{a}^{b}$$", display: "∫" },
  { label: "Integral Tak Tentu", value: "$$\\int f(x)dx$$", display: "∫dx" },
  // Simbol Matematika
  { label: "Plus Minus", value: "±", display: "±" },
  { label: "Kali", value: "×", display: "×" },
  { label: "Bagi", value: "÷", display: "÷" },
  { label: "Tidak Sama Dengan", value: "≠", display: "≠" },
  { label: "Kurang dari Sama Dengan", value: "≤", display: "≤" },
  { label: "Lebih dari Sama Dengan", value: "≥", display: "≥" },
  { label: "Hampir Sama Dengan", value: "≈", display: "≈" },
  { label: "Tak Hingga", value: "∞", display: "∞" },
  { label: "Derajat", value: "°", display: "°" },
  // Huruf Yunani
  { label: "Pi", value: "π", display: "π" },
  { label: "Theta", value: "θ", display: "θ" },
  { label: "Alpha", value: "α", display: "α" },
  { label: "Beta", value: "β", display: "β" },
  { label: "Gamma", value: "γ", display: "γ" },
  { label: "Delta", value: "Δ", display: "Δ" },
  { label: "Lambda", value: "λ", display: "λ" },
  { label: "Mu", value: "μ", display: "μ" },
  { label: "Sigma Kecil", value: "σ", display: "σ" },
  { label: "Omega", value: "ω", display: "ω" },
  // Bentuk Geometri (Hand-drawn Shapes)
  { label: "Bentuk Lingkaran", value: "[shape:circle]", display: "○ Bulat" },
  { label: "Bentuk Persegi", value: "[shape:square]", display: "□ Kotak" },
  { label: "Bentuk Segitiga", value: "[shape:triangle]", display: "△ Segitiga" },
];

export const BUILT_IN_PRESETS: Preset[] = [
  {
    id: "preset-folio-standar",
    name: "Folio Standar (Biru Tinta)",
    settings: {
      fontFamily: "Kalam",
      fontSize: 18,
      lineHeight: LINE_HEIGHT_DEFAULT,
      inkColor: "#1a237e",
      handwritingRoughness: 0.35,
      marginTop: MARGIN_TOP_DEFAULT,
      marginBottom: 70,
      paddingLeft: MARGIN_LEFT_DEFAULT,
      showMarginLine: true,
      lineColor: "#1e3a8a",
      paperPattern: "folio",
      textVerticalPosition: "line",
      shrinkMathToLine: true,
    },
    createdAt: 1700000000000,
    isDefault: true,
  },
  {
    id: "preset-tinta-hitam",
    name: "Tinta Hitam Rapi",
    settings: {
      fontFamily: "Caveat",
      fontSize: 19,
      lineHeight: 32,
      inkColor: "#1b1b1b",
      handwritingRoughness: 0.15,
      marginTop: MARGIN_TOP_DEFAULT,
      marginBottom: 70,
      paddingLeft: MARGIN_LEFT_DEFAULT,
      showMarginLine: true,
      lineColor: "#64748b",
      paperPattern: "folio",
      textVerticalPosition: "line",
      shrinkMathToLine: true,
    },
    createdAt: 1700000000001,
    isDefault: true,
  },
  {
    id: "preset-gaya-kasual",
    name: "Gaya Kasual / Santai",
    settings: {
      fontFamily: "Indie Flower",
      fontSize: 17,
      lineHeight: 34,
      inkColor: "#0a3d62",
      handwritingRoughness: 0.55,
      marginTop: 110,
      marginBottom: 70,
      paddingLeft: 130,
      showMarginLine: true,
      lineColor: "#1e3a8a",
      paperPattern: "folio",
      textVerticalPosition: "line",
      shrinkMathToLine: true,
    },
    createdAt: 1700000000002,
    isDefault: true,
  },
  {
    id: "preset-tugas-matematika",
    name: "Tugas Matematika & Sains",
    settings: {
      fontFamily: "Patrick Hand",
      fontSize: 18,
      lineHeight: 32,
      inkColor: "#0d47a1",
      handwritingRoughness: 0.25,
      marginTop: MARGIN_TOP_DEFAULT,
      marginBottom: 70,
      paddingLeft: MARGIN_LEFT_DEFAULT,
      showMarginLine: true,
      lineColor: "#1e3a8a",
      paperPattern: "folio",
      textVerticalPosition: "line",
      shrinkMathToLine: true,
    },
    createdAt: 1700000000003,
    isDefault: true,
  },
  {
    id: "preset-catatan-vintage",
    name: "Catatan Vintage (Kecokelatan)",
    settings: {
      fontFamily: "Shadows Into Light",
      fontSize: 18,
      lineHeight: 32,
      inkColor: "#78350f",
      handwritingRoughness: 0.3,
      marginTop: 110,
      marginBottom: 70,
      paddingLeft: 130,
      showMarginLine: true,
      lineColor: "#64748b",
      paperPattern: "folio",
      textVerticalPosition: "line",
      shrinkMathToLine: true,
    },
    createdAt: 1700000000004,
    isDefault: true,
  },
];

export interface TextTemplate {
  id: string;
  title: string;
  text: string;
}

export const TEXT_TEMPLATES: TextTemplate[] = [
  {
    id: "template-matematika",
    title: "Contoh Soal Matematika",
    text: `Tugas Matematika Diskrit & Kalkulus

1. Operasi Pecahan Aljabar:
   Jika $$\\frac{1}{2}$$ + $$\\frac{1}{4}$$ = $$\\frac{3}{4}$$
   Maka $$\\sqrt{\\frac{9}{16}}$$ = $$\\frac{3}{4}$$

2. Persamaan Geometri Lingkaran:
   Rumus umum: $$x^2 + y^2 = r^2$$
   Ilustrasi bidang bangun datar: [shape:circle] dan [shape:triangle]

3. Kalkulus Integral Tentu:
   $$\\int_{0}^{1} x^2 dx$$ = $$\\left[ \\frac{x^3}{3} \\right]_0^1$$ = $$\\frac{1}{3}$$

4. Evaluasi Limit Fungsi Trigonometri:
   $$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$$

Kesimpulan: Semua solusi telah diverifikasi dan bernilai konsisten.`,
  },
  {
    id: "template-esai",
    title: "Tugas Ringkasan / Esai Kuliah",
    text: `Ringkasan Materi: Perkembangan Teknologi Digital

Teknologi digital telah membawa transformasi fundamental dalam berbagai aspek kehidupan manusia, mulai dari sistem komunikasi, ekonomi, hingga metodologi pendidikan modern.

Integrasi kecerdasan buatan (Artificial Intelligence) dan otomatisasi proses memungkinkan efisiensi kerja meningkat secara signifikan. Namun demikian, kesiapan sumber daya manusia dan literasi etika digital tetap menjadi pilar utama keberhasilan adaptasi teknologi tersebut di masa depan.

Dalam konteks akademik, pemanfaatan alat bantu digital harus senantiasa diimbangi dengan integritas ilmiah dan pemahaman konsep yang mendalam.`,
  },
  {
    id: "template-biodata",
    title: "Format Catatan / Laporan Praktikum",
    text: `Laporan Hasil Pengamatan Praktikum

A. Tujuan Percobaan:
1. Mengukur nilai resistansi dan arus listrik pada rangkaian seri dan paralel.
2. Memahami hukum Ohm: $$V = I \\times R$$

B. Alat dan Bahan:
- Multimeter digital
- Sumber tegangan DC 12V
- Resistor 100Ω, 220Ω, dan 470Ω

C. Hasil Pengukuran:
Tegangan $$\\Delta V$$ = 12.0 Volt
Arus terukur $$I_1$$ = 0.054 Ampere
Daya disipasi $$P$$ = $$I^2 R$$ = 0.35 Watt`,
  },
];

export const DEFAULT_TEXT = TEXT_TEMPLATES[0].text;

export const STORAGE_KEY_PRESETS = "botnulis-presets";
export const STORAGE_KEY_SETTINGS = "botnulis-settings";
export const STORAGE_KEY_TEXT = "botnulis-text";
export const STORAGE_KEY_IDENTITIES = "botnulis-identities";
