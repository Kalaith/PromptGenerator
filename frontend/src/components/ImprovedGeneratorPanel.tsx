import React from 'react';
import { useAnimeGeneration } from '../hooks/useAnimeGeneration';
import { useFormState } from '../hooks/useFormState';
import { GeneratorForm, SelectField, NumberField } from './shared/GeneratorForm';
import { TemplateSelector } from './shared/TemplateSelector';
import { ErrorBoundary } from './ErrorBoundary';
import { ValidationUtils } from '../utils/validation';
import { APP_CONSTANTS, GENERATOR_OPTIONS } from '../constants/app';
import type { AnimeGenerationParams, SelectOption } from '../types/components';
import type { Template } from '../api/types';

const ImprovedGeneratorPanel: React.FC = () => {
  const {
    speciesData,
    templatesData,
    generation,
    generatePrompts,
    validateParams,
    getFormDefaults,
  } = useAnimeGeneration();

  const formState = useFormState<AnimeGenerationParams>({
    initialValues: getFormDefaults(),
    validators: {
      count: (value: number) => ValidationUtils.validatePromptCount(value),
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  const [selectedTemplate, setSelectedTemplate] = React.useState<Template | null>(null);

  // Reset species when type changes
  React.useEffect(() => {
    formState.setField('species', GENERATOR_OPTIONS.RANDOM);
  }, [formState.values.type]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!formState.validateAll()) {
      return;
    }

    formState.setSubmitting(true);
    formState.setSubmitError(undefined);

    try {
      await generatePrompts(formState.values, selectedTemplate);
    } catch (error) {
      // Error is handled by the generation hook, but we can also set form error
      const formError = validateParams(formState.values);
      if (formError) {
        formState.setSubmitError(formError);
      }
    } finally {
      formState.setSubmitting(false);
    }
  };

  const handleReset = () => {
    formState.resetForm();
    setSelectedTemplate(null);
  };

  // Prepare options for select fields
  const typeOptions: SelectOption[] = [
    { value: 'random', label: 'Random' },
    { value: 'animalGirl', label: 'Animal Girl' },
    { value: 'monster', label: 'Monster' },
    { value: 'monsterGirl', label: 'Monster Girl' },
  ];

  const speciesOptions: SelectOption[] = [
    { value: GENERATOR_OPTIONS.RANDOM, label: 'Random' },
    ...(speciesData.data?.map(species => ({
      value: species,
      label: species.charAt(0).toUpperCase() + species.slice(1),
    })) || []),
  ];

  const isLoading = generation.loading || formState.isSubmitting;
  const hasError = generation.error || formState.submitError;

  return (
    <ErrorBoundary>
      <GeneratorForm
        title="Anime Character Generator"
        onSubmit={handleSubmit}
        loading={isLoading}
        error={hasError}
        submitText="Generate Characters"
        submitLoadingText="Generating Characters..."
        resetButton
        onReset={handleReset}
        data-testid="anime-generator-panel"
      >
        <SelectField
          {...formState.getFieldProps('type')}
          id="anime-type"
          label="Character Type"
          options={typeOptions}
          disabled={isLoading}
          helpText="Choose the type of character to generate"
          data-testid="anime-type-select"
        />

        <SelectField
          {...formState.getFieldProps('species')}
          id="anime-species"
          label="Species"
          options={speciesOptions}
          disabled={isLoading || speciesData.loading}
          error={speciesData.error ? 'Failed to load species options' : undefined}
          helpText="Choose a specific species or leave random for variety"
          data-testid="anime-species-select"
        />

        <TemplateSelector
          selectedTemplate={selectedTemplate}
          onTemplateChange={setSelectedTemplate}
          templates={templatesData.data || []}
          loading={templatesData.loading}
          error={templatesData.error}
          type="anime"
          data-testid="anime-template-selector"
        />

        <NumberField
          {...formState.getFieldProps('count')}
          id="anime-count"
          label="Number of Characters"
          min={APP_CONSTANTS.PROMPT_COUNT.MIN}
          max={APP_CONSTANTS.PROMPT_COUNT.MAX}
          disabled={isLoading}
          helpText={`Generate between ${APP_CONSTANTS.PROMPT_COUNT.MIN} and ${APP_CONSTANTS.PROMPT_COUNT.MAX} characters`}
          data-testid="anime-count-input"
        />
      </GeneratorForm>
    </ErrorBoundary>
  );
};

export default ImprovedGeneratorPanel;