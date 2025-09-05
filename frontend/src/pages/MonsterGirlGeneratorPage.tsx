import React from 'react';
import MonsterGirlGeneratorPanel from '../components/MonsterGirlGeneratorPanel';
import OutputPanel from '../components/OutputPanel';
import { usePromptStore } from '../stores/promptStore';

const MonsterGirlGeneratorPage: React.FC = () => {
  const clearAll = usePromptStore((state) => state.clearAll);

  // Clear output when page loads
  React.useEffect(() => {
    clearAll();
  }, [clearAll]);

  return (
    <div className="main-content">
      <MonsterGirlGeneratorPanel />
      <OutputPanel />
    </div>
  );
};

export default MonsterGirlGeneratorPage;