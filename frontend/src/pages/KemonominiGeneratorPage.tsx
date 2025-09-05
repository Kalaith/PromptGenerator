import React from 'react';
import KemonominiGeneratorPanel from '../components/KemonominiGeneratorPanel';
import OutputPanel from '../components/OutputPanel';
import { usePromptStore } from '../stores/promptStore';

const KemonominiGeneratorPage: React.FC = () => {
  const clearAll = usePromptStore((state) => state.clearAll);

  // Clear output when page loads
  React.useEffect(() => {
    clearAll();
  }, [clearAll]);

  return (
    <div className="main-content">
      <KemonominiGeneratorPanel />
      <OutputPanel />
    </div>
  );
};

export default KemonominiGeneratorPage;