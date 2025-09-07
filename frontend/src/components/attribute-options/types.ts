export interface AttributeCategory {
  category: string;
  label: string;
  input_type: string;
  option_count: number;
}

export interface AttributeOption {
  id: number;
  value: string;
  label: string;
  weight: number;
}

export interface NewOptionData {
  name: string;
  value: string;
  weight: number;
}

export interface EditOptionData {
  name: string;
  value: string;
  weight: number;
}