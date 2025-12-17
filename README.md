# Mad Libs Party

A multiplayer Mad Libs party game for up to 40 players. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Create Games**: Host creates a story with customizable blanks (noun, verb, adjective, etc.)
- **Multiplayer**: Up to 40 players can join using a 6-character game code
- **Real-time Updates**: See players join and submit answers in real-time
- **Random Selection**: When the game ends, answers are randomly selected from all submissions
- **PDF Export**: Download the completed story as a PDF

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** - Fast build tool
- **Tailwind CSS v4** - Utility-first styling
- **Lucide React** - Modern icons
- **Sonner** - Toast notifications
- **jsPDF** - PDF generation

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## How to Play

### As a Host
1. Click "Create Game"
2. Enter a title and write your story
3. Select text and click "Insert Blank" to add fill-in-the-blank spots
4. Save and start the game
5. Share the 6-character game code with players
6. End the game when everyone has submitted

### As a Player
1. Enter the game code and your name
2. Fill in all the blanks with your creative answers
3. Submit your answers
4. Wait for the host to end the game and reveal the hilarious story!

## Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── MadlibsGame.tsx
│   └── StoryEditor.tsx
├── types/            # TypeScript types
├── utils/            # Helper functions
├── hooks/            # Custom React hooks
├── App.tsx
└── index.css         # Tailwind CSS
```

## License

MIT

---

Made with fun for WGU Labs
