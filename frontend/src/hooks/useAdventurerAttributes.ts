import { useEffect, useState } from 'react';
import { PromptApi } from '../api';
import type { AttributeConfig } from '../api/types';

interface UseAdventurerAttributesReturn {
  adventurerAttributes: Record<string, AttributeConfig>;
  selectedAttributes: Record<string, string | string[]>;
  setSelectedAttributes: React.Dispatch<React.SetStateAction<Record<string, string | string[]>>>;
  updateAttribute: (key: string, value: string | string[]) => void;
  clearAttribute: (key: string) => void;
  resetAttributes: () => void;
}

export const useAdventurerAttributes = (): UseAdventurerAttributesReturn => {
  const [adventurerAttributes, setAdventurerAttributes] = useState<Record<string, AttributeConfig>>({});
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string | string[]>>({});

  useEffect(() => {
    const loadAdventurerAttributes = async (): Promise<void> => {
      try {
        const attributesResponse = await PromptApi.getGeneratorAttributes('race');
        setAdventurerAttributes(attributesResponse.data.attributes);
      } catch {
        // Error logged by loadAttributes function
      }
    };

    loadAdventurerAttributes();
  }, []);

  const updateAttribute = (key: string, value: string | string[]): void => {
    setSelectedAttributes(prev => ({ ...prev, [key]: value }));
  };

  const clearAttribute = (key: string): void => {
    setSelectedAttributes(prev => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [key]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const resetAttributes = (): void => {
    setSelectedAttributes({});
  };

  return {
    adventurerAttributes,
    selectedAttributes,
    setSelectedAttributes,
    updateAttribute,
    clearAttribute,
    resetAttributes,
  };
};