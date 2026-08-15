export type PaperPattern = "folio" | "grid" | "blank";

/**
 * Posisi vertikal tulisan terhadap garis-garis kertas:
 * - "line"   : tulisan "duduk" di atas garis (bawah huruf menyentuh garis)
 * - "middle" : tulisan di tengah-tengah jarak antar garis
 */
export type TextVerticalPosition = "line" | "middle";

export interface IdentityField {
  id: string;
  label: string;
  value: string;
}

export interface MathRendererProps {
  latex: string;
  color: string;
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  roughness?: number;
}

export interface ShapeRendererProps {
  type: string;
  color: string;
  size?: number;
  lineHeight?: number;
  roughness?: number;
}

export interface PaperSettings {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  inkColor: string;
  handwritingRoughness: number;
  marginTop: number;
  marginBottom: number;
  paddingLeft: number;
  showMarginLine: boolean;
  lineColor: string;
  paperPattern?: PaperPattern;
  /** Mode posisi tulisan terhadap garis: "line" (duduk di atas garis) | "middle" (tengah-tengah) */
  textVerticalPosition?: TextVerticalPosition;
}

export interface PaperPageProps {
  pageIndex: number;
  totalPages: number;
  text: string;
  identities: IdentityField[];
  settings: PaperSettings;
  lineCount: number;
  onContentRef?: (el: HTMLDivElement | null) => void;
  isFullscreen: boolean;
}

export interface PaperLinesProps {
  lineCount: number;
  marginTop: number;
  marginBottom: number;
  paddingLeft: number;
  lineHeight: number;
  lineColor: string;
  showMarginLine: boolean;
  paperPattern?: PaperPattern;
}

export interface PaperContentProps {
  text: string;
  pageIndex: number;
  lineCount: number;
  paddingLeft: number;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  inkColor: string;
  handwritingRoughness: number;
  textVerticalPosition?: TextVerticalPosition;
  onContentRef?: (el: HTMLDivElement | null) => void;
}

export interface Preset {
  id: string;
  name: string;
  settings: PaperSettings;
  createdAt: number;
  isDefault?: boolean;
}

export interface TextStats {
  charCount: number;
  wordCount: number;
  lineCount: number;
  readingTimeMinutes: number;
}

export interface KatexOptions {
  displayMode?: boolean;
  throwOnError?: boolean;
  errorColor?: string;
  macros?: Record<string, string>;
  strict?: boolean | string;
  trust?: boolean;
}

export interface KatexGlobal {
  render: (latex: string, element: HTMLElement, options?: KatexOptions) => void;
  renderToString: (latex: string, options?: KatexOptions) => string;
}

declare global {
  interface Window {
    katex?: KatexGlobal;
  }
}
