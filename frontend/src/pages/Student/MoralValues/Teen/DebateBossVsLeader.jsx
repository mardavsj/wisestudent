import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DebateBossVsLeader = () => {
  const location = useLocation();
  
  const gameId = "moral-teen-76";
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
      scenario: "A boss commands, a leader inspires — which is better?",
      positions: [
        { id: "inspire", text: "FOR: Inspiring motivates lasting results", emoji: "🌟", points: ["Builds loyalty", "Creates passion", "Long-term success"], isCorrect: true },
        { id: "balanced", text: "BALANCED: Both have their place", emoji: "⚖️", points: ["Sometimes command", "Sometimes inspire", "Balance needed"], isCorrect: false },
        { id: "command", text: "AGAINST: Commanding shows authority", emoji: "🗣️", points: ["Clear orders", "Quick action", "Shows control"], isCorrect: false }
      ]
    },
    {
      id: 2,
      scenario: "Should a leader take credit or share it?",
      positions: [
        { id: "balanced", text: "BALANCED: Share major credit, take responsibility", emoji: "⚖️", points: ["Recognize team", "Take responsibility", "Balance both"], isCorrect: false },
        { id: "share", text: "FOR: Share credit with the team", emoji: "🤝", points: ["Uplift others", "Build trust", "Team success"], isCorrect: true },
        { id: "take", text: "AGAINST: Take full credit for control", emoji: "👑", points: ["Show authority", "Maintain control", "Your success"], isCorrect: false }
      ]
    },
    {
      id: 3,
      scenario: "When mistakes happen, what should a leader do?",
      positions: [
        { id: "blame", text: "AGAINST: Blame others quickly", emoji: "⚠️", points: ["Find fault", "Protect yourself", "Shift blame"], isCorrect: false },
        { id: "balanced", text: "BALANCED: Address issues fairly", emoji: "⚖️", points: ["Investigate first", "Fair assessment", "Learn from it"], isCorrect: false },
        { id: "responsibility", text: "FOR: Take responsibility and guide", emoji: "🧭", points: ["Accountable", "Fix problems", "Guide team"], isCorrect: true }
      ]
    },
    {
      id: 4,
      scenario: "A boss uses fear; a leader uses respect — agree?",
      positions: [
        { id: "respect", text: "FOR: Respect motivates more", emoji: "💎", points: ["Builds loyalty", "Creates trust", "Long-term success"], isCorrect: true },
        { id: "fear", text: "AGAINST: Fear keeps control", emoji: "😠", points: ["Maintains order", "Quick compliance", "Shows power"], isCorrect: false },
        { id: "balanced", text: "BALANCED: Both can work in different situations", emoji: "⚖️", points: ["Context matters", "Sometimes fear", "Sometimes respect"], isCorrect: false }
      ]
    },
    {
      id: 5,
      scenario: "Is a boss the same as a leader?",
      positions: [
        { id: "balanced", text: "BALANCED: Similar but different roles", emoji: "⚖️", points: ["Both manage", "Different styles", "Both needed"], isCorrect: false },
        { id: "different", text: "FOR: A leader serves and empowers", emoji: "🚀", points: ["Serves team", "Empowers others", "True leadership"], isCorrect: true },
        { id: "same", text: "AGAINST: Both manage people", emoji: "📋", points: ["Same role", "Just titles", "No difference"], isCorrect: false }
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
      title="Debate: Boss vs Leader"
      subtitle={!showResult ? `Round ${currentRound + 1} of ${debateTopics.length}` : "Debate Complete!"}
      score={score}
      currentLevel={currentRound + 1}
      totalLevels={debateTopics.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={debateTopics.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/moral-values/teen/journal-leadership"
      nextGameIdProp="moral-teen-77"
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
                  You understand the difference between a boss and a leader!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: A true leader serves and empowers, while a boss just commands!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You scored {score} out of {debateTopics.length}.
                  Remember, leaders inspire and serve, not just command!
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
                  Tip: True leaders serve their team, inspire others, and share credit for success.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateBossVsLeader;

