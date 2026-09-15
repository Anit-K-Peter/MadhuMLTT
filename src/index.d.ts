/**
 * Madhu ML TT — Core SDK Type Definitions (@madhu-mltt/core)
 */

export interface MappingDictionary {
  [key: string]: string;
}

export interface MappingSchema {
  name?: string;
  vendor?: string;
  version?: string;
  mapping: MappingDictionary;
}

export interface ConverterOptions {
  mapping?: MappingSchema | MappingDictionary;
  mode?: 'strict' | 'mixed';
  preserveEnglish?: boolean;
  cacheSize?: number;
}

export interface MappingValidationResult {
  valid: boolean;
  errors: string[];
}

export declare class MLTTConverter {
  name: string;
  mode: 'strict' | 'mixed';
  preserveEnglish: boolean;
  mapping: MappingDictionary;

  constructor(options?: ConverterOptions);

  toMLTT(text: string): string;
  toUnicode(asciiText: string, overrideOptions?: ConverterOptions): string;
  convert(text: string, options?: ConverterOptions): string;
  clearCache(): void;
}

export declare function createConverter(options?: ConverterOptions): MLTTConverter;
export declare function validateMapping(mappingData: any): MappingValidationResult;

export declare function unicodeToMLTT(text: string, options?: ConverterOptions): string;
export declare function mlttToUnicode(asciiText: string, options?: ConverterOptions): string;
export declare function normalizeUnicode(text: string): string;
export declare function containsMalayalam(text: string): boolean;

export declare const karthikaMapping: MappingSchema;
export declare const revathiMapping: MappingSchema;
export declare const defaultMapping: MappingSchema;
