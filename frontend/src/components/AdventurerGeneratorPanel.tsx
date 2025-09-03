import React, { useState, useEffect } from 'react';
import { usePromptStore } from '../stores/promptStore';
import { usePromptGeneration } from '../hooks/usePromptGeneration';
import { useSession } from '../hooks/useSession';
import { PromptApi } from '../api';
import { APP_CONSTANTS } from '../constants/app';
import { ValidationUtils } from '../utils/validation';
import { AppErrorHandler } from '../types/errors';

const AdventurerGeneratorPanel: React.FC = () => {
  const [race, setRace] = useState<string>('random');
  const [promptCount, setPromptCount] = useState<number>(APP_CONSTANTS.PROMPT_COUNT.DEFAULT);
  const [availableRaces, setAvailableRaces] = useState<string[]>([]);
  
  const addGeneratedPrompts = usePromptStore((state) => state.addGeneratedPrompts);
  const { generateAdventurerPrompts, loading, error, clearError } = usePromptGeneration();
  const { addToHistory } = useSession();

  // Load available races from backend
  useEffect(() => {
    const loadRaces = async () => {
      try {
        const response = await PromptApi.getAdventurerRaces();
        setAvailableRaces(response.races || []);
      } catch (error) {
        console.error('Failed to load adventurer races:', error);
        // Fallback to empty array - user can still generate with random
        setAvailableRaces([]);
      }
    };

    loadRaces();
  }, []);

  const handleGenerate = async () => {
    clearError();
    
    const validation = ValidationUtils.validatePromptCount(promptCount);
    if (!validation.isValid) {
      return;
    }
    
    const safeCount = ValidationUtils.sanitizePromptCount(promptCount);
    
    try {
      const generationParams = {
        count: safeCount,
        race: race === 'random' ? undefined : race,
      };

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
              type: 'adventurer',
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
      <h2 className="text-lg font-semibold mb-4">Adventurer Generator Panel</h2>
      {error && (
        <div className="mb-4 text-red-600">
          {AppErrorHandler.getDisplayMessage(error)}
        </div>
      )}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" htmlFor="race">
          Race
        </label>
        <select
          id="race"
          value={race}
          onChange={(e) => setRace(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          disabled={loading}
        >
          <option value="random">Random</option>
          {availableRaces.map((raceOption) => (
            <option key={raceOption} value={raceOption}>
              {raceOption.charAt(0).toUpperCase() + raceOption.slice(1)}
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
          min={APP_CONSTANTS.PROMPT_COUNT.MIN}
          max={APP_CONSTANTS.PROMPT_COUNT.MAX}
          value={promptCount}
          onChange={(e) => setPromptCount(ValidationUtils.sanitizePromptCount(e.target.value))}
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

export default AdventurerGeneratorPanel;
