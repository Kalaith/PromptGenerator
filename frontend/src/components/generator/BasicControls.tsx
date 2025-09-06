import React from 'react';
import { APP_CONSTANTS } from '../../constants/app';
import { GeneratorTypeConfig } from '../../config/generatorTypes';

interface BasicControlsProps {
  config: GeneratorTypeConfig;
  species: string;
  promptCount: number;
  availableSpecies: string[];
  onSpeciesChange: (value: string) => void;
  onPromptCountChange: (value: number) => void;
  getFocusClasses: (baseColor: string) => string;
}

export const BasicControls: React.FC<BasicControlsProps> = ({
  config,
  species,
  promptCount,
  availableSpecies,
  onSpeciesChange,
  onPromptCountChange,
  getFocusClasses,
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Species Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-800 mb-2">🧬 Species</label>
        <select
          className={`w-full p-4 border-2 border-gray-300 rounded-xl bg-white 
                   ${getFocusClasses(config.focusColor)} transition-all duration-300
                   text-slate-800 font-medium hover:border-gray-400 shadow-sm`}
          onChange={(event) => onSpeciesChange(event.target.value)}
          value={species}
        >
          <option value="random">🎲 Random Species</option>
          {availableSpecies.map(speciesOption => (
            <option key={speciesOption} value={speciesOption}>{speciesOption}</option>
          ))}
        </select>
      </div>

      {/* Number of prompts */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-800 mb-2">🔢 Number of prompts</label>
        <input
          className={`w-full p-4 border-2 border-gray-300 rounded-xl bg-white 
                   ${getFocusClasses(config.focusColor)} transition-all duration-300
                   text-slate-800 font-medium hover:border-gray-400 shadow-sm`}
          max={APP_CONSTANTS.PROMPT_COUNT.MAX_SAFE}
          min={APP_CONSTANTS.PROMPT_COUNT.MIN}
          onChange={(event) => onPromptCountChange(Number.parseInt(event.target.value, 10))}
          type="number"
          value={promptCount}
        />
      </div>
    </div>
  );
};