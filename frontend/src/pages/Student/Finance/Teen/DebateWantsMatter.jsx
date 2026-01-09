import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DebateWantsMatter = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-36");
  const gameId = gameData?.id || "finance-teens-36";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for DebateWantsMatter, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const debateTopics = [
    {
      id: 1,
      scenario: "Should you ignore wants completely?",
      positions: [
        { id: "balance", text: "BALANCED: Balance needs and wants", emoji: "⚖️", points: ["Enjoy life", "Meet needs", "Plan spending"], isCorrect: true },
        { id: "ignore", text: "AGAINST: Ignore wants", emoji: "🤦", points: ["Focus on needs", "Save all money", "Avoid fun"], isCorrect: false },
        { id: "wants", text: "FOR: Wants matter", emoji: "🙂", points: ["Enjoyment important", "Life balance", "Happiness matters"], isCorrect: false }
      ]
    },
    {
      id: 2,
      scenario: "Are wants worth budgeting for?",
      positions: [
        { id: "wants", text: "FOR: Budget for wants", emoji: "😊", points: ["Plan fun", "Avoid overspending", "Stay happy"], isCorrect: true },
        { id: "balanced", text: "BALANCED: Budget wisely", emoji: "⚖️", points: ["Some wants, some needs", "Moderate approach", "Flexible planning"], isCorrect: false },
        { id: "nobudget", text: "AGAINST: Don't budget wants", emoji: "😲", points: ["Spend freely", "Risk debt", "No plan"], isCorrect: false }
      ]
    },
    {
      id: 3,
      scenario: "Should wants come before savings?",
      positions: [
        { id: "wants", text: "AGAINST: Wants first", emoji: "🤦", points: ["Instant fun", "Risk overspending", "No savings"], isCorrect: false },
        { id: "balanced", text: "BALANCED: Balance both", emoji: "⚖️", points: ["Save some, enjoy some", "Moderate approach", "Both matter"], isCorrect: false },
        { id: "savings", text: "FOR: Savings first", emoji: "🙂", points: ["Secure future", "Avoid debt", "Build wealth"], isCorrect: true }
      ]
    },
    {
      id: 4,
      scenario: "Can wants improve your life?",
      positions: [
        { id: "planned", text: "FOR: Planned wants help", emoji: "😊", points: ["Boost mood", "Fit budget", "Controlled spending"], isCorrect: true },
        { id: "balanced", text: "BALANCED: Some wants help", emoji: "⚖️", points: ["Moderate enjoyment", "Not all wants", "Selective spending"], isCorrect: false },
        { id: "unplanned", text: "AGAINST: Unplanned wants hurt", emoji: "😲", points: ["Cause debt", "Disrupt budget", "Stressful"], isCorrect: false }
      ]
    },
    {
      id: 5,
      scenario: "Should wants be part of a budget?",
      positions: [
        { id: "exclude", text: "AGAINST: Exclude wants", emoji: "👎", points: ["Only needs", "No enjoyment", "Strict life"], isCorrect: false },
        { id: "include", text: "FOR: Include wants", emoji: "🙂", points: ["Balanced life", "Motivate saving", "Planned fun"], isCorrect: true },
        { id: "balanced", text: "BALANCED: Include some wants", emoji: "⚖️", points: ["Limited wants", "Mostly needs", "Moderate fun"], isCorrect: false }
      ]
    }
  ];

  const handlePositionSelect = (positionId) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    const topic = debateTopics[currentRound];
    const isCorrect = topic.positions.find(pos => pos.id === positionId)?.isCorrect;

    setSelectedPosition(positionId);
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    const isLastRound = currentRound === debateTopics.length - 1;
    
    if (isLastRound) {
      setGameComplete(true);
      setTimeout(() => setShowResult(true), 500);
    } else {
      setTimeout(() => {
        setCurrentRound(prev => prev + 1);
        setSelectedPosition(null);
        setAnswered(false);
      }, 500);
    }
  };

  return (
    <GameShell
      title="Debate: Wants Matter Too?"
      subtitle={!showResult ? `Round ${currentRound + 1} of ${debateTopics.length}` : "Debate Complete!"}
      score={score}
      currentLevel={currentRound + 1}
      totalLevels={debateTopics.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={debateTopics.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/teen/journal-of-balance"
      nextGameIdProp="finance-teens-37"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="finance"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80">Round {currentRound + 1}/{debateTopics.length}</span>
              <span className="text-yellow-400 font-bold">Score: {score}/{debateTopics.length}</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-4">{debateTopics[currentRound].scenario}</h3>
            <h4 className="text-lg font-semibold text-white/90 mb-4">Take a Position:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {debateTopics[currentRound].positions.map((position) => (
                <button
                  key={position.id}
                  onClick={() => handlePositionSelect(position.id)}
                  disabled={answered}
                  className={`w-full text-left p-6 rounded-2xl transition-all border-2 ${
                    answered && selectedPosition === position.id
                      ? position.isCorrect
                        ? "bg-green-500/30 border-green-500"
                        : "bg-red-500/30 border-red-500"
                      : selectedPosition === position.id
                      ? "bg-blue-500/30 border-blue-400"
                      : "bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/40"
                  } ${answered ? "opacity-75 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{position.emoji}</span>
                    <div className="font-bold text-white text-lg">{position.text}</div>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-white/80">
                    {position.points.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {debateTopics.length} rounds correct!
                  You understand the importance of balancing needs and wants!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Balance needs and wants wisely - wants matter but should be planned and budgeted!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {debateTopics.length} rounds correct.
                  Remember, wants matter but should be balanced with needs and savings!
                </p>
                <button
                  onClick={() => {
                    setShowResult(false);
                    setCurrentRound(0);
                    setScore(0);
                    setSelectedPosition(null);
                    setAnswered(false);
                    setGameComplete(false);
                    resetFeedback();
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Wants are important for happiness, but they should be planned, budgeted, and balanced with needs and savings.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateWantsMatter;