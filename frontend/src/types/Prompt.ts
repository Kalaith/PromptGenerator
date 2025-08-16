export type Prompt = {
  id: string;
  title: string;
  description: string;
  negative_prompt?: string;
  tags: string[];
};

export type PromptsPayload = {
  image_prompts: Prompt[];
  errors?: string[];
};
