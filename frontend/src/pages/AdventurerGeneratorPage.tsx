import React from 'react';
import AdventurerGeneratorPanel from '../components/AdventurerGeneratorPanel';
import OutputPanel from '../components/OutputPanel';
import { usePromptStore } from '../stores/promptStore';

const AdventurerGeneratorPage: React.FC = () => {
  const clearAll = usePromptStore((state) => state.clearAll);

  // Clear output when page loads
  React.useEffect(() => {
    clearAll();
  }, [clearAll]);

  return (
    <div className="main-content">
      <AdventurerGeneratorPanel />
      <OutputPanel />
    </div>
  );
};

export default AdventurerGeneratorPage;