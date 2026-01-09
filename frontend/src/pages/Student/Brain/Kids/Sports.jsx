import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const Sports = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-38");
  const gameId = gameData?.id || "brain-kids-38";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for Sports, using fallback ID");
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
      text: "Kid loses in game, feels angry. What should they do?",
      options: [
        
        { 
          id: "quit", 
          text: "Quit the team", 
          emoji: "🏳️", 
          
          isCorrect: false
        },
        { 
          id: "blame", 
          text: "Blame others", 
          emoji: "👆", 
          isCorrect: false
        },
        { 
          id: "calm", 
          text: "Try again calmly", 
          emoji: "😊", 
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      text: "Missed goal, upset. What's the best response?",
      options: [
        
        { 
          id: "throw", 
          text: "Throw the ball", 
          emoji: "😠", 
          isCorrect: false
        },
        { 
          id: "practice", 
          text: "Practice more and try again", 
          emoji: "⚽", 
          isCorrect: true
        },
        { 
          id: "cry", 
          text: "Cry and give up", 
          emoji: "😢", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Team loses the match. What should they do?",
      options: [
        { 
          id: "learn", 
          text: "Learn from it calmly", 
          emoji: "📚", 
          isCorrect: true
        },
        { 
          id: "argue", 
          text: "Argue with each other", 
          emoji: "😠", 
          isCorrect: false
        },
        { 
          id: "quit2", 
          text: "Give up completely", 
          emoji: "🚶", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Injured during play, angry. How should they handle it?",
      options: [
        
        { 
          id: "ignore", 
          text: "Ignore the pain and continue", 
          emoji: "🤕", 
          isCorrect: false
        },
        { 
          id: "yell", 
          text: "Yell at the coach", 
          emoji: "😡", 
          isCorrect: false
        },
        { 
          id: "rest", 
          text: "Rest and stay calm", 
          emoji: "🏥", 
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "Bad referee call, mad. What's the right action?",
      options: [
        
        { 
          id: "protest", 
          text: "Protest loudly", 
          emoji: "🗣️", 
          isCorrect: false
        },
        { 
          id: "accept", 
          text: "Accept and focus calmly", 
          emoji: "👍", 
          isCorrect: true
        },
        { 
          id: "leave", 
          text: "Leave the game", 
          emoji: "🏃", 
          isCorrect: false
        }
      ]
    }
  ];

  const currentQuestionData = questions[currentQuestion];

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


  return (
    <GameShell
      title="Sports Story"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/brain/kids/reflex-quick-calm"
      nextGameIdProp="brain-kids-39"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="brain"
      backPath="/games/brain-health/kids"
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

export default Sports;