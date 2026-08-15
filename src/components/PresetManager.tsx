import { useState, useCallback } from "react";
import {
  Save,
  FolderOpen,
  Trash2,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Check,
} from "lucide-react";
import type { PaperSettings } from "../types";
import { usePresets } from "../hooks/usePresets";

interface PresetManagerProps {
  currentSettings: PaperSettings;
  onLoadPreset: (settings: PaperSettings) => void;
}

export default function PresetManager({
  currentSettings,
  onLoadPreset,
}: PresetManagerProps) {
  const { presets, customPresets, builtInPresets, savePreset, loadPreset, deletePreset } =
    usePresets();
  const [presetName, setPresetName] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loadedId, setLoadedId] = useState<string | null>(null);

  const handleSave = useCallback(() => {
    if (!presetName.trim()) return;
    savePreset(presetName.trim(), currentSettings);
    setPresetName("");
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  }, [presetName, currentSettings, savePreset]);

  const handleLoad = useCallback(
    (id: string) => {
      const s = loadPreset(id);
      if (s) {
        onLoadPreset(s);
        setLoadedId(id);
        setTimeout(() => setLoadedId(null), 1500);
      }
    },
    [loadPreset, onLoadPreset]
  );

  return (
    <section className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-gray-200">
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="flex items-center justify-between w-full cursor-pointer"
      >
        <span className="flex items-center gap-2 font-bold text-gray-800 text-sm">
          <Bookmark size={17} className="text-blue-600" />
          Preset Gaya Kertas & Font
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full border border-blue-200">
            {presets.length}
          </span>
          {isOpen ? (
            <ChevronUp size={16} className="text-gray-400" />
          ) : (
            <ChevronDown size={16} className="text-gray-400" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="mt-3.5 space-y-3">
          {/* Input simpan preset kustom */}
          <div className="flex gap-1.5">
            <input
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder="Simpan pengaturan ini..."
              className="flex-1 text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl
                         focus:border-blue-400 focus:bg-white outline-none transition-colors"
            />
            <button
              onClick={handleSave}
              disabled={!presetName.trim()}
              title="Simpan preset"
              className={`px-3 py-2 rounded-xl text-xs font-semibold
                         transition-all disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed flex items-center gap-1 ${
                           saveSuccess
                             ? "bg-emerald-600 text-white"
                             : "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                         }`}
            >
              {saveSuccess ? <Check size={14} /> : <Save size={13} />}
              <span className="text-[11px]">{saveSuccess ? "Tersimpan" : "Simpan"}</span>
            </button>
          </div>

          {/* Daftar Preset Bawaan */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1">
              Preset Rekomendasi
            </p>
            <div className="grid grid-cols-1 gap-1">
              {builtInPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleLoad(preset.id)}
                  className={`flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer border ${
                    loadedId === preset.id
                      ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold"
                      : "bg-slate-50/60 border-slate-100 hover:bg-blue-50 hover:border-blue-200 text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: preset.settings.inkColor }}
                    />
                    <span className="text-xs font-medium truncate">
                      {preset.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-blue-600 font-semibold shrink-0 ml-2">
                    {loadedId === preset.id ? "Aktif ✓" : "Terapkan"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Daftar Preset Kustom Pengguna */}
          {customPresets.length > 0 && (
            <div className="space-y-1 pt-1 border-t border-slate-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1">
                Preset Kustom Anda ({customPresets.length})
              </p>
              <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                {customPresets.map((preset) => (
                  <div
                    key={preset.id}
                    className="flex items-center justify-between p-2 bg-slate-50
                               rounded-xl group hover:bg-blue-50
                               transition-colors border border-slate-200/70
                               hover:border-blue-200"
                  >
                    <div className="flex items-center gap-2 truncate flex-1 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: preset.settings.inkColor }}
                      />
                      <p className="text-xs font-semibold text-gray-700 truncate">
                        {preset.name}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleLoad(preset.id)}
                        title="Muat preset"
                        className="text-blue-600 hover:text-blue-800 p-1
                                   rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                      >
                        <FolderOpen size={13} />
                      </button>
                      <button
                        onClick={() => deletePreset(preset.id)}
                        title="Hapus preset"
                        className="text-gray-400 hover:text-red-500 p-1
                                   rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
