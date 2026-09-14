import React from 'react';
import { MLText } from '../../../../packages/react/src/index.js';

export function Header() {
  return (
    <header className="header-banner">
      <div className="site-wrapper header-inner">
        <div className="site-title-box">
          {/* Static JSX text transformed at build-time by Vite plugin */}
          <h1 className="site-title">ദിവസം എങ്ങനെ പോകുന്നു?</h1>
          <p className="site-subtitle">മലയാള ഭാഷാ സാഹിത്യവും സംസ്കാരവും — Kerala Culture & Literature</p>
        </div>

        <nav className="nav-links">
          <MLText as="a" href="#articles" className="nav-link">ലേഖനങ്ങൾ</MLText>
          <MLText as="a" href="#dynamic" className="nav-link">തത്സമയം</MLText>
          <MLText as="a" href="#contact" className="nav-link">ബന്ധപ്പെടുക</MLText>
        </nav>
      </div>
    </header>
  );z
}
