/**
 * Madhu ML TT — Engine Public API
 */

import karthikaData from './mappings/ml-tt-karthika.json' with { type: 'json' };

export {
  unicodeToMLTT,
  mlttToUnicode,
  normalizeUnicode,
  containsMalayalam,
  tokenizeText,
  buildReverseMapping
} from './converter/index.js';

export const defaultMapping = karthikaData;
