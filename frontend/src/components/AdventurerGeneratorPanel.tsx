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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-8 relative overflow-hidden">
          {/* Decorative background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-ocean-50/50 via-transparent to-mystic-50/50 pointer-events-none"></div>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-heading font-bold bg-gradient-ocean bg-clip-text text-transparent mb-3">
                ⚔️ Adventurer Prompt Generator
              </h2>
              <p className="text-dark-600 text-lg">Create epic fantasy adventures and characters</p>
            </div>
            
            {/* Error display */}
            {error && (
              <div className="mb-6 p-4 bg-danger-50 border border-danger-200 text-danger-700 rounded-xl flex items-center gap-3 animate-fade-in">
                <span className="text-xl">⚠️</span>
                <span className="font-medium">{error.message}</span>
              </div>
            )}

            {/* Form */}
            <form className="space-y-6" onSubmit={(event) => { event.preventDefault(); void handleGenerate(); }}>
              {/* Dynamic Adventurer Attributes */}
              {Object.keys(adventurerAttributes).length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-dark-700 flex items-center gap-2">
                    <span>🗡️</span> Adventurer Attributes
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(adventurerAttributes).map(([key, config]) => (
                      <div key={key} className="space-y-2">
                        <label className="block text-sm font-medium text-dark-600">{config.label}</label>
                        {config.type === 'select' ? (
                          <select
                            className="w-full p-3 border-2 border-ocean-200/50 rounded-lg bg-white/70 backdrop-blur-sm 
                                     focus:border-ocean-400 focus:ring-4 focus:ring-ocean-100 transition-all duration-300
                                     text-dark-700 font-medium hover:border-ocean-300"
                            onChange={(event) => {
                              const value = event.target.value;
                              setSelectedAttributes(prev => {
                                if (value === '') {
                                  const { [key]: _, ...rest } = prev;
                                  return rest;
                                }
                                return { ...prev, [key]: value };
                              });
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
                            className="w-full p-3 border-2 border-ocean-200/50 rounded-lg bg-white/70 backdrop-blur-sm 
                                     focus:border-ocean-400 focus:ring-4 focus:ring-ocean-100 transition-all duration-300
                                     text-dark-700 font-medium hover:border-ocean-300 h-24"
                            onChange={(event) => {
                              const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
                              setSelectedAttributes(prev => {
                                if (selectedOptions.length === 0) {
                                  const { [key]: _, ...rest } = prev;
                                  return rest;
                                }
                                return { ...prev, [key]: selectedOptions };
                              });
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
                  </div>
                </div>
              )}

              {/* Number of prompts */}
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
                    onChange={(event) => setPromptCount(Number.parseInt(event.target.value, 10))}
                    type="number"
                    value={promptCount}
                  />
                  <span className="text-sm text-dark-500">
                    (Min: {APP_CONSTANTS.PROMPT_COUNT.MIN}, Max: {APP_CONSTANTS.PROMPT_COUNT.MAX})
                  </span>
                </div>
              </div>

              {/* Generate button */}
              <div className="pt-4">
                <button
                  className="w-full bg-gradient-ocean text-white py-4 px-8 rounded-xl font-bold text-lg
                           shadow-glow-ocean hover:shadow-glow-violet transform hover:scale-105 transition-all duration-300
                           focus:outline-none focus:ring-4 focus:ring-ocean-200 disabled:opacity-50 
                           disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
                           relative overflow-hidden group"
                  disabled={loading}
                  type="submit"
                >
                  {/* Button background effect */}
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
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdventurerGeneratorPanel;