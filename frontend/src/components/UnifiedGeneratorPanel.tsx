import React from 'react';
import { GeneratorTypeConfig } from '../config/generatorTypes';
import { useUnifiedGenerator } from '../hooks/useUnifiedGenerator';
import { GeneratorHeader } from './generator/GeneratorHeader';
import { BasicControls } from './generator/BasicControls';
import { AttributeControls } from './generator/AttributeControls';
import { GenerateButton } from './generator/GenerateButton';
import { ImageGenerationControls } from './generator/ImageGenerationControls';
import { ErrorDisplay } from './ui/ErrorDisplay';

interface UnifiedGeneratorPanelProps {
  config: GeneratorTypeConfig;
}

const UnifiedGeneratorPanel: React.FC<UnifiedGeneratorPanelProps> = ({ config }) => {
  const {
    promptCount,
    species,
    availableSpecies,
    attributeConfigs,
    attributeOptions,
    selectedAttributes,
    imageGenerationEnabled,
    imageWidth,
    imageHeight,
    setPromptCount,
    setSpecies,
    updateSelectedAttribute,
    setImageGenerationEnabled,
    setImageWidth,
    setImageHeight,
    handleGenerate,
    loading,
    error,
    clearError,
  } = useUnifiedGenerator({ config });

  const getFocusClasses = (baseColor: string): string => {
    const colorMap: Record<string, string> = {
      sakura: 'focus:border-sakura-400 focus:ring-4 focus:ring-sakura-100',
      violet: 'focus:border-violet-500 focus:ring-4 focus:ring-violet-100',
      ocean: 'focus:border-ocean-500 focus:ring-4 focus:ring-ocean-100',
      red: 'focus:border-red-500 focus:ring-4 focus:ring-red-100',
    };
    return colorMap[baseColor] || 'focus:border-gray-500 focus:ring-4 focus:ring-gray-100';
  };

  const getButtonFocusClasses = (baseColor: string): string => {
    const colorMap: Record<string, string> = {
      sakura: 'focus:ring-4 focus:ring-sakura-200',
      violet: 'focus:ring-4 focus:ring-violet-200', 
      ocean: 'focus:ring-4 focus:ring-ocean-200',
      red: 'focus:ring-4 focus:ring-red-200',
    };
    return colorMap[baseColor] || 'focus:ring-4 focus:ring-gray-200';
  };

  const handleFormSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    void handleGenerate();
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="card generator-panel">
        <div className="card__body">
          <GeneratorHeader config={config} />

          <ErrorDisplay 
            error={error} 
            onDismiss={clearError}
            variant="inline"
          />

          <form className="space-y-6" onSubmit={handleFormSubmit}>
            <BasicControls
              config={config}
              species={species}
              promptCount={promptCount}
              availableSpecies={availableSpecies}
              onSpeciesChange={setSpecies}
              onPromptCountChange={setPromptCount}
              getFocusClasses={getFocusClasses}
            />

            <AttributeControls
              config={config}
              attributeConfigs={attributeConfigs}
              attributeOptions={attributeOptions}
              selectedAttributes={selectedAttributes}
              onAttributeChange={updateSelectedAttribute}
              getFocusClasses={getFocusClasses}
            />

            <ImageGenerationControls
              enabled={imageGenerationEnabled}
              onToggle={setImageGenerationEnabled}
              width={imageWidth}
              height={imageHeight}
              onWidthChange={setImageWidth}
              onHeightChange={setImageHeight}
            />

            <GenerateButton
              config={config}
              loading={loading}
              onGenerate={handleGenerate}
              getButtonFocusClasses={getButtonFocusClasses}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default UnifiedGeneratorPanel;