import React, { forwardRef, useMemo } from 'react';
import { createConverter } from '@madhu-mltt/core';
import { useMLTT } from './hook.js';
import { srOnlyStyle } from './styles.js';

/**
 * Transforms string and number children recursively into ML-TT font encodings while preserving React elements.
 *
 * @param {React.ReactNode} children
 * @param {object} converter Core MLTTConverter instance
 * @param {string} fontFamily Active font family name
 * @param {boolean} accessible Whether dual-span accessibility markup is enabled
 * @returns {React.ReactNode}
 */
function processChildren(children, converter, fontFamily, accessible) {
  if (children == null || typeof children === 'boolean') {
    return null;
  }

  // Handle plain string or number text nodes
  if (typeof children === 'string' || typeof children === 'number') {
    const rawText = String(children);
    if (!rawText.trim()) {
      return rawText;
    }

    const convertedText = converter.toMLTT(rawText);

    if (accessible) {
      return React.createElement(
        React.Fragment,
        null,
        React.createElement(
          'span',
          {
            'aria-hidden': 'true',
            style: { fontFamily }
          },
          convertedText
        ),
        React.createElement(
          'span',
          {
            style: srOnlyStyle
          },
          rawText
        )
      );
    }

    return convertedText;
  }

  // Handle arrays of children recursively
  if (Array.isArray(children)) {
    return children.map((child, index) => {
      const processed = processChildren(child, converter, fontFamily, accessible);
      if (React.isValidElement(processed)) {
        return React.cloneElement(processed, { key: child.key || index });
      }
      return processed;
    });
  }

  // Handle React elements (e.g., <strong>, <a>, custom components)
  if (React.isValidElement(children)) {
    // If element has text children, recursively process children
    if (children.props && children.props.children) {
      const processedSubChildren = processChildren(
        children.props.children,
        converter,
        fontFamily,
        accessible
      );
      return React.cloneElement(children, {}, processedSubChildren);
    }
    return children;
  }

  return children;
}

/**
 * MLText Component
 * Explicit component wrapper that performs Unicode -> ML-TT conversion and applies custom font family styling.
 */
export const MLText = forwardRef(function MLText(
  {
    as: Component = 'span',
    children,
    fontFamily: fontOverride,
    mapping: mappingOverride,
    accessible: accessibleOverride,
    className,
    style,
    ...restProps
  },
  ref
) {
  const mlttContext = useMLTT();

  // Component-level converter if custom mapping override is provided
  const componentConverter = useMemo(() => {
    if (mappingOverride) {
      return createConverter({ mapping: mappingOverride });
    }
    return null;
  }, [mappingOverride]);

  const activeConverter = componentConverter || mlttContext.converter;
  const activeFontFamily = fontOverride || mlttContext.fontFamily || 'ML-TTKarthika';
  const isAccessible = accessibleOverride ?? mlttContext.accessible ?? true;

  // Process children text conversion memoized on input text & converter
  const transformedChildren = useMemo(() => {
    return processChildren(children, activeConverter, activeFontFamily, isAccessible);
  }, [children, activeConverter, activeFontFamily, isAccessible]);

  // Combine styles for non-accessible mode where fontFamily is placed on the container
  const containerStyle = useMemo(() => {
    if (!isAccessible) {
      return {
        fontFamily: activeFontFamily,
        ...style
      };
    }
    return style;
  }, [isAccessible, activeFontFamily, style]);

  return React.createElement(
    Component,
    {
      ref,
      className,
      style: containerStyle,
      ...restProps
    },
    transformedChildren
  );
});
