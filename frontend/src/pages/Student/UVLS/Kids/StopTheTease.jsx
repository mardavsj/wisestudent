import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const StopTheTease = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-31");
  const gameId = gameData?.id || "uvls-kids-31";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for StopTheTease, using fallback ID");
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
      text: "A kid is being teased about their clothes. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Tell the teaser to stop kindly", 
          emoji: "🛑", 
          // description: "Stand up for them politely",
          isCorrect: true 
        },
        { 
          id: "b", 
          text: "Fight the teaser", 
          emoji: "👊", 
          // description: "Use violence",
          isCorrect: false 
        },
        { 
          id: "c", 
          text: "Ignore it", 
          emoji: "🙈", 
          // description: "Do nothing",
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "Someone is mocked for their height. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Yell at the teaser", 
          emoji: "😠", 
          // description: "Respond with anger",
          isCorrect: false 
        },
        { 
          id: "b", 
          text: "Distract by changing topic", 
          emoji: "🔄", 
          // description: "Redirect the conversation",
          isCorrect: true 
        },
        { 
          id: "c", 
          text: "Laugh along", 
          emoji: "😂", 
          // description: "Join the teasing",
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "A friend is teased about glasses. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Support friend and report", 
          emoji: "🤝", 
          // description: "Help and tell an adult",
          isCorrect: true 
        },
        { 
          id: "b", 
          text: "Tease back", 
          emoji: "😏", 
          // description: "Fight fire with fire",
          isCorrect: false 
        },
        { 
          id: "c", 
          text: "Walk away alone", 
          emoji: "🚶", 
          // description: "Leave your friend",
          isCorrect: false 
        }
      ]
    },
    {
      id: 4,
      text: "Teasing about a mistake in class. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Push the teaser", 
          emoji: "🤜", 
          // description: "Use physical force",
          isCorrect: false 
        },
        { 
          id: "b", 
          text: "Pretend not to see", 
          emoji: "🙄", 
          // description: "Ignore the situation",
          isCorrect: false 
        },
        { 
          id: "c", 
          text: "Encourage positively", 
          emoji: "👍", 
          // description: "Support the person",
          isCorrect: true 
        }
      ]
    },
    {
      id: 5,
      text: "Name-calling during play. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Call names back", 
          emoji: "🗣️", 
          // description: "Retaliate with names",
          isCorrect: false 
        },
        { 
          id: "b", 
          text: "Do nothing", 
          emoji: "🫥", 
          // description: "Stay silent",
          isCorrect: false 
        },
        { 
          id: "c", 
          text: "Include everyone fairly", 
          emoji: "👥", 
          // description: "Make sure all are included",
          isCorrect: true 
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
      title="Stop the Tease"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Game Complete!"}
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/uvls/kids/bullying-quiz"
      nextGameIdProp="uvls-kids-32"
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
                <h3 className="text-2xl font-bold text-white mb-4">Teasing Stopper!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct!
                  You know how to stop teasing and help others!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: When someone is being teased, you can help by standing up for them politely, supporting them, reporting to adults, and including everyone. Never join in teasing or use violence - kindness and support are the best ways to stop teasing!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct.
                  Remember: Stand up for others when they're being teased!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: When you see teasing, stand up for the person being teased, support them, and tell a trusted adult. Never join in or use violence!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default StopTheTease;

