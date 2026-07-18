import { useState, useMemo, useCallback } from "react";
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
  handwritingRoughness: 0.4,
  marginTop: MARGIN_TOP_DEFAULT,
  marginBottom: 70,
  paddingLeft: MARGIN_LEFT_DEFAULT,
  showMarginLine: true,
  lineColor: "#64748b",
};

const DEFAULT_IDENTITIES: IdentityField[] = [
  { id: "1", label: "Nama", value: "" },
  { id: "2", label: "NIM/NPM", value: "" },
  { id: "3", label: "Mata Kuliah", value: "" },
  { id: "4", label: "Kelas", value: "" },
];

export default function App() {
  // Persistent state via localStorage
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
  const [totalPagesForHeader, setTotalPagesForHeader] = useState(1);

  // Update satu key setting saja
  const updateSetting = useCallback(
    <K extends keyof PaperSettings>(key: K, value: PaperSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    [setSettings]
  );

  // Load preset langsung replace semua settings
  const handleLoadPreset = useCallback(
    (newSettings: PaperSettings) => {
      setSettings(newSettings);
    },
    [setSettings]
  );

  // Hitung lineCount untuk keperluan download
  const lineCount = useMemo(() => {
    return Math.floor(
      (PAPER_HEIGHT - settings.marginTop - settings.marginBottom) /
        settings.lineHeight
    );
  }, [settings.marginTop, settings.marginBottom, settings.lineHeight]);

  const handleDownload = useCallback(
    async (totalPages: number) => {
      if (totalPages === 0) return;
      setIsGenerating(true);

      try {
        await document.fonts.ready;
        await new Promise((resolve) => setTimeout(resolve, 800));

        const { toPng } = await import("html-to-image");

        for (let i = 0; i < totalPages; i++) {
          const originalElement = document.getElementById(`paper-page-${i}`);
          if (!originalElement) continue;

          const clone = originalElement.cloneNode(true) as HTMLDivElement;

          Object.assign(clone.style, {
            position: "fixed",
            top: "-9999px",
            left: "-9999px",
            width: `${PAPER_WIDTH}px`,
            height: `${PAPER_HEIGHT}px`,
            transform: "none",
          });

          document.body.appendChild(clone);

          // Re-render KaTeX dalam clone
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
                console.error("KaTeX render error:", e);
              }
            }
          });

          await new Promise((resolve) => setTimeout(resolve, 500));

          const dataUrl = await toPng(clone, {
            pixelRatio: 2,
            backgroundColor: "#faf8f2",
            width: PAPER_WIDTH,
            height: PAPER_HEIGHT,
            style: { transform: "scale(1)", transformOrigin: "top left" },
          });

          document.body.removeChild(clone);

          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = `Tugas-Folio-Hal-${i + 1}-${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Jeda antar halaman agar browser tidak overwhelmed
          if (i < totalPages - 1) {
            await new Promise((r) => setTimeout(r, 400));
          }
        }
      } catch (error) {
        console.error("Download error:", error);
        alert(
          "Gagal membuat gambar. Pastikan konten valid.\n" +
            (error as Error).message
        );
      } finally {
        setIsGenerating(false);
      }
    },
    [lineCount]
  );

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100 flex flex-col font-sans text-gray-800">
        {!isFullscreen && (
          <Header
            onFullscreen={() => setIsFullscreen(true)}
            onDownload={() => handleDownload(totalPagesForHeader)}
            isGenerating={isGenerating}
            totalPages={totalPagesForHeader}
          />
        )}

        <main
          className={`
            flex-1 max-w-[1600px] w-full mx-auto
            ${isFullscreen ? "p-0" : "p-4 sm:p-6"}
            grid grid-cols-1 lg:grid-cols-12 gap-6
            ${isFullscreen ? "" : "h-[calc(100vh-64px)]"}
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
              <div className="lg:col-span-8 flex items-center justify-center text-gray-500 bg-white rounded-2xl">
                <div className="text-center p-8">
                  <div className="text-4xl mb-3">📄</div>
                  <p className="font-semibold">Preview tidak tersedia</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Periksa konten LaTeX atau settings Anda
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
              onDownload={(pages) => {
                setTotalPagesForHeader(pages);
                handleDownload(pages);
              }}
            />
          </ErrorBoundary>
        </main>
      </div>
    </ErrorBoundary>
  );
}