import React from 'react';
import { GeneratorTypeConfig } from '../../config/generatorTypes';

interface AttributeConfig {
  id: number;
  generator_type: string;
  category: string;
  label: string;
  input_type: 'select' | 'multi-select' | 'text' | 'number' | 'checkbox';
  is_active: boolean;
  sort_order: number;
}

interface AttributeControlsProps {
  config: GeneratorTypeConfig;
  attributeConfigs: AttributeConfig[];
  attributeOptions: Record<string, Array<{label: string, value: string}>>;
  selectedAttributes: Record<string, string>;
  onAttributeChange: (category: string, value: string) => void;
  getFocusClasses: (baseColor: string) => string;
}

export const AttributeControls: React.FC<AttributeControlsProps> = ({
  config,
  attributeConfigs,
  attributeOptions,
  selectedAttributes,
  onAttributeChange,
  getFocusClasses,
}) => {
  if (attributeConfigs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
        <span>🎭</span> Custom Attributes
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        {attributeConfigs.map((attrConfig) => (
          <div key={attrConfig.id} className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">{attrConfig.label}</label>
            {attrConfig.input_type === 'select' ? (
              <select
                className={`w-full p-3 border-2 border-gray-300 rounded-lg bg-white 
                         ${getFocusClasses(config.focusColor)} transition-all duration-300
                         text-slate-800 font-medium hover:border-gray-400 shadow-sm`}
                onChange={(event) => onAttributeChange(attrConfig.category, event.target.value)}
                value={selectedAttributes[attrConfig.category] || ''}
              >
                <option value="">Any</option>
                {(attributeOptions[attrConfig.category] || []).map((option, index) => (
                  <option key={`${attrConfig.category}-${option.value}-${index}`} value={option.value}>
                    {option.label || option.value}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className={`w-full p-3 border-2 border-gray-300 rounded-lg bg-white 
                         ${getFocusClasses(config.focusColor)} transition-all duration-300
                         text-slate-800 font-medium hover:border-gray-400 shadow-sm`}
                onChange={(event) => onAttributeChange(attrConfig.category, event.target.value)}
                placeholder={`Enter ${attrConfig.label?.toLowerCase() || 'value'}...`}
                type="text"
                value={selectedAttributes[attrConfig.category] || ''}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};