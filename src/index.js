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
