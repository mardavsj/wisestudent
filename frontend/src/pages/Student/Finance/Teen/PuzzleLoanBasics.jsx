import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getFinanceTeenGames } from "../../../../pages/Games/GameCategories/Finance/teenGamesData";

const PuzzleLoanBasics = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    try {
      const games = getFinanceTeenGames({});
      const currentGame = games.find(g => g.id === "finance-teens-54");
      if (currentGame && currentGame.index !== undefined) {
        const nextGame = games.find(g => g.index === currentGame.index + 1 && g.isSpecial && g.path);
        return {
          nextGamePath: nextGame ? nextGame.path : null,
          nextGameId: nextGame ? nextGame.id : null
        };
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
    }
    
    return { nextGamePath: null, nextGameId: null };
  }, [location.state]);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Loan terms (left side) - 5 items
  const terms = [
    { id: 1, name: "Principal", emoji: "💵",  },
    { id: 2, name: "Interest", emoji: "💰",  },
    { id: 3, name: "Loan Term", emoji: "📅",  },
    { id: 4, name: "EMI", emoji: "📊",  },
    { id: 5, name: "Default", emoji: "⚠️",  }
  ];

  // Loan concepts (right side) - 5 items
  const concepts = [
    { id: 6, name: "Original Amount", emoji: "📝",  },
    { id: 7, name: "Extra Cost", emoji: "➕",  },
    { id: 8, name: "Time Period", emoji: "⏱️",  },
    { id: 9, name: "Regular Payment", emoji: "💳",  },
    { id: 10, name: "Missed Payments", emoji: "🚫",  }
  ];

  // Manually rearrange positions to prevent positional matching
  // Original order was [6,7,8,9,10], rearranged to [8,10,7,6,9]
  const rearrangedConcepts = [
    concepts[2], // Time Period (id: 8)
    concepts[4], // Missed Payments (id: 10)
    concepts[1], // Extra Cost (id: 7)
    concepts[0], // Original Amount (id: 6)
    concepts[3]  // Regular Payment (id: 9)
  ];

  // Correct matches using proper IDs, not positional order
  // Each term has a unique correct match for true one-to-one mapping
  const correctMatches = [
    { termId: 1, conceptId: 6 }, // Principal → Original Amount
    { termId: 2, conceptId: 7 }, // Interest → Extra Cost
    { termId: 3, conceptId: 8 }, // Loan Term → Time Period
    { termId: 4, conceptId: 9 }, // EMI → Regular Payment
    { termId: 5, conceptId: 10 } // Default → Missed Payments
  ];

  const handleTermSelect = (term) => {
    if (gameFinished) return;
    setSelectedTerm(term);
  };

  const handleConceptSelect = (concept) => {
    if (gameFinished) return;
    setSelectedConcept(concept);
  };

  const handleMatch = () => {
    if (!selectedTerm || !selectedConcept || gameFinished) return;

    resetFeedback();

    const newMatch = {
      termId: selectedTerm.id,
      conceptId: selectedConcept.id,
      isCorrect: correctMatches.some(
        match => match.termId === selectedTerm.id && match.conceptId === selectedConcept.id
      )
    };

    const newMatches = [...matches, newMatch];
    setMatches(newMatches);

    // If the match is correct, add score and show flash/confetti
    if (newMatch.isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    // Check if all items are matched
    if (newMatches.length === terms.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedTerm(null);
    setSelectedConcept(null);
  };

  // Check if a term is already matched
  const isTermMatched = (termId) => {
    return matches.some(match => match.termId === termId);
  };

  // Check if a concept is already matched
  const isConceptMatched = (conceptId) => {
    return matches.some(match => match.conceptId === conceptId);
  };

  // Get match result for a term
  const getMatchResult = (termId) => {
    const match = matches.find(m => m.termId === termId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Loan Basics"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Loan Terms with Concepts (${matches.length}/${terms.length} matched)`}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="finance-teens-54"
      gameType="finance"
      totalLevels={terms.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === terms.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/financial-literacy/teens"
      maxScore={terms.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Loan Terms */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Loan Terms</h3>
              <div className="space-y-4">
                {terms.map(term => (
                  <button
                    key={term.id}
                    onClick={() => handleTermSelect(term)}
                    disabled={isTermMatched(term.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isTermMatched(term.id)
                        ? getMatchResult(term.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedTerm?.id === term.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{term.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{term.name}</h4>
                        
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Middle column - Match button */}
            <div className="flex flex-col items-center justify-center">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
                <p className="text-white/80 mb-4">
                  {selectedTerm 
                    ? `Selected: ${selectedTerm.name}` 
                    : "Select a Loan Term"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedTerm || !selectedConcept}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedTerm && selectedConcept
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{terms.length}</p>
                  <p>Matched: {matches.length}/{terms.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Loan Concepts */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Loan Concepts</h3>
              <div className="space-y-4">
                {rearrangedConcepts.map(concept => (
                  <button
                    key={concept.id}
                    onClick={() => handleConceptSelect(concept)}
                    disabled={isConceptMatched(concept.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isConceptMatched(concept.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedConcept?.id === concept.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{concept.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{concept.name}</h4>
                        <p className="text-white/80 text-sm">{concept.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You correctly matched {score} out of {terms.length} loan terms with their concepts!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding loan basics helps make informed borrowing decisions!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {terms.length} loan terms correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about what each loan term actually represents!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleLoanBasics;