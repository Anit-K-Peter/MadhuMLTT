/**
 * Madhu ML TT — Core SDK Public API (@madhu-mltt/core)
 */

import karthikaData from './mappings/ml-tt-karthika.json' with { type: 'json' };

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

export const karthikaMapping = karthikaData;
export const defaultMapping = karthikaData;
