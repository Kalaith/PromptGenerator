import React from 'react';
import { GeneratorTypeConfig } from '../config/generatorTypes';

interface TypeEditFormInputsProps {
  type: GeneratorTypeConfig;
  onUpdate: (id: string, updates: Partial<GeneratorTypeConfig>) => void;
}

const TypeEditFormInputs: React.FC<TypeEditFormInputsProps> = ({ type, onUpdate }) => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <input
        placeholder="Name"
        className="form-control"
        value={type.name}
        onChange={(e) => onUpdate(type.id, { name: e.target.value })}
      />
      <input
        placeholder="Description"
        className="form-control"
        value={type.description}
        onChange={(e) => onUpdate(type.id, { description: e.target.value })}
      />
      <input
        placeholder="Icon"
        className="form-control"
        value={type.icon}
        onChange={(e) => onUpdate(type.id, { icon: e.target.value })}
      />
      <input
        placeholder="Focus Color"
        className="form-control"
        value={type.focusColor}
        onChange={(e) => onUpdate(type.id, { focusColor: e.target.value })}
      />
      <input
        placeholder="Button Gradient"
        className="form-control col-span-2"
        value={type.buttonGradient}
        onChange={(e) => onUpdate(type.id, { buttonGradient: e.target.value })}
      />
      <input
        type="number"
        placeholder="Order"
        className="form-control"
        value={type.order}
        onChange={(e) => onUpdate(type.id, { order: parseInt(e.target.value) || 0 })}
      />
      <select
        className="form-control"
        value={type.apiType}
        onChange={(e) => onUpdate(type.id, { apiType: e.target.value as GeneratorTypeConfig['apiType'] })}
      >
        <option value="animalGirl">Animal Girl</option>
        <option value="monsterGirl">Monster Girl</option>
        <option value="monster">Monster</option>
        <option value="race">Race/Adventurer</option>
        <option value="alien">Alien</option>
      </select>
    </div>
  );
};

export default TypeEditFormInputs;