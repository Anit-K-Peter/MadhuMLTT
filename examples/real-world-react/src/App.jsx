import React from 'react';
import { MLTTProvider } from '@madhu-mltt/react';
import { Header } from './components/Header.jsx';
import { Hero } from './components/Hero.jsx';
import { ContentSection } from './components/ContentSection.jsx';
import { DynamicSection } from './components/DynamicSection.jsx';
import { AsyncSection } from './components/AsyncSection.jsx';
import { FormSection } from './components/FormSection.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { Footer } from './components/Footer.jsx';

export default function App() {
  return (
    <MLTTProvider
      font={{
        family: 'ML-TTKarthika',
        src: '/fonts/ML_TT_Karthika_Normal.ttf'
      }}
    >
      <div className="site-wrapper">
        <Header />
        
        <div className="container">
          <Hero />
          
          <div className="content-grid">
            <main>
              <ContentSection />
              <DynamicSection />
              <AsyncSection />
              <FormSection />
            </main>

            <Sidebar />
          </div>
        </div>

        <Footer />
      </div>
    </MLTTProvider>
  );
}
