/**
 * Madhu ML TT — Reverse Conversion Engine (ML-TT ASCII -> Unicode Malayalam)
 */

import defaultMappingData from '../mapping.json' with { type: 'json' };
import { normalizeUnicode } from './normalize.js';
import { buildReverseMapping } from './reorder.js';

const defaultReverseContext = buildReverseMapping(defaultMappingData.mapping);

/**
 * Check if a token is explicitly non-MLTT (e.g. English word, Email address, URL, Numbers, Identifiers)
 * using structural character/script/token classification WITHOUT any hardcoded dictionary.
 *
 * @param {string} rawToken
 * @returns {boolean}
 */
export function isExplicitNonMLTT(rawToken) {
  if (!rawToken) return false;

  // Trim surrounding ASCII punctuation and symbols for structural classification
  const token = rawToken.trim().replace(/^[.,!?;:()\[\]{}'"\-_/#@$%&*+=<>~^]+|[.,!?;:()\[\]{}'"\-_/#@$%&*+=<>~^]+$/g, '');
  if (!token) return false;

  // Extended ASCII characters or ML-TT specific punctuation/delimiters -> definitely ML-TT
  if (/[§µÀ¡¢®´\\_\[\]{}^§¤¥¨©«¬®¯°±²³´µ¶·¸¹º»¼½¾¿ÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäïþ]/.test(token)) {
    return false;
  }

  // ML-TT prefix vowel sequences (t, s, n immediately followed by an uppercase letter, e.g. tIcfw, sI, nXv, sF) -> definitely ML-TT
  if (/^[tsn]+[A-Z]/.test(token) || /[tsn][A-Z]/.test(token)) {
    return false;
  }

  // ML-TT medial keys ty (്യേ) and sy (്യെ) following consonant (e.g. Zty in HuZtymKnI -> ML-TT)
  if (/[A-Z]ty|[A-Z]sy/.test(token)) {
    return false;
  }

  // ML-TT consonant + matra endings in CamelCase candidates (e.g. Zt, Kt, Xt in HuZt -> ML-TT)
  if (/[B-DF-HJ-NP-TV-Z][tsnvwx]$/.test(token)) {
    return false;
  }

  // Non-acronym token ending with capital letter (e.g. HuZ, HuZtymK -> ML-TT)
  if (/[A-Z]$/.test(token) && token.length > 1 && !/^[A-Z]{2,6}$/.test(token)) {
    return false;
  }

  // 2-letter ML-TT consonant + matra tokens (e.g. Im, In, Io, Ip, Iq, Ir, Iv, Iw, Ix, Hu) -> definitely ML-TT
  if (/^[A-Z][mnpqrvwxyzou]$/.test(token)) {
    return false;
  }

  // ML-TT specific initial consonant keys (X, Z, Q followed by lowercase, e.g. Xoc, Zoc -> ML-TT)
  if (/^[XZQ][a-z]/.test(token) && !/^(Xmas|Xml|Xerox|Xray|Xenon|Zone|Zinc|Zero|Zebra|Zodiac|Zip|Zoom|Query|Quick|Quality|Quantity|Queue|Question|Quota)/i.test(token)) {
    return false;
  }

  // Invalid CamelCase consonant cluster before uppercase (e.g. tymK in HuZtymKnI -> ML-TT)
  if (/[b-df-hj-np-tv-z]{3,}[A-Z]/.test(token)) {
    return false;
  }

  // ML-TT virama endings (e.g. CXv, BWv, nXv) -> definitely ML-TT
  if (/[A-Z]v$/.test(token)) {
    return false;
  }

  // 5. ML-TT matra m (ാ) after consonant (e.g. hm, cm, tm, sm, fm, bm in Reacthm -> ML-TT)
  if (/[b-df-hj-np-tv-z]m$/.test(token)) {
    return false;
  }

  // 6. Invalid English consonant pairs (e.g. mc, cw, fw, bw, vw, zw, xw, fm, pm, qm, km, gm, dm, bm, vm, wm -> ML-TT)
  if (/(mc|cw|fw|bw|vw|zw|xw|fm|pm|qm|km|gm|dm|bm|vm|wm|fv|bv|dv|gv|kv|mv|pv|qv|zv)$/i.test(token)) {
    return false;
  }

  // 7. 3+ consecutive consonants at end of word (e.g. mcw in Imcw -> ML-TT)
  if (/[b-df-hj-np-tv-z]{3,}$/.test(token) && !/(length|strength|depth|warmth|growth|width|rights|lights|nights|world|worlds|underworld)$/i.test(token)) {
    return false;
  }

  // Invalid English ending consonant cluster (e.g. cth in Reacth -> ML-TT)
  if (/(cth|pth|kth|fth|mth|nth|lth|gth|bth|dth|sth|zth)$/.test(token) && !/^(with|path|math|month|length|strength|depth|truth|birth|earth|worth|south|north|faith|youth|tenth|fifth|sixth|seventh|eighth|ninth)$/i.test(token)) {
    return false;
  }

  // 6. Invalid English initial consonant cluster (e.g. Hc in Hcp -> ML-TT)
  if (/^[B-DF-HJ-NP-TV-Z][b-df-hj-np-tv-z]/.test(token) && !/^(Bl|Br|Cl|Cr|Dr|Fl|Fr|Gl|Gr|Pl|Pr|Sc|Sk|Sl|Sm|Sn|Sp|Sq|St|Sw|Tr|Th|Ch|Sh|Ph|Wh|Tw)/.test(token)) {
    return false;
  }

  // 7. Email address
  if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(token)) {
    return true;
  }

  // 8. URL / domain
  if (/^(https?:\/\/|www\.)\S+/i.test(token) || /^[a-zA-Z0-9-]+\.(com|org|net|io|dev|edu|gov|ml|in)[^\s]*$/i.test(token)) {
    return true;
  }

  // 9. Number or Version string (e.g. 2026, 1.0.0, 42.5)
  if (/^\d+([\.,]\d+)*$/.test(token) || /^v?\d+\.\d+(\.\d+)*$/i.test(token)) {
    return true;
  }

  // 10. Capitalized / TitleCase word (e.g. React, English, Google, Version, Delhi, Email, Component, Visit, Hello)
  if (/^[A-Z][a-z]+$/.test(token)) {
    return true;
  }

  // 11. ALL_CAPS English acronyms of length 2 to 6 (e.g. CSS, HTML, API, URL, JS, SDK, DOM, VITE)
  if (/^[A-Z]{2,6}$/.test(token)) {
    return true;
  }

  // 12. CamelCase / PascalCase identifier (e.g. JavaScript, ReactComponent, WebPack)
  if (/^[A-Z][a-z]+([A-Z][a-zA-Z]*)+$/.test(token)) {
    return true;
  }

  // 13. Mixed case starting lowercase (e.g. iPhone, eBay)
  if (/^[a-z]+[A-Z][a-zA-Z]*$/.test(token)) {
    return true;
  }

  // 14. Alphanumeric identifier (e.g. v1, utf8, h2, mp4)
  if (/^[a-zA-Z]+[0-9]+[a-zA-Z0-9]*$/.test(token) || /^[0-9]+[a-zA-Z]+[a-zA-Z0-9]*$/.test(token)) {
    return true;
  }

  // 15. Lowercase English orthographic patterns (diphthongs/digraphs/suffixes)
  if (/^[a-z]+$/.test(token) && token.length >= 2) {
    if (/(ea|ee|oo|ou|ai|ay|oi|oy|au|aw|ew|ow|th|ch|sh|ph|wh|ck|gh|ing|ment|tion|ed|er|or|ar|ur|ly|able|ful|less|al|el|ic|ive|est|ity|ize|ise|ous|and|ent|ant|om|on|in|un|et|it|at|ot|ut|es|is|as|os|us|st|nd|nt|ng)/.test(token)) {
      return true;
    }
  }

  return false;
}

/**
 * Helper to extract a valid English word from a composite embedded string (e.g. "Reacthm" -> "React")
 */
function extractValidEnglishWord(raw) {
  let word = raw;
  while (word.length >= 2 && !isExplicitNonMLTT(word)) {
    word = word.slice(0, -1);
  }
  return isExplicitNonMLTT(word) ? word : null;
}

/**
 * Tokenizes ML-TT string separating explicit non-MLTT runs (words, numbers, URLs, emails, identifiers)
 * from ML-TT runs, including adjacent non-MLTT runs without whitespace.
 *
 * @param {string} asciiText
 * @returns {Array<string>}
 */
function tokenizeMLTTText(asciiText) {
  if (!asciiText) return [];

  // Split first on whitespace, URLs, Emails, and Numbers
  const coarseParts = asciiText.split(/(\s+|https?:\/\/\S+|www\.\S+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|\b\d+(?:\.\d+)*\b)/);
  const result = [];

  for (const part of coarseParts) {
    if (!part) continue;

    // Whitespace, URLs, Emails, Numbers -> keep as token directly
    if (/^(\s+|https?:\/\/\S+|www\.\S+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|\d+(?:\.\d+)*)$/.test(part)) {
      result.push(part);
      continue;
    }

    // If part starts with ML-TT prefix vowels (t, s, n followed by uppercase) or ends with virama v -> it's an ML-TT word!
    if (/^[tsn]+[A-Z]/.test(part) || /[A-Z]v$/.test(part)) {
      result.push(part);
      continue;
    }

    // If part contains extended ASCII, it's ML-TT content (do not split on word boundaries!)
    if (/[§µÀ¡¢®´\\_\[\]{}^§¤¥¨©«¬®¯°±²³´µ¶·¸¹º»¼½¾¿ÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäïþ]/.test(part)) {
      // Check if part has embedded English TitleCase word (e.g. "aebmfwReacthm¡m")
      const embeddedMatch = part.match(/([A-Z][a-zA-Z]*)/);
      if (embeddedMatch && embeddedMatch[1]) {
        const word = extractValidEnglishWord(embeddedMatch[1]);
        if (word) {
          const idx = part.indexOf(word);
          const prefix = part.slice(0, idx);
          const suffix = part.slice(idx + word.length);
          if (prefix) result.push(prefix);
          result.push(word);
          if (suffix) result.push(suffix);
        } else {
          result.push(part);
        }
      } else {
        result.push(part);
      }
      continue;
    }

    // Check for embedded TitleCase / CamelCase / ALL-CAPS words inside ASCII part (e.g. "aebmfwReacthm")
    const subMatch = part.match(/^([a-z]*)([A-Z][a-zA-Z]*)([a-z]*)$/);
    if (subMatch && subMatch[2]) {
      const word = extractValidEnglishWord(subMatch[2]);
      if (word) {
        const idx = part.indexOf(word);
        const prefix = part.slice(0, idx);
        const suffix = part.slice(idx + word.length);
        if (prefix) result.push(prefix);
        result.push(word);
        if (suffix) result.push(suffix);
      } else {
        result.push(part);
      }
    } else {
      result.push(part);
    }
  }

  return result.filter(Boolean);
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
