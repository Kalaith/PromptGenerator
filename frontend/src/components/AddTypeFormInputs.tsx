import React from 'react';
import { GeneratorTypeConfig } from '../config/generatorTypes';

interface AddTypeFormInputsProps {
  newType: Partial<GeneratorTypeConfig>;
  setNewType: React.Dispatch<React.SetStateAction<Partial<GeneratorTypeConfig>>>;
  onSlugChange: (value: string) => void;
}

const AddTypeFormInputs: React.FC<AddTypeFormInputsProps> = ({ 
  newType, 
  setNewType, 
  onSlugChange 
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <input
        placeholder="Name (e.g., 'Dragon')"
        className="form-control"
        value={newType.name || ''}
        onChange={(e) => setNewType(prev => ({ ...prev, name: e.target.value }))}
      />
      <input
        placeholder="Slug (e.g., 'dragon')"
        className="form-control"
        value={newType.slug || ''}
        onChange={(e) => onSlugChange(e.target.value)}
      />
      <input
        placeholder="Description"
        className="form-control"
        value={newType.description || ''}
        onChange={(e) => setNewType(prev => ({ ...prev, description: e.target.value }))}
      />
      <input
        placeholder="Icon (emoji)"
        className="form-control"
        value={newType.icon || ''}
        onChange={(e) => setNewType(prev => ({ ...prev, icon: e.target.value }))}
      />
      <select
        className="form-control"
        value={newType.apiType || ''}
        onChange={(e) => setNewType(prev => ({ 
          ...prev, 
          apiType: e.target.value as GeneratorTypeConfig['apiType']
        }))}
      >
        <option value="">Select API Type</option>
        <option value="animalGirl">Animal Girl</option>
        <option value="monsterGirl">Monster Girl</option>
        <option value="monster">Monster</option>
        <option value="race">Race/Adventurer</option>
        <option value="alien">Alien</option>
      </select>
      <input
        placeholder="Focus Color (e.g., 'blue')"
        className="form-control"
        value={newType.focusColor || ''}
        onChange={(e) => setNewType(prev => ({ ...prev, focusColor: e.target.value }))}
      />
    </div>
  );
};

export default AddTypeFormInputs;