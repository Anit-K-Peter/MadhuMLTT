/**
 * Styles and CSS utilities for @madhu-mltt/react accessibility markup.
 */

// Screen reader only (sr-only) styling rules to hide Unicode Malayalam text
// visually while preserving full screen reader, copy/paste, and SEO accessibility.
export const srOnlyStyle = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: '0'
};
