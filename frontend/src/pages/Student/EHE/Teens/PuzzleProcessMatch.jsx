import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleProcessMatch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedStage, setSelectedStage] = useState(null);
  const [selectedDescription, setSelectedDescription] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Design Thinking Stages (left side) - 5 items
  const stages = [
    { id: 1, name: "Empathize", emoji: "❤️",  },
    { id: 2, name: "Define", emoji: "📝",  },
    { id: 3, name: "Ideate", emoji: "💡",  },
    { id: 4, name: "Prototype", emoji: "🛠️",  },
    { id: 5, name: "Test", emoji: "🧪",  }
  ];

  // Descriptions (right side) - 5 items
  const descriptions = [
    { id: 4, name: "Build", emoji: "🏗️",  },
    { id: 1, name: "Understand", emoji: "🔍",  },
    { id: 5, name: "Experiment", emoji: "🔬",  },
    { id: 2, name: "Problem", emoji: "❓",  },
    { id: 3, name: "Brainstorm", emoji: "💭",  },
  ];

  // Correct matches
  const correctMatches = [
    { stageId: 1, descriptionId: 1 }, // Empathize → Understand
    { stageId: 2, descriptionId: 2 }, // Define → Problem
    { stageId: 3, descriptionId: 3 }, // Ideate → Brainstorm
    { stageId: 4, descriptionId: 4 }, // Prototype → Build
    { stageId: 5, descriptionId: 5 }  // Test → Experiment
  ];

  const handleStageSelect = (stage) => {
    if (gameFinished) return;
    setSelectedStage(stage);
  };

  const handleDescriptionSelect = (description) => {
    if (gameFinished) return;
    setSelectedDescription(description);
  };

  const handleMatch = () => {
    if (!selectedStage || !selectedDescription || gameFinished) return;

    resetFeedback();

    const newMatch = {
      stageId: selectedStage.id,
      descriptionId: selectedDescription.id,
      isCorrect: correctMatches.some(
        match => match.stageId === selectedStage.id && match.descriptionId === selectedDescription.id
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
    if (newMatches.length === stages.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedStage(null);
    setSelectedDescription(null);
  };

  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedStage(null);
    setSelectedDescription(null);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ehe/teens/idea-story");
  };

  // Check if a stage is already matched
  const isStageMatched = (stageId) => {
    return matches.some(match => match.stageId === stageId);
  };

  // Check if a description is already matched
  const isDescriptionMatched = (descriptionId) => {
    return matches.some(match => match.descriptionId === descriptionId);
  };

  // Get match result for a stage
  const getMatchResult = (stageId) => {
    const match = matches.find(m => m.stageId === stageId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Process Match"
      subtitle={gameFinished ? "Game Complete!" : `Match Stages with Descriptions (${matches.length}/${stages.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="ehe-teen-34"
      gameType="ehe"
      totalLevels={stages.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ehe/teens"
      maxScore={stages.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Stages */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Stages</h3>
              <div className="space-y-4">
                {stages.map(stage => (
                  <button
                    key={stage.id}
                    onClick={() => handleStageSelect(stage)}
                    disabled={isStageMatched(stage.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isStageMatched(stage.id)
                        ? getMatchResult(stage.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedStage?.id === stage.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{stage.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{stage.name}</h4>
                        <p className="text-white/80 text-sm">{stage.description}</p>
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
                  {selectedStage 
                    ? `Selected: ${selectedStage.name}` 
                    : "Select a Stage"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedStage || !selectedDescription}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedStage && selectedDescription
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{stages.length}</p>
                  <p>Matched: {matches.length}/{stages.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Descriptions */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Descriptions</h3>
              <div className="space-y-4">
                {descriptions.map(description => (
                  <button
                    key={description.id}
                    onClick={() => handleDescriptionSelect(description)}
                    disabled={isDescriptionMatched(description.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isDescriptionMatched(description.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedDescription?.id === description.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{description.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{description.name}</h4>
                        <p className="text-white/80 text-sm">{description.description}</p>
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
                <h3 className="text-2xl font-bold text-white mb-4">Design Thinking Expert!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You correctly matched {score} out of {stages.length} design thinking stages with their descriptions!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Design thinking helps solve complex problems creatively and empathetically!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {stages.length} design thinking stages correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Remember that design thinking starts with understanding people's needs!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleProcessMatch;