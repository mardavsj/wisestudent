import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DebateSaveVsInvest = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-66");
  const gameId = gameData?.id || "finance-teens-66";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for DebateSaveVsInvest, using fallback ID");
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
      scenario: "Is saving enough or should we invest too?",
      positions: [
        { id: "invest", text: "Invest wisely", emoji: "💡", points: ["Beat inflation", "Higher returns", "Grow wealth"], isCorrect: true },
        { id: "balanced", text: "Save and invest mix", emoji: "⚠️", points: ["Save for safety", "Invest for growth", "Mix both"], isCorrect: false },
        { id: "save", text: "Only save", emoji: "🚫", points: ["Saving is enough", "No risk", "Keep it simple"], isCorrect: false }
      ]
    },
    {
      id: 2,
      scenario: "Should you invest all your savings?",
      positions: [
        { id: "balanced2", text: "Keep emergency fund", emoji: "📋", points: ["Save for emergencies", "Invest the rest", "Balance both"], isCorrect: false },
        { id: "invest2", text: "Invest after emergency fund", emoji: "🎓", points: ["Save 3-6 months expenses", "Then invest", "Smart strategy"], isCorrect: true },
        { id: "all", text: "Invest everything", emoji: "🚀", points: ["Put all in investments", "No savings", "Maximum growth"], isCorrect: false }
      ]
    },
    {
      id: 3,
      scenario: "Which grows money faster?",
      positions: [
        { id: "same", text: "Both equal", emoji: "📊", points: ["Equal growth", "No difference", "Same result"], isCorrect: false },
        { id: "save2", text: "Saving wins", emoji: "🏦", points: ["Saving is faster", "No risk", "Guaranteed"], isCorrect: false },
        { id: "invest3", text: "Investing wins", emoji: "📈", points: ["Higher returns", "Beat inflation", "Compound growth"], isCorrect: true },
      ]
    },
    {
      id: 4,
      scenario: "What's the best strategy for long-term wealth?",
      positions: [
        { id: "only-save", text: "Only save", emoji: "🔐", points: ["Saving is enough", "Low risk", "Simple approach"], isCorrect: false },
        { id: "mix", text: "Mix save and invest", emoji: "💼", points: ["Save for security", "Invest for growth", "Best of both"], isCorrect: true },
        { id: "only-invest", text: "Only invest", emoji: "🎲", points: ["Invest everything", "No savings", "Maximum risk"], isCorrect: false }
      ]
    },
    {
      id: 5,
      scenario: "When should you start investing?",
      positions: [
        { id: "early", text: "Start early", emoji: "⏱️", points: ["Time is your friend", "Compound interest", "Long-term growth"], isCorrect: true },
        { id: "later", text: "Wait until older", emoji: "⏰", points: ["Wait for more money", "Start later", "No rush"], isCorrect: false },
        { id: "never", text: "Never invest", emoji: "💸", points: ["Too risky", "Just save", "Avoid investing"], isCorrect: false }
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

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentRound(0);
    setScore(0);
    setSelectedPosition(null);
    setAnswered(false);
    setGameComplete(false);
    resetFeedback();
  };

  const currentTopic = debateTopics[currentRound];

  return (
    <GameShell
      title="Debate: Save vs Invest"
      subtitle={!showResult ? `Round ${currentRound + 1} of ${debateTopics.length}` : "Debate Complete!"}
      score={score}
      currentLevel={currentRound + 1}
      totalLevels={debateTopics.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={debateTopics.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/teen/journal-future-investing"
      nextGameIdProp="finance-teens-67"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="finance"
    >
      <div className="space-y-8">
        {!showResult && currentTopic ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Round {currentRound + 1}/{debateTopics.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{debateTopics.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {currentTopic.scenario}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentTopic.positions.map((position) => (
                  <button
                    key={position.id}
                    onClick={() => handlePositionSelect(position.id)}
                    disabled={answered}
                    className={`p-6 rounded-2xl text-center transition-all transform ${
                      answered
                        ? position.isCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : selectedPosition === position.id
                          ? "bg-red-500/20 border-4 border-red-400 ring-4 ring-red-400"
                          : "bg-white/5 border-2 border-white/20 opacity-50"
                        : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                    } ${answered ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <span className="text-4xl">{position.emoji}</span>
                      <span className="font-semibold text-lg">{position.text}</span>
                      <div className="text-sm opacity-90 space-y-1">
                        {position.points.map((point, idx) => (
                          <div key={idx}>• {point}</div>
                        ))}
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
                <h3 className="text-2xl font-bold text-white mb-4">Debate Complete!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {debateTopics.length} correct!
                  You understand the balance between saving and investing!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Saving is important for security, but investing wisely helps grow wealth and beat inflation. The best strategy is to do both!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {debateTopics.length} correct.
                  Remember, saving provides security, but investing wisely helps grow wealth!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Save for emergencies and security, then invest wisely to grow wealth and beat inflation. Start early for best results!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateSaveVsInvest;

