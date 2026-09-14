/**
 * Madhu ML TT — Primary API Interface
 */

import karthikaMap from './mappings/karthika.json' with { type: 'json' };
import {
  buildReverseMapping,
  unicode2mlttEngine,
  mltt2unicodeEngine
} from './engine/reorder.js';

const { reverseMap, sortedKeys } = buildReverseMapping(karthikaMap.mapping);

export function unicode2mltt(text) {
  return unicode2mlttEngine(text, karthikaMap.mapping);
}

export function mltt2unicode(text) {
  return mltt2unicodeEngine(text, reverseMap, sortedKeys);
}

export function isMalayalam(text) {
  return /[\u0D00-\u0D7F]/.test(text);
}

export const defaultMapping = karthikaMap;
