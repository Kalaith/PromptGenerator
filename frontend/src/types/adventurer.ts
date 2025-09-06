export interface AdventurerOptions {
  races: string[];
  classes: string[];
  experienceLevels: string[];
  genders: string[];
  artisticStyles: string[];
  environments: string[];
  hairColors: string[];
  skinColors: string[];
  eyeColors: string[];
  eyeStyles: string[];
}

export interface AdventurerFormData {
  race: string;
  className: string;
  experience: string;
  gender: string;
  style: string;
  environment: string;
  hairColor: string;
  skinColor: string;
  eyeColor: string;
  eyeStyle: string;
}

export interface AdventurerGenerationParams {
  count: number;
  race?: string | undefined;
  class?: string | undefined;
  experience?: string | undefined;
  gender?: string | undefined;
  style?: string | undefined;
  environment?: string | undefined;
  hairColor?: string | undefined;
  skinColor?: string | undefined;
  eyeColor?: string | undefined;
  eyeStyle?: string | undefined;
}