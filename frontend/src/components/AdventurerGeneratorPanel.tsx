import React, { useState } from 'react';
import { adventurerRaces, generateAdventurerPrompt } from '../utils/adventurerGenerator';
import { usePromptStore } from '../stores/promptStore';

const AdventurerGeneratorPanel: React.FC = () => {
  const [race, setRace] = useState<string>('random');
  const [promptCount, setPromptCount] = useState<number>(10);
  
  const addGeneratedPrompts = usePromptStore((state) => state.addGeneratedPrompts);

  const handleGenerate = () => {
    const safeCount = Math.max(1, Math.floor(Number(promptCount) || 1));
    const prompts = Array.from({ length: safeCount }, () => {
      const p = generateAdventurerPrompt(race);
      return { ...p, id: String(p.id) };
    });

    addGeneratedPrompts(prompts);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4">Adventurer Generator Panel</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" htmlFor="race">
          Race
        </label>
        <select
          id="race"
          value={race}
          onChange={(e) => setRace(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option key="random" value="random">Random</option>
          {adventurerRaces.map((raceOption) => (
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
          min={1}
          value={promptCount}
          onChange={(e) => setPromptCount(Math.max(1, Math.floor(Number(e.target.value) || 1)))}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <button
        onClick={handleGenerate}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Generate
      </button>
    </div>
  );
};

export default AdventurerGeneratorPanel;
