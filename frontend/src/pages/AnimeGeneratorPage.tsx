import React from 'react';
import GeneratorPanel from '../components/_legacy/GeneratorPanel';
import OutputPanel from '../components/OutputPanel';
import { usePromptStore } from '../stores/promptStore';

const AnimeGeneratorPage: React.FC = () => {
  const clearAll = usePromptStore((state) => state.clearAll);

  // Clear output when page loads
  React.useEffect(() => {
    clearAll();
  }, [clearAll]);

  return (
    <div className="main-content">
      <GeneratorPanel />
      <OutputPanel />
    </div>
  );
};

export default AnimeGeneratorPage;