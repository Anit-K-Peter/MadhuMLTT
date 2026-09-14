import React from 'react';
import { MLText } from '@madhu-mltt/react';

export function Header() {
  return (
    <header className="site-header">
      <div className="container nav-bar">
        {/* Transform static header text via Vite build-time plugin */}
        <h1 className="brand-heading">കേരള സംസ്കാര പ്രതിധ്വനി</h1>

        <nav>
          <ul className="nav-menu">
            <li>
              <MLText as="a" href="#hero" className="nav-item-link">പ്രധാന താൾ</MLText>
            </li>
            <li>
              <MLText as="a" href="#content" className="nav-item-link">ലേഖനങ്ങൾ</MLText>
            </li>
            <li>
              <MLText as="a" href="#dynamic" className="nav-item-link">തത്സമയം</MLText>
            </li>
            <li>
              <MLText as="a" href="#async" className="nav-item-link">ഡാറ്റാ ഫീഡ്</MLText>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
