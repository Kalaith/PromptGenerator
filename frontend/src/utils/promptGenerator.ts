import { hairColors, hairStyles, eyeColors, backgrounds, clothingItems, poses, eyeExpressions, accessories } from './sharedAttributes';
import { animalGirlData } from './animalGirlData';
import { monsterData } from './monsterData';
import { monsterGirlData } from './monsterGirlData';
import { SpeciesData } from '../types/SpeciesData';

type DataSource = Record<string, SpeciesData>; // Define the correct type for data sources

const getDataSource = (type: string): DataSource => {
  switch (type) {
    case 'animalGirl':
      return animalGirlData as DataSource;
    case 'monster':
      return monsterData as DataSource;
    case 'monsterGirl':
      return monsterGirlData as DataSource;
    default:
      throw new Error(`Unknown type: ${type}`);
  }
};

const getRandomSpecies = (data: DataSource): string => {
  const speciesKeys = Object.keys(data);
  return speciesKeys[Math.floor(Math.random() * speciesKeys.length)];
};

export const generatePrompts = (count: number, type: string, species: string | null) => {
  const data = getDataSource(type);
  console.log('Generating prompts with type:', type);
  console.log('Data:', data);
  console.log('Selected species:', species);

  const image_prompts = [];
  for (let i = 0; i < count; i++) {
    const selectedSpecies = species === 'random' ? getRandomSpecies(data) : species;

    if (!selectedSpecies) {
      throw new Error('Selected species is null or undefined');
    }

    const speciesInfo = data[selectedSpecies];
    console.log('Species info:', speciesInfo);

    if (!speciesInfo) {
      throw new Error(`Species "${selectedSpecies}" not found in data`);
    }

    const hairColor = getRandomElement(hairColors);
    const eyeColor = getRandomElement(eyeColors);
    const background = getRandomElement(backgrounds);
    const features = getRandomElements(speciesInfo.features, Math.floor(Math.random() * speciesInfo.features.length) + 1);
    const personality = getRandomElements(speciesInfo.personality, Math.floor(Math.random() * 2) + 1);
    const clothing = type === 'animalGirl' ? getRandomElement(clothingItems) : ''; // Only include clothing for animal girls
    const hairStyle = getRandomElement(hairStyles);
    const pose = getRandomElement(poses);
    const eyeExpression = getRandomElement(eyeExpressions);
    const accessory = Math.random() < 0.5 ? getRandomElement(accessories) : ''; // Optional accessory

    const description = speciesInfo.descriptionTemplate
      ?.replace('{personality}', personality.join(' and ') || '')
      .replace('{species}', selectedSpecies || '')
      .replace('{features}', features.join(', ') || '')
      .replace('{ears}', speciesInfo.ears || '')
      .replace('{wings}', speciesInfo.wings || '') // Include wings if available
      .replace('{tail}', speciesInfo.tail || '') // Include tail if available
      .replace('{hairColor}', hairColor || '')
      .replace('{hairStyle}', hairStyle || '') // Ensure hairStyle is replaced
      .replace('{eyeColor}', eyeColor || '')
      .replace('{background}', background || '')
      .replace('{clothing}', clothing || '')
      .replace('{pose}', pose || '')
      .replace('{eyeExpression}', eyeExpression || '')
      .replace('{accessories}', accessory ? ' while wearing ' + accessory : '') || '';

    const prompt = {
      id: generateUniqueId(),
      title: `${selectedSpecies} Character ${i + 1}`,
      description,      
      negative_prompt: speciesInfo.negative_prompt,
      tags: [selectedSpecies, ...personality],
    };
    image_prompts.push(prompt);
  }
  return { image_prompts };
};

const getRandomElement = (array: string[]) => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomElements = (array: string[], count: number) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

let promptIdCounter = 1000;
const generateUniqueId = () => {
  return promptIdCounter++;
};
