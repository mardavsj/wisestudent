import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';

const DataConsentQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-teen-6");
  const gameId = gameData?.id || "dcos-teen-6";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for DataConsentQuiz, using fallback ID");
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
      text: "A new app requests access to: Contacts, Camera, Microphone, Location. Is this safe to allow?",
      options: [
        { 
          id: "b", 
          text: "No - only grant necessary permissions", 
          emoji: "🛡️", 
          
          isCorrect: true
        },
        { 
          id: "a", 
          text: "Yes - all apps need these permissions", 
          emoji: "🙂", 
          
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Yes - if it's a popular app", 
          emoji: "⭐", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "A calculator app requests access to your contacts. Should you allow it?",
      options: [
        { 
          id: "a", 
          text: "Yes - it might need contacts", 
          emoji: "📞", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "No - calculator doesn't need contacts", 
          emoji: "🛡️", 
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Maybe - depends on the app", 
          emoji: "🤔", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "A flashlight app wants access to your location. Should you grant it?",
      options: [
        { 
          id: "a", 
          text: "Yes - all apps need location", 
          emoji: "📍", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Yes - for better functionality", 
          emoji: "⚡", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "No - flashlight doesn't need location", 
          emoji: "🛡️", 
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "A game app requests access to your microphone. Is this necessary?",
      options: [
        { 
          id: "b", 
          text: "Only if it's a voice chat game", 
          emoji: "🛡️", 
          isCorrect: true
        },
        { 
          id: "a", 
          text: "Yes - games need microphone", 
          emoji: "🎤", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Yes - for better gaming", 
          emoji: "🎯", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "A photo editing app requests access to your photos. Should you allow it?",
      options: [
        { 
          id: "a", 
          text: "No - never allow photo access", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Yes - it needs photos to edit them", 
          emoji: "🛡️", 
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Maybe - depends on the app", 
          emoji: "🤔", 
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
      title="Data Consent Quiz"
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

export default DataConsentQuiz;
