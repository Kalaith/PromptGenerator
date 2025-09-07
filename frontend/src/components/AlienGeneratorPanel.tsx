import React from 'react';
import { useAlienAttributes } from '../hooks/useAlienAttributes';
import { useTemplateSelection } from '../hooks/useTemplateSelection';
import { useAlienGeneration } from '../hooks/useAlienGeneration';
import { APP_CONSTANTS } from '../constants/app';
import AlienAttributeSelector from './AlienAttributeSelector';
import AlienTemplateSelector from './AlienTemplateSelector';
import AlienGenerationControls from './AlienGenerationControls';

const AlienGeneratorPanel: React.FC = () => {
  const [promptCount, setPromptCount] = React.useState<number>(APP_CONSTANTS.PROMPT_COUNT.DEFAULT);
  
  const attributes = useAlienAttributes();
  const templates = useTemplateSelection();
  const generation = useAlienGeneration();

  const resetForm = (): void => {
    attributes.resetAttributes();
    templates.resetTemplate();
    setPromptCount(APP_CONSTANTS.PROMPT_COUNT.DEFAULT);
  };

  const onGenerate = (): void => {
    generation.handleGenerate({
      promptCount,
      selectedAttributes: attributes.selectedAttributes,
      selectedTemplate: templates.selectedTemplate,
    });
  };

  return (
    <AlienGeneratorLayout>
      <AlienGeneratorHeader />
      <AlienGeneratorError error={generation.error} />
      <AlienGeneratorForm
        attributes={attributes}
        templates={templates}
        promptCount={promptCount}
        onPromptCountChange={setPromptCount}
        onGenerate={onGenerate}
        onReset={resetForm}
        loading={generation.loading}
      />
    </AlienGeneratorLayout>
  );
};

const AlienGeneratorLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="container mx-auto px-4 py-8">
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/30 via-transparent to-mystic-50/30 pointer-events-none"></div>
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  </div>
);

const AlienGeneratorHeader: React.FC = () => (
  <div className="text-center mb-8">
    <h2 className="text-3xl font-heading font-bold bg-gradient-mystic bg-clip-text text-transparent mb-3">
      👽 Alien Species Generator
    </h2>
    <p className="text-slate-700 text-lg font-medium">Discover mysterious beings from distant worlds</p>
  </div>
);

interface AlienGeneratorErrorProps {
  error: { message: string } | null;
}

const AlienGeneratorError: React.FC<AlienGeneratorErrorProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-3 animate-fade-in">
      <span className="text-xl">⚠️</span>
      <span className="font-medium">{error.message}</span>
    </div>
  );
};

interface AlienGeneratorFormProps {
  attributes: ReturnType<typeof useAlienAttributes>;
  templates: ReturnType<typeof useTemplateSelection>;
  promptCount: number;
  onPromptCountChange: (count: number) => void;
  onGenerate: () => void;
  onReset: () => void;
  loading: boolean;
}

const AlienGeneratorForm: React.FC<AlienGeneratorFormProps> = ({
  attributes,
  templates,
  promptCount,
  onPromptCountChange,
  onGenerate,
  onReset,
  loading,
}) => (
  <form className="space-y-6" onSubmit={(event) => { event.preventDefault(); onGenerate(); }}>
    <AlienAttributeSelector
      alienAttributes={attributes.alienAttributes}
      selectedAttributes={attributes.selectedAttributes}
      onUpdateAttribute={attributes.updateAttribute}
      onClearAttribute={attributes.clearAttribute}
    />

    <AlienTemplateSelector
      availableTemplates={templates.availableTemplates}
      selectedTemplate={templates.selectedTemplate}
      onSelectTemplate={templates.selectTemplateById}
    />

    <AlienGenerationControls
      promptCount={promptCount}
      onPromptCountChange={onPromptCountChange}
      onGenerate={onGenerate}
      onReset={onReset}
      loading={loading}
    />
  </form>
);

export default AlienGeneratorPanel;