/**
 * Madhu ML TT — Sequence Tokenizer & Token Stream Processor
 */

export const TOKEN_TYPES = {
  MALAYALAM: 'MALAYALAM',
  NON_MALAYALAM: 'NON_MALAYALAM'
};

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
    const code = char.charCodeAt(0);
    const isMl = code >= 0x0D00 && code <= 0x0D7F;

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
