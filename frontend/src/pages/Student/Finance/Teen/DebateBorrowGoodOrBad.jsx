import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DebateBorrowGoodOrBad = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-56");
  const gameId = gameData?.id || "finance-teens-56";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for DebateBorrowGoodOrBad, using fallback ID");
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
      scenario: "Is borrowing always bad?",
      positions: [
        { id: "planned", text: "Planned borrowing works", emoji: "💡", points: ["Helps in emergencies", "Enables big purchases", "When planned properly"], isCorrect: true },
        { id: "balanced", text: "Borrow with caution", emoji: "⚠️", points: ["For needs, not wants", "Plan repayment", "Use responsibly"], isCorrect: false },
        { id: "bad", text: "Avoid borrowing", emoji: "🚫", points: ["Creates debt", "Adds interest cost", "Financial burden"], isCorrect: false }
      ]
    },
    {
      id: 2,
      scenario: "Should you borrow for wants or needs?",
      positions: [
        { id: "balanced", text: "Borrow for essentials", emoji: "📋", points: ["Needs: education, health", "Avoid wants", "Prioritize essentials"], isCorrect: false },
        { id: "needs", text: "Needs over wants", emoji: "🎓", points: ["Education is investment", "Health is essential", "Wants can wait"], isCorrect: true },
        { id: "wants", text: "Borrow for anything", emoji: "🎯", points: ["Borrow for fun", "No planning needed", "Repay later"], isCorrect: false }
      ]
    },
    {
      id: 3,
      scenario: "Is it okay to borrow without a repayment plan?",
      positions: [
        { id: "no-plan", text: "No planning needed", emoji: "🌀", points: ["Worry later", "No planning", "Spend freely"], isCorrect: false },
        { id: "balanced", text: "Sometimes plan", emoji: "⏳", points: ["Plan for big loans", "Skip for small", "Partial planning"], isCorrect: false },
        { id: "plan", text: "Always plan repayment", emoji: "📝", points: ["Know how to repay", "Avoid debt trap", "Stay in control"], isCorrect: true },
      ]
    },
    {
      id: 4,
      scenario: "Can borrowing help achieve goals?",
      positions: [
        { id: "help", text: "Yes, when used wisely", emoji: "🚀", points: ["Education loans help", "Business loans enable growth", "Smart borrowing works"], isCorrect: true },
        { id: "balanced", text: "Depends on purpose", emoji: "🔍", points: ["Good for education", "Bad for wants", "Case by case"], isCorrect: false },
        { id: "never", text: "Never helps", emoji: "🛑", points: ["Always creates problems", "Never worth it", "Avoid completely"], isCorrect: false }
      ]
    },
    {
      id: 5,
      scenario: "What's the key to good borrowing?",
      positions: [
        { id: "balanced", text: "Moderate borrowing", emoji: "📊", points: ["Borrow sometimes", "Not too much", "Keep it simple"], isCorrect: false },
        { id: "plan-repay", text: "Plan and repay on time", emoji: "⏱️", points: ["Plan before borrowing", "Repay as promised", "Stay disciplined"], isCorrect: true },
        { id: "ignore", text: "Ignore repayment", emoji: "💸", points: ["Borrow freely", "No repayment", "Worry later"], isCorrect: false }
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
      title="Debate: Borrow Good or Bad?"
      subtitle={!showResult ? `Round ${currentRound + 1} of ${debateTopics.length}` : "Debate Complete!"}
      score={score}
      currentLevel={currentRound + 1}
      totalLevels={debateTopics.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={debateTopics.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/teen/journal-of-borrowing"
      nextGameIdProp="finance-teens-57"
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
                  You understand when borrowing is good or bad!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Borrowing is good when planned and repaid on time, especially for needs like education. It's bad when done without a plan or for unnecessary wants!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {debateTopics.length} correct.
                  Remember, borrowing is good if planned and repaid, bad if done carelessly!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Borrowing is good when you plan repayment and use it for needs. It's bad when done without planning or for unnecessary wants!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateBorrowGoodOrBad;

