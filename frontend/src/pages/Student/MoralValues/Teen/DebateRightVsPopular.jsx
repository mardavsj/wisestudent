import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DebateRightVsPopular = () => {
  const location = useLocation();
  
  const gameId = "moral-teen-96";
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
      scenario: "Would you rather be liked or be honest?",
      positions: [
        { id: "honest", text: "FOR: Honest - even if unpopular", emoji: "💬", points: ["Builds trust", "Shows integrity", "Long-term respect"], isCorrect: true },
        { id: "balanced", text: "BALANCED: Be honest but kind", emoji: "⚖️", points: ["Tell truth", "Be tactful", "Balance both"], isCorrect: false },
        { id: "liked", text: "AGAINST: Liked - to fit in", emoji: "😅", points: ["Stay popular", "Avoid conflict", "Keep friends"], isCorrect: false }
      ]
    },
    {
      id: 2,
      scenario: "If friends cheat, should you report or stay quiet?",
      positions: [
        { id: "balanced", text: "BALANCED: Talk to them first, then decide", emoji: "⚖️", points: ["Address privately", "Give chance", "Then decide"], isCorrect: false },
        { id: "report", text: "FOR: Report it - it's the right thing", emoji: "⚖️", points: ["Stand for justice", "Do what's right", "Show integrity"], isCorrect: true },
        { id: "quiet", text: "AGAINST: Stay quiet to keep friends", emoji: "🤫", points: ["Protect friends", "Avoid trouble", "Stay loyal"], isCorrect: false }
      ]
    },
    {
      id: 3,
      scenario: "Should you follow trends that go against your values?",
      positions: [
        { id: "trends", text: "AGAINST: Yes - everyone's doing it", emoji: "📱", points: ["Fit in", "Stay current", "Be popular"], isCorrect: false },
        { id: "balanced", text: "BALANCED: Some trends are okay, some aren't", emoji: "⚖️", points: ["Evaluate each", "Choose wisely", "Be selective"], isCorrect: false },
        { id: "values", text: "FOR: Stay true to your values", emoji: "🧭", points: ["Maintain integrity", "Stand firm", "Be yourself"], isCorrect: true }
      ]
    },
    {
      id: 4,
      scenario: "Should you stand up for a bullied classmate even if others won't?",
      positions: [
        { id: "stand", text: "FOR: Stand up for them", emoji: "🦸‍♂️", points: ["Show courage", "Protect others", "Do what's right"], isCorrect: true },
        { id: "silent", text: "AGAINST: Stay silent to avoid attention", emoji: "😐", points: ["Avoid trouble", "Stay safe", "Don't get involved"], isCorrect: false },
        { id: "balanced", text: "BALANCED: Support privately if possible", emoji: "⚖️", points: ["Help quietly", "Avoid conflict", "Be careful"], isCorrect: false }
      ]
    },
    {
      id: 5,
      scenario: "Is being right more important than being famous?",
      positions: [
        { id: "balanced", text: "BALANCED: Both matter in different ways", emoji: "⚖️", points: ["Right matters", "Recognition helps", "Balance both"], isCorrect: false },
        { id: "fame", text: "AGAINST: Fame matters most", emoji: "🌟", points: ["Get recognition", "Be known", "Build reputation"], isCorrect: false },
        { id: "integrity", text: "FOR: Integrity matters more", emoji: "💎", points: ["True character", "Long-term respect", "Self-respect"], isCorrect: true }
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
      title="Debate: Right vs Popular"
      subtitle={!showResult ? `Round ${currentRound + 1} of ${debateTopics.length}` : "Debate Complete!"}
      score={score}
      currentLevel={currentRound + 1}
      totalLevels={debateTopics.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={debateTopics.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/moral-values/teen/journal-of-ethics"
      nextGameIdProp="moral-teen-97"
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
                  You understand that doing what's right matters more than being popular!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Integrity and doing what's right build lasting respect and self-worth!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You scored {score} out of {debateTopics.length}.
                  Remember, doing what's right builds character and long-term respect!
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
                  Tip: Doing what's right, even when unpopular, shows true character and integrity.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateRightVsPopular;

