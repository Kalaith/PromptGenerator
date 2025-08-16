import './styles/globals.css';
import React, { useState } from 'react';
import Header from './components/Header';
import GeneratorPanel from './components/GeneratorPanel';
import OutputPanel from './components/OutputPanel';
import AdventurerGeneratorPanel from './components/AdventurerGeneratorPanel';
import AlienGeneratorPanel from './components/AlienGeneratorPanel';
import type { PromptsPayload } from './types/Prompt';

const App: React.FC = () => {
  const [promptsPayload, setPromptsPayload] = useState<PromptsPayload>({ image_prompts: [] });
  const [activePanel, setActivePanel] = useState<'generator' | 'adventurer' | 'alien'>('generator');

  const updatePrompts = (payload: PromptsPayload) => {
    setPromptsPayload(payload);
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
        <OutputPanel generatedJSON={JSON.stringify(promptsPayload.image_prompts, null, 2)} errors={promptsPayload.errors} />
      </main>
    </div>
  );
};

export default App;