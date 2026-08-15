import { memo } from "react";
import { PAPER_WIDTH, PAPER_HEIGHT } from "../constants";
import type { PaperPageProps } from "../types";
import PaperLines from "./PaperLines";
import PaperContent from "./PaperContent";

const PaperPage = memo(function PaperPage({
  pageIndex,
  text,
  identities,
  settings,
  lineCount,
  onContentRef,
  isFullscreen,
}: PaperPageProps) {
  const {
    fontFamily,
    fontSize,
    lineHeight,
    inkColor,
    handwritingRoughness,
    marginTop,
    marginBottom,
    paddingLeft,
    showMarginLine,
    lineColor,
    paperPattern = "folio",
  } = settings;

  const hasIdentities = identities.some((item) => item.label || item.value);

  return (
    <div
      id={`paper-page-${pageIndex}`}
      className="relative shrink-0 select-none"
      style={{
        width: `${PAPER_WIDTH}px`,
        height: `${PAPER_HEIGHT}px`,
        backgroundColor: "#faf8f2",
        boxShadow: isFullscreen
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)"
          : "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        borderRadius: isFullscreen ? "4px" : "8px",
      }}
    >
      {/* Garis-garis kertas (Folio / Grid / Blank) */}
      <PaperLines
        lineCount={lineCount}
        marginTop={marginTop}
        marginBottom={marginBottom}
        paddingLeft={paddingLeft}
        lineHeight={lineHeight}
        lineColor={lineColor}
        showMarginLine={showMarginLine}
        paperPattern={paperPattern}
      />

      {/* Watermark SiDU Khas Kertas Sekolah */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "22px",
          left: "36px",
          width: "36px",
          height: "36px",
          border: `1.5px solid ${lineColor}`,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "8.5px",
          fontWeight: "bold",
          letterSpacing: "0.5px",
          color: lineColor,
          opacity: 0.35,
          zIndex: 5,
          transform: "rotate(-12deg)",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        SiDU
      </div>

      {/* Header Identitas (Halaman 1 saja) */}
      {pageIndex === 0 && (
        <div
          style={{
            position: "relative",
            zIndex: 2,
            height: `${marginTop}px`,
            padding: `14px 40px 6px ${paddingLeft}px`,
          }}
        >
          {hasIdentities && (
            <div className="grid grid-cols-2 gap-x-8 gap-y-1.5">
              {identities.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-2 items-baseline"
                  style={{
                    fontFamily,
                    fontSize: `${fontSize * 0.88}px`,
                    color: inkColor,
                  }}
                >
                  <span className="opacity-65 whitespace-nowrap font-semibold shrink-0">
                    {item.label}:
                  </span>
                  <span
                    className="flex-1 px-1 border-b border-dotted border-gray-400 truncate"
                    style={{ minWidth: "50px", color: inkColor }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Spacer halaman 2+ */}
      {pageIndex > 0 && (
        <div
          style={{
            height: `${marginTop}px`,
            position: "relative",
            zIndex: 2,
          }}
        />
      )}

      {/* Konten Utama Tulisan */}
      <PaperContent
        text={text}
        pageIndex={pageIndex}
        lineCount={lineCount}
        paddingLeft={paddingLeft}
        fontFamily={fontFamily}
        fontSize={fontSize}
        lineHeight={lineHeight}
        inkColor={inkColor}
        handwritingRoughness={handwritingRoughness}
        onContentRef={onContentRef}
      />

      {/* Penutup margin bawah kertas */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: `${marginBottom}px`,
          backgroundColor: "#faf8f2",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
    </div>
  );
});

export default PaperPage;
