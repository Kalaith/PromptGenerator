import { hairColors, hairStyles, eyeColors, backgrounds, clothingItems, poses, eyeExpressions, accessories } from './sharedAttributes';
import { animalGirlData } from './animalGirlData';
import { monsterData } from './monsterData';
import { monsterGirlData } from './monsterGirlData';
import { SpeciesData } from '../types/SpeciesData';
import type { PromptsPayload, Prompt } from '../types/Prompt';
import { pickOne, pickMany, randomInt } from './rng';
import { getId } from './id';

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
  return (pickOne(speciesKeys) as string) || '';
};

export const generatePrompts = (count: number, type: string, species: string | null): PromptsPayload => {
  // If caller requests a random type, pick one of the available types once for this generation
  const effectiveType = type === 'random' ? (pickOne(['animalGirl', 'monster', 'monsterGirl']) as string) : type;
  const data = getDataSource(effectiveType);
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

  const hairColor = (pickOne(hairColors) as string) || '';
  const eyeColor = (pickOne(eyeColors) as string) || '';
  const background = (pickOne(backgrounds) as string) || '';
  const features = speciesInfo.features && speciesInfo.features.length ? pickMany(speciesInfo.features, randomInt(1, Math.max(1, speciesInfo.features.length))) : [];
  const personality = speciesInfo.personality && speciesInfo.personality.length ? pickMany(speciesInfo.personality, randomInt(1, 2)) : [];
  const clothing = type === 'animalGirl' ? ((pickOne(clothingItems) as string) || '') : '';
  const hairStyle = (pickOne(hairStyles) as string) || '';
  const pose = (pickOne(poses) as string) || '';
  const eyeExpression = (pickOne(eyeExpressions) as string) || '';
  const accessory = Math.random() < 0.5 ? ((pickOne(accessories) as string) || '') : '';

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
      id: getId(),
      title: `${selectedSpecies} Character ${i + 1}`,
      description,
      negative_prompt: speciesInfo.negative_prompt,
      tags: [selectedSpecies, ...personality],
    };

    image_prompts.push(prompt);
  }

  return { image_prompts, ...(errors.length ? { errors } : {}) };
};

