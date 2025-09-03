import React, { useState, useEffect } from 'react';
import { usePromptStore } from '../stores/promptStore';
import { usePromptGeneration } from '../hooks/usePromptGeneration';
import { useSession } from '../hooks/useSession';
import { PromptApi } from '../api';

const AlienGeneratorPanel: React.FC = () => {
  const [speciesClass, setSpeciesClass] = useState<string>('random');
  const [promptCount, setPromptCount] = useState<number>(10);
  const [style, setStyle] = useState<string>('random');
  const [environment, setEnvironment] = useState<string>('random');
  const [climate, setClimate] = useState<string>('random');
  const [positiveTrait, setPositiveTrait] = useState<string>('random');
  const [negativeTrait, setNegativeTrait] = useState<string>('random');
  const [gender, setGender] = useState<string>('random');
  const [availableSpeciesClasses, setAvailableSpeciesClasses] = useState<string[]>([]);
  
  const addGeneratedPrompts = usePromptStore((state) => state.addGeneratedPrompts);
  const { generateAlienPrompts, loading, error, clearError } = usePromptGeneration();
  const { addToHistory } = useSession();

  // Load available species classes from backend
  useEffect(() => {
    const loadSpeciesClasses = async () => {
      try {
        const response = await PromptApi.getAlienSpeciesClasses();
        setAvailableSpeciesClasses(response.species_classes);
      } catch (error) {
        console.error('Failed to load alien species classes:', error);
        // Fallback to empty array - user can still generate with random
        setAvailableSpeciesClasses([]);
      }
    };

    loadSpeciesClasses();
  }, []);

  const handleGenerate = async () => {
    clearError();
    
    const safeCount = Math.max(1, Math.floor(Number(promptCount) || 1));
    
    try {
      const apiPrompts = await generateAlienPrompts({
        count: safeCount,
        species_class: speciesClass === 'random' ? undefined : speciesClass,
        climate: climate === 'random' ? undefined : climate,
        positive_trait: positiveTrait === 'random' ? undefined : positiveTrait,
        negative_trait: negativeTrait === 'random' ? undefined : negativeTrait,
        style: style === 'random' ? undefined : style,
        environment: environment === 'random' ? undefined : environment,
        gender: gender === 'random' ? undefined : gender,
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
      console.error('Alien generation failed:', error);
      // Error is already set by the hook
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4">Alien Generator Panel</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" htmlFor="speciesClass">
          Species Class
        </label>
        <select
          id="speciesClass"
          value={speciesClass}
          onChange={(e) => setSpeciesClass(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          disabled={loading}
        >
          <option value="random">Random</option>
          {availableSpeciesClasses.map((cls) => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" htmlFor="gender">
          Gender (Optional)
        </label>
        <select
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          disabled={loading}
        >
          <option value="random">Random</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" htmlFor="climate">
          Climate (Optional)
        </label>
        <input
          id="climate"
          type="text"
          value={climate === 'random' ? '' : climate}
          onChange={(e) => setClimate(e.target.value || 'random')}
          placeholder="e.g., Desert, Ocean, Tropical (leave blank for random)"
          className="w-full p-2 border border-gray-300 rounded-md"
          disabled={loading}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" htmlFor="style">
          Artistic Style (Optional)
        </label>
        <input
          id="style"
          type="text"
          value={style === 'random' ? '' : style}
          onChange={(e) => setStyle(e.target.value || 'random')}
          placeholder="e.g., cyberpunk, fantasy, realistic (leave blank for random)"
          className="w-full p-2 border border-gray-300 rounded-md"
          disabled={loading}
        />
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
        className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Generating...' : 'Generate Aliens'}
      </button>
    </div>
  );
};

export default AlienGeneratorPanel;
