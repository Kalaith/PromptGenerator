import React from 'react';
import type { AttributeConfig } from '../api/types';

interface AdventurerAttributeSelectorProps {
  adventurerAttributes: Record<string, AttributeConfig>;
  selectedAttributes: Record<string, string | string[]>;
  onUpdateAttribute: (key: string, value: string | string[]) => void;
  onClearAttribute: (key: string) => void;
}

const AdventurerAttributeSelector: React.FC<AdventurerAttributeSelectorProps> = ({
  adventurerAttributes,
  selectedAttributes,
  onUpdateAttribute,
  onClearAttribute,
}) => {
  if (Object.keys(adventurerAttributes).length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-dark-700 flex items-center gap-2">
        <span>🗡️</span> Adventurer Attributes
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        {Object.entries(adventurerAttributes).map(([key, config]) => (
          <AdventurerAttributeField
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

interface AdventurerAttributeFieldProps {
  attributeKey: string;
  config: AttributeConfig;
  selectedValue: string | string[] | undefined;
  onUpdateAttribute: (key: string, value: string | string[]) => void;
  onClearAttribute: (key: string) => void;
}

const AdventurerAttributeField: React.FC<AdventurerAttributeFieldProps> = ({
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
      <label className="block text-sm font-medium text-dark-600">
        {config.label}
      </label>
      <AdventurerFieldRenderer
        config={config}
        selectedValue={selectedValue}
        onSelectChange={handleSelectChange}
        onMultiSelectChange={handleMultiSelectChange}
      />
    </div>
  );
};

interface AdventurerFieldRendererProps {
  config: AttributeConfig;
  selectedValue: string | string[] | undefined;
  onSelectChange: (value: string) => void;
  onMultiSelectChange: (selectedOptions: string[]) => void;
}

const AdventurerFieldRenderer: React.FC<AdventurerFieldRendererProps> = ({
  config,
  selectedValue,
  onSelectChange,
  onMultiSelectChange,
}) => {
  if (config.type === 'select') {
    return (
      <AdventurerSelectField
        value={(selectedValue as string) || ''}
        onChange={onSelectChange}
        options={config.options}
      />
    );
  }
  if (config.type === 'multi-select') {
    return (
      <AdventurerMultiSelectField
        value={(selectedValue as string[]) || []}
        onChange={onMultiSelectChange}
        options={config.options}
      />
    );
  }
  return null;
};

interface AdventurerSelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string | null }>;
}

const AdventurerSelectField: React.FC<AdventurerSelectFieldProps> = ({ value, onChange, options }) => (
  <select
    className="w-full p-3 border-2 border-ocean-200/50 rounded-lg bg-white/70 backdrop-blur-sm 
             focus:border-ocean-400 focus:ring-4 focus:ring-ocean-100 transition-all duration-300
             text-dark-700 font-medium hover:border-ocean-300"
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

interface AdventurerMultiSelectFieldProps {
  value: string[];
  onChange: (selectedOptions: string[]) => void;
  options: Array<{ value: string; label: string | null }>;
}

const AdventurerMultiSelectField: React.FC<AdventurerMultiSelectFieldProps> = ({ value, onChange, options }) => (
  <select
    multiple
    className="w-full p-3 border-2 border-ocean-200/50 rounded-lg bg-white/70 backdrop-blur-sm 
             focus:border-ocean-400 focus:ring-4 focus:ring-ocean-100 transition-all duration-300
             text-dark-700 font-medium hover:border-ocean-300 h-24"
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

export default AdventurerAttributeSelector;