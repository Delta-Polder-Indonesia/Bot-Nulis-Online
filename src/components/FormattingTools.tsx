import { useState, useCallback, useRef, useEffect } from "react";
import {
  ChevronDown,
  Search,
  Loader2,
  Check,
  Sliders,
  Palette,
  FileSpreadsheet,
  AlignVerticalJustifyCenter,
} from "lucide-react";
import {
  FONT_OPTIONS,
  FONT_OPTIONS_EXTRA,
  INK_COLORS,
  LINE_COLORS,
} from "../constants";
import type { PaperPattern, PaperSettings, TextVerticalPosition } from "../types";
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
  step?: number;
  onChange: (val: number) => void;
}

function Slider({
  label,
  value,
  min,
  max,
  unit = "px",
  step = 1,
  onChange,
}: SliderProps) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5 font-medium text-gray-600">
        <span>{label}</span>
        <span className="font-bold text-gray-900 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-full cursor-pointer transition-all"
      />
    </div>
  );
}

// ─── POSISI TULISAN DI GARIS (DUDUK DI GARIS / TENGAH-TENGAH) ─────────
interface TextPositionPreviewProps {
  mode: TextVerticalPosition;
  fontFamily: string;
}

function TextPositionPreview({ mode, fontFamily }: TextPositionPreviewProps) {
  const safeFamily = fontFamily.includes(" ")
    ? `"${fontFamily}"`
    : fontFamily;
  return (
    <svg viewBox="0 0 56 22" className="w-full h-6" aria-hidden="true">
      {/* Dua garis buku pembatas */}
      <line
        x1="1"
        y1="4"
        x2="55"
        y2="4"
        stroke="#94a3b8"
        strokeWidth="0.9"
        opacity="0.8"
      />
      <line
        x1="1"
        y1="18"
        x2="55"
        y2="18"
        stroke="#94a3b8"
        strokeWidth="0.9"
        opacity="0.8"
      />
      {/* Contoh huruf: mode "line" -> duduk di garis bawah, mode "middle" -> di tengah */}
      <text
        x="28"
        y={mode === "line" ? 16 : 11}
        fontSize="11"
        textAnchor="middle"
        fill="currentColor"
        style={{
          fontFamily: `${safeFamily}, cursive, sans-serif`,
          fontWeight: 500,
        }}
      >
        Ag
      </text>
    </svg>
  );
}

interface TextVerticalPositionControlProps {
  value: TextVerticalPosition;
  fontFamily: string;
  onChange: (mode: TextVerticalPosition) => void;
}

const TEXT_POSITION_OPTIONS: {
  id: TextVerticalPosition;
  label: string;
  hint: string;
}[] = [
  { id: "line", label: "Di Atas Garis", hint: "Tulisan duduk di garis buku" },
  { id: "middle", label: "Tengah-tengah", hint: "Di antara dua garis buku" },
];

function TextVerticalPositionControl({
  value,
  fontFamily,
  onChange,
}: TextVerticalPositionControlProps) {
  return (
    <div className="pt-1">
      <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1.5">
        <AlignVerticalJustifyCenter size={14} className="text-blue-600" />
        Posisi Tulisan di Garis
      </p>
      <div className="grid grid-cols-2 gap-1.5">
        {TEXT_POSITION_OPTIONS.map((item) => {
          const active = value === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              aria-pressed={active}
              title={item.hint}
              className={`px-2 pt-2 pb-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                active
                  ? "bg-blue-50 border-blue-500 ring-2 ring-blue-100"
                  : "bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100"
              }`}
            >
              <TextPositionPreview mode={item.id} fontFamily={fontFamily} />
              <span
                className={`block text-[11px] mt-1 font-semibold ${
                  active ? "text-blue-700" : "text-gray-600"
                }`}
              >
                {item.label}
              </span>
              <span
                className={`block text-[9px] mt-0.5 ${
                  active ? "text-blue-500/80" : "text-gray-400"
                }`}
              >
                {item.hint}
              </span>
            </button>
          );
        })}
      </div>
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
    <div ref={dropdownRef} className="relative mt-2.5">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className={`
          w-full flex items-center justify-between px-3 py-2
          bg-slate-50 border rounded-xl text-xs sm:text-sm transition-all
          hover:border-blue-300 cursor-pointer
          ${isOpen ? "border-blue-500 ring-2 ring-blue-100 bg-white" : "border-slate-200"}
        `}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider shrink-0">
            Katalog:
          </span>
          <span
            className="truncate font-semibold text-gray-800"
            style={{
              fontFamily: previewFont || currentFont,
            }}
          >
            {previewFont || currentFont}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {isLoading && (
            <Loader2
              size={14}
              className="animate-spin text-blue-500"
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
                     bg-white border border-gray-200 rounded-xl shadow-2xl
                     overflow-hidden"
          style={{ maxHeight: "360px" }}
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
                placeholder="Cari dari 40+ gaya font..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border
                           border-slate-200 rounded-lg focus:border-blue-400
                           focus:bg-white focus:ring-1 focus:ring-blue-200 outline-none
                           transition-all"
              />
            </div>
          </div>

          {/* Font List */}
          <div
            className="overflow-y-auto"
            style={{ maxHeight: "300px" }}
          >
            {/* Font utama */}
            {FONT_OPTIONS.some((f) =>
              f.toLowerCase().includes(search.toLowerCase())
            ) && (
              <div className="px-2 pt-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-blue-600 px-2 mb-1">
                  ★ Font Populer
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
                      w-full flex items-center justify-between px-3 py-1.5
                      rounded-lg text-sm transition-colors text-left cursor-pointer
                      ${
                        currentFont === font
                          ? "bg-blue-50 text-blue-700 font-bold"
                          : "hover:bg-slate-50 text-gray-700"
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
                        className="text-blue-600 shrink-0 ml-2"
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
                      w-full flex items-center justify-between px-3 py-1.5
                      rounded-lg text-sm transition-colors text-left cursor-pointer
                      ${
                        currentFont === font
                          ? "bg-blue-50 text-blue-700 font-bold"
                          : "hover:bg-slate-50 text-gray-700"
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
                          <span className="font-sans text-xs">{font}</span>
                          <span className="text-[9px] text-gray-400 font-sans">
                            (klik untuk muat)
                          </span>
                        </span>
                      )}
                    </span>
                    {currentFont === font && (
                      <Check
                        size={14}
                        className="text-blue-600 shrink-0 ml-2"
                      />
                    )}
                  </button>
                ))}
              </div>
            ))}

            {/* Tidak ada hasil */}
            {!hasResults && (
              <div className="px-4 py-8 text-center">
                <p className="text-xs text-gray-400">
                  Tidak ditemukan font &quot;
                  <span className="font-semibold text-gray-600">
                    {search}
                  </span>
                  &quot;
                </p>
              </div>
            )}

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
    paperPattern = "folio",
    textVerticalPosition = "line",
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
    <section className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-gray-200 space-y-5">
      {/* ──── FONT SECTION ──── */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <Sliders size={16} className="text-blue-600" />
          <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">
            Gaya Font Tulisan Tangan
          </p>
        </div>

        {/* Grid tombol font utama */}
        <div className="grid grid-cols-3 gap-1.5">
          {FONT_OPTIONS.map((f) => (
            <button
              key={f}
              onClick={() => handleFontSelect(f)}
              style={{ fontFamily: f }}
              className={`p-2 border rounded-xl text-sm transition-all cursor-pointer truncate
                ${
                  fontFamily === f
                    ? "bg-blue-50 border-blue-500 text-blue-700 font-bold shadow-xs"
                    : "bg-slate-50/60 border-slate-200 hover:border-slate-300 text-gray-700"
                }`}
            >
              {f.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* Dropdown font tambahan */}
        <FontSelectDropdown
          currentFont={fontFamily}
          onSelectFont={handleFontSelect}
        />
      </div>

      {/* ──── POLA KERTAS (FOLIO / GRID / POLOS) ──── */}
      <div>
        <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1.5">
          <FileSpreadsheet size={14} className="text-blue-600" />
          Format Kertas
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          {(
            [
              { id: "folio", label: "Folio Bergaris" },
              { id: "grid", label: "Kotak-kotak" },
              { id: "blank", label: "Polos (Blank)" },
            ] as { id: PaperPattern; label: string }[]
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => onUpdate("paperPattern", item.id)}
              className={`py-1.5 px-2 text-xs rounded-lg border font-medium transition-all cursor-pointer ${
                paperPattern === item.id
                  ? "bg-blue-50 border-blue-500 text-blue-700 font-bold"
                  : "bg-slate-50 border-slate-200 text-gray-600 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ──── SLIDERS & CONTROLS ──── */}
      <div className="space-y-3.5 pt-1 border-t border-slate-100">
        <Slider
          label="Ukuran Font"
          value={fontSize}
          min={14}
          max={28}
          onChange={(v) => onUpdate("fontSize", v)}
        />

        <Slider
          label="Jarak Baris Kertas"
          value={lineHeight}
          min={24}
          max={48}
          onChange={(v) => onUpdate("lineHeight", v)}
        />

        {/* Mode posisi tulisan: duduk di garis / tengah-tengah */}
        <TextVerticalPositionControl
          value={textVerticalPosition}
          fontFamily={fontFamily}
          onChange={(mode) => onUpdate("textVerticalPosition", mode)}
        />

        <div>
          <div className="flex justify-between text-xs mb-1.5 font-medium text-gray-600">
            <span>Variasi Alami Tulisan (Roughness)</span>
            <span className="font-bold text-gray-900 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
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
            className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-full cursor-pointer transition-all"
          />
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>0% (Sangat Rapi)</span>
            <span>50% (Alami)</span>
            <span>100% (Kasual)</span>
          </div>
        </div>

        <Slider
          label="Margin Atas Header"
          value={marginTop}
          min={50}
          max={160}
          onChange={(v) => onUpdate("marginTop", v)}
        />

        <Slider
          label="Margin Kiri Tulisan"
          value={paddingLeft}
          min={60}
          max={200}
          onChange={(v) => onUpdate("paddingLeft", v)}
        />

        {/* Toggle garis margin */}
        {paperPattern !== "blank" && (
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-medium text-gray-600">
              Garis Margin Merah Kiri
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={showMarginLine}
              onClick={() => onUpdate("showMarginLine", !showMarginLine)}
              className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer
                          focus:outline-none focus:ring-2 focus:ring-blue-400
                          ${showMarginLine ? "bg-blue-600" : "bg-slate-300"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white
                            rounded-full shadow-xs transition-transform duration-200
                            ${showMarginLine ? "translate-x-4" : "translate-x-0"}`}
              />
            </button>
          </div>
        )}

        {/* Warna Tinta Pulpen */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
              <Palette size={13} className="text-blue-600" />
              Warna Tinta Pulpen
            </span>
            <div className="flex items-center gap-1">
              <label
                htmlFor="custom-ink-picker"
                title="Pilih warna kustom"
                className="text-[10px] text-blue-600 hover:underline cursor-pointer"
              >
                Kustom:
              </label>
              <input
                id="custom-ink-picker"
                type="color"
                value={inkColor}
                onChange={(e) => onUpdate("inkColor", e.target.value)}
                className="w-5 h-5 rounded border border-gray-300 cursor-pointer p-0 overflow-hidden"
              />
            </div>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {INK_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => onUpdate("inkColor", c)}
                aria-label={`Pilih warna tinta ${c}`}
                className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer
                  ${
                    inkColor.toLowerCase() === c.toLowerCase()
                      ? "border-blue-500 scale-125 ring-2 ring-blue-200"
                      : "border-white hover:scale-110 shadow-xs"
                  }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Warna Garis Kertas */}
        {paperPattern !== "blank" && (
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">
                Warna Garis Kertas
              </span>
              <div className="flex items-center gap-1">
                <label
                  htmlFor="custom-line-picker"
                  title="Pilih warna garis kustom"
                  className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                >
                  Kustom:
                </label>
                <input
                  id="custom-line-picker"
                  type="color"
                  value={lineColor}
                  onChange={(e) => onUpdate("lineColor", e.target.value)}
                  className="w-5 h-5 rounded border border-gray-300 cursor-pointer p-0 overflow-hidden"
                />
              </div>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {LINE_COLORS.map((item) => (
                <button
                  key={item.color}
                  onClick={() => onUpdate("lineColor", item.color)}
                  title={item.label}
                  aria-label={`Pilih warna garis ${item.label}`}
                  className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer
                    ${
                      lineColor.toLowerCase() === item.color.toLowerCase()
                        ? "border-blue-500 scale-125 ring-2 ring-blue-200"
                        : "border-white hover:scale-110 shadow-xs"
                    }`}
                  style={{ backgroundColor: item.color }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
