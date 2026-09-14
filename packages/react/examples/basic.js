/**
 * Minimal example demonstrating @madhu-mltt/react usage.
 */
import React, { useState } from 'react';
import { renderToString } from 'react-dom/server';
import { MLTTProvider, MLText, useMLTT } from '../src/index.js';

function DynamicMalayalamApp() {
  const [heading] = useState('കേരളത്തിലേക്ക് സ്വാഗതം');
  const [description] = useState('ഇത് ഒരു മലയാളം വെബ്സൈറ്റാണ്.');
  const { toMLTT } = useMLTT();

  return (
    React.createElement('main', { className: 'container' },
      React.createElement(MLText, { as: 'h1', className: 'hero-title' }, heading),
      React.createElement(MLText, { as: 'p', className: 'lead-text' }, description),
      React.createElement('div', { className: 'direct-converted' },
        `Direct conversion via hook: ${toMLTT('കേരളം')}`
      )
    )
  );
}

export function renderDemo() {
  const html = renderToString(
    React.createElement(
      MLTTProvider,
      {
        font: {
          family: 'ML-TTKarthika',
          src: '/fonts/ML_TT_Karthika_Normal.ttf'
        }
      },
      React.createElement(DynamicMalayalamApp)
    )
  );

  console.log('=== REACT DEMO RENDERED SSR OUTPUT ===\n');
  console.log(html);
  console.log('\n======================================');
}

if (process.argv[1] && process.argv[1].endsWith('basic.js')) {
  renderDemo();
}
