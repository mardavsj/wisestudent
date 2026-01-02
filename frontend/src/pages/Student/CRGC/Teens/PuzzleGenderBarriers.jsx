import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleGenderBarriers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Concepts (left side) - 5 items
  const concepts = [
    { id: 1, name: "Equal Pay", emoji: "✅",  },
    { id: 2, name: "Girls Out of School", emoji: "❌",  },
    { id: 3, name: "Women Leaders", emoji: "👍",  },
    { id: 4, name: "Career Limitations", emoji: "🚫",  },
    { id: 5, name: "Shared Responsibilities", emoji: "🤝",  }
  ];

  // Evaluations (right side) - 5 items
  const evaluations = [
    { id: 2, name: "Wrong", emoji: "⚠️",  },
    { id: 3, name: "Positive", emoji: "🌟",  },
    { id: 1, name: "Fair", emoji: "⚖️",  },
    { id: 5, name: "Beneficial", emoji: "💚",  },
    { id: 4, name: "Harmful", emoji: "💔",  },
  ];

  // Correct matches
  const correctMatches = [
    { conceptId: 1, evaluationId: 1 }, // Equal Pay → Fair
    { conceptId: 2, evaluationId: 2 }, // Girls Out of School → Wrong
    { conceptId: 3, evaluationId: 3 }, // Women Leaders → Positive
    { conceptId: 4, evaluationId: 4 }, // Career Limitations → Harmful
    { conceptId: 5, evaluationId: 5 }  // Shared Responsibilities → Beneficial
  ];

  const handleConceptSelect = (concept) => {
    if (gameFinished) return;
    setSelectedConcept(concept);
  };

  const handleEvaluationSelect = (evaluation) => {
    if (gameFinished) return;
    setSelectedEvaluation(evaluation);
  };

  const handleMatch = () => {
    if (!selectedConcept || !selectedEvaluation || gameFinished) return;

    resetFeedback();

    const newMatch = {
      conceptId: selectedConcept.id,
      evaluationId: selectedEvaluation.id,
      isCorrect: correctMatches.some(
        match => match.conceptId === selectedConcept.id && match.evaluationId === selectedEvaluation.id
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
    setSelectedEvaluation(null);
  };

  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedConcept(null);
    setSelectedEvaluation(null);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/teens");
  };

  // Check if a concept is already matched
  const isConceptMatched = (conceptId) => {
    return matches.some(match => match.conceptId === conceptId);
  };

  // Check if an evaluation is already matched
  const isEvaluationMatched = (evaluationId) => {
    return matches.some(match => match.evaluationId === evaluationId);
  };

  // Get match result for a concept
  const getMatchResult = (conceptId) => {
    const match = matches.find(m => m.conceptId === conceptId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Gender Barriers"
      subtitle={gameFinished ? "Game Complete!" : `Match Gender Concepts with Evaluations (${matches.length}/${concepts.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="civic-responsibility-teens-24"
      gameType="civic-responsibility"
      totalLevels={concepts.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/civic-responsibility/teens"
      maxScore={concepts.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Concepts */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Gender Concepts</h3>
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
                        <p className="text-white/80 text-sm">{concept.description}</p>
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
                    : "Select a Gender Concept"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedConcept || !selectedEvaluation}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedConcept && selectedEvaluation
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

            {/* Right column - Evaluations */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Evaluations</h3>
              <div className="space-y-4">
                {evaluations.map(evaluation => (
                  <button
                    key={evaluation.id}
                    onClick={() => handleEvaluationSelect(evaluation)}
                    disabled={isEvaluationMatched(evaluation.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isEvaluationMatched(evaluation.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedEvaluation?.id === evaluation.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{evaluation.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{evaluation.name}</h4>
                        <p className="text-white/80 text-sm">{evaluation.description}</p>
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
                <div className="text-5xl mb-4">🧩</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You correctly matched {score} out of {concepts.length} gender concepts with their evaluations!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding gender equality helps create a more inclusive and fair society for everyone!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {concepts.length} gender concepts correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about whether each gender concept represents a positive or negative approach to equality!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleGenderBarriers;