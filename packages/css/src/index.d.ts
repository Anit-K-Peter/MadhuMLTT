export interface ExtractedFontMLTTRule {
  fontFamily: string;
  fontFamilyRaw: string;
  mappingRaw: string;
  mappingType: 'builtin' | 'file';
  mappingValue: string;
  mapping: Record<string, any>;
  srcRaw: string;
  rawBlock: string;
}

export interface ParseFontMLTTOptions {
  filename?: string;
  resolveJson?: boolean;
}

export interface ParseFontMLTTResult {
  css: string;
  rules: ExtractedFontMLTTRule[];
}

export function parseFontMLTT(
  cssCode: string,
  options?: ParseFontMLTTOptions
): ParseFontMLTTResult;

export function unquote(str: string): string;
export function extractUrlValue(val: string): string;
