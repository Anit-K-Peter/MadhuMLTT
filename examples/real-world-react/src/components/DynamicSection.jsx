import React, { useState } from 'react';
import { MLText } from '@madhu-mltt/react';

export function DynamicSection() {
  const [title, setTitle] = useState('കേരളം');
  const [updateCount, setUpdateCount] = useState(0);

  const titleOptions = [
    'കേരളം',
    'തിരുവനന്തപുരം',
    'കൊച്ചി',
    'കോഴിക്കോട്',
    'ഇന്ത്യ'
  ];

  const handleNextTitle = () => {
    const nextIdx = (updateCount + 1) % titleOptions.length;
    setTitle(titleOptions[nextIdx]);
    setUpdateCount(c => c + 1);
  };

  return (
    <section id="dynamic" className="section-box">
      <MLText as="h2" className="section-h2">
        തത്സമയ സ്റ്റേറ്റ് മാറ്റങ്ങൾ (Dynamic React State)
      </MLText>

      <MLText as="p" className="paragraph-text">
        ബട്ടൺ ക്ലിക്ക് ചെയ്യുമ്പോൾ റിയാക്ട് സ്റ്റേറ്റ് മാറി മലയാളം വാചകം തത്സമയം അപ്ഡേറ്റ് ചെയ്യപ്പെടും:
      </MLText>

      <div style={{ backgroundColor: '#0b1329', border: '1px solid #283552', padding: '1.25rem', borderRadius: '6px', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
          ഇപ്പോഴത്തെ സ്റ്റേറ്റ് മൂല്യം (Active State Output):
        </div>
        
        {/* Dynamic state content rendered through MLText */}
        <MLText as="div" style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#f8fafc' }}>
          {title}
        </MLText>

        <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
          അപ്‌ഡേറ്റ് എണ്ണം: {updateCount}
        </div>
      </div>

      <button
        type="button"
        className="btn-action"
        onClick={handleNextTitle}
      >
        <MLText>അടുത്ത സ്ഥലം കാണിക്കുക</MLText>
      </button>
    </section>
  );
}
