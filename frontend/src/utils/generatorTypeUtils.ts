import { GeneratorTypeConfig } from '../config/generatorTypes';

export const sortTypesByOrder = (types: GeneratorTypeConfig[]): GeneratorTypeConfig[] => {
  return [...types].sort((a, b) => a.order - b.order);
};

export const validateNewType = (newType: Partial<GeneratorTypeConfig>): boolean => {
  return !!(newType.name && newType.slug && newType.apiType);
};

export const showConfirmDialog = (message: string): boolean => {
  // eslint-disable-next-line no-alert
  return confirm(message);
};