import React from 'react';
import AlienGeneratorPanel from '../components/AlienGeneratorPanel';
import OutputPanel from '../components/OutputPanel';
import { usePromptStore } from '../stores/promptStore';

const AlienGeneratorPage: React.FC = () => {
  const clearAll = usePromptStore((state) => state.clearAll);

  // Clear output when page loads
  React.useEffect(() => {
    clearAll();
  }, [clearAll]);

  return (
    <div className="main-content">
      <AlienGeneratorPanel />
      <OutputPanel />
    </div>
  );
};

export default AlienGeneratorPage;