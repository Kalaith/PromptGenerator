export const DEFAULT_ALIEN_FORM_DATA = {
  speciesClass: 'random',
  style: 'random',
  environment: 'random',
  climate: 'random',
  positiveTrait: 'random',
  negativeTrait: 'random',
  gender: 'random',
} as const;

export const ALIEN_FORM_FIELDS = [
  { key: 'speciesClass', label: 'Species Class' },
  { key: 'style', label: 'Style' },
  { key: 'environment', label: 'Environment' },
  { key: 'climate', label: 'Climate' },
  { key: 'positiveTrait', label: 'Positive Trait' },
  { key: 'negativeTrait', label: 'Negative Trait' },
  { key: 'gender', label: 'Gender' },
] as const;