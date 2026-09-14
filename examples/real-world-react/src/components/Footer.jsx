import React from 'react';
import { MLText } from '@madhu-mltt/react';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <MLText>
            © 2026 മധു ML-TT എഞ്ചിൻ — Real-World Developer Integration Verification.
          </MLText>
        </div>
        <div>
          <MLText as="a" href="#hero" className="nav-item-link">
            മുകളിലേക്ക് ↑
          </MLText>
        </div>
      </div>
    </footer>
  );
}
