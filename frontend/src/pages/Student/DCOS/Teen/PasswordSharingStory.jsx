import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosTeenGames } from "../../../../pages/Games/GameCategories/DCOS/teenGamesData";

const PasswordSharingStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-teen-1";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  // Find next game path and ID if not provided in location.state
  const { nextGamePath, nextGameId } = useMemo(() => {
    // First, try to get from location.state (passed from GameCategoryPage)
    if (location.state?.nextGamePath) {
      console.log('✅ Next game from location.state:', { nextGamePath: location.state.nextGamePath, nextGameId: location.state.nextGameId });
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    // Fallback: find next game from game data
    try {
      const games = getDcosTeenGames({});
      const currentGame = games.find(g => g.id === gameId);
      console.log('🔍 Current game:', { gameId, currentGame: currentGame ? { id: currentGame.id, index: currentGame.index, title: currentGame.title } : null });
      
      if (currentGame && currentGame.index !== undefined) {
        const nextGame = games.find(g => g.index === currentGame.index + 1 && g.isSpecial && g.path);
        console.log('🔍 Next game found:', nextGame ? { id: nextGame.id, index: nextGame.index, title: nextGame.title, path: nextGame.path } : null);
        return {
          nextGamePath: nextGame ? nextGame.path : null,
          nextGameId: nextGame ? nextGame.id : null
        };
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
    }
    
    console.warn('⚠️ No next game found for gameId:', gameId);
    return { nextGamePath: null, nextGameId: null };
  }, [location.state, gameId]);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Your best friend asks: 'Can I borrow your password to check something on your account? I promise I'll just look quickly and won't change anything.'",
      options: [
        { 
          id: "never", 
          text: "Never share passwords with anyone", 
          emoji: "🛡️", 
          
          isCorrect: true
        },
        { 
          id: "share", 
          text: "Share it - they're my best friend", 
          emoji: "🤝", 
          isCorrect: false
        },
        { 
          id: "share-later", 
          text: "Share it but change it later", 
          emoji: "🔄", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your sibling says: 'I need to use your account for a game. Just tell me your password, I won't mess with anything.'",
      options: [
        { 
          id: "share-family", 
          text: "Share it - they're family", 
          emoji: "👨‍👩‍👧", 
          isCorrect: false
        },
        { 
          id: "never-family", 
          text: "Never share passwords, even with family", 
          emoji: "🛡️", 
          isCorrect: true
        },
        { 
          id: "temporary", 
          text: "Share it temporarily", 
          emoji: "⏰", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "A classmate asks: 'Can I use your account to submit my assignment? I'll just log in once.'",
      options: [
        { 
          id: "help", 
          text: "Share it to help them", 
          emoji: "🤝", 
          isCorrect: false
        },
        { 
          id: "monitor", 
          text: "Share it but monitor the account", 
          emoji: "👀", 
          isCorrect: false
        },
        { 
          id: "never-classmate", 
          text: "Never share passwords with anyone", 
          emoji: "🛡️", 
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Someone you've chatted with online asks: 'Can I access your account to help you with something?'",
      options: [
        { 
          id: "never-online", 
          text: "Never share passwords with anyone", 
          emoji: "🛡️", 
          isCorrect: true
        },
        { 
          id: "trust", 
          text: "Share it - they seem trustworthy", 
          emoji: "😊", 
          isCorrect: false
        },
        { 
          id: "change-after", 
          text: "Share it but change it immediately after", 
          emoji: "🔄", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Someone claiming to be tech support calls: 'We need your password to fix your account. Can you share it?'",
      options: [
        { 
          id: "tech-support", 
          text: "Share it - they're tech support", 
          emoji: "🔧", 
          isCorrect: false
        },
        { 
          id: "scam", 
          text: "Never share passwords - this is a scam", 
          emoji: "🛡️", 
          isCorrect: true
        },
        { 
          id: "verify-first", 
          text: "Share it but verify first", 
          emoji: "🤔", 
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (selectedChoice) => {
    const newChoices = [...choices, { 
      questionId: questions[currentQuestion].id, 
      choice: selectedChoice,
      isCorrect: questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add score and show flash/confetti
    const isCorrect = questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect;
    
    if (isCorrect) {
      // Use functional state update to avoid stale closure issues
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    // Move to next question or show results
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        // Calculate final score from choices array to ensure accuracy
        const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
        console.log('🎮 Game completed!', { gameId, finalScore: correctAnswers, nextGamePath, nextGameId });
        setShowResult(true);
      }
    }, isCorrect ? 1000 : 800);
  };

  // Calculate finalScore from choices array to ensure accuracy
  const finalScore = choices.filter(choice => choice.isCorrect).length;
  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Password Sharing Story"
      score={finalScore}
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult && finalScore === questions.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {getCurrentQuestion().text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getCurrentQuestion().options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-xl mb-2">{option.text}</h3>
                    <p className="text-white/90">{option.description}</p>
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

export default PasswordSharingStory;
