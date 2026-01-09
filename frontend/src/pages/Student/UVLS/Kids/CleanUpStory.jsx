import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CleanUpStory = () => {
  const navigate = useNavigate();
  const gameId = "uvls-kids-81";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      id: 1,
      scene: "Park litter.",
      tasks: [
        { id: "a", text: "Pick trash", emoji: "🗑️", isCorrect: true },
        { id: "b", text: "Leave it", emoji: "🙈", isCorrect: false },
        { id: "c", text: "Add more", emoji: "🚮", isCorrect: false }
      ]
    },
    {
      id: 2,
      scene: "Yard mess.",
      tasks: [
        { id: "b", text: "Ignore", emoji: "🤷", isCorrect: false },
        { id: "a", text: "Rake leaves", emoji: "🍂", isCorrect: true },
        { id: "c", text: "Scatter more", emoji: "🌬️", isCorrect: false }
      ]
    },
    {
      id: 3,
      scene: "Beach clean.",
      tasks: [
        { id: "b", text: "Bury it", emoji: "🕳️", isCorrect: false },
        { id: "c", text: "Throw in sea", emoji: "🌊", isCorrect: false },
        { id: "a", text: "Collect plastic", emoji: "🏖️", isCorrect: true }
      ]
    },
    {
      id: 4,
      scene: "Room tidy.",
      tasks: [
        { id: "a", text: "Put toys away", emoji: "🧸", isCorrect: true },
        { id: "b", text: "Mess more", emoji: "😈", isCorrect: false },
        { id: "c", text: "Hide under bed", emoji: "🛏️", isCorrect: false }
      ]
    },
    {
      id: 5,
      scene: "Street clean.",
      tasks: [
        { id: "b", text: "Litter paper", emoji: "📄", isCorrect: false },
        { id: "c", text: "Walk past", emoji: "🚶", isCorrect: false },
        { id: "a", text: "Sweep sidewalk", emoji: "🧹", isCorrect: true }
      ]
    }
  ];

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

  return (
    <GameShell
      title="Clean-up Story"
      score={coins}
      subtitle={!showResult ? `Question ${currentLevel + 1} of ${questions.length}` : "Quiz Complete!"}
      onNext={handleNext}
      nextGamePathProp="/student/uvls/kids/citizen-duties-quiz"
      nextGameIdProp="uvls-kids-82"
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
      gameId="uvls-kids-81"
      gameType="uvls"
    >
      <div className="space-y-8">
        {!showResult && questions[currentLevel] ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentLevel + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {coins}/{questions.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {questions[currentLevel].scene}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {questions[currentLevel].tasks.map((option) => (
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
                <h3 className="text-2xl font-bold text-white mb-4">Clean Hero!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} correct!
                  You know how to help keep things clean!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{finalScore} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Helping to clean up our environment makes the world a better place for everyone!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Clean More!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} correct.
                  Remember: Always choose actions that help keep things clean!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Choose actions that help clean up and take care of our environment!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CleanUpStory;

