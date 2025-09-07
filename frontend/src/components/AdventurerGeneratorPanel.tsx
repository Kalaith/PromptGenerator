import React from 'react';
import { useAdventurerAttributes } from '../hooks/useAdventurerAttributes';
import { useAdventurerGeneration } from '../hooks/useAdventurerGeneration';
import { APP_CONSTANTS } from '../constants/app';
import AdventurerAttributeSelector from './AdventurerAttributeSelector';
import AdventurerGenerationControls from './AdventurerGenerationControls';

const AdventurerGeneratorPanel: React.FC = () => {
  const [promptCount, setPromptCount] = React.useState<number>(APP_CONSTANTS.PROMPT_COUNT.DEFAULT);
  
  const attributes = useAdventurerAttributes();
  const generation = useAdventurerGeneration();

  const resetForm = (): void => {
    attributes.resetAttributes();
    setPromptCount(APP_CONSTANTS.PROMPT_COUNT.DEFAULT);
  };

  const onGenerate = (): void => {
    generation.handleGenerate({
      promptCount,
      selectedAttributes: attributes.selectedAttributes,
    });
  };

  return (
    <AdventurerGeneratorLayout>
      <AdventurerGeneratorHeader />
      <AdventurerGeneratorError error={generation.error} />
      <AdventurerGeneratorForm
        attributes={attributes}
        promptCount={promptCount}
        onPromptCountChange={setPromptCount}
        onGenerate={onGenerate}
        onReset={resetForm}
        loading={generation.loading}
      />
    </AdventurerGeneratorLayout>
  );
};

const AdventurerGeneratorLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="container mx-auto px-4 py-8">
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ocean-50/50 via-transparent to-mystic-50/50 pointer-events-none"></div>
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  </div>
);

const AdventurerGeneratorHeader: React.FC = () => (
  <div className="text-center mb-8">
    <h2 className="text-3xl font-heading font-bold bg-gradient-ocean bg-clip-text text-transparent mb-3">
      ⚔️ Adventurer Prompt Generator
    </h2>
    <p className="text-dark-600 text-lg">Create epic fantasy adventures and characters</p>
  </div>
);

interface AdventurerGeneratorErrorProps {
  error: { message: string } | null;
}

const AdventurerGeneratorError: React.FC<AdventurerGeneratorErrorProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="mb-6 p-4 bg-danger-50 border border-danger-200 text-danger-700 rounded-xl flex items-center gap-3 animate-fade-in">
      <span className="text-xl">⚠️</span>
      <span className="font-medium">{error.message}</span>
    </div>
  );
};

interface AdventurerGeneratorFormProps {
  attributes: ReturnType<typeof useAdventurerAttributes>;
  promptCount: number;
  onPromptCountChange: (count: number) => void;
  onGenerate: () => void;
  onReset: () => void;
  loading: boolean;
}

const AdventurerGeneratorForm: React.FC<AdventurerGeneratorFormProps> = ({
  attributes,
  promptCount,
  onPromptCountChange,
  onGenerate,
  onReset,
  loading,
}) => (
  <form className="space-y-6" onSubmit={(event) => { event.preventDefault(); onGenerate(); }}>
    <AdventurerAttributeSelector
      adventurerAttributes={attributes.adventurerAttributes}
      selectedAttributes={attributes.selectedAttributes}
      onUpdateAttribute={attributes.updateAttribute}
      onClearAttribute={attributes.clearAttribute}
    />

    <AdventurerGenerationControls
      promptCount={promptCount}
      onPromptCountChange={onPromptCountChange}
      onGenerate={onGenerate}
      onReset={onReset}
      loading={loading}
    />
  </form>
);

export default AdventurerGeneratorPanel;