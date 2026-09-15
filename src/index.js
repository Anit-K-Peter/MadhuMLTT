/**
 * Madhu ML TT — Core SDK Public API (@madhu-mltt/core)
 */

import defaultMappingData from './mapping.json' with { type: 'json' };
import revathiMappingData from '../mappings/revathi/mapping.json' with { type: 'json' };

export {
  createConverter,
  MLTTConverter,
  validateMapping
} from './factory.js';

export {
  unicodeToMLTT,
  mlttToUnicode,
  normalizeUnicode,
  containsMalayalam,
  tokenizeText,
  buildReverseMapping
} from './converter/index.js';

export const defaultMapping = defaultMappingData;
export const karthikaMapping = defaultMappingData;
export const revathiMapping = revathiMappingData;

/**
 * Registry of officially supported built-in font mappings.
 */
export const supportedMappings = Object.freeze({
  'Karthika': karthikaMapping,
  'ML-TTKarthika': karthikaMapping,
  'Revathi': revathiMapping,
  'ML-TTRevathi': revathiMapping
});

/**
 * Resolves a built-in mapping schema by name (case-insensitive).
 *
 * @param {string} name
 * @returns {object | null}
 */
export function getMapping(name) {
  if (!name || typeof name !== 'string') return null;
  const targetKey = name.trim().toLowerCase();
  for (const [key, schema] of Object.entries(supportedMappings)) {
    if (key.toLowerCase() === targetKey) {
      return schema;
    }
  }
  return null;
}
