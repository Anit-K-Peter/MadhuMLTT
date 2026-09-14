/**
 * Madhu ML TT — Sequence Tokenizer & Token Stream Processor
 */

export const TOKEN_TYPES = {
  MALAYALAM: 'MALAYALAM',
  NON_MALAYALAM: 'NON_MALAYALAM'
};

/**
 * Check if a character is part of Malayalam Unicode range or Malayalam formatting (ZWJ/ZWNJ).
 *
 * @param {string} char
 * @param {string} [prevChar]
 * @returns {boolean}
 */
export function isMalayalamChar(char, prevChar) {
  if (!char) return false;
  const code = char.charCodeAt(0);

  // Unicode Malayalam Block (U+0D00 - U+0D7F)
  if (code >= 0x0D00 && code <= 0x0D7F) {
    return true;
  }

  // Zero Width Joiner (U+200D) / Zero Width Non-Joiner (U+200C) attached to Malayalam
  if (code === 0x200C || code === 0x200D) {
    if (prevChar) {
      const prevCode = prevChar.charCodeAt(0);
      if (prevCode >= 0x0D00 && prevCode <= 0x0D7F) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Tokenize input text into contiguous runs of Malayalam text vs. non-Malayalam text
 *
 * @param {string} text
 * @returns {Array<{ type: string, value: string }>}
 */
export function tokenizeText(text) {
  if (!text) return [];

  const tokens = [];
  let currentType = null;
  let currentBuffer = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const prevChar = i > 0 ? text[i - 1] : null;
    const isMl = isMalayalamChar(char, prevChar);

    const type = isMl ? TOKEN_TYPES.MALAYALAM : TOKEN_TYPES.NON_MALAYALAM;

    if (currentType === null) {
      currentType = type;
      currentBuffer = char;
    } else if (currentType === type) {
      currentBuffer += char;
    } else {
      tokens.push({ type: currentType, value: currentBuffer });
      currentType = type;
      currentBuffer = char;
    }
  }

  if (currentBuffer) {
    tokens.push({ type: currentType, value: currentBuffer });
  }

  return tokens;
}
