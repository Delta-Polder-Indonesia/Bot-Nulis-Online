import { useCallback } from "react";
import { Plus, Trash2, UserCheck } from "lucide-react";
import type { IdentityField } from "../types";

interface IdentityEditorProps {
  identities: IdentityField[];
  setIdentities: (identities: IdentityField[]) => void;
}

export default function IdentityEditor({
  identities,
  setIdentities,
}: IdentityEditorProps) {
  const addField = useCallback(() => {
    setIdentities([
      ...identities,
      {
        id: `id-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        label: "Label Baru",
        value: "",
      },
    ]);
  }, [identities, setIdentities]);

  const removeField = useCallback(
    (id: string) => {
      setIdentities(identities.filter((item) => item.id !== id));
    },
    [identities, setIdentities]
  );

  const updateField = useCallback(
    (id: string, field: "label" | "value", newValue: string) => {
      setIdentities(
        identities.map((item) =>
          item.id === id ? { ...item, [field]: newValue } : item
        )
      );
    },
    [identities, setIdentities]
  );

  const loadPresetKuliah = useCallback(() => {
    setIdentities([
      { id: "1", label: "Nama", value: "" },
      { id: "2", label: "NIM", value: "" },
      { id: "3", label: "Mata Kuliah", value: "" },
      { id: "4", label: "Kelas/Prodi", value: "" },
    ]);
  }, [setIdentities]);

  const loadPresetSekolah = useCallback(() => {
    setIdentities([
      { id: "1", label: "Nama", value: "" },
      { id: "2", label: "No. Absen", value: "" },
      { id: "3", label: "Kelas", value: "" },
      { id: "4", label: "Tanggal", value: "" },
    ]);
  }, [setIdentities]);

  return (
    <section className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <label className="flex items-center gap-2 font-bold text-gray-800 text-sm">
          <UserCheck size={17} className="text-blue-600" />
          Identitas Header Kertas
        </label>

        <div className="flex items-center gap-1.5">
          <button
            onClick={addField}
            className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2.5 py-1
                       rounded-lg border border-blue-200 flex items-center
                       gap-1 hover:bg-blue-100 transition-colors cursor-pointer"
          >
            <Plus size={13} /> Tambah Kolom
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {identities.map((item) => (
          <div key={item.id} className="flex gap-2 items-center group">
            <input
              type="text"
              value={item.label}
              onChange={(e) =>
                updateField(item.id, "label", e.target.value)
              }
              placeholder="Label (contoh: Nama)"
              className="w-1/3 text-xs p-2 bg-slate-50 border border-slate-200
                         rounded-lg focus:border-blue-400 focus:bg-white outline-none font-bold text-gray-700
                         transition-all"
            />
            <input
              type="text"
              value={item.value}
              onChange={(e) =>
                updateField(item.id, "value", e.target.value)
              }
              placeholder="Isi data..."
              className="flex-1 text-xs p-2 bg-slate-50/50 border border-slate-200
                         rounded-lg focus:border-blue-400 focus:bg-white outline-none text-gray-800
                         transition-all"
            />
            <button
              onClick={() => removeField(item.id)}
              aria-label={`Hapus field ${item.label}`}
              title="Hapus baris"
              className="text-gray-300 hover:text-red-500 transition-colors
                         p-1 shrink-0 cursor-pointer"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        {identities.length === 0 && (
          <div className="text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-xs text-gray-500 mb-2">
              Tidak ada kolom identitas di bagian atas kertas.
            </p>
            <div className="flex justify-center gap-2">
              <button
                onClick={loadPresetKuliah}
                className="text-[11px] bg-white border border-gray-200 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-50 cursor-pointer"
              >
                Format Kuliah
              </button>
              <button
                onClick={loadPresetSekolah}
                className="text-[11px] bg-white border border-gray-200 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-50 cursor-pointer"
              >
                Format Sekolah
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
