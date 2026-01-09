import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DebateJobVsBusiness = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-76");
  const gameId = gameData?.id || "finance-teens-76";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for DebateJobVsBusiness, using fallback ID");
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
      scenario: "Is it better to do a job or start a business?",
      positions: [
        { id: "business", text: "Business builds independence", emoji: "💡", points: ["Own your time", "Unlimited earning", "Build wealth"], isCorrect: true },
        { id: "balanced", text: "Depends on person", emoji: "⚠️", points: ["Job for security", "Business for growth", "Choose wisely"], isCorrect: false },
        { id: "job", text: "Job is always better", emoji: "🚫", points: ["Guaranteed income", "Less risk", "Stable life"], isCorrect: false }
      ]
    },
    {
      id: 2,
      scenario: "Which offers more financial freedom?",
      positions: [
        { id: "balanced2", text: "Both can work", emoji: "📋", points: ["Job provides security", "Business provides growth", "Depends on goals"], isCorrect: false },
        { id: "business2", text: "Business wins", emoji: "🎓", points: ["Unlimited income", "Own decisions", "Build assets"], isCorrect: true },
        { id: "job2", text: "Job wins", emoji: "🎯", points: ["Fixed salary", "Limited growth", "Dependent on employer"], isCorrect: false }
      ]
    },
    {
      id: 3,
      scenario: "Which has more risk?",
      positions: [
        { id: "business3", text: "Business has more risk", emoji: "📈", points: ["Can lose money", "No guaranteed income", "Market risks"], isCorrect: true },
        { id: "same", text: "Both equal risk", emoji: "📊", points: ["Equal risk", "No difference", "Same challenges"], isCorrect: false },
        { id: "job3", text: "Job has more risk", emoji: "🏦", points: ["Job is riskier", "Can be fired", "Less secure"], isCorrect: false }
      ]
    },
    {
      id: 4,
      scenario: "What's better for long-term wealth?",
      positions: [
        { id: "business4", text: "Business for wealth", emoji: "💼", points: ["Build assets", "Scalable income", "Create value"], isCorrect: true },
        { id: "balanced3", text: "Both can work", emoji: "🔐", points: ["Job with savings", "Business with risk", "Mix both"], isCorrect: false },
        { id: "job4", text: "Job for wealth", emoji: "🎲", points: ["Fixed income", "Limited growth", "Salary only"], isCorrect: false }
      ]
    },
    {
      id: 5,
      scenario: "Which requires more responsibility?",
      positions: [
        { id: "balanced4", text: "Both have responsibility", emoji: "⏱️", points: ["Job: work duties", "Business: everything", "Both matter"], isCorrect: false },
        { id: "business5", text: "Business requires more", emoji: "⏰", points: ["Full responsibility", "All decisions", "Success or failure"], isCorrect: true },
        { id: "job5", text: "Job requires more", emoji: "💸", points: ["Less responsibility", "Follow orders", "Limited scope"], isCorrect: false }
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
      title="Debate: Job vs Business"
      subtitle={!showResult ? `Round ${currentRound + 1} of ${debateTopics.length}` : "Debate Complete!"}
      score={score}
      currentLevel={currentRound + 1}
      totalLevels={debateTopics.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={debateTopics.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/teen/journal-entrepreneur-dream"
      nextGameIdProp="finance-teens-77"
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
                  You understand the job vs business debate!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Business builds independence and wealth but has more risk. Jobs offer security but limited growth. The best choice depends on your goals and risk tolerance!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {debateTopics.length} correct.
                  Remember, business builds independence but has more risk. Jobs offer security but limited growth!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Business offers independence and unlimited earning potential but has more risk. Jobs offer security but limited growth. Choose based on your goals!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateJobVsBusiness;

