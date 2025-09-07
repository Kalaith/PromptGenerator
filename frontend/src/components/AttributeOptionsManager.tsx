import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { AttributeCategory, AttributeOption, NewOptionData, EditOptionData } from './attribute-options/types';
import { CategoryList } from './attribute-options/CategoryList';
import { OptionsTable } from './attribute-options/OptionsTable';
import { AddOptionForm } from './attribute-options/AddOptionForm';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { ErrorDisplay } from './ui/ErrorDisplay';

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
  const [newOption, setNewOption] = useState<NewOptionData>({ name: '', value: '', weight: 1 });
  const [editOption, setEditOption] = useState<EditOptionData>({ name: '', value: '', weight: 1 });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await apiClient.get<{ success: boolean; data: { categories: AttributeCategory[] } }>('/attribute-categories');
      
      if ((response as { success: boolean; data: { categories: AttributeCategory[] } }).success) {
        setCategories((response as { success: boolean; data: { categories: AttributeCategory[] } }).data.categories);
      } else {
        setError('Failed to load attribute categories');
      }
    } catch (err) {
      setError(`Error loading categories: ${  err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const loadCategoryOptions = async (category: string): Promise<void> => {
    try {
      setLoadingOptions(category);
      const response = await apiClient.get<{ success: boolean; data: { options: AttributeOption[] } }>(`/attribute-options/${category}`);
      
      if ((response as { success: boolean; data: { options: AttributeOption[] } }).success) {
        setCategoryOptions(prev => ({
          ...prev,
          [category]: (response as { success: boolean; data: { options: AttributeOption[] } }).data.options
        }));
      }
    } catch (err) {
      setError(`Error loading options: ${  err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoadingOptions(null);
    }
  };

  const handleExpandCategory = async (category: string | null): Promise<void> => {
    setExpandedCategory(category);
    if (category && !categoryOptions[category]) {
      await loadCategoryOptions(category);
    }
  };

  const handleAddOption = async (category: string): Promise<void> => {
    try {
      const response = await apiClient.post('/attribute-options', {
        category,
        value: newOption.value,
        label: newOption.name,
        weight: newOption.weight
      });
      
      if ((response as { success: boolean }).success) {
        // Reload options for this category
        await loadCategoryOptions(category);
        // Reset form
        setNewOption({ name: '', value: '', weight: 1 });
        setShowAddForm(null);
        // Update category count
        await loadCategories();
      } else {
        setError('Failed to add option');
      }
    } catch (err) {
      setError(`Error adding option: ${  err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleEditOption = (option: AttributeOption): void => {
    setEditingOption(option.id);
    setEditOption({
      name: option.label,
      value: option.value,
      weight: option.weight
    });
  };

  const handleSaveEdit = async (optionId: number): Promise<void> => {
    try {
      const response = await apiClient.put(`/attribute-options/${optionId}`, {
        value: editOption.value,
        label: editOption.name,
        weight: editOption.weight
      });
      
      if ((response as { success: boolean }).success) {
        // Update the option in local state
        if (expandedCategory) {
          const updatedOptions = categoryOptions[expandedCategory]?.map(opt =>
            opt.id === optionId 
              ? { ...opt, value: editOption.value, label: editOption.name, weight: editOption.weight }
              : opt
          ) || [];
          
          setCategoryOptions(prev => ({
            ...prev,
            [expandedCategory]: updatedOptions
          }));
        }
        setEditingOption(null);
      } else {
        setError('Failed to update option');
      }
    } catch (err) {
      setError(`Error updating option: ${  err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleDeleteOption = async (optionId: number): Promise<void> => {
    // TODO: Replace with proper confirmation dialog
    // eslint-disable-next-line no-alert
    if (!confirm('Are you sure you want to delete this option? This cannot be undone.')) {
      return;
    }

    try {
      const response = await apiClient.delete(`/attribute-options/${optionId}`);
      
      if ((response as { success: boolean }).success) {
        // Remove from local state
        if (expandedCategory) {
          const filteredOptions = categoryOptions[expandedCategory]?.filter(opt => opt.id !== optionId) || [];
          setCategoryOptions(prev => ({
            ...prev,
            [expandedCategory]: filteredOptions
          }));
        }
        // Update category count
        await loadCategories();
      } else {
        setError('Failed to delete option');
      }
    } catch (err) {
      setError(`Error deleting option: ${  err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleNewOptionChange = (field: keyof NewOptionData, value: string | number): void => {
    setNewOption(prev => ({ ...prev, [field]: value }));
  };

  const handleEditOptionChange = (field: string, value: string | number): void => {
    setEditOption(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <LoadingSpinner message="Loading attribute categories..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-heading font-bold bg-gradient-sunset bg-clip-text text-transparent mb-4">
            🎯 Attribute Options Manager
          </h1>
          <p className="text-dark-600 text-lg">Manage option values for select-type attributes</p>
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
            <li><strong>Expand Categories:</strong> Click on a category to see its options</li>
            <li><strong>Add Options:</strong> Use the "Add Option" button to create new values</li>
            <li><strong>Weight System:</strong> Higher weights make options more likely in random selection</li>
            <li><strong>Value vs Label:</strong> Value is used internally, Label is shown to users</li>
          </ul>
        </div>

        {/* Categories List */}
        <CategoryList
          categories={categories}
          expandedCategory={expandedCategory}
          onExpandCategory={handleExpandCategory}
          onShowAddForm={setShowAddForm}
        />

        {/* Expanded Category Options */}
        {expandedCategory && (
          <div className="bg-white rounded-lg shadow border overflow-hidden">
            {loadingOptions === expandedCategory ? (
              <div className="p-8 text-center">
                <div className="animate-spin h-8 w-8 border-4 border-blue-200 border-t-blue-500 rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Loading options...</p>
              </div>
            ) : (
              <OptionsTable
                category={expandedCategory}
                options={categoryOptions[expandedCategory] || []}
                editingOption={editingOption}
                editOption={editOption}
                onEditChange={handleEditOptionChange}
                onStartEdit={handleEditOption}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={() => setEditingOption(null)}
                onDeleteOption={handleDeleteOption}
              />
            )}
          </div>
        )}

        {/* Add Option Form */}
        {showAddForm && (
          <AddOptionForm
            category={showAddForm}
            newOption={newOption}
            onOptionChange={handleNewOptionChange}
            onSubmit={handleAddOption}
            onCancel={() => setShowAddForm(null)}
          />
        )}
      </div>
    </div>
  );
};

export default AttributeOptionsManager;