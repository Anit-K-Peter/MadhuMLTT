import React from 'react';
import { MLText } from '../../../../packages/react/src/index.js';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-wrapper footer-content">
        <div>
          <MLText>
            © 2026 മധു ML-TT എഞ്ചിൻ — എല്ലാ അവകാശങ്ങളും സംരക്ഷിതം.
          </MLText>
        </div>
        <div>
          <MLText as="a" href="#top" className="nav-link">
            മുകളിലേക്ക് തിരികെ പോകുക ↑
          </MLText>
        </div>
      </div>
    </footer>
  );
}
