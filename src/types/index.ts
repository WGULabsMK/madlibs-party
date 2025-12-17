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
  showResultsToPlayers: boolean;
  createdAt: string;
  updatedAt: string;
}

// AI Trivia questions for the waiting screen
export interface TriviaQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const AI_TRIVIA: TriviaQuestion[] = [
  {
    question: "What year was the term 'Artificial Intelligence' first coined?",
    options: ["1943", "1956", "1969", "1984"],
    correctIndex: 1,
    explanation: "The term was coined by John McCarthy at the Dartmouth Conference in 1956, which is considered the birth of AI as a field."
  },
  {
    question: "Which company created ChatGPT?",
    options: ["Google", "Microsoft", "OpenAI", "Meta"],
    correctIndex: 2,
    explanation: "ChatGPT was created by OpenAI and released in November 2022."
  },
  {
    question: "What does 'GPT' stand for in ChatGPT?",
    options: ["General Purpose Technology", "Generative Pre-trained Transformer", "Global Processing Tool", "Graphical Processing Terminal"],
    correctIndex: 1,
    explanation: "GPT stands for Generative Pre-trained Transformer, a type of large language model architecture."
  },
  {
    question: "Which AI beat the world champion at the game of Go in 2016?",
    options: ["Watson", "AlphaGo", "Deep Blue", "Siri"],
    correctIndex: 1,
    explanation: "Google DeepMind's AlphaGo defeated Lee Sedol, one of the world's best Go players, in a historic match."
  },
  {
    question: "What is the 'Turing Test' designed to measure?",
    options: ["Processing speed", "Memory capacity", "Machine intelligence", "Energy efficiency"],
    correctIndex: 2,
    explanation: "The Turing Test, proposed by Alan Turing in 1950, measures a machine's ability to exhibit intelligent behavior indistinguishable from a human."
  },
  {
    question: "Which AI assistant was introduced by Apple in 2011?",
    options: ["Alexa", "Cortana", "Siri", "Google Assistant"],
    correctIndex: 2,
    explanation: "Siri was introduced with the iPhone 4S in October 2011, making it one of the first mainstream AI assistants."
  },
  {
    question: "What is 'machine learning'?",
    options: ["Robots learning to walk", "AI that improves from experience", "Computers that can read", "Software that types faster"],
    correctIndex: 1,
    explanation: "Machine learning is a subset of AI where systems learn and improve from experience without being explicitly programmed."
  },
  {
    question: "Which company created the AI assistant 'Claude'?",
    options: ["OpenAI", "Google", "Anthropic", "Microsoft"],
    correctIndex: 2,
    explanation: "Claude was created by Anthropic, an AI safety company founded in 2021."
  },
  {
    question: "What was IBM's chess-playing AI called that beat Kasparov in 1997?",
    options: ["Watson", "Deep Blue", "AlphaZero", "HAL 9000"],
    correctIndex: 1,
    explanation: "Deep Blue defeated world chess champion Garry Kasparov in 1997, a landmark moment in AI history."
  },
  {
    question: "What is a 'neural network' inspired by?",
    options: ["Computer circuits", "The human brain", "Spider webs", "The internet"],
    correctIndex: 1,
    explanation: "Neural networks are computing systems inspired by biological neural networks in the human brain."
  },
  {
    question: "What does 'LLM' stand for in AI?",
    options: ["Large Language Model", "Linear Learning Machine", "Logical Logic Module", "Local Learning Method"],
    correctIndex: 0,
    explanation: "LLM stands for Large Language Model, which are AI models trained on vast amounts of text data."
  },
  {
    question: "Which sci-fi movie features an AI called 'HAL 9000'?",
    options: ["The Terminator", "2001: A Space Odyssey", "The Matrix", "Blade Runner"],
    correctIndex: 1,
    explanation: "HAL 9000 is the sentient computer in Stanley Kubrick's '2001: A Space Odyssey' (1968)."
  },
  {
    question: "What is 'prompt engineering'?",
    options: ["Building AI hardware", "Crafting effective AI inputs", "Programming robots", "Designing computer chips"],
    correctIndex: 1,
    explanation: "Prompt engineering is the practice of designing and refining inputs to get desired outputs from AI models."
  },
  {
    question: "Approximately how many parameters does GPT-4 have?",
    options: ["1 million", "1 billion", "100 billion", "Over 1 trillion"],
    correctIndex: 3,
    explanation: "GPT-4 is estimated to have over 1 trillion parameters, though OpenAI hasn't confirmed the exact number."
  },
  {
    question: "What is 'AI hallucination'?",
    options: ["AI dreaming", "AI generating false information confidently", "AI crashing", "AI learning too fast"],
    correctIndex: 1,
    explanation: "AI hallucination refers to when an AI model generates plausible-sounding but incorrect or fabricated information."
  },
  {
    question: "Which company developed the AI image generator DALL-E?",
    options: ["Adobe", "OpenAI", "NVIDIA", "Stability AI"],
    correctIndex: 1,
    explanation: "DALL-E was created by OpenAI and named as a portmanteau of Salvador Dalí and Pixar's WALL-E."
  },
  {
    question: "What is 'natural language processing' (NLP)?",
    options: ["AI understanding human language", "Computers speaking faster", "Translating code", "Voice recording"],
    correctIndex: 0,
    explanation: "NLP is a branch of AI that helps computers understand, interpret, and generate human language."
  },
  {
    question: "In what decade was the first AI program written?",
    options: ["1930s", "1950s", "1970s", "1990s"],
    correctIndex: 1,
    explanation: "The first AI programs were written in the 1950s, including the Logic Theorist in 1956."
  },
  {
    question: "What is 'reinforcement learning'?",
    options: ["Making AI stronger", "AI learning through rewards and penalties", "Backing up AI data", "Repeating AI training"],
    correctIndex: 1,
    explanation: "Reinforcement learning is a type of ML where an agent learns to make decisions by receiving rewards or penalties."
  },
  {
    question: "Which company's AI won at Jeopardy! in 2011?",
    options: ["Google", "IBM", "Microsoft", "Amazon"],
    correctIndex: 1,
    explanation: "IBM's Watson defeated Jeopardy! champions Ken Jennings and Brad Rutter in 2011."
  }
];

// View types for navigation
export type ViewType = 'home' | 'admin-login' | 'admin-dashboard' | 'admin-create' | 'admin-edit' | 'admin-game' | 'player-game';

// Admin password (in production, this would be environment variable or backend auth)
export const ADMIN_PASSWORD = 'madlibs2024';

// Alert types
export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertState {
  message: string;
  variant: AlertVariant;
}

// Player answers (before submission)
export type PlayerAnswers = Record<string, string>;
