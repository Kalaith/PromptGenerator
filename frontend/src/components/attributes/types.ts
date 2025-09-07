export interface AttributeConfig {
  id: number;
  generator_type: string;
  category: string;
  label: string;
  input_type: 'select' | 'multi-select' | 'text' | 'number' | 'checkbox';
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface NewAttributeData {
  category: string;
  label: string;
  input_type: AttributeConfig['input_type'];
  sort_order: number;
}

export interface AttributeManagerProps {
  configs: AttributeConfig[];
  onConfigUpdate: (id: number, updates: Partial<AttributeConfig>) => Promise<void>;
  onToggleActive: (id: number, currentActive: boolean) => Promise<void>;
  onUpdateLabel: (id: number, newLabel: string) => Promise<void>;
  onUpdateInputType: (id: number, newType: AttributeConfig['input_type']) => Promise<void>;
  onUpdateSortOrder: (id: number, newOrder: number) => Promise<void>;
  editingId: number | null;
  setEditingId: (id: number | null) => void;
}