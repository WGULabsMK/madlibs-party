import { useState, useEffect, useCallback } from 'react';
import { Brain, CheckCircle, XCircle, ArrowRight, Trophy } from 'lucide-react';
import { Card, Button } from './ui';
import { AI_TRIVIA } from '@/types';
import type { TriviaQuestion } from '@/types';

interface TriviaBoxProps {
  className?: string;
}

export function TriviaBox({ className = '' }: TriviaBoxProps) {
  const [currentQuestion, setCurrentQuestion] = useState<TriviaQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [usedQuestions, setUsedQuestions] = useState<Set<number>>(new Set());

  const getRandomQuestion = useCallback(() => {
    // Get available questions (not yet used)
    const availableIndices = AI_TRIVIA.map((_, i) => i).filter(i => !usedQuestions.has(i));

    // If all questions used, reset
    if (availableIndices.length === 0) {
      setUsedQuestions(new Set());
      const randomIndex = Math.floor(Math.random() * AI_TRIVIA.length);
      return { question: AI_TRIVIA[randomIndex], index: randomIndex };
    }

    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    return { question: AI_TRIVIA[randomIndex], index: randomIndex };
  }, [usedQuestions]);

  useEffect(() => {
    const { question, index } = getRandomQuestion();
    setCurrentQuestion(question);
    setUsedQuestions(prev => new Set(prev).add(index));
  }, []);

  const handleSelectAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);
    setQuestionsAnswered(prev => prev + 1);
    if (selectedAnswer === currentQuestion?.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    const { question, index } = getRandomQuestion();
    setCurrentQuestion(question);
    setUsedQuestions(prev => new Set(prev).add(index));
    setSelectedAnswer(null);
    setShowResult(false);
  };

  if (!currentQuestion) return null;

  const isCorrect = selectedAnswer === currentQuestion.correctIndex;

  return (
    <Card className={`${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-brand-blue" />
          <h3 className="text-lg font-bold font-display text-gray-800">AI Trivia</h3>
        </div>
        {questionsAnswered > 0 && (
          <div className="flex items-center gap-1 text-sm bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full">
            <Trophy className="w-4 h-4" />
            {score}/{questionsAnswered}
          </div>
        )}
      </div>

      <p className="text-gray-700 font-medium mb-4">{currentQuestion.question}</p>

      <div className="space-y-2 mb-4">
        {currentQuestion.options.map((option, index) => {
          let buttonStyle = 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300';

          if (selectedAnswer === index && !showResult) {
            buttonStyle = 'bg-brand-blue/10 border-brand-blue';
          } else if (showResult) {
            if (index === currentQuestion.correctIndex) {
              buttonStyle = 'bg-emerald-100 border-emerald-400';
            } else if (selectedAnswer === index && !isCorrect) {
              buttonStyle = 'bg-red-100 border-red-400';
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleSelectAnswer(index)}
              disabled={showResult}
              className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${buttonStyle} ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {showResult && index === currentQuestion.correctIndex && (
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                )}
                {showResult && selectedAnswer === index && !isCorrect && (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className={`p-3 rounded-lg mb-4 ${isCorrect ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>
          <p className="font-semibold mb-1">{isCorrect ? 'Correct!' : 'Not quite!'}</p>
          <p className="text-sm">{currentQuestion.explanation}</p>
        </div>
      )}

      <div className="flex justify-end">
        {!showResult ? (
          <Button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            variant="primary"
            size="sm"
          >
            Check Answer
          </Button>
        ) : (
          <Button
            onClick={handleNextQuestion}
            variant="secondary"
            size="sm"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Next Question
          </Button>
        )}
      </div>
    </Card>
  );
}
