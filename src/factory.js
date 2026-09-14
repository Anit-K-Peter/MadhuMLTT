/**
 * Madhu ML TT — Core SDK Factory & Converter Class
 */

import defaultMappingData from './mapping.json' with { type: 'json' };
import { unicodeToMLTT } from './converter/unicode-to-mltt.js';
import { mlttToUnicode } from './converter/mltt-to-unicode.js';
import { normalizeUnicode, containsMalayalam } from './converter/normalize.js';
import { buildReverseMapping } from './converter/reorder.js';

/**
 * Validates a mapping schema structure.
 *
 * @param {any} mappingData
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateMapping(mappingData) {
  const errors = [];
  if (!mappingData || typeof mappingData !== 'object' || Array.isArray(mappingData)) {
    errors.push('Mapping data must be a non-null object.');
    return { valid: false, errors };
  }

  const mappingObj = typeof mappingData.mapping === 'object' && mappingData.mapping !== null
    ? mappingData.mapping
    : mappingData;

  if (typeof mappingObj !== 'object' || mappingObj === null || Array.isArray(mappingObj)) {
    errors.push('Mapping data must contain a valid dictionary object.');
    return { valid: false, errors };
  }

  const entries = [];
  for (const [k, v] of Object.entries(mappingObj)) {
    if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      entries.push(...Object.entries(v));
    } else {
      entries.push([k, v]);
    }
  }

  if (entries.length === 0) {
    errors.push('Mapping dictionary is empty.');
  }

  const hasStringMappings = entries.some(([k, v]) => typeof k === 'string' && typeof v === 'string' && k.length > 0);
  if (!hasStringMappings) {
    errors.push('Mapping dictionary contains no valid string character pairs.');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * High-performance LRU Cache implementation for string transformations.
 */
class SimpleLRUCache {
  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return undefined;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }

  clear() {
    this.cache.clear();
  }
}

/**
 * Core ML-TT Converter Instance
 */
export class MLTTConverter {
  /**
   * @param {object} [options]
   * @param {Record<string, string> | object} [options.mapping] - Custom mapping dictionary or mapping JSON asset
   * @param {'strict' | 'mixed'} [options.mode='strict'] - Default reverse conversion mode
   * @param {boolean} [options.preserveEnglish=false] - Default English preservation flag for reverse conversion
   * @param {number} [options.cacheSize=1000] - LRU cache size
   */
  constructor(options = {}) {
    const rawMapping = ('mapping' in options) ? options.mapping : defaultMappingData;
    const validation = validateMapping(rawMapping);

    if (!validation.valid) {
      throw new Error(`Invalid mapping provided to MLTTConverter: ${validation.errors.join(', ')}`);
    }

    // Defensive clone & freeze to guarantee caller immutability
    const sourceDict = typeof rawMapping.mapping === 'object' && rawMapping.mapping !== null
      ? rawMapping.mapping
      : rawMapping;

    this.mapping = Object.freeze({ ...sourceDict });
    this.name = rawMapping.name || 'CustomMapping';
    this.mode = options.mode || 'strict';
    this.preserveEnglish = options.preserveEnglish ?? (this.mode === 'mixed');
    
    // Index reverse map for performance
    const context = buildReverseMapping(this.mapping);
    this.reverseMap = Object.freeze(context.reverseMap);
    this.sortedKeys = Object.freeze(context.sortedKeys);

    this.forwardCache = new SimpleLRUCache(options.cacheSize || 1000);
    this.reverseCache = new SimpleLRUCache(options.cacheSize || 1000);
  }

  /**
   * Converts Unicode Malayalam text to ML-TT ASCII string.
   *
   * @param {string} text
   * @returns {string}
   */
  toMLTT(text) {
    if (!text) return '';
    const cached = this.forwardCache.get(text);
    if (cached !== undefined) return cached;

    const result = unicodeToMLTT(text, { mapping: this.mapping });
    this.forwardCache.set(text, result);
    return result;
  }

  /**
   * Converts ML-TT ASCII encoded text to modern Unicode Malayalam text.
   *
   * @param {string} asciiText
   * @param {object} [overrideOptions]
   * @returns {string}
   */
  toUnicode(asciiText, overrideOptions = {}) {
    if (!asciiText) return '';
    
    const preserveEng = overrideOptions.preserveEnglish ?? this.preserveEnglish;
    const cacheKey = `${preserveEng ? 'mixed:' : 'strict:'}${asciiText}`;

    const cached = this.reverseCache.get(cacheKey);
    if (cached !== undefined) return cached;

    const result = mlttToUnicode(asciiText, {
      mapping: this.mapping,
      preserveEnglish: preserveEng,
      mode: overrideOptions.mode || this.mode
    });

    this.reverseCache.set(cacheKey, result);
    return result;
  }

  /**
   * Smart directional converter.
   * Converts Unicode -> ML-TT if input contains Malayalam, else converts ML-TT -> Unicode.
   *
   * @param {string} text
   * @param {object} [options]
   * @returns {string}
   */
  convert(text, options = {}) {
    if (!text) return '';
    if (containsMalayalam(text)) {
      return this.toMLTT(text);
    }
    return this.toUnicode(text, options);
  }

  /**
   * Clear conversion caches.
   */
  clearCache() {
    this.forwardCache.clear();
    this.reverseCache.clear();
  }
}

/**
 * Factory function to create a new MLTTConverter instance.
 *
 * @param {object} [options]
 * @returns {MLTTConverter}
 */
export function createConverter(options = {}) {
  return new MLTTConverter(options);
}
