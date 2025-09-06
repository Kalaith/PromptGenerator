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

interface AttributeOption {
  label: string;
  value: string;
}

const AttributeManager: React.FC = () => {
  const [configs, setConfigs] = useState<AttributeConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState<string | null>(null); // stores generator type
  const [newAttribute, setNewAttribute] = useState({
    category: '',
    label: '',
    input_type: 'select' as AttributeConfig['input_type'],
    sort_order: 0
  });

  // State for managing attribute options
  const [attributeOptions, setAttributeOptions] = useState<Record<string, Record<string, AttributeOption[]>>>({});
  const [editingOptions, setEditingOptions] = useState<string | null>(null); // stores "generatorType:category"
  const [newOptionValue, setNewOptionValue] = useState('');
  const [newOptionLabel, setNewOptionLabel] = useState('');

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<{ success: boolean; data: AttributeConfig[] }>('/attribute-config');
      if ((response as any).success) {
        setConfigs(response.data);
        // Load attribute options for all active configs
        await loadAttributeOptions(response.data);
      } else {
        setError('Failed to load attribute configurations');
      }
    } catch (err) {
      setError('Error loading configurations: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const loadAttributeOptions = async (configsData: AttributeConfig[]) => {
    try {
      // Get unique generator types from active configs
      const generatorTypes = [...new Set(configsData.filter(c => c.is_active).map(c => c.generator_type))];
      
      const optionsMap: Record<string, Record<string, AttributeOption[]>> = {};
      
      for (const generatorType of generatorTypes) {
        try {
          const response = await apiClient.get(`/generator-attributes/${generatorType}`);
          if (response && (response as any).data && (response as any).data.attributes) {
            optionsMap[generatorType] = (response as any).data.attributes;
          }
        } catch (err) {
          console.warn(`Failed to load options for ${generatorType}:`, err);
        }
      }
      
      setAttributeOptions(optionsMap);
    } catch (err) {
      console.error('Error loading attribute options:', err);
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

  const createAttribute = async (generatorType: string) => {
    try {
      const response = await apiClient.post('/attribute-config', {
        generator_type: generatorType,
        category: newAttribute.category,
        label: newAttribute.label,
        input_type: newAttribute.input_type,
        sort_order: newAttribute.sort_order || Math.max(...configs.filter(c => c.generator_type === generatorType).map(c => c.sort_order)) + 10
      });
      
      if ((response as any).success) {
        await loadConfigs(); // Reload to get the new attribute
        setShowAddForm(null);
        setNewAttribute({ category: '', label: '', input_type: 'select', sort_order: 0 });
      } else {
        setError('Failed to create attribute');
      }
    } catch (err) {
      setError('Error creating attribute: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const deleteAttribute = async (id: number, attributeLabel: string) => {
    if (!confirm(`Are you sure you want to delete the "${attributeLabel}" attribute? This cannot be undone.`)) {
      return;
    }

    try {
      const response = await apiClient.delete(`/attribute-config/${id}`);
      if ((response as any).success) {
        setConfigs(configs.filter(config => config.id !== id));
      } else {
        setError('Failed to delete attribute');
      }
    } catch (err) {
      setError('Error deleting attribute: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  // Functions for managing attribute options
  const addAttributeOption = async (generatorType: string, category: string) => {
    if (!newOptionValue.trim()) {
      setError('Option value is required');
      return;
    }

    try {
      const response = await apiClient.post(`/generator-attributes/${generatorType}/${category}/options`, {
        value: newOptionValue.trim(),
        label: newOptionLabel.trim() || newOptionValue.trim()
      });

      if ((response as any).success) {
        // Reload options for this generator type
        const updatedOptionsResponse = await apiClient.get(`/generator-attributes/${generatorType}`);
        if (updatedOptionsResponse && (updatedOptionsResponse as any).data && (updatedOptionsResponse as any).data.attributes) {
          setAttributeOptions(prev => ({
            ...prev,
            [generatorType]: (updatedOptionsResponse as any).data.attributes
          }));
        }
        
        setNewOptionValue('');
        setNewOptionLabel('');
      } else {
        setError('Failed to add attribute option');
      }
    } catch (err) {
      setError('Error adding attribute option: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const deleteAttributeOption = async (generatorType: string, category: string, value: string) => {
    if (!confirm(`Are you sure you want to delete the option "${value}" from ${category}?`)) {
      return;
    }

    try {
      const response = await apiClient.delete(`/generator-attributes/${generatorType}/${category}/options/${encodeURIComponent(value)}`);
      
      if ((response as any).success) {
        // Update local state
        setAttributeOptions(prev => ({
          ...prev,
          [generatorType]: {
            ...prev[generatorType],
            [category]: {
              ...prev[generatorType][category],
              options: prev[generatorType][category]?.options?.filter(opt => opt.value !== value) || []
            }
          }
        }));
      } else {
        setError('Failed to delete attribute option');
      }
    } catch (err) {
      setError('Error deleting attribute option: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  // Get available generator types from the unified config
  const availableGeneratorTypes = getGeneratorTypes(true); // include inactive types

  const groupedConfigs = configs.reduce((groups, config) => {
    const type = config.generator_type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(config);
    return groups;
  }, {} as Record<string, AttributeConfig[]>);

  // Ensure all generator types have entries, even if empty
  availableGeneratorTypes.forEach(generatorType => {
    if (!groupedConfigs[generatorType.apiType]) {
      groupedConfigs[generatorType.apiType] = [];
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
          <p className="text-dark-600 text-lg">Customize generator attributes and options</p>
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
          <li><strong>Toggle Active:</strong> Enable/disable attributes for each generator</li>
          <li><strong>Edit Labels:</strong> Click on a label to rename it</li>
          <li><strong>Change Input Type:</strong> Select dropdown, multi-select, text, etc.</li>
          <li><strong>Sort Order:</strong> Lower numbers appear first in the interface</li>
        </ul>
      </div>

      {Object.entries(groupedConfigs).map(([generatorType, typeConfigs]) => {
        // Find the generator type config for display info
        const generatorTypeConfig = availableGeneratorTypes.find(gt => gt.apiType === generatorType);
        const displayName = generatorTypeConfig ? generatorTypeConfig.name : generatorType;
        const displayIcon = generatorTypeConfig ? generatorTypeConfig.icon : '🔧';
        const isActive = generatorTypeConfig ? generatorTypeConfig.isActive : false;
        
        return (
        <div key={generatorType} className={`mb-8 ${!isActive ? 'opacity-60' : ''}`}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{displayIcon}</span>
              <div>
                <h2 className={`text-2xl font-semibold p-3 rounded border ${
                  isActive 
                    ? 'bg-blue-100 text-blue-900 border-blue-200' 
                    : 'bg-gray-100 text-gray-600 border-gray-200'
                }`}>
                  {displayName} Generator Attributes ({typeConfigs.length})
                </h2>
                {!isActive && (
                  <p className="text-sm text-gray-500 mt-1">
                    ⚠️ This generator type is inactive. Enable it in Generator Type Manager to use these attributes.
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  API Type: <code className="bg-gray-100 px-1 rounded">{generatorType}</code>
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(generatorType)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
            >
              ➕ Add Attribute
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Active</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Label</th>
                  <th className="px-4 py-2 text-left">Input Type</th>
                  <th className="px-4 py-2 text-left">Sort Order</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {typeConfigs
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((config) => (
                  <tr key={config.id} className={`border-t ${!config.is_active ? 'bg-gray-50 opacity-60' : ''}`}>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => toggleActive(config.id, config.is_active)}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          config.is_active 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {config.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-2 font-mono text-sm text-gray-600">
                      {config.category}
                    </td>
                    <td className="px-4 py-2">
                      {editingId === config.id ? (
                        <input
                          type="text"
                          defaultValue={config.label}
                          onBlur={(e) => updateLabel(config.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              updateLabel(config.id, (e.target as HTMLInputElement).value);
                            } else if (e.key === 'Escape') {
                              setEditingId(null);
                            }
                          }}
                          className="border border-gray-300 rounded px-2 py-1 w-full"
                          autoFocus
                        />
                      ) : (
                        <button
                          onClick={() => setEditingId(config.id)}
                          className="text-left hover:bg-gray-100 px-2 py-1 rounded w-full"
                        >
                          {config.label}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={config.input_type}
                        onChange={(e) => updateInputType(config.id, e.target.value as AttributeConfig['input_type'])}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      >
                        <option value="select">Select</option>
                        <option value="multi-select">Multi-Select</option>
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="checkbox">Checkbox</option>
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={config.sort_order}
                        onChange={(e) => updateSortOrder(config.id, parseInt(e.target.value) || 0)}
                        className="border border-gray-300 rounded px-2 py-1 w-20 text-sm"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-gray-500">
                          ID: {config.id}
                        </div>
                        {config.is_active && config.input_type === 'select' && (
                          <button
                            onClick={() => setEditingOptions(`${generatorType}:${config.category}`)}
                            className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 flex items-center gap-1"
                            title="Manage options for this attribute"
                          >
                            ⚙️ Options
                          </button>
                        )}
                        <button
                          onClick={() => deleteAttribute(config.id, config.label)}
                          className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 flex items-center gap-1"
                          title="Delete this attribute"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Attribute Form */}
          {showAddForm === generatorType && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span>{displayIcon}</span>
                Add New Attribute to {displayName} Generator
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category *</label>
                  <input
                    type="text"
                    value={newAttribute.category}
                    onChange={(e) => setNewAttribute(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., hair_colors"
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                  <div className="text-xs text-gray-500 mt-1">Internal name (use underscores)</div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Display Label *</label>
                  <input
                    type="text"
                    value={newAttribute.label}
                    onChange={(e) => setNewAttribute(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="e.g., Hair Color"
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                  <div className="text-xs text-gray-500 mt-1">User-friendly name</div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Input Type</label>
                  <select
                    value={newAttribute.input_type}
                    onChange={(e) => setNewAttribute(prev => ({ ...prev, input_type: e.target.value as AttributeConfig['input_type'] }))}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value="select">Select</option>
                    <option value="multi-select">Multi-Select</option>
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="checkbox">Checkbox</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={newAttribute.sort_order}
                    onChange={(e) => setNewAttribute(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                  <div className="text-xs text-gray-500 mt-1">0 = auto-assign</div>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => createAttribute(generatorType)}
                  disabled={!newAttribute.category || !newAttribute.label}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  ✅ Create Attribute
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(null);
                    setNewAttribute({ category: '', label: '', input_type: 'select', sort_order: 0 });
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          )}

          {/* Attribute Options Management */}
          {editingOptions === `${generatorType}:${editingOptions?.split(':')[1]}` && editingOptions.startsWith(`${generatorType}:`) && (
            <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <span>🎯</span>
                  Manage Options for "{editingOptions.split(':')[1]}"
                </h3>
                <button
                  onClick={() => setEditingOptions(null)}
                  className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Current Options */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 text-gray-700">Current Options:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {(attributeOptions[generatorType]?.[editingOptions.split(':')[1]]?.options || []).map((option, index) => (
                    <div key={`${option.value}-${index}`} className="flex items-center justify-between bg-white border rounded p-2">
                      <div className="flex-1">
                        <span className="font-medium text-sm">{option.label || option.value}</span>
                        {option.label && option.label !== option.value && (
                          <div className="text-xs text-gray-500">Value: {option.value}</div>
                        )}
                      </div>
                      <button
                        onClick={() => deleteAttributeOption(generatorType, editingOptions.split(':')[1], option.value)}
                        className="text-red-600 hover:text-red-800 ml-2 text-sm"
                        title="Delete this option"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
                {(attributeOptions[generatorType]?.[editingOptions.split(':')[1]]?.options || []).length === 0 && (
                  <div className="text-gray-500 italic text-sm">No options defined yet. Add some below!</div>
                )}
              </div>

              {/* Add New Option */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3 text-gray-700">Add New Option:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium mb-1">Value *</label>
                    <input
                      type="text"
                      value={newOptionValue}
                      onChange={(e) => setNewOptionValue(e.target.value)}
                      placeholder="e.g., large_floppy_ears"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                    <div className="text-xs text-gray-500 mt-1">Internal value (use underscores)</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Display Label</label>
                    <input
                      type="text"
                      value={newOptionLabel}
                      onChange={(e) => setNewOptionLabel(e.target.value)}
                      placeholder="e.g., Large Floppy Ears"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                    <div className="text-xs text-gray-500 mt-1">User-friendly name (optional)</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => addAttributeOption(generatorType, editingOptions.split(':')[1])}
                      disabled={!newOptionValue.trim()}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm flex items-center gap-2"
                    >
                      ➕ Add Option
                    </button>
                    <button
                      onClick={() => {
                        setNewOptionValue('');
                        setNewOptionLabel('');
                      }}
                      className="bg-gray-400 text-white px-3 py-2 rounded hover:bg-gray-500 text-sm"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )
      })}
      
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
              Total Configurations: {configs.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttributeManager;