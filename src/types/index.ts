// Blank types available in the game
export const BLANK_TYPES = [
  'Noun',
  'Plural Noun',
  'Verb',
  'Verb ending in -ing',
  'Adjective',
  'Adverb',
  'Number',
  'Name',
  'Emotion',
  'Holiday Food',
  'Music Genre',
  'Team Name',
  'Coworker Name',
  'Animal',
  'Holiday Song Title',
] as const;

export type BlankType = (typeof BLANK_TYPES)[number] | string;

// Maximum players allowed per game
export const MAX_PLAYERS = 40;

// A blank in the story
export interface Blank {
  id: string;
  type: BlankType;
  index: number;
}

// A player in the game
export interface Player {
  name: string;
  joinedAt: string;
}

// A submission for a blank from a player
export interface Submission {
  playerId: string;
  playerName: string;
  answer: string;
  submittedAt: string;
}

// Selected answer for a blank (after game ends)
export interface SelectedAnswer {
  answer: string;
  playerId: string;
  playerName: string;
}

// Game status
export type GameStatus = 'draft' | 'active' | 'ended';

// The main game data structure
export interface Game {
  code: string;
  title: string;
  story: string;
  blanks: Blank[];
  status: GameStatus;
  players: Record<string, Player>;
  submissions: Record<string, Submission[]>;
  selectedAnswers: Record<string, SelectedAnswer> | null;
  createdAt: string;
  updatedAt: string;
}

// View types for navigation
export type ViewType = 'home' | 'admin-create' | 'admin-edit' | 'admin-game' | 'player-game';

// Alert types
export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertState {
  message: string;
  variant: AlertVariant;
}

// Player answers (before submission)
export type PlayerAnswers = Record<string, string>;
