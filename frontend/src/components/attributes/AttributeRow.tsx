import React, { useState } from 'react';
import { AttributeConfig } from './types';

interface AttributeRowProps {
  config: AttributeConfig;
  isEditing: boolean;
  onToggleActive: (id: number, currentActive: boolean) => Promise<void>;
  onUpdateLabel: (id: number, newLabel: string) => Promise<void>;
  onUpdateInputType: (id: number, newType: AttributeConfig['input_type']) => Promise<void>;
  onUpdateSortOrder: (id: number, newOrder: number) => Promise<void>;
  onStartEdit: (id: number) => void;
  onCancelEdit: () => void;
  onViewSpecies: (category: string) => void;
  onManageOptions: (configId: number) => void;
}

export const AttributeRow: React.FC<AttributeRowProps> = ({
  config,
  isEditing,
  onToggleActive,
  onUpdateLabel,
  onUpdateInputType,
  onUpdateSortOrder,
  onStartEdit,
  onCancelEdit,
  onViewSpecies,
  onManageOptions
}) => {
  const [editValues, setEditValues] = useState({
    label: config.label,
    input_type: config.input_type,
    sort_order: config.sort_order || 0
  });

  const handleSave = (): void => {
    if (editValues.label !== config.label) {
      onUpdateLabel(config.id, editValues.label);
    }
    if (editValues.input_type !== config.input_type) {
      onUpdateInputType(config.id, editValues.input_type);
    }
    if (editValues.sort_order !== config.sort_order) {
      onUpdateSortOrder(config.id, editValues.sort_order);
    }
    onCancelEdit();
  };

  const handleCancel = (): void => {
    setEditValues({
      label: config.label,
      input_type: config.input_type,
      sort_order: config.sort_order || 0
    });
    onCancelEdit();
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {config.category}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <input
            type="text"
            value={editValues.label}
            onChange={(e) => setEditValues({ ...editValues, label: e.target.value })}
            className="w-full px-2 py-1 text-sm border rounded"
          />
        ) : (
          <span className="text-sm text-gray-900">{config.label}</span>
        )}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <select
            value={editValues.input_type}
            onChange={(e) => setEditValues({ ...editValues, input_type: e.target.value as AttributeConfig['input_type'] })}
            className="px-2 py-1 text-sm border rounded"
          >
            <option value="select">Select</option>
            <option value="multi-select">Multi-Select</option>
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="checkbox">Checkbox</option>
          </select>
        ) : (
          <span className="text-sm text-gray-900">{config.input_type}</span>
        )}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <input
            type="number"
            value={editValues.sort_order}
            onChange={(e) => setEditValues({ ...editValues, sort_order: parseInt(e.target.value) || 0 })}
            className="w-16 px-2 py-1 text-sm border rounded"
          />
        ) : (
          <span className="text-sm text-gray-900">{config.sort_order || 0}</span>
        )}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          onClick={() => onToggleActive(config.id, config.is_active)}
          className={`px-2 py-1 rounded text-xs font-medium ${
            config.is_active
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {config.is_active ? 'Active' : 'Inactive'}
        </button>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="text-green-600 hover:text-green-900"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onStartEdit(config.id)}
              className="text-indigo-600 hover:text-indigo-900"
            >
              Edit
            </button>
            {config.category === 'species' && (
              <button
                onClick={() => onViewSpecies(config.category)}
                className="text-blue-600 hover:text-blue-900"
              >
                View Species
              </button>
            )}
            <button
              onClick={() => onManageOptions(config.id)}
              className="text-purple-600 hover:text-purple-900"
            >
              Options
            </button>
          </>
        )}
      </td>
    </tr>
  );
};