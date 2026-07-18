import { useRef, useCallback } from "react";
import { Type, Eraser, Undo2, Redo2 } from "lucide-react";
import { MATH_SYMBOLS } from "../constants";
import { useUndoRedo } from "../hooks/useUndoRedo";
import { useTextStats } from "../hooks/useTextStats";

interface TextEditorProps {
  text: string;
  setText: (text: string) => void;
}

export default function TextEditor({ text, setText }: TextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { value, setValue, undo, redo, canUndo, canRedo } =
    useUndoRedo(text);
  const stats = useTextStats(value);

  const handleChange = useCallback(
    (newText: string) => {
      setValue(newText);
      setText(newText);
    },
    [setValue, setText]
  );

  const handleUndo = useCallback(() => {
    undo();
    // Sync parent setelah undo
    requestAnimationFrame(() => {
      setText(textareaRef.current?.value ?? "");
    });
  }, [undo, setText]);

  const handleRedo = useCallback(() => {
    redo();
    requestAnimationFrame(() => {
      setText(textareaRef.current?.value ?? "");
    });
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
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      });
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

  return (
    <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <label className="flex items-center gap-2 font-bold text-gray-700">
          <Type size={18} /> Konten Tugas
        </label>
        <div className="flex items-center gap-1">
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30
                       text-gray-500 transition-colors"
          >
            <Undo2 size={14} />
          </button>
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30
                       text-gray-500 transition-colors"
          >
            <Redo2 size={14} />
          </button>
          <div className="w-px h-4 bg-gray-200 mx-1" />
          <button
            onClick={() => handleChange("")}
            title="Hapus semua"
            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50
                       transition-colors"
          >
            <Eraser size={14} />
          </button>
        </div>
      </div>

      {/* Symbol Buttons */}
      <div className="mb-3 flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
        {MATH_SYMBOLS.map((sym, i) => (
          <button
            key={i}
            onClick={() => insertSymbol(sym.value)}
            title={sym.label}
            className="px-2 py-1.5 text-xs bg-gray-50 hover:bg-blue-50
                       text-gray-700 hover:text-blue-600 rounded border
                       border-gray-200 hover:border-blue-300 font-mono
                       transition-colors"
          >
            {sym.display}
          </button>
        ))}
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full h-44 p-3 bg-gray-50 border rounded-xl text-sm
                   focus:ring-2 focus:ring-blue-500 outline-none resize-none
                   leading-relaxed font-mono transition-shadow"
        placeholder="Tuliskan isi tugas... Gunakan $$...$$ untuk rumus LaTeX"
        spellCheck={false}
      />

      {/* Stats Bar */}
      <div className="flex justify-between items-center mt-1.5 px-1">
        <span className="text-[10px] text-gray-400">
          {stats.wordCount} kata · {stats.lineCount} baris
        </span>
        <span className="text-[10px] text-gray-400">
          {stats.charCount} karakter · ~{stats.readingTimeMinutes} mnt baca
        </span>
      </div>
    </section>
  );
}