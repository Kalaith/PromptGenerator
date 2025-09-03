import { apiClient, ApiResponse } from './client';
import type {
  Template,
  CreateTemplateRequest,
  UpdateTemplateRequest,
  TemplateFilters,
} from './types';

export interface TemplatesResponse {
  success: boolean;
  templates: Template[];
}

export interface TemplateResponse {
  success: boolean;
  template: Template;
}

export interface TemplateActionResponse {
  success: boolean;
  message?: string;
}

export class TemplateApi {
  /**
   * Get all templates with optional filters
   */
  static async getTemplates(filters?: TemplateFilters): Promise<Template[]> {
    const params = new URLSearchParams();
    
    if (filters?.type) params.append('type', filters.type);
    if (filters?.public_only !== undefined) params.append('public_only', String(filters.public_only));
    if (filters?.created_by) params.append('created_by', filters.created_by);
    if (filters?.order_by) params.append('order_by', filters.order_by);
    if (filters?.order_direction) params.append('order_direction', filters.order_direction);

    const query = params.toString();
    const endpoint = `/templates${query ? `?${query}` : ''}`;
    
    const response = await apiClient.get<TemplatesResponse>(endpoint);
    return response.templates;
  }

  /**
   * Get template by ID
   */
  static async getTemplate(id: number): Promise<Template> {
    const response = await apiClient.get<TemplateResponse>(`/templates/${id}`);
    return response.template;
  }

  /**
   * Create new template
   */
  static async createTemplate(data: CreateTemplateRequest): Promise<Template> {
    const response = await apiClient.post<TemplateResponse>('/templates', data);
    return response.template;
  }

  /**
   * Update template
   */
  static async updateTemplate(id: number, data: UpdateTemplateRequest): Promise<Template> {
    const response = await apiClient.put<TemplateResponse>(`/templates/${id}`, data);
    return response.template;
  }

  /**
   * Delete template (soft delete)
   */
  static async deleteTemplate(id: number): Promise<void> {
    await apiClient.delete<TemplateActionResponse>(`/templates/${id}`);
  }

  /**
   * Get popular templates
   */
  static async getPopularTemplates(type?: 'anime' | 'alien', limit: number = 10): Promise<Template[]> {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    params.append('limit', String(limit));

    const query = params.toString();
    const endpoint = `/templates/popular${query ? `?${query}` : ''}`;
    
    const response = await apiClient.get<TemplatesResponse>(endpoint);
    return response.templates;
  }

  /**
   * Get recent templates
   */
  static async getRecentTemplates(type?: 'anime' | 'alien', limit: number = 10): Promise<Template[]> {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    params.append('limit', String(limit));

    const query = params.toString();
    const endpoint = `/templates/recent${query ? `?${query}` : ''}`;
    
    const response = await apiClient.get<TemplatesResponse>(endpoint);
    return response.templates;
  }

  /**
   * Search templates
   */
  static async searchTemplates(query: string, type?: 'anime' | 'alien'): Promise<Template[]> {
    const params = new URLSearchParams();
    params.append('q', query);
    if (type) params.append('type', type);

    const queryString = params.toString();
    const endpoint = `/templates/search?${queryString}`;
    
    const response = await apiClient.get<TemplatesResponse>(endpoint);
    return response.templates;
  }

  /**
   * Increment template usage count
   */
  static async useTemplate(id: number): Promise<void> {
    await apiClient.post<TemplateActionResponse>(`/templates/${id}/use`);
  }

  /**
   * Clone a template
   */
  static async cloneTemplate(id: number, name: string, createdBy?: string): Promise<Template> {
    const response = await apiClient.post<TemplateResponse>(`/templates/${id}/clone`, {
      name,
      created_by: createdBy || 'user',
    });
    return response.template;
  }

  /**
   * Get public templates (convenience method)
   */
  static async getPublicTemplates(type?: 'anime' | 'alien'): Promise<Template[]> {
    const filters: TemplateFilters = {
      public_only: true,
      order_by: 'usage_count',
      order_direction: 'desc',
    };
    if (type) {
      filters.type = type;
    }
    return this.getTemplates(filters);
  }

  /**
   * Get user's templates (convenience method)
   */
  static async getUserTemplates(createdBy: string, type?: 'anime' | 'alien'): Promise<Template[]> {
    const filters: TemplateFilters = {
      created_by: createdBy,
      order_by: 'created_at',
      order_direction: 'desc',
    };
    if (type) {
      filters.type = type;
    }
    return this.getTemplates(filters);
  }

  /**
   * Apply template to generation parameters
   * This is a client-side utility function
   */
  static applyTemplate<T extends Record<string, unknown>>(template: Template, parameters: T): Partial<T> {
    const templateData = template.template_data;
    const result: Record<string, unknown> = { ...parameters };

    // Merge template data with parameters, giving precedence to user parameters
    for (const [key, value] of Object.entries(templateData)) {
      if (result[key] === undefined || result[key] === 'random' || result[key] === '') {
        result[key] = value;
      }
    }

    return result as Partial<T>;
  }

  /**
   * Validate template data structure based on type
   */
  static validateTemplateData(templateData: Record<string, unknown>, type: 'anime' | 'alien'): string[] {
    const errors: string[] = [];

    if (!templateData || typeof templateData !== 'object') {
      errors.push('Template data must be an object');
      return errors;
    }

    if (type === 'anime') {
      // Valid fields for anime templates
      const validFields = ['species', 'traits', 'style_modifiers', 'negative_prompts', 'gender', 'outfit'];
      
      for (const field of Object.keys(templateData)) {
        if (!validFields.includes(field)) {
          errors.push(`Unknown field for anime template: ${field}`);
        }
      }
    } else if (type === 'alien') {
      // Valid fields for alien templates
      const validFields = ['species_class', 'traits', 'climate', 'environment', 'style_modifiers', 'negative_prompts', 'gender'];
      
      for (const field of Object.keys(templateData)) {
        if (!validFields.includes(field)) {
          errors.push(`Unknown field for alien template: ${field}`);
        }
      }
    }

    return errors;
  }
}