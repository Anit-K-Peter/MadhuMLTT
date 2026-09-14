/**
 * Client-side font loader utility for @madhu-mltt/react.
 * Safely registers custom @font-face rules without breaking SSR.
 */

const registeredFonts = new Set();

/**
 * Normalizes a font parameter into a canonical font family name and font object.
 * @param {string | object} font 
 * @returns {{ family: string, src?: string, weight?: string|number, style?: string, format?: string }}
 */
export function normalizeFont(font) {
  if (!font) {
    return { family: 'ML-TTKarthika' };
  }
  if (typeof font === 'string') {
    return { family: font };
  }
  if (typeof font === 'object' && font.family) {
    return {
      family: font.family,
      src: font.src,
      weight: font.weight || 'normal',
      style: font.style || 'normal',
      format: font.format
    };
  }
  return { family: 'ML-TTKarthika' };
}

/**
 * Dynamically registers @font-face in browser document head if font.src is provided.
 * @param {object} fontConfig 
 */
export function registerFontFace(fontConfig) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return; // Safe for SSR / Node environment
  }

  const { family, src, weight = 'normal', style = 'normal', format } = normalizeFont(fontConfig);

  if (!src || registeredFonts.has(family)) {
    return;
  }

  try {
    // Check if FontFace API is available
    if (typeof window.FontFace !== 'undefined') {
      const formatString = format ? ` format('${format}')` : '';
      const fontFace = new FontFace(family, `url(${src})${formatString}`, { style, weight });
      fontFace.load().then((loadedFace) => {
        document.fonts.add(loadedFace);
        registeredFonts.add(family);
      }).catch((err) => {
        console.warn(`[Madhu ML TT React]: Failed to load font "${family}" from ${src}:`, err.message);
      });
    } else {
      // Fallback to style tag injection
      const styleId = `madhu-mltt-font-${family.replace(/\s+/g, '-').toLowerCase()}`;
      if (!document.getElementById(styleId)) {
        const styleEl = document.createElement('style');
        styleEl.id = styleId;
        const formatRule = format ? ` format('${format}')` : '';
        styleEl.appendChild(
          document.createTextNode(
            `@font-face { font-family: '${family}'; src: url('${src}')${formatRule}; font-weight: ${weight}; font-style: ${style}; font-display: swap; }`
          )
        );
        document.head.appendChild(styleEl);
        registeredFonts.add(family);
      }
    }
  } catch (err) {
    console.warn(`[Madhu ML TT React]: Font registration error for "${family}":`, err);
  }
}
