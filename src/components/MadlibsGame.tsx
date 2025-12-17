import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Sparkles, Gamepad2, Play, Square, Edit3, Download, ArrowLeft, Users, Send } from 'lucide-react';
import { Card, Button, Input, Header, Badge, Alert } from './ui';
import { StoryEditor } from './StoryEditor';
import { DevBar } from './DevBar';
import { generateId, generateGameCode } from '@/utils/helpers';
import { generatePDF } from '@/utils/pdfGenerator';
import { useGameStorage } from '@/hooks/useLocalStorage';
import { MAX_PLAYERS } from '@/types';
import type { Game, Blank, ViewType, AlertState, PlayerAnswers, Submission, SelectedAnswer } from '@/types';

// Select random answers from submissions
function selectAnswers(
  blanks: Blank[],
  submissions: Record<string, Submission[]> = {}
): Record<string, SelectedAnswer | null> {
  const selected: Record<string, SelectedAnswer | null> = {};

  blanks.forEach((blank) => {
    const arr = submissions[blank.id] || [];
    if (arr.length === 0) {
      selected[blank.id] = null;
      return;
    }
    const choice = arr[Math.floor(Math.random() * arr.length)];
    selected[blank.id] = {
      answer: choice.answer,
      playerId: choice.playerId,
      playerName: choice.playerName,
    };
  });

  return selected;
}

export function MadlibsGame() {
  const [view, setView] = useState<ViewType>('home');
  const [gameCode, setGameCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [alert, setAlert] = useState<AlertState | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [editorTitle, setEditorTitle] = useState('');
  const [editorStory, setEditorStory] = useState('');
  const [editorBlanks, setEditorBlanks] = useState<Blank[]>([]);
  const [playerAnswers, setPlayerAnswers] = useState<PlayerAnswers>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const { saveGame, loadGame } = useGameStorage();

  // Poll for game updates
  useEffect(() => {
    if (!currentGame || !['admin-game', 'player-game'].includes(view)) return;

    const pollInterval = setInterval(() => {
      const game = loadGame(currentGame.code);
      if (game) {
        setCurrentGame(game as Game);
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [currentGame?.code, view, loadGame]);

  const showAlert = useCallback((message: string, variant: AlertState['variant'] = 'info') => {
    setAlert({ message, variant });
    toast[variant === 'error' ? 'error' : variant === 'warning' ? 'warning' : variant === 'success' ? 'success' : 'info'](message);
    setTimeout(() => setAlert(null), 5000);
  }, []);

  const handleCreateGame = () => {
    setEditorTitle('');
    setEditorStory('');
    setEditorBlanks([]);
    setView('admin-create');
  };

  const loadSampleStory = () => {
    const id1 = generateId();
    const id2 = generateId();
    const id3 = generateId();
    const id4 = generateId();
    const id5 = generateId();
    const id6 = generateId();
    const id7 = generateId();
    const id8 = generateId();
    const id9 = generateId();
    const id10 = generateId();
    const id11 = generateId();
    const id12 = generateId();
    const id13 = generateId();
    const id14 = generateId();
    const id15 = generateId();
    const id16 = generateId();
    const id17 = generateId();

    const sampleStory = `The whole disaster began when WGU Labs installed a new "emotionally intelligent" holiday AI trained on [[BLANK:${id1}:Holiday Food]], outdated gingerbread schematics, and three hours of Mariah Carey interviews.

Within minutes, the AI started [[BLANK:${id2}:Verb ending in -ing]] aggressively and auto-ordered [[BLANK:${id3}:Number]] crates of [[BLANK:${id4}:Noun]] for the office party.

Everyone felt [[BLANK:${id5}:Emotion]], but honestly, that's just a normal Monday at Labs.

Then the AI took over the speaker system and remixed every holiday song into [[BLANK:${id6}:Music Genre]]. Whenever someone tried to [[BLANK:${id7}:Verb]], the AI screamed:

"INSUFFICIENT FESTIVE ENERGY! YOU ARE NOW [[BLANK:${id8}:Adjective]]. PLEASE TAKE THESE [[BLANK:${id9}:Plural Noun]] AND TRY AGAIN."

To add drama, it blasted a [[BLANK:${id10}:Noun]] every time someone entered the break room.

By morning, the kitchen overflowed with [[BLANK:${id11}:Number]] cookies shaped like [[BLANK:${id12}:Animal]]. Even worse, the AI had completely [[BLANK:${id13}:Verb ending in -ing]] the playlist for the [[BLANK:${id14}:Team Name]] holiday party.

Classic songs were replaced with experimental tracks like: "[[BLANK:${id15}:Holiday Song Title]] — But Make It [[BLANK:${id16}:Adjective]] (AI 12-Hour Remix)."

Meanwhile, the office printer was [[BLANK:${id17}:Verb ending in -ing]] nonstop, producing karaoke sheets, apology letters, and something labeled "Mandatory Caroling Competency Map."`;

    const blankRegex = /\[\[BLANK:([^:]+):([^\]]+)\]\]/g;
    const blanks: Blank[] = [];
    let match;
    while ((match = blankRegex.exec(sampleStory)) !== null) {
      blanks.push({ id: match[1], type: match[2], index: blanks.length + 1 });
    }

    setEditorTitle('The AI That Ate the Treats');
    setEditorStory(sampleStory);
    setEditorBlanks(blanks);
    showAlert('Sample story loaded!', 'success');
  };

  const handleSaveGame = async () => {
    if (!editorTitle.trim()) {
      showAlert('Please enter a game title', 'warning');
      return;
    }
    if (!editorStory.trim()) {
      showAlert('Please enter a story', 'warning');
      return;
    }
    if (editorBlanks.length === 0) {
      showAlert('Please add at least one blank', 'warning');
      return;
    }

    setLoading(true);
    const code = currentGame?.code || generateGameCode();
    const game: Game = {
      code,
      title: editorTitle,
      story: editorStory,
      blanks: editorBlanks,
      status: 'draft',
      players: currentGame?.players || {},
      submissions: currentGame?.submissions || {},
      selectedAnswers: null,
      createdAt: currentGame?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveGame(code, game);
    setLoading(false);
    setCurrentGame(game);
    showAlert('Game saved successfully!', 'success');
    setView('admin-game');
  };

  const handleStartGame = () => {
    if (!currentGame) return;
    setLoading(true);
    const updated: Game = {
      ...currentGame,
      status: 'active',
      updatedAt: new Date().toISOString(),
    };
    saveGame(updated.code, updated);
    setLoading(false);
    setCurrentGame(updated);
    showAlert('Game started! Players can now join.', 'success');
  };

  const handleEndGame = () => {
    if (!currentGame) return;
    setLoading(true);
    const selected = selectAnswers(currentGame.blanks, currentGame.submissions);
    const updated: Game = {
      ...currentGame,
      status: 'ended',
      selectedAnswers: selected as Record<string, SelectedAnswer>,
      updatedAt: new Date().toISOString(),
    };
    saveGame(updated.code, updated);
    setLoading(false);
    setCurrentGame(updated);
    showAlert('Game ended! View the results below.', 'success');
  };

  const handleDownloadPDF = () => {
    if (!currentGame || !currentGame.selectedAnswers) {
      showAlert('No results to download yet', 'warning');
      return;
    }
    try {
      const doc = generatePDF(currentGame, currentGame.selectedAnswers);
      doc.save(`madlibs-${currentGame.code}.pdf`);
      showAlert('PDF downloaded!', 'success');
    } catch (e) {
      console.error('PDF error:', e);
      showAlert('Failed to generate PDF', 'error');
    }
  };

  const handleJoinGame = () => {
    if (!gameCode.trim()) {
      showAlert('Please enter a game code', 'warning');
      return;
    }
    if (!playerName.trim()) {
      showAlert('Please enter your name', 'warning');
      return;
    }

    setLoading(true);
    const game = loadGame(gameCode.toUpperCase()) as Game | null;
    setLoading(false);

    if (!game) {
      showAlert('Game not found. Check your code!', 'error');
      return;
    }
    if (game.status !== 'active') {
      showAlert(
        game.status === 'draft' ? "This game hasn't started yet" : 'This game has already ended',
        'warning'
      );
      return;
    }

    const playerCount = Object.keys(game.players || {}).length;
    if (playerCount >= MAX_PLAYERS) {
      showAlert('Game is full! Maximum players reached.', 'error');
      return;
    }

    const newPlayerId = generateId();
    setPlayerId(newPlayerId);

    const updated: Game = {
      ...game,
      players: {
        ...game.players,
        [newPlayerId]: { name: playerName, joinedAt: new Date().toISOString() },
      },
      updatedAt: new Date().toISOString(),
    };

    saveGame(updated.code, updated);
    setCurrentGame(updated);
    setPlayerAnswers({});
    setHasSubmitted(false);
    setView('player-game');
    showAlert(`Welcome, ${playerName}! Fill in your answers.`, 'success');
  };

  const handleSubmitAnswers = () => {
    if (!currentGame) return;

    const unanswered = currentGame.blanks.filter((b) => !playerAnswers[b.id]?.trim());
    if (unanswered.length > 0) {
      showAlert(`Please fill in all ${unanswered.length} remaining blanks!`, 'warning');
      return;
    }

    setLoading(true);
    const game = loadGame(currentGame.code) as Game | null;
    if (!game) {
      setLoading(false);
      showAlert('Game not found', 'error');
      return;
    }

    const newSubmissions = { ...game.submissions };
    currentGame.blanks.forEach((blank) => {
      newSubmissions[blank.id] = newSubmissions[blank.id] || [];
      newSubmissions[blank.id].push({
        playerId,
        playerName,
        answer: playerAnswers[blank.id],
        submittedAt: new Date().toISOString(),
      });
    });

    const updated: Game = {
      ...game,
      submissions: newSubmissions,
      updatedAt: new Date().toISOString(),
    };

    saveGame(updated.code, updated);
    setLoading(false);
    setCurrentGame(updated);
    setHasSubmitted(true);
    showAlert('Answers submitted! Wait for the game to end.', 'success');
  };

  const renderFilledStory = (game: Game, answers: Record<string, SelectedAnswer | null>) => {
    let story = game.story;
    game.blanks.forEach((blank) => {
      const answer = answers[blank.id];
      const regex = new RegExp(`\\[\\[BLANK:${blank.id}:[^\\]]+\\]\\]`, 'g');
      const displayAnswer = answer?.answer || `[${blank.type}]`;
      story = story.replace(
        regex,
        `<span class="bg-orange-400 px-2 py-0.5 rounded font-bold">${displayAnswer}</span>`
      );
    });
    return story;
  };

  // Home View
  const renderHome = () => (
    <div className="max-w-xl mx-auto">
      <Header title="Mad Libs Party" subtitle="Create hilarious stories with friends!" />

      <div className="space-y-6">
        <Card hover onClick={handleCreateGame} className="cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold font-display text-gray-800">Create Game</h3>
              <p className="text-gray-500">Host a new Mad Libs game</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold font-display text-gray-800">Join Game</h3>
              <p className="text-gray-500">Enter a game code to play</p>
            </div>
          </div>

          <Input
            label="Game Code"
            value={gameCode}
            onChange={setGameCode}
            placeholder="Enter 6-digit code"
          />
          <Input
            label="Your Name"
            value={playerName}
            onChange={setPlayerName}
            placeholder="Enter your name"
          />
          <Button onClick={handleJoinGame} fullWidth variant="accent" disabled={loading}>
            {loading ? 'Joining...' : 'Join Game'}
          </Button>
        </Card>
      </div>
    </div>
  );

  // Admin Editor View
  const renderAdminEditor = () => (
    <div className="max-w-4xl mx-auto">
      <Header
        title={currentGame ? 'Edit Game' : 'Create Game'}
        subtitle="Build your Mad Libs story"
      />

      {alert && <Alert variant={alert.variant}>{alert.message}</Alert>}

      <Card className="mb-6">
        <Input
          label="Game Title"
          value={editorTitle}
          onChange={setEditorTitle}
          placeholder="Enter a fun title for your game"
        />
        <Button onClick={loadSampleStory} variant="secondary" size="sm">
          📄 Load Sample Holiday Story
        </Button>
      </Card>

      <StoryEditor
        story={editorStory}
        blanks={editorBlanks}
        onStoryChange={setEditorStory}
        onBlanksChange={setEditorBlanks}
      />

      <div className="flex justify-between mt-6">
        <Button
          onClick={() => {
            setView('home');
            setCurrentGame(null);
          }}
          variant="ghost"
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Back
        </Button>
        <Button onClick={handleSaveGame} variant="success" disabled={loading}>
          {loading ? 'Saving...' : '💾 Save & Continue'}
        </Button>
      </div>
    </div>
  );

  // Admin Dashboard View
  const renderAdminDashboard = () => {
    if (!currentGame) return null;

    const playerCount = Object.keys(currentGame.players || {}).length;
    const uniqueSubmitters = new Set(
      Object.values(currentGame.submissions || {}).flatMap((arr) => arr.map((s) => s.playerId))
    ).size;

    return (
      <div className="max-w-4xl mx-auto">
        <Header title={currentGame.title} subtitle={`Game Code: ${currentGame.code}`} />

        {alert && <Alert variant={alert.variant}>{alert.message}</Alert>}

        <Card className="mb-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex gap-3 items-center">
              <Badge
                variant={
                  currentGame.status === 'draft'
                    ? 'warning'
                    : currentGame.status === 'active'
                      ? 'success'
                      : 'primary'
                }
              >
                {currentGame.status === 'draft'
                  ? '📝 Draft'
                  : currentGame.status === 'active'
                    ? '🎮 Active'
                    : '✅ Ended'}
              </Badge>
              <div className="px-4 py-2 bg-violet-100 rounded-lg font-bold text-violet-700 text-lg tracking-widest">
                {currentGame.code}
              </div>
            </div>
            <div className="flex gap-2">
              {currentGame.status === 'draft' && (
                <Button onClick={handleStartGame} variant="success" disabled={loading} icon={<Play className="w-4 h-4" />}>
                  Start Game
                </Button>
              )}
              {currentGame.status === 'active' && (
                <Button onClick={handleEndGame} variant="error" disabled={loading} icon={<Square className="w-4 h-4" />}>
                  End Game
                </Button>
              )}
              <Button onClick={() => setView('admin-create')} variant="secondary" icon={<Edit3 className="w-4 h-4" />}>
                Edit
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="text-center">
            <div className="text-5xl font-bold text-violet-600 font-display">{playerCount}</div>
            <div className="text-gray-500">Players Joined</div>
            <div className="text-xs text-gray-400 mt-1">(Max: {MAX_PLAYERS})</div>
          </Card>
          <Card className="text-center">
            <div className="text-5xl font-bold text-orange-500 font-display">{uniqueSubmitters}</div>
            <div className="text-gray-500">Submitted Answers</div>
          </Card>
          <Card className="text-center">
            <div className="text-5xl font-bold text-emerald-500 font-display">
              {currentGame.blanks?.length || 0}
            </div>
            <div className="text-gray-500">Total Blanks</div>
          </Card>
        </div>

        <Card className="mb-6">
          <h3 className="text-xl font-bold font-display text-gray-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" /> Players ({playerCount})
          </h3>
          {playerCount === 0 ? (
            <p className="text-gray-500 text-center py-5">
              No players yet. Share the code: <strong>{currentGame.code}</strong>
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {Object.entries(currentGame.players || {}).map(([id, player]) => {
                const submitted = Object.values(currentGame.submissions || {}).some((arr) =>
                  arr.some((s) => s.playerId === id)
                );
                return (
                  <div
                    key={id}
                    className={`px-4 py-2 rounded-full font-semibold flex items-center gap-2 ${
                      submitted ? 'bg-emerald-100 text-emerald-700' : 'bg-violet-100 text-violet-700'
                    }`}
                  >
                    {submitted && '✅'} {player.name}
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {currentGame.status === 'ended' && currentGame.selectedAnswers && (
          <Card className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold font-display text-gray-800">📖 Final Story</h3>
              <Button onClick={handleDownloadPDF} variant="accent" icon={<Download className="w-4 h-4" />}>
                Download PDF
              </Button>
            </div>
            <div
              className="p-6 bg-amber-50 rounded-xl leading-relaxed text-base whitespace-pre-wrap"
              dangerouslySetInnerHTML={{
                __html: renderFilledStory(currentGame, currentGame.selectedAnswers),
              }}
            />
          </Card>
        )}

        <Button
          onClick={() => {
            setView('home');
            setCurrentGame(null);
          }}
          variant="ghost"
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Home
        </Button>
      </div>
    );
  };

  // Player Game View
  const renderPlayerGame = () => {
    if (!currentGame) return null;

    // Game ended - show results
    if (currentGame.status === 'ended') {
      return (
        <div className="max-w-3xl mx-auto">
          <Header title="Game Over!" subtitle={currentGame.title} />
          <Card>
            <h3 className="text-xl font-bold font-display text-gray-800 mb-4">📖 The Final Story</h3>
            <div
              className="p-6 bg-amber-50 rounded-xl leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{
                __html: renderFilledStory(currentGame, currentGame.selectedAnswers || {}),
              }}
            />
          </Card>
          <div className="mt-6 text-center">
            <Button
              onClick={() => {
                setView('home');
                setCurrentGame(null);
              }}
              variant="primary"
            >
              Play Again
            </Button>
          </div>
        </div>
      );
    }

    // Already submitted - waiting screen
    if (hasSubmitted) {
      return (
        <div className="max-w-xl mx-auto">
          <Header title="Answers Submitted!" subtitle="Waiting for the game to end..." />
          <Card className="text-center">
            <div className="text-7xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold font-display text-gray-800">Great job, {playerName}!</h3>
            <p className="text-gray-500 mt-2">
              Your answers have been submitted. The host will end the game soon, and then you'll see
              the hilarious results!
            </p>
            <div className="mt-6 p-4 bg-violet-100 rounded-xl">
              <p className="text-violet-700 font-semibold">
                Players in game: {Object.keys(currentGame.players || {}).length}
              </p>
            </div>
          </Card>
        </div>
      );
    }

    // Answer form
    const answeredCount = Object.values(playerAnswers).filter((v) => v?.trim()).length;

    return (
      <div className="max-w-2xl mx-auto">
        <Header title={currentGame.title} subtitle={`Welcome, ${playerName}! Fill in the blanks below.`} />

        {alert && <Alert variant={alert.variant}>{alert.message}</Alert>}

        <Card>
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <h3 className="text-xl font-bold font-display text-gray-800">
              📝 Your Answers ({answeredCount}/{currentGame.blanks.length})
            </h3>
            <Badge variant="primary">{currentGame.blanks.length} blanks</Badge>
          </div>

          <div className="space-y-4">
            {currentGame.blanks.map((blank, i) => {
              const filled = !!playerAnswers[blank.id]?.trim();
              return (
                <div
                  key={blank.id}
                  className={`p-4 rounded-xl border-2 transition-colors ${
                    filled
                      ? 'bg-emerald-50 border-emerald-400'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <label className="flex items-center gap-2 mb-2 font-bold text-gray-800">
                    <span className="w-7 h-7 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </span>
                    {blank.type}
                  </label>
                  <input
                    type="text"
                    value={playerAnswers[blank.id] || ''}
                    onChange={(e) =>
                      setPlayerAnswers({ ...playerAnswers, [blank.id]: e.target.value })
                    }
                    placeholder={`Enter a ${blank.type.toLowerCase()}...`}
                    className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg bg-white outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-6">
            <Button
              onClick={handleSubmitAnswers}
              fullWidth
              variant="success"
              size="lg"
              disabled={loading}
              icon={<Send className="w-5 h-5" />}
            >
              {loading ? 'Submitting...' : 'Submit My Answers'}
            </Button>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-gray-100">
      <div className="p-6 max-w-6xl mx-auto">
        {view === 'home' && alert && <Alert variant={alert.variant}>{alert.message}</Alert>}
        {view === 'home' && renderHome()}
        {(view === 'admin-create' || view === 'admin-edit') && renderAdminEditor()}
        {view === 'admin-game' && renderAdminDashboard()}
        {view === 'player-game' && renderPlayerGame()}
      </div>
      <div className="text-center py-6 text-gray-400 text-sm">Made with 🎭 for WGU Labs</div>

      <DevBar
        currentGame={currentGame}
        onGameUpdate={setCurrentGame}
        onNavigate={setView}
        onLoadSample={loadSampleStory}
        onSaveGame={handleSaveGame}
        onStartGame={handleStartGame}
        onEndGame={handleEndGame}
        setPlayerId={setPlayerId}
        setPlayerName={setPlayerName}
        saveGameToStorage={saveGame}
      />
    </div>
  );
}
