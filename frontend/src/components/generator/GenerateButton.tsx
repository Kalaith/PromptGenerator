import React from 'react';
import { GeneratorTypeConfig } from '../../config/generatorTypes';

interface GenerateButtonProps {
  config: GeneratorTypeConfig;
  loading: boolean;
  onGenerate: () => void;
  getButtonFocusClasses: (baseColor: string) => string;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  config,
  loading,
  onGenerate,
  getButtonFocusClasses,
}) => {
  return (
    <div className="pt-4">
      <button
        className={`w-full ${config.buttonGradient} text-black py-4 px-8 rounded-xl font-bold text-lg
                 shadow-glow hover:shadow-glow-violet transform hover:scale-105 transition-all duration-300
                 focus:outline-none ${getButtonFocusClasses(config.focusColor)} disabled:opacity-50 
                 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
                 relative overflow-hidden group`}
        disabled={loading}
        onClick={onGenerate}
        type="button"
      >
        {/* Button background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                      -skew-x-12 group-hover:translate-x-full transition-transform duration-1000"></div>
        
        <span className="relative flex items-center justify-center gap-3">
          <span className="text-xl">{config.icon}</span>
          {loading ? 'Generating...' : `Generate ${config.name}`}
          <span className="text-xl">{config.icon}</span>
        </span>
      </button>
    </div>
  );
};