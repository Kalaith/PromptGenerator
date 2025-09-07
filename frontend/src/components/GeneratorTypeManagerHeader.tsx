import React from 'react';

interface GeneratorTypeManagerHeaderProps {
  showAddForm: boolean;
  onToggleAddForm: () => void;
  onResetToDefaults: () => void;
}

const GeneratorTypeManagerHeader: React.FC<GeneratorTypeManagerHeaderProps> = ({
  showAddForm,
  onToggleAddForm,
  onResetToDefaults
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Generator Type Manager</h2>
        <p className="text-slate-600">Manage and configure generator types</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onToggleAddForm}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium"
        >
          {showAddForm ? 'Cancel' : 'Add New Type'}
        </button>
        <button
          onClick={onResetToDefaults}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 font-medium"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
};

export default GeneratorTypeManagerHeader;