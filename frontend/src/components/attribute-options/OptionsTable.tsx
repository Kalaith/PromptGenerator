import React from 'react';
import { AttributeOption } from './types';

interface OptionsTableProps {
  category: string;
  options: AttributeOption[];
  editingOption: number | null;
  editOption: { name: string; value: string; weight: number };
  onEditChange: (field: string, value: string | number) => void;
  onStartEdit: (option: AttributeOption) => void;
  onSaveEdit: (optionId: number) => Promise<void>;
  onCancelEdit: () => void;
  onDeleteOption: (optionId: number) => Promise<void>;
}

export const OptionsTable: React.FC<OptionsTableProps> = ({
  category,
  options,
  editingOption,
  editOption,
  onEditChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDeleteOption
}) => {
  return (
    <div className="bg-gray-50 px-6 py-4">
      <h4 className="text-md font-semibold text-gray-800 mb-3">
        Options for {category} ({options.length})
      </h4>
      
      {options.length === 0 ? (
        <p className="text-gray-500 italic">No options defined for this category.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Label
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weight
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {options.map((option) => (
                <tr key={option.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {editingOption === option.id ? (
                      <input
                        type="text"
                        value={editOption.value}
                        onChange={(e) => onEditChange('value', e.target.value)}
                        className="w-full px-2 py-1 text-sm border rounded"
                      />
                    ) : (
                      <span className="text-sm text-gray-900">{option.value}</span>
                    )}
                  </td>
                  
                  <td className="px-4 py-3">
                    {editingOption === option.id ? (
                      <input
                        type="text"
                        value={editOption.name}
                        onChange={(e) => onEditChange('name', e.target.value)}
                        className="w-full px-2 py-1 text-sm border rounded"
                      />
                    ) : (
                      <span className="text-sm text-gray-900">{option.label}</span>
                    )}
                  </td>
                  
                  <td className="px-4 py-3">
                    {editingOption === option.id ? (
                      <input
                        type="number"
                        value={editOption.weight}
                        onChange={(e) => onEditChange('weight', parseFloat(e.target.value) || 1)}
                        className="w-20 px-2 py-1 text-sm border rounded"
                        min="0"
                        step="0.1"
                      />
                    ) : (
                      <span className="text-sm text-gray-900">{option.weight}</span>
                    )}
                  </td>
                  
                  <td className="px-4 py-3 text-sm font-medium space-x-2">
                    {editingOption === option.id ? (
                      <>
                        <button
                          onClick={() => onSaveEdit(option.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Save
                        </button>
                        <button
                          onClick={onCancelEdit}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => onStartEdit(option)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDeleteOption(option.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};