import { createConverter, validateMapping } from '@madhu-mltt/core';
import { parseFontMLTT } from '@madhu-mltt/css';
import { transformSource } from './transform.js';

/**
 * Vite plugin for build-time transformation of static Malayalam text into ML-TT font encodings.
 * Supports standard options as well as automatic @font-mltt CSS rule registration.
 *
 * @param {object} [options]
 * @param {object} [options.mapping] Custom MLTTMapping object or reference mapping asset
 * @param {string} [options.fontFamily='ML-TTKarthika'] Default CSS font-family name
 * @param {RegExp|string} [options.include=/\.(jsx|tsx|js|ts)$/] File match filter
 * @param {RegExp|string} [options.exclude=/node_modules|\.git|dist/] File exclude filter
 * @param {boolean} [options.accessible=false] Enable accessible dual-span markup for screen readers & SEO
 * @returns {import('vite').Plugin}
 */
export function madhuMLTTVite(options = {}) {
  const {
    mapping,
    fontFamily = 'ML-TTKarthika',
    include = /\.(jsx|tsx|js|ts)$/,
    exclude = /node_modules|\.git|dist/,
    accessible = false
  } = options;

  const hasExplicitMapping = mapping !== undefined;

  // Validate mapping once during plugin initialization if explicitly provided
  if (hasExplicitMapping) {
    const validation = validateMapping(mapping);
    if (!validation.valid) {
      console.warn(
        `[Madhu ML TT Vite Plugin]: Invalid mapping provided:\n` +
        validation.errors.join('\n')
      );
    }
  }

  // Build-level registry for @font-mltt CSS rules
  const fontRegistry = new Map();
  let defaultConverter = createConverter(hasExplicitMapping ? { mapping } : {});
  let warnedMultiple = false;

  return {
    name: 'vite-plugin-madhu-mltt',
    enforce: 'pre',

    transform(code, id) {
      // 1. Process CSS files containing @font-mltt
      if (id.endsWith('.css') || id.includes('.css?') || code.includes('@font-mltt')) {
        if (code.includes('@font-mltt')) {
          const parsed = parseFontMLTT(code, { filename: id });
          for (const rule of parsed.rules) {
            fontRegistry.set(rule.fontFamily, rule);
          }
          return {
            code: parsed.css,
            map: null
          };
        }
        return null;
      }

      // Filter out files based on include/exclude patterns for JS/JSX/TS/TSX
      if (typeof include === 'object' && include.test && !include.test(id)) {
        return null;
      }
      if (typeof exclude === 'object' && exclude.test && exclude.test(id)) {
        return null;
      }

      // Fast check: skip transformation if file contains no Malayalam Unicode characters (\u0D00-\u0D7F)
      if (!/[\u0D00-\u0D7F]/.test(code)) {
        return null;
      }

      // Determine active converter and fontFamily for zero-syntax JSX transformation
      let activeConverter = defaultConverter;
      let activeFontFamily = fontFamily;

      if (!hasExplicitMapping) {
        if (fontRegistry.size === 1) {
          const singleRule = fontRegistry.values().next().value;
          activeConverter = createConverter({ mapping: singleRule.mapping });
          activeFontFamily = singleRule.fontFamily;
        } else if (fontRegistry.size > 1) {
          if (!warnedMultiple) {
            console.warn(
              `[Madhu ML TT Vite Plugin]: Multiple @font-mltt rules detected in CSS (${Array.from(fontRegistry.keys()).join(', ')}). ` +
              `Madhu will not automatically guess element font mappings. Please specify an explicit mapping in options.mapping.`
            );
            warnedMultiple = true;
          }
        }
      }

      try {
        return transformSource(code, id, {
          converter: activeConverter,
          fontFamily: activeFontFamily,
          accessible
        });
      } catch (err) {
        console.warn(`[Madhu ML TT Vite Plugin]: Transformation warning for ${id}:`, err.message);
        return null; // Fall back safely without breaking Vite build
      }
    }
  };
}

export default madhuMLTTVite;
