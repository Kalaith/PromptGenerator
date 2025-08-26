import { hairColors, hairStyles, eyeColors, backgrounds, clothingItems, poses, eyeExpressions, accessories } from './sharedAttributes';
import { animalGirlData } from './animalGirlData';
import { monsterData } from './monsterData';
import { monsterGirlData } from './monsterGirlData';
import { SpeciesData } from '../types/SpeciesData';
import type { PromptsPayload, Prompt } from '../types/Prompt';

type DataSource = Record<string, SpeciesData>;

const getDataSource = (type: string): DataSource | null => {
  switch (type) {
    case 'animalGirl':
      return animalGirlData as DataSource;
    case 'monster':
      return monsterData as DataSource;
    case 'monsterGirl':
      return monsterGirlData as DataSource;
    default:
      return null;
  }
};

const getRandomSpecies = (data: DataSource): string => {
  const speciesKeys = Object.keys(data);
  return speciesKeys[Math.floor(Math.random() * speciesKeys.length)];
};

export const generatePrompts = (count: number, type: string, species: string | null): PromptsPayload => {
  const data = getDataSource(type);
  const errors: string[] = [];

  if (!data) {
    errors.push(`Unknown type: ${type}`);
    return { image_prompts: [], errors };
  }

  const safeCount = Number.isFinite(count) ? Math.max(1, Math.floor(count)) : 1;
  const image_prompts: Prompt[] = [];

  for (let i = 0; i < safeCount; i++) {
    const selectedSpecies = species === 'random' ? getRandomSpecies(data) : species || getRandomSpecies(data);
    const speciesInfo = data[selectedSpecies];

    if (!speciesInfo) {
      errors.push(`Species "${selectedSpecies}" not found for type "${type}"`);
      continue;
    }

    const hairColor = getRandomElement(hairColors);
    const eyeColor = getRandomElement(eyeColors);
    const background = getRandomElement(backgrounds);
    const features = speciesInfo.features && speciesInfo.features.length ? getRandomElements(speciesInfo.features, Math.floor(Math.random() * speciesInfo.features.length) + 1) : [];
    const personality = speciesInfo.personality && speciesInfo.personality.length ? getRandomElements(speciesInfo.personality, Math.floor(Math.random() * 2) + 1) : [];
    const clothing = type === 'animalGirl' ? getRandomElement(clothingItems) : '';
    const hairStyle = getRandomElement(hairStyles);
    const pose = getRandomElement(poses);
    const eyeExpression = getRandomElement(eyeExpressions);
    const accessory = Math.random() < 0.5 ? getRandomElement(accessories) : '';

    const description = (speciesInfo.descriptionTemplate || '')
      .replace('{personality}', personality.join(' and ') || '')
      .replace('{species}', selectedSpecies || '')
      .replace('{features}', features.join(', ') || '')
      .replace('{ears}', speciesInfo.ears || '')
      .replace('{wings}', speciesInfo.wings || '')
      .replace('{tail}', speciesInfo.tail || '')
      .replace('{hairColor}', hairColor || '')
      .replace('{hairStyle}', hairStyle || '')
      .replace('{eyeColor}', eyeColor || '')
      .replace('{background}', background || '')
      .replace('{clothing}', clothing || '')
      .replace('{pose}', pose || '')
      .replace('{eyeExpression}', eyeExpression || '')
      .replace('{accessories}', accessory ? ' while wearing ' + accessory : '');

    const prompt: Prompt = {
      id: typeof crypto !== 'undefined' && typeof (crypto as any).randomUUID === 'function' ? (crypto as any).randomUUID() : `${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      title: `${selectedSpecies} Character ${i + 1}`,
      description,
      negative_prompt: speciesInfo.negative_prompt,
      tags: [selectedSpecies, ...personality],
    };

    image_prompts.push(prompt);
  }

  return { image_prompts, ...(errors.length ? { errors } : {}) };
};

const getRandomElement = (array: string[]) => {
  return array && array.length ? array[Math.floor(Math.random() * array.length)] : '';
};

const getRandomElements = (array: string[], count: number) => {
  if (!array || !array.length) return [];
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.max(0, count));
};
