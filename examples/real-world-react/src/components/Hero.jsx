import React from 'react';
import { MLText } from '@madhu-mltt/react';

export function Hero() {
  return (
    <section id="hero" className="hero-section">
      <MLText as="h1" className="hero-heading">
        കേരളം എന്റെ നാടാണ്
      </MLText>
      
      <MLText as="p" className="hero-lead">
        ഇത് മലയാള ഭാഷാ സാഹിത്യവും സംസ്കാരവും ഡിജിറ്റൽ ലോകത്തേക്ക് എത്തിക്കുന്നതിനുള്ള പുതിയ സാങ്കേതികവിദ്യയാണ്.
      </MLText>
    </section>
  );
}
