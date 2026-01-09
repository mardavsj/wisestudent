import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ToneMatch = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-64");
  const gameId = gameData?.id || "uvls-kids-64";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for ToneMatch, using fallback ID");
  }
  
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
      text: "Which intent matches with a 'Happy' tone?",
      emoji: "😊",
      correct: "Excited news",
      options: [
        { 
          id: "excited_news", 
          text: "Excited news", 
          isCorrect: true 
        },
        { 
          id: "mad_at_mistake", 
          text: "Mad at mistake", 
          isCorrect: false 
        },
        { 
          id: "calm_story", 
          text: "Calm story", 
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "Which intent matches with an 'Angry' tone?",
      emoji: "😠",
      correct: "Mad at mistake",
      options: [
        { 
          id: "excited_news", 
          text: "Excited news", 
          isCorrect: false 
        },
        { 
          id: "mad_at_mistake", 
          text: "Mad at mistake", 
          isCorrect: true 
        },
        { 
          id: "calm_story", 
          text: "Calm story", 
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "Which intent matches with a 'Soft' tone?",
      emoji: "😌",
      correct: "Calm story",
      options: [
        { 
          id: "excited_news", 
          text: "Excited news", 
          isCorrect: false 
        },
        { 
          id: "mad_at_mistake", 
          text: "Mad at mistake", 
          isCorrect: false 
        },
        { 
          id: "calm_story", 
          text: "Calm story", 
          isCorrect: true 
        }
      ]
    },
    {
      id: 4,
      text: "Which intent matches with a 'Sad' tone?",
      emoji: "😢",
      correct: "Bad day",
      options: [
        
        { 
          id: "yelling_game", 
          text: "Yelling game", 
          isCorrect: false 
        },
        { 
          id: "whisper_secret", 
          text: "Whisper secret", 
          isCorrect: false 
        },
        { 
          id: "bad_day", 
          text: "Bad day", 
          isCorrect: true 
        },
      ]
    },
    {
      id: 5,
      text: "Which intent matches with a 'Loud' tone?",
      emoji: "🔊",
      correct: "Yelling game",
      options: [
        { 
          id: "bad_day", 
          text: "Bad day", 
          isCorrect: false 
        },
        { 
          id: "yelling_game", 
          text: "Yelling game", 
          isCorrect: true 
        },
        { 
          id: "whisper_secret", 
          text: "Whisper secret", 
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

  // Removed handleNext function as it's not needed for this game structure

  return (
    <GameShell
      title="Tone Match"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Game Complete!"}
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/uvls/kids/ask-clearly-story"
      nextGameIdProp="uvls-kids-65"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="uvls"
      // Removed onNext and nextEnabled props as they're not needed for this game structure
    >
      <div className="space-y-8">
        {!showResult && questions[currentQuestion] ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-xl p-6 mb-6 text-center">
                <div className="text-6xl mb-3">{questions[currentQuestion].emoji}</div>
                <h3 className="text-white text-xl font-bold">{questions[currentQuestion].text}</h3>
              </div>
              
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
                      <span className="font-semibold text-lg">{option.text}</span>
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
                <h3 className="text-2xl font-bold text-white mb-4">Tone Expert!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct!
                  You understand how tones connect to intents!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding how tones connect to intents helps us communicate better! The way we speak affects how our message is received.
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct.
                  Keep practicing to understand how tones connect to intents!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Pay attention to how different tones match different intents. A happy tone often matches sharing good news, while an angry tone might match expressing frustration!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ToneMatch;