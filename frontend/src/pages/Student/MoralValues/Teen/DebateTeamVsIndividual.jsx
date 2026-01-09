import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DebateTeamVsIndividual = () => {
  const location = useLocation();
  
  const gameId = "moral-teen-66";
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
      scenario: "Which is better — working alone or in a team?",
      positions: [
        { id: "team", text: "FOR: Working in a team", emoji: "🤝", points: ["Share ideas", "Support each other", "Achieve more"], isCorrect: true },
        { id: "balanced", text: "BALANCED: Both have benefits", emoji: "⚖️", points: ["Team for big tasks", "Alone for focus", "Choose wisely"], isCorrect: false },
        { id: "alone", text: "AGAINST: Working alone", emoji: "🧍‍♂️", points: ["More control", "No conflicts", "Faster decisions"], isCorrect: false }
      ]
    },
    {
      id: 2,
      scenario: "Do teams achieve more than individuals?",
      positions: [
        { id: "balanced", text: "BALANCED: Depends on the task", emoji: "⚖️", points: ["Some tasks need teams", "Some need individuals", "Context matters"], isCorrect: false },
        { id: "more", text: "FOR: Teams achieve more together", emoji: "🏆", points: ["Combine strengths", "Bigger results", "Shared success"], isCorrect: true },
        { id: "less", text: "AGAINST: Individuals work faster", emoji: "⚡", points: ["No delays", "Quick decisions", "More efficient"], isCorrect: false }
      ]
    },
    {
      id: 3,
      scenario: "Does teamwork improve creativity?",
      positions: [
        { id: "conflict", text: "AGAINST: Teams create conflicts", emoji: "😠", points: ["Too many opinions", "Slows down", "Creates tension"], isCorrect: false },
        { id: "balanced", text: "BALANCED: Can help or hinder", emoji: "⚖️", points: ["Depends on team", "Can inspire", "Can conflict"], isCorrect: false },
        { id: "creativity", text: "FOR: Different ideas spark creativity", emoji: "💡", points: ["Diverse perspectives", "New solutions", "Innovation"], isCorrect: true }
      ]
    },
    {
      id: 4,
      scenario: "Is working alone more challenging?",
      positions: [
        { id: "challenging", text: "FOR: Alone is more challenging", emoji: "😓", points: ["No support", "All responsibility", "Harder work"], isCorrect: true },
        { id: "easier", text: "AGAINST: Alone is easier", emoji: "😌", points: ["No conflicts", "Simple decisions", "Less stress"], isCorrect: false },
        { id: "balanced", text: "BALANCED: Both have challenges", emoji: "⚖️", points: ["Different challenges", "Team has conflicts", "Alone has pressure"], isCorrect: false }
      ]
    },
    {
      id: 5,
      scenario: "Does being part of a team teach responsibility?",
      positions: [
        { id: "balanced", text: "BALANCED: Both teach responsibility", emoji: "⚖️", points: ["Team: shared", "Alone: personal", "Both valuable"], isCorrect: false },
        { id: "responsibility", text: "FOR: Team teaches shared responsibility", emoji: "📋", points: ["Accountable to others", "Reliable member", "Team commitment"], isCorrect: true },
        { id: "less", text: "AGAINST: Alone teaches more responsibility", emoji: "🎯", points: ["All on you", "Full accountability", "Personal growth"], isCorrect: false }
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
      title="Debate: Team vs Individual"
      subtitle={!showResult ? `Round ${currentRound + 1} of ${debateTopics.length}` : "Debate Complete!"}
      score={score}
      currentLevel={currentRound + 1}
      totalLevels={debateTopics.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={debateTopics.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/moral-values/teen/journal-cooperation"
      nextGameIdProp="moral-teen-67"
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
                  You understand the power of teamwork!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Teams achieve more together by combining strengths and supporting each other!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You scored {score} out of {debateTopics.length}.
                  Remember, teamwork combines strengths and achieves more together!
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
                  Tip: Teams achieve more by sharing ideas, supporting each other, and working together.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateTeamVsIndividual;

