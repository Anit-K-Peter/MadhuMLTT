import React, { useState, useEffect } from 'react';
import { MLText } from '@madhu-mltt/react';

export function AsyncSection() {
  const [asyncData, setAsyncData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate async data fetching after 800ms
    const timer = setTimeout(() => {
      setAsyncData({
        heading: 'തത്സമയ വാർത്താ ഫീഡ് (Live Feed)',
        content: 'കേരളത്തിലെ പുതിയ വാർത്തകളും സാഹിത്യ വിശേഷങ്ങളും ഇവിടെ കാണാം.'
      });
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="async" className="section-box">
      <MLText as="h2" className="section-h2">
        അസിങ്ക് ഡാറ്റാ ഫീഡ് (Async Data Handling)
      </MLText>

      {loading ? (
        <div style={{ color: '#94a3b8', fontStyle: 'italic', padding: '1rem 0' }}>
          വിവരങ്ങൾ ലോഡ് ചെയ്യുന്നു... (Loading async data...)
        </div>
      ) : (
        <div style={{ backgroundColor: '#0b1329', border: '1px solid #283552', padding: '1.25rem', borderRadius: '6px' }}>
          <MLText as="h3" className="section-h3" style={{ marginTop: 0 }}>
            {asyncData.heading}
          </MLText>

          <MLText as="p" className="paragraph-text" style={{ marginBottom: 0 }}>
            {asyncData.content}
          </MLText>
        </div>
      )}
    </section>
  );
}
