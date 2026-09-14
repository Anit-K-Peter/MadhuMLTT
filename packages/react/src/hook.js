import { useContext, useMemo } from 'react';
import { createConverter } from '../../../src/factory.js';
import { MLTTContext } from './context.js';

// Lazy fallback converter singleton for standalone usage outside MLTTProvider
let fallbackConverter = null;

function getFallbackConverter() {
  if (!fallbackConverter) {
    fallbackConverter = createConverter();
  }
  return fallbackConverter;
}

/**
 * Custom React hook exposing ML-TT conversion utilities and current font context.
 *
 * @returns {{
 *   converter: object,
 *   fontFamily: string,
 *   font: string | object,
 *   mapping: object | null,
 *   isLoaded: boolean,
 *   accessible: boolean,
 *   toMLTT: (text: string) => string,
 *   toUnicode: (text: string) => string,
 *   convert: (text: string, options?: object) => string
 * }}
 */
export function useMLTT() {
  const context = useContext(MLTTContext);

  return useMemo(() => {
    if (context && context.converter) {
      return {
        ...context,
        toMLTT: (text) => context.converter.toMLTT(text),
        toUnicode: (text) => context.converter.toUnicode(text),
        convert: (text, options) => context.converter.convert(text, options)
      };
    }

    // Fallback mode when used without an ancestor <MLTTProvider>
    const defaultConv = getFallbackConverter();
    return {
      converter: defaultConv,
      fontFamily: 'ML-TTKarthika',
      font: 'ML-TTKarthika',
      mapping: defaultConv.mapping,
      isLoaded: true,
      accessible: true,
      toMLTT: (text) => defaultConv.toMLTT(text),
      toUnicode: (text) => defaultConv.toUnicode(text),
      convert: (text, options) => defaultConv.convert(text, options)
    };
  }, [context]);
}
