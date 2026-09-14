import React, { useState } from 'react';
import { MLText } from '@madhu-mltt/react';

export function FormSection() {
  const [name, setName] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      setSubmittedMessage(`നന്ദി ${name}, സന്ദേശം സ്വീകരിച്ചു!`);
    } else {
      setSubmittedMessage('ദയവായി പേര് നൽകുക.');
    }
  };

  return (
    <section className="section-box">
      <MLText as="h2" className="section-h2">
        അഭിപ്രായങ്ങൾ രേഖപ്പെടുത്തുക (Feedback Form)
      </MLText>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <MLText as="label" className="form-label" htmlFor="user-name">
            നിങ്ങളുടെ പേര് (Name):
          </MLText>
          
          <input
            id="user-name"
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="പേര് നൽകുക..."
          />
        </div>

        <button type="submit" className="btn-action">
          <MLText>സന്ദേശം അയക്കുക</MLText>
        </button>
      </form>

      {submittedMessage && (
        <div style={{ marginTop: '1.25rem', backgroundColor: '#0b1329', border: '1px solid #283552', padding: '1rem', borderRadius: '6px' }}>
          <MLText as="div" style={{ color: '#f59e0b', fontWeight: 'bold' }}>
            {submittedMessage}
          </MLText>
        </div>
      )}
    </section>
  );
}
