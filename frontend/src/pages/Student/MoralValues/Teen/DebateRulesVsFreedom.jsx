import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DebateRulesVsFreedom = () => {
  const location = useLocation();
  
  const gameId = "moral-teen-36";
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
      scenario: "Do rules kill freedom or create order?",
      positions: [
        { id: "order", text: "FOR: Rules create order", emoji: "✅", points: ["Maintain structure", "Ensure safety", "Enable freedom"], isCorrect: true },
        { id: "balanced", text: "BALANCED: Balance rules and freedom", emoji: "⚖️", points: ["Find middle ground", "Both matter", "Be flexible"], isCorrect: false },
        { id: "limit", text: "AGAINST: Rules limit freedom", emoji: "🚫", points: ["Too restrictive", "Less choice", "Feel trapped"], isCorrect: false }
      ]
    },
    {
      id: 2,
      scenario: "Are traffic rules restrictive or protective?",
      positions: [
        { id: "balanced", text: "BALANCED: Both restrictive and protective", emoji: "⚖️", points: ["Limit some actions", "Protect everyone", "Necessary balance"], isCorrect: false },
        { id: "protective", text: "FOR: Protective", emoji: "🛡️", points: ["Keep safe", "Prevent accidents", "Save lives"], isCorrect: true },
        { id: "restrictive", text: "AGAINST: Restrictive", emoji: "🚷", points: ["Slow you down", "Too many limits", "Annoying"], isCorrect: false }
      ]
    },
    {
      id: 3,
      scenario: "School rules: boredom or guidance?",
      positions: [
        { id: "boring", text: "AGAINST: Boring", emoji: "😴", points: ["Too strict", "No fun", "Kill creativity"], isCorrect: false },
        { id: "balanced", text: "BALANCED: Both guidance and limits", emoji: "⚖️", points: ["Help learning", "Some limits", "Find balance"], isCorrect: false },
        { id: "guidance", text: "FOR: Guidance", emoji: "🎯", points: ["Help focus", "Create structure", "Support learning"], isCorrect: true }
      ]
    },
    {
      id: 4,
      scenario: "Workplace rules: unnecessary or structure?",
      positions: [
        { id: "structure", text: "FOR: Structure", emoji: "🏢", points: ["Organize work", "Ensure fairness", "Build efficiency"], isCorrect: true },
        { id: "unnecessary", text: "AGAINST: Unnecessary", emoji: "❌", points: ["Too many rules", "Waste time", "Slow progress"], isCorrect: false },
        { id: "balanced", text: "BALANCED: Some rules help, some don't", emoji: "⚖️", points: ["Evaluate each", "Keep useful ones", "Remove excess"], isCorrect: false }
      ]
    },
    {
      id: 5,
      scenario: "Rules at home: restriction or harmony?",
      positions: [
        { id: "balanced", text: "BALANCED: Both restriction and harmony", emoji: "⚖️", points: ["Some limits", "Create peace", "Balance needed"], isCorrect: false },
        { id: "restriction", text: "AGAINST: Restriction", emoji: "🔒", points: ["Too controlling", "No freedom", "Feel trapped"], isCorrect: false },
        { id: "harmony", text: "FOR: Harmony", emoji: "🏡", points: ["Create peace", "Respect boundaries", "Family unity"], isCorrect: true }
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
      title="Debate: Rules vs Freedom"
      subtitle={!showResult ? `Round ${currentRound + 1} of ${debateTopics.length}` : "Debate Complete!"}
      score={score}
      currentLevel={currentRound + 1}
      totalLevels={debateTopics.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={debateTopics.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/moral-values/teen/journal-discipline"
      nextGameIdProp="moral-teen-37"
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
                  You understand how rules create order and enable freedom!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Rules help create fairness and safety while preserving freedom!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You scored {score} out of {debateTopics.length}.
                  Remember, rules exist to balance freedom with responsibility!
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
                  Tip: Rules create structure that allows everyone to enjoy freedom safely and fairly.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateRulesVsFreedom;

