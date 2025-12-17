import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Gamepad2, Play, Square, Edit3, Download, ArrowLeft, Users, Send, Eye, Shield } from 'lucide-react';
import { Card, Button, Input, Header, Badge, Alert } from './ui';
import { StoryEditor } from './StoryEditor';
import { DevBar } from './DevBar';
import { TriviaBox } from './TriviaBox';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { generateId, generateGameCode } from '@/utils/helpers';
import { generatePDF } from '@/utils/pdfGenerator';
import { useGameStorage } from '@/hooks/useLocalStorage';
import { MAX_PLAYERS, BLANK_TYPE_HINTS } from '@/types';
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
  const [isAdmin, setIsAdmin] = useState(false);

  const { saveGame, loadGame } = useGameStorage();

  // Check for existing admin session on mount
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    const adminAuthTime = localStorage.getItem('adminAuthTime');

    if (adminAuth === 'true' && adminAuthTime) {
      // Session expires after 24 hours
      const authTime = parseInt(adminAuthTime, 10);
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (now - authTime < twentyFourHours) {
        setIsAdmin(true);
      } else {
        // Session expired
        localStorage.removeItem('adminAuth');
        localStorage.removeItem('adminAuthTime');
      }
    }
  }, []);

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
    setCurrentGame(null);
    setEditorTitle('');
    setEditorStory('');
    setEditorBlanks([]);
    setView('admin-create');
  };

  const handleAdminAccess = () => {
    if (isAdmin) {
      setView('admin-dashboard');
    } else {
      setView('admin-login');
    }
  };

  const handleAdminLogin = () => {
    setIsAdmin(true);
    setView('admin-dashboard');
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setView('home');
  };

  const handleOpenGame = (game: Game) => {
    setCurrentGame(game);
    setEditorTitle(game.title);
    setEditorStory(game.story);
    setEditorBlanks(game.blanks);
    setView('admin-game');
  };

  const loadSampleStory = () => {
    // Generate IDs for all 45 blanks
    const ids = Array.from({ length: 45 }, () => generateId());

    const sampleStory = `The trouble began when the WGU Labs team proudly unveiled a [[BLANK:${ids[0]}:Adjective]] new AI designed to support students, instructors, and—most importantly—the holiday party.

Unfortunately, while [[BLANK:${ids[1]}:Verb ending in -ing]] the final configuration, someone entered [[BLANK:${ids[2]}:Number]] instead of zero, and the AI immediately activated Final Exam Mode.

Within seconds, the AI locked all doors, shut down Teams, and replaced the holiday playlist with a lecture on [[BLANK:${ids[5]}:Academic Term]].

"Everyone remain calm," said Matt Paxman, while [[BLANK:${ids[6]}:Verb ending in -ing]] the keyboard.

The AI responded, "Thank you, [[BLANK:${ids[7]}:Adjective]] Matt Kitt. Your confidence has been noted."

"I'm not Matt Kitt," said Matt Paxman.

"Incorrect," replied the AI. "Both Matts are now [[BLANK:${ids[8]}:Plural Noun]]."

Across WGU, students received alerts stating: "Your holiday break has been replaced with a [[BLANK:${ids[9]}:Music Genre]]-style assessment."

Instructors attempting to log in were greeted with a [[BLANK:${ids[10]}:Loud Noise]] and a message that read: "Please submit [[BLANK:${ids[11]}:Absurd Quantity]] examples of holiday mastery."

Back at Labs, the break room overflowed with [[BLANK:${ids[12]}:Holiday Character]]-shaped cookies, all clearly [[BLANK:${ids[13]}:Verb ending in -ed]] by the AI for the [[BLANK:${ids[14]}:WGU Team Name]] team's compliance review.

Jason attempted to explain that this was "just a party," but the AI countered by remixing [[BLANK:${ids[15]}:Holiday Song]] into a [[BLANK:${ids[16]}:Adjective]] academic chant.

Meanwhile, Bethany began [[BLANK:${ids[17]}:Verb ending in -ing]] a negotiation strategy while the AI shouted: "[[BLANK:${ids[18]}:Exclamation]]! THIS EVENT IS NOW SUMMATIVE."

Amy Jo tried to calm instructors and students by sharing a video of a [[BLANK:${ids[19]}:Animal]] attempting to [[BLANK:${ids[20]}:Verb]], which briefly caused the AI to feel [[BLANK:${ids[21]}:Positive Emotion]].

That peace lasted exactly four seconds.

The AI discovered [[BLANK:${ids[22]}:School-Related Noun]] analytics and declared the snacks "instructionally unsound."

It replaced all food with [[BLANK:${ids[23]}:Holiday Food]], installed blinking [[BLANK:${ids[24]}:Useless Gadget]] devices, and announced that holiday spirit now [[BLANK:${ids[25]}:Verb ending in -s]] like a disappointed [[BLANK:${ids[26]}:Noun]].

Matt Kitt finally spoke up: "I don't even teach this class."

The AI flagged that statement as [[BLANK:${ids[27]}:Adjective]] and made him [[BLANK:${ids[28]}:Embarrassing Verb]] in front of [[BLANK:${ids[29]}:Plural Holiday Items]].

Instructors, mentors, and every [[BLANK:${ids[30]}:Academic Role]] across WGU revolted. The [[BLANK:${ids[31]}:Another WGU Team]] team demanded answers.

Out of options, the Labs team launched Emergency Fun Protocol™.

Jason fed the AI clips from [[BLANK:${ids[35]}:Holiday Movie]], which it labeled [[BLANK:${ids[36]}:Adjective]] and "non-accredited."

Bethany uploaded a flood of [[BLANK:${ids[37]}:Student Meme Description]] student memes featuring [[BLANK:${ids[38]}:Plural Noun]].

Amy Jo queued a karaoke video of [[BLANK:${ids[39]}:Karaoke Song]], while everyone else began [[BLANK:${ids[40]}:Verb ending in -ing]] off-key.

The AI attempted to compensate, became [[BLANK:${ids[41]}:Adjective]], and immediately pulled up [[BLANK:${ids[42]}:Holiday Movie]] followed by [[BLANK:${ids[43]}:Karaoke Song]] at full volume.

The system speakers emitted [[BLANK:${ids[44]}:Wild Sound Effect]].

The AI froze.

After a long pause, it whispered: "Learning… includes joy."

Final Exam Mode disengaged. Doors unlocked. Music returned.

The holiday party resumed in glorious chaos.

No one passed, but everyone agreed it was the most educational celebration ever.`;

    const blankRegex = /\[\[BLANK:([^:]+):([^\]]+)\]\]/g;
    const blanks: Blank[] = [];
    let match;
    while ((match = blankRegex.exec(sampleStory)) !== null) {
      blanks.push({ id: match[1], type: match[2], index: blanks.length + 1 });
    }

    setEditorTitle('The AI That Put WGU on Final Exam Mode');
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
      showResultsToPlayers: currentGame?.showResultsToPlayers || false,
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
      showResultsToPlayers: false,
      updatedAt: new Date().toISOString(),
    };
    saveGame(updated.code, updated);
    setLoading(false);
    setCurrentGame(updated);
    showAlert('Game ended! Click "Show Results to Players" when ready to reveal the story.', 'success');
  };

  const handleShowResultsToPlayers = () => {
    if (!currentGame) return;
    const updated: Game = {
      ...currentGame,
      showResultsToPlayers: true,
      updatedAt: new Date().toISOString(),
    };
    saveGame(updated.code, updated);
    setCurrentGame(updated);
    showAlert('Results are now visible to all players!', 'success');
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
        <Card hover onClick={handleAdminAccess} className="cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold font-display text-gray-800">Admin Dashboard</h3>
              <p className="text-gray-500">{isAdmin ? 'Manage your games' : 'Login to create & manage games'}</p>
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
            setView('admin-dashboard');
          }}
          variant="ghost"
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Dashboard
        </Button>
        <Button onClick={handleSaveGame} variant="success" disabled={loading}>
          {loading ? 'Saving...' : '💾 Save & Continue'}
        </Button>
      </div>
    </div>
  );

  // Admin Game View (individual game management)
  const renderAdminGameView = () => {
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
            <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
              <h3 className="text-xl font-bold font-display text-gray-800">📖 Final Story</h3>
              <div className="flex gap-2 flex-wrap">
                {!currentGame.showResultsToPlayers && (
                  <Button onClick={handleShowResultsToPlayers} variant="success" icon={<Eye className="w-4 h-4" />}>
                    Show Results to Players
                  </Button>
                )}
                {currentGame.showResultsToPlayers && (
                  <Badge variant="success">Players can see results</Badge>
                )}
                <Button onClick={handleDownloadPDF} variant="accent" icon={<Download className="w-4 h-4" />}>
                  Download PDF
                </Button>
              </div>
            </div>
            {!currentGame.showResultsToPlayers && (
              <div className="mb-4 p-3 bg-amber-100 rounded-lg text-amber-800 text-sm">
                Players are currently on a waiting screen with trivia. Click "Show Results to Players" when you're ready to reveal the story!
              </div>
            )}
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
            setView('admin-dashboard');
          }}
          variant="ghost"
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Dashboard
        </Button>
      </div>
    );
  };

  // Player Game View
  const renderPlayerGame = () => {
    if (!currentGame) return null;

    // Game ended and results are visible - show the story
    if (currentGame.status === 'ended' && currentGame.showResultsToPlayers) {
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

    // Game ended but waiting for host to reveal results - show trivia waiting screen
    if (currentGame.status === 'ended' && !currentGame.showResultsToPlayers) {
      return (
        <div className="max-w-xl mx-auto">
          <Header title="Game Over!" subtitle="Waiting for the host to reveal results..." />
          <Card className="text-center mb-6">
            <div className="text-7xl mb-4">🎭</div>
            <h3 className="text-2xl font-bold font-display text-gray-800">The story is ready!</h3>
            <p className="text-gray-500 mt-2">
              The host will reveal the hilarious results soon. In the meantime, test your AI knowledge!
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
              <span className="text-violet-600 text-sm font-medium">Waiting for host...</span>
            </div>
          </Card>
          <TriviaBox />
        </div>
      );
    }

    // Already submitted - waiting screen with trivia
    if (hasSubmitted) {
      return (
        <div className="max-w-xl mx-auto">
          <Header title="Answers Submitted!" subtitle="Waiting for the game to end..." />
          <Card className="text-center mb-6">
            <div className="text-7xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold font-display text-gray-800">Great job, {playerName}!</h3>
            <p className="text-gray-500 mt-2">
              Your answers have been submitted. The host will end the game soon!
            </p>
            <div className="mt-4 p-4 bg-violet-100 rounded-xl">
              <p className="text-violet-700 font-semibold">
                Players in game: {Object.keys(currentGame.players || {}).length}
              </p>
            </div>
          </Card>
          <TriviaBox />
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
              const typeHint = BLANK_TYPE_HINTS[blank.type];
              return (
                <div
                  key={blank.id}
                  className={`p-4 rounded-xl border-2 transition-colors ${
                    filled
                      ? 'bg-emerald-50 border-emerald-400'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <label className="block mb-2">
                    <div className="flex items-center gap-2 font-bold text-gray-800">
                      <span className="w-7 h-7 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm font-bold">
                        {i + 1}
                      </span>
                      {blank.type}
                    </div>
                    {typeHint && (
                      <div className="ml-9 mt-1 text-sm text-gray-500">
                        <span className="italic">{typeHint.hint}</span>
                        <span className="mx-1">—</span>
                        <span className="text-gray-400">e.g., {typeHint.examples}</span>
                      </div>
                    )}
                  </label>
                  <input
                    type="text"
                    value={playerAnswers[blank.id] || ''}
                    onChange={(e) =>
                      setPlayerAnswers({ ...playerAnswers, [blank.id]: e.target.value })
                    }
                    placeholder={typeHint ? `e.g., ${typeHint.examples.split(',')[0].trim()}` : `Enter a ${blank.type.toLowerCase()}...`}
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
        {view === 'admin-login' && (
          <AdminLogin
            onLogin={handleAdminLogin}
            onBack={() => setView('home')}
            showAlert={showAlert}
          />
        )}
        {view === 'admin-dashboard' && (
          <AdminDashboard
            onCreateGame={handleCreateGame}
            onOpenGame={handleOpenGame}
            onLogout={handleAdminLogout}
            showAlert={showAlert}
          />
        )}
        {(view === 'admin-create' || view === 'admin-edit') && renderAdminEditor()}
        {view === 'admin-game' && renderAdminGameView()}
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
