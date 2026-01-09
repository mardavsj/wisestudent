import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DebatePeaceVsRevenge = () => {
  const location = useLocation();
  
  const gameId = "moral-teen-86";
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
      scenario: "When someone hurts you, what truly brings peace?",
      positions: [
        { id: "forgive", text: "FOR: Forgiving them and moving on", emoji: "🕊️", points: ["Release anger", "Find peace", "Move forward"], isCorrect: true },
        { id: "balanced", text: "BALANCED: Depends on the situation", emoji: "⚖️", points: ["Consider context", "Some forgive", "Some don't"], isCorrect: false },
        { id: "revenge", text: "AGAINST: Getting back at them", emoji: "⚔️", points: ["Show strength", "Get even", "Feel better"], isCorrect: false }
      ]
    },
    {
      id: 2,
      scenario: "What does revenge often lead to?",
      positions: [
        { id: "balanced", text: "BALANCED: Can satisfy or create problems", emoji: "⚖️", points: ["Sometimes works", "Sometimes backfires", "Depends"], isCorrect: false },
        { id: "pain", text: "FOR: More anger and pain", emoji: "💔", points: ["Continues cycle", "Creates more hurt", "No peace"], isCorrect: true },
        { id: "satisfaction", text: "AGAINST: Inner satisfaction", emoji: "😊", points: ["Feel better", "Get justice", "Closure"], isCorrect: false }
      ]
    },
    {
      id: 3,
      scenario: "What shows true strength?",
      positions: [
        { id: "suffer", text: "AGAINST: Making the other person suffer", emoji: "😠", points: ["Show power", "Get respect", "Prove strength"], isCorrect: false },
        { id: "balanced", text: "BALANCED: Balance strength and peace", emoji: "⚖️", points: ["Stand up", "But forgive", "Find balance"], isCorrect: false },
        { id: "calm", text: "FOR: Letting go and staying calm", emoji: "🧘", points: ["Inner strength", "Self-control", "True power"], isCorrect: true }
      ]
    },
    {
      id: 4,
      scenario: "What helps build a peaceful world?",
      positions: [
        { id: "forgiveness", text: "FOR: Forgiveness and understanding", emoji: "🤝", points: ["Breaks cycles", "Builds peace", "Creates harmony"], isCorrect: true },
        { id: "retaliation", text: "AGAINST: Revenge and retaliation", emoji: "⚔️", points: ["Shows strength", "Maintains order", "Justice"], isCorrect: false },
        { id: "balanced", text: "BALANCED: Both have their place", emoji: "⚖️", points: ["Sometimes forgive", "Sometimes act", "Balance needed"], isCorrect: false }
      ]
    },
    {
      id: 5,
      scenario: "If someone apologizes sincerely, what should you do?",
      positions: [
        { id: "balanced", text: "BALANCED: Consider the apology carefully", emoji: "⚖️", points: ["Evaluate sincerity", "Decide wisely", "Your choice"], isCorrect: false },
        { id: "grudge", text: "AGAINST: Hold a grudge and plan revenge", emoji: "😤", points: ["Don't trust", "Stay angry", "Get even"], isCorrect: false },
        { id: "forgive", text: "FOR: Forgive them and move forward", emoji: "💗", points: ["Accept apology", "Find closure", "Build peace"], isCorrect: true }
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
      title="Debate: Peace vs Revenge"
      subtitle={!showResult ? `Round ${currentRound + 1} of ${debateTopics.length}` : "Debate Complete!"}
      score={score}
      currentLevel={currentRound + 1}
      totalLevels={debateTopics.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={debateTopics.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/moral-values/teen/journal-of-resolution"
      nextGameIdProp="moral-teen-87"
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
                  You understand that peace comes from forgiveness, not revenge!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Revenge doesn't bring peace — forgiveness breaks the cycle of hurt!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You scored {score} out of {debateTopics.length}.
                  Remember, forgiveness brings peace while revenge continues the cycle of hurt!
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
                  Tip: Forgiveness releases you from anger and brings inner peace.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebatePeaceVsRevenge;

