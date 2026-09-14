import React, { useMemo, useEffect } from 'react';
import { createConverter, validateMapping } from '@madhu-mltt/core';
import { MLTTContext } from './context.js';
import { normalizeFont, registerFontFace } from './fontLoader.js';

/**
 * MLTTProvider component.
 * Registers Malayalam ML-TT font settings, mapping rules, and converter cache context for descendant components.
 *
 * @param {object} props
 * @param {string | object} [props.font] Font family name or font configuration object { family, src, ... }
 * @param {object} [props.mapping] MLTTMapping dictionary object (defaults to reference Karthika mapping)
 * @param {number} [props.cacheSize] Maximum LRU conversion cache capacity
 * @param {boolean} [props.accessible=true] Enable accessible dual-span rendering for screen readers & SEO
 * @param {React.ReactNode} props.children
 */
export function MLTTProvider({
  font = 'ML-TTKarthika',
  mapping,
  cacheSize,
  accessible = true,
  children
}) {
  // Validate mapping schema if explicit mapping object is supplied
  useMemo(() => {
    if (mapping) {
      const validation = validateMapping(mapping);
      if (!validation.valid) {
        console.warn(
          `[Madhu ML TT React]: Invalid mapping provided to MLTTProvider:\n` +
          validation.errors.join('\n')
        );
      }
    }
  }, [mapping]);

  const converter = useMemo(() => {
    const opts = {};
    if (mapping !== undefined) opts.mapping = mapping;
    if (cacheSize !== undefined) opts.cacheSize = cacheSize;
    return createConverter(opts);
  }, [mapping, cacheSize]);

  // Normalize font configuration
  const fontConfig = useMemo(() => normalizeFont(font), [font]);

  // Dynamically register font @font-face in browser if src is specified
  useEffect(() => {
    if (fontConfig.src) {
      registerFontFace(fontConfig);
    }
  }, [fontConfig]);

  // Context value exposed to descendant components
  const contextValue = useMemo(() => ({
    converter,
    font,
    fontFamily: fontConfig.family,
    mapping: mapping || null,
    isLoaded: true,
    accessible
  }), [converter, font, fontConfig.family, mapping, accessible]);

  return React.createElement(
    MLTTContext.Provider,
    { value: contextValue },
    children
  );
}
