import './styles/globals.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RouterHeader from './components/RouterHeader';
import AnimeGeneratorPage from './pages/AnimeGeneratorPage';
import AdventurerGeneratorPage from './pages/AdventurerGeneratorPage';
import AlienGeneratorPage from './pages/AlienGeneratorPage';
import TemplatesPage from './pages/TemplatesPage';
import DescriptionTemplatesPage from './pages/DescriptionTemplatesPage';
import AttributeManagerPage from './pages/AttributeManagerPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-amber-50 text-slate-800">
        <RouterHeader />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/anime" replace />} />
            <Route path="/anime" element={<AnimeGeneratorPage />} />
            <Route path="/adventurer" element={<AdventurerGeneratorPage />} />
            <Route path="/alien" element={<AlienGeneratorPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/description-templates" element={<DescriptionTemplatesPage />} />
            <Route path="/attribute-manager" element={<AttributeManagerPage />} />
            <Route path="*" element={<Navigate to="/anime" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;