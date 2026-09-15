/**
 * Madhu ML TT — CSS Parser & @font-mltt Transformer (@madhu-mltt/css)
 */

import fs from 'node:fs';
import path from 'node:path';
import { defaultMapping, getMapping, validateMapping } from '@madhu-mltt/core';

/**
 * Removes leading and trailing quotes (single or double) from a string.
 *
 * @param {string} str
 * @returns {string}
 */
export function unquote(str) {
  if (!str) return '';
  const trimmed = str.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

/**
 * Parses url(...) expression to extract inner clean path/URL.
 *
 * @param {string} val
 * @returns {string}
 */
export function extractUrlValue(val) {
  if (!val) return '';
  const trimmed = val.trim();
  const urlMatch = trimmed.match(/^url\((.*)\)$/i);
  if (urlMatch) {
    return unquote(urlMatch[1]);
  }
  return unquote(trimmed);
}

/**
 * Parses a single property line inside an at-rule block.
 *
 * @param {string} line
 * @returns {{ key: string, value: string } | null}
 */
function parsePropertyLine(line) {
  const colonIdx = line.indexOf(':');
  if (colonIdx === -1) return null;

  const key = line.slice(0, colonIdx).trim().toLowerCase();
  let value = line.slice(colonIdx + 1).trim();
  if (value.endsWith(';')) {
    value = value.slice(0, -1).trim();
  }
  return { key, value };
}

/**
 * Parses CSS content, finds all @font-mltt at-rules, extracts metadata,
 * and transforms @font-mltt blocks into standard @font-face CSS blocks.
 *
 * @param {string} cssCode - Source CSS code
 * @param {object} [options]
 * @param {string} [options.filename] - Absolute path of the CSS file for relative path resolution
 * @param {boolean} [options.resolveJson=true] - Whether to load and validate local JSON mappings
 * @returns {{ css: string, rules: Array<object> }}
 */
export function parseFontMLTT(cssCode, options = {}) {
  if (typeof cssCode !== 'string' || !cssCode.includes('@font-mltt')) {
    return { css: cssCode || '', rules: [] };
  }

  const { filename, resolveJson = true } = options;
  const rules = [];

  // Regex to match `@font-mltt { ... }` blocks (handling nested braces safely if any)
  const atRuleRegex = /@font-mltt\s*\{([^}]*)\}/gi;

  const transformedCss = cssCode.replace(atRuleRegex, (fullMatch, blockContent) => {
    const lines = blockContent.split('\n');
    const descriptors = [];
    let fontFamilyRaw = '';
    let fontFamily = '';
    let mappingRaw = '';
    let srcRaw = '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('/*')) continue;

      const prop = parsePropertyLine(trimmed);
      if (!prop) continue;

      if (prop.key === 'font-family') {
        fontFamilyRaw = prop.value;
        fontFamily = unquote(prop.value);
        descriptors.push(`  font-family: ${fontFamilyRaw};`);
      } else if (prop.key === 'mapping') {
        mappingRaw = prop.value;
      } else if (prop.key === 'src') {
        srcRaw = prop.value;
        descriptors.push(`  src: ${srcRaw};`);
      } else {
        descriptors.push(`  ${prop.key}: ${prop.value};`);
      }
    }

    if (!fontFamily) {
      fontFamily = 'ML-TTKarthika';
    }

    // Resolve mapping metadata
    let mappingType = 'builtin';
    let mappingValue = mappingRaw ? unquote(mappingRaw) : 'Karthika';
    let resolvedMapping = null;

    if (mappingRaw.toLowerCase().startsWith('url(') || mappingValue.endsWith('.json') || mappingValue.includes('/') || mappingValue.includes('\\')) {
      mappingType = 'file';
      mappingValue = extractUrlValue(mappingRaw);
    } else {
      const builtin = getMapping(mappingValue);
      if (builtin) {
        mappingType = 'builtin';
        mappingValue = builtin.name || mappingValue;
        resolvedMapping = builtin;
      }
    }

    // If file-based mapping and resolveJson is true, load & validate mapping
    if (mappingType === 'file' && resolveJson && filename) {
      try {
        const cssDir = path.dirname(filename);
        const resolvedJsonPath = path.resolve(cssDir, mappingValue);
        if (fs.existsSync(resolvedJsonPath)) {
          const rawContent = fs.readFileSync(resolvedJsonPath, 'utf-8');
          const parsedData = JSON.parse(rawContent);
          const validation = validateMapping(parsedData);

          if (validation.valid) {
            resolvedMapping = parsedData;
          } else {
            console.warn(`[@madhu-mltt/css]: Mapping validation failed for ${resolvedJsonPath}:`, validation.errors.join(', '));
          }
        } else {
          console.warn(`[@madhu-mltt/css]: Mapping file not found: ${resolvedJsonPath}`);
        }
      } catch (err) {
        console.warn(`[@madhu-mltt/css]: Failed to parse JSON mapping file ${mappingValue}:`, err.message);
      }
    } else if (mappingType === 'builtin' && !resolvedMapping) {
      resolvedMapping = defaultMapping;
    }

    const ruleObj = {
      fontFamily,
      fontFamilyRaw,
      mappingRaw,
      mappingType,
      mappingValue,
      mapping: resolvedMapping || defaultMapping,
      srcRaw,
      rawBlock: fullMatch
    };

    rules.push(ruleObj);

    // Transform `@font-mltt` to `@font-face`
    return `@font-face {\n${descriptors.join('\n')}\n}`;
  });

  return {
    css: transformedCss,
    rules
  };
}
