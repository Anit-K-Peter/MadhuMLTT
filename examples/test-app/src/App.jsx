import React from 'react';
import { MLTTProvider } from '../../../packages/react/src/index.js';
import { Header } from './components/Header.jsx';
import { ArticleSection } from './components/ArticleSection.jsx';
import { DynamicSection } from './components/DynamicSection.jsx';
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
      <div className="app-container">
        <Header />
        
        <div className="site-wrapper">
          <main className="main-grid">
            <div className="main-content-column">
              <ArticleSection />
              <DynamicSection />
            </div>
            <Sidebar />
          </main>
        </div>

        <Footer />
      </div>
    </MLTTProvider>
  );
}
