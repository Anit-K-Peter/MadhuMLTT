/**
 * Madhu ML TT — Unicode Normalization & Chillu Standardization
 */

/**
 * Standardize Unicode Malayalam input by applying Unicode NFC normalization
 * and converting legacy Virama + ZWJ chillu sequences to atomic Unicode chillus.
 *
 * @param {string} text
 * @returns {string}
 */
export function normalizeUnicode(text) {
  if (!text) return '';

  // Apply Unicode Canonical Composition (NFC)
  let normalized = text.normalize('NFC');

  // Convert legacy Virama + ZWJ / ZWNJ sequences to atomic chillus
  normalized = normalized
    .replace(/\u0D23\u0D4D\u200D/g, '\u0D7A') // ൺ (NN: U+0D7A)
    .replace(/\u0D28\u0D4D\u200D/g, '\u0D7B') // ൻ (N: U+0D7B)
    .replace(/\u0D30\u0D4D\u200D/g, '\u0D7C') // ർ (RR: U+0D7C)
    .replace(/\u0D32\u0D4D\u200D/g, '\u0D7D') // ൽ (L: U+0D7D)
    .replace(/\u0D33\u0D4D\u200D/g, '\u0D7E') // ൾ (LL: U+0D7E)
    .replace(/\u0D15\u0D4D\u200D/g, '\u0D7F'); // ൿ (K: U+0D7F)

  // Also convert legacy Virama + ZWNJ sequences if present
  normalized = normalized
    .replace(/\u0D23\u0D4D\u200C/g, '\u0D7A')
    .replace(/\u0D28\u0D4D\u200C/g, '\u0D7B')
    .replace(/\u0D30\u0D4D\u200C/g, '\u0D7C')
    .replace(/\u0D32\u0D4D\u200C/g, '\u0D7D')
    .replace(/\u0D33\u0D4D\u200C/g, '\u0D7E')
    .replace(/\u0D15\u0D4D\u200C/g, '\u0D7F');

  return normalized;
}

/**
 * Check if string contains any Malayalam Unicode characters
 *
 * @param {string} text
 * @returns {boolean}
 */
export function containsMalayalam(text) {
  return /[\u0D00-\u0D7F]/.test(text);
}
