import { Download, X } from "lucide-react";

interface FullscreenToolbarProps {
  totalPages: number;
  isGenerating: boolean;
  onDownload: () => void;
  onClose: () => void;
}

export default function FullscreenToolbar({
  totalPages,
  isGenerating,
  onDownload,
  onClose,
}: FullscreenToolbarProps) {
  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2
                 bg-white/10 backdrop-blur-md border border-white/20
                 text-white px-4 py-3 rounded-2xl flex items-center
                 gap-4 z-50 shadow-2xl"
    >
      <div className="text-xs leading-relaxed">
        <span className="text-gray-300">Screenshot:</span>{" "}
        <kbd className="bg-white/20 px-1.5 py-0.5 rounded text-yellow-300 font-mono text-xs">
          Win+Shift+S
        </kbd>
      </div>

      <div className="h-6 w-px bg-white/30" />

      <button
        onClick={onDownload}
        disabled={isGenerating}
        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50
                   px-4 py-2 rounded-xl text-sm font-bold flex items-center
                   gap-2 transition-all active:scale-95"
      >
        <Download size={16} />
        {isGenerating ? "Menyimpan..." : `Download ${totalPages} PNG`}
      </button>

      <button
        onClick={onClose}
        className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-xl
                   text-sm font-bold flex items-center gap-2 transition-all
                   active:scale-95"
        aria-label="Tutup pratinjau"
      >
        <X size={16} />
        <span className="hidden sm:inline">Tutup</span>
      </button>
    </div>
  );
}