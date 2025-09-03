import React, { useState, useEffect } from 'react';
import { usePromptStore } from '../stores/promptStore';
import { usePromptGeneration } from '../hooks/usePromptGeneration';
import { useSession } from '../hooks/useSession';
import { PromptApi, TemplateApi, Template } from '../api';

const AlienGeneratorPanel: React.FC = () => {
  const [speciesClass, setSpeciesClass] = useState<string>('random');
  const [promptCount, setPromptCount] = useState<number>(10);
  const [style, setStyle] = useState<string>('random');
  const [environment, setEnvironment] = useState<string>('random');
  const [climate, setClimate] = useState<string>('random');
  const [positiveTrait, setPositiveTrait] = useState<string>('random');
  const [negativeTrait, setNegativeTrait] = useState<string>('random');
  const [gender, setGender] = useState<string>('random');
  const [availableSpeciesClasses, setAvailableSpeciesClasses] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [availableTemplates, setAvailableTemplates] = useState<Template[]>([]);
  
  const addGeneratedPrompts = usePromptStore((state) => state.addGeneratedPrompts);
  const { generateAlienPrompts, loading, error, clearError } = usePromptGeneration();
  const { addToHistory } = useSession();

  // Load available species classes and templates from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load species classes
        const response = await PromptApi.getAlienSpeciesClasses();
        setAvailableSpeciesClasses(response.species_classes);

        // Load alien templates
        const templates = await TemplateApi.getPublicTemplates('alien');
        setAvailableTemplates(templates);
      } catch (error) {
        console.error('Failed to load data:', error);
        // Fallback to empty arrays - user can still generate
        setAvailableSpeciesClasses([]);
        setAvailableTemplates([]);
      }
    };

    loadData();
  }, []);

  const handleGenerate = async () => {
    clearError();
    
    const safeCount = Math.max(1, Math.floor(Number(promptCount) || 1));
    
    try {
      let generationParams = {
        count: safeCount,
        species_class: speciesClass === 'random' ? undefined : speciesClass,
        climate: climate === 'random' ? undefined : climate,
        positive_trait: positiveTrait === 'random' ? undefined : positiveTrait,
        negative_trait: negativeTrait === 'random' ? undefined : negativeTrait,
        style: style === 'random' ? undefined : style,
        environment: environment === 'random' ? undefined : environment,
        gender: gender === 'random' ? undefined : gender,
      };

      // Apply template if selected
      if (selectedTemplate) {
        generationParams = TemplateApi.applyTemplate(selectedTemplate, generationParams);
        // Increment template usage count
        try {
          await TemplateApi.useTemplate(selectedTemplate.id);
        } catch (err) {
          console.warn('Failed to update template usage:', err);
        }
      }

      const apiPrompts = await generateAlienPrompts(generationParams);
      
      if (apiPrompts.length > 0) {
        addGeneratedPrompts(apiPrompts);
        
        // Add to history
        for (const prompt of apiPrompts) {
          try {
            await addToHistory({
              id: prompt.id,
              title: prompt.title,
              description: prompt.description,
              type: prompt.prompt_type,
              timestamp: new Date().toISOString(),
            });
          } catch (historyError) {
            console.warn('Failed to add to history:', historyError);
            // Continue - don't block UI for history failures
          }
        }
      }
    } catch (error) {
      console.error('Alien generation failed:', error);
      // Error is already set by the hook
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4">Alien Generator Panel</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" htmlFor="speciesClass">
          Species Class
        </label>
        <select
          id="speciesClass"
          value={speciesClass}
          onChange={(e) => setSpeciesClass(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          disabled={loading}
        >
          <option value="random">Random</option>
          {availableSpeciesClasses.map((cls) => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" htmlFor="gender">
          Gender (Optional)
        </label>
        <select
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          disabled={loading}
        >
          <option value="random">Random</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" htmlFor="climate">
          Climate (Optional)
        </label>
        <input
          id="climate"
          type="text"
          value={climate === 'random' ? '' : climate}
          onChange={(e) => setClimate(e.target.value || 'random')}
          placeholder="e.g., Desert, Ocean, Tropical (leave blank for random)"
          className="w-full p-2 border border-gray-300 rounded-md"
          disabled={loading}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" htmlFor="style">
          Artistic Style (Optional)
        </label>
        <input
          id="style"
          type="text"
          value={style === 'random' ? '' : style}
          onChange={(e) => setStyle(e.target.value || 'random')}
          placeholder="e.g., cyberpunk, fantasy, realistic (leave blank for random)"
          className="w-full p-2 border border-gray-300 rounded-md"
          disabled={loading}
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" htmlFor="template">
          Template (Optional)
        </label>
        <select
          id="template"
          value={selectedTemplate?.id || ''}
          onChange={(e) => {
            const templateId = e.target.value;
            const template = templateId ? availableTemplates.find(t => t.id === Number(templateId)) : null;
            setSelectedTemplate(template || null);
          }}
          className="w-full p-2 border border-gray-300 rounded-md"
          disabled={loading}
        >
          <option value="">No Template</option>
          {availableTemplates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name} ({template.usage_count} uses)
            </option>
          ))}
        </select>
        {selectedTemplate && (
          <div className="mt-2 p-2 bg-green-50 rounded text-xs">
            <div className="font-medium">{selectedTemplate.name}</div>
            <div className="text-gray-600">{selectedTemplate.description}</div>
          </div>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" htmlFor="promptCount">
          Prompt Count
        </label>
        <input
          id="promptCount"
          type="number"
          min={1}
          max={100}
          value={promptCount}
          onChange={(e) => setPromptCount(Math.max(1, Math.floor(Number(e.target.value) || 1)))}
          className="w-full p-2 border border-gray-300 rounded-md"
          disabled={loading}
        />
      </div>
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Generating...' : 'Generate Aliens'}
      </button>
    </div>
  );
};

export default AlienGeneratorPanel;
