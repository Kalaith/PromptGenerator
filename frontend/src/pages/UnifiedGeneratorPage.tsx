import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import UnifiedGeneratorPanel from '../components/UnifiedGeneratorPanel';
import OutputPanel from '../components/OutputPanel';
import { usePromptStore } from '../stores/promptStore';
import { getGeneratorTypeBySlug } from '../config/generatorTypes';

const UnifiedGeneratorPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const clearAll = usePromptStore((state) => state.clearAll);

  // Get the generator configuration
  const config = type ? getGeneratorTypeBySlug(type) : null;

  // Clear output when page loads or type changes
  React.useEffect(() => {
    clearAll();
  }, [clearAll, type]);

  // Redirect to first available generator if type not found
  if (!config) {
    return <Navigate to="/kemonomimi" replace />;
  }

  return (
    <div className="main-content">
      <UnifiedGeneratorPanel config={config} />
      <OutputPanel />
    </div>
  );
};

export default UnifiedGeneratorPage;