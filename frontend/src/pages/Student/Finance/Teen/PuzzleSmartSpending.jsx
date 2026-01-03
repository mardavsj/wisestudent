import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getFinanceTeenGames } from "../../../../pages/Games/GameCategories/Finance/teenGamesData";

const PuzzleSmartSpending = () => {
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
      const currentGame = games.find(g => g.id === "finance-teens-14");
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
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [selectedMeaning, setSelectedMeaning] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Spending concepts (left side) - 5 items
  const concepts = [
    { id: 1, name: "Budget", emoji: "📋",  },
    { id: 2, name: "Waste", emoji: "🗑️",  },
    { id: 3, name: "Needs", emoji: "🎯",  },
    { id: 4, name: "Wants", emoji: "🎁",  },
    { id: 5, name: "Emergency Fund", emoji: "🛡️",  }
  ];

  // Financial meanings (right side) - 5 items
  const meanings = [
    { id: 6, name: "Financial Planning", emoji: "📝",  },
    { id: 7, name: "Resource Misuse", emoji: "⚠️",  },
    { id: 8, name: "Essential Priorities", emoji: "⭐",  },
    { id: 9, name: "Discretionary Spending", emoji: "💎",  },
    { id: 10, name: "Risk Protection", emoji: "🔒",  }
  ];

  // Manually rearrange positions to prevent positional matching
  // Original order was [6,7,8,9,10], rearranged to [8,10,7,6,9]
  const rearrangedMeanings = [
    meanings[2], // Essential Priorities (id: 8)
    meanings[4], // Risk Protection (id: 10)
    meanings[1], // Resource Misuse (id: 7)
    meanings[0], // Financial Planning (id: 6)
    meanings[3]  // Discretionary Spending (id: 9)
  ];

  // Correct matches using proper IDs, not positional order
  // Each concept has a unique correct match for true one-to-one mapping
  const correctMatches = [
    { conceptId: 1, meaningId: 6 }, // Budget → Financial Planning
    { conceptId: 2, meaningId: 7 }, // Waste → Resource Misuse
    { conceptId: 3, meaningId: 8 }, // Needs → Essential Priorities
    { conceptId: 4, meaningId: 9 }, // Wants → Discretionary Spending
    { conceptId: 5, meaningId: 10 } // Emergency Fund → Risk Protection
  ];

  const handleConceptSelect = (concept) => {
    if (gameFinished) return;
    setSelectedConcept(concept);
  };

  const handleMeaningSelect = (meaning) => {
    if (gameFinished) return;
    setSelectedMeaning(meaning);
  };

  const handleMatch = () => {
    if (!selectedConcept || !selectedMeaning || gameFinished) return;

    resetFeedback();

    const newMatch = {
      conceptId: selectedConcept.id,
      meaningId: selectedMeaning.id,
      isCorrect: correctMatches.some(
        match => match.conceptId === selectedConcept.id && match.meaningId === selectedMeaning.id
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
    if (newMatches.length === concepts.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedConcept(null);
    setSelectedMeaning(null);
  };

  // Check if a concept is already matched
  const isConceptMatched = (conceptId) => {
    return matches.some(match => match.conceptId === conceptId);
  };

  // Check if a meaning is already matched
  const isMeaningMatched = (meaningId) => {
    return matches.some(match => match.meaningId === meaningId);
  };

  // Get match result for a concept
  const getMatchResult = (conceptId) => {
    const match = matches.find(m => m.conceptId === conceptId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Smart Spending"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Concepts with Meanings (${matches.length}/${concepts.length} matched)`}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="finance-teens-14"
      gameType="finance"
      totalLevels={concepts.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === concepts.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/financial-literacy/teens"
      maxScore={concepts.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Spending Concepts */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Spending Concepts</h3>
              <div className="space-y-4">
                {concepts.map(concept => (
                  <button
                    key={concept.id}
                    onClick={() => handleConceptSelect(concept)}
                    disabled={isConceptMatched(concept.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isConceptMatched(concept.id)
                        ? getMatchResult(concept.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedConcept?.id === concept.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{concept.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{concept.name}</h4>
                        
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
                  {selectedConcept 
                    ? `Selected: ${selectedConcept.name}` 
                    : "Select a Spending Concept"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedConcept || !selectedMeaning}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedConcept && selectedMeaning
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{concepts.length}</p>
                  <p>Matched: {matches.length}/{concepts.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Financial Meanings */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Financial Meanings</h3>
              <div className="space-y-4">
                {rearrangedMeanings.map(meaning => (
                  <button
                    key={meaning.id}
                    onClick={() => handleMeaningSelect(meaning)}
                    disabled={isMeaningMatched(meaning.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isMeaningMatched(meaning.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedMeaning?.id === meaning.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{meaning.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{meaning.name}</h4>
                        <p className="text-white/80 text-sm">{meaning.description}</p>
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
                  You correctly matched {score} out of {concepts.length} spending concepts with their meanings!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding spending concepts leads to better financial decisions!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {concepts.length} spending concepts correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about what each spending concept actually represents!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleSmartSpending;