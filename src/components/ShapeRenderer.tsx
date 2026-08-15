import { useMemo } from "react";
import type { ShapeRendererProps } from "../types";
import { seededRandom } from "../utils/seededRandom";

export default function ShapeRenderer({
  type,
  color,
  size = 50,
  lineHeight = 32,
  roughness = 2,
}: ShapeRendererProps) {
  // Posisikan bentuk agar pusatnya berada di tengah-tengah jarak antar garis,
  // tanpa ikut menentukan tinggi line box (wrapper height: 0 + overflow visible).
  const marginTop = (lineHeight - size) / 2;

  const shapeData = useMemo(() => {
    const wobble = (val: number, seed: string) =>
      val + (seededRandom(`shape-${type}-${seed}`) - 0.5) * roughness;

    if (type === "triangle") {
      return {
        p1: `${wobble(50, "p1x")},${wobble(15, "p1y")}`,
        p2: `${wobble(85, "p2x")},${wobble(85, "p2y")}`,
        p3: `${wobble(15, "p3x")},${wobble(85, "p3y")}`,
      };
    }

    if (type === "circle") {
      return {
        rx: wobble(34, "rx"),
        ry: wobble(34, "ry"),
      };
    }

    if (type === "square") {
      return {
        x: wobble(20, "x"),
        y: wobble(20, "y"),
        w: wobble(60, "w"),
        h: wobble(60, "h"),
        rotate: (seededRandom("shape-square-rot") - 0.5) * 2,
      };
    }

    if (type === "star") {
      return {
        d: `M 50 ${wobble(10, "s1")} L ${wobble(62, "s2")} ${wobble(38, "s3")} L ${wobble(92, "s4")} ${wobble(38, "s5")} L ${wobble(68, "s6")} ${wobble(58, "s7")} L ${wobble(78, "s8")} ${wobble(88, "s9")} L 50 ${wobble(70, "s10")} L ${wobble(22, "s11")} ${wobble(88, "s12")} L ${wobble(32, "s13")} ${wobble(58, "s14")} L ${wobble(8, "s15")} ${wobble(38, "s16")} L ${wobble(38, "s17")} ${wobble(38, "s18")} Z`,
      };
    }

    return {};
  }, [type, roughness]);

  const svgProps = {
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 100 100",
    style: {
      display: "block",
      marginTop: `${marginTop}px`,
    },
  };

  // Wrapper "nol-tinggi": bentuk yang lebih tinggi dari satu baris tetap
  // digambar utuh, tetapi tidak menambah tinggi line box sehingga baris
  // berikutnya tidak terdorong turun.
  const wrapperStyle: React.CSSProperties = {
    display: "inline-block",
    height: 0,
    overflow: "visible",
    verticalAlign: "top",
  };

  const roughFilter = (
    <defs>
      <filter id={`roughPaper-${type}`}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.04"
          numOctaves="4"
          result="noise"
        />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.8" />
      </filter>
    </defs>
  );

  const strokeProps = {
    fill: "none",
    stroke: color,
    strokeWidth: "2.5",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    style: { filter: `url(#roughPaper-${type})` },
  };

  const svg = (() => {
    if (type === "triangle" && "p1" in shapeData) {
      return (
        <svg {...svgProps}>
          {roughFilter}
          <path
            d={`M ${shapeData.p1} L ${shapeData.p2} L ${shapeData.p3} Z`}
            {...strokeProps}
          />
        </svg>
      );
    }

    if (type === "circle" && "rx" in shapeData) {
      return (
        <svg {...svgProps}>
          {roughFilter}
          <ellipse
            cx="50"
            cy="50"
            rx={shapeData.rx}
            ry={shapeData.ry}
            {...strokeProps}
          />
        </svg>
      );
    }

    if (type === "square" && "x" in shapeData) {
      return (
        <svg {...svgProps}>
          {roughFilter}
          <rect
            x={shapeData.x}
            y={shapeData.y}
            width={shapeData.w}
            height={shapeData.h}
            transform={`rotate(${shapeData.rotate}, 50, 50)`}
            {...strokeProps}
          />
        </svg>
      );
    }

    if (type === "star" && "d" in shapeData) {
      return (
        <svg {...svgProps}>
          {roughFilter}
          <path d={shapeData.d} {...strokeProps} />
        </svg>
      );
    }

    return null;
  })();

  if (!svg) return null;

  return <span style={wrapperStyle}>{svg}</span>;
}
