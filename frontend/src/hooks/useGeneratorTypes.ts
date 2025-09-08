import { useState, useEffect } from 'react';
import { config } from '../config/app';

// Updated interface to match backend model
export interface GeneratorTypeConfig {
  id?: number;
  name: string;
  display_name: string;
  description: string;
  endpoint: string;
  route_key: string;
  is_active: boolean;
  sort_order: number;
}

export const useGeneratorTypes = () => {
  const [generatorTypes, setGeneratorTypes] = useState<GeneratorTypeConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGeneratorTypes();
  }, []);

  const loadGeneratorTypes = async () => {
    try {
      setLoading(true);
      const apiBaseUrl = config.getApi().baseUrl;
      const response = await fetch(`${apiBaseUrl}/generator-types`);
      const data = await response.json();
      
      if (data.success) {
        setGeneratorTypes(data.data.generator_types || []);
      } else {
        setError('Failed to load generator types');
      }
    } catch (err) {
      setError('Error fetching generator types');
      console.error('Error fetching generator types:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateType = async (id: number, updates: Partial<GeneratorTypeConfig>): Promise<boolean> => {
    try {
      const apiBaseUrl = config.getApi().baseUrl;
      const response = await fetch(`${apiBaseUrl}/generator-types/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (response.ok) {
        await loadGeneratorTypes(); // Refresh the list
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating generator type:', err);
      return false;
    }
  };

  const addType = async (newType: Partial<GeneratorTypeConfig>): Promise<boolean> => {
    if (!newType.name || !newType.display_name || !newType.route_key || !newType.endpoint) {
      return false;
    }

    try {
      const apiBaseUrl = config.getApi().baseUrl;
      const response = await fetch(`${apiBaseUrl}/generator-types`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newType.name,
          display_name: newType.display_name,
          description: newType.description || 'Description not set',
          endpoint: newType.endpoint,
          route_key: newType.route_key,
          is_active: newType.is_active !== false,
          sort_order: newType.sort_order || 0
        }),
      });
      
      if (response.ok) {
        await loadGeneratorTypes(); // Refresh the list
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error adding generator type:', err);
      return false;
    }
  };

  const deleteType = async (id: number): Promise<boolean> => {
    try {
      const apiBaseUrl = config.getApi().baseUrl;
      const response = await fetch(`${apiBaseUrl}/generator-types/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        await loadGeneratorTypes(); // Refresh the list
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting generator type:', err);
      return false;
    }
  };

  const resetToDefaults = async (): Promise<boolean> => {
    // This would need to be implemented on the backend
    // For now, we'll just reload from the API
    await loadGeneratorTypes();
    return true;
  };

  return {
    generatorTypes,
    loading,
    error,
    updateType,
    addType,
    deleteType,
    resetToDefaults,
    refresh: loadGeneratorTypes
  };
};