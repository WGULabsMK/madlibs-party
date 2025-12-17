import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Plus,
  Play,
  Eye,
  Trash2,
  Users,
  FileText,
  LogOut,
  RefreshCw,
  Clock,
  CheckCircle,
  Edit3
} from 'lucide-react';
import { Card, Button, Header, Badge } from './ui';
import { useGameStorage } from '@/hooks/useLocalStorage';
import type { Game } from '@/types';

interface AdminDashboardProps {
  onCreateGame: () => void;
  onOpenGame: (game: Game) => void;
  onLogout: () => void;
  showAlert: (message: string, variant: 'info' | 'success' | 'warning' | 'error') => void;
}

export function AdminDashboard({ onCreateGame, onOpenGame, onLogout, showAlert }: AdminDashboardProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const { getAllGames, loadGame, deleteGame } = useGameStorage();

  const refreshGames = () => {
    setLoading(true);
    const gameCodes = getAllGames();
    const loadedGames: Game[] = [];

    gameCodes.forEach(code => {
      const game = loadGame(code);
      if (game) {
        loadedGames.push(game as Game);
      }
    });

    // Sort by updatedAt descending (most recent first)
    loadedGames.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    setGames(loadedGames);
    setLoading(false);
  };

  useEffect(() => {
    refreshGames();
  }, []);

  const handleDeleteGame = (game: Game) => {
    if (window.confirm(`Are you sure you want to delete "${game.title}"? This cannot be undone.`)) {
      deleteGame(game.code);
      refreshGames();
      showAlert(`Deleted game: ${game.title}`, 'success');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminAuthTime');
    onLogout();
    showAlert('Logged out successfully', 'info');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: Game['status']) => {
    switch (status) {
      case 'draft':
        return <Badge variant="warning"><Edit3 className="w-3 h-3 mr-1" /> Draft</Badge>;
      case 'active':
        return <Badge variant="success"><Play className="w-3 h-3 mr-1" /> Active</Badge>;
      case 'ended':
        return <Badge variant="primary"><CheckCircle className="w-3 h-3 mr-1" /> Ended</Badge>;
    }
  };

  const stats = {
    total: games.length,
    draft: games.filter(g => g.status === 'draft').length,
    active: games.filter(g => g.status === 'active').length,
    ended: games.filter(g => g.status === 'ended').length,
    totalPlayers: games.reduce((acc, g) => acc + Object.keys(g.players || {}).length, 0)
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <Header title="Admin Dashboard" subtitle="Manage your Mad Libs games" />
        <Button onClick={handleLogout} variant="ghost" size="sm" icon={<LogOut className="w-4 h-4" />}>
          Logout
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <Card className="text-center py-4">
          <div className="text-3xl font-bold text-violet-600 font-display">{stats.total}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Total Games</div>
        </Card>
        <Card className="text-center py-4">
          <div className="text-3xl font-bold text-amber-500 font-display">{stats.draft}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Drafts</div>
        </Card>
        <Card className="text-center py-4">
          <div className="text-3xl font-bold text-emerald-500 font-display">{stats.active}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Active</div>
        </Card>
        <Card className="text-center py-4">
          <div className="text-3xl font-bold text-blue-500 font-display">{stats.ended}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Ended</div>
        </Card>
        <Card className="text-center py-4">
          <div className="text-3xl font-bold text-orange-500 font-display">{stats.totalPlayers}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Total Players</div>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mb-6">
        <Button onClick={onCreateGame} variant="success" icon={<Plus className="w-4 h-4" />}>
          Create New Game
        </Button>
        <Button onClick={refreshGames} variant="secondary" icon={<RefreshCw className="w-4 h-4" />}>
          Refresh
        </Button>
      </div>

      {/* Games List */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold font-display text-gray-800 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5" /> All Games
          </h3>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading games...</div>
        ) : games.length === 0 ? (
          <div className="text-center py-10">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No games yet. Create your first game!</p>
            <Button onClick={onCreateGame} variant="primary" icon={<Plus className="w-4 h-4" />}>
              Create Game
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {games.map(game => (
              <div
                key={game.code}
                className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-800 truncate">{game.title}</h4>
                      {getStatusBadge(game.status)}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                      <span className="font-mono bg-violet-100 text-violet-700 px-2 py-0.5 rounded font-bold">
                        {game.code}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {Object.keys(game.players || {}).length} players
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {game.blanks?.length || 0} blanks
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(game.updatedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => onOpenGame(game)}
                      variant="primary"
                      size="sm"
                      icon={<Eye className="w-3 h-3" />}
                    >
                      Open
                    </Button>
                    <Button
                      onClick={() => handleDeleteGame(game)}
                      variant="error"
                      size="sm"
                      icon={<Trash2 className="w-3 h-3" />}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
