import React, { useEffect, useState } from 'react';
import { usePromptStore } from '../stores/promptStore';
import { usePromptGeneration } from '../hooks/usePromptGeneration';
import { useSession } from '../hooks/useSession';
import { PromptApi, TemplateApi, type Template, type GeneratePromptsRequest } from '../api';
import type { AttributeConfig } from '../api/types';
import { APP_CONSTANTS } from '../constants/app';

const GeneratorPanel: React.FC = () => {
  const [type, setType] = useState<'animalGirl' | 'monster' | 'monsterGirl' | 'random'>('random');
  const [species, setSpecies] = useState<string>('random');
  const [promptCount, setPromptCount] = useState<number>(APP_CONSTANTS.PROMPT_COUNT.DEFAULT);
  const [availableSpecies, setAvailableSpecies] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [availableTemplates, setAvailableTemplates] = useState<Template[]>([]);
  const [animeAttributes, setAnimeAttributes] = useState<Record<string, AttributeConfig>>({});
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string | string[]>>({});
  
  const addGeneratedPrompts = usePromptStore(state => state.addGeneratedPrompts);
  const { generateAnimePrompts, loading, error, clearError } = usePromptGeneration();
  const { addToHistory } = useSession();

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        const [speciesResponse, templatesResponse, attributesResponse] = await Promise.all([
          PromptApi.getSpecies(),
          TemplateApi.getPublicTemplates('base'),
          PromptApi.getGeneratorAttributes('anime'),
        ]);
        
        // Filter for anime species only
        const animeSpecies = speciesResponse.data.species
          .filter(s => s.type === 'anime')
          .map(s => s.name);
        setAvailableSpecies(animeSpecies || []);
        setAvailableTemplates(templatesResponse);
        setAnimeAttributes(attributesResponse.data.attributes);
      } catch (loadError) {
        console.error('Failed to load data:', loadError);
      }
    };

    void loadData();
  }, []);

  const handleGenerate = async (): Promise<void> => {
    clearError();
    
    const safeCount = Math.max(1, Math.min(promptCount, 50));
    
    // Map old generation types to new species types
    const mapTypeToSpeciesType = (generationType: string) => {
      switch (generationType) {
        case 'animalGirl':
        case 'monster':
        case 'monsterGirl':
          return 'anime';
        case 'alien':
          return 'alien';
        case 'adventurer':
          return 'race';
        case 'random':
          return 'anime'; // Random should only pick from anime species
        default:
          return 'anime';
      }
    };
    
    const request: GeneratePromptsRequest = {
      count: safeCount,
      type: mapTypeToSpeciesType(type),
      species: (species === 'random' || type === 'random') ? 'random' : species,
      attributes: Object.keys(selectedAttributes).length > 0 ? selectedAttributes : undefined,
      templateId: selectedTemplate?.id,
    };

    console.log('Debug: Form state values:', {
      type,
      species,
      selectedAttributes,
      selectedTemplate,
      promptCount,
      safeCount
    });
    console.log('Debug: Request being sent:', request);

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
              type: 'anime',
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
      {/* Main generator card */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8 relative overflow-hidden">
          {/* Decorative background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-sakura-50/30 via-transparent to-violet-50/30 pointer-events-none"></div>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-heading font-bold bg-gradient-sunset bg-clip-text text-transparent mb-3">
                🎨 Anime Prompt Generator
              </h2>
              <p className="text-slate-700 text-lg font-medium">Create stunning anime character prompts with AI</p>
            </div>
            
            {/* Error display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-3 animate-fade-in">
                <span className="text-xl">⚠️</span>
                <span className="font-medium">{error.message}</span>
              </div>
            )}

            {/* Form */}
            <form className="space-y-6" onSubmit={(event) => { event.preventDefault(); void handleGenerate(); }}>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Type Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-800 mb-2">✨ Character Type</label>
                  <select
                    className="w-full p-4 border-2 border-gray-300 rounded-xl bg-white 
                             focus:border-sakura-500 focus:ring-4 focus:ring-sakura-100 transition-all duration-300
                             text-slate-800 font-medium hover:border-gray-400 shadow-sm"
                    onChange={(event) => setType(event.target.value as typeof type)}
                    value={type}
                  >
                    <option value="random">🎲 Random Surprise</option>
                    <option value="animalGirl">🐱 Animal Girl</option>
                    <option value="monster">👹 Monster</option>
                    <option value="monsterGirl">👾 Monster Girl</option>
                  </select>
                </div>

                {/* Species Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-800 mb-2">🧬 Species</label>
                  <select
                    className="w-full p-4 border-2 border-gray-300 rounded-xl bg-white 
                             focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all duration-300
                             text-slate-800 font-medium hover:border-gray-400 shadow-sm"
                    onChange={(event) => setSpecies(event.target.value)}
                    value={species}
                  >
                    <option value="random">🎲 Random Species</option>
                    {availableSpecies.map(speciesOption => (
                      <option key={speciesOption} value={speciesOption}>{speciesOption}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dynamic Anime Attributes */}
              {Object.keys(animeAttributes).length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <span>🎭</span> Character Attributes
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(animeAttributes).map(([key, config]) => (
                      <div key={key} className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">{config.label}</label>
                        {config.type === 'select' ? (
                          <select
                            className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white 
                                     focus:border-ocean-500 focus:ring-4 focus:ring-ocean-100 transition-all duration-300
                                     text-slate-800 font-medium hover:border-gray-400 shadow-sm"
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
                            className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white 
                                     focus:border-ocean-500 focus:ring-4 focus:ring-ocean-100 transition-all duration-300
                                     text-slate-800 font-medium hover:border-gray-400 shadow-sm h-24"
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

              {/* Template Selection */}
              {availableTemplates.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-dark-700 mb-2 flex items-center gap-2">
                    <span>📝</span> Template (Optional)
                  </label>
                  <select
                    className="w-full p-4 border-2 border-mystic-200/50 rounded-xl bg-white/70 backdrop-blur-sm 
                             focus:border-mystic-400 focus:ring-4 focus:ring-mystic-100 transition-all duration-300
                             text-dark-700 font-medium hover:border-mystic-300"
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
                <label className="block text-sm font-semibold text-dark-700 mb-2 flex items-center gap-2">
                  <span>🔢</span> Number of prompts
                </label>
                <input
                  className="w-full p-4 border-2 border-sakura-200/50 rounded-xl bg-white/70 backdrop-blur-sm 
                           focus:border-sakura-400 focus:ring-4 focus:ring-sakura-100 transition-all duration-300
                           text-dark-700 font-medium hover:border-sakura-300"
                  max={APP_CONSTANTS.PROMPT_COUNT.MAX}
                  min={APP_CONSTANTS.PROMPT_COUNT.MIN}
                  onChange={(event) => setPromptCount(Number.parseInt(event.target.value, 10))}
                  type="number"
                  value={promptCount}
                />
              </div>

              {/* Generate button */}
              <div className="pt-4">
                <button
                  className="w-full bg-gradient-sunset text-black py-4 px-8 rounded-xl font-bold text-lg
                           shadow-glow hover:shadow-glow-violet transform hover:scale-105 transition-all duration-300
                           focus:outline-none focus:ring-4 focus:ring-sakura-200 disabled:opacity-50 
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
                        Generating Magic...
                      </>
                    ) : (
                      <>
                        <span className="text-xl">✨</span>
                        Generate Anime Prompts
                        <span className="text-xl">✨</span>
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

export default GeneratorPanel;