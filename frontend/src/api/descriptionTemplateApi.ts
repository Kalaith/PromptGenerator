import { apiClient, ApiResponse } from './client';

export interface DescriptionTemplate {
  id: number;
  name: string;
  generator_type: string;
  template: string;
  description: string;
  is_active: boolean;
  is_default: boolean;
  available_placeholders: string[];
  preview: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDescriptionTemplateRequest {
  name: string;
  generator_type: string;
  template: string;
  description?: string;
  is_active?: boolean;
  is_default?: boolean;
}

export interface UpdateDescriptionTemplateRequest {
  name?: string;
  generator_type?: string;
  template?: string;
  description?: string;
  is_active?: boolean;
  is_default?: boolean;
}

export interface DescriptionTemplatesResponse {
  success: boolean;
  data: DescriptionTemplate[];
}

export interface DescriptionTemplateResponse {
  success: boolean;
  data: DescriptionTemplate;
}

export interface DescriptionTemplateActionResponse {
  success: boolean;
  message?: string;
  error?: string;
  validation_errors?: string[];
}

export class DescriptionTemplateApi {
  /**
   * Get description templates by generator type
   */
  static async getByGeneratorType(generatorType: string): Promise<DescriptionTemplate[]> {
    const response = await apiClient.get<DescriptionTemplatesResponse>(
      `/description-templates?generator_type=${generatorType}`
    );
    return response.data;
  }

  /**
   * Get a specific description template by ID
   */
  static async getById(id: number): Promise<DescriptionTemplate> {
    const response = await apiClient.get<DescriptionTemplateResponse>(
      `/description-templates/${id}`
    );
    return response.data;
  }

  /**
   * Create a new description template
   */
  static async create(templateData: CreateDescriptionTemplateRequest): Promise<DescriptionTemplateActionResponse> {
    return await apiClient.post<DescriptionTemplateActionResponse>(
      '/description-templates',
      templateData
    );
  }

  /**
   * Update an existing description template
   */
  static async update(id: number, templateData: UpdateDescriptionTemplateRequest): Promise<DescriptionTemplateActionResponse> {
    return await apiClient.put<DescriptionTemplateActionResponse>(
      `/description-templates/${id}`,
      templateData
    );
  }

  /**
   * Delete a description template
   */
  static async delete(id: number): Promise<DescriptionTemplateActionResponse> {
    return await apiClient.delete<DescriptionTemplateActionResponse>(
      `/description-templates/${id}`
    );
  }

  /**
   * Get all available generator types
   */
  static async getGeneratorTypes(): Promise<string[]> {
    const response = await apiClient.get<{ success: boolean; generator_types: string[] }>(
      '/description-templates/generator-types'
    );
    return response.generator_types;
  }
}
