import { memo } from "react";
import { Download, X } from "lucide-react";

interface FullscreenToolbarProps {
  totalPages: number;
  isGenerating: boolean;
  onDownload: () => void;
  onClose: () => void;
}

const FullscreenToolbar = memo(function FullscreenToolbar({
  totalPages,
  isGenerating,
  onDownload,
  onClose,
}: FullscreenToolbarProps) {
  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2
                 bg-gray-900/80 backdrop-blur-md border border-white/20
                 text-white px-4 py-2.5 rounded-2xl flex items-center
                 gap-3.5 z-50 shadow-2xl transition-all"
    >
      <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-300">
        <span>Keluar:</span>
        <kbd className="bg-white/15 px-2 py-0.5 rounded text-yellow-300 font-mono text-[11px] font-bold border border-white/10">
          ESC
        </kbd>
      </div>

      <div className="hidden sm:block h-5 w-px bg-white/20" />

      <button
        onClick={onDownload}
        disabled={isGenerating}
        className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50
                   px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center
                   gap-2 transition-all active:scale-95 shadow-md cursor-pointer disabled:cursor-not-allowed"
      >
        <Download size={15} />
        <span>
          {isGenerating ? "Menyimpan..." : `Download ${totalPages} PNG`}
        </span>
      </button>

      <button
        onClick={onClose}
        className="bg-gray-800 hover:bg-gray-700 px-3.5 py-2 rounded-xl
                   text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all
                   active:scale-95 border border-white/10 cursor-pointer"
        aria-label="Tutup pratinjau"
      >
        <X size={15} />
        <span>Tutup</span>
      </button>
    </div>
  );
});

export default FullscreenToolbar;
