import { useState, useCallback } from "react";
import { Save, FolderOpen, Trash2, ChevronDown, ChevronUp } from "lucide-react";
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
  const { presets, savePreset, loadPreset, deletePreset } = usePresets();
  const [presetName, setPresetName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = useCallback(() => {
    if (!presetName.trim()) return;
    savePreset(presetName.trim(), currentSettings);
    setPresetName("");
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  }, [presetName, currentSettings, savePreset]);

  const handleLoad = useCallback(
    (id: string) => {
      const settings = loadPreset(id);
      if (settings) onLoadPreset(settings);
    },
    [loadPreset, onLoadPreset]
  );

  const formatDate = (ts: number) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(ts));
  };

  return (
    <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="flex items-center justify-between w-full"
      >
        <span className="flex items-center gap-2 font-bold text-gray-700">
          <Save size={18} /> Preset Settings
        </span>
        <div className="flex items-center gap-2">
          {presets.length > 0 && (
            <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
              {presets.length}
            </span>
          )}
          {isOpen ? (
            <ChevronUp size={16} className="text-gray-400" />
          ) : (
            <ChevronDown size={16} className="text-gray-400" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="mt-4 space-y-3">
          {/* Input simpan preset baru */}
          <div className="flex gap-2">
            <input
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder="Nama preset baru..."
              className="flex-1 text-xs p-2 border rounded-lg
                         focus:border-blue-400 outline-none transition-colors"
            />
            <button
              onClick={handleSave}
              disabled={!presetName.trim()}
              className={`px-3 py-2 rounded-lg text-xs font-semibold
                         transition-all disabled:opacity-40 ${
                           saveSuccess
                             ? "bg-green-500 text-white"
                             : "bg-blue-600 hover:bg-blue-700 text-white"
                         }`}
            >
              {saveSuccess ? "✓" : <Save size={12} />}
            </button>
          </div>

          {/* Daftar preset */}
          {presets.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-3">
              Belum ada preset tersimpan
            </p>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {presets
                .slice()
                .reverse()
                .map((preset) => (
                  <div
                    key={preset.id}
                    className="flex items-center gap-2 p-2.5 bg-gray-50
                               rounded-xl group hover:bg-blue-50
                               transition-colors border border-transparent
                               hover:border-blue-200"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-700 truncate">
                        {preset.name}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {formatDate(preset.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleLoad(preset.id)}
                      title="Muat preset"
                      className="text-blue-400 hover:text-blue-600 p-1.5
                                 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <FolderOpen size={13} />
                    </button>
                    <button
                      onClick={() => deletePreset(preset.id)}
                      title="Hapus preset"
                      className="text-gray-300 hover:text-red-500 p-1.5
                                 rounded-lg hover:bg-red-50 transition-colors
                                 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}