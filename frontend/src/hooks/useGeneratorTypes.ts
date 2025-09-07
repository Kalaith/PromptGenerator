import { useState, useEffect } from 'react';
import { defaultGeneratorTypes, GeneratorTypeConfig } from '../config/generatorTypes';

export const useGeneratorTypes = () => {
  const [generatorTypes, setGeneratorTypes] = useState<GeneratorTypeConfig[]>([]);

  useEffect(() => {
    loadGeneratorTypes();
  }, []);

  const loadGeneratorTypes = () => {
    const saved = localStorage.getItem('generatorTypes');
    if (saved) {
      try {
        setGeneratorTypes(JSON.parse(saved));
      } catch {
        setGeneratorTypes([...defaultGeneratorTypes]);
      }
    } else {
      setGeneratorTypes([...defaultGeneratorTypes]);
    }
  };

  const saveToStorage = (types: GeneratorTypeConfig[]) => {
    localStorage.setItem('generatorTypes', JSON.stringify(types));
    setGeneratorTypes(types);
  };

  const updateType = (id: string, updates: Partial<GeneratorTypeConfig>) => {
    const updated = generatorTypes.map(type =>
      type.id === id ? { ...type, ...updates } : type
    );
    saveToStorage(updated);
  };

  const addType = (newType: Partial<GeneratorTypeConfig>): boolean => {
    if (!newType.name || !newType.slug || !newType.apiType) {
      return false;
    }

    const id = newType.slug || `type_${Date.now()}`;
    const maxOrder = Math.max(...generatorTypes.map(t => t.order), 0);
    
    const typeToAdd: GeneratorTypeConfig = {
      id,
      slug: newType.slug || id,
      name: newType.name || 'New Generator',
      description: newType.description || 'Description not set',
      icon: newType.icon || '🎯',
      apiType: (newType.apiType as GeneratorTypeConfig['apiType']) || 'animalGirl',
      buttonGradient: newType.buttonGradient || 'bg-gradient-to-r from-blue-500 to-purple-500',
      focusColor: newType.focusColor || 'blue',
      isActive: newType.isActive !== false,
      order: newType.order || maxOrder + 1
    };

    const updated = [...generatorTypes, typeToAdd];
    saveToStorage(updated);
    return true;
  };

  const deleteType = (id: string) => {
    const updated = generatorTypes.filter(type => type.id !== id);
    saveToStorage(updated);
  };

  const resetToDefaults = () => {
    saveToStorage([...defaultGeneratorTypes]);
  };

  return {
    generatorTypes,
    updateType,
    addType,
    deleteType,
    resetToDefaults
  };
};