import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ClassroomStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-11");
  const gameId = gameData?.id || "brain-kids-11";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for ClassroomStory, using fallback ID");
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
      text: "Teacher is teaching. Do you listen carefully or doodle?",
      options: [
       
        { 
          id: "doodle", 
          text: "Doodle in notebook", 
          emoji: "✏️", 
          
          isCorrect: false
        },
        { 
          id: "chat", 
          text: "Chat with friends", 
          emoji: "💬", 
          isCorrect: false
        },
         { 
          id: "listen", 
          text: "Listen carefully", 
          emoji: "👂", 
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      text: "You don't understand something the teacher said. What should you do?",
      options: [
        { 
          id: "ignore", 
          text: "Ignore it", 
          emoji: "😴", 
          isCorrect: false
        },
        { 
          id: "ask", 
          text: "Ask the teacher to explain", 
          emoji: "🙋", 
          isCorrect: true
        },
        { 
          id: "copy", 
          text: "Copy from friend", 
          emoji: "👀", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "During group work, your friend wants to chat about games. What do you do?",
      options: [
        { 
          id: "focus", 
          text: "Stay focused on the task", 
          emoji: "🎯", 
          isCorrect: true
        },
        { 
          id: "chat", 
          text: "Chat about games", 
          emoji: "🎮", 
          isCorrect: false
        },
        { 
          id: "both", 
          text: "Do both at same time", 
          emoji: "🤹", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You finished your classwork early. What's the best choice?",
      options: [
        
        { 
          id: "disturb", 
          text: "Disturb others who are still working", 
          emoji: "😈", 
          isCorrect: false
        },
        { 
          id: "help", 
          text: "Help classmates who need assistance", 
          emoji: "🤝", 
          isCorrect: true
        },
        { 
          id: "play", 
          text: "Play on phone", 
          emoji: "📱", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "The lesson is difficult. How do you handle it?",
      options: [
        
        { 
          id: "giveup", 
          text: "Give up and stop trying", 
          emoji: "😔", 
          isCorrect: false
        },
        { 
          id: "blame", 
          text: "Blame the teacher", 
          emoji: "👎", 
          isCorrect: false
        },
        { 
          id: "persist", 
          text: "Keep trying and ask for help if needed", 
          emoji: "💪", 
          
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
      }
    }, 500);
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Classroom Story"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/brain/kids/quiz-on-focus"
      nextGameIdProp="brain-kids-12"
      gameType="brain"
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

export default ClassroomStory;

