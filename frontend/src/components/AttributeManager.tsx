import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { AttributeConfig, NewAttributeData } from './attributes/types';
import { AttributeForm } from './attributes/AttributeForm';
import { AttributeTable } from './attributes/AttributeTable';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { ErrorDisplay } from './ui/ErrorDisplay';

const AttributeManager: React.FC = () => {
  const [configs, setConfigs] = useState<AttributeConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  // const [showAddSpeciesForm] = useState<string | null>(null); // For future use
  const [newAttribute, setNewAttribute] = useState<NewAttributeData>({
    category: '',
    label: '',
    input_type: 'select',
    sort_order: 0
  });

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await apiClient.get<{ success: boolean; data: AttributeConfig[] }>('/attribute-config');
      if ((response as { success: boolean; data: AttributeConfig[] }).success) {
        setConfigs(response.data);
      } else {
        setError('Failed to load attribute configurations');
      }
    } catch (err) {
      setError(`Error loading configurations: ${  err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (id: number, updates: Partial<AttributeConfig>): Promise<void> => {
    try {
      const response = await apiClient.put(`/attribute-config/${id}`, updates);
      if ((response as { success: boolean }).success) {
        setConfigs(configs.map(config => 
          config.id === id ? { ...config, ...updates } : config
        ));
        setEditingId(null);
      } else {
        setError('Failed to update configuration');
      }
    } catch (err) {
      setError(`Error updating configuration: ${  err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const toggleActive = async (id: number, currentActive: boolean): Promise<void> => {
    await updateConfig(id, { is_active: !currentActive });
  };

  const updateLabel = async (id: number, newLabel: string): Promise<void> => {
    await updateConfig(id, { label: newLabel });
  };

  const updateInputType = async (id: number, newType: AttributeConfig['input_type']): Promise<void> => {
    await updateConfig(id, { input_type: newType });
  };

  const updateSortOrder = async (id: number, newOrder: number): Promise<void> => {
    await updateConfig(id, { sort_order: newOrder });
  };

  const createAttribute = async (generatorTypes: string[]): Promise<void> => {
    try {
      const promises = generatorTypes.map(generatorType =>
        apiClient.post('/attribute-config', {
          generator_type: generatorType,
          category: newAttribute.category,
          label: newAttribute.label,
          input_type: newAttribute.input_type,
          sort_order: newAttribute.sort_order || 0
        })
      );
      
      const responses = await Promise.all(promises);
      const allSuccess = responses.every(response => (response as { success: boolean }).success);
      
      if (allSuccess) {
        await loadConfigs();
        setShowAddForm(false);
        setNewAttribute({ category: '', label: '', input_type: 'select', sort_order: 0 });
      } else {
        setError('Failed to create some attributes');
      }
    } catch (err) {
      setError(`Error creating attributes: ${  err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleViewSpecies = (category: string): void => {
    // Navigate to species view - this could be implemented as a modal or separate route
    // This should be implemented to show species details
    // For now, just document the intended behavior
    console.log(`Viewing species for category: ${category}`);
  };

  const handleManageOptions = (configId: number): void => {
    // Navigate to options management - this could open a modal or navigate to options page
    window.open(`/attribute-options?config_id=${configId}`, '_blank');
  };

  if (loading) {
    return <LoadingSpinner message="Loading attribute configurations..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-heading font-bold bg-gradient-sunset bg-clip-text text-transparent mb-4">
            ⚙️ Attribute Configuration Manager
          </h1>
          <p className="text-dark-600 text-lg">Define global attributes that can be used across generator types</p>
        </div>
        
        {/* Error display */}
        {error && (
          <ErrorDisplay 
            message={error} 
            onDismiss={() => setError('')} 
          />
        )}

        {/* Instructions */}
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
          <h2 className="font-semibold text-blue-900 mb-2">How to Use:</h2>
          <ul className="text-sm text-blue-800 list-disc list-inside space-y-1">
            <li><strong>Global Attributes:</strong> Define attributes that can be used across all generator types</li>
            <li><strong>Species Assignment:</strong> Enable/disable attributes for specific generator types</li>
            <li><strong>Input Types:</strong> Choose how users will input values (select, text, etc.)</li>
            <li><strong>Manage Values:</strong> Use <a href="/attribute-options" className="text-blue-600 underline">Attribute Options</a> to add option values for select fields</li>
          </ul>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <AttributeForm
            newAttribute={newAttribute}
            onAttributeChange={setNewAttribute}
            onSubmit={createAttribute}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {/* Add New Attribute Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
          >
            ➕ Add Attribute
          </button>
        </div>

        {/* Attributes Table */}
        <AttributeTable
          configs={configs}
          editingId={editingId}
          onToggleActive={toggleActive}
          onUpdateLabel={updateLabel}
          onUpdateInputType={updateInputType}
          onUpdateSortOrder={updateSortOrder}
          onStartEdit={setEditingId}
          onCancelEdit={() => setEditingId(null)}
          onViewSpecies={handleViewSpecies}
          onManageOptions={handleManageOptions}
        />
      </div>
    </div>
  );
};

export default AttributeManager;