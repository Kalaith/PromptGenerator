export interface AttributeOption {
  value: string;
  label: string | null;
  weight: number;
}

export interface AttributeConfig {
  label: string;
  type: 'select' | 'multi-select';
  options: AttributeOption[];
}

export interface AnimeAttributesResponse {
  success: boolean;
  data: {
    attributes: Record<string, AttributeConfig>;
  };
}