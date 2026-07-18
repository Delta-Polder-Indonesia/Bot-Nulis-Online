import { FileText, Maximize, Download } from "lucide-react";

interface HeaderProps {
  onFullscreen: () => void;
  onDownload: () => void;
  isGenerating: boolean;
  totalPages: number;
}

export default function Header({
  onFullscreen,
  onDownload,
  isGenerating,
  totalPages,
}: HeaderProps) {
  return (
    <header className="bg-white border-b sticky top-0 z-20 px-4 py-3 shadow-sm flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <FileText size={20} />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-none">
            Bot Nulis Online
          </h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-tighter">
            Tulisan tangan · Text to Handwriting
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onDownload}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 bg-green-600
                     hover:bg-green-700 disabled:opacity-50 text-white
                     rounded-full text-sm font-semibold transition-all
                     shadow-md active:scale-95"
        >
          <Download size={16} />
          <span className="hidden sm:inline">
            {isGenerating
              ? "Menyimpan..."
              : `Download (${totalPages} hal)`}
          </span>
          <span className="sm:hidden">
            {isGenerating ? "..." : `${totalPages}`}
          </span>
        </button>

        <button
          onClick={onFullscreen}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600
                     hover:bg-blue-700 text-white rounded-full font-semibold
                     transition-all shadow-md active:scale-95 text-sm"
        >
          <Maximize size={16} />
          <span className="hidden sm:inline">Pratinjau Full</span>
        </button>
      </div>
    </header>
  );
}