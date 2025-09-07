import React from 'react';
import { AttributeConfig } from './types';
import { AttributeRow } from './AttributeRow';

interface AttributeTableProps {
  configs: AttributeConfig[];
  editingId: number | null;
  onToggleActive: (id: number, currentActive: boolean) => Promise<void>;
  onUpdateLabel: (id: number, newLabel: string) => Promise<void>;
  onUpdateInputType: (id: number, newType: AttributeConfig['input_type']) => Promise<void>;
  onUpdateSortOrder: (id: number, newOrder: number) => Promise<void>;
  onStartEdit: (id: number) => void;
  onCancelEdit: () => void;
  onViewSpecies: (category: string) => void;
  onManageOptions: (configId: number) => void;
}

export const AttributeTable: React.FC<AttributeTableProps> = ({
  configs,
  editingId,
  onToggleActive,
  onUpdateLabel,
  onUpdateInputType,
  onUpdateSortOrder,
  onStartEdit,
  onCancelEdit,
  onViewSpecies,
  onManageOptions
}) => {
  const groupedConfigs = configs.reduce((acc, config) => {
    if (!acc[config.generator_type]) {
      acc[config.generator_type] = [];
    }
    acc[config.generator_type]!.push(config);
    return acc;
  }, {} as Record<string, AttributeConfig[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedConfigs).map(([generatorType, typeConfigs]) => (
        <div key={generatorType} className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h3 className="text-lg font-medium text-gray-900 capitalize">
              {generatorType} Attributes
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Label
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {typeConfigs
                  .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
                  .map((config) => (
                    <AttributeRow
                      key={config.id}
                      config={config}
                      isEditing={editingId === config.id}
                      onToggleActive={onToggleActive}
                      onUpdateLabel={onUpdateLabel}
                      onUpdateInputType={onUpdateInputType}
                      onUpdateSortOrder={onUpdateSortOrder}
                      onStartEdit={onStartEdit}
                      onCancelEdit={onCancelEdit}
                      onViewSpecies={onViewSpecies}
                      onManageOptions={onManageOptions}
                    />
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};