/**
 * Madhu ML TT — Reverse Conversion Engine (ML-TT ASCII -> Unicode Malayalam)
 */

import defaultMappingData from '../mapping.json' with { type: 'json' };
import { normalizeUnicode } from './normalize.js';
import { buildReverseMapping } from './reorder.js';

const defaultReverseContext = buildReverseMapping(defaultMappingData.mapping);

// Comprehensive list of common English words, technical terms, and vocabulary
// Removed hardcoded COMMON_ENGLISH_WORDS set to avoid dictionary reliance

/**
 * Check if a token is explicitly non-MLTT (e.g. English word, Email address, URL, Numbers, Identifiers)
 */
export function isExplicitNonMLTT(rawToken) {
  if (!rawToken) return false;
  const token = rawToken.trim().replace(/^[.,!?;:()\[\]{}'"\-_/]+|[.,!?;:()\[\]{}'"\-_/]+$/g, '');
  if (!token) return false;

  // Email address
  if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(token)) return true;
  
  // URL / domain
  if (/^(https?:\/\/|www\.)[^\s]+/i.test(token) || /^[a-zA-Z0-9-]+\.(com|org|net|io|dev|edu|gov|ml|in)[^\s]*$/i.test(token)) return true;
  
  // Number or Version string (e.g., 2026, 1.0.0, 42)
  if (/^\d+(\.\d+)*$/.test(token)) return true;

  // Contains extended ASCII characters (specific to ML-TT font mappings like §, Ä, µ, ¡, ¢, ®, ´, \) -> ML-TT
  if (/[§µÀ¡¢®´\\_]/.test(token)) return false;

  // Heuristic English detection (no word list)
  // 1. Capitalized word (e.g., Delhi, Email)
  if (/^[A-Z][a-z]+$/.test(token)) return true;

  // 2. All caps acronym (e.g., CSS, HTML, API)
  if (/^[A-Z]{2,6}$/.test(token)) return true;

  // 3. CamelCase word (e.g., JavaScript, ReactComponent)
  if (/^[A-Z][a-z]+[A-Z][a-zA-Z]*$/.test(token)) return true;

  // 4. Mixed case where uppercase appears after a non-prefix vowel character -> treat as English
  // Define ML‑TT prefix vowel characters that may legitimately precede an uppercase consonant
  const mlttPrefixVowels = new Set(['t','s','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','u','v','w','x','y','z','C','D','H','U','Y','Z','Y','U','S','T','L','M','N']);
  // If token contains an uppercase letter not at position 0 and the preceding character is NOT a known ML‑TT prefix vowel, treat as English
  const uppercaseIdx = token.search(/[A-Z]/);
  if (uppercaseIdx > 0) {
    const prevChar = token[uppercaseIdx - 1];
    if (!mlttPrefixVowels.has(prevChar)) {
      return true;
    }
  }

  return false;
}

/**
 * Tokenizes ML-TT string separating explicit non-MLTT runs (words, numbers, URLs) from ML-TT runs
 *
 * @param {string} asciiText
 * @returns {Array<string>}
 */
function tokenizeMLTTText(asciiText) {
  if (!asciiText) return [];

  // Split on whitespace, URLs, or Emails
  const parts = asciiText.split(/(\s+|https?:\/\/\S+|www\.\S+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  const result = [];

  for (const part of parts) {
    if (!part) continue;
    if (/\s+|https?:\/\/\S+|www\.\S+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(part)) {
      result.push(part);
      continue;
    }

    // Check if part contains adjacent known English words (e.g. "aebmfwReacthmIv")
    let currentChunk = part;
    let foundAdjacent = false;

    for (const englishWord of COMMON_ENGLISH_WORDS) {
      if (englishWord.length < 3) continue;
      const idx = currentChunk.toLowerCase().indexOf(englishWord);
      if (idx > 0) {
        const prefix = currentChunk.substring(0, idx);
        const matchWord = currentChunk.substring(idx, idx + englishWord.length);
        const suffix = currentChunk.substring(idx + englishWord.length);

        if (prefix) result.push(prefix);
        result.push(matchWord);
        if (suffix) result.push(suffix);

        foundAdjacent = true;
        break;
      }
    }

    if (!foundAdjacent) {
      result.push(part);
    }
  }

  return result;
}

/**
 * Converts ML-TT ASCII encoded text to modern Unicode Malayalam text.
 *
 * @param {string} asciiText - Input ML-TT encoded ASCII string
 * @param {object} [options]
 * @param {Record<string, string>} [options.mapping] - Custom forward mapping dictionary
 * @param {boolean} [options.preserveEnglish=true] - Preserves English words, emails, and numbers
 * @param {'strict'|'compatibility'|'mixed'} [options.mode='mixed'] - Conversion mode
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

  const preserveEnglish = options.preserveEnglish !== false && options.mode !== 'strict';

  if (preserveEnglish) {
    const tokens = tokenizeMLTTText(asciiText);
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
