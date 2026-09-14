import { createConverter, validateMapping } from '@madhu-mltt/core';
import { transformSource } from './transform.js';

/**
 * Vite plugin for build-time transformation of static Malayalam text into ML-TT font encodings.
 *
 * @param {object} [options]
 * @param {object} [options.mapping] Custom MLTTMapping object or reference mapping asset
 * @param {string} [options.fontFamily='ML-TTKarthika'] CSS font-family name
 * @param {RegExp|string} [options.include=/\.(jsx|tsx|js|ts)$/] File match filter
 * @param {RegExp|string} [options.exclude=/node_modules|\.git|dist/] File exclude filter
 * @param {boolean} [options.accessible=true] Enable accessible dual-span markup for screen readers & SEO
 * @returns {import('vite').Plugin}
 */
export function madhuMLTTVite(options = {}) {
  const {
    mapping,
    fontFamily = 'ML-TTKarthika',
    include = /\.(jsx|tsx|js|ts)$/,
    exclude = /node_modules|\.git|dist/,
    accessible = true
  } = options;

  // Validate mapping once during plugin initialization
  if (mapping) {
    const validation = validateMapping(mapping);
    if (!validation.valid) {
      console.warn(
        `[Madhu ML TT Vite Plugin]: Invalid mapping provided:\n` +
        validation.errors.join('\n')
      );
    }
  }

  // Instantiate memoized core converter instance
  const converterOpts = {};
  if (mapping !== undefined) converterOpts.mapping = mapping;
  const converter = createConverter(converterOpts);

  return {
    name: 'vite-plugin-madhu-mltt',
    enforce: 'pre',

    transform(code, id) {
      // Filter out files based on include/exclude patterns
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

      try {
        return transformSource(code, id, {
          converter,
          fontFamily,
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
