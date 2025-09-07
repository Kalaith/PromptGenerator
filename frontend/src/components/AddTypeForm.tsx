import React, { useState } from 'react';
import { GeneratorTypeConfig } from '../config/generatorTypes';
import AddTypeFormInputs from './AddTypeFormInputs';
import AddTypeFormControls from './AddTypeFormControls';

interface AddTypeFormProps {
  onAdd: (newType: Partial<GeneratorTypeConfig>) => boolean;
  onCancel: () => void;
}

const AddTypeForm: React.FC<AddTypeFormProps> = ({ onAdd, onCancel }) => {
  const [newType, setNewType] = useState<Partial<GeneratorTypeConfig>>({
    isActive: true,
    order: 0
  });

  const handleSubmit = (): void => {
    const success = onAdd(newType);
    if (success) {
      setNewType({ isActive: true, order: 0 });
      onCancel();
    } else {
      // eslint-disable-next-line no-alert
      alert('Please fill in required fields: Name, Slug, and API Type');
    }
  };

  const handleSlugChange = (value: string): void => {
    const slug = value.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    setNewType(prev => ({ ...prev, slug }));
  };

  return (
    <div className="mb-8 p-6 border-2 border-green-200 rounded-xl bg-green-50">
      <h3 className="text-xl font-semibold mb-4">Add New Generator Type</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <AddTypeFormInputs
          newType={newType}
          setNewType={setNewType}
          onSlugChange={handleSlugChange}
        />
        <AddTypeFormControls
          newType={newType}
          setNewType={setNewType}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default AddTypeForm;