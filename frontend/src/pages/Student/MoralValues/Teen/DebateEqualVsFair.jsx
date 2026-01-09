import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DebateEqualVsFair = () => {
  const location = useLocation();
  
  const gameId = "moral-teen-46";
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
      scenario: "Is treating everyone the same always fair?",
      positions: [
        { id: "need", text: "FOR: Fairness can mean giving based on need", emoji: "🎯", points: ["Consider needs", "True fairness", "Help those who need"], isCorrect: true },
        { id: "balanced", text: "BALANCED: Sometimes equal, sometimes need-based", emoji: "⚖️", points: ["Depends on situation", "Balance both", "Use judgment"], isCorrect: false },
        { id: "equal", text: "AGAINST: Equal means fair", emoji: "⚖️", points: ["Same for everyone", "No exceptions", "Equal treatment"], isCorrect: false }
      ]
    },
    {
      id: 2,
      scenario: "Should all students get the same resources, even if some need more help?",
      positions: [
        { id: "balanced", text: "BALANCED: Base resources on needs", emoji: "⚖️", points: ["Consider needs", "Fair distribution", "Support learning"], isCorrect: false },
        { id: "help", text: "FOR: Extra help for those who need it is fair", emoji: "💡", points: ["Support learning", "Level playing field", "True fairness"], isCorrect: true },
        { id: "same", text: "AGAINST: Same for everyone", emoji: "📚", points: ["Equal resources", "No special treatment", "Fair share"], isCorrect: false }
      ]
    },
    {
      id: 3,
      scenario: "If two players practice differently, should they get equal rewards?",
      positions: [
        { id: "effort", text: "AGAINST: Reward effort and performance fairly", emoji: "🔥", points: ["Reward hard work", "Recognize effort", "Fair recognition"], isCorrect: false },
        { id: "balanced", text: "BALANCED: Consider both effort and results", emoji: "⚖️", points: ["Balance factors", "Consider all", "Fair evaluation"], isCorrect: false },
        { id: "performance", text: "FOR: Reward based on performance fairly", emoji: "🏅", points: ["Recognize achievement", "Fair competition", "Merit-based"], isCorrect: true }
      ]
    },
    {
      id: 4,
      scenario: "In a family, should all siblings get the same allowance regardless of chores?",
      positions: [
        { id: "contribution", text: "FOR: Fair means based on contribution", emoji: "🧹", points: ["Reward work", "Fair compensation", "Encourage responsibility"], isCorrect: true },
        { id: "equal", text: "AGAINST: Equal treatment", emoji: "💰", points: ["Same for all", "No differences", "Equal share"], isCorrect: false },
        { id: "balanced", text: "BALANCED: Base on age and contribution", emoji: "⚖️", points: ["Consider factors", "Fair system", "Balance needs"], isCorrect: false }
      ]
    },
    {
      id: 5,
      scenario: "At school, should teachers give everyone the same grade for trying?",
      positions: [
        { id: "balanced", text: "BALANCED: Consider effort and skill", emoji: "⚖️", points: ["Balance factors", "Fair evaluation", "Recognize both"], isCorrect: false },
        { id: "equality", text: "AGAINST: Equality matters", emoji: "📝", points: ["Same grades", "Equal recognition", "No differences"], isCorrect: false },
        { id: "fairness", text: "FOR: Fairness rewards effort and skill", emoji: "🏆", points: ["Recognize achievement", "Fair assessment", "Merit-based"], isCorrect: true }
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
      title="Debate: Equal vs Fair"
      subtitle={!showResult ? `Round ${currentRound + 1} of ${debateTopics.length}` : "Debate Complete!"}
      score={score}
      currentLevel={currentRound + 1}
      totalLevels={debateTopics.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={debateTopics.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/moral-values/teen/journal-fairness"
      nextGameIdProp="moral-teen-47"
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
                  You understand that fairness sometimes means need-based treatment!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Sometimes fair means need-based — equal isn't always fair!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You scored {score} out of {debateTopics.length}.
                  Remember, fairness considers needs and circumstances!
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
                  Tip: Fairness means giving people what they need, not always the same thing.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateEqualVsFair;

