import React from 'react';
import { APP_CONSTANTS } from '../constants/app';

interface AlienGenerationControlsProps {
  promptCount: number;
  onPromptCountChange: (count: number) => void;
  onGenerate: () => void;
  onReset: () => void;
  loading: boolean;
}

const AlienGenerationControls: React.FC<AlienGenerationControlsProps> = ({
  promptCount,
  onPromptCountChange,
  onGenerate,
  onReset,
  loading,
}) => (
  <>
    <AlienPromptCountInput
      promptCount={promptCount}
      onPromptCountChange={onPromptCountChange}
    />
    <AlienActionButtons
      onGenerate={onGenerate}
      onReset={onReset}
      loading={loading}
    />
  </>
);

interface AlienPromptCountInputProps {
  promptCount: number;
  onPromptCountChange: (count: number) => void;
}

const AlienPromptCountInput: React.FC<AlienPromptCountInputProps> = ({
  promptCount,
  onPromptCountChange,
}) => {
  const handlePromptCountChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onPromptCountChange(Number.parseInt(event.target.value, 10));
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
        <span>🔢</span> Number of prompts
      </label>
      <div className="flex items-center gap-4">
        <input
          className="w-32 p-4 border-2 border-gray-300 rounded-xl bg-white 
                   focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all duration-300
                   text-slate-800 font-medium hover:border-gray-400 shadow-sm"
          max={APP_CONSTANTS.PROMPT_COUNT.MAX}
          min={APP_CONSTANTS.PROMPT_COUNT.MIN}
          onChange={handlePromptCountChange}
          type="number"
          value={promptCount}
        />
        <span className="text-sm text-slate-600 font-medium">
          (Min: {APP_CONSTANTS.PROMPT_COUNT.MIN}, Max: {APP_CONSTANTS.PROMPT_COUNT.MAX})
        </span>
      </div>
    </div>
  );
};

interface AlienActionButtonsProps {
  onGenerate: () => void;
  onReset: () => void;
  loading: boolean;
}

const AlienActionButtons: React.FC<AlienActionButtonsProps> = ({
  onGenerate,
  onReset,
  loading,
}) => (
  <div className="pt-4 flex gap-4">
    <AlienGenerateButton onGenerate={onGenerate} loading={loading} />
    <AlienResetButton onReset={onReset} loading={loading} />
  </div>
);

interface AlienGenerateButtonProps {
  onGenerate: () => void;
  loading: boolean;
}

const AlienGenerateButton: React.FC<AlienGenerateButtonProps> = ({ onGenerate, loading }) => (
  <button
    className="flex-1 bg-gradient-mystic text-black py-4 px-8 rounded-xl font-bold text-lg
             shadow-glow-violet hover:shadow-glow transform hover:scale-105 transition-all duration-300
             focus:outline-none focus:ring-4 focus:ring-violet-200 disabled:opacity-50 
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
          Discovering Species...
        </>
      ) : (
        <>
          <span className="text-xl">👽</span>
          Generate Alien Prompts
          <span className="text-xl">🌌</span>
        </>
      )}
    </span>
  </button>
);

interface AlienResetButtonProps {
  onReset: () => void;
  loading: boolean;
}

const AlienResetButton: React.FC<AlienResetButtonProps> = ({ onReset, loading }) => (
  <button
    className="px-6 py-4 border-2 border-gray-300 text-slate-700 rounded-xl hover:bg-gray-50 
             focus:outline-none focus:ring-4 focus:ring-gray-100 disabled:opacity-50
             transition-all duration-300 font-semibold hover:border-gray-400 shadow-sm"
    disabled={loading}
    onClick={onReset}
    type="button"
  >
    🔄 Reset Form
  </button>
);

export default AlienGenerationControls;