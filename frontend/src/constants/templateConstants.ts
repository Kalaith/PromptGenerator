export const GENERATOR_TYPES = [
  { value: 'adventurer', label: 'Adventurer' },
  { value: 'alien', label: 'Alien' },
  { value: 'anime', label: 'Anime' },
  { value: 'base', label: 'Base' },
] as const;

export const DEFAULT_TEMPLATE_FORM_DATA = {
  name: '',
  generator_type: 'adventurer' as const,
  template: '',
  description: '',
  is_active: true,
  is_default: false,
};