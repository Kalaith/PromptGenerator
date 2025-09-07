import React, { useEffect, useState } from 'react';
import { usePromptStore } from '../stores/promptStore';
import { usePromptGeneration } from '../hooks/usePromptGeneration';
import { useSession } from '../hooks/useSession';
import { PromptApi } from '../api';
import type { AttributeConfig, Template } from '../api/types';
import { APP_CONSTANTS } from '../constants/app';
import { ValidationUtils } from '../utils/validation';

const AlienGeneratorPanel: React.FC = () => {
  const [promptCount, setPromptCount] = useState<number>(APP_CONSTANTS.PROMPT_COUNT.DEFAULT);
  const [alienAttributes, setAlienAttributes] = useState<Record<string, AttributeConfig>>({});
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string | string[]>>({});
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [availableTemplates] = useState<Template[]>([]);
  
  const addGeneratedPrompts = usePromptStore(state => state.addGeneratedPrompts);
  const { generateAlienPrompts, loading, error, clearError } = usePromptGeneration();
  const { addToHistory } = useSession();

  useEffect(() => {
    const loadAlienAttributes = async (): Promise<void> => {
      try {
        const attributesResponse = await PromptApi.getGeneratorAttributes('alien');
        setAlienAttributes(attributesResponse.data.attributes);
      } catch {
        // Error logged by loadAttributes function
      }
    };

    loadAlienAttributes();
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
      ...(selectedTemplate?.id && { templateId: selectedTemplate.id }),
    };

    try {
      const apiPrompts = await generateAlienPrompts(generationParams);
      
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
              type: 'alien',
              timestamp: Date.now(),
            });
          } catch {
            // Error logged by addToHistory function
          }
        }
      }
    } catch {
      // Error logged by generation function
    }
  };

  const resetForm = (): void => {
    setSelectedAttributes({});
    setSelectedTemplate(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8 relative overflow-hidden">
          {/* Decorative background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/30 via-transparent to-mystic-50/30 pointer-events-none"></div>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-heading font-bold bg-gradient-mystic bg-clip-text text-transparent mb-3">
                👽 Alien Species Generator
              </h2>
              <p className="text-slate-700 text-lg font-medium">Discover mysterious beings from distant worlds</p>
            </div>
            
            {/* Error display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-3 animate-fade-in">
                <span className="text-xl">⚠️</span>
                <span className="font-medium">{error.message}</span>
              </div>
            )}

            {/* Form */}
            <form className="space-y-6" onSubmit={(event) => { event.preventDefault(); handleGenerate(); }}>
              {/* Dynamic Alien Attributes */}
              {Object.keys(alienAttributes).length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <span>🛸</span> Alien Attributes
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(alienAttributes).map(([key, config]) => (
                      <div key={key} className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">{config.label}</label>
                        {config.type === 'select' ? (
                          <select
                            className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white 
                                     focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all duration-300
                                     text-slate-800 font-medium hover:border-gray-400 shadow-sm"
                            onChange={(event) => {
                              const {value} = event.target;
                              setSelectedAttributes(prev => {
                                if (value === '') {
                                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                  const { [key]: _removed, ...rest } = prev;
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
                            className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white 
                                     focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all duration-300
                                     text-slate-800 font-medium hover:border-gray-400 h-24 shadow-sm"
                            onChange={(event) => {
                              const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
                              setSelectedAttributes(prev => {
                                if (selectedOptions.length === 0) {
                                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                  const { [key]: _removed, ...rest } = prev;
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

              {/* Template Selection */}
              {availableTemplates.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
                    <span>📝</span> Template (Optional)
                  </label>
                  <select
                    className="w-full p-4 border-2 border-gray-300 rounded-xl bg-white 
                             focus:border-mystic-500 focus:ring-4 focus:ring-mystic-100 transition-all duration-300
                             text-slate-800 font-medium hover:border-gray-400 shadow-sm"
                    onChange={(event) => {
                      const template = availableTemplates.find(t => String(t.id) === event.target.value);
                      setSelectedTemplate(template ?? null);
                    }}
                    value={selectedTemplate ? String(selectedTemplate.id) : ''}
                  >
                    <option value="">🎲 No template</option>
                    {availableTemplates.map(template => (
                      <option key={template.id} value={String(template.id)}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Number of prompts */}
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
                    onChange={(event) => setPromptCount(Number.parseInt(event.target.value, 10))}
                    type="number"
                    value={promptCount}
                  />
                  <span className="text-sm text-slate-600 font-medium">
                    (Min: {APP_CONSTANTS.PROMPT_COUNT.MIN}, Max: {APP_CONSTANTS.PROMPT_COUNT.MAX})
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 flex gap-4">
                <button
                  className="flex-1 bg-gradient-mystic text-black py-4 px-8 rounded-xl font-bold text-lg
                           shadow-glow-violet hover:shadow-glow transform hover:scale-105 transition-all duration-300
                           focus:outline-none focus:ring-4 focus:ring-violet-200 disabled:opacity-50 
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
                
                <button
                  className="px-6 py-4 border-2 border-gray-300 text-slate-700 rounded-xl hover:bg-gray-50 
                           focus:outline-none focus:ring-4 focus:ring-gray-100 disabled:opacity-50
                           transition-all duration-300 font-semibold hover:border-gray-400 shadow-sm"
                  disabled={loading}
                  onClick={resetForm}
                  type="button"
                >
                  🔄 Reset Form
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlienGeneratorPanel;