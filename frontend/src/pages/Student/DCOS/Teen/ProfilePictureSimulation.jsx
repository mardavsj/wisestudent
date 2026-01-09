import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ProfilePictureSimulation = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-teen-4");
  const gameId = gameData?.id || "dcos-teen-4";
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
  {
    id: 1,
    text: "You are joining a public study group where members are unknown. Which profile picture choice reduces personal risk?",
    options: [
      {
        text: "A clear face photo taken at home",
        emoji: "🏠",
        isCorrect: false
      },
      
      {
        text: "A photo wearing school uniform",
        emoji: "🎒",
        isCorrect: false
      },
      {
        text: "A group photo with friends",
        emoji: "👫",
        isCorrect: false
      },
      {
        text: "An illustrated avatar with no personal details",
        emoji: "🖌️",
        isCorrect: true
      },
    ]
  },
  {
    id: 2,
    text: "You want to comment on a public debate page without drawing attention to your real identity. What profile image fits that goal?",
    options: [
      {
        text: "A recent selfie",
        emoji: "📷",
        isCorrect: false
      },
      {
        text: "A symbolic icon that represents an idea",
        emoji: "🔶",
        isCorrect: true
      },
      {
        text: "A photo taken at a known landmark",
        emoji: "🗼",
        isCorrect: false
      },
      {
        text: "A picture showing your face partially",
        emoji: "🧢",
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    text: "A gaming platform allows anyone to message you. Which profile picture choice helps prevent unwanted attention?",
    options: [
      {
        text: "A personal portrait",
        emoji: "🖼️",
        isCorrect: false
      },
      
      {
        text: "A real-life action photo",
        emoji: "🏃",
        isCorrect: false
      },
      {
        text: "A character from the game world",
        emoji: "🧩",
        isCorrect: true
      },
      {
        text: "A photo taken with teammates",
        emoji: "🤝",
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    text: "You are applying to join an online creative forum that values ideas over identity. Which profile image supports that culture?",
    options: [
       {
        text: "A digital illustration you created",
        emoji: "🖍️",
        isCorrect: true
      },
      {
        text: "A close-up facial photo",
        emoji: "👁️",
        isCorrect: false
      },
     
      {
        text: "A family picture",
        emoji: "🏡",
        isCorrect: false
      },
      {
        text: "A photo showing your location",
        emoji: "📍",
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    text: "You notice strangers reposting profile pictures without permission. Which type of image lowers misuse risk?",
    options: [
      {
        text: "A high-resolution personal photo",
        emoji: "📸",
        isCorrect: false
      },
      
      {
        text: "A fashionable portrait",
        emoji: "👗",
        isCorrect: false
      },
      {
        text: "A recognizable background photo",
        emoji: "🏙️",
        isCorrect: false
      },
      {
        text: "A non-human digital avatar",
        emoji: "🌀",
        isCorrect: true
      },
    ]
  }
];


  const handleChoice = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    const isLastQuestion = currentQuestion === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
        setSelectedAnswer(null);
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

  return (
    <GameShell
      title="Profile Picture Simulation"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/dcos/teens/social-media-journal"
      nextGameIdProp="dcos-teen-5"
      gameType="dcos"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult && questions[currentQuestion] ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {questions[currentQuestion].text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions[currentQuestion].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedAnswer(idx);
                      handleChoice(option.isCorrect);
                    }}
                    disabled={answered}
                    className={`p-6 rounded-2xl text-left transition-all transform ${
                      answered
                        ? option.isCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : selectedAnswer === idx
                          ? "bg-red-500/20 border-4 border-red-400 ring-4 ring-red-400"
                          : "bg-white/5 border-2 border-white/20 opacity-50"
                        : "bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-white/40 hover:scale-105"
                    } ${answered ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.emoji}</span>
                      <span className="text-white font-semibold">{option.text}</span>
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
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} questions correct!
                  You understand how to protect your identity online!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Using a cartoon or avatar protects your identity online. Personal photos can be used for facial recognition or tracking!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} questions correct.
                  Remember to use cartoons or avatars instead of personal photos!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Cartoons and avatars keep you anonymous while still expressing your personality!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ProfilePictureSimulation;

