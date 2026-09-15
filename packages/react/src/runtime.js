import React from 'react';
import { createConverter, defaultMapping } from '@madhu-mltt/core';

// Default memoized converter instance using standard Karthika mapping
const defaultConverter = createConverter(defaultMapping);

/**
 * High-performance, type-safe runtime helper for automatic zero-syntax ML-TT conversion
 * of dynamic JSX expressions.
 *
 * @param {any} value Evaluated JSX child expression
 * @returns {any} Converted string, processed array, or original value
 */
export function __madhuConvert(value) {
  if (value == null || typeof value === 'boolean' || typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    if (!/[\u0D00-\u0D7F]/.test(value)) {
      return value;
    }
    return defaultConverter.toMLTT(value);
  }

  if (React.isValidElement(value)) {
    return value;
  }

  if (Array.isArray(value)) {
    let hasMalayalam = false;
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      if (typeof item === 'string' && /[\u0D00-\u0D7F]/.test(item)) {
        hasMalayalam = true;
        break;
      }
      if (Array.isArray(item)) {
        hasMalayalam = true;
        break;
      }
    }

    if (!hasMalayalam) {
      return value;
    }

    return value.map(item => __madhuConvert(item));
  }

  return value;
}
