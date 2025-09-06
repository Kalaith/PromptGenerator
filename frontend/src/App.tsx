import './styles/globals.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RouterHeader from './components/RouterHeader';
import UnifiedGeneratorPage from './pages/UnifiedGeneratorPage';
import TemplatesPage from './pages/TemplatesPage';
import DescriptionTemplatesPage from './pages/DescriptionTemplatesPage';
import AttributeManagerPage from './pages/AttributeManagerPage';
import AttributeOptionsPage from './pages/AttributeOptionsPage';
import GeneratorTypeManagerPage from './pages/GeneratorTypeManagerPage';
import { GalleryPage } from './pages/GalleryPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-violet-50 text-slate-900 font-sans">
        {/* Background decorative elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-sakura-200/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-1/3 right-20 w-24 h-24 bg-violet-200/10 rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-ocean-200/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-10 right-10 w-28 h-28 bg-mystic-200/10 rounded-full blur-2xl animate-float" style={{animationDelay: '3s'}}></div>
        </div>
        
        <RouterHeader />
        
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Navigate to="/kemonomimi" replace />} />
            {/* Static admin pages - must come before dynamic routes */}
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/description-templates" element={<DescriptionTemplatesPage />} />
            <Route path="/attribute-manager" element={<AttributeManagerPage />} />
            <Route path="/attribute-options" element={<AttributeOptionsPage />} />
            <Route path="/generator-types" element={<GeneratorTypeManagerPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            {/* Dynamic generator routes - handles any generator type */}
            <Route path="/:type" element={<UnifiedGeneratorPage />} />
            <Route path="*" element={<Navigate to="/kemonomimi" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;