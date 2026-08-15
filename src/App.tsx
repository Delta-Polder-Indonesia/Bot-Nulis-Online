import { useState, useCallback } from "react";
import {
  DEFAULT_TEXT,
  LINE_HEIGHT_DEFAULT,
  MARGIN_TOP_DEFAULT,
  MARGIN_LEFT_DEFAULT,
  PAPER_WIDTH,
  PAPER_HEIGHT,
  STORAGE_KEY_SETTINGS,
  STORAGE_KEY_TEXT,
  STORAGE_KEY_IDENTITIES,
} from "./constants";
import type { IdentityField, PaperSettings } from "./types";
import { useLocalStorage } from "./hooks/useLocalStorage";
import Header from "./components/Header";
import EditorPanel from "./components/EditorPanel";
import PaperPreview from "./components/PaperPreview";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";

const DEFAULT_SETTINGS: PaperSettings = {
  fontFamily: "Kalam",
  fontSize: 18,
  lineHeight: LINE_HEIGHT_DEFAULT,
  inkColor: "#1a237e",
  handwritingRoughness: 0.35,
  marginTop: MARGIN_TOP_DEFAULT,
  marginBottom: 70,
  paddingLeft: MARGIN_LEFT_DEFAULT,
  showMarginLine: true,
  lineColor: "#1e3a8a",
  paperPattern: "folio",
  textVerticalPosition: "line",
};

const DEFAULT_IDENTITIES: IdentityField[] = [
  { id: "1", label: "Nama", value: "" },
  { id: "2", label: "NIM/NPM", value: "" },
  { id: "3", label: "Mata Kuliah", value: "" },
  { id: "4", label: "Kelas", value: "" },
];

export default function App() {
  // State dengan auto-save ke localStorage
  const [text, setText] = useLocalStorage(STORAGE_KEY_TEXT, DEFAULT_TEXT);
  const [settings, setSettings] = useLocalStorage(
    STORAGE_KEY_SETTINGS,
    DEFAULT_SETTINGS
  );
  const [identities, setIdentities] = useLocalStorage(
    STORAGE_KEY_IDENTITIES,
    DEFAULT_IDENTITIES
  );

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  // Update satu properti setting
  const updateSetting = useCallback(
    <K extends keyof PaperSettings>(key: K, value: PaperSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    [setSettings]
  );

  // Load preset langsung menggantikan semua settings
  const handleLoadPreset = useCallback(
    (newSettings: PaperSettings) => {
      setSettings(newSettings);
    },
    [setSettings]
  );

  // Download high-resolution PNG untuk setiap halaman
  const handleDownload = useCallback(
    async (pagesToDownload: number) => {
      if (pagesToDownload <= 0) return;
      setIsGenerating(true);

      try {
        if (document.fonts) {
          await document.fonts.ready;
        }
        await new Promise((resolve) => setTimeout(resolve, 300));

        const { toPng } = await import("html-to-image");

        for (let i = 0; i < pagesToDownload; i++) {
          const originalElement = document.getElementById(`paper-page-${i}`);
          if (!originalElement) continue;

          // Buat clone element di luar pandangan tapi tetap dalam viewport agar rendering 100% presisi
          const clone = originalElement.cloneNode(true) as HTMLDivElement;

          Object.assign(clone.style, {
            position: "fixed",
            top: "0px",
            left: "0px",
            zIndex: "-9999",
            width: `${PAPER_WIDTH}px`,
            height: `${PAPER_HEIGHT}px`,
            transform: "none",
            boxShadow: "none",
            pointerEvents: "none",
          });

          document.body.appendChild(clone);

          // Render ulang KaTeX jika ada rumus
          clone.querySelectorAll("[data-latex]").forEach((el) => {
            const span = el as HTMLSpanElement;
            const latex = span.dataset.latex;
            if (window.katex && latex) {
              try {
                window.katex.render(latex, span, {
                  throwOnError: false,
                  displayMode: false,
                  strict: false,
                  trust: true,
                });
              } catch (e) {
                console.error("KaTeX export render error:", e);
              }
            }
          });

          // Tunggu sebentar untuk paint
          await new Promise((resolve) => setTimeout(resolve, 200));

          const dataUrl = await toPng(clone, {
            pixelRatio: 2, // Resolusi tinggi (300 DPI equivalent)
            backgroundColor: "#faf8f2",
            width: PAPER_WIDTH,
            height: PAPER_HEIGHT,
            style: {
              transform: "scale(1)",
              transformOrigin: "top left",
            },
          });

          document.body.removeChild(clone);

          // Trigger download
          const link = document.createElement("a");
          link.href = dataUrl;
          const pageSuffix = pagesToDownload > 1 ? `-Halaman-${i + 1}` : "";
          link.download = `Tugas-Folio${pageSuffix}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Jeda antar download jika ada beberapa halaman
          if (i < pagesToDownload - 1) {
            await new Promise((r) => setTimeout(r, 400));
          }
        }
      } catch (error) {
        console.error("Download error:", error);
        alert(
          "Gagal mengekspor gambar. Pastikan browser mendukung Canvas HTML5.\n" +
            (error as Error).message
        );
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-gray-800 selection:bg-blue-200">
        {!isFullscreen && (
          <Header
            onFullscreen={() => setIsFullscreen(true)}
            onDownload={() => handleDownload(totalPages)}
            isGenerating={isGenerating}
            totalPages={totalPages}
          />
        )}

        <main
          className={`
            flex-1 max-w-[1600px] w-full mx-auto
            ${isFullscreen ? "p-0" : "p-3 sm:p-5 lg:p-6"}
            grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6
            ${isFullscreen ? "" : "lg:h-[calc(100vh-64px)]"}
          `}
        >
          {!isFullscreen && (
            <EditorPanel
              text={text}
              setText={setText}
              identities={identities}
              setIdentities={setIdentities}
              settings={settings}
              onUpdateSetting={updateSetting}
              onLoadPreset={handleLoadPreset}
            />
          )}

          <ErrorBoundary
            fallback={
              <div className="lg:col-span-8 flex items-center justify-center text-gray-500 bg-white rounded-3xl p-8 border border-gray-200">
                <div className="text-center p-8">
                  <div className="text-4xl mb-3">📄</div>
                  <p className="font-semibold text-gray-800">
                    Pratinjau Kertas Tidak Tersedia
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Silakan periksa kembali formula atau pengaturan Anda
                  </p>
                </div>
              </div>
            }
          >
            <PaperPreview
              text={text}
              identities={identities}
              settings={settings}
              isFullscreen={isFullscreen}
              isGenerating={isGenerating}
              onCloseFullscreen={() => setIsFullscreen(false)}
              onDownload={handleDownload}
              onTotalPagesChange={setTotalPages}
            />
          </ErrorBoundary>
        </main>
      </div>
    </ErrorBoundary>
  );
}
