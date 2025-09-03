import React, { useState } from 'react';
import { usePromptStore } from '../stores/promptStore';
import { usePromptGeneration } from '../hooks/usePromptGeneration';
import { useSession } from '../hooks/useSession';
import { useAlienData } from '../hooks/useAlienData';
import { useAlienForm } from '../hooks/useAlienForm';
import type { Template } from '../api';

const AlienGeneratorPanel: React.FC = () => {
  const [promptCount, setPromptCount] = useState<number>(10);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  
  const addGeneratedPrompts = usePromptStore(state => state.addGeneratedPrompts);
  const { generateAlienPrompts, loading, error, clearError } = usePromptGeneration();
  const { addToHistory } = useSession();
  const { availableSpeciesClasses, availableTemplates, loading: dataLoading, error: dataError } = useAlienData();
  const { formData, updateField, resetForm, buildGenerationRequest } = useAlienForm();

  const handleGenerate = async (): Promise<void> => {
    clearError();
    
    const safeCount = Math.max(1, Math.floor(Number(promptCount) || 1));
    const generationRequest = buildGenerationRequest(safeCount, selectedTemplate?.id?.toString());

    try {
      const apiPrompts = await generateAlienPrompts(generationRequest);
      
      if (apiPrompts.length > 0) {
        addGeneratedPrompts(apiPrompts);
        
        // Add to history
        for (const prompt of apiPrompts) {
          try {
            await addToHistory({
              id: prompt.id,
              title: prompt.title,
              description: prompt.description,
              tags: prompt.tags,
              type: 'alien',
              timestamp: Date.now(),
            });
          } catch (historyError) {
            console.error('Failed to add to history:', historyError);
          }
        }
      }
    } catch (generationError) {
      console.error('Generation failed:', generationError);
    }
  };

  const isLoading = loading || dataLoading;
  const displayError = error ?? dataError;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Alien Species Generator</h2>
        
        {displayError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {typeof displayError === 'string' ? displayError : 'An error occurred'}
          </div>
        )}

        <div className="space-y-4">
          {/* Species Class Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">Species Class</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              onChange={(event) => updateField('speciesClass', event.target.value)}
              value={formData.speciesClass}
            >
              <option value="random">Random</option>
              {availableSpeciesClasses.map(species => (
                <option key={species} value={species}>{species}</option>
              ))}
            </select>
          </div>

          {/* Other form fields */}
          {(['style', 'environment', 'climate', 'positiveTrait', 'negativeTrait', 'gender'] as const).map(field => (
            <div key={field}>
              <label className="block text-sm font-medium mb-1">
                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                onChange={(event) => updateField(field, event.target.value)}
                value={formData[field]}
              >
                <option value="random">Random</option>
              </select>
            </div>
          ))}

          {/* Template Selection */}
          {availableTemplates.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-1">Template (Optional)</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                onChange={(event) => {
                  const template = availableTemplates.find(t => t.id.toString() === event.target.value);
                  setSelectedTemplate(template ?? null);
                }}
                value={selectedTemplate?.id?.toString() ?? ''}
              >
                <option value="">No template (use default prompt structure)</option>
                {availableTemplates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Prompt Count */}
          <div>
            <label className="block text-sm font-medium mb-1">Number of prompts</label>
            <input
              className="w-full p-2 border border-gray-300 rounded-md"
              max="50"
              min="1"
              onChange={(event) => setPromptCount(Number.parseInt(event.target.value, 10))}
              type="number"
              value={promptCount}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isLoading}
              onClick={handleGenerate}
            >
              {isLoading ? 'Generating...' : 'Generate Alien Prompts'}
            </button>
            
            <button
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={isLoading}
              onClick={resetForm}
            >
              Reset Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlienGeneratorPanel;