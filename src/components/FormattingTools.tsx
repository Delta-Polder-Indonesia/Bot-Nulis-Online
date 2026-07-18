import { useState, useCallback, useRef, useEffect } from "react";
import {
  ChevronDown,
  Search,
  Loader2,
  Check,
} from "lucide-react";
import {
  FONT_OPTIONS,
  FONT_OPTIONS_EXTRA,
  INK_COLORS,
  LINE_COLORS,
} from "../constants";
import type { PaperSettings } from "../types";
import { useFontLoader } from "../hooks/useFontLoader";

interface FormattingToolsProps {
  settings: PaperSettings;
  onUpdate: <K extends keyof PaperSettings>(
    key: K,
    value: PaperSettings[K]
  ) => void;
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  onChange: (val: number) => void;
}

function Slider({
  label,
  value,
  min,
  max,
  unit = "px",
  onChange,
}: SliderProps) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5 font-medium text-gray-500">
        <span>{label}</span>
        <span className="font-bold text-gray-700">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="w-full accent-blue-600 h-1.5 rounded-full cursor-pointer"
      />
    </div>
  );
}

// ─── FONT SELECT DROPDOWN COMPONENT ─────────────────────────
interface FontSelectDropdownProps {
  currentFont: string;
  onSelectFont: (font: string) => void;
}

function FontSelectDropdown({
  currentFont,
  onSelectFont,
}: FontSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [previewFont, setPreviewFont] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { loadFont, loadedFonts, isLoading } = useFontLoader();

  // Tutup dropdown ketika klik di luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-focus search input saat buka
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelectFont = useCallback(
    (font: string) => {
      loadFont(font);
      onSelectFont(font);
      setIsOpen(false);
      setSearch("");
      setPreviewFont(null);
    },
    [loadFont, onSelectFont]
  );

  const handleHoverFont = useCallback(
    (font: string) => {
      loadFont(font);
      setPreviewFont(font);
    },
    [loadFont]
  );

  // Filter font berdasarkan search
  const filteredGroups = FONT_OPTIONS_EXTRA.map((group) => ({
    ...group,
    fonts: group.fonts.filter((f) =>
      f.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((group) => group.fonts.length > 0);

  const hasResults =
    filteredGroups.length > 0 ||
    FONT_OPTIONS.some((f) =>
      f.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div ref={dropdownRef} className="relative mt-3">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className={`
          w-full flex items-center justify-between px-3 py-2.5
          bg-gray-50 border rounded-xl text-sm transition-all
          hover:border-blue-300
          ${isOpen ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-200"}
        `}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider shrink-0">
            Lainnya:
          </span>
          <span
            className="truncate font-medium text-gray-700"
            style={{
              fontFamily:
                previewFont || currentFont,
            }}
          >
            {previewFont || currentFont}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {isLoading && (
            <Loader2
              size={14}
              className="animate-spin text-blue-400"
            />
          )}
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-200
              ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className="absolute z-50 top-full left-0 right-0 mt-1.5
                     bg-white border border-gray-200 rounded-xl shadow-xl
                     overflow-hidden"
          style={{ maxHeight: "380px" }}
        >
          {/* Search Bar */}
          <div className="sticky top-0 bg-white border-b border-gray-100 p-2 z-10">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari font..."
                className="w-full pl-8 pr-3 py-2 text-xs bg-gray-50 border
                           border-gray-200 rounded-lg focus:border-blue-400
                           focus:ring-1 focus:ring-blue-200 outline-none
                           transition-colors"
              />
            </div>
          </div>

          {/* Font List */}
          <div
            className="overflow-y-auto"
            style={{ maxHeight: "320px" }}
          >
            {/* Font utama yang sudah ada (jika cocok pencarian) */}
            {FONT_OPTIONS.some((f) =>
              f.toLowerCase().includes(search.toLowerCase())
            ) && (
              <div className="px-2 pt-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 px-2 mb-1">
                  ★ Font Utama
                </p>
                {FONT_OPTIONS.filter((f) =>
                  f.toLowerCase().includes(search.toLowerCase())
                ).map((font) => (
                  <button
                    key={font}
                    onClick={() => handleSelectFont(font)}
                    onMouseEnter={() => handleHoverFont(font)}
                    onMouseLeave={() => setPreviewFont(null)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2
                      rounded-lg text-sm transition-colors text-left
                      ${
                        currentFont === font
                          ? "bg-blue-50 text-blue-700"
                          : "hover:bg-gray-50 text-gray-700"
                      }
                    `}
                    style={{ fontFamily: font }}
                  >
                    <span className="truncate">
                      {font} - Tulisan tangan
                    </span>
                    {currentFont === font && (
                      <Check
                        size={14}
                        className="text-blue-500 shrink-0 ml-2"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Font tambahan per group */}
            {filteredGroups.map((group) => (
              <div key={group.group} className="px-2 pt-3">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 px-2 mb-1">
                  {group.group}
                </p>
                {group.fonts.map((font) => (
                  <button
                    key={font}
                    onClick={() => handleSelectFont(font)}
                    onMouseEnter={() => handleHoverFont(font)}
                    onMouseLeave={() => setPreviewFont(null)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2
                      rounded-lg text-sm transition-colors text-left
                      ${
                        currentFont === font
                          ? "bg-blue-50 text-blue-700"
                          : "hover:bg-gray-50 text-gray-700"
                      }
                    `}
                    style={{
                      fontFamily: loadedFonts.has(font)
                        ? font
                        : "sans-serif",
                    }}
                  >
                    <span className="truncate">
                      {loadedFonts.has(font) ? (
                        `${font} - Contoh teks`
                      ) : (
                        <span className="flex items-center gap-2">
                          <span className="font-sans">{font}</span>
                          <span className="text-[9px] text-gray-400 font-sans">
                            (klik untuk muat)
                          </span>
                        </span>
                      )}
                    </span>
                    {currentFont === font && (
                      <Check
                        size={14}
                        className="text-blue-500 shrink-0 ml-2"
                      />
                    )}
                  </button>
                ))}
              </div>
            ))}

            {/* Tidak ada hasil */}
            {!hasResults && (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-gray-400">
                  Tidak ditemukan font "
                  <span className="font-semibold text-gray-500">
                    {search}
                  </span>
                  "
                </p>
                <p className="text-[10px] text-gray-400 mt-1">
                  Coba kata kunci lain
                </p>
              </div>
            )}

            {/* Spacer bawah */}
            <div className="h-2" />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN FORMATTING TOOLS ──────────────────────────────────
export default function FormattingTools({
  settings,
  onUpdate,
}: FormattingToolsProps) {
  const {
    fontFamily,
    fontSize,
    lineHeight,
    handwritingRoughness,
    marginTop,
    paddingLeft,
    showMarginLine,
    inkColor,
    lineColor,
  } = settings;

  const { loadFont } = useFontLoader();

  const handleFontSelect = useCallback(
    (font: string) => {
      loadFont(font);
      onUpdate("fontFamily", font);
    },
    [loadFont, onUpdate]
  );

  return (
    <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 space-y-6">
      {/* ──── FONT SECTION (TIDAK DIUBAH LAYOUTNYA) ──── */}
      <div>
        <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">
          Font Tulis Tangan
        </p>

        {/* Grid tombol font utama — SAMA PERSIS seperti sebelumnya */}
        <div className="grid grid-cols-2 gap-2">
          {FONT_OPTIONS.map((f) => (
            <button
              key={f}
              onClick={() => handleFontSelect(f)}
              style={{ fontFamily: f }}
              className={`p-2.5 border rounded-xl text-base transition-all
                ${
                  fontFamily === f
                    ? "bg-blue-50 border-blue-500 text-blue-700 shadow-inner"
                    : "bg-white border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
            >
              {f.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* ──── SELECT DROPDOWN FONT TAMBAHAN (BARU!) ──── */}
        {/* Diletakkan DI BAWAH grid font utama, SEJAJAR */}
        <FontSelectDropdown
          currentFont={fontFamily}
          onSelectFont={handleFontSelect}
        />
      </div>

      {/* ──── SLIDERS & CONTROLS (TIDAK DIUBAH) ──── */}
      <div className="space-y-4">
        <Slider
          label="Ukuran Font"
          value={fontSize}
          min={14}
          max={28}
          onChange={(v) => onUpdate("fontSize", v)}
        />

        <Slider
          label="Jarak Baris"
          value={lineHeight}
          min={24}
          max={48}
          onChange={(v) => onUpdate("lineHeight", v)}
        />

        <div>
          <div className="flex justify-between text-xs mb-1.5 font-medium text-gray-500">
            <span>Gaya Tulisan Tangan</span>
            <span className="font-bold text-gray-700">
              {Math.round(handwritingRoughness * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={handwritingRoughness * 100}
            onChange={(e) =>
              onUpdate("handwritingRoughness", +e.target.value / 100)
            }
            className="w-full accent-blue-600 h-1.5 rounded-full cursor-pointer"
          />
          <p className="text-[10px] text-gray-400 mt-1">
            0% = rapi · 100% = sangat tidak rapi
          </p>
        </div>

        <Slider
          label="Margin Atas"
          value={marginTop}
          min={50}
          max={160}
          onChange={(v) => onUpdate("marginTop", v)}
        />

        <Slider
          label="Margin Kiri"
          value={paddingLeft}
          min={60}
          max={200}
          onChange={(v) => onUpdate("paddingLeft", v)}
        />

        {/* Toggle garis margin */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500">
            Tampilkan Garis Margin
          </span>
          <button
            role="switch"
            aria-checked={showMarginLine}
            onClick={() => onUpdate("showMarginLine", !showMarginLine)}
            className={`relative w-10 h-5 rounded-full transition-colors
                        focus:outline-none focus:ring-2 focus:ring-blue-400
                        focus:ring-offset-1
                        ${showMarginLine ? "bg-blue-500" : "bg-gray-300"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white
                          rounded-full shadow transition-transform duration-200
                          ${showMarginLine ? "translate-x-5" : "translate-x-0"}`}
            />
          </button>
        </div>

        {/* Warna Tinta */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">
            Warna Tinta
          </p>
          <div className="flex gap-2 flex-wrap">
            {INK_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => onUpdate("inkColor", c)}
                aria-label={`Pilih warna tinta ${c}`}
                className={`w-7 h-7 rounded-full border-2 transition-all
                  ${
                    inkColor === c
                      ? "border-blue-400 scale-125 ring-2 ring-blue-200"
                      : "border-transparent hover:scale-110"
                  }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Warna Garis */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">
            Warna Garis Kertas
          </p>
          <div className="flex gap-2 flex-wrap">
            {LINE_COLORS.map((item) => (
              <button
                key={item.color}
                onClick={() => onUpdate("lineColor", item.color)}
                aria-label={`Pilih warna garis ${item.label}`}
                className={`w-7 h-7 rounded-full border-2 transition-all
                  ${
                    lineColor === item.color
                      ? "border-blue-400 scale-125 ring-2 ring-blue-200"
                      : "border-gray-200 hover:scale-110"
                  }`}
                style={{ backgroundColor: item.color }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}