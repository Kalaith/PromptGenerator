import React from 'react';
import { GeneratorTypeConfig } from '../config/generatorTypes';

interface AddTypeFormControlsProps {
  newType: Partial<GeneratorTypeConfig>;
  setNewType: React.Dispatch<React.SetStateAction<Partial<GeneratorTypeConfig>>>;
  onSubmit: () => void;
}

const AddTypeFormControls: React.FC<AddTypeFormControlsProps> = ({ 
  newType, 
  setNewType, 
  onSubmit 
}) => {
  return (
    <>
      <input
        placeholder="Button Gradient Class"
        className="form-control col-span-2"
        value={newType.buttonGradient || ''}
        onChange={(e) => setNewType(prev => ({ ...prev, buttonGradient: e.target.value }))}
      />
      <div className="col-span-2 flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={newType.isActive !== false}
            onChange={(e) => setNewType(prev => ({ ...prev, isActive: e.target.checked }))}
          />
          Active
        </label>
        <input
          type="number"
          placeholder="Order"
          className="form-control w-20"
          value={newType.order || 0}
          onChange={(e) => setNewType(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
        />
        <button
          onClick={onSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium"
        >
          Add Type
        </button>
      </div>
    </>
  );
};

export default AddTypeFormControls;