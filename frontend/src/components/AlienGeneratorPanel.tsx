import React, { useState } from 'react';
import { speciesClasses, generateAlienPrompt, artisticStyles, environments, universalTraits, climatePreferences, positiveTraitVisuals, negativeTraitVisuals, genders } from '../utils/alienGenerator';

const AlienGeneratorPanel: React.FC<{ updatePrompts: (prompts: { image_prompts: { id: number; title: string; description: string; negative_prompt: string; tags: string[]; }[]; }) => void }> = ({ updatePrompts }) => {
  const [speciesClass, setSpeciesClass] = useState<string>('Humanoid');
  const [promptCount, setPromptCount] = useState<number>(1);
  const [style, setStyle] = useState<string>('random');
  const [environment, setEnvironment] = useState<string>('random');
  const [climate, setClimate] = useState<string>('random');
  const [positiveTrait, setPositiveTrait] = useState<string>('random');
  const [negativeTrait, setNegativeTrait] = useState<string>('random');
  const [gender, setGender] = useState<string>('random');

  const handleGenerate = () => {
    const prompts = Array.from({ length: promptCount }, () =>
      generateAlienPrompt(
        speciesClass === 'random' ? undefined : speciesClass,
        climate === 'random' ? undefined : climate,
        positiveTrait === 'random' ? undefined : positiveTrait,
        negativeTrait === 'random' ? undefined : negativeTrait,
        style === 'random' ? undefined : style,
        environment === 'random' ? undefined : environment,
        gender === 'random' ? undefined : gender
      )
    );
    updatePrompts({ image_prompts: prompts });
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4">Alien Generator Panel</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" htmlFor="speciesClass">
          Species Class
        </label>
        <select
          id="speciesClass"
          value={speciesClass}
          onChange={(e) => setSpeciesClass(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option key="random" value="random">Random</option>
          {speciesClasses.map((cls) => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" htmlFor="gender">
          Gender
        </label>
        <select
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option key="random" value="random">Random</option>
          {genders.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" htmlFor="climate">
          Climate
        </label>
        <select
          id="climate"
          value={climate}
          onChange={(e) => setClimate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option key="random" value="random">Random</option>
          {climatePreferences.flatMap((pref) => pref.types).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" htmlFor="style">
          Artistic Style
        </label>
        <select
          id="style"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option key="random" value="random">Random</option>
          {artisticStyles.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" htmlFor="environment">
          Environment
        </label>
        <select
          id="environment"
          value={environment}
          onChange={(e) => setEnvironment(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option key="random" value="random">Random</option>
          {environments.map((env) => (
            <option key={env} value={env}>{env}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" htmlFor="positiveTrait">
          Positive Trait (Visual Effect)
        </label>
        <select
          id="positiveTrait"
          value={positiveTrait}
          onChange={(e) => setPositiveTrait(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option key="random" value="random">Random</option>
          {universalTraits.positive.map((trait) => {
            const visualExample = positiveTraitVisuals[trait.name as keyof typeof positiveTraitVisuals]?.[0] || 'visual enhancement';
            return (
              <option key={trait.name} value={trait.name}>
                {trait.name} ({visualExample})
              </option>
            );
          })}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" htmlFor="negativeTrait">
          Negative Trait (Visual Effect)
        </label>
        <select
          id="negativeTrait"
          value={negativeTrait}
          onChange={(e) => setNegativeTrait(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option key="random" value="random">Random</option>
          {universalTraits.negative.map((trait) => {
            const visualExample = negativeTraitVisuals[trait.name as keyof typeof negativeTraitVisuals]?.[0] || 'visual characteristic';
            return (
              <option key={trait.name} value={trait.name}>
                {trait.name} ({visualExample})
              </option>
            );
          })}
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
        className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
      >
        Generate
      </button>
    </div>
  );
};

export default AlienGeneratorPanel;
