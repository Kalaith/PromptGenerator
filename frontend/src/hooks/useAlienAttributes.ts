import { useEffect, useState } from 'react';
import { PromptApi } from '../api';
import type { AttributeConfig } from '../api/types';

interface UseAlienAttributesReturn {
  alienAttributes: Record<string, AttributeConfig>;
  selectedAttributes: Record<string, string | string[]>;
  setSelectedAttributes: React.Dispatch<React.SetStateAction<Record<string, string | string[]>>>;
  updateAttribute: (key: string, value: string | string[]) => void;
  clearAttribute: (key: string) => void;
  resetAttributes: () => void;
}

export const useAlienAttributes = (): UseAlienAttributesReturn => {
  const [alienAttributes, setAlienAttributes] = useState<Record<string, AttributeConfig>>({});
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string | string[]>>({});

  useEffect(() => {
    const loadAlienAttributes = async (): Promise<void> => {
      try {
        const attributesResponse = await PromptApi.getGeneratorAttributes('alien');
        setAlienAttributes(attributesResponse.data.attributes);
      } catch {
        // Error logged by loadAttributes function
      }
    };

    loadAlienAttributes();
  }, []);

  const updateAttribute = (key: string, value: string | string[]): void => {
    setSelectedAttributes(prev => ({ ...prev, [key]: value }));
  };

  const clearAttribute = (key: string): void => {
    setSelectedAttributes(prev => {
      const { [key]: removed, ...rest } = prev;
      void removed;
      return rest;
    });
  };

  const resetAttributes = (): void => {
    setSelectedAttributes({});
  };

  return {
    alienAttributes,
    selectedAttributes,
    setSelectedAttributes,
    updateAttribute,
    clearAttribute,
    resetAttributes,
  };
};
