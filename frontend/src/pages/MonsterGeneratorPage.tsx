import React from 'react';
import MonsterGeneratorPanel from '../components/_legacy/MonsterGeneratorPanel';
import OutputPanel from '../components/OutputPanel';
import { usePromptStore } from '../stores/promptStore';

const MonsterGeneratorPage: React.FC = () => {
  const clearAll = usePromptStore((state) => state.clearAll);

  // Clear output when page loads
  React.useEffect(() => {
    clearAll();
  }, [clearAll]);

  return (
    <div className="main-content">
      <MonsterGeneratorPanel />
      <OutputPanel />
    </div>
  );
};

export default MonsterGeneratorPage;