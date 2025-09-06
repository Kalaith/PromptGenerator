import React from 'react';
import { GeneratorTypeConfig } from '../../config/generatorTypes';

interface GeneratorHeaderProps {
  config: GeneratorTypeConfig;
}

export const GeneratorHeader: React.FC<GeneratorHeaderProps> = ({ config }) => {
  return (
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-slate-800 mb-4 flex items-center justify-center gap-3">
        <span className="text-4xl">{config.icon}</span>
        {config.name} Generator
      </h2>
      <p className="text-slate-600 text-lg">{config.description}</p>
    </div>
  );
};