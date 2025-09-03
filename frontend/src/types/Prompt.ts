export type Prompt = {
  id: string;
  title: string;
  description: string;
  negativePrompt?: string;
  tags: string[];
  type: string;
  timestamp: number;
};

export type PromptsPayload = {
  image_prompts: Prompt[];
  errors?: string[];
};
