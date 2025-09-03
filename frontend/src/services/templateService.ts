import { TemplateApi, Template } from '../api';
import type { GeneratePromptsRequest, GenerateAlienRequest } from '../api/types';
import { AppError, AppErrorHandler, ErrorType } from '../types/errors';

export interface TemplateApplicationResult<T> {
  enhancedParams: T;
  templateUsed?: Template;
  error?: AppError;
}

export class TemplateService {
  /**
   * Apply template to generation parameters and increment usage
   */
  static async applyAndUseTemplate<T extends GeneratePromptsRequest | GenerateAlienRequest>(
    template: Template | null,
    parameters: T
  ): Promise<TemplateApplicationResult<T>> {
    if (!template) {
      return { enhancedParams: parameters };
    }

    try {
      // Apply template parameters
      const templateAppliedParams = TemplateApi.applyTemplate(template, parameters);
      const enhancedParams = { ...parameters, ...templateAppliedParams } as T;

      // Increment template usage count asynchronously
      try {
        await TemplateApi.useTemplate(template.id);
      } catch (usageError) {
        console.warn('Failed to update template usage:', usageError);
        // Continue execution - usage tracking is not critical
      }

      return {
        enhancedParams,
        templateUsed: template,
      };
    } catch (error) {
      const appError = AppErrorHandler.createError(
        ErrorType.API,
        'Failed to apply template',
        'TEMPLATE_APPLICATION_ERROR',
        { templateId: template.id, originalError: error }
      );

      return {
        enhancedParams: parameters,
        error: appError,
      };
    }
  }

  /**
   * Validate template compatibility with generation type
   */
  static validateTemplateCompatibility(
    template: Template,
    generationType: 'anime' | 'alien' | 'adventurer'
  ): AppError | null {
    const templateType = template.template_data.type || template.type;
    
    if (templateType !== generationType) {
      return AppErrorHandler.createError(
        ErrorType.VALIDATION,
        `Template type '${templateType}' is not compatible with generation type '${generationType}'`,
        'TEMPLATE_TYPE_MISMATCH',
        { templateType, generationType }
      );
    }

    return null;
  }

  /**
   * Get template preview data for display
   */
  static getTemplatePreview(template: Template): {
    name: string;
    description: string;
    usageCount: number;
    compatibility: string[];
    previewFields: Record<string, string>;
  } {
    const templateData = template.template_data;
    const previewFields: Record<string, string> = {};

    // Extract meaningful fields for preview
    Object.entries(templateData).forEach(([key, value]) => {
      if (typeof value === 'string' && value.length <= 50) {
        previewFields[key] = value;
      } else if (Array.isArray(value) && value.length <= 3) {
        previewFields[key] = value.join(', ');
      }
    });

    return {
      name: template.name,
      description: template.description || 'No description available',
      usageCount: template.usage_count || 0,
      compatibility: [template.type || 'unknown'],
      previewFields,
    };
  }
}