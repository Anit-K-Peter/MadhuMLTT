import * as React from 'react';
import { MLTTMapping, MLTTConverter, ConversionOptions } from '@madhu-mltt/core';

export interface FontConfig {
  family: string;
  src?: string;
  weight?: string | number;
  style?: string;
  format?: 'truetype' | 'woff' | 'woff2' | 'opentype' | string;
}

export interface MLTTProviderProps {
  font?: string | FontConfig;
  mapping?: MLTTMapping;
  cacheSize?: number;
  accessible?: boolean;
  children?: React.ReactNode;
}

export interface MLTTContextValue {
  converter: MLTTConverter;
  font: string | FontConfig;
  fontFamily: string;
  mapping: MLTTMapping | null;
  isLoaded: boolean;
  accessible: boolean;
  toMLTT(text: string): string;
  toUnicode(text: string): string;
  convert(text: string, options?: ConversionOptions): string;
}

export type MLTextProps<C extends React.ElementType = 'span'> = {
  as?: C;
  children?: React.ReactNode;
  fontFamily?: string;
  mapping?: MLTTMapping;
  accessible?: boolean;
} & React.ComponentPropsWithoutRef<C>;

export declare const MLTTProvider: React.FC<MLTTProviderProps>;

export declare const MLText: <C extends React.ElementType = 'span'>(
  props: MLTextProps<C> & { ref?: React.ComponentPropsWithRef<C>['ref'] }
) => React.ReactElement | null;

export declare function useMLTT(): MLTTContextValue;

export declare const MLTTContext: React.Context<MLTTContextValue | null>;
