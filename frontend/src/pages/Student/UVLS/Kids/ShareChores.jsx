import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ShareChores = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-21");
  const gameId = gameData?.id || "uvls-kids-21";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for ShareChores, using fallback ID");
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
      text: "How should chores be shared in a family?",
      emoji: "🏠",
      options: [
        { 
          id: "fair", 
          text: "Everyone helps equally", 
          emoji: "⚖️", 
          // description: "Fair distribution of work",
          isCorrect: true 
        },
        { 
          id: "one", 
          text: "Only one person does everything", 
          emoji: "😤", 
          // description: "Unfair and exhausting",
          isCorrect: false 
        },
        { 
          id: "none", 
          text: "No one does chores", 
          emoji: "😴", 
          // description: "Creates a messy home",
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "What's the best way to assign chores?",
      emoji: "📋",
      options: [
        { 
          id: "gender", 
          text: "Based on gender stereotypes", 
          emoji: "🚫", 
          // description: "Unfair and outdated",
          isCorrect: false 
        },
        { 
          id: "equal", 
          text: "Share tasks fairly among everyone", 
          emoji: "🤝", 
          // description: "Fair and inclusive approach",
          isCorrect: true 
        },
        { 
          id: "age", 
          text: "Only older kids do chores", 
          emoji: "👴", 
          // description: "Unfair to older children",
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "If there are 3 chores and 3 people, how should they be divided?",
      emoji: "🧹",
      options: [
        { 
          id: "one", 
          text: "One person does all 3", 
          emoji: "😓", 
          // description: "Unfair and overwhelming",
          isCorrect: false 
        },
        { 
          id: "skip", 
          text: "Skip the chores", 
          emoji: "🙈", 
          // description: "Not responsible",
          isCorrect: false 
        },
        { 
          id: "each", 
          text: "Each person does 1 chore", 
          emoji: "😀", 
          // description: "Fair and balanced",
          isCorrect: true 
        }
      ]
    },
    {
      id: 4,
      text: "What should you do if someone has more chores than others?",
      emoji: "⚖️",
      options: [
        { 
          id: "redistribute", 
          text: "Redistribute to make it fair", 
          emoji: "🔄", 
          // description: "Ensures fairness for everyone",
          isCorrect: true 
        },
        { 
          id: "ignore", 
          text: "Ignore the unfairness", 
          emoji: "😐", 
          // description: "Doesn't solve the problem",
          isCorrect: false 
        },
        { 
          id: "add", 
          text: "Give them even more chores", 
          emoji: "😤", 
          // description: "Makes it more unfair",
          isCorrect: false 
        }
      ]
    },
    {
      id: 5,
      text: "Why is it important to share chores fairly?",
      emoji: "💡",
      options: [
        { 
          id: "easy", 
          text: "So chores are easier", 
          emoji: "😊", 
          // description: "Chores still need to be done",
          isCorrect: false 
        },
        { 
          id: "unfair", 
          text: "So one person doesn't get overwhelmed", 
          emoji: "😰", 
          // description: "Prevents burnout and stress",
          isCorrect: true 
        },
        { 
          id: "avoid", 
          text: "To avoid doing chores", 
          emoji: "🙈", 
          // description: "Chores still need to be done",
          isCorrect: false 
        }
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
      }
    }, 500);
  };



  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Share Chores"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/uvls/kids/equality-quiz"
      nextGameIdProp="uvls-kids-22"
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
                    onClick={() => handleChoice(option.isCorrect)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="text-3xl mb-3">{option.emoji}</div>
                    <h3 className="font-bold text-lg mb-2">{option.text}</h3>
                    <p className="text-white/90 text-sm">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default ShareChores;

