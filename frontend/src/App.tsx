import './styles/globals.css';
import React, { useState } from 'react';
import Header from './components/Header';
import GeneratorPanel from './components/GeneratorPanel';
import OutputPanel from './components/OutputPanel';
import AdventurerGeneratorPanel from './components/AdventurerGeneratorPanel';
import AlienGeneratorPanel from './components/AlienGeneratorPanel';

const App: React.FC = () => {
  const [generatedJSON, setGeneratedJSON] = useState<string>('');
  const [prompts, setPrompts] = useState<any[]>([]);
  const [activePanel, setActivePanel] = useState<'generator' | 'adventurer' | 'alien'>('generator');

  const updatePrompts = (prompts: { image_prompts: { id: number; title: string; description: string; negative_prompt: string; tags: string[]; }[]; }) => {
    setPrompts(prompts.image_prompts);
    setGeneratedJSON(JSON.stringify(prompts.image_prompts, null, 2));
  };

  return (
    <div className="min-h-screen bg-amber-50 text-slate-800">
      <Header setActivePanel={setActivePanel} />
      <main className="main-content">
        {activePanel === 'generator' ? (
          <GeneratorPanel updatePrompts={updatePrompts} />
        ) : activePanel === 'adventurer' ? (
          <AdventurerGeneratorPanel updatePrompts={updatePrompts} />
        ) : (
          <AlienGeneratorPanel updatePrompts={updatePrompts} />
        )}
        <OutputPanel generatedJSON={generatedJSON} />
      </main>
    </div>
  );
};

export default App;