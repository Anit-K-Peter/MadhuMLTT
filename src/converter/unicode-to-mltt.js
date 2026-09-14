/**
 * Madhu ML TT — Forward Conversion Engine (Unicode Malayalam -> ML-TT ASCII)
 */

import karthikaData from '../mappings/ml-tt-karthika.json' with { type: 'json' };
import { normalizeUnicode } from './normalize.js';
import { tokenizeText, TOKEN_TYPES } from './tokenizer.js';

/**
 * Converts Unicode Malayalam text to ML-TT ASCII representation.
 *
 * @param {string} text - Input text containing Unicode Malayalam
 * @param {object} [options]
 * @param {Record<string, string>} [options.mapping] - Custom mapping dictionary
 * @returns {string} - Converted ML-TT ASCII string
 */
export function unicodeToMLTT(text, options = {}) {
  if (!text) return '';

  const mapping = options.mapping || karthikaData.mapping;
  const normalizedText = normalizeUnicode(text);
  const tokens = tokenizeText(normalizedText);

  let output = '';

  for (const token of tokens) {
    if (token.type === TOKEN_TYPES.NON_MALAYALAM) {
      output += token.value;
      continue;
    }

    const strText = token.value;
    let index = 0;
    let bRepham = 0;
    let asciiText = '';

    while (index < strText.length) {
      let matched = false;

      for (let lenChar = 3; lenChar > 0; lenChar--) {
        const chUnicode = strText.substring(index, index + lenChar);
        if (mapping[chUnicode]) {
          const chAscii = mapping[chUnicode];
          matched = true;

          if (chUnicode === 'ൈ') {
            if (bRepham === 1) {
              bRepham = 0;
              asciiText =
                asciiText.substring(0, asciiText.length - 2) +
                chAscii +
                asciiText[asciiText.length - 2] +
                asciiText[asciiText.length - 1];
            } else {
              asciiText =
                asciiText.substring(0, asciiText.length - 1) +
                chAscii +
                asciiText[asciiText.length - 1];
            }
          } else if (chUnicode === 'ോ' || chUnicode === 'ൊ' || chUnicode === 'ൌ') {
            if (bRepham === 1) {
              bRepham = 0;
              asciiText =
                asciiText.substring(0, asciiText.length - 2) +
                chAscii[0] +
                asciiText[asciiText.length - 2] +
                asciiText[asciiText.length - 1] +
                chAscii[1];
            } else {
              asciiText =
                asciiText.substring(0, asciiText.length - 1) +
                chAscii[0] +
                asciiText[asciiText.length - 1] +
                chAscii[1];
            }
          } else if (chUnicode === '്യേ' || chUnicode === '്യെ') {
            bRepham = 0;
            asciiText =
              asciiText.substring(0, asciiText.length - 1) +
              chAscii[0] +
              asciiText[asciiText.length - 1] +
              chAscii[1];
          } else if (chUnicode === 'െ' || chUnicode === 'േ' || chUnicode === '്ര') {
            if (bRepham === 1) {
              asciiText =
                asciiText.substring(0, asciiText.length - 2) +
                chAscii[0] +
                asciiText[asciiText.length - 2] +
                asciiText[asciiText.length - 1];
              bRepham = 0;
            } else {
              asciiText =
                asciiText.substring(0, asciiText.length - 1) +
                chAscii[0] +
                asciiText[asciiText.length - 1];
            }
            if (chUnicode === '്ര') {
              bRepham = 1;
            }
          } else {
            bRepham = 0;
            asciiText += chAscii;
          }

          index += lenChar;
          break;
        }
      }

      if (!matched) {
        asciiText += strText[index];
        index++;
        bRepham = 0;
      }
    }

    output += asciiText;
  }

  return output;
}
