// Blank types available in the game
export const BLANK_TYPES = [
  'Noun',
  'Plural Noun',
  'Verb',
  'Verb ending in -ing',
  'Verb ending in -ed',
  'Verb ending in -s',
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

// Hints and examples for each blank type
export const BLANK_TYPE_HINTS: Record<string, { hint: string; examples: string }> = {
  'Noun': { hint: 'A person, place, or thing', examples: 'cat, pizza, mountain' },
  'Plural Noun': { hint: 'More than one person, place, or thing', examples: 'cats, pizzas, mountains' },
  'Verb': { hint: 'An action word', examples: 'run, eat, sleep' },
  'Verb ending in -ing': { hint: 'An action word ending in -ing', examples: 'running, eating, sleeping' },
  'Verb ending in -ed': { hint: 'A past tense action word', examples: 'jumped, walked, danced' },
  'Verb ending in -s': { hint: 'An action word ending in -s', examples: 'runs, eats, jumps' },
  'Adjective': { hint: 'A word that describes a noun', examples: 'silly, giant, sparkly' },
  'Adverb': { hint: 'A word that describes how something is done', examples: 'quickly, loudly, secretly' },
  'Number': { hint: 'Any number', examples: '7, 42, 1000' },
  'Name': { hint: 'A person\'s name', examples: 'Bob, Sarah, Dr. Whiskers' },
  'Emotion': { hint: 'A feeling', examples: 'happy, confused, hangry' },
  'Positive Emotion': { hint: 'A good feeling', examples: 'joyful, excited, relieved' },
  'Holiday Food': { hint: 'Food you\'d eat during holidays', examples: 'turkey, cookies, eggnog' },
  'Music Genre': { hint: 'A type of music', examples: 'jazz, heavy metal, polka' },
  'Team Name': { hint: 'A team or group name', examples: 'Tigers, Dream Team, Squad Goals' },
  'WGU Team Name': { hint: 'A WGU team or department', examples: 'Labs, Student Success, IT' },
  'Another WGU Team': { hint: 'Another WGU team or department', examples: 'Engineering, Design, QA' },
  'Coworker Name': { hint: 'A coworker\'s name', examples: 'Jim, Karen, The Intern' },
  'Animal': { hint: 'Any animal', examples: 'penguin, llama, goldfish' },
  'Holiday Song': { hint: 'A holiday or Christmas song', examples: 'Jingle Bells, Frosty, All I Want for Christmas' },
  'Holiday Song Title': { hint: 'Name of a holiday song', examples: 'Silent Night, Deck the Halls' },
  'Holiday Movie': { hint: 'A holiday or Christmas movie', examples: 'Elf, Home Alone, Die Hard' },
  'Holiday Character': { hint: 'A holiday character', examples: 'Santa, Rudolph, Grinch' },
  'Exclamation': { hint: 'Something you\'d shout', examples: 'Wow!, Yikes!, Holy moly!' },
  'Loud Noise': { hint: 'A loud sound', examples: 'BANG, CRASH, HONK' },
  'Wild Sound Effect': { hint: 'A crazy sound', examples: 'BOING, SPLAT, WHOOOOSH' },
  'Absurd Quantity': { hint: 'A ridiculous amount', examples: '47 million, a bazillion, 3.5' },
  'Academic Term': { hint: 'A school-related word', examples: 'syllabus, GPA, rubric' },
  'Academic Role': { hint: 'A role in education', examples: 'professor, dean, tutor' },
  'School-Related Noun': { hint: 'Something related to school', examples: 'textbook, homework, exam' },
  'Useless Gadget': { hint: 'A pointless device', examples: 'selfie toaster, pet rock, banana slicer' },
  'Embarrassing Verb': { hint: 'An awkward action', examples: 'snort-laugh, trip, dab' },
  'Plural Holiday Items': { hint: 'Multiple holiday things', examples: 'ornaments, candy canes, presents' },
  'Student Meme Description': { hint: 'A type of student meme', examples: 'procrastination, all-nighter, group project' },
  'Karaoke Song': { hint: 'A song people sing at karaoke', examples: 'Bohemian Rhapsody, Don\'t Stop Believin\'' },
  'Fancy Job Title': { hint: 'An impressive-sounding title', examples: 'Chief Happiness Officer, Synergy Guru' },
  'Very Dramatic Emotion': { hint: 'An over-the-top feeling', examples: 'devastated, euphoric, betrayed' },
  'Final Noun': { hint: 'A person, place, or thing', examples: 'victory, chaos, nap' },
};

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
