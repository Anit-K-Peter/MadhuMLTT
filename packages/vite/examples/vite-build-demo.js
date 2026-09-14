/**
 * Real-world demonstration of @madhu-mltt/vite build-time transformation.
 */
import { madhuMLTTVite } from '../src/index.js';

const sampleAppSource = `
import React from 'react';

export function HomePage() {
  const dynamicTitle = "Dynamic Content";
  
  return (
    <div className="page-container">
      <h1 className="hero-title">കേരളത്തിലേക്ക് സ്വാഗതം</h1>
      <p className="lead">ഇത് ഒരു മലയാളം വെബ്സൈറ്റാണ്.</p>
      <div className="dynamic">{dynamicTitle}</div>
      <div data-mltt-ignore>Raw Malayalam: കേരളം</div>
    </div>
  );
}
`;

export function runViteBuildDemo() {
  console.log('====================================================');
  console.log('MADHU ML TT — VITE BUILD TRANSFORM DEMO');
  console.log('====================================================\n');

  console.log('--- ORIGINAL SOURCE CODE ---');
  console.log(sampleAppSource.trim());
  console.log('\n----------------------------');

  const plugin = madhuMLTTVite({ fontFamily: 'ML-TTKarthika' });
  const result = plugin.transform(sampleAppSource, 'src/HomePage.jsx');

  console.log('--- TRANSFORMED OUTPUT FOR BUNDLE ---');
  console.log(result.code);
  console.log('====================================================\n');
}

if (process.argv[1] && process.argv[1].endsWith('vite-build-demo.js')) {
  runViteBuildDemo();
}
