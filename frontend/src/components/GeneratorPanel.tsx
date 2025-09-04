import React, { useEffect, useState } from 'react';
import { usePromptStore } from '../stores/promptStore';
import { usePromptGeneration } from '../hooks/usePromptGeneration';
import { useSession } from '../hooks/useSession';
import { PromptApi, TemplateApi, type Template, type GeneratePromptsRequest } from '../api';
import { APP_CONSTANTS } from '../constants/app';

const GeneratorPanel: React.FC = () => {
  const [type, setType] = useState<'animalGirl' | 'monster' | 'monsterGirl' | 'random'>('random');
  const [species, setSpecies] = useState<string>('random');
  const [promptCount, setPromptCount] = useState<number>(APP_CONSTANTS.PROMPT_COUNT.DEFAULT);
  const [availableSpecies, setAvailableSpecies] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [availableTemplates, setAvailableTemplates] = useState<Template[]>([]);
  
  const addGeneratedPrompts = usePromptStore(state => state.addGeneratedPrompts);
  const { generateAnimePrompts, loading, error, clearError } = usePromptGeneration();
  const { addToHistory } = useSession();

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        const [speciesResponse, templatesResponse] = await Promise.all([
          PromptApi.getSpecies(),
          TemplateApi.getPublicTemplates('base'),
        ]);
        
        setAvailableSpecies(speciesResponse.data.species.map(s => s.name) || []);
        setAvailableTemplates(templatesResponse);
      } catch (loadError) {
        console.error('Failed to load data:', loadError);
      }
    };

    void loadData();
  }, []);

  const handleGenerate = async (): Promise<void> => {
    clearError();
    
    const safeCount = Math.max(1, Math.min(promptCount, 50));
    const request: GeneratePromptsRequest = {
      count: safeCount,
      type: type === 'random' ? undefined : type,
      species: species === 'random' ? undefined : species,
      templateId: selectedTemplate?.id,
    };

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
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Anime Prompt Generator</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); void handleGenerate(); }}>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              onChange={(event) => setType(event.target.value as typeof type)}
              value={type}
            >
              <option value="random">Random</option>
              <option value="animalGirl">Animal Girl</option>
              <option value="monster">Monster</option>
              <option value="monsterGirl">Monster Girl</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Species</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              onChange={(event) => setSpecies(event.target.value)}
              value={species}
            >
              <option value="random">Random</option>
              {availableSpecies.map(speciesOption => (
                <option key={speciesOption} value={speciesOption}>{speciesOption}</option>
              ))}
            </select>
          </div>

          {availableTemplates.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-1">Template (Optional)</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                onChange={(event) => {
                  const template = availableTemplates.find(t => t.id === event.target.value);
                  setSelectedTemplate(template ?? null);
                }}
                value={selectedTemplate?.id ?? ''}
              >
                <option value="">No template</option>
                {availableTemplates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Number of prompts</label>
            <input
              className="w-full p-2 border border-gray-300 rounded-md"
              max={APP_CONSTANTS.PROMPT_COUNT.MAX}
              min={APP_CONSTANTS.PROMPT_COUNT.MIN}
              onChange={(event) => setPromptCount(Number.parseInt(event.target.value, 10))}
              type="number"
              value={promptCount}
            />
          </div>

          <button
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Generating...' : 'Generate Anime Prompts'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GeneratorPanel;