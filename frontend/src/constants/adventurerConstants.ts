export const DEFAULT_ADVENTURER_FORM_DATA = {
  race: 'random',
  className: 'random',
  experience: 'random',
  gender: 'random',
  style: 'random',
  environment: 'random',
  hairColor: 'random',
  skinColor: 'random',
  eyeColor: 'random',
  eyeStyle: 'random',
} as const;

export const ADVENTURER_FORM_FIELDS = [
  { key: 'race', label: 'Race', optionsKey: 'races' },
  { key: 'className', label: 'Class', optionsKey: 'classes' },
  { key: 'experience', label: 'Experience', optionsKey: 'experienceLevels' },
  { key: 'gender', label: 'Gender', optionsKey: 'genders' },
  { key: 'style', label: 'Style', optionsKey: 'artisticStyles' },
  { key: 'environment', label: 'Environment', optionsKey: 'environments' },
  { key: 'hairColor', label: 'Hair Color', optionsKey: 'hairColors' },
  { key: 'skinColor', label: 'Skin Color', optionsKey: 'skinColors' },
  { key: 'eyeColor', label: 'Eye Color', optionsKey: 'eyeColors' },
  { key: 'eyeStyle', label: 'Eye Style', optionsKey: 'eyeStyles' },
] as const;