import { useRef, useCallback } from "react";
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
}

export default function PaperPreview({
  text,
  identities,
  settings,
  isFullscreen,
  isGenerating,
  onCloseFullscreen,
  onDownload,
}: PaperPreviewProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const containerWidth = useContainerScale(
    wrapperRef as React.RefObject<HTMLDivElement>
  );
  const scaleProps = useFullscreenScale(isFullscreen);

  const { marginTop, marginBottom, lineHeight } = settings;
  const lineCount = Math.floor(
    (PAPER_HEIGHT - marginTop - marginBottom) / lineHeight
  );

  const totalPages = usePagination(
    contentRef as React.RefObject<HTMLDivElement>,
    {
      text,
      fontSize: settings.fontSize,
      lineHeight: settings.lineHeight,
      fontFamily: settings.fontFamily,
      lineCount,
    }
  );

  // Callback ref yang stabil
  const handleContentRef = useCallback(
    (el: HTMLDivElement | null) => {
      (contentRef as React.MutableRefObject<HTMLDivElement | null>).current =
        el;
    },
    []
  );

  const PADDING = isFullscreen ? 32 : 48;
  const displayScale = isFullscreen
    ? scaleProps
    : containerWidth > 0 && containerWidth < PAPER_WIDTH + PADDING
      ? (containerWidth - PADDING) / PAPER_WIDTH
      : 1;

  const GAP = 32;

  return (
    <div
      ref={wrapperRef}
      className={
        isFullscreen
          ? "fixed inset-0 z-50 bg-gray-900 overflow-y-auto overflow-x-hidden flex flex-col items-center pt-24 pb-12"
          : "lg:col-span-8 bg-gray-300/40 rounded-3xl p-4 sm:p-8 overflow-y-auto overflow-x-hidden flex flex-col items-center shadow-inner"
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

      {/* Container dengan ukuran scaled */}
      <div
        style={{
          height: `${(PAPER_HEIGHT * totalPages + GAP * (totalPages - 1)) * displayScale}px`,
          width: `${PAPER_WIDTH * displayScale}px`,
          position: "relative",
          transition: "width 0.2s ease, height 0.2s ease",
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