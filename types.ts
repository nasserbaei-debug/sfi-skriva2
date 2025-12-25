
export enum SfiLevel {
  B = 'B',
  C = 'C',
  D = 'D'
}

export interface TextGenerationResult {
  title: string;
  content: string;
  vocabulary: { word: string; translation: string }[];
  questions: string[];
}

export interface AppState {
  topic: string;
  level: SfiLevel;
  isLoading: boolean;
  result: TextGenerationResult | null;
  error: string | null;
}
