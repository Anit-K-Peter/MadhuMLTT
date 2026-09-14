import React, { useState, useEffect } from 'react';
import { MLTTProvider, MLText, useMLTT } from '@madhu-mltt/react';
import { createConverter } from '@madhu-mltt/core';

// Low-level core converter instance verification
const coreConverter = createConverter();

function HookTester() {
  const { toMLTT } = useMLTT();
  return (
    <div className="card">
      <h3>useMLTT Hook Direct Output</h3>
      <p>Raw converted output for 'കേരളം': <code>{toMLTT('കേരളം')}</code></p>
    </div>
  );
}

export default function App() {
  const [dynamicText, setDynamicText] = useState('കേരളം എന്റെ നാടാണ്');
  const [asyncData, setAsyncData] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAsyncData('മലയാളം വെബ് സാങ്കേതികവിദ്യ');
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <MLTTProvider font="ML-TTKarthika">
      <div className="container">
        {/* Vite static transformation test */}
        <header>
          <h1>കേരളം — Kerala 2026</h1>
          <p>Fresh npm Package Integration Verification</p>
        </header>

        {/* Polymorphic MLText tests */}
        <div className="card">
          <MLText as="h2">സുപ്രഭാതം</MLText>
          <MLText as="p">
            ഇത് ഒരു മലയാളം വെബ്സൈറ്റാണ്. @madhu-mltt/react integration working correctly.
          </MLText>
        </div>

        {/* Dynamic state test */}
        <div className="card">
          <h3>Dynamic State Test</h3>
          <MLText as="p">{dynamicText}</MLText>
          <button onClick={() => setDynamicText('സ്വാഗതം തിരുവനന്തപുരം')}>
            Change State Text
          </button>
        </div>

        {/* Async state test */}
        <div className="card">
          <h3>Async Content Test</h3>
          {asyncData ? (
            <MLText as="p">{asyncData}</MLText>
          ) : (
            <p>Loading Malayalam content...</p>
          )}
        </div>

        {/* Direct core engine verification */}
        <div className="card">
          <h3>Core Engine Direct Conversion</h3>
          <p>Core result for 'കേരളം': <code>{coreConverter.toMLTT('കേരളം')}</code></p>
        </div>

        {/* Hook component */}
        <HookTester />
      </div>
    </MLTTProvider>
  );
}
