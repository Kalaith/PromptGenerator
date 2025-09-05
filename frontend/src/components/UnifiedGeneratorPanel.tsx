import React, { useEffect, useState } from 'react';
import { usePromptStore } from '../stores/promptStore';
import { PromptApi } from '../api/promptApi';
import { apiClient } from '../api/client';
import type { GeneratePromptsRequest, AnimeAttributesResponse } from '../api/types';
import type { DescriptionTemplate } from '../api/descriptionTemplateApi';
import { usePromptGeneration } from '../hooks/usePromptGeneration';
import { useSession } from '../hooks/useSession';
import { GeneratorTypeConfig } from '../config/generatorTypes';

interface AttributeConfig {
  id: number;
  generator_type: string;
  category: string;
  label: string;
  input_type: 'select' | 'multi-select' | 'text' | 'number' | 'checkbox';
  is_active: boolean;
  sort_order: number;
}

interface UnifiedGeneratorPanelProps {
  config: GeneratorTypeConfig;
}

const UnifiedGeneratorPanel: React.FC<UnifiedGeneratorPanelProps> = ({ config }) => {
  const [promptCount, setPromptCount] = useState<number>(10);
  const [species, setSpecies] = useState<string>('random');
  const [availableSpecies, setAvailableSpecies] = useState<string[]>([]);
  const [availableTemplates, setAvailableTemplates] = useState<DescriptionTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<DescriptionTemplate | null>(null);
  const [attributeConfigs, setAttributeConfigs] = useState<AttributeConfig[]>([]);
  const [attributeOptions, setAttributeOptions] = useState<Record<string, Array<{label: string, value: string}>>>({});
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

  const addGeneratedPrompts = usePromptStore((state) => state.addGeneratedPrompts);
  const { generateAnimePrompts, loading, error, clearError } = usePromptGeneration();
  const { addToHistory } = useSession();

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        const [speciesResponse, attributeConfigResponse] = await Promise.all([
          PromptApi.getSpecies(),
          apiClient.get<{ success: boolean; data: AttributeConfig[] }>('/attribute-config')
        ]);
        
        if (speciesResponse.success) {
          setAvailableSpecies(speciesResponse.data.species.map(s => s.name));
        }
        
        // Filter attribute configs for this generator type
        if (attributeConfigResponse.success) {
          console.log(`Debug: All attribute configs from API:`, attributeConfigResponse.data);
          console.log(`Debug: Looking for generator_type:`, config.apiType);
          
          const relevantConfigs = attributeConfigResponse.data
            .filter(attrConfig => attrConfig.generator_type === config.apiType && attrConfig.is_active)
            .sort((a, b) => a.sort_order - b.sort_order);
          
          console.log(`Debug: Filtered configs for ${config.apiType}:`, relevantConfigs);
          setAttributeConfigs(relevantConfigs);
          
          // Initialize selected attributes with 'any' for all configured categories
          const initialAttributes: Record<string, string> = {};
          relevantConfigs.forEach(config => {
            initialAttributes[config.category] = 'any';
          });
          setSelectedAttributes(initialAttributes);
          console.log(`Debug: Initialized attributes:`, initialAttributes);
          
          // Load options for all categories at once
          try {
            console.log(`Debug: Loading attribute options for ${config.apiType}`);
            const optionsResponse = await PromptApi.getGeneratorAttributes(config.apiType as any);
            console.log(`Debug: Options response:`, optionsResponse);
            
            if (optionsResponse?.data?.attributes) {
              const optionsMap: Record<string, Array<{label: string, value: string}>> = {};
              
              // Map the response data to our internal format
              Object.entries(optionsResponse.data.attributes).forEach(([category, categoryData]: [string, any]) => {
                optionsMap[category] = categoryData.options || [];
              });
              
              console.log(`Debug: Final options map:`, optionsMap);
              setAttributeOptions(optionsMap);
            }
          } catch (error) {
            console.error('Failed to load attribute options:', error);
          }
        }
      } catch (error) {
        console.error('Failed to load generator data:', error);
      }
    };
    
    void loadData();
  }, [config.id, config.apiType]);

  const handleGenerate = async (): Promise<void> => {
    clearError();
    
    const safeCount = Math.max(1, Math.min(promptCount, 50));
    
    const request: GeneratePromptsRequest = {
      count: safeCount,
      type: config.apiType as any, // Use the API type from config
      species: species === 'random' ? 'random' : species,
      attributes: selectedAttributes, // Always include attributes since they default to 'any'
      ...(selectedTemplate?.id && { templateId: selectedTemplate.id }),
    };

    console.log(`Debug: ${config.name} Request being sent:`, request);
    console.log(`Debug: Selected attributes:`, selectedAttributes);
    console.log(`Debug: Attribute configs:`, attributeConfigs);
    console.log(`Debug: Attribute options:`, attributeOptions);

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
            {attributeConfigs.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <span>🎭</span> Custom Attributes
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {attributeConfigs.map((attrConfig) => (
                    <div key={attrConfig.id} className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">{attrConfig.label}</label>
                      {attrConfig.input_type === 'select' ? (
                        <select
                          className={`w-full p-3 border-2 border-gray-300 rounded-lg bg-white 
                                   ${getFocusClasses(config.focusColor)} transition-all duration-300
                                   text-slate-800 font-medium hover:border-gray-400 shadow-sm`}
                          onChange={(event) => {
                            const value = event.target.value;
                            setSelectedAttributes(prev => {
                              if (value === '') {
                                return { ...prev, [attrConfig.category]: 'any' };
                              }
                              return { ...prev, [attrConfig.category]: value };
                            });
                          }}
                          value={selectedAttributes[attrConfig.category] || ''}
                        >
                          <option value="">Any</option>
                          {(attributeOptions[attrConfig.category] || []).map((option, index) => (
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
                                return { ...prev, [attrConfig.category]: 'any' };
                              }
                              return { ...prev, [attrConfig.category]: value };
                            });
                          }}
                          placeholder={`Enter ${attrConfig.label?.toLowerCase() || 'value'}...`}
                          type="text"
                          value={selectedAttributes[attrConfig.category] || ''}
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