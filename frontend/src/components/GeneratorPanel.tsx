import React, { useEffect, useState } from 'react';
import { usePromptStore } from '../stores/promptStore';
import { usePromptGeneration } from '../hooks/usePromptGeneration';
import { useSession } from '../hooks/useSession';
import { PromptApi, TemplateApi, Template } from '../api';

const GeneratorPanel: React.FC = () => {
  const [type, setType] = useState<'animalGirl' | 'monster' | 'monsterGirl' | 'random'>('random');
  const [species, setSpecies] = useState<string>('random');
  const [promptCount, setPromptCount] = useState<number>(10);
  const [availableSpecies, setAvailableSpecies] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [availableTemplates, setAvailableTemplates] = useState<Template[]>([]);
  
  const addGeneratedPrompts = usePromptStore((state) => state.addGeneratedPrompts);
  const { generateAnimePrompts, loading, error, clearError } = usePromptGeneration();
  const { addToHistory } = useSession();

  // Load available species and templates from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load species
        const speciesResponse = await PromptApi.getSpecies();
        const speciesNames = speciesResponse.species
          .filter(s => s.is_active)
          .map(s => s.name);
        setAvailableSpecies(speciesNames);

        // Load anime templates
        const templates = await TemplateApi.getPublicTemplates('anime');
        setAvailableTemplates(templates);
      } catch (error) {
        console.error('Failed to load data:', error);
        // Fallback to empty arrays - user can still generate
        setAvailableSpecies([]);
        setAvailableTemplates([]);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    // When the type changes, reset species to random
    setSpecies('random');
  }, [type]);

  const handleGenerate = async () => {
    clearError();
    
    const safeCount = Number.isFinite(Number(promptCount)) ? Math.max(1, Math.floor(Number(promptCount))) : 1;
    
    try {
      let generationParams = {
        count: safeCount,
        type: type === 'random' ? 'animalGirl' : type, // Default to animalGirl for random
        species: species === 'random' ? undefined : species,
      };

      // Apply template if selected
      if (selectedTemplate) {
        generationParams = TemplateApi.applyTemplate(selectedTemplate, generationParams);
        // Increment template usage count
        try {
          await TemplateApi.useTemplate(selectedTemplate.id);
        } catch (err) {
          console.warn('Failed to update template usage:', err);
        }
      }

      const apiPrompts = await generateAnimePrompts(generationParams);
      
      if (apiPrompts.length > 0) {
        addGeneratedPrompts(apiPrompts);
        
        // Add to history
        for (const prompt of apiPrompts) {
          try {
            await addToHistory({
              id: prompt.id,
              title: prompt.title,
              description: prompt.description,
              type: prompt.prompt_type,
              timestamp: new Date().toISOString(),
            });
          } catch (historyError) {
            console.warn('Failed to add to history:', historyError);
            // Continue - don't block UI for history failures
          }
        }
      }
    } catch (error) {
      console.error('Generation failed:', error);
      // Error is already set by the hook
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4">Generator Panel</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" htmlFor="type">
          Type
        </label>
        <select
          id="type"
          value={type}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setType(e.target.value as 'animalGirl' | 'monster' | 'monsterGirl' | 'random')}
          className="w-full p-2 border border-gray-300 rounded-md"
          disabled={loading}
        >
          <option value="random">Random</option>
          <option value="animalGirl">Animal Girl</option>
          <option value="monster">Monster</option>
          <option value="monsterGirl">Monster Girl</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" htmlFor="species">
          Species
        </label>
        <select
          id="species"
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          disabled={loading}
        >
          <option value="random">Random</option>
          {availableSpecies.map((speciesName) => (
            <option key={speciesName} value={speciesName}>
              {speciesName.charAt(0).toUpperCase() + speciesName.slice(1)}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" htmlFor="template">
          Template (Optional)
        </label>
        <select
          id="template"
          value={selectedTemplate?.id || ''}
          onChange={(e) => {
            const templateId = e.target.value;
            const template = templateId ? availableTemplates.find(t => t.id === Number(templateId)) : null;
            setSelectedTemplate(template || null);
          }}
          className="w-full p-2 border border-gray-300 rounded-md"
          disabled={loading}
        >
          <option value="">No Template</option>
          {availableTemplates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name} ({template.usage_count} uses)
            </option>
          ))}
        </select>
        {selectedTemplate && (
          <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
            <div className="font-medium">{selectedTemplate.name}</div>
            <div className="text-gray-600">{selectedTemplate.description}</div>
          </div>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" htmlFor="promptCount">
          Prompt Count
        </label>
        <input
          id="promptCount"
          type="number"
          min={1}
          max={100}
          value={promptCount}
          onChange={(e) => setPromptCount(Math.max(1, Math.floor(Number(e.target.value) || 1)))}
          className="w-full p-2 border border-gray-300 rounded-md"
          disabled={loading}
        />
      </div>
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Generating...' : 'Generate'}
      </button>
    </div>
  );
};

export default GeneratorPanel;
