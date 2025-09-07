import React, { useState } from 'react';
import { useGeneratorTypes } from '../hooks/useGeneratorTypes';
import { sortTypesByOrder, showConfirmDialog } from '../utils/generatorTypeUtils';
import { GeneratorTypeConfig } from '../config/generatorTypes';
import GeneratorTypeManagerHeader from './GeneratorTypeManagerHeader';
import AddTypeForm from './AddTypeForm';
import TypeListItem from './TypeListItem';

const GeneratorTypeManager: React.FC = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { generatorTypes, updateType, addType, deleteType, resetToDefaults } = useGeneratorTypes();

  const handleAddType = (newType: Partial<GeneratorTypeConfig>): boolean => {
    const success = addType(newType);
    if (success) {
      setShowAddForm(false);
    }
    return success;
  };

  const handleResetToDefaults = (): void => {
    const confirmed = showConfirmDialog(
      'Are you sure you want to reset to default generator types? This will lose all customizations.'
    );
    if (confirmed) {
      resetToDefaults();
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="card">
        <div className="card__body">
          <GeneratorTypeManagerHeader
            showAddForm={showAddForm}
            onToggleAddForm={() => setShowAddForm(!showAddForm)}
            onResetToDefaults={handleResetToDefaults}
          />

          {showAddForm && (
            <AddTypeForm
              onAdd={handleAddType}
              onCancel={() => setShowAddForm(false)}
            />
          )}

          <div className="space-y-4">
            {sortTypesByOrder(generatorTypes).map((type) => (
              <TypeListItem
                key={type.id}
                type={type}
                isEditing={editingId === type.id}
                onEdit={setEditingId}
                onUpdate={updateType}
                onDelete={deleteType}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratorTypeManager;