import React, { useEffect, useState } from 'react';
import { usePromptStore } from '../stores/promptStore';
import { usePromptGeneration } from '../hooks/usePromptGeneration';
import { useSession } from '../hooks/useSession';
import { PromptApi } from '../api';
import type { AttributeConfig } from '../api/types';
import { APP_CONSTANTS } from '../constants/app';
import { ValidationUtils } from '../utils/validation';

const AdventurerGeneratorPanel: React.FC = () => {
  const [promptCount, setPromptCount] = useState<number>(APP_CONSTANTS.PROMPT_COUNT.DEFAULT);
  const [adventurerAttributes, setAdventurerAttributes] = useState<Record<string, AttributeConfig>>({});
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string | string[]>>({});
  
  const addGeneratedPrompts = usePromptStore(state => state.addGeneratedPrompts);
  const { generateAdventurerPrompts, loading, error, clearError } = usePromptGeneration();
  const { addToHistory } = useSession();

  useEffect(() => {
    const loadAdventurerAttributes = async (): Promise<void> => {
      try {
        const attributesResponse = await PromptApi.getGeneratorAttributes('adventurer');
        setAdventurerAttributes(attributesResponse.data.attributes);
      } catch (loadError) {
        console.error('Failed to load adventurer attributes:', loadError);
      }
    };

    void loadAdventurerAttributes();
  }, []);

  const handleGenerate = async (): Promise<void> => {
    clearError();
    
    const validation = ValidationUtils.validatePromptCount(promptCount);
    if (!validation.isValid) {
      return;
    }
    
    const safeCount = ValidationUtils.sanitizePromptCount(promptCount);
    const generationParams = {
      count: safeCount,
      attributes: Object.keys(selectedAttributes).length > 0 ? selectedAttributes : undefined,
    };

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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Adventurer Prompt Generator</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); void handleGenerate(); }}>
          {/* Dynamic Adventurer Attributes */}
          {Object.entries(adventurerAttributes).map(([key, config]) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-1">{config.label}</label>
              {config.type === 'select' ? (
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  onChange={(event) => {
                    const value = event.target.value;
                    setSelectedAttributes(prev => ({
                      ...prev,
                      [key]: value === '' ? undefined : value
                    }));
                  }}
                  value={(selectedAttributes[key] as string) || ''}
                >
                  <option value="">Any</option>
                  {config.options.map((option, index) => (
                    <option key={option.value || `option-${index}`} value={option.value}>
                      {option.label || option.value}
                    </option>
                  ))}
                </select>
              ) : config.type === 'multi-select' ? (
                <select
                  multiple
                  className="w-full p-2 border border-gray-300 rounded-md h-24"
                  onChange={(event) => {
                    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
                    setSelectedAttributes(prev => ({
                      ...prev,
                      [key]: selectedOptions.length > 0 ? selectedOptions : undefined
                    }));
                  }}
                  value={(selectedAttributes[key] as string[]) || []}
                >
                  {config.options.map((option, index) => (
                    <option key={option.value || `option-${index}`} value={option.value}>
                      {option.label || option.value}
                    </option>
                  ))}
                </select>
              ) : null}
            </div>
          ))}

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

          <button
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Generating...' : 'Generate Adventurer Prompts'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdventurerGeneratorPanel;