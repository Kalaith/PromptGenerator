export interface SpeciesData {
  species: string;
  ears?: string;
  features: string[];
  personality: string[];
  negative_prompt: string;
  descriptionTemplate?: string; // Optional property for description templates
  wings?: string; // Optional property for wings
  tail?: string; // Optional property for tail
}
