import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from '../../../../utils/getGameData';

const FeelingsQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-2");
  const gameId = gameData?.id || "uvls-kids-2";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for FeelingsQuiz, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Sarah sees her friend crying on the playground. What is the caring action?",
      options: [
        { 
          id: "a", 
          text: "Ask what's wrong and listen", 
          emoji: "🤗", 
          // description: "Show empathy and care",
          isCorrect: true 
        },
        { 
          id: "b", 
          text: "Laugh at them", 
          emoji: "😂", 
          // description: "Make fun of them",
          isCorrect: false 
        },
        { 
          id: "c", 
          text: "Walk away", 
          emoji: "🚶", 
          // description: "Ignore the situation",
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "Tom's classmate dropped their books in the hallway. What should Tom do?",
      options: [
        { 
          id: "a", 
          text: "Step over them", 
          emoji: "👣", 
          // description: "Walk around the books",
          isCorrect: false 
        },
        { 
          id: "b", 
          text: "Help pick them up", 
          emoji: "🤝", 
          // description: "Offer assistance",
          isCorrect: true 
        },
        { 
          id: "c", 
          text: "Ignore and walk past", 
          emoji: "🙈", 
          // description: "Pretend not to see",
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "Maya's friend is sitting alone at lunch looking sad. What is the kind thing to do?",
      options: [
        { 
          id: "a", 
          text: "Invite them to sit together", 
          emoji: "🍱", 
          // description: "Include them in your group",
          isCorrect: true 
        },
        { 
          id: "b", 
          text: "Sit far away", 
          emoji: "🏃", 
          // description: "Avoid them",
          isCorrect: false 
        },
        { 
          id: "c", 
          text: "Pretend not to see", 
          emoji: "🙄", 
          // description: "Ignore their sadness",
          isCorrect: false 
        }
      ]
    },
    {
      id: 4,
      text: "A new student looks confused about where to go. What's the helpful action?",
      options: [
        { 
          id: "a", 
          text: "Watch them struggle", 
          emoji: "👀", 
          // description: "Just observe",
          isCorrect: false 
        },
        { 
          id: "b", 
          text: "Laugh at their confusion", 
          emoji: "😏", 
          // description: "Make fun of them",
          isCorrect: false 
        },
        { 
          id: "c", 
          text: "Offer to show them the way", 
          emoji: "🗺️", 
          // description: "Help them find their way",
          isCorrect: true 
        }
      ]
    },
    {
      id: 5,
      text: "Your friend forgot their lunch money. What's the caring response?",
      options: [
        { 
          id: "a", 
          text: "Share your lunch with them", 
          emoji: "🥪", 
          // description: "Help them out",
          isCorrect: true 
        },
        { 
          id: "b", 
          text: "Eat alone", 
          emoji: "🍔", 
          // description: "Keep your food to yourself",
          isCorrect: false 
        },
        { 
          id: "c", 
          text: "Ignore their problem", 
          emoji: "🤷", 
          // description: "Not your concern",
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

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Feelings Quiz"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/uvls/kids/kind-reflex"
      nextGameIdProp="uvls-kids-3"
      gameType="uvls"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options.map((option) => (
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
                <h3 className="text-2xl font-bold text-white mb-4">Feelings Quiz Star!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct!
                  You understand empathy and caring!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Showing empathy means understanding and caring about others' feelings. Always be kind and helpful!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct.
                  Remember: Empathy means understanding how others feel!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: When someone is sad or needs help, show you care by listening and offering to help!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FeelingsQuiz;


