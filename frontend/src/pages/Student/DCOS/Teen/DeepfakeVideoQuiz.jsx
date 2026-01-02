import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';

const DeepfakeVideoQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-teen-32");
  const gameId = gameData?.id || "dcos-teen-32";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for DeepfakeVideoQuiz, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  // Extract nextGamePath and nextGameId from location state
  const { nextGamePath, nextGameId } = useMemo(() => {
    return {
      nextGamePath: location.state?.nextGamePath || null,
      nextGameId: location.state?.nextGameId || null
    };
  }, [location.state]);
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      id: 1,
      text: "You see a video of your favorite celebrity saying something shocking. The video has slight lighting inconsistencies around their face. What should you do?",
      options: [
         { 
          id: "b", 
          text: "Check for signs of deepfake and verify with official sources", 
          emoji: "🔍",
          
          isCorrect: true
        },
        { 
          id: "a", 
          text: "Share it immediately - it's breaking news!", 
          emoji: "📱",
          
          isCorrect: false
        },
       
        { 
          id: "c", 
          text: "Ignore it - celebrities often do strange things",
          emoji: "🤷",
          
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You receive a video of a friend asking for money urgently. The audio and video seem slightly out of sync. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Send the money immediately - they need help!", 
          emoji: "💸",
          
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Call your friend directly to verify if they sent this video", 
          emoji: "📞",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Ignore it - probably spam",
          emoji: "🚫",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You see a video of a natural disaster in your area that wasn't reported by local news. The video shows unusual shadows and lighting. What's the best approach?",
      options: [
        { 
          id: "a", 
          text: "Share it to warn others about the disaster",
          emoji: "⚠️",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Assume it's fake since it wasn't on the news",
          emoji: "🤔",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Check multiple reliable news sources to confirm the event",
          emoji: "📰",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "You find a video of a scientific breakthrough that seems too good to be true. The video has minor artifacts around the edges and the audio doesn't match the speaker's lip movements. What should you do?",
      options: [
         { 
          id: "b", 
          text: "Look for peer-reviewed research papers on the topic",
          emoji: "📚",
          isCorrect: true
        },
        { 
          id: "a", 
          text: "Share it with your science class - it's revolutionary!",
          emoji: "📢",
          isCorrect: false
        },
       
        { 
          id: "c", 
          text: "Assume it's real since it's about science",
          emoji: "🔬",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You see a video of your school principal making an announcement that seems odd. The video has inconsistent lighting on the face and unusual eye reflections. What's the best action?",
      options: [
        { 
          id: "a", 
          text: "Forward it to all your friends",
          emoji: "📤",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Assume it's fake because it seems odd",
          emoji: "❓",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Check your school's official website or contact them directly",
          emoji: "🔍",
          isCorrect: true
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


  return (
    <GameShell
      title="Deepfake Video Quiz"
      score={score}
      maxScore={questions.length}
      subtitle={showResult ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult && score === questions.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center max-w-4xl mx-auto px-4 py-4">
        {!showResult ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <span className="text-white/80 text-sm md:text-base">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold text-sm md:text-base">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-base md:text-lg lg:text-xl mb-6 md:mb-8 text-center">
                {questions[currentQuestion].text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.isCorrect)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg transition-all transform hover:scale-105 flex flex-col items-center justify-center text-center h-full"
                    disabled={answered}
                  >
                    <span className="text-2xl md:text-3xl mb-2">{option.emoji}</span>
                    <h3 className="font-bold text-base md:text-lg mb-1">{option.text}</h3>
                    <p className="text-white/90 text-xs md:text-sm">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/20 text-center flex-1 flex flex-col justify-center">
            <div>
              <div className="text-4xl md:text-5xl mb-4">🎉</div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Quiz Completed!</h3>
              <p className="text-white/90 text-base md:text-lg mb-2">
                You scored <span className="font-bold text-yellow-400">{score}</span> out of <span className="font-bold">{questions.length}</span>
              </p>
              <div className="mt-6">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-full inline-block font-bold">
                  <span>+{score * 10} Points</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DeepfakeVideoQuiz;
