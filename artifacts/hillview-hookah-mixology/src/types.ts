import type { Flavour, Strength } from './data/flavours';

export type CustomLevel = 'Less' | 'Normal' | 'More';

export type FinderAnswers = {
  tastes: string[];
  strength: Strength;
  favouriteId: string | null;
  avoid: string[];
  surprise: boolean;
};

export type Choice = {
  flavourIds: string[];
  tastes: string[];
  strength: Strength;
  favouriteId: string | null;
  avoid: string[];
  customizations: Record<string, CustomLevel>;
  remarks: string;
  chosenAt: string;
};

export type MixView = {
  flavours: Flavour[];
  answer: FinderAnswers;
  customizations: Record<string, CustomLevel>;
};