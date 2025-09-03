import React, { useEffect, useState } from 'react';
import { usePromptStore } from '../stores/promptStore';
import { usePromptGeneration } from '../hooks/usePromptGeneration';
import { useSession } from '../hooks/useSession';
import { PromptApi } from '../api';

const GeneratorPanel: React.FC = () => {
  const [type, setType] = useState<'animalGirl' | 'monster' | 'monsterGirl' | 'random'>('random');
  const [species, setSpecies] = useState<string>('random');
  const [promptCount, setPromptCount] = useState<number>(10);
  const [availableSpecies, setAvailableSpecies] = useState<string[]>([]);
  
  const addGeneratedPrompts = usePromptStore((state) => state.addGeneratedPrompts);
  const { generateAnimePrompts, loading, error, clearError } = usePromptGeneration();
  const { addToHistory } = useSession();

  // Load available species from backend
  useEffect(() => {
    const loadSpecies = async () => {
      try {
        const response = await PromptApi.getSpecies();
        const speciesNames = response.species
          .filter(s => s.is_active)
          .map(s => s.name);
        setAvailableSpecies(speciesNames);
      } catch (error) {
        console.error('Failed to load species:', error);
        // Fallback to empty array - user can still generate with random
        setAvailableSpecies([]);
      }
    };

    loadSpecies();
  }, []);

  useEffect(() => {
    // When the type changes, reset species to random
    setSpecies('random');
  }, [type]);

  const handleGenerate = async () => {
    clearError();
    
    const safeCount = Number.isFinite(Number(promptCount)) ? Math.max(1, Math.floor(Number(promptCount))) : 1;
    
    try {
      const apiPrompts = await generateAnimePrompts({
        count: safeCount,
        type: type === 'random' ? 'animalGirl' : type, // Default to animalGirl for random
        species: species === 'random' ? undefined : species,
      });
      
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
