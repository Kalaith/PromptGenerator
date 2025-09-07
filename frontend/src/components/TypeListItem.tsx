import React from 'react';
import { GeneratorTypeConfig } from '../config/generatorTypes';
import TypeEditForm from './TypeEditForm';

interface TypeListItemProps {
  type: GeneratorTypeConfig;
  isEditing: boolean;
  onEdit: (id: string | null) => void;
  onUpdate: (id: string, updates: Partial<GeneratorTypeConfig>) => void;
  onDelete: (id: string) => void;
}

const TypeListItem: React.FC<TypeListItemProps> = ({ 
  type, 
  isEditing, 
  onEdit, 
  onUpdate, 
  onDelete 
}) => {
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this generator type?')) {
      onDelete(type.id);
    }
  };

  const toggleEdit = () => {
    onEdit(isEditing ? null : type.id);
  };

  return (
    <div
      className={`p-4 border rounded-xl ${
        type.isActive ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-2xl">{type.icon}</span>
          <div>
            <h3 className="text-lg font-semibold">{type.name}</h3>
            <p className="text-sm text-gray-600">/{type.slug} → {type.apiType}</p>
            <p className="text-sm text-gray-500">{type.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Order: {type.order}</span>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={type.isActive}
              onChange={(e) => onUpdate(type.id, { isActive: e.target.checked })}
            />
            <span className="text-sm">Active</span>
          </label>
          <button
            onClick={toggleEdit}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
          >
            {isEditing ? 'Close' : 'Edit'}
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>

      {isEditing && (
        <TypeEditForm type={type} onUpdate={onUpdate} />
      )}
    </div>
  );
};

export default TypeListItem;