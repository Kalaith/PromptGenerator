import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';

interface AttributeCategory {
  category: string;
  label: string;
  input_type: string;
  option_count: number;
}

interface AttributeOption {
  id: number;
  value: string;
  label: string;
  weight: number;
}

const AttributeOptionsManager: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [categories, setCategories] = useState<AttributeCategory[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<Record<string, AttributeOption[]>>({});
  const [loadingOptions, setLoadingOptions] = useState<string | null>(null);
  
  // Form states
  const [showAddForm, setShowAddForm] = useState<string | null>(null);
  const [editingOption, setEditingOption] = useState<number | null>(null);
  const [newOption, setNewOption] = useState({ name: '', value: '', weight: 1 });
  const [editOption, setEditOption] = useState({ name: '', value: '', weight: 1 });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<{ success: boolean; data: { categories: AttributeCategory[] } }>('/attribute-categories');
      
      if ((response as any).success) {
        setCategories((response as any).data.categories);
      } else {
        setError('Failed to load attribute categories');
      }
    } catch (err) {
      setError('Error loading categories: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const loadCategoryOptions = async (category: string, forceReload = false) => {
    if (categoryOptions[category] && !forceReload) {
      return; // Already loaded
    }

    try {
      setLoadingOptions(category);
      const response = await apiClient.get<{ success: boolean; data: { options: AttributeOption[] } }>(`/attribute-categories/${category}/options`);
      
      if ((response as any).success) {
        setCategoryOptions(prev => ({
          ...prev,
          [category]: (response as any).data.options
        }));
      } else {
        setError(`Failed to load options for ${category}`);
      }
    } catch (err) {
      setError(`Error loading options for ${category}: ` + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoadingOptions(null);
    }
  };

  const toggleCategory = async (category: string) => {
    if (expandedCategory === category) {
      setExpandedCategory(null);
      setShowAddForm(null);
      setEditingOption(null);
    } else {
      setExpandedCategory(category);
      await loadCategoryOptions(category);
    }
  };

  const createOption = async (category: string) => {
    if (!newOption.name.trim()) {
      setError('Option name is required');
      return;
    }

    try {
      const response = await apiClient.post(`/attribute-categories/${category}/options`, {
        name: newOption.name.trim(),
        value: newOption.value.trim() || newOption.name.trim(),
        weight: newOption.weight
      });

      if ((response as any).success) {
        await loadCategoryOptions(category, true);
        await loadCategories(); // Update counts
        setNewOption({ name: '', value: '', weight: 1 });
        setShowAddForm(null);
      } else {
        setError(`Failed to create option: ${(response as any).error}`);
      }
    } catch (err) {
      setError('Error creating option: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const updateOption = async (id: number, category: string) => {
    if (!editOption.name.trim()) {
      setError('Option name is required');
      return;
    }

    try {
      const response = await apiClient.put(`/attribute-options/${id}`, {
        name: editOption.name.trim(),
        value: editOption.value.trim() || editOption.name.trim(),
        weight: editOption.weight
      });

      if ((response as any).success) {
        await loadCategoryOptions(category, true);
        await loadCategories(); // Update counts
        setEditingOption(null);
        setEditOption({ name: '', value: '', weight: 1 });
      } else {
        setError(`Failed to update option: ${(response as any).error}`);
      }
    } catch (err) {
      setError('Error updating option: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const deleteOption = async (id: number, category: string, optionName: string) => {
    if (!confirm(`Are you sure you want to delete "${optionName}"?`)) {
      return;
    }

    try {
      const response = await apiClient.delete(`/attribute-options/${id}`);

      if ((response as any).success) {
        await loadCategoryOptions(category, true);
        await loadCategories(); // Update counts
      } else {
        setError(`Failed to delete option: ${(response as any).error}`);
      }
    } catch (err) {
      setError('Error deleting option: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const startEditing = (option: AttributeOption) => {
    setEditingOption(option.id);
    setEditOption({
      name: option.label,
      value: option.value,
      weight: option.weight
    });
  };

  const cancelEditing = () => {
    setEditingOption(null);
    setEditOption({ name: '', value: '', weight: 1 });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-8 text-center">
            <div className="animate-spin h-12 w-12 border-4 border-sakura-200 border-t-sakura-500 rounded-full mx-auto mb-4"></div>
            <p className="text-dark-600 font-medium">Loading attribute categories...</p>
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
            🎯 Attribute Options Manager
          </h1>
          <p className="text-dark-600 text-lg">Manage option values for select attributes</p>
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

        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded">
          <h2 className="font-semibold text-green-900 mb-2">✅ Full CRUD Management</h2>
          <div className="text-sm text-green-800 space-y-1">
            <p><strong>✅ View:</strong> Click any category to see its options</p>
            <p><strong>✅ Create:</strong> Add new options with name, value, and weight</p>
            <p><strong>✅ Edit:</strong> Click the edit button to modify existing options</p>
            <p><strong>✅ Delete:</strong> Click the delete button to remove options</p>
          </div>
        </div>

        {/* Categories List */}
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.category} className="bg-white rounded-lg border shadow-sm">
              <div 
                className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                onClick={() => toggleCategory(category.category)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {expandedCategory === category.category ? '📖' : '📋'}
                      </span>
                      <h3 className="font-semibold text-lg text-gray-900">{category.label}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {category.input_type}
                      </span>
                      <span className="text-sm text-gray-500 font-mono">
                        {category.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-700">{category.option_count}</div>
                      <div className="text-xs text-gray-500">options</div>
                    </div>
                    <div className="text-gray-400">
                      {expandedCategory === category.category ? '▼' : '▶'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Options */}
              {expandedCategory === category.category && (
                <div className="border-t bg-gray-50">
                  {loadingOptions === category.category ? (
                    <div className="p-6 text-center">
                      <div className="animate-spin h-6 w-6 border-2 border-blue-200 border-t-blue-500 rounded-full mx-auto mb-2"></div>
                      <p className="text-gray-600 text-sm">Loading options...</p>
                    </div>
                  ) : categoryOptions[category.category] ? (
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-gray-700">Available Options:</h4>
                        <button
                          onClick={() => setShowAddForm(showAddForm === category.category ? null : category.category)}
                          className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 text-sm flex items-center gap-2"
                        >
                          ➕ Add Option
                        </button>
                      </div>

                      {/* Add New Option Form */}
                      {showAddForm === category.category && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <h5 className="font-medium text-green-900 mb-3">Add New Option</h5>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Name *</label>
                              <input
                                type="text"
                                value={newOption.name}
                                onChange={(e) => setNewOption(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Red Hair"
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Value</label>
                              <input
                                type="text"
                                value={newOption.value}
                                onChange={(e) => setNewOption(prev => ({ ...prev, value: e.target.value }))}
                                placeholder="red_hair (optional)"
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Weight</label>
                              <input
                                type="number"
                                value={newOption.weight}
                                onChange={(e) => setNewOption(prev => ({ ...prev, weight: parseInt(e.target.value) || 1 }))}
                                min="1"
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                              />
                            </div>
                            <div className="flex items-end gap-2">
                              <button
                                onClick={() => createOption(category.category)}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm flex-1"
                              >
                                Create
                              </button>
                              <button
                                onClick={() => setShowAddForm(null)}
                                className="bg-gray-400 text-white px-3 py-2 rounded hover:bg-gray-500 text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {categoryOptions[category.category].length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {categoryOptions[category.category]
                            .sort((a, b) => (b.weight || 1) - (a.weight || 1) || a.label.localeCompare(b.label))
                            .map((option) => (
                            <div key={option.id} className="bg-white border rounded p-3 hover:shadow-sm transition-shadow">
                              {editingOption === option.id ? (
                                /* Edit Form */
                                <div className="space-y-2">
                                  <input
                                    type="text"
                                    value={editOption.name}
                                    onChange={(e) => setEditOption(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Option name"
                                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                  />
                                  <input
                                    type="text"
                                    value={editOption.value}
                                    onChange={(e) => setEditOption(prev => ({ ...prev, value: e.target.value }))}
                                    placeholder="Option value"
                                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                  />
                                  <input
                                    type="number"
                                    value={editOption.weight}
                                    onChange={(e) => setEditOption(prev => ({ ...prev, weight: parseInt(e.target.value) || 1 }))}
                                    min="1"
                                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                  />
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => updateOption(option.id, category.category)}
                                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 flex-1"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={cancelEditing}
                                      className="bg-gray-400 text-white px-2 py-1 rounded text-xs hover:bg-gray-500 flex-1"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                /* Display Mode */
                                <div>
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-sm truncate">{option.label}</div>
                                      {option.label !== option.value && (
                                        <div className="text-xs text-gray-500 font-mono mt-1">
                                          Value: {option.value}
                                        </div>
                                      )}
                                      {option.weight && option.weight !== 1 && (
                                        <div className="text-xs text-blue-600 mt-1">
                                          Weight: {option.weight}
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1 ml-2">
                                      <div className="w-2 h-2 bg-green-400 rounded-full" title="Active option"></div>
                                      <span className="text-xs text-gray-400">#{option.id}</span>
                                    </div>
                                  </div>
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => startEditing(option)}
                                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 flex-1"
                                    >
                                      ✏️ Edit
                                    </button>
                                    <button
                                      onClick={() => deleteOption(option.id, category.category, option.label)}
                                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 flex-1"
                                    >
                                      🗑️ Delete
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="text-4xl mb-2">📭</div>
                          <div className="text-gray-500">No options found</div>
                          <div className="text-xs text-gray-400 mt-1">Click "Add Option" to create some!</div>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {categories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Select Attributes Found</h3>
            <p className="text-gray-500 mb-4">
              Create some select or multi-select attributes in the <a href="/attribute-manager" className="text-blue-600 underline">Attribute Manager</a> first.
            </p>
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
                onClick={loadCategories}
                className="bg-gradient-ocean text-white px-6 py-3 rounded-xl font-semibold
                         shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300
                         flex items-center gap-2"
              >
                <span>🔄</span> Refresh Data
              </button>
            </div>
            <div className="bg-gradient-sunset bg-clip-text text-transparent font-bold text-lg">
              Total Categories: {categories.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttributeOptionsManager;