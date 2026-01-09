import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TestStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-95");
  const gameId = gameData?.id || "brain-kids-95";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for TestStory, using fallback ID");
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
      text: "Kid fails spelling test. Best response?",
      options: [
        
        { 
          id: "give", 
          text: "Give up on spelling", 
          emoji: "🏳️", 
          
          isCorrect: false
        },
        { 
          id: "study", 
          text: "Study and try again", 
          emoji: "📚", 
          isCorrect: true
        },
        { 
          id: "blame", 
          text: "Blame the test", 
          emoji: "👆", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Kid gets low score on math. What should they do?",
      options: [
       
        { 
          id: "quit", 
          text: "Quit math class", 
          emoji: "🚶", 
          isCorrect: false
        },
        { 
          id: "cry", 
          text: "Cry and give up", 
          emoji: "😢", 
          isCorrect: false
        },
         { 
          id: "practice", 
          text: "Practice more and retake", 
          emoji: "✏️", 
          isCorrect: true
        },
      ]
    },
    {
      id: 3,
      text: "Kid fails science quiz. Best approach?",
      options: [
        
        { 
          id: "ignore", 
          text: "Ignore the result", 
          emoji: "😑", 
          isCorrect: false
        },
        { 
          id: "review", 
          text: "Review mistakes and study", 
          emoji: "🔬", 
          isCorrect: true
        },
        { 
          id: "angry", 
          text: "Get angry at teacher", 
          emoji: "😠", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Kid doesn't pass reading test. What's right?",
      options: [
        
        { 
          id: "stop", 
          text: "Stop reading", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          id: "blame4", 
          text: "Blame the book", 
          emoji: "📚", 
          isCorrect: false
        },
        { 
          id: "read", 
          text: "Read more and practice", 
          emoji: "📖", 
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "Kid fails history exam. Best action?",
      options: [
        { 
          id: "learn", 
          text: "Study harder and retake", 
          emoji: "📜", 
          isCorrect: true
        },
        { 
          id: "avoid", 
          text: "Avoid history class", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          id: "complain", 
          text: "Complain about it", 
          emoji: "😤", 
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
      title="Test Story"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/brain/kids/poster-dont-give-up"
      nextGameIdProp="brain-kids-96"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="brain"
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

export default TestStory;

