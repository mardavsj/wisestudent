import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BystanderRoleplay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "uvls-kids-38";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
  {
    id: 1,
    text: "You see a child drop their lunch and others laugh. What should you do?",
    options: [
    
      {
        id: "b",
        text: "Laugh with the group",
        emoji: "😂",
        isCorrect: false
      },
      {
        id: "c",
        text: "Walk away quickly",
        emoji: "🚶",
        isCorrect: false
      },
        {
        id: "a",
        text: "Help pick it up and check on them",
        emoji: "🤝",
        isCorrect: true
      },
    ]
  },
  {
    id: 2,
    text: "You notice a younger student looks lost in school. What should you do?",
    options: [
      {
        id: "a",
        text: "Guide them to a teacher",
        emoji: "🧭",
        isCorrect: true
      },
      {
        id: "b",
        text: "Ignore them",
        emoji: "🙈",
        isCorrect: false
      },
      {
        id: "c",
        text: "Tell them to find help alone",
        emoji: "❌",
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    text: "You hear a rumor spreading about a classmate. What should you do?",
    options: [
      
      {
        id: "b",
        text: "Repeat it quietly",
        emoji: "🗣️",
        isCorrect: false
      },
      {
        id: "a",
        text: "Stop the rumor and suggest telling the truth",
        emoji: "🛑",
        isCorrect: true
      },
      {
        id: "c",
        text: "Add more details",
        emoji: "➕",
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    text: "You see someone being left out during group work. What should you do?",
    options: [
      
      {
        id: "b",
        text: "Finish your work alone",
        emoji: "📄",
        isCorrect: false
      },
      {
        id: "c",
        text: "Tell them it is not your problem",
        emoji: "🙅",
        isCorrect: false
      },
      {
        id: "a",
        text: "Ask them to join your group",
        emoji: "👥",
        isCorrect: true
      },
    ]
  },
  {
    id: 5,
    text: "You notice a classmate looks scared after being yelled at. What should you do?",
    options: [
      {
        id: "a",
        text: "Stay with them and get adult help",
        emoji: "🆘",
        isCorrect: true
      },
      {
        id: "b",
        text: "Pretend nothing happens",
        emoji: "😐",
        isCorrect: false
      },
      {
        id: "c",
        text: "Tell them to be brave",
        emoji: "💪",
        isCorrect: false
      }
    ]
  }
];


  const handleAnswer = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    const isLastQuestion = currentQuestion === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  return (
    <GameShell
      title="Bystander Roleplay"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Game Complete!"}
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/uvls/kids/cyber-spot"
      nextGameIdProp="uvls-kids-39"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="uvls"
      onNext={handleNext}
      nextEnabled={showResult && score >= 3}
    >
      <div className="space-y-8">
        {!showResult && questions[currentQuestion] ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {questions[currentQuestion].text}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {questions[currentQuestion].options.map((option) => (
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
                      <span className="text-sm opacity-90">{option.description}</span>
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
                <h3 className="text-2xl font-bold text-white mb-4">Upstander Hero!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct!
                  You know how to be an upstander, not a bystander!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: When you see bullying or unfair treatment, don't be a bystander - be an upstander! Stand up for others by speaking up, including them, telling an adult, supporting the victim, and getting help. Never use violence or ignore the situation - always help in safe and effective ways!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct.
                  Remember: Stand up for others when you see bullying!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: When you see bullying, be an upstander! Speak up, include the person being bullied, tell an adult, support the victim, and get help. Never use violence or ignore it!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BystanderRoleplay;

