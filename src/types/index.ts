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
  onContentRef?: (el: HTMLDivElement | null) => void;
}

export interface Preset {
  id: string;
  name: string;
  settings: PaperSettings;
  createdAt: number;
}

export interface TextStats {
  charCount: number;
  wordCount: number;
  lineCount: number;
  readingTimeMinutes: number;
}

declare global {
  interface Window {
    katex: any;
  }
}