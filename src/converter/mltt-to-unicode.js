/**
 * Madhu ML TT — Reverse Conversion Engine (ML-TT ASCII -> Unicode Malayalam)
 */

import defaultMappingData from '../mapping.json' with { type: 'json' };
import { normalizeUnicode } from './normalize.js';
import { buildReverseMapping } from './reorder.js';

const defaultReverseContext = buildReverseMapping(defaultMappingData.mapping);

/**
 * Check if a token is explicitly non-MLTT (e.g. English word, Email address, URL, Numbers)
 */
function isExplicitNonMLTT(rawToken) {
  if (!rawToken) return false;
  const token = rawToken.trim().replace(/^[.,!?;:()\[\]{}'"\-_/]+|[.,!?;:()\[\]{}'"\-_/]+$/g, '');
  if (!token) return false;

  if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(token)) return true;
  if (/^(https?:\/\/|www\.)/i.test(token)) return true;
  if (/^\d+$/.test(token)) return true;
  if (/^[A-Z][a-z]{1,}$/.test(token)) return true;
  return false;
}

/**
 * Converts ML-TT ASCII encoded text to modern Unicode Malayalam text.
 *
 * @param {string} asciiText - Input ML-TT encoded ASCII string
 * @param {object} [options]
 * @param {Record<string, string>} [options.mapping] - Custom forward mapping dictionary
 * @param {boolean} [options.preserveEnglish=false] - Preserves English words, emails, and numbers
 * @param {'strict'|'compatibility'|'mixed'} [options.mode='strict'] - Conversion mode
 * @returns {string} - Converted Unicode Malayalam string
 */
export function mlttToUnicode(asciiText, options = {}) {
  if (!asciiText) return '';

  let reverseMap = defaultReverseContext.reverseMap;
  let sortedKeys = defaultReverseContext.sortedKeys;

  if (options.mapping) {
    const customContext = buildReverseMapping(options.mapping);
    reverseMap = customContext.reverseMap;
    sortedKeys = customContext.sortedKeys;
  }

  const preserveEnglish = options.preserveEnglish || options.mode === 'mixed';

  if (preserveEnglish) {
    const tokens = asciiText.split(/(\s+)/);
    let result = '';

    for (const token of tokens) {
      if (!token) continue;
      if (isExplicitNonMLTT(token)) {
        result += token;
      } else {
        result += convertMLTTChunk(token, reverseMap, sortedKeys);
      }
    }
    return normalizeUnicode(result);
  }

  return normalizeUnicode(convertMLTTChunk(asciiText, reverseMap, sortedKeys));
}

function convertMLTTChunk(chunk, reverseMap, sortedKeys) {
  let unicodeResult = '';
  let index = 0;
  const len = chunk.length;
  const pendingPrefixVowels = [];

  while (index < len) {
    let matched = false;

    for (const asciiKey of sortedKeys) {
      if (chunk.startsWith(asciiKey, index)) {
        const unicodeChar = reverseMap[asciiKey];
        matched = true;
        index += asciiKey.length;

        if (['െ', 'േ', 'ൈ', '്ര', 'ൊ', 'ോ', 'ൌ'].includes(unicodeChar)) {
          pendingPrefixVowels.push(unicodeChar);
        } else {
          unicodeResult += unicodeChar;
          while (pendingPrefixVowels.length > 0) {
            unicodeResult += pendingPrefixVowels.shift();
          }
        }
        break;
      }
    }

    if (!matched) {
      const unmappedChar = chunk[index];
      unicodeResult += unmappedChar;
      index++;
      while (pendingPrefixVowels.length > 0) {
        unicodeResult += pendingPrefixVowels.shift();
      }
    }
  }

  while (pendingPrefixVowels.length > 0) {
    unicodeResult += pendingPrefixVowels.shift();
  }

  return unicodeResult;
}
