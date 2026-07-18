export const PAPER_WIDTH = 794;
export const PAPER_HEIGHT = 1224;
export const LINE_HEIGHT_DEFAULT = 32;
export const MARGIN_TOP_DEFAULT = 110;
export const MARGIN_LEFT_DEFAULT = 140;

// Font yang ditampilkan sebagai tombol grid (TIDAK DIUBAH)
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
  "#1a237e",
  "#0d47a1",
  "#1b1b1b",
  "#0a3d62",
  "#004d40",
  "#991b1b",
];

export const LINE_COLORS = [
  { color: "#1e3a8a", label: "Biru Tua" },
  { color: "#000000", label: "Hitam" },
  { color: "#dc2626", label: "Merah" },
  { color: "#16a34a", label: "Hijau" },
  { color: "#9333ea", label: "Ungu" },
];

export const MATH_SYMBOLS = [
  { label: "Pecahan", value: "$$\\frac{a}{b}$$", display: "a/b" },
  { label: "Akar", value: "$$\\sqrt{x}$$", display: "√x" },
  { label: "Pangkat", value: "$$x^2$$", display: "x²" },
  { label: "Subskrip", value: "$$x_1$$", display: "x₁" },
  { label: "Limit", value: "$$\\lim_{x \\to 0}$$", display: "lim" },
  { label: "Sigma", value: "$$\\sum_{i=1}^{n}$$", display: "Σ" },
  { label: "Integral", value: "$$\\int_{a}^{b}$$", display: "∫" },
  { label: "±", value: "±", display: "±" },
  { label: "×", value: "×", display: "×" },
  { label: "÷", value: "÷", display: "÷" },
  { label: "≠", value: "≠", display: "≠" },
  { label: "≤", value: "≤", display: "≤" },
  { label: "≥", value: "≥", display: "≥" },
  { label: "∞", value: "∞", display: "∞" },
  { label: "°", value: "°", display: "°" },
  { label: "π", value: "π", display: "π" },
  { label: "θ", value: "θ", display: "θ" },
  { label: "α", value: "α", display: "α" },
  { label: "β", value: "β", display: "β" },
  { label: "γ", value: "γ", display: "γ" },
  { label: "Δ", value: "Δ", display: "Δ" },
];

export const DEFAULT_TEXT = `Contoh soal tulisan tangan:

Jika $$\\frac{1}{2}$$ + $$\\frac{1}{4}$$ = $$\\frac{3}{4}$$

Maka $$\\sqrt{\\frac{9}{16}}$$ = $$\\frac{3}{4}$$

Rumus: $$x^2$$ + $$y^2$$ = $$z^2$$

Integral: $$\\int_{0}^{1} x^2 dx$$ = $$\\frac{1}{3}$$

Limit: $$\\lim_{x \\to 0} \\frac{\\sin x}{x}$$ = 1`;

export const STORAGE_KEY_PRESETS = "botnulis-presets";
export const STORAGE_KEY_SETTINGS = "botnulis-settings";
export const STORAGE_KEY_TEXT = "botnulis-text";
export const STORAGE_KEY_IDENTITIES = "botnulis-identities";