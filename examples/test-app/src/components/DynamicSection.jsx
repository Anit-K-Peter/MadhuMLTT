import React, { useState } from 'react';
import { MLText, useMLTT } from '../../../../packages/react/src/index.js';

export function DynamicSection() {
  const [inputText, setInputText] = useState('കേരളം എന്റെ ജന്മനാടാണ്');
  const [clickCount, setClickCount] = useState(0);
  const { toMLTT } = useMLTT();

  const presets = [
    'കേരളം എന്റെ ജന്മനാടാണ്',
    'തിരുവനന്തപുരം കേരളത്തിന്റെ തലസ്ഥാനമാണ്',
    'മലയാളം നമ്മുടെ മാതൃഭാഷയാണ്',
    'സ്വാഗതം — Welcome to Kerala'
  ];

  return (
    <section id="dynamic" className="content-card">
      <MLText as="h2" className="card-heading">
        തത്സമയ മാറ്റങ്ങൾ — Dynamic React State Test
      </MLText>

      <MLText as="p" className="card-paragraph">
        താഴെ കൊടുത്തിരിക്കുന്ന ബോക്സിൽ ടൈപ്പ് ചെയ്യുമ്പോൾ അക്ഷരങ്ങൾ തത്സമയം കൺവേർട്ട് ചെയ്യപ്പെടും:
      </MLText>

      <input
        type="text"
        className="input-field"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="മലയാളം ടൈപ്പ് ചെയ്യുക..."
      />

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {presets.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            className="btn-primary"
            style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', backgroundColor: '#334155' }}
            onClick={() => setInputText(preset)}
          >
            ഉദാഹരണം {idx + 1}
          </button>
        ))}
      </div>

      <div className="interactive-box">
        <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
          റിയാക്ട് സ്റ്റേറ്റ് വഴി തെളിഞ്ഞുവരുന്ന ടെക്സ്റ്റ് (React State Output):
        </div>
        
        {/* Dynamic State rendered through MLText */}
        <MLText as="div" style={{ fontSize: '1.4rem', color: '#f8fafc', fontWeight: 'bold' }}>
          {inputText || 'ടെക്സ്റ്റ് നൽകിയിട്ടില്ല'}
        </MLText>

        <div style={{ marginTop: '1rem', borderTop: '1px solid #334155', paddingTop: '0.75rem' }}>
          <button
            type="button"
            className="btn-primary"
            onClick={() => setClickCount(c => c + 1)}
          >
            <MLText>ക്ലിക്ക് എണ്ണം</MLText>: {clickCount}
          </button>
          
          <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
            Direct hook output (toMLTT): {toMLTT(inputText)}
          </div>
        </div>
      </div>
    </section>
  );
}
