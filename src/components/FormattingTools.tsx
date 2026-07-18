import { FONT_OPTIONS, INK_COLORS, LINE_COLORS } from "../constants";
import type { PaperSettings } from "../types";

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

  return (
    <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 space-y-6">
      {/* Font Selection */}
      <div>
        <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">
          Font Tulis Tangan
        </p>
        <div className="grid grid-cols-2 gap-2">
          {FONT_OPTIONS.map((f) => (
            <button
              key={f}
              onClick={() => onUpdate("fontFamily", f)}
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
      </div>

      {/* Sliders */}
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

        {/* Toggle margin line */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500">
            Tampilkan Garis Margin
          </span>
          <button
            role="switch"
            aria-checked={showMarginLine}
            onClick={() => onUpdate("showMarginLine", !showMarginLine)}
            className={`relative w-10 h-5 rounded-full transition-colors focus:outline-none
                        focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
                        ${showMarginLine ? "bg-blue-500" : "bg-gray-300"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full
                          shadow transition-transform duration-200
                          ${showMarginLine ? "translate-x-5" : "translate-x-0"}`}
            />
          </button>
        </div>

        {/* Ink Color */}
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

        {/* Line Color */}
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