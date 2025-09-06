import { useState, useEffect } from 'react';
import { PromptApi } from '../api/promptApi';
import { ImageApi } from '../api/imageApi';
import { apiClient } from '../api/client';
import type { GeneratePromptsRequest } from '../api/types';
import type { DescriptionTemplate } from '../api/descriptionTemplateApi';
import { usePromptGeneration } from './usePromptGeneration';
import { useSession } from './useSession';
import { usePromptStore } from '../stores/promptStore';
import { GeneratorTypeConfig } from '../config/generatorTypes';
import { APP_CONSTANTS } from '../constants/app';
import { logger } from '../utils/logger';

interface AttributeConfig {
  id: number;
  generator_type: string;
  category: string;
  label: string;
  input_type: 'select' | 'multi-select' | 'text' | 'number' | 'checkbox';
  is_active: boolean;
  sort_order: number;
}

interface UseUnifiedGeneratorProps {
  config: GeneratorTypeConfig;
}

export const useUnifiedGenerator = ({ config }: UseUnifiedGeneratorProps) => {
  const [promptCount, setPromptCount] = useState<number>(APP_CONSTANTS.PROMPT_COUNT.DEFAULT);
  const [species, setSpecies] = useState<string>('random');
  const [availableSpecies, setAvailableSpecies] = useState<string[]>([]);
  const [availableTemplates, setAvailableTemplates] = useState<DescriptionTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<DescriptionTemplate | null>(null);
  const [attributeConfigs, setAttributeConfigs] = useState<AttributeConfig[]>([]);
  const [attributeOptions, setAttributeOptions] = useState<Record<string, Array<{label: string, value: string}>>>({});
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  
  // Image generation state
  const [imageGenerationEnabled, setImageGenerationEnabled] = useState<boolean>(false);
  const [imageWidth, setImageWidth] = useState<number>(1024);
  const [imageHeight, setImageHeight] = useState<number>(1024);

  const addGeneratedPrompts = usePromptStore((state) => state.addGeneratedPrompts);
  const { generateAnimePrompts, loading, error, clearError } = usePromptGeneration();
  const { addToHistory } = useSession();

  // Load initial data
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        logger.debug('Loading generator data', { 
          component: 'useUnifiedGenerator',
          generatorType: config.apiType 
        });

        const [speciesResponse, attributeConfigResponse] = await Promise.all([
          PromptApi.getSpecies(),
          apiClient.get<{ success: boolean; data: AttributeConfig[] }>('/attribute-config')
        ]);
        
        if (speciesResponse.success) {
          setAvailableSpecies(speciesResponse.data.species.map(s => s.name));
        }
        
        // Filter attribute configs for this generator type
        if (attributeConfigResponse.success) {
          logger.debug('Loading attribute configs', { 
            component: 'useUnifiedGenerator',
            allConfigs: attributeConfigResponse.data.length,
            generatorType: config.apiType 
          });
          
          const relevantConfigs = attributeConfigResponse.data
            .filter(attrConfig => attrConfig.generator_type === config.apiType && attrConfig.is_active)
            .sort((a, b) => a.sort_order - b.sort_order);
          
          logger.debug('Filtered attribute configs', { 
            component: 'useUnifiedGenerator',
            generatorType: config.apiType,
            configCount: relevantConfigs.length 
          });
          setAttributeConfigs(relevantConfigs);
          
          // Initialize selected attributes with 'any' for all configured categories
          const initialAttributes: Record<string, string> = {};
          relevantConfigs.forEach(config => {
            initialAttributes[config.category] = 'any';
          });
          setSelectedAttributes(initialAttributes);
          logger.debug('Initialized default attributes', { 
            component: 'useUnifiedGenerator',
            attributeCount: Object.keys(initialAttributes).length 
          });
          
          // Load options for all categories at once
          try {
            logger.debug('Loading attribute options', { 
              component: 'useUnifiedGenerator',
              generatorType: config.apiType 
            });
            const optionsResponse = await PromptApi.getGeneratorAttributes(config.apiType);
            
            if (optionsResponse?.data?.attributes) {
              const optionsMap: Record<string, Array<{label: string, value: string}>> = {};
              
              // Map the response data to our internal format
              Object.entries(optionsResponse.data.attributes).forEach(([category, categoryData]: [string, any]) => {
                optionsMap[category] = categoryData.options || [];
              });
              
              logger.debug('Loaded attribute options', { 
                component: 'useUnifiedGenerator',
                categoryCount: Object.keys(optionsMap).length 
              });
              setAttributeOptions(optionsMap);
            }
          } catch (error) {
            logger.error('Failed to load attribute options', { 
              component: 'useUnifiedGenerator',
              error: error instanceof Error ? error.message : 'Unknown error' 
            });
          }
        }
      } catch (error) {
        logger.error('Failed to load generator data', { 
          component: 'useUnifiedGenerator',
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    };
    
    void loadData();
  }, [config.id, config.apiType]);

  const handleGenerate = async (): Promise<void> => {
    clearError();
    
    const safeCount = Math.max(APP_CONSTANTS.PROMPT_COUNT.MIN, Math.min(promptCount, APP_CONSTANTS.PROMPT_COUNT.MAX_SAFE));
    
    const request: GeneratePromptsRequest = {
      count: safeCount,
      type: config.apiType,
      species: species === 'random' ? 'random' : species,
      attributes: selectedAttributes,
      ...(selectedTemplate?.id && { templateId: selectedTemplate.id }),
    };

    logger.debug('Generating prompts', { 
      component: 'useUnifiedGenerator',
      generatorType: config.name,
      request,
      selectedAttributeCount: Object.keys(selectedAttributes).length,
      configCount: attributeConfigs.length 
    });

    try {
      const apiPrompts = await generateAnimePrompts(request);
      
      if (apiPrompts.length > 0) {
        addGeneratedPrompts(apiPrompts);
        
        for (const prompt of apiPrompts) {
          try {
            await addToHistory({
              id: prompt.id,
              title: prompt.title,
              description: prompt.description,
              tags: prompt.tags,
              timestamp: Date.now(),
            });

            // Queue image generation if enabled
            if (imageGenerationEnabled) {
              try {
                await ImageApi.queueImageGeneration({
                  prompt_id: prompt.id,
                  generator_type: config.apiType,
                  prompt_text: prompt.description,
                  width: imageWidth,
                  height: imageHeight,
                  generation_params: {
                    style: config.apiType,
                    species: species !== 'random' ? species : undefined,
                    attributes: selectedAttributes,
                    template_id: selectedTemplate?.id,
                  },
                });

                logger.info('Image generation queued', {
                  component: 'useUnifiedGenerator',
                  promptId: prompt.id,
                  dimensions: `${imageWidth}x${imageHeight}`,
                });
              } catch (queueError) {
                logger.warn('Failed to queue image generation', {
                  component: 'useUnifiedGenerator',
                  promptId: prompt.id,
                  error: queueError instanceof Error ? queueError.message : 'Unknown error',
                });
              }
            }
          } catch (historyError) {
            logger.warn('Failed to add prompt to history', { 
              component: 'useUnifiedGenerator',
              error: historyError instanceof Error ? historyError.message : 'Unknown error' 
            });
          }
        }
      }
    } catch (generationError) {
      logger.error('Prompt generation failed', { 
        component: 'useUnifiedGenerator',
        error: generationError instanceof Error ? generationError.message : 'Unknown error' 
      });
    }
  };

  const updateSelectedAttribute = (category: string, value: string): void => {
    setSelectedAttributes(prev => ({
      ...prev,
      [category]: value === '' ? 'any' : value
    }));
  };

  return {
    // State
    promptCount,
    species,
    availableSpecies,
    availableTemplates,
    selectedTemplate,
    attributeConfigs,
    attributeOptions,
    selectedAttributes,
    
    // Image generation state
    imageGenerationEnabled,
    imageWidth,
    imageHeight,
    
    // Actions
    setPromptCount,
    setSpecies,
    setSelectedTemplate,
    updateSelectedAttribute,
    handleGenerate,
    
    // Image generation actions
    setImageGenerationEnabled,
    setImageWidth,
    setImageHeight,
    
    // Status
    loading,
    error,
    clearError,
  };
};