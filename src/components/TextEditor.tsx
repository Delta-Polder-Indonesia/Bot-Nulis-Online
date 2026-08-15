import { useRef, useCallback, useEffect } from "react";
import {
  Type,
  Eraser,
  Undo2,
  Redo2,
  Shapes,
  Sigma,
} from "lucide-react";
import { MATH_SYMBOLS, TEXT_TEMPLATES } from "../constants";
import { useUndoRedo } from "../hooks/useUndoRedo";
import { useTextStats } from "../hooks/useTextStats";

interface TextEditorProps {
  text: string;
  setText: (text: string) => void;
}

export default function TextEditor({ text, setText }: TextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { value, setValue, undo, redo, canUndo, canRedo, reset } =
    useUndoRedo(text);
  const stats = useTextStats(value);

  // Sinkronisasi jika text berubah dari luar (misal load template/preset)
  useEffect(() => {
    if (text !== value) {
      reset(text);
    }
  }, [text, value, reset]);

  const handleChange = useCallback(
    (newText: string) => {
      setValue(newText);
      setText(newText);
    },
    [setValue, setText]
  );

  const handleUndo = useCallback(() => {
    const prev = undo();
    if (prev !== null) {
      setText(prev);
    }
  }, [undo, setText]);

  const handleRedo = useCallback(() => {
    const next = redo();
    if (next !== null) {
      setText(next);
    }
  }, [redo, setText]);

  const insertSymbol = useCallback(
    (symbol: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const current = textarea.value;
      const newText =
        current.substring(0, start) + symbol + current.substring(end);

      handleChange(newText);

      const newCursorPos = start + symbol.length;
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      });
    },
    [handleChange]
  );

  const handleSelectTemplate = useCallback(
    (templateId: string) => {
      const t = TEXT_TEMPLATES.find((item) => item.id === templateId);
      if (t) {
        handleChange(t.text);
      }
    },
    [handleChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z" && !e.shiftKey) {
          e.preventDefault();
          handleUndo();
        } else if (e.key === "y" || (e.key === "z" && e.shiftKey)) {
          e.preventDefault();
          handleRedo();
        }
      }
    },
    [handleUndo, handleRedo]
  );

  const mathFormulas = MATH_SYMBOLS.filter((s) => s.value.startsWith("$$"));
  const shapeSymbols = MATH_SYMBOLS.filter((s) => s.value.startsWith("[shape:"));
  const otherSymbols = MATH_SYMBOLS.filter(
    (s) => !s.value.startsWith("$$") && !s.value.startsWith("[shape:")
  );

  return (
    <section className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <label className="flex items-center gap-2 font-bold text-gray-800 text-sm">
          <Type size={17} className="text-blue-600" />
          Konten Tulisan
        </label>

        <div className="flex items-center gap-1">
          {/* Template dropdown */}
          <div className="relative group mr-1">
            <select
              aria-label="Pilih template teks contoh"
              onChange={(e) => {
                if (e.target.value) {
                  handleSelectTemplate(e.target.value);
                  e.target.value = "";
                }
              }}
              defaultValue=""
              className="text-[11px] bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-2 py-1 rounded-lg border border-blue-200 outline-none cursor-pointer"
            >
              <option value="" disabled>
                Template Teks ▾
              </option>
              {TEXT_TEMPLATES.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  {tpl.title}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30
                       text-gray-600 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <Undo2 size={15} />
          </button>
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30
                       text-gray-600 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <Redo2 size={15} />
          </button>
          <div className="w-px h-4 bg-gray-200 mx-1" />
          <button
            onClick={() => handleChange("")}
            title="Hapus semua teks"
            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50
                       transition-colors cursor-pointer"
          >
            <Eraser size={15} />
          </button>
        </div>
      </div>

      {/* Quick Insert Symbols & Formulas */}
      <div className="mb-3 space-y-2">
        <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-500">
          <Sigma size={13} className="text-indigo-500" />
          <span>Sisipkan Rumus & Simbol:</span>
        </div>
        <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto pr-1">
          {/* Math Formulas */}
          {mathFormulas.map((sym, i) => (
            <button
              key={`math-${i}`}
              onClick={() => insertSymbol(sym.value)}
              title={`Sisipkan rumus: ${sym.label}`}
              className="px-2 py-1 text-xs bg-slate-50 hover:bg-blue-50
                         text-slate-700 hover:text-blue-700 rounded-md border
                         border-slate-200 hover:border-blue-300 font-mono
                         transition-all cursor-pointer font-medium"
            >
              {sym.display}
            </button>
          ))}

          {/* Shapes */}
          {shapeSymbols.map((sym, i) => (
            <button
              key={`shape-${i}`}
              onClick={() => insertSymbol(`\n${sym.value}\n`)}
              title={`Sisipkan bentuk: ${sym.label}`}
              className="px-2 py-1 text-xs bg-amber-50 hover:bg-amber-100
                         text-amber-800 rounded-md border
                         border-amber-200 font-medium
                         transition-all cursor-pointer flex items-center gap-1"
            >
              <Shapes size={11} />
              {sym.display}
            </button>
          ))}

          {/* Greek & Math operators */}
          {otherSymbols.map((sym, i) => (
            <button
              key={`op-${i}`}
              onClick={() => insertSymbol(sym.value)}
              title={`Sisipkan simbol: ${sym.label}`}
              className="px-2 py-1 text-xs bg-slate-50 hover:bg-blue-50
                         text-slate-700 hover:text-blue-700 rounded-md border
                         border-slate-200 hover:border-blue-300 font-mono
                         transition-all cursor-pointer font-medium"
            >
              {sym.display}
            </button>
          ))}
        </div>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={7}
        className="w-full p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm
                   focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-y
                   leading-relaxed font-mono transition-all placeholder:text-gray-400 min-h-[140px]"
        placeholder="Tuliskan isi tugas di sini... Gunakan syntax $$...$$ untuk rumus KaTeX atau [shape:circle] untuk bangun datar."
        spellCheck={false}
      />

      {/* Stats Bar */}
      <div className="flex justify-between items-center mt-2 px-1 text-[11px] text-gray-500 font-medium">
        <div className="flex items-center gap-2">
          <span>{stats.wordCount} kata</span>
          <span>·</span>
          <span>{stats.lineCount} baris</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{stats.charCount} karakter</span>
          <span>·</span>
          <span className="text-gray-400">~{stats.readingTimeMinutes} mnt baca</span>
        </div>
      </div>
    </section>
  );
}
