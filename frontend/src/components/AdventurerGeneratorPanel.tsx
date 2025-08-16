import React, { useState } from 'react';
import { adventurerRaces, raceTraits, generateAdventurerPrompt } from '../utils/adventurerGenerator';

const AdventurerGeneratorPanel: React.FC<{ updatePrompts: (prompts: { image_prompts: { id: number; title: string; description: string; negative_prompt: string; tags: string[]; }[]; }) => void }> = ({ updatePrompts }) => {
  const [race, setRace] = useState<string>('human');
  const [promptCount, setPromptCount] = useState<number>(1);

  const handleGenerate = () => {
    console.log('Generating adventurer prompts with race:', race);
    console.log('Prompt count:', promptCount);

    const prompts = Array.from({ length: promptCount }, (_, index) => generateAdventurerPrompt(race));

    updatePrompts({ image_prompts: prompts });
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
          value={promptCount}
          onChange={(e) => setPromptCount(Number(e.target.value))}
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
