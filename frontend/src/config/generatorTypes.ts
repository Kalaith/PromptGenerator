export interface GeneratorTypeConfig {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  apiType: string;
  buttonGradient: string;
  focusColor: string;
  isActive: boolean;
  order: number;
}

export const defaultGeneratorTypes: GeneratorTypeConfig[] = [
  {
    id: 'kemonomimi',
    slug: 'kemonomimi',
    name: 'Kemonomimi',
    description: 'Create adorable animal-eared characters',
    icon: '🐱',
    apiType: 'animalGirl',
    buttonGradient: 'bg-gradient-sunset',
    focusColor: 'sakura',
    isActive: true,
    order: 1
  },
  {
    id: 'monster-girl',
    slug: 'monster-girl', 
    name: 'Monster Girl',
    description: 'Create captivating monster girl characters',
    icon: '👾',
    apiType: 'monsterGirl',
    buttonGradient: 'bg-gradient-mystic',
    focusColor: 'violet',
    isActive: true,
    order: 2
  },
  {
    id: 'monster',
    slug: 'monster',
    name: 'Monster',
    description: 'Create fearsome and fantastical monsters',
    icon: '👹',
    apiType: 'monster',
    buttonGradient: 'bg-gradient-to-r from-red-500 to-orange-500',
    focusColor: 'red',
    isActive: true,
    order: 3
  },
  {
    id: 'adventurer',
    slug: 'adventurer',
    name: 'Adventurer',
    description: 'Create epic fantasy adventures and characters',
    icon: '⚔️',
    apiType: 'race',
    buttonGradient: 'bg-gradient-ocean',
    focusColor: 'ocean',
    isActive: true,
    order: 4
  },
  {
    id: 'alien',
    slug: 'alien',
    name: 'Alien',
    description: 'Create otherworldly alien beings',
    icon: '👽',
    apiType: 'alien',
    buttonGradient: 'bg-gradient-mystic',
    focusColor: 'violet',
    isActive: true,
    order: 5
  }
];

// This would eventually be loaded from a backend API/database
export const getGeneratorTypes = (includeInactive = false): GeneratorTypeConfig[] => {
  // Load from localStorage or use defaults
  const saved = localStorage.getItem('generatorTypes');
  let types: GeneratorTypeConfig[];
  
  if (saved) {
    try {
      types = JSON.parse(saved);
    } catch {
      types = [...defaultGeneratorTypes];
    }
  } else {
    types = [...defaultGeneratorTypes];
  }

  const filtered = includeInactive ? types : types.filter(type => type.isActive);
  return filtered.sort((a, b) => a.order - b.order);
};

export const getGeneratorTypeBySlug = (slug: string): GeneratorTypeConfig | undefined => {
  return getGeneratorTypes(true).find(type => type.slug === slug);
};

export const getAnimeGeneratorTypes = (): GeneratorTypeConfig[] => {
  return getGeneratorTypes().filter(type => 
    ['kemonomimi', 'monster-girl', 'monster'].includes(type.id)
  );
};