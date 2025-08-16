import React, { useEffect, useState } from 'react';
import { animalGirlData } from '../utils/animalGirlData';
import { monsterData } from '../utils/monsterData';
import { monsterGirlData } from '../utils/monsterGirlData';
import { generatePrompts } from '../utils/promptGenerator';
import { SpeciesData } from '../types/SpeciesData';

const dataSources: Record<string, Record<string, SpeciesData>> = {
  animalGirl: animalGirlData,
  monster: monsterData,
  monsterGirl: monsterGirlData,
};

const GeneratorPanel: React.FC<{ updatePrompts: (prompts: { image_prompts: { id: number; title: string; description: string; negative_prompt: string; tags: string[]; }[]; }) => void }> = ({ updatePrompts }) => {
  const [type, setType] = useState<string>('animalGirl');
  const [species, setSpecies] = useState<string>('random');
  const [promptCount, setPromptCount] = useState<number>(1);

  const data = dataSources[type];

  useEffect(() => {
    console.log('Type changed:', type);
    console.log('Data:', data);
    console.log('Current species:', species);
    if (species === 'random') {
      setSpecies('random');
    } else if (!species || !data[species]) {
      const defaultSpecies = Object.keys(data)[0];
      console.log('Default species selected:', defaultSpecies);
      setSpecies(defaultSpecies);
    }
  }, [type, species]);

    const handleGenerate = () => {
    console.log('Generating prompts with type:', type);
    console.log('Selected species:', species);
    console.log('Prompt count:', promptCount);
    const prompts = generatePrompts(promptCount, type, species);
    updatePrompts(prompts); // Pass the full object
    };

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4">Generator Panel</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" htmlFor="type">
          Type
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          {Object.keys(dataSources).map((key) => (
            <option key={key} value={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </option>
          ))}
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
        >
          <option key="random" value="random">
            Random
          </option>
          {Object.keys(data).map((key) => (
            <option key={key} value={key}>
              {`${key} - ${data[key].species.charAt(0).toUpperCase() + data[key].species.slice(1)}`}
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

export default GeneratorPanel;
