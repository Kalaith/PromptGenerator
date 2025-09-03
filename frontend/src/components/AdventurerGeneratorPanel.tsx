import React, { useState } from 'react';
import { usePromptStore } from '../stores/promptStore';
import { usePromptGeneration } from '../hooks/usePromptGeneration';
import { useSession } from '../hooks/useSession';
import { useAdventurerOptions } from '../hooks/useAdventurerOptions';
import { useAdventurerForm } from '../hooks/useAdventurerForm';
import { APP_CONSTANTS } from '../constants/app';
import { ValidationUtils } from '../utils/validation';
import { AdventurerFormComponent } from './adventurer/AdventurerFormComponent';

const AdventurerGeneratorPanel: React.FC = () => {
  const [promptCount, setPromptCount] = useState<number>(APP_CONSTANTS.PROMPT_COUNT.DEFAULT);
  
  const addGeneratedPrompts = usePromptStore(state => state.addGeneratedPrompts);
  const { generateAdventurerPrompts, loading, error, clearError } = usePromptGeneration();
  const { addToHistory } = useSession();
  const { options, loading: optionsLoading, error: optionsError } = useAdventurerOptions();
  const { formData, updateField, resetForm, buildGenerationParams } = useAdventurerForm();

  const handleGenerate = async (): Promise<void> => {
    clearError();
    
    const validation = ValidationUtils.validatePromptCount(promptCount);
    if (!validation.isValid) {
      return;
    }
    
    const safeCount = ValidationUtils.sanitizePromptCount(promptCount);
    const generationParams = buildGenerationParams(safeCount);

    try {
      const apiPrompts = await generateAdventurerPrompts(generationParams);
      
      if (apiPrompts.length > 0) {
        addGeneratedPrompts(apiPrompts);
        
        // Add to history
        for (const prompt of apiPrompts) {
          try {
            await addToHistory({
              id: prompt.id,
              title: prompt.title,
              description: prompt.description,
              tags: prompt.tags,
              type: 'adventurer',
              timestamp: Date.now(),
            });
          } catch (historyError) {
            console.error('Failed to add to history:', historyError);
          }
        }
      }
    } catch (generationError) {
      console.error('Generation failed:', generationError);
    }
  };

  const isLoading = loading || optionsLoading;
  const displayError = error || optionsError;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Adventurer Prompt Generator</h2>
        
        {displayError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {typeof displayError === 'string' ? displayError : 'An error occurred'}
          </div>
        )}

        <div className="space-y-6">
          <AdventurerFormComponent
            formData={formData}
            onUpdateField={updateField}
            options={options}
          />

          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Number of prompts:</label>
            <input
              className="w-20 p-2 border border-gray-300 rounded-md"
              max={APP_CONSTANTS.PROMPT_COUNT.MAX}
              min={APP_CONSTANTS.PROMPT_COUNT.MIN}
              onChange={(event) => setPromptCount(Number.parseInt(event.target.value, 10))}
              type="number"
              value={promptCount}
            />
            <span className="text-xs text-gray-500">
              (Min: {APP_CONSTANTS.PROMPT_COUNT.MIN}, Max: {APP_CONSTANTS.PROMPT_COUNT.MAX})
            </span>
          </div>

          <div className="flex gap-4">
            <button
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isLoading}
              onClick={handleGenerate}
            >
              {isLoading ? 'Generating...' : 'Generate Adventurer Prompts'}
            </button>
            
            <button
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={isLoading}
              onClick={resetForm}
            >
              Reset Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdventurerGeneratorPanel;