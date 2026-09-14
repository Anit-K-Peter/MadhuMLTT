import React from 'react';
import { MLText } from '@madhu-mltt/react';

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="section-box">
        <MLText as="h3" className="section-h3" style={{ marginTop: 0 }}>
          വാർത്താ സംഗ്രഹം (Quick News)
        </MLText>

        <ul className="custom-list">
          <li className="custom-list-item">
            <MLText>കേരളീയ സംസ്കാര സമ്മേളനം നാളെ</MLText>
          </li>
          <li className="custom-list-item">
            <MLText>പുതിയ മലയാളം പുസ്തകങ്ങൾ പ്രകാശനം ചെയ്തു</MLText>
          </li>
          <li className="custom-list-item">
            <MLText>മലയാള ഭാഷാ ദിനാഘോഷങ്ങൾ ആരംഭിച്ചു</MLText>
          </li>
        </ul>
      </div>

      <div className="section-box">
        <MLText as="h3" className="section-h3" style={{ marginTop: 0 }}>
          സാങ്കേതിക വിവരങ്ങൾ (SDK Info)
        </MLText>

        <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
          <div>
            <span style={{ color: '#f8fafc', fontWeight: 'bold' }}>Default Mapping: </span>
            <span>Built-in ML-TT Karthika</span>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <span style={{ color: '#f8fafc', fontWeight: 'bold' }}>Accessibility: </span>
            <span>Dual-Span Screen Reader Ready</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
