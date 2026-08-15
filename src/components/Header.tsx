import { memo } from "react";
import { FileText, Maximize, Download, Sparkles } from "lucide-react";

interface HeaderProps {
  onFullscreen: () => void;
  onDownload: () => void;
  isGenerating: boolean;
  totalPages: number;
}

const Header = memo(function Header({
  onFullscreen,
  onDownload,
  isGenerating,
  totalPages,
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200/80 sticky top-0 z-30 px-4 sm:px-6 py-3 shadow-xs flex justify-between items-center transition-all">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-tr from-blue-700 to-indigo-500 p-2.5 rounded-xl text-white shadow-md shadow-blue-500/20">
          <FileText size={22} className="stroke-[2.2]" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
              Bot Nulis Online
            </h1>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
              <Sparkles size={10} /> v1.0
            </span>
          </div>
          <p className="text-[11px] text-gray-500 font-medium">
            Text to Handwriting Folio · Dukungan Rumus KaTeX
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onDownload}
          disabled={isGenerating}
          title={`Download ${totalPages} halaman gambar PNG`}
          className="flex items-center gap-2 px-3.5 sm:px-5 py-2 bg-emerald-600
                     hover:bg-emerald-700 disabled:opacity-50 text-white
                     rounded-xl text-xs sm:text-sm font-semibold transition-all
                     shadow-sm hover:shadow-md active:scale-95 cursor-pointer disabled:cursor-not-allowed"
        >
          <Download size={16} className={isGenerating ? "animate-bounce" : ""} />
          <span className="hidden sm:inline">
            {isGenerating ? "Sedang Mengunduh..." : `Download (${totalPages} Hal)`}
          </span>
          <span className="sm:hidden">
            {isGenerating ? "..." : `${totalPages} Hal`}
          </span>
        </button>

        <button
          onClick={onFullscreen}
          title="Lihat Pratinjau Layar Penuh"
          className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-blue-600
                     hover:bg-blue-700 text-white rounded-xl font-semibold
                     transition-all shadow-sm hover:shadow-md active:scale-95 text-xs sm:text-sm cursor-pointer"
        >
          <Maximize size={15} />
          <span className="hidden md:inline">Fullscreen</span>
        </button>
      </div>
    </header>
  );
});

export default Header;
