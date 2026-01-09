import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DebateKindnessOrStrength = () => {
  const location = useLocation();
  
  const gameId = "moral-teen-26";
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
      scenario: "Is kindness a sign of strength or weakness?",
      positions: [
        { id: "strength", text: "FOR: It takes courage to stay kind", emoji: "💪", points: ["Shows inner strength", "Requires self-control", "Builds respect"], isCorrect: true },
        { id: "balanced", text: "BALANCED: It depends on the situation", emoji: "⚖️", points: ["Context matters", "Balance is key", "Choose wisely"], isCorrect: false },
        { id: "weakness", text: "AGAINST: People take advantage", emoji: "😕", points: ["Makes you vulnerable", "Others exploit", "Shows weakness"], isCorrect: false }
      ]
    },
    {
      id: 2,
      scenario: "Does being kind make you vulnerable?",
      positions: [
        { id: "balanced", text: "BALANCED: Sometimes, but worth it", emoji: "⚖️", points: ["Risks exist", "Benefits too", "Be wise"], isCorrect: false },
        { id: "inspire", text: "FOR: Kindness inspires and uplifts", emoji: "🌈", points: ["Creates positivity", "Builds connections", "Makes impact"], isCorrect: true },
        { id: "hurt", text: "AGAINST: People might hurt you", emoji: "🥺", points: ["Too risky", "Get hurt", "Protect yourself"], isCorrect: false }
      ]
    },
    {
      id: 3,
      scenario: "Can kindness change others' behavior?",
      positions: [
        { id: "nochange", text: "AGAINST: People don't change easily", emoji: "🙄", points: ["Waste of effort", "No impact", "People stay same"], isCorrect: false },
        { id: "balanced", text: "BALANCED: Sometimes it helps", emoji: "⚖️", points: ["Can work", "Not always", "Try anyway"], isCorrect: false },
        { id: "heal", text: "FOR: Kindness can heal and motivate", emoji: "💖", points: ["Creates change", "Heals wounds", "Inspires growth"], isCorrect: true }
      ]
    },
    {
      id: 4,
      scenario: "Is standing up for others a form of kindness?",
      positions: [
        { id: "courage", text: "FOR: Kindness includes courage", emoji: "🦁", points: ["Protect others", "Show care", "Stand strong"], isCorrect: true },
        { id: "conflict", text: "AGAINST: It causes conflict", emoji: "😬", points: ["Creates problems", "Avoid trouble", "Stay out"], isCorrect: false },
        { id: "balanced", text: "BALANCED: Depends on how you do it", emoji: "⚖️", points: ["Method matters", "Be careful", "Choose approach"], isCorrect: false }
      ]
    },
    {
      id: 5,
      scenario: "Can a strong leader also be kind?",
      positions: [
        { id: "balanced", text: "BALANCED: Balance both qualities", emoji: "⚖️", points: ["Mix of both", "Find balance", "Be flexible"], isCorrect: false },
        { id: "soft", text: "AGAINST: Kindness makes you soft", emoji: "🧊", points: ["Weakens authority", "Lose respect", "Too gentle"], isCorrect: false },
        { id: "true", text: "FOR: True strength includes kindness", emoji: "👑", points: ["Real leadership", "Respect and care", "Best leaders"], isCorrect: true }
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
      title="Debate: Kindness or Strength"
      subtitle={!showResult ? `Round ${currentRound + 1} of ${debateTopics.length}` : "Debate Complete!"}
      score={score}
      currentLevel={currentRound + 1}
      totalLevels={debateTopics.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={debateTopics.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/moral-values/teen/journal-empathy1"
      nextGameIdProp="moral-teen-27"
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
                  You understand that kindness is true strength!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Kindness isn't weakness — it's real strength that takes courage and confidence!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You scored {score} out of {debateTopics.length}.
                  Remember, true strength includes kindness and compassion!
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
                  Tip: Kindness requires inner strength and shows true leadership qualities.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateKindnessOrStrength;

