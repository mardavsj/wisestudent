import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const GreetTheNewKid = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-11");
  const gameId = gameData?.id || "uvls-kids-11";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for GreetTheNewKid, using fallback ID");
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
      text: "A new student walks into your classroom looking nervous. What do you do?",
      options: [
        { 
          id: "friendly", 
          text: "Hi! I'm [name]. Want to sit with me?", 
          emoji: "😊", 
          // description: "Welcome them warmly",
          isCorrect: true 
        },
        { 
          id: "ignore", 
          text: "Don't say anything and look away", 
          emoji: "😐", 
          // description: "Ignore the new student",
          isCorrect: false 
        },
        { 
          id: "stare", 
          text: "Stare at them without saying anything", 
          emoji: "👀", 
          // description: "Make them uncomfortable",
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "You see a new kid sitting alone at lunch. What do you say?",
      options: [
        { 
          id: "ignore", 
          text: "Pretend you don't see them", 
          emoji: "🙈", 
          // description: "Avoid them",
          isCorrect: false 
        },
        { 
          id: "invite", 
          text: "Want to join us for lunch?", 
          emoji: "🤗", 
          // description: "Invite them to join",
          isCorrect: true 
        },
        { 
          id: "laugh", 
          text: "Laugh with friends about them", 
          emoji: "😏", 
          // description: "Be unkind",
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "A new student doesn't know where the bathroom is. What do you do?",
      options: [
        { 
          id: "help", 
          text: "I can show you where it is!", 
          emoji: "👉", 
          // description: "Offer to help them",
          isCorrect: true 
        },
        { 
          id: "point", 
          text: "Point vaguely without explaining", 
          emoji: "🫱", 
          // description: "Give unclear directions",
          isCorrect: false 
        },
        { 
          id: "walk", 
          text: "Walk away without helping", 
          emoji: "🚶", 
          // description: "Ignore their need",
          isCorrect: false 
        }
      ]
    },
    {
      id: 4,
      text: "Your teacher asks you to show the new student around. How do you respond?",
      options: [
        { 
          id: "sigh", 
          text: "Sigh and do it reluctantly", 
          emoji: "😮‍💨", 
          // description: "Show unwillingness",
          isCorrect: false 
        },
        { 
          id: "refuse", 
          text: "Say you're too busy", 
          emoji: "🙅", 
          // description: "Refuse to help",
          isCorrect: false 
        },
        { 
          id: "happy", 
          text: "Sure! I'd love to help!", 
          emoji: "😄", 
          // description: "Accept enthusiastically",
          isCorrect: true 
        }
      ]
    },
    {
      id: 5,
      text: "The new student is from another country. What's the best greeting?",
      options: [
        
        { 
          id: "weird", 
          text: "You talk funny", 
          emoji: "😒", 
          // description: "Be rude about differences",
          isCorrect: false 
        },
        { 
          id: "welcome", 
          text: "Welcome! We're glad you're here!", 
          emoji: "🎉", 
          // description: "Make them feel welcome",
          isCorrect: true 
        },
        { 
          id: "avoid", 
          text: "Avoid them because they're different", 
          emoji: "❌", 
          // description: "Exclude them",
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

  return (
    <GameShell
      title="Greet the New Kid"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Game Complete!"}
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/uvls/kids/polite-words-quiz"
      nextGameIdProp="uvls-kids-12"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="uvls"
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
                <h3 className="text-2xl font-bold text-white mb-4">Welcoming Star!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct!
                  You know how to welcome new students!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: New students often feel nervous and alone. Greeting them warmly, inviting them to join activities, and offering help makes them feel welcome and included. Everyone deserves a friendly welcome!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct.
                  Remember: New students need a friendly welcome!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: When you see a new student, introduce yourself, invite them to join you, and offer to help them find things. A friendly greeting can make their day!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default GreetTheNewKid;

