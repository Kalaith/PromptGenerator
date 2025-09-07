import React from 'react';
import type { AttributeConfig } from '../api/types';

interface AlienAttributeSelectorProps {
  alienAttributes: Record<string, AttributeConfig>;
  selectedAttributes: Record<string, string | string[]>;
  onUpdateAttribute: (key: string, value: string | string[]) => void;
  onClearAttribute: (key: string) => void;
}

const AlienAttributeSelector: React.FC<AlienAttributeSelectorProps> = ({
  alienAttributes,
  selectedAttributes,
  onUpdateAttribute,
  onClearAttribute,
}) => {
  if (Object.keys(alienAttributes).length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
        <span>🛸</span> Alien Attributes
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        {Object.entries(alienAttributes).map(([key, config]) => (
          <AlienAttributeField
            key={key}
            attributeKey={key}
            config={config}
            selectedValue={selectedAttributes[key]}
            onUpdateAttribute={onUpdateAttribute}
            onClearAttribute={onClearAttribute}
          />
        ))}
      </div>
    </div>
  );
};

interface AlienAttributeFieldProps {
  attributeKey: string;
  config: AttributeConfig;
  selectedValue: string | string[] | undefined;
  onUpdateAttribute: (key: string, value: string | string[]) => void;
  onClearAttribute: (key: string) => void;
}

const AlienAttributeField: React.FC<AlienAttributeFieldProps> = ({
  attributeKey,
  config,
  selectedValue,
  onUpdateAttribute,
  onClearAttribute,
}) => {
  const handleSelectChange = (value: string): void => {
    if (value === '') {
      onClearAttribute(attributeKey);
      return;
    }
    onUpdateAttribute(attributeKey, value);
  };

  const handleMultiSelectChange = (selectedOptions: string[]): void => {
    if (selectedOptions.length === 0) {
      onClearAttribute(attributeKey);
      return;
    }
    onUpdateAttribute(attributeKey, selectedOptions);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-700">
        {config.label}
      </label>
      <AlienFieldRenderer
        config={config}
        selectedValue={selectedValue}
        onSelectChange={handleSelectChange}
        onMultiSelectChange={handleMultiSelectChange}
      />
    </div>
  );
};

interface AlienFieldRendererProps {
  config: AttributeConfig;
  selectedValue: string | string[] | undefined;
  onSelectChange: (value: string) => void;
  onMultiSelectChange: (selectedOptions: string[]) => void;
}

const AlienFieldRenderer: React.FC<AlienFieldRendererProps> = ({
  config,
  selectedValue,
  onSelectChange,
  onMultiSelectChange,
}) => {
  if (config.type === 'select') {
    return (
      <AlienSelectField
        value={(selectedValue as string) || ''}
        onChange={onSelectChange}
        options={config.options}
      />
    );
  }
  if (config.type === 'multi-select') {
    return (
      <AlienMultiSelectField
        value={(selectedValue as string[]) || []}
        onChange={onMultiSelectChange}
        options={config.options}
      />
    );
  }
  return null;
};

interface AlienSelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string | null }>;
}

const AlienSelectField: React.FC<AlienSelectFieldProps> = ({ value, onChange, options }) => (
  <select
    className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white 
             focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all duration-300
             text-slate-800 font-medium hover:border-gray-400 shadow-sm"
    onChange={(event) => onChange(event.target.value)}
    value={value}
  >
    <option value="">Any</option>
    {options.map((option, index) => (
      <option key={option.value || `option-${index}`} value={option.value}>
        {option.label || option.value}
      </option>
    ))}
  </select>
);

interface AlienMultiSelectFieldProps {
  value: string[];
  onChange: (selectedOptions: string[]) => void;
  options: Array<{ value: string; label: string | null }>;
}

const AlienMultiSelectField: React.FC<AlienMultiSelectFieldProps> = ({ value, onChange, options }) => (
  <select
    multiple
    className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white 
             focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all duration-300
             text-slate-800 font-medium hover:border-gray-400 h-24 shadow-sm"
    onChange={(event) => {
      const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
      onChange(selectedOptions);
    }}
    value={value}
  >
    {options.map((option, index) => (
      <option key={option.value || `option-${index}`} value={option.value}>
        {option.label || option.value}
      </option>
    ))}
  </select>
);

export default AlienAttributeSelector;