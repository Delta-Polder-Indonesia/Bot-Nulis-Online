import { useMemo } from "react";
import type { ShapeRendererProps } from "../types";
import { seededRandom } from "../utils/seededRandom";

export default function ShapeRenderer({
  type,
  color,
  size = 60,
  lineHeight = 32,
  roughness = 2,
}: ShapeRendererProps) {
  const centerOffset = (lineHeight - size) / 2;

  // Gunakan useMemo + seeded random agar tidak berubah setiap render
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
        rx: wobble(35, "rx"),
        ry: wobble(35, "ry"),
      };
    }

    if (type === "square") {
      return {
        x: wobble(20, "x"),
        y: wobble(20, "y"),
        w: wobble(60, "w"),
        h: wobble(60, "h"),
        rotate: (seededRandom(`shape-square-rot`) - 0.5) * 2,
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
      marginTop: Math.max(0, centerOffset),
      display: "block" as const,
    },
  };

  const roughFilter = (
    <defs>
      <filter id={`roughPaper-${type}`}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.04"
          numOctaves="5"
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale="2"
        />
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

  return null;
}