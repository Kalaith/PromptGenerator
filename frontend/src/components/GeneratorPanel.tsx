import React, { useEffect, useState } from 'react';
import { animalGirlData } from '../utils/animalGirlData';
import { monsterData } from '../utils/monsterData';
import { monsterGirlData } from '../utils/monsterGirlData';
import { generatePrompts } from '../utils/promptGenerator';
import { SpeciesData } from '../types/SpeciesData';
import type { PromptsPayload } from '../types/Prompt';

type DataSources = Record<string, Record<string, SpeciesData>>;

const dataSources: DataSources = {
  animalGirl: animalGirlData,
  monster: monsterData,
  monsterGirl: monsterGirlData,
};

interface GeneratorPanelProps {
  updatePrompts: (prompts: PromptsPayload) => void;
}

const GeneratorPanel: React.FC<GeneratorPanelProps> = ({ updatePrompts }) => {
  const [type, setType] = useState<'animalGirl' | 'monster' | 'monsterGirl'>('animalGirl');
  const [species, setSpecies] = useState<string>(() => {
    const defaultData = dataSources['animalGirl'];
    return Object.keys(defaultData)[0] ?? 'random';
  });
  const [promptCount, setPromptCount] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  const data = dataSources[type];

  useEffect(() => {
    // When the type changes, pick the first available species for that type
    const defaultSpecies = Object.keys(data)[0] ?? 'random';
    setSpecies(defaultSpecies);
  }, [type]);

  const handleGenerate = () => {
    setError(null);
    const safeCount = Number.isFinite(Number(promptCount)) ? Math.max(1, Math.floor(Number(promptCount))) : 1;
    const result = generatePrompts(safeCount, type, species);
    if (result.errors && result.errors.length) {
      setError(result.errors.join('; '));
    }
    updatePrompts(result);
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
          onChange={(e) => setType(e.target.value as any)}
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
          min={1}
          max={500}
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

export default GeneratorPanel;
