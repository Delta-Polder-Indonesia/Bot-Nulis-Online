import { useCallback } from "react";
import { Plus, Trash2, Settings } from "lucide-react";
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
      { id: crypto.randomUUID(), label: "Label Baru", value: "" },
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

  return (
    <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <label className="flex items-center gap-2 font-bold text-gray-700">
          <Settings size={18} /> Identitas Header
        </label>
        <button
          onClick={addField}
          className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1
                     rounded-md border border-blue-200 flex items-center
                     gap-1 hover:bg-blue-100 transition-colors"
        >
          <Plus size={12} /> Tambah
        </button>
      </div>

      <div className="space-y-2.5">
        {identities.map((item) => (
          <div key={item.id} className="flex gap-2 items-center group">
            <input
              type="text"
              value={item.label}
              onChange={(e) =>
                updateField(item.id, "label", e.target.value)
              }
              placeholder="Label"
              className="w-1/3 text-[11px] p-2 bg-gray-50 border border-gray-200
                         rounded-lg focus:border-blue-400 outline-none font-bold
                         transition-colors"
            />
            <input
              type="text"
              value={item.value}
              onChange={(e) =>
                updateField(item.id, "value", e.target.value)
              }
              placeholder="Isi data..."
              className="flex-1 text-[11px] p-2 border border-gray-200
                         rounded-lg focus:border-blue-400 outline-none
                         transition-colors"
            />
            <button
              onClick={() => removeField(item.id)}
              aria-label={`Hapus field ${item.label}`}
              className="text-gray-300 hover:text-red-500 transition-colors
                         opacity-0 group-hover:opacity-100 p-1 shrink-0"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        {identities.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-3">
            Belum ada field identitas.{" "}
            <button
              onClick={addField}
              className="text-blue-500 hover:underline"
            >
              Tambah sekarang
            </button>
          </p>
        )}
      </div>
    </section>
  );
}