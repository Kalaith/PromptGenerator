export interface Template {
  id: number;
  name: string;
  description?: string;
  type: string;
  template_data: Record<string, unknown>;
  is_public: boolean;
  is_active: boolean;
  created_by?: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTemplateRequest {
  name: string;
  description?: string;
  type: string;
  template_data: Record<string, unknown>;
  is_public?: boolean;
  created_by?: string;
}

export interface UpdateTemplateRequest {
  name?: string;
  description?: string;
  template_data?: Record<string, unknown>;
  is_public?: boolean;
}

export interface TemplateFilters {
  type?: string;
  public_only?: boolean;
  created_by?: string;
  order_by?: string;
  order_direction?: 'asc' | 'desc';
}