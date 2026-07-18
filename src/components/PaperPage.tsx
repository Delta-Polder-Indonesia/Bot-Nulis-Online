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
  } = settings;

  return (
    <div
      id={`paper-page-${pageIndex}`}
      className="relative shrink-0"
      style={{
        width: `${PAPER_WIDTH}px`,
        height: `${PAPER_HEIGHT}px`,
        backgroundColor: "#faf8f2",
        boxShadow: isFullscreen
          ? "0 20px 60px rgba(0,0,0,0.5)"
          : "0 4px 30px rgba(0,0,0,0.15)",
        overflow: "hidden",
      }}
    >
      {/* Garis kertas */}
      <PaperLines
        lineCount={lineCount}
        marginTop={marginTop}
        marginBottom={marginBottom}
        paddingLeft={paddingLeft}
        lineHeight={lineHeight}
        lineColor={lineColor}
        showMarginLine={showMarginLine}
      />

      {/* Watermark SiDU */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "20px",
          left: "40px",
          width: "35px",
          height: "35px",
          border: `1.5px solid ${lineColor}`,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "8px",
          fontWeight: "bold",
          color: lineColor,
          opacity: 0.3,
          zIndex: 5,
          transform: "rotate(-10deg)",
          userSelect: "none",
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
            padding: `16px 40px 8px ${paddingLeft}px`,
          }}
        >
          <div className="grid grid-cols-2 gap-x-8 gap-y-1.5">
            {identities.map((item) => (
              <div
                key={item.id}
                className="flex gap-2 items-baseline"
                style={{
                  fontFamily,
                  fontSize: `${fontSize * 0.85}px`,
                  color: inkColor,
                }}
              >
                <span className="opacity-60 whitespace-nowrap font-semibold shrink-0">
                  {item.label}:
                </span>
                <span
                  className="flex-1 px-1 border-b-2 border-dotted border-gray-400 truncate"
                  style={{ minWidth: "60px", color: inkColor }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Spacer halaman 2+ */}
      {pageIndex > 0 && (
        <div style={{ height: `${marginTop}px`, position: "relative", zIndex: 2 }} />
      )}

      {/* Konten Utama */}
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

      {/* Penutup margin bawah */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: `${marginBottom}px`,
          backgroundColor: "#faf8f2",
          zIndex: 2,
        }}
      />
    </div>
  );
});

export default PaperPage;