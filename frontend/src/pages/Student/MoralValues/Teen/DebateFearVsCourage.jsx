import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DebateFearVsCourage = () => {
  const location = useLocation();
  
  const gameId = "moral-teen-56";
  const gameData = getGameDataById(gameId);
  
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
      scenario: "Is courage the absence of fear?",
      positions: [
        { id: "despite", text: "FOR: Courage means acting despite fear", emoji: "🦁", points: ["Face fears", "Take action", "Show bravery"], isCorrect: true },
        { id: "balanced", text: "BALANCED: Courage and fear coexist", emoji: "⚖️", points: ["Both are normal", "Balance emotions", "Use wisely"], isCorrect: false },
        { id: "noFear", text: "AGAINST: Courageous people feel no fear", emoji: "😌", points: ["No fear", "Always brave", "Never scared"], isCorrect: false }
      ]
    },
    {
      id: 2,
      scenario: "Can fear make us stronger?",
      positions: [
        { id: "balanced", text: "BALANCED: Fear can teach or weaken", emoji: "⚖️", points: ["Depends on response", "Can help or hurt", "Use wisely"], isCorrect: false },
        { id: "resilience", text: "FOR: It teaches resilience and awareness", emoji: "💪", points: ["Builds strength", "Teaches lessons", "Increases awareness"], isCorrect: true },
        { id: "weakens", text: "AGAINST: Fear only weakens us", emoji: "😨", points: ["Makes us weak", "Holds back", "Negative only"], isCorrect: false }
      ]
    },
    {
      id: 3,
      scenario: "Is it brave to admit your fear?",
      positions: [
        { id: "hide", text: "AGAINST: Brave people hide fear", emoji: "🤐", points: ["Never show fear", "Stay strong", "Hide weakness"], isCorrect: false },
        { id: "balanced", text: "BALANCED: Depends on the situation", emoji: "⚖️", points: ["Context matters", "Choose wisely", "Be strategic"], isCorrect: false },
        { id: "honesty", text: "FOR: Honesty is real bravery", emoji: "❤️", points: ["Shows courage", "Builds trust", "True strength"], isCorrect: true }
      ]
    },
    {
      id: 4,
      scenario: "Do courageous people take reckless risks?",
      positions: [
        { id: "wisdom", text: "FOR: Courage includes wisdom and safety", emoji: "🧠", points: ["Think first", "Be smart", "Stay safe"], isCorrect: true },
        { id: "reckless", text: "AGAINST: Courage means taking any risk", emoji: "🔥", points: ["No fear", "Take risks", "Be bold"], isCorrect: false },
        { id: "balanced", text: "BALANCED: Balance courage and caution", emoji: "⚖️", points: ["Be brave", "Stay safe", "Find balance"], isCorrect: false }
      ]
    },
    {
      id: 5,
      scenario: "Can fear guide us to do the right thing?",
      positions: [
        { id: "balanced", text: "BALANCED: Fear can warn or block", emoji: "⚖️", points: ["Can help", "Can hinder", "Use judgment"], isCorrect: false },
        { id: "blocks", text: "AGAINST: Fear blocks right choices", emoji: "🚫", points: ["Prevents action", "Holds back", "Negative only"], isCorrect: false },
        { id: "guide", text: "FOR: Fear can warn and guide wisely", emoji: "🧭", points: ["Warns of danger", "Helps decisions", "Protects us"], isCorrect: true }
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
      title="Debate: Fear vs Courage"
      subtitle={!showResult ? `Round ${currentRound + 1} of ${debateTopics.length}` : "Debate Complete!"}
      score={score}
      currentLevel={currentRound + 1}
      totalLevels={debateTopics.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={debateTopics.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/moral-values/teen/courage-journal1"
      nextGameIdProp="moral-teen-57"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="moral"
    >
      <div className="space-y-8">
        {!showResult && debateTopics[currentRound] ? (
          <div className="space-y-6">
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
                    className={`w-full text-left p-6 rounded-2xl transition-all transform hover:scale-105 border ${
                      answered && selectedPosition === position.id
                        ? position.isCorrect
                          ? "bg-green-500/20 border-green-400 ring-4 ring-green-400"
                          : "bg-red-500/20 border-red-400 ring-4 ring-red-400"
                        : selectedPosition === position.id
                        ? "bg-blue-500/30 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border-white/20"
                    } ${answered ? "opacity-75 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">{position.emoji}</span>
                      <div className="font-bold text-lg text-white">{position.text}</div>
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
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Debate Master!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You scored {score} out of {debateTopics.length}!
                  You understand that courage is acting despite fear!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Courage isn't the absence of fear — it's acting despite fear!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You scored {score} out of {debateTopics.length}.
                  Remember, true courage means facing your fears and taking action!
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
                  Tip: Courage means feeling fear but still doing what's right.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateFearVsCourage;

