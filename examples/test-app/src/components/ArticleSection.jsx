import React from 'react';
import { MLText } from '../../../../packages/react/src/index.js';

export function ArticleSection() {
  return (
    <section id="articles" className="content-card">
      <div className="meta-badge">പ്രത്യേക ലേഖനം — Featured Article</div>
      
      {/* Explicit MLText heading */}
      <MLText as="h2" className="card-heading">
        കേരളത്തിലെ സംസ്കാരവും ചരിത്രവും
      </MLText>

      {/* Polymorphic MLText paragraph with mixed Malayalam + English */}
      <MLText as="p" className="card-paragraph">
        കേരളം — Kerala ദക്ഷിണേന്ത്യയിലെ മലബാർ തീരത്ത് സ്ഥിതി ചെയ്യുന്ന ഒരു സംസ്ഥാനമാണ്. 1956 നവംബർ 1-നാണ് സംസ്ഥാന രൂപീകരണം നടന്നത്.
      </MLText>

      {/* Polymorphic MLText paragraph with nested formatting */}
      <MLText as="p" className="card-paragraph">
        മലയാള ഭാഷ <strong>സംസ്കൃതവും പ്രാചീന തമിഴും</strong> സംയോജിച്ച് വികസിച്ച ഒരു ദ്രാവിഡ ഭാഷയാണ്. സാഹിത്യത്തിലും കലകളിലും കേരളത്തിന് മഹത്തായ പാരമ്പര്യമുണ്ട്.
      </MLText>

      {/* Large Malayalam content block */}
      <MLText as="p" className="card-paragraph">
        വള്ളത്തോൾ നാരായണമേനോൻ, കുമാരനാശാൻ, ഉള്ളൂർ എസ്. പരമേശ്വരയ്യ എന്നീ മഹാകവികൾ മലയാള കവിതയ്ക്ക് വലിയ സംഭാവനകൾ നൽകി. കഥകളി, മോഹിനിയാട്ടം, തുള്ളൽ എന്നിവ കേരളത്തിന്റെ പരമ്പരാഗത ദൃശ്യകലാ രൂപങ്ങളാണ്.
      </MLText>

      <div className="interactive-box">
        <MLText as="a" href="#read-full" className="nav-link" style={{ fontWeight: 'bold', color: '#f59e0b' }}>
          സമ്പൂർണ്ണ ലേഖനം വായിക്കുക →
        </MLText>
      </div>
    </section>
  );
}
