import React, { useEffect, useState } from 'react';
import { usePromptStore } from '../stores/promptStore';
import { PromptApi } from '../api/promptApi';
import type { GeneratePromptsRequest, DescriptionTemplate, AnimeAttributesResponse } from '../api/types';
import { usePromptGeneration } from '../hooks/usePromptGeneration';
import { useSession } from '../hooks/useSession';
import { GeneratorTypeConfig } from '../config/generatorTypes';

interface UnifiedGeneratorPanelProps {
  config: GeneratorTypeConfig;
}

const UnifiedGeneratorPanel: React.FC<UnifiedGeneratorPanelProps> = ({ config }) => {
  const [promptCount, setPromptCount] = useState<number>(10);
  const [species, setSpecies] = useState<string>('random');
  const [availableSpecies, setAvailableSpecies] = useState<string[]>([]);
  const [availableTemplates, setAvailableTemplates] = useState<DescriptionTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<DescriptionTemplate | null>(null);
  const [animeAttributes, setAnimeAttributes] = useState<AnimeAttributesResponse['data']>({});
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string | string[]>>({});

  const addGeneratedPrompts = usePromptStore((state) => state.addGeneratedPrompts);
  const { generateAnimePrompts, loading, error, clearError } = usePromptGeneration();
  const { addToHistory } = useSession();

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        // Determine which API to use based on generator type
        let attributeType: 'anime' | 'alien' | 'adventurer' = 'anime';
        if (config.id === 'alien') {
          attributeType = 'alien';
        } else if (config.id === 'adventurer') {
          attributeType = 'adventurer';
        }

        const [speciesResponse, templatesResponse, attributesResponse] = await Promise.all([
          PromptApi.getSpecies(),
          PromptApi.getGeneratorAttributes(attributeType),
          PromptApi.getGeneratorAttributes(attributeType)
        ]);
        
        if (speciesResponse.success) {
          setAvailableSpecies(speciesResponse.data.species.map(s => s.name));
        }
        
        if (attributesResponse && attributesResponse.data) {
          setAnimeAttributes(attributesResponse.data);
        }
      } catch (error) {
        console.error('Failed to load generator data:', error);
      }
    };
    
    void loadData();
  }, [config.id]);

  const handleGenerate = async (): Promise<void> => {
    clearError();
    
    const safeCount = Math.max(1, Math.min(promptCount, 50));
    
    const request: GeneratePromptsRequest = {
      count: safeCount,
      type: config.apiType as any, // Use the API type from config
      species: species === 'random' ? 'random' : species,
      attributes: Object.keys(selectedAttributes).length > 0 ? selectedAttributes : undefined,
      templateId: selectedTemplate?.id,
    };

    console.log(`Debug: ${config.name} Request being sent:`, request);

    try {
      const apiPrompts = await generateAnimePrompts(request);
      
      if (apiPrompts.length > 0) {
        addGeneratedPrompts(apiPrompts);
        
        for (const prompt of apiPrompts) {
          try {
            await addToHistory({
              id: prompt.id,
              title: prompt.title,
              description: prompt.description,
              tags: prompt.tags,
              timestamp: Date.now(),
            });
          } catch (historyError) {
            console.warn('Failed to add prompt to history:', historyError);
          }
        }
      }
    } catch (generationError) {
      console.error('Generation failed:', generationError);
    }
  };

  const getFocusClasses = (baseColor: string) => {
    const colorMap: Record<string, string> = {
      sakura: 'focus:border-sakura-400 focus:ring-4 focus:ring-sakura-100',
      violet: 'focus:border-violet-500 focus:ring-4 focus:ring-violet-100',
      ocean: 'focus:border-ocean-500 focus:ring-4 focus:ring-ocean-100',
      red: 'focus:border-red-500 focus:ring-4 focus:ring-red-100',
    };
    return colorMap[baseColor] || 'focus:border-gray-500 focus:ring-4 focus:ring-gray-100';
  };

  const getButtonFocusClasses = (baseColor: string) => {
    const colorMap: Record<string, string> = {
      sakura: 'focus:ring-4 focus:ring-sakura-200',
      violet: 'focus:ring-4 focus:ring-violet-200', 
      ocean: 'focus:ring-4 focus:ring-ocean-200',
      red: 'focus:ring-4 focus:ring-red-200',
    };
    return colorMap[baseColor] || 'focus:ring-4 focus:ring-gray-200';
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="card generator-panel">
        <div className="card__body">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-4 flex items-center justify-center gap-3">
              <span className="text-4xl">{config.icon}</span>
              {config.name} Generator
            </h2>
            <p className="text-slate-600 text-lg">{config.description}</p>
          </div>

          {/* Error display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-3 animate-fade-in">
              <span className="text-xl">⚠️</span>
              <span className="font-medium">{error.message}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={(event) => { event.preventDefault(); void handleGenerate(); }}>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Species Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-800 mb-2">🧬 Species</label>
                <select
                  className={`w-full p-4 border-2 border-gray-300 rounded-xl bg-white 
                           ${getFocusClasses(config.focusColor)} transition-all duration-300
                           text-slate-800 font-medium hover:border-gray-400 shadow-sm`}
                  onChange={(event) => setSpecies(event.target.value)}
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
                  max={50}
                  min={1}
                  onChange={(event) => setPromptCount(Number.parseInt(event.target.value, 10))}
                  type="number"
                  value={promptCount}
                />
              </div>
            </div>

            {/* Dynamic Attributes */}
            {Object.keys(animeAttributes).length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <span>🎭</span> Character Attributes
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(animeAttributes).map(([key, attrConfig]) => (
                    <div key={key} className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">{attrConfig.label}</label>
                      {attrConfig.type === 'select' ? (
                        <select
                          className={`w-full p-3 border-2 border-gray-300 rounded-lg bg-white 
                                   ${getFocusClasses(config.focusColor)} transition-all duration-300
                                   text-slate-800 font-medium hover:border-gray-400 shadow-sm`}
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
                          {attrConfig.options.map((option, index) => (
                            <option key={option.value || `option-${index}`} value={option.value}>
                              {option.label || option.value}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          className={`w-full p-3 border-2 border-gray-300 rounded-lg bg-white 
                                   ${getFocusClasses(config.focusColor)} transition-all duration-300
                                   text-slate-800 font-medium hover:border-gray-400 shadow-sm`}
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
                          placeholder={`Enter ${attrConfig.label?.toLowerCase() || 'value'}...`}
                          type="text"
                          value={(selectedAttributes[key] as string) || ''}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Generate button */}
            <div className="pt-4">
              <button
                className={`w-full ${config.buttonGradient} text-black py-4 px-8 rounded-xl font-bold text-lg
                         shadow-glow hover:shadow-glow-violet transform hover:scale-105 transition-all duration-300
                         focus:outline-none ${getButtonFocusClasses(config.focusColor)} disabled:opacity-50 
                         disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
                         relative overflow-hidden group`}
                disabled={loading}
                type="submit"
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default UnifiedGeneratorPanel;