import React from 'react';
import { AttributeCategory } from './types';

interface CategoryListProps {
  categories: AttributeCategory[];
  expandedCategory: string | null;
  onExpandCategory: (category: string | null) => void;
  onShowAddForm: (category: string) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  expandedCategory,
  onExpandCategory,
  onShowAddForm
}) => {
  const handleToggleExpand = (category: string): void => {
    onExpandCategory(expandedCategory === category ? null : category);
  };

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div key={category.category} className="bg-white rounded-lg shadow border overflow-hidden">
          <div
            className="px-6 py-4 bg-gray-50 border-b cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => handleToggleExpand(category.category)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {category.label || category.category}
                </h3>
                <p className="text-sm text-gray-600">
                  {category.option_count} options • Type: {category.input_type}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onShowAddForm(category.category);
                  }}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                >
                  ➕ Add Option
                </button>
                <span className="text-2xl text-gray-400">
                  {expandedCategory === category.category ? '▼' : '▶'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};