import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';
import generateModule from '@babel/generator';
import * as t from '@babel/types';

// Support default/named ESM import compatibility for Babel modules
const traverse = traverseModule.default || traverseModule;
const generate = generateModule.default || generateModule;

/**
 * Checks if a JSX element or any of its parent JSX elements has the data-mltt-ignore attribute.
 *
 * @param {import('@babel/traverse').NodePath} path
 * @returns {boolean}
 */
function hasMlttIgnore(path) {
  const parentElement = path.findParent(p => p.isJSXElement());
  if (!parentElement) return false;

  const attributes = parentElement.node.openingElement.attributes || [];
  const hasIgnore = attributes.some(
    attr => t.isJSXAttribute(attr) && attr.name && attr.name.name === 'data-mltt-ignore'
  );

  if (hasIgnore) return true;
  return hasMlttIgnore(parentElement);
}

/**
 * AST Transformer for zero-syntax automatic Malayalam text conversion in React/JSX.
 *
 * @param {string} code Source code string
 * @param {string} filename File path
 * @param {object} options
 * @param {object} options.converter Core MLTTConverter instance
 * @param {string} [options.fontFamily='ML-TTKarthika'] Target legacy font family name
 * @param {boolean} [options.accessible=false] Enable accessible dual-span markup
 * @returns {{ code: string, map?: object } | null}
 */
export function transformSource(code, filename, options) {
  const { converter, fontFamily = 'ML-TTKarthika', accessible = false } = options;

  let ast;
  try {
    ast = parse(code, {
      sourceType: 'module',
      plugins: [
        'jsx',
        'typescript',
        'classProperties',
        'objectRestSpread',
        'decorators-legacy'
      ],
      sourceFilename: filename
    });
  } catch (err) {
    // If code cannot be parsed (e.g. non-JS asset), return null cleanly
    return null;
  }

  let transformed = false;
  let needsRuntimeImport = false;

  traverse(ast, {
    JSXText(path) {
      if (path.node._madhuProcessed) return;
      if (hasMlttIgnore(path)) return;

      const rawText = path.node.value;
      if (!/[\u0D00-\u0D7F]/.test(rawText)) return;

      const trimmed = rawText.trim();
      if (!trimmed) return;

      const convertedMLTT = converter.toMLTT(trimmed);

      if (accessible) {
        // Explicit accessible dual-span mode requested by user options
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
        // Zero-syntax clean DOM mode: convert Malayalam text directly using core converter
        const convertedMLTT = converter.toMLTT(rawText);
        const replacementNode = t.jsxText(convertedMLTT);
        replacementNode._madhuProcessed = true;
        path.replaceWith(replacementNode);
        path.skip();
        transformed = true;
      }
    },

    JSXExpressionContainer(path) {
      if (path.node._madhuProcessed) return;

      // Only transform JSXExpressionContainers that are direct children of JSXElement or JSXFragment
      const isChildPosition = path.parentPath.isJSXElement() || path.parentPath.isJSXFragment();
      if (!isChildPosition) return;

      if (hasMlttIgnore(path)) return;

      const expr = path.node.expression;

      // Skip JSX Empty Expressions (e.g. comment containers `{/* ... */}`)
      if (t.isJSXEmptyExpression(expr)) return;

      // Skip if already wrapped in __madhuConvert
      if (
        t.isCallExpression(expr) &&
        t.isIdentifier(expr.callee) &&
        expr.callee.name === '__madhuConvert'
      ) {
        return;
      }

      // Wrap expression with __madhuConvert helper call
      const wrappedExpr = t.callExpression(t.identifier('__madhuConvert'), [expr]);
      path.node.expression = wrappedExpr;
      path.node._madhuProcessed = true;
      transformed = true;
      needsRuntimeImport = true;
    }
  });

  if (!transformed) {
    return null;
  }

  // Inject runtime helper import if dynamic expressions were wrapped
  if (needsRuntimeImport) {
    let hasImportAlready = false;
    for (const statement of ast.program.body) {
      if (
        t.isImportDeclaration(statement) &&
        statement.source.value === '@madhu-mltt/react/runtime'
      ) {
        hasImportAlready = true;
        break;
      }
    }

    if (!hasImportAlready) {
      const runtimeImport = t.importDeclaration(
        [t.importSpecifier(t.identifier('__madhuConvert'), t.identifier('__madhuConvert'))],
        t.stringLiteral('@madhu-mltt/react/runtime')
      );
      ast.program.body.unshift(runtimeImport);
    }
  }

  const output = generate(ast, { sourceMaps: true, sourceFileName: filename }, code);
  return {
    code: output.code,
    map: output.map
  };
}
