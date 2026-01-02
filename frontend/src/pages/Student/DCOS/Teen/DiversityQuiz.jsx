import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';

const DiversityQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-teen-15");
  const gameId = gameData?.id || "dcos-teen-15";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for DiversityQuiz, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      id: 1,
      text: "Your friend is being mocked online for their accent. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Defend them publicly and report the harassment", 
          emoji: "🛡️", 
          
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Ignore it - it's their problem", 
          emoji: "😐", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Tell them privately to ignore it", 
          emoji: "💬", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Someone is being discriminated against for their religion online. What's the right response?",
      options: [
        { 
          id: "a", 
          text: "Stay out of it", 
          emoji: "😐", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Stand up and report the discrimination", 
          emoji: "🛡️", 
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Just watch", 
          emoji: "👀", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "A classmate is being bullied for their cultural background. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Ignore it", 
          emoji: "😑", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Tell them to change", 
          emoji: "😞", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Defend them and report the bullying", 
          emoji: "🛡️", 
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Someone is being excluded from a group because of their identity. What's the right action?",
      options: [
        { 
          id: "a", 
          text: "Include them and stand against exclusion", 
          emoji: "🛡️", 
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Let it happen", 
          emoji: "😐", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Stay neutral", 
          emoji: "😶", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "A friend is being targeted for their gender identity online. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Don't get involved", 
          emoji: "😐", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Support them publicly and report harassment", 
          emoji: "🛡️", 
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Advise them to hide it", 
          emoji: "😔", 
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
      title="Diversity Quiz"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
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

export default DiversityQuiz;
