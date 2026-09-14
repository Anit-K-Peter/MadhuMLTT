import React from 'react';
import { MLText } from '@madhu-mltt/react';

export function ContentSection() {
  return (
    <section id="content" className="section-box">
      <MLText as="h2" className="section-h2">
        മലയാള ഭാഷയും പാരമ്പര്യവും
      </MLText>

      {/* Paragraph with nested formatting */}
      <MLText as="p" className="paragraph-text">
        ഇത് <strong>പ്രധാനപ്പെട്ട</strong> വിവരമാണ്. മലയാളം ദക്ഷിണേന്ത്യയിൽ സംസാരിക്കപ്പെടുന്ന ഒരു പ്രധാന ഭാഷയാണ്.
      </MLText>

      {/* Mixed Malayalam + English + Numbers */}
      <MLText as="p" className="paragraph-text">
        കേരളം — Kerala 2026 സാക്ഷരതയിലും സാമൂഹിക വികസനത്തിലും മുൻപന്തിയിൽ നിൽക്കുന്നു.
      </MLText>

      <MLText as="h3" className="section-h3">
        പ്രധാന വിനോദസഞ്ചാര കേന്ദ്രങ്ങൾ
      </MLText>

      <ul className="custom-list">
        <li className="custom-list-item">
          <MLText>ആലപ്പുഴ: കായൽ സൗന്ദര്യവും കെട്ടുവള്ളങ്ങളും</MLText>
        </li>
        <li className="custom-list-item">
          <MLText>മൂന്നാർ: തേയിലത്തോട്ടങ്ങളും തണുപ്പുള്ള കാലാവസ്ഥയും</MLText>
        </li>
        <li className="custom-list-item">
          <MLText>വയനാട്: പച്ചപ്പും വനസൗന്ദര്യവും</MLText>
        </li>
      </ul>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
        <MLText as="button" className="btn-action" onClick={() => alert('കൂടുതൽ വിവരങ്ങൾ തത്സമയം ലഭ്യമാണ്')}>
          കൂടുതൽ വിവരങ്ങൾ
        </MLText>

        <MLText as="a" href="#hero" className="btn-action" style={{ backgroundColor: '#283552', textDecoration: 'none' }}>
          മുകളിലേക്ക് പോകുക
        </MLText>
      </div>
    </section>
  );
}
