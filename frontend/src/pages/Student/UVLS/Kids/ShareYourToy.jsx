import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from '../../../../utils/getGameData';

const ShareYourToy = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-1");
  const gameId = gameData?.id || "uvls-kids-1";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for ShareYourToy, using fallback ID");
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
      text: "You see a new classmate sitting alone at lunch. What do you do?",
      options: [
        { 
          id: "share", 
          text: "Share Toys", 
          emoji: "🤝", 
          // description: "Invite them to play with your toys",
          isCorrect: true
        },
        { 
          id: "maybe", 
          text: "Maybe Later", 
          emoji: "🤔", 
          // description: "Think about it later",
          isCorrect: false
        },
        { 
          id: "ignore", 
          text: "Play Alone", 
          emoji: "🙅", 
          // description: "Keep playing by yourself",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friend forgot their crayons. You have extras. What do you do?",
      options: [
        { 
          id: "keep", 
          text: "Keep All", 
          emoji: "❌", 
          // description: "Keep all crayons for yourself",
          isCorrect: false
        },
        { 
          id: "share", 
          text: "Share Crayons", 
          emoji: "🎨", 
          // description: "Give them some of your crayons",
          isCorrect: true
        },
        { 
          id: "wait", 
          text: "Wait and See", 
          emoji: "👀", 
          // description: "See if they ask first",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Someone wants to join your game during recess. What do you do?",
      options: [
        { 
          id: "include", 
          text: "Let Them Join", 
          emoji: "👫", 
          // description: "Welcome them to play",
          isCorrect: true
        },
        { 
          id: "exclude", 
          text: "Say No", 
          emoji: "🚫", 
          // description: "Tell them to go away",
          isCorrect: false
        },
        { 
          id: "ask", 
          text: "Ask Others First", 
          emoji: "🤷", 
          // description: "Check with your friends first",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Your sibling wants to play with your favorite toy. What do you do?",
      options: [
        { 
          id: "hoard", 
          text: "Keep It", 
          emoji: "😠", 
          // description: "Refuse to share",
          isCorrect: false
        },
        { 
          id: "maybe", 
          text: "Maybe Later", 
          emoji: "⏰", 
          // description: "Tell them to wait",
          isCorrect: false
        },
        { 
          id: "share", 
          text: "Take Turns", 
          emoji: "🔄", 
          // description: "Share and take turns playing",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "A friend asks to borrow your pencil. What do you do?",
      options: [
        { 
          id: "lend", 
          text: "Lend Pencil", 
          emoji: "🤲", 
          // description: "Let them borrow it",
          isCorrect: true
        },
        { 
          id: "refuse", 
          text: "Say No", 
          emoji: "🙅‍♂️", 
          // description: "Don't let them use it",
          isCorrect: false
        },
        { 
          id: "hesitate", 
          text: "Hesitate", 
          emoji: "😕", 
          // description: "Not sure what to do",
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
      title="Share Your Toy"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Game Complete!"}
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/uvls/kids/feelings-quiz"
      nextGameIdProp="uvls-kids-2"
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
                <h3 className="text-2xl font-bold text-white mb-4">Sharing Star!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct!
                  You know how to share and include others!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Sharing toys, crayons, and games makes everyone happy! When you share and include others, you make new friends and help everyone feel welcome!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct.
                  Remember: Sharing makes everyone happy!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: When someone needs something or wants to play, sharing and including them is the kind thing to do!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ShareYourToy;

