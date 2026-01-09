import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DebateCashVsDigital = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-46");
  const gameId = gameData?.id || "finance-teens-46";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for DebateCashVsDigital, using fallback ID");
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
      scenario: "Which is better for the future — cash or digital money?",
      positions: [
        { id: "digital", text: "FOR: Digital with safety", emoji: "📱", points: ["Convenient", "Trackable", "Secure with precautions"], isCorrect: true },
        { id: "balanced", text: "BALANCED: Use both wisely", emoji: "⚖️", points: ["Cash for small purchases", "Digital for online", "Balance both methods"], isCorrect: false },
        { id: "cash", text: "AGAINST: Cash is better", emoji: "💵", points: ["No tech needed", "Physical control", "Traditional"], isCorrect: false }
      ]
    },
    {
      id: 2,
      scenario: "Is digital money safer than cash?",
      positions: [
        { id: "balanced", text: "BALANCED: Both have risks", emoji: "⚖️", points: ["Digital: cyber risks", "Cash: physical theft", "Use both carefully"], isCorrect: false },
        { id: "digital", text: "FOR: Digital is safer", emoji: "🔒", points: ["Can be tracked", "Protected by banks", "Can be frozen if stolen"], isCorrect: true },
        { id: "cash", text: "AGAINST: Cash is safer", emoji: "💰", points: ["No hacking risk", "Physical control", "No digital fraud"], isCorrect: false }
      ]
    },
    {
      id: 3,
      scenario: "Should we move completely to digital payments?",
      positions: [
        { id: "cash", text: "AGAINST: Keep cash", emoji: "💵", points: ["Not everyone has tech", "Backup option", "Privacy concerns"], isCorrect: false },
        { id: "balanced", text: "BALANCED: Transition gradually", emoji: "⚖️", points: ["Support both methods", "Educate people", "Gradual change"], isCorrect: false },
        { id: "digital", text: "FOR: Go fully digital", emoji: "📱", points: ["Modern and efficient", "Better tracking", "Future-ready"], isCorrect: true }
      ]
    },
    {
      id: 4,
      scenario: "Which is more convenient for daily use?",
      positions: [
        { id: "digital", text: "FOR: Digital is convenient", emoji: "📲", points: ["Quick transactions", "No need for change", "Works everywhere"], isCorrect: true },
        { id: "cash", text: "AGAINST: Cash is convenient", emoji: "💵", points: ["No battery needed", "Works offline", "Simple to use"], isCorrect: false },
        { id: "balanced", text: "BALANCED: Both have benefits", emoji: "⚖️", points: ["Digital for online", "Cash for offline", "Use what works"], isCorrect: false }
      ]
    },
    {
      id: 5,
      scenario: "Can digital money replace cash completely?",
      positions: [
        { id: "balanced", text: "BALANCED: Coexist together", emoji: "⚖️", points: ["Digital for most", "Cash as backup", "Both have roles"], isCorrect: false },
        { id: "digital", text: "FOR: Yes, with safety", emoji: "🔐", points: ["Technology advances", "Better security", "More efficient"], isCorrect: true },
        { id: "cash", text: "AGAINST: Cash is essential", emoji: "💰", points: ["Universal acceptance", "No tech barriers", "Always available"], isCorrect: false }
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
      title="Debate: Cash vs Digital"
      subtitle={!showResult ? `Round ${currentRound + 1} of ${debateTopics.length}` : "Debate Complete!"}
      score={score}
      currentLevel={currentRound + 1}
      totalLevels={debateTopics.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={debateTopics.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/teen/journal-of-digital-use"
      nextGameIdProp="finance-teens-47"
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
                  You understand the future of digital money!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Digital money with proper safety measures is the future, offering convenience, tracking, and security!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {debateTopics.length} correct.
                  Remember, digital money with safety is the way forward!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Digital money offers convenience, tracking, and security when used safely. It's the future of payments!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateCashVsDigital;

