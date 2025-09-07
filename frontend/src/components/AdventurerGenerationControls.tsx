import React from 'react';
import { APP_CONSTANTS } from '../constants/app';

interface AdventurerGenerationControlsProps {
  promptCount: number;
  onPromptCountChange: (count: number) => void;
  onGenerate: () => void;
  onReset: () => void;
  loading: boolean;
}

const AdventurerGenerationControls: React.FC<AdventurerGenerationControlsProps> = ({
  promptCount,
  onPromptCountChange,
  onGenerate,
  onReset,
  loading,
}) => (
  <>
    <AdventurerPromptCountInput
      promptCount={promptCount}
      onPromptCountChange={onPromptCountChange}
    />
    <AdventurerActionButtons
      onGenerate={onGenerate}
      onReset={onReset}
      loading={loading}
    />
  </>
);

interface AdventurerPromptCountInputProps {
  promptCount: number;
  onPromptCountChange: (count: number) => void;
}

const AdventurerPromptCountInput: React.FC<AdventurerPromptCountInputProps> = ({
  promptCount,
  onPromptCountChange,
}) => {
  const handlePromptCountChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onPromptCountChange(Number.parseInt(event.target.value, 10));
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-dark-700 mb-2 flex items-center gap-2">
        <span>🔢</span> Number of prompts
      </label>
      <div className="flex items-center gap-4">
        <input
          className="w-32 p-4 border-2 border-ocean-200/50 rounded-xl bg-white/70 backdrop-blur-sm 
                   focus:border-ocean-400 focus:ring-4 focus:ring-ocean-100 transition-all duration-300
                   text-dark-700 font-medium hover:border-ocean-300"
          max={APP_CONSTANTS.PROMPT_COUNT.MAX}
          min={APP_CONSTANTS.PROMPT_COUNT.MIN}
          onChange={handlePromptCountChange}
          type="number"
          value={promptCount}
        />
        <span className="text-sm text-dark-500">
          (Min: {APP_CONSTANTS.PROMPT_COUNT.MIN}, Max: {APP_CONSTANTS.PROMPT_COUNT.MAX})
        </span>
      </div>
    </div>
  );
};

interface AdventurerActionButtonsProps {
  onGenerate: () => void;
  onReset: () => void;
  loading: boolean;
}

const AdventurerActionButtons: React.FC<AdventurerActionButtonsProps> = ({
  onGenerate,
  onReset,
  loading,
}) => (
  <div className="pt-4 flex gap-4">
    <AdventurerGenerateButton onGenerate={onGenerate} loading={loading} />
    <AdventurerResetButton onReset={onReset} loading={loading} />
  </div>
);

interface AdventurerGenerateButtonProps {
  onGenerate: () => void;
  loading: boolean;
}

const AdventurerGenerateButton: React.FC<AdventurerGenerateButtonProps> = ({ onGenerate, loading }) => (
  <button
    className="flex-1 bg-gradient-ocean text-black py-4 px-8 rounded-xl font-bold text-lg
             shadow-glow-ocean hover:shadow-glow-violet transform hover:scale-105 transition-all duration-300
             focus:outline-none focus:ring-4 focus:ring-ocean-200 disabled:opacity-50 
             disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
             relative overflow-hidden group"
    disabled={loading}
    onClick={onGenerate}
    type="button"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                  -skew-x-12 group-hover:translate-x-full transition-transform duration-1000"></div>
    
    <span className="relative flex items-center justify-center gap-3">
      {loading ? (
        <>
          <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div>
          Generating Adventure...
        </>
      ) : (
        <>
          <span className="text-xl">⚔️</span>
          Generate Adventurer Prompts
          <span className="text-xl">🏰</span>
        </>
      )}
    </span>
  </button>
);

interface AdventurerResetButtonProps {
  onReset: () => void;
  loading: boolean;
}

const AdventurerResetButton: React.FC<AdventurerResetButtonProps> = ({ onReset, loading }) => (
  <button
    className="px-6 py-4 border-2 border-ocean-200/50 text-dark-700 rounded-xl hover:bg-ocean-50/50 
             focus:outline-none focus:ring-4 focus:ring-ocean-100 disabled:opacity-50
             transition-all duration-300 font-semibold hover:border-ocean-300"
    disabled={loading}
    onClick={onReset}
    type="button"
  >
    🔄 Reset Form
  </button>
);

export default AdventurerGenerationControls;