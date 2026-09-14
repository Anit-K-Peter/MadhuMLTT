/**
 * Madhu ML TT — Reordering State Machine & Mapping Indexer
 */

/**
 * Priority canonical mappings for reverse conversion (ASCII -> Unicode).
 * Ensures clean atomic Malayalam Unicode characters and matras take precedence.
 */
export const CANONICAL_REVERSE_PRIORITY = {
  'v': '്',
  'À': 'ർ',
  '³': 'ൻ',
  'Â': 'ൽ',
  'Ä': 'ൾ',
  '¬': 'ൺ',
  'p': 'ു'
};

/**
 * Builds an inverted lookup table for reverse conversion sorted by ASCII key length descending.
 *
 * @param {Record<string, string>} mapping - Forward map (Unicode -> ASCII)
 * @param {Record<string, string>} [priorityOverrides]
 * @returns {{ reverseMap: Record<string, string>, sortedKeys: string[] }}
 */
export function buildReverseMapping(mapping, priorityOverrides = CANONICAL_REVERSE_PRIORITY) {
  const reverseMap = {};

  for (const [unicode, ascii] of Object.entries(mapping)) {
    if (priorityOverrides && priorityOverrides[ascii]) {
      reverseMap[ascii] = priorityOverrides[ascii];
    } else if (!reverseMap[ascii]) {
      reverseMap[ascii] = unicode;
    }
  }

  const sortedKeys = Object.keys(reverseMap).sort((a, b) => b.length - a.length);
  return { reverseMap, sortedKeys };
}
