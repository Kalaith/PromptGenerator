import { hairColors, hairStyles, eyeColors, backgrounds, eyeExpressions, facialFeatures, poses } from './sharedAttributes';
import { pickOne, pickMany, randomInt } from './rng';
import { getId } from './id';

export const adventurerRaces = [
  'dragonkin', 'dwarf', 'elf', 'goblin', 'halfling', 'human', 'orc', 'tiefling',
  'half-elf', 'gnome', 'half-orc', 'aasimar', 'genasi', 'tabaxi', 'kenku', 'lizardfolk'
];

// Race-specific traits and modifiers
export const raceTraits = {
  dragonkin: {
    features: ['dragon scales', 'draconic eyes', 'small horns', 'elongated canines', 'claw-like nails'],
    colorVariants: ['crimson', 'golden', 'emerald', 'sapphire', 'obsidian', 'silver']
  },
  dwarf: {
    features: ['braided beard', 'stocky build', 'calloused hands', 'determined expression'],
    specialties: ['smithing', 'mining', 'brewing', 'stonework']
  },
  elf: {
    features: ['pointed ears', 'graceful posture', 'ethereal beauty', 'piercing gaze'],
    subtypes: ['high elf', 'wood elf', 'dark elf', 'sea elf']
  },
  tiefling: {
    features: ['small horns', 'pointed tail', 'fanged teeth', 'infernal markings'],
    hornStyles: ['curved', 'straight', 'spiral', 'branched']
  },
  orc: {
    features: ['prominent tusks', 'muscular build', 'tribal scars', 'fierce expression'],
    warPaint: ['red stripes', 'black dots', 'white symbols', 'blue spirals']
  }
  // Add more races as needed
};

// Equipment organized by class and tier
export const classEquipment = {
  warrior: {
    low: {
      armor: ['leather chestplate', 'padded vest', 'chain shirt', 'studded leather'],
      weapons: ['rusted sword', 'wooden club', 'dented shield', 'chipped axe'],
      accessories: ['leather bracers', 'worn belt', 'simple boots', 'torn cloak']
    },
    mid: {
      armor: ['chainmail armor', 'scale mail', 'reinforced leather', 'banded mail'],
      weapons: ['steel longsword', 'battle axe', 'round shield', 'war hammer'],
      accessories: ['metal bracers', 'sturdy belt', 'leather boots', 'travel pack']
    },
    high: {
      armor: ['full plate armor', 'mithril mail', 'dragon scale armor', 'enchanted plate'],
      weapons: ['masterwork greatsword', 'flaming blade', 'tower shield', 'legendary weapon'],
      accessories: ['royal crest', 'enchanted gauntlets', 'ceremonial cloak', 'magic amulet']
    }
  },
  mage: {
    low: {
      armor: ['tattered robe', 'apprentice robes', 'cloth tunic', 'simple dress'],
      weapons: ['basic wand', 'wooden staff', 'crystal focus', 'spell component pouch'],
      accessories: ['leather satchel', 'reading glasses', 'ink-stained fingers', 'worn spellbook']
    },
    mid: {
      armor: ['runed robe', 'wizard robes', 'enchanted cloak', 'mage vestments'],
      weapons: ['carved staff', 'crystal wand', 'orb of power', 'enchanted focus'],
      accessories: ['spell component belt', 'magical amulet', 'floating candles', 'levitating tome']
    },
    high: {
      armor: ['archmage robes', 'starweave cloak', 'reality-bending vestments', 'cosmic robes'],
      weapons: ['staff of power', 'reality-shaping wand', 'artifact orb', 'legendary focus'],
      accessories: ['floating spellbooks', 'crown of intellect', 'time-warped accessories', 'dimensional storage']
    }
  },
  rogue: {
    low: {
      armor: ['dark tunic', 'leather vest', 'hooded shirt', 'simple pants'],
      weapons: ['rusty dagger', 'worn shortsword', 'sling', 'throwing knives'],
      accessories: ['lockpicks', 'worn boots', 'shadowy cloak', 'thieves tools']
    },
    mid: {
      armor: ['reinforced leather', 'studded armor', 'dark cloak', 'silent boots'],
      weapons: ['dual daggers', 'poisoned blade', 'hand crossbow', 'smoke bombs'],
      accessories: ['master lockpicks', 'grappling hook', 'caltrops', 'disguise kit']
    },
    high: {
      armor: ['shadow leather', 'cloak of elvenkind', 'boots of silence', 'glamered armor'],
      weapons: ['vorpal dagger', 'shadow blade', 'enchanted crossbow', 'legendary poisons'],
      accessories: ['dimensional lockpicks', 'ring of invisibility', 'shadow step boots', 'master disguises']
    }
  },
  ranger: {
    low: {
      armor: ['patched cloak', 'leather armor', 'travel clothes', 'worn boots'],
      weapons: ['short bow', 'hunting knife', 'wooden arrows', 'simple trap'],
      accessories: ['travel pack', 'rope', 'survival kit', 'animal companion (small)']
    },
    mid: {
      armor: ['camouflage gear', 'studded leather', 'forest cloak', 'tracker boots'],
      weapons: ['longbow', 'silvered arrows', 'twin blades', 'net trap'],
      accessories: ['tracking kit', 'herbalism supplies', 'animal companion (medium)', 'wayfinder compass']
    },
    high: {
      armor: ['dragon hide armor', 'cloak of the forest lord', 'boots of striding', 'nature\'s blessing'],
      weapons: ['oathbow', 'quiver of endless arrows', 'beast slayer blade', 'legendary traps'],
      accessories: ['animal companion (large)', 'ring of animal friendship', 'nature\'s voice', 'dimensional quiver']
    }
  },
  cleric: {
    low: {
      armor: ['gray robes', 'simple vestments', 'cloth armor', 'wooden sandals'],
      weapons: ['wooden holy symbol', 'simple mace', 'prayer beads', 'healing herbs'],
      accessories: ['sacred texts', 'offering bowl', 'candles', 'pilgrim staff']
    },
    mid: {
      armor: ['blessed robes', 'chain shirt', 'holy vestments', 'sanctified cloak'],
      weapons: ['silver holy symbol', 'blessed mace', 'divine focus', 'healing potions'],
      accessories: ['divine amulet', 'censer', 'holy water', 'blessed shield']
    },
    high: {
      armor: ['vestments of divinity', 'celestial armor', 'halo crown', 'wings of light'],
      weapons: ['artifact holy symbol', 'divine hammer', 'staff of healing', 'miracle focus'],
      accessories: ['direct divine connection', 'angelic companion', 'divine blessing', 'resurrection diamond']
    }
  },
  barbarian: {
    low: {
      armor: ['animal pelts', 'tribal clothes', 'fur wraps', 'bone jewelry'],
      weapons: ['stone axe', 'wooden club', 'primitive spear', 'sling'],
      accessories: ['trophy teeth', 'war paint', 'bone necklace', 'tribal tattoos']
    },
    mid: {
      armor: ['bear hide', 'reinforced pelts', 'tribal armor', 'bone plates'],
      weapons: ['iron axe', 'war club', 'throwing spears', 'bone blade'],
      accessories: ['trophy belt', 'war scars', 'spirit totems', 'beast companion']
    },
    high: {
      armor: ['dragon hide', 'legendary pelts', 'chieftain regalia', 'primal essence'],
      weapons: ['legendary greataxe', 'artifact club', 'weapon of legend', 'primal weapon'],
      accessories: ['crown of leadership', 'legendary scars', 'spirit bond', 'elemental fury']
    }
  },
  bard: {
    low: {
      armor: ['colorful clothes', 'performer outfit', 'traveling clothes', 'bright scarf'],
      weapons: ['simple lute', 'wooden flute', 'small dagger', 'sling'],
      accessories: ['song collection', 'costume pieces', 'makeup kit', 'coin purse']
    },
    mid: {
      armor: ['fine clothes', 'bardic costume', 'enchanted outfit', 'performance gear'],
      weapons: ['masterwork instrument', 'rapier', 'magic focus', 'spell component'],
      accessories: ['reputation', 'contacts', 'fan following', 'performance venues']
    },
    high: {
      armor: ['legendary costume', 'outfit of fame', 'reality-shaping attire', 'cosmic performance gear'],
      weapons: ['legendary instrument', 'reality-altering music', 'weapon of legend', 'inspiration itself'],
      accessories: ['worldwide fame', 'legendary performances', 'reality-changing songs', 'immortal legacy']
    }
  },
  monk: {
    low: {
      armor: ['simple robes', 'training clothes', 'meditation wrap', 'bare feet'],
      weapons: ['hand wraps', 'wooden staff', 'prayer beads', 'inner discipline'],
      accessories: ['meditation cushion', 'training equipment', 'simple meals', 'spiritual texts']
    },
    mid: {
      armor: ['monk robes', 'disciplined attire', 'martial arts uniform', 'focused clothing'],
      weapons: ['fighting sticks', 'chi focus', 'martial weapons', 'inner power'],
      accessories: ['temple connection', 'martial arts training', 'spiritual discipline', 'ki energy']
    },
    high: {
      armor: ['robes of perfection', 'transcendent clothing', 'spiritual vestments', 'enlightened form'],
      weapons: ['transcendent techniques', 'pure ki', 'legendary martial arts', 'spiritual weapon'],
      accessories: ['enlightenment', 'perfect balance', 'spiritual transcendence', 'inner peace']
    }
  },
  paladin: {
    low: {
      armor: ['chain shirt', 'simple armor', 'novice gear', 'training equipment'],
      weapons: ['training sword', 'wooden shield', 'holy symbol', 'oath scroll'],
      accessories: ['code of conduct', 'vows', 'simple faith', 'determination']
    },
    mid: {
      armor: ['blessed armor', 'righteous gear', 'holy vestments', 'divine protection'],
      weapons: ['blessed sword', 'holy shield', 'divine focus', 'righteous weapon'],
      accessories: ['divine connection', 'holy mission', 'righteous cause', 'divine blessing']
    },
    high: {
      armor: ['celestial armor', 'divine protection', 'legendary gear', 'holy radiance'],
      weapons: ['holy avenger', 'divine weapon', 'legendary sword', 'artifact of good'],
      accessories: ['divine mandate', 'celestial connection', 'legendary righteousness', 'avatar status']
    }
  }
};

// Dynamic description templates
export const descriptionTemplates = [
  `An anime-style portrait of a {experience}-level {race} {class} with {hairColor} {hairStyle} hair and {eyeColor} eyes. {raceFeatures} She wears {equipment} and has {facialFeatures}, {pose} against a {background}.`,
  `A detailed anime portrait showing a {race} {class} of {experience} experience. Her {hairColor} hair is {hairStyle} and her {eyeColor} eyes {eyeExpression}. {raceFeatures} Equipped with {equipment}, she {pose} with {facialFeatures} visible, set against a {background}.`,
  `An artistic anime-style depiction of a {experience} {race} {class} warrior. She has {hairStyle} {hairColor} hair and striking {eyeColor} eyes. {raceFeatures} Her {equipment} gleams as she {pose}, her face showing {facialFeatures}, all framed by a {background}.`,
  `A beautiful anime portrait featuring a {race} {class} with {experience} training. Her {hairColor}, {hairStyle} hair contrasts with her {eyeColor} eyes that {eyeExpression}. {raceFeatures} She's equipped with {equipment} and {pose}, displaying {facialFeatures} against a {background}.`
];


// Negative prompts by category
export const negativePrompts = {
  general: 'malformed anatomy, extra limbs, cartoon faces, low quality, blurry',
  modern: 'sci-fi elements, modern clothing, contemporary items, technology',
  style: 'realistic photography, 3D render, western cartoon style',
  content: 'nsfw, inappropriate content, violence, gore'
};

// Main data structure - much more compact
export const adventurerClasses = [
  'warrior', 'mage', 'rogue', 'ranger', 'cleric', 'barbarian', 'bard', 'monk', 'paladin'
];

export const experienceLevels = ['low', 'mid', 'high'];

// Utility functions for generating content
export const getRandomElement = <T>(array: T[]): T | undefined => pickOne(array);

export const getRandomElements = <T>(array: T[], count: number): T[] => pickMany(array, count);

// Enhanced generation function
export const generateAdventurerPrompt = (
  race?: string,
  adventurerClass?: string, 
  experience?: string
): {
  id: string;
  title: string;
  description: string;
  negative_prompt: string;
  tags: string[];
} => {
  // Handle random race
  const selectedRace = race === 'random' ? (getRandomElement(adventurerRaces) as string) : race || (getRandomElement(adventurerRaces) as string);
  const selectedClass = (adventurerClass || (getRandomElement(adventurerClasses) as string)) as string;
  const selectedExperience = (experience || (getRandomElement(experienceLevels) as string)) as string;

  // Get equipment for this class/experience
  const equipment = classEquipment[selectedClass as keyof typeof classEquipment][selectedExperience as keyof typeof classEquipment['warrior']];
  const selectedEquipment = [
    getRandomElement(equipment.armor) || '',
    getRandomElement(equipment.weapons) || '',
    getRandomElement(equipment.accessories) || ''
  ].join(', ');

  // Generate other elements
  const hairColor = getRandomElement(hairColors) || '';
  const hairStyle = getRandomElement(hairStyles) || '';
  const eyeColor = getRandomElement(eyeColors) || '';
  const eyeExpression = getRandomElement(eyeExpressions) || '';
  const background = getRandomElement(backgrounds) || '';
  const facialFeature = getRandomElements(facialFeatures, randomInt(1, 3)).join(', ');
  const pose = getRandomElement(poses) || '';

  // Add race-specific features if available
  let raceFeatures = '';
  if (raceTraits[selectedRace as keyof typeof raceTraits]) {
    const traits = raceTraits[selectedRace as keyof typeof raceTraits];
    if (traits.features) {
      const selectedFeatures = getRandomElements(traits.features, randomInt(1, 2));
      raceFeatures = `She has distinctive ${selectedFeatures.join(' and ')}.`;
    }
  }

  // Select and fill template
  const template = getRandomElement(descriptionTemplates) || '';
  const description = template
    .replace('{experience}', selectedExperience)
    .replace('{race}', selectedRace)
    .replace('{class}', selectedClass)
    .replace('{hairColor}', hairColor)
    .replace('{hairStyle}', hairStyle)
    .replace('{eyeColor}', eyeColor)
    .replace('{eyeExpression}', eyeExpression)
    .replace('{raceFeatures}', raceFeatures)
    .replace('{equipment}', selectedEquipment)
    .replace('{facialFeatures}', facialFeature)
    .replace('{pose}', pose)
    .replace('{background}', background);

  // Combine negative prompts
  const negativePrompt = Object.values(negativePrompts).join(', ');

  return {
    id: getId(),
    title: `${selectedExperience.charAt(0).toUpperCase() + selectedExperience.slice(1)} ${selectedRace.charAt(0).toUpperCase() + selectedRace.slice(1)} ${selectedClass.charAt(0).toUpperCase() + selectedClass.slice(1)}`,
    description,
    negative_prompt: negativePrompt,
    tags: [selectedRace, selectedClass, selectedExperience, hairColor, eyeColor]
  };
};

// Generate multiple prompts
export const generateMultipleAdventurerPrompts = (count: number): ReturnType<typeof generateAdventurerPrompt>[] => {
  return Array.from({ length: count }, () => generateAdventurerPrompt());
};