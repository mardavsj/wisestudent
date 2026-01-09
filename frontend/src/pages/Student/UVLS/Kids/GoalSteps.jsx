import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const GoalSteps = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "uvls-kids-95";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
  {
    id: 1,
    goal: "Finish a puzzle with 50 pieces.",
    monthly: [
      { id: "b", text: "Do all at once", emoji: "😵", isCorrect: false },
      { id: "c", text: "Never try", emoji: "🚫", isCorrect: false },
      { id: "a", text: "Solve 10 pieces/day", emoji: "☺️", isCorrect: true },
    ]
  },
  {
    id: 2,
    goal: "Collect 12 stickers.",
    monthly: [
      { id: "b", text: "Get 12 in one day", emoji: "😰", isCorrect: false },
      { id: "a", text: "1 sticker/week", emoji: "⭐", isCorrect: true },
      { id: "c", text: "Give away all stickers", emoji: "💨", isCorrect: false }
    ]
  },
  {
    id: 3,
    goal: "Learn a new song on the piano.",
    monthly: [
      { id: "a", text: "Practice daily for 10 minutes", emoji: "👍", isCorrect: true },
      { id: "b", text: "Play once at night", emoji: "🌙", isCorrect: false },
      { id: "c", text: "Never play piano", emoji: "🚫", isCorrect: false }
    ]
  },
  {
    id: 4,
    goal: "Clean your room.",
    monthly: [
      { id: "b", text: "Leave mess for a week", emoji: "🛏️", isCorrect: false },
      { id: "c", text: "Do all in one hour at night", emoji: "⏰", isCorrect: false },
      { id: "a", text: "Tidy a little each day", emoji: "🙂", isCorrect: true },
    ]
  },
  {
    id: 5,
    goal: "Practice drawing animals.",
    monthly: [
      { id: "b", text: "Draw all 30 in one day", emoji: "😵", isCorrect: false },
      { id: "a", text: "Draw one animal/day", emoji: "🤔", isCorrect: true },
      { id: "c", text: "Never practice", emoji: "🚫", isCorrect: false }
    ]
  }
];


  const [answered, setAnswered] = useState(false);

  const handleAnswer = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();

    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    const isLastQuestion = currentLevel === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setFinalScore(coins + (isCorrect ? 1 : 0));
        setShowResult(true);
      } else {
        setCurrentLevel(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setCoins(0);
    setFinalScore(0);
    setAnswered(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Goal Steps"
      score={coins}
      subtitle={!showResult ? `Question ${currentLevel + 1} of ${questions.length}` : "Quiz Complete!"}
      onNext={handleNext}
      nextGamePathProp="/student/uvls/kids/smart-poster"
      nextGameIdProp="uvls-kids-96"
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      maxScore={questions.length}
      currentLevel={currentLevel + 1}
      totalLevels={questions.length}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId="uvls-kids-95"
      gameType="uvls"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentLevel + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {coins}/{questions.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                Break {getCurrentLevel().goal}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getCurrentLevel().monthly.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.isCorrect)}
                    disabled={answered}
                    className={`p-6 rounded-2xl text-center transition-all transform ${
                      answered
                        ? option.isCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : "bg-red-500/20 border-2 border-red-400 opacity-75"
                        : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                    } ${answered ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <span className="text-4xl">{option.emoji}</span>
                      <span className="font-semibold text-lg">{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Goal Breaker!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} correct!
                  You know how to break goals into steps!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{finalScore} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Breaking big goals into small steps makes them easier to achieve!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Break Better!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} correct.
                  Remember: Break goals into small, manageable steps!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Instead of doing everything at once, break goals into small steps you can do regularly!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default GoalSteps;