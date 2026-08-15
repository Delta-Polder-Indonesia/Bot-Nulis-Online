import { useRef, useState, useEffect, useCallback } from "react";
import { PAPER_WIDTH, PAPER_HEIGHT } from "../constants";
import type { IdentityField, PaperSettings } from "../types";
import { useContainerScale } from "../hooks/useContainerScale";
import { usePagination } from "../hooks/usePagination";
import { useFullscreenScale } from "../hooks/useFullscreenScale";
import FullscreenToolbar from "./FullscreenToolbar";
import PaperPage from "./PaperPage";

interface PaperPreviewProps {
  text: string;
  identities: IdentityField[];
  settings: PaperSettings;
  isFullscreen: boolean;
  isGenerating: boolean;
  onCloseFullscreen: () => void;
  onDownload: (totalPages: number) => void;
  onTotalPagesChange?: (pages: number) => void;
}

export default function PaperPreview({
  text,
  identities,
  settings,
  isFullscreen,
  isGenerating,
  onCloseFullscreen,
  onDownload,
  onTotalPagesChange,
}: PaperPreviewProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [contentElement, setContentElement] = useState<HTMLDivElement | null>(null);

  const containerWidth = useContainerScale(wrapperRef);
  const scaleFullscreen = useFullscreenScale(isFullscreen);

  const { marginTop, marginBottom, lineHeight } = settings;
  const lineCount = Math.max(
    5,
    Math.floor((PAPER_HEIGHT - marginTop - marginBottom) / lineHeight)
  );

  const totalPages = usePagination(contentElement, {
    text,
    fontSize: settings.fontSize,
    lineHeight: settings.lineHeight,
    fontFamily: settings.fontFamily,
    lineCount,
  });

  // Sinkronisasi total halaman ke parent component
  useEffect(() => {
    onTotalPagesChange?.(totalPages);
  }, [totalPages, onTotalPagesChange]);

  // Shortcut tombol Escape untuk keluar dari fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        onCloseFullscreen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, onCloseFullscreen]);

  const handleContentRef = useCallback((el: HTMLDivElement | null) => {
    setContentElement(el);
  }, []);

  const PADDING = isFullscreen ? 32 : 48;
  const displayScale = isFullscreen
    ? scaleFullscreen
    : containerWidth > 0 && containerWidth < PAPER_WIDTH + PADDING
      ? Math.max(0.2, (containerWidth - PADDING) / PAPER_WIDTH)
      : 1;

  const GAP = 32;

  return (
    <div
      ref={wrapperRef}
      className={
        isFullscreen
          ? "fixed inset-0 z-50 bg-gray-900/95 backdrop-blur-sm overflow-y-auto overflow-x-hidden flex flex-col items-center pt-24 pb-12"
          : "lg:col-span-8 bg-slate-200/60 rounded-3xl p-4 sm:p-8 overflow-y-auto overflow-x-hidden flex flex-col items-center shadow-inner min-h-[500px]"
      }
    >
      {isFullscreen && (
        <FullscreenToolbar
          totalPages={totalPages}
          isGenerating={isGenerating}
          onDownload={() => onDownload(totalPages)}
          onClose={onCloseFullscreen}
        />
      )}

      {/* Container dengan ukuran yang sudah di-scale */}
      <div
        style={{
          height: `${(PAPER_HEIGHT * totalPages + GAP * (totalPages - 1)) * displayScale}px`,
          width: `${PAPER_WIDTH * displayScale}px`,
          position: "relative",
          transition: "width 0.15s ease-out, height 0.15s ease-out",
        }}
      >
        <div
          style={{
            transform: `scale(${displayScale})`,
            transformOrigin: "top left",
            display: "flex",
            flexDirection: "column",
            gap: `${GAP}px`,
            position: "absolute",
            top: 0,
            left: 0,
            width: `${PAPER_WIDTH}px`,
          }}
        >
          {Array.from({ length: totalPages }).map((_, pageIndex) => (
            <PaperPage
              key={`page-${pageIndex}`}
              pageIndex={pageIndex}
              totalPages={totalPages}
              text={text}
              identities={identities}
              settings={settings}
              lineCount={lineCount}
              onContentRef={pageIndex === 0 ? handleContentRef : undefined}
              isFullscreen={isFullscreen}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
