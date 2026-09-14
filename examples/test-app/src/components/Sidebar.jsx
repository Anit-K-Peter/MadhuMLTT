import React from 'react';
import { MLText } from '../../../../packages/react/src/index.js';

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-widget">
        <MLText as="h3" className="widget-title">
          പ്രധാന വിവരങ്ങൾ — Quick Info
        </MLText>
        
        <ul className="widget-list">
          <li className="widget-item">
            <MLText>തലസ്ഥാനം: തിരുവനന്തപുരം</MLText>
          </li>
          <li className="widget-item">
            <MLText>ഔദ്യോഗിക ഭാഷ: മലയാളം</MLText>
          </li>
          <li className="widget-item">
            <MLText>ജനസംഖ്യ: 3.3 കോടി (Approx 33 Million)</MLText>
          </li>
          <li className="widget-item">
            <MLText>സാക്ഷരത: 96.2% Literacy Rate</MLText>
          </li>
        </ul>
      </div>

      {/* Test Edge Cases & Complex Malayalam Characters */}
      <div className="sidebar-widget">
        <MLText as="h3" className="widget-title">
          കൂട്ടക്ഷര പരിശോധന — Character Test
        </MLText>
        
        <div style={{ fontSize: '0.95rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <span style={{ color: '#94a3b8' }}>ചില്ലക്ഷരങ്ങൾ: </span>
            <MLText>ൽ ൺ ർ ൻ ൿ</MLText>
          </div>

          <div style={{ marginBottom: '0.5rem' }}>
            <span style={{ color: '#94a3b8' }}>കൂട്ടക്ഷരങ്ങൾ: </span>
            <MLText>ക്ഷ ഞ്ജ ദ്ധ ഷ്ട ന്റ ങ്ക്</MLText>
          </div>

          <div>
            <span style={{ color: '#94a3b8' }}>അക്കങ്ങൾ: </span>
            <MLText>൦ ൧ ൨ ൩ ൪ ൫ ൬ ൭ ൮ ൯</MLText>
          </div>
        </div>
      </div>
    </aside>
  );
}
