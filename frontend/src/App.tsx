import './styles/globals.css';
import React, { useState } from 'react';
import Header from './components/Header';
import GeneratorPanel from './components/GeneratorPanel';
import OutputPanel from './components/OutputPanel';
import AdventurerGeneratorPanel from './components/AdventurerGeneratorPanel';
import AlienGeneratorPanel from './components/AlienGeneratorPanel';
import { usePromptStore } from './stores/promptStore';

const App: React.FC = () => {
  const [activePanel, setActivePanel] = useState<'generator' | 'adventurer' | 'alien'>('generator');
  const clearAll = usePromptStore((state) => state.clearAll);

  const handlePanelChange = (panel: 'generator' | 'adventurer' | 'alien') => {
    clearAll(); // Clear generated output when switching panels
    setActivePanel(panel);
  };

  return (
    <div className="min-h-screen bg-amber-50 text-slate-800">
      <Header setActivePanel={handlePanelChange} />
      <main className="main-content">
        {activePanel === 'generator' ? (
          <GeneratorPanel />
        ) : activePanel === 'adventurer' ? (
          <AdventurerGeneratorPanel />
        ) : (
          <AlienGeneratorPanel />
        )}
        <OutputPanel />
      </main>
    </div>
  );
};

export default App;