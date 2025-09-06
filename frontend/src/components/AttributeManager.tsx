import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { getGeneratorTypes } from '../config/generatorTypes';

interface AttributeConfig {
  id: number;
  generator_type: string;
  category: string;
  label: string;
  input_type: 'select' | 'multi-select' | 'text' | 'number' | 'checkbox';
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

const AttributeManager: React.FC = () => {
  const [configs, setConfigs] = useState<AttributeConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showAddSpeciesForm, setShowAddSpeciesForm] = useState<string | null>(null);
  const [newAttribute, setNewAttribute] = useState({
    category: '',
    label: '',
    input_type: 'select' as AttributeConfig['input_type'],
    sort_order: 0
  });

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<{ success: boolean; data: AttributeConfig[] }>('/attribute-config');
      if ((response as any).success) {
        setConfigs(response.data);
      } else {
        setError('Failed to load attribute configurations');
      }
    } catch (err) {
      setError('Error loading configurations: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (id: number, updates: Partial<AttributeConfig>) => {
    try {
      const response = await apiClient.put(`/attribute-config/${id}`, updates);
      if ((response as any).success) {
        setConfigs(configs.map(config => 
          config.id === id ? { ...config, ...updates } : config
        ));
        setEditingId(null);
      } else {
        setError('Failed to update configuration');
      }
    } catch (err) {
      setError('Error updating configuration: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const toggleActive = async (id: number, currentActive: boolean) => {
    await updateConfig(id, { is_active: !currentActive });
  };

  const updateLabel = async (id: number, newLabel: string) => {
    await updateConfig(id, { label: newLabel });
  };

  const updateInputType = async (id: number, newType: AttributeConfig['input_type']) => {
    await updateConfig(id, { input_type: newType });
  };

  const updateSortOrder = async (id: number, newOrder: number) => {
    await updateConfig(id, { sort_order: newOrder });
  };

  const createAttribute = async (generatorTypes: string[]) => {
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
      const allSuccess = responses.every(response => (response as any).success);
      
      if (allSuccess) {
        await loadConfigs();
        setShowAddForm(false);
        setNewAttribute({ category: '', label: '', input_type: 'select', sort_order: 0 });
      } else {
        setError('Failed to create some attributes');
      }
    } catch (err) {
      setError('Error creating attributes: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const addSpeciesToAttribute = async (category: string, generatorTypes: string[]) => {
    try {
      const existingCategory = configs.find(c => c.category === category);
      if (!existingCategory) {
        setError('Category not found');
        return;
      }

      const promises = generatorTypes.map(generatorType =>
        apiClient.post('/attribute-config', {
          generator_type: generatorType,
          category: existingCategory.category,
          label: existingCategory.label,
          input_type: existingCategory.input_type,
          sort_order: existingCategory.sort_order
        })
      );
      
      const responses = await Promise.all(promises);
      const allSuccess = responses.every(response => (response as any).success);
      
      if (allSuccess) {
        await loadConfigs();
        setShowAddSpeciesForm(null);
      } else {
        setError('Failed to add some species assignments');
      }
    } catch (err) {
      setError('Error adding species: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const removeSpeciesFromAttribute = async (configId: number, speciesName: string, category: string) => {
    if (!confirm(`Are you sure you want to remove "${speciesName}" from the "${category}" attribute? This cannot be undone.`)) {
      return;
    }

    try {
      const response = await apiClient.delete(`/attribute-config/${configId}`);
      if ((response as any).success) {
        setConfigs(configs.filter(config => config.id !== configId));
      } else {
        setError('Failed to remove species from attribute');
      }
    } catch (err) {
      setError('Error removing species: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const deleteAttribute = async (category: string) => {
    if (!confirm(`Are you sure you want to delete the "${category}" attribute from all species? This cannot be undone.`)) {
      return;
    }

    try {
      const categoryConfigs = configs.filter(c => c.category === category);
      const promises = categoryConfigs.map(config =>
        apiClient.delete(`/attribute-config/${config.id}`)
      );
      
      const responses = await Promise.all(promises);
      const allSuccess = responses.every(response => (response as any).success);
      
      if (allSuccess) {
        setConfigs(configs.filter(config => config.category !== category));
      } else {
        setError('Failed to delete some attribute instances');
      }
    } catch (err) {
      setError('Error deleting attribute: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const availableGeneratorTypes = getGeneratorTypes(true);

  // Group configs by category for display
  const attributeGroups = configs.reduce((groups, config) => {
    if (!groups[config.category]) {
      groups[config.category] = [];
    }
    groups[config.category].push(config);
    return groups;
  }, {} as Record<string, AttributeConfig[]>);

  // Sort each group by ID for consistent ordering
  Object.keys(attributeGroups).forEach(category => {
    if (attributeGroups[category]) {
      attributeGroups[category].sort((a, b) => a.id - b.id);
    }
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-8 text-center">
            <div className="animate-spin h-12 w-12 border-4 border-sakura-200 border-t-sakura-500 rounded-full mx-auto mb-4"></div>
            <p className="text-dark-600 font-medium">Loading attribute configurations...</p>
          </div>
        </div>
      </div>
    );
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
          <div className="p-4 bg-danger-50 border border-danger-200 text-danger-700 rounded-xl flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <span className="font-medium">{error}</span>
            </div>
            <button 
              onClick={() => setError('')}
              className="text-danger-600 hover:text-danger-800 text-xl font-bold"
            >
              ×
            </button>
          </div>
        )}

        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
          <h2 className="font-semibold text-blue-900 mb-2">How to Use:</h2>
          <ul className="text-sm text-blue-800 list-disc list-inside space-y-1">
            <li><strong>Global Attributes:</strong> Define attributes that can be used across all generator types</li>
            <li><strong>Species Assignment:</strong> Enable/disable attributes for specific generator types</li>
            <li><strong>Input Types:</strong> Choose how users will input values (select, text, etc.)</li>
            <li><strong>Manage Values:</strong> Use <a href="/attribute-options" className="text-blue-600 underline">Attribute Options</a> to add option values for select fields</li>
          </ul>
        </div>

        {/* All Attributes Table */}
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">All Attributes ({Object.keys(attributeGroups).length})</h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
            >
              ➕ Add Attribute
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attribute</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Input Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Used By Species</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sort Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(attributeGroups).map(([category, categoryConfigs]) => {
                  if (!categoryConfigs || categoryConfigs.length === 0) return null;
                  
                  const uniqueAttribute = categoryConfigs[0]; // All should have same core info
                  // Use the most common sort order, or the first one if they're all different
                  const sortOrders = categoryConfigs.map(c => c.sort_order);
                  const mostCommonSortOrder = sortOrders.reduce((a, b, i, arr) => 
                    arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
                  );
                  
                  const usedBySpecies = categoryConfigs.map(config => {
                    const generatorTypeConfig = availableGeneratorTypes.find(gt => gt.apiType === config.generator_type);
                    return {
                      ...config,
                      displayName: generatorTypeConfig?.name || config.generator_type,
                      icon: generatorTypeConfig?.icon || '🔧',
                      isTypeActive: generatorTypeConfig?.isActive || false
                    };
                  });
                  
                  return (
                    <tr key={category} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          {editingId === uniqueAttribute.id ? (
                            <input
                              type="text"
                              defaultValue={uniqueAttribute.label}
                              onBlur={(e) => {
                                const newLabel = e.target.value;
                                categoryConfigs.forEach(config => {
                                  updateLabel(config.id, newLabel);
                                });
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const newLabel = (e.target as HTMLInputElement).value;
                                  categoryConfigs.forEach(config => {
                                    updateLabel(config.id, newLabel);
                                  });
                                } else if (e.key === 'Escape') {
                                  setEditingId(null);
                                }
                              }}
                              className="border border-gray-300 rounded px-2 py-1 w-full font-semibold"
                              autoFocus
                            />
                          ) : (
                            <button
                              onClick={() => setEditingId(uniqueAttribute.id)}
                              className="text-left hover:text-blue-600 font-semibold text-gray-900"
                            >
                              {uniqueAttribute.label}
                            </button>
                          )}
                          <div className="text-sm text-gray-500 font-mono">{category}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={uniqueAttribute.input_type}
                          onChange={(e) => {
                            const newType = e.target.value as AttributeConfig['input_type'];
                            categoryConfigs.forEach(config => {
                              updateInputType(config.id, newType);
                            });
                          }}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                          <option value="select">Select</option>
                          <option value="multi-select">Multi-Select</option>
                          <option value="text">Text</option>
                          <option value="number">Number</option>
                          <option value="checkbox">Checkbox</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {usedBySpecies.map((speciesConfig) => (
                            <div key={speciesConfig.id} className="inline-flex items-center gap-1 bg-white rounded-lg border">
                              <button
                                onClick={() => toggleActive(speciesConfig.id, speciesConfig.is_active)}
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-l-lg text-xs font-medium ${
                                  speciesConfig.is_active
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                } ${!speciesConfig.isTypeActive ? 'opacity-50' : ''}`}
                                title={`${speciesConfig.is_active ? 'Disable' : 'Enable'} for ${speciesConfig.displayName}`}
                              >
                                <span>{speciesConfig.icon}</span>
                                <span>{speciesConfig.displayName}</span>
                                {speciesConfig.is_active ? '✓' : '✗'}
                              </button>
                              {usedBySpecies.length > 1 && (
                                <button
                                  onClick={() => removeSpeciesFromAttribute(speciesConfig.id, speciesConfig.displayName, category)}
                                  className="px-1 py-1 text-red-600 hover:bg-red-100 rounded-r-lg text-xs"
                                  title={`Remove ${speciesConfig.displayName} from this attribute`}
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={mostCommonSortOrder}
                          onChange={(e) => {
                            const newOrder = parseInt(e.target.value) || 0;
                            categoryConfigs.forEach(config => {
                              updateSortOrder(config.id, newOrder);
                            });
                          }}
                          className="border border-gray-300 rounded px-2 py-1 w-16 text-sm"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          {(uniqueAttribute.input_type === 'select' || uniqueAttribute.input_type === 'multi-select') && (
                            <a
                              href="/attribute-options"
                              className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                              title="Manage options"
                            >
                              🎯 Options
                            </a>
                          )}
                          <button
                            onClick={() => setShowAddSpeciesForm(category)}
                            className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                            title="Add more species to this attribute"
                          >
                            ➕ Add Species
                          </button>
                          <button
                            onClick={() => deleteAttribute(category)}
                            className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                            title="Delete attribute from all species"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Species to Existing Attribute Form */}
        {showAddSpeciesForm && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold mb-4 text-lg">Add Species to "{showAddSpeciesForm}" Attribute</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Select Species to Add:</label>
              <div className="flex flex-wrap gap-2">
                {availableGeneratorTypes
                  .filter(generatorType => {
                    // Only show species that don't already have this attribute
                    const existingForCategory = configs.filter(c => c.category === showAddSpeciesForm);
                    return !existingForCategory.some(config => config.generator_type === generatorType.apiType);
                  })
                  .map(generatorType => (
                    <label key={generatorType.apiType} className="flex items-center gap-2 bg-white rounded px-3 py-2 border">
                      <input
                        type="checkbox"
                        className="rounded"
                        data-generator-type={generatorType.apiType}
                      />
                      <span>{generatorType.icon}</span>
                      <span>{generatorType.name}</span>
                    </label>
                  ))}
              </div>
              {availableGeneratorTypes.filter(generatorType => {
                const existingForCategory = configs.filter(c => c.category === showAddSpeciesForm);
                return !existingForCategory.some(config => config.generator_type === generatorType.apiType);
              }).length === 0 && (
                <p className="text-gray-500 italic mt-2">All available species already have this attribute assigned.</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  const checkboxes = document.querySelectorAll('[data-generator-type]') as NodeListOf<HTMLInputElement>;
                  const selectedTypes = Array.from(checkboxes)
                    .filter(cb => cb.checked)
                    .map(cb => cb.dataset.generatorType!);
                  
                  if (selectedTypes.length > 0) {
                    addSpeciesToAttribute(showAddSpeciesForm, selectedTypes);
                  }
                }}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                ✅ Add Selected Species
              </button>
              <button
                onClick={() => setShowAddSpeciesForm(null)}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        )}

        {/* Add Attribute Form */}
        {showAddForm && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold mb-4 text-lg">Add New Global Attribute</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category *</label>
                <input
                  type="text"
                  value={newAttribute.category}
                  onChange={(e) => setNewAttribute(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="hair_color"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <div className="text-xs text-gray-500 mt-1">Internal name (use underscores)</div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Display Label *</label>
                <input
                  type="text"
                  value={newAttribute.label}
                  onChange={(e) => setNewAttribute(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="Hair Color"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <div className="text-xs text-gray-500 mt-1">User-friendly name</div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Input Type</label>
                <select
                  value={newAttribute.input_type}
                  onChange={(e) => setNewAttribute(prev => ({ ...prev, input_type: e.target.value as AttributeConfig['input_type'] }))}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="select">Select</option>
                  <option value="multi-select">Multi-Select</option>
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="checkbox">Checkbox</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Add to Species:</label>
              <div className="flex flex-wrap gap-2">
                {availableGeneratorTypes.map(generatorType => (
                  <label key={generatorType.apiType} className="flex items-center gap-2 bg-white rounded px-3 py-2 border">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded"
                      data-generator-type={generatorType.apiType}
                    />
                    <span>{generatorType.icon}</span>
                    <span>{generatorType.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  const checkboxes = document.querySelectorAll('[data-generator-type]') as NodeListOf<HTMLInputElement>;
                  const selectedTypes = Array.from(checkboxes)
                    .filter(cb => cb.checked)
                    .map(cb => cb.dataset.generatorType!);
                  
                  createAttribute(selectedTypes);
                }}
                disabled={!newAttribute.category || !newAttribute.label}
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
              >
                ✅ Create Attribute
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewAttribute({ category: '', label: '', input_type: 'select', sort_order: 0 });
                }}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <h3 className="font-semibold text-dark-700 flex items-center gap-2">
                <span>⚡</span> Quick Actions
              </h3>
              <button
                onClick={loadConfigs}
                className="bg-gradient-ocean text-white px-6 py-3 rounded-xl font-semibold
                         shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300
                         flex items-center gap-2"
              >
                <span>🔄</span> Refresh Data
              </button>
            </div>
            <div className="bg-gradient-sunset bg-clip-text text-transparent font-bold text-lg">
              Total Attributes: {Object.keys(attributeGroups).length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttributeManager;