import { useState } from 'react';
import {
  Bug,
  Users,
  UserPlus,
  Play,
  Square,
  Send,
  Eye,
  Trash2,
  Home,
  Edit3,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { Button } from './ui';
import { generateId } from '@/utils/helpers';
import { MAX_PLAYERS } from '@/types';
import type { Game } from '@/types';

interface DevBarProps {
  currentGame: Game | null;
  onGameUpdate: (game: Game) => void;
  onNavigate: (view: 'home' | 'admin-create' | 'admin-game' | 'player-game') => void;
  onLoadSample: () => void;
  onSaveGame: () => void;
  onStartGame: () => void;
  onEndGame: () => void;
  setPlayerId: (id: string) => void;
  setPlayerName: (name: string) => void;
  saveGameToStorage: (code: string, game: Game) => void;
}

export function DevBar({
  currentGame,
  onGameUpdate,
  onNavigate,
  onLoadSample,
  onSaveGame,
  onStartGame,
  onEndGame,
  setPlayerId,
  setPlayerName,
  saveGameToStorage,
}: DevBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Only show in development
  if (import.meta.env.PROD) return null;

  const addFakePlayers = (count: number = 5) => {
    if (!currentGame) return;

    const players = { ...currentGame.players };
    for (let i = 0; i < count; i++) {
      const id = generateId();
      players[id] = {
        name: `Player${Object.keys(players).length + 1}`,
        joinedAt: new Date().toISOString(),
      };
    }

    const updated: Game = {
      ...currentGame,
      players,
      updatedAt: new Date().toISOString(),
    };

    saveGameToStorage(updated.code, updated);
    onGameUpdate(updated);
  };

  const addMassPlayers = () => {
    if (!currentGame) return;

    const players = { ...currentGame.players };
    const remaining = Math.max(0, MAX_PLAYERS - Object.keys(players).length);

    for (let i = 0; i < remaining; i++) {
      const id = generateId();
      players[id] = {
        name: `Player${Object.keys(players).length + 1}`,
        joinedAt: new Date().toISOString(),
      };
    }

    const updated: Game = {
      ...currentGame,
      players,
      updatedAt: new Date().toISOString(),
    };

    saveGameToStorage(updated.code, updated);
    onGameUpdate(updated);
  };

  const simulateSubmissions = () => {
    if (!currentGame) return;

    const playerIds = Object.keys(currentGame.players);
    if (playerIds.length === 0) return;

    const submissions = { ...currentGame.submissions };

    currentGame.blanks.forEach((blank) => {
      submissions[blank.id] = submissions[blank.id] || [];
      playerIds.forEach((pid, idx) => {
        // Check if this player already submitted for this blank
        const alreadySubmitted = submissions[blank.id].some(s => s.playerId === pid);
        if (!alreadySubmitted) {
          submissions[blank.id].push({
            playerId: pid,
            playerName: currentGame.players[pid].name,
            answer: `${blank.type}-${idx + 1}`,
            submittedAt: new Date().toISOString(),
          });
        }
      });
    });

    const updated: Game = {
      ...currentGame,
      submissions,
      updatedAt: new Date().toISOString(),
    };

    saveGameToStorage(updated.code, updated);
    onGameUpdate(updated);
  };

  const openPlayerView = () => {
    if (!currentGame) return;

    const firstId = Object.keys(currentGame.players)[0];
    if (!firstId) return;

    setPlayerId(firstId);
    setPlayerName(currentGame.players[firstId].name);
    onNavigate('player-game');
  };

  const previewSelectedAnswers = () => {
    if (!currentGame?.selectedAnswers) return;

    const w = window.open('', '_blank');
    if (w) {
      w.document.write(`
        <html>
          <head><title>Selected Answers - ${currentGame.code}</title></head>
          <body style="font-family: monospace; padding: 20px;">
            <h2>Selected Answers for ${currentGame.title}</h2>
            <pre>${JSON.stringify(currentGame.selectedAnswers, null, 2)}</pre>
          </body>
        </html>
      `);
    }
  };

  const clearAllGames = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('game:')) {
        localStorage.removeItem(key);
      }
    });
  };

  return (
    <div className="fixed bottom-3 right-3 z-50">
      <div className="bg-gray-900 text-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header - always visible */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-2 flex items-center justify-between gap-2 hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Bug className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-bold">DevBar</span>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4" />
          )}
        </button>

        {/* Expanded content */}
        {isExpanded && (
          <div className="p-3 border-t border-gray-700 space-y-2 max-h-[70vh] overflow-y-auto">
            {/* Navigation */}
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Navigation</div>
            <div className="flex flex-wrap gap-1">
              <Button size="sm" variant="ghost" onClick={() => onNavigate('home')} className="text-white hover:bg-gray-700">
                <Home className="w-3 h-3 mr-1" /> Home
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onNavigate('admin-create')} className="text-white hover:bg-gray-700">
                <Edit3 className="w-3 h-3 mr-1" /> Create
              </Button>
            </div>

            {/* Story Actions */}
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1 mt-3">Story</div>
            <div className="flex flex-wrap gap-1">
              <Button size="sm" variant="secondary" onClick={onLoadSample}>
                <FileText className="w-3 h-3 mr-1" /> Load Sample
              </Button>
              <Button size="sm" variant="accent" onClick={onSaveGame}>
                Save Game
              </Button>
            </div>

            {/* Game Controls */}
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1 mt-3">Game</div>
            <div className="flex flex-wrap gap-1">
              <Button size="sm" variant="success" onClick={onStartGame}>
                <Play className="w-3 h-3 mr-1" /> Start
              </Button>
              <Button size="sm" variant="error" onClick={onEndGame}>
                <Square className="w-3 h-3 mr-1" /> End
              </Button>
            </div>

            {/* Player Actions */}
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1 mt-3">Players</div>
            <div className="flex flex-wrap gap-1">
              <Button size="sm" variant="primary" onClick={() => addFakePlayers(5)}>
                <UserPlus className="w-3 h-3 mr-1" /> +5
              </Button>
              <Button size="sm" variant="primary" onClick={addMassPlayers}>
                <Users className="w-3 h-3 mr-1" /> Fill ({MAX_PLAYERS})
              </Button>
              <Button size="sm" variant="accent" onClick={openPlayerView} disabled={!currentGame || Object.keys(currentGame.players || {}).length === 0}>
                <Eye className="w-3 h-3 mr-1" /> Player View
              </Button>
            </div>

            {/* Simulation */}
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1 mt-3">Simulation</div>
            <div className="flex flex-wrap gap-1">
              <Button size="sm" variant="secondary" onClick={simulateSubmissions}>
                <Send className="w-3 h-3 mr-1" /> Simulate All
              </Button>
              <Button size="sm" variant="ghost" onClick={previewSelectedAnswers} disabled={!currentGame?.selectedAnswers} className="text-white hover:bg-gray-700">
                <Eye className="w-3 h-3 mr-1" /> Preview
              </Button>
            </div>

            {/* Danger Zone */}
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1 mt-3">Danger</div>
            <Button size="sm" variant="error" onClick={clearAllGames}>
              <Trash2 className="w-3 h-3 mr-1" /> Clear All Games
            </Button>

            {/* Current Game Info */}
            {currentGame && (
              <div className="mt-3 p-2 bg-gray-800 rounded-lg text-xs">
                <div className="text-gray-400">Current Game:</div>
                <div className="font-mono text-yellow-400">{currentGame.code}</div>
                <div className="text-gray-500 mt-1">
                  Status: {currentGame.status} |
                  Players: {Object.keys(currentGame.players || {}).length} |
                  Blanks: {currentGame.blanks?.length || 0}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
