import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';
import generateModule from '@babel/generator';
import * as t from '@babel/types';

// Support default/named ESM import compatibility for Babel modules
const traverse = traverseModule.default || traverseModule;
const generate = generateModule.default || generateModule;

/**
 * AST Transformer for static Malayalam JSX text nodes.
 *
 * @param {string} code Source code string
 * @param {string} filename File path
 * @param {object} options
 * @param {object} options.converter Core MLTTConverter instance
 * @param {string} options.fontFamily Target legacy font family name
 * @param {boolean} options.accessible Whether dual-span accessibility markup is enabled
 * @returns {{ code: string, map?: object } | null}
 */
export function transformSource(code, filename, options) {
  const { converter, fontFamily = 'ML-TTKarthika', accessible = true } = options;

  let ast;
  try {
    ast = parse(code, {
      sourceType: 'module',
      plugins: [
        'jsx',
        'typescript',
        'classProperties',
        'objectRestSpread'
      ],
      sourceFilename: filename
    });
  } catch (err) {
    // If code cannot be parsed (e.g. non-JS asset), return null cleanly
    return null;
  }

  let transformed = false;

  traverse(ast, {
    JSXText(path) {
      if (path.node._madhuProcessed) return;

      // Check if parent element has data-mltt-ignore attribute
      const parentElement = path.findParent(p => p.isJSXElement());
      if (parentElement) {
        const hasIgnore = parentElement.node.openingElement.attributes.some(
          attr => t.isJSXAttribute(attr) && attr.name.name === 'data-mltt-ignore'
        );
        if (hasIgnore) return;
      }

      const rawText = path.node.value;
      if (!/[\u0D00-\u0D7F]/.test(rawText)) return;

      const trimmed = rawText.trim();
      if (!trimmed) return;

      const convertedMLTT = converter.toMLTT(trimmed);

      if (accessible) {
        const visualSpan = t.jsxElement(
          t.jsxOpeningElement(t.jsxIdentifier('span'), [
            t.jsxAttribute(t.jsxIdentifier('aria-hidden'), t.stringLiteral('true')),
            t.jsxAttribute(
              t.jsxIdentifier('style'),
              t.jsxExpressionContainer(
                t.objectExpression([
                  t.objectProperty(t.identifier('fontFamily'), t.stringLiteral(fontFamily))
                ])
              )
            )
          ]),
          t.jsxClosingElement(t.jsxIdentifier('span')),
          [t.jsxExpressionContainer(t.stringLiteral(convertedMLTT))],
          false
        );

        const srOnlySpan = t.jsxElement(
          t.jsxOpeningElement(t.jsxIdentifier('span'), [
            t.jsxAttribute(
              t.jsxIdentifier('style'),
              t.jsxExpressionContainer(
                t.objectExpression([
                  t.objectProperty(t.identifier('position'), t.stringLiteral('absolute')),
                  t.objectProperty(t.identifier('width'), t.stringLiteral('1px')),
                  t.objectProperty(t.identifier('height'), t.stringLiteral('1px')),
                  t.objectProperty(t.identifier('padding'), t.numericLiteral(0)),
                  t.objectProperty(t.identifier('margin'), t.stringLiteral('-1px')),
                  t.objectProperty(t.identifier('overflow'), t.stringLiteral('hidden')),
                  t.objectProperty(t.identifier('clip'), t.stringLiteral('rect(0, 0, 0, 0)')),
                  t.objectProperty(t.identifier('whiteSpace'), t.stringLiteral('nowrap')),
                  t.objectProperty(t.identifier('borderWidth'), t.numericLiteral(0))
                ])
              )
            )
          ]),
          t.jsxClosingElement(t.jsxIdentifier('span')),
          [t.jsxText(trimmed)],
          false
        );

        const fragment = t.jsxFragment(
          t.jsxOpeningFragment(),
          t.jsxClosingFragment(),
          [visualSpan, srOnlySpan]
        );

        fragment._madhuProcessed = true;
        path.replaceWith(fragment);
        path.skip();
        transformed = true;
      } else {
        const exprNode = t.jsxExpressionContainer(t.stringLiteral(convertedMLTT));
        exprNode._madhuProcessed = true;
        path.replaceWith(exprNode);
        path.skip();
        transformed = true;
      }
    }
  });

  if (!transformed) {
    return null;
  }

  const output = generate(ast, { sourceMaps: true, sourceFileName: filename }, code);
  return {
    code: output.code,
    map: output.map
  };
}
