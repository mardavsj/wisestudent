import React, { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityKidsGames } from "../../../../pages/Games/GameCategories/Sustainability/kidGamesData";

const NeighborStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    try {
      const games = getSustainabilityKidsGames({});
      const currentGame = games.find(g => g.id === "sustainability-kids-90");
      if (currentGame && currentGame.index !== undefined) {
        const nextGame = games.find(g => g.index === currentGame.index + 1 && g.isSpecial && g.path);
        return {
          nextGamePath: nextGame ? nextGame.path : null,
          nextGameId: nextGame ? nextGame.id : null
        };
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
    }
    
    return { nextGamePath: null, nextGameId: null };
  }, [location.state]);

  // Get game data from game category folder (source 
  // of truth)
  const gameData = getGameDataById("sustainability-kids-90");
  const gameId = gameData?.id || "sustainability-kids-90";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for Neighbor Story, using fallback ID");
  }
  
  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Your neighbor is confused about which items can be recycled in your local program. What's the most helpful approach?",
      options: [
        { 
          id: "no", 
          text: "Tell them to just throw everything in the trash to avoid mistakes", 
          emoji: "❌", 
          isCorrect: false 
        },
        { 
          id: "later", 
          text: "Give them the city's recycling guidelines website to read on their own", 
          emoji: "📖", 
          isCorrect: false 
        },
        { 
          id: "help", 
          text: "Show them the different recycling categories and explain the local rules", 
          emoji: "🤝", 
          isCorrect: true 
        }
      ]
    },
    {
      id: 2,
      text: "The community garden project needs someone to research which vegetables grow best in your area's climate. What should you do?",
      options: [
        { 
          id: "no", 
          text: "Plant random vegetables and hope they grow", 
          emoji: "🤷", 
          isCorrect: false 
        },
        { 
          id: "join", 
          text: "Research the local growing season and suggest appropriate plants", 
          emoji: "🌱", 
          isCorrect: true 
        },
        { 
          id: "watch", 
          text: "Let others figure out what grows best through trial and error", 
          emoji: "👀", 
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "Your neighbor's compost pile smells bad and attracts pests. What's the most effective way to help?",
      options: [
        { 
          id: "share", 
          text: "Explain the carbon-nitrogen balance needed for healthy composting", 
          emoji: "📚", 
          isCorrect: true 
        },
        { 
          id: "no", 
          text: "Suggest they give up on composting because it's too complicated", 
          emoji: "🤐", 
          isCorrect: false 
        },
        { 
          id: "not", 
          text: "Tell them to just move the compost bin further away from the house", 
          emoji: "🚶", 
          isCorrect: false 
        }
      ]
    },
    {
      id: 4,
      text: "You notice your neighbor watering their garden during the hottest part of the day, causing rapid evaporation. How should you approach this?",
      options: [
        { 
          id: "ignore", 
          text: "Stay out of it since it's their water usage", 
          emoji: "🙈", 
          isCorrect: false 
        },
        { 
          id: "angry", 
          text: "Confront them angrily about wasting water", 
          emoji: "😠", 
          isCorrect: false 
        },
        { 
          id: "talk", 
          text: "Share information about best watering times to reduce evaporation", 
          emoji: "💬", 
          isCorrect: true 
        }
      ]
    },
    {
      id: 5,
      text: "Your neighbor suggests a carpooling schedule that would reduce emissions and save money. What's the most environmentally beneficial option?",
      options: [
        { 
          id: "no", 
          text: "Decline because you prefer your own schedule flexibility", 
          emoji: "🙅", 
          isCorrect: false 
        },
        { 
          id: "maybe", 
          text: "Agree to try it just once to see if it works", 
          emoji: "🤔", 
          isCorrect: false 
        },
        { 
          id: "participate", 
          text: "Commit to a regular schedule to maximize environmental benefits", 
          emoji: "🚗", 
          isCorrect: true 
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const newChoices = [...choices, { 
      questionId: questions[currentQuestion].id, 
      choice: optionId,
      isCorrect: questions[currentQuestion].options.find(opt => opt.id === optionId)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = questions[currentQuestion].options.find(opt => opt.id === optionId)?.isCorrect;
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, isCorrect ? 1000 : 800);
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setTimeout(() => {
        setShowResult(true);
      }, isCorrect ? 1000 : 800);
    }
  };

  const getCurrentQuestion = () => questions[currentQuestion];
  
  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setChoices([]);
    setCoins(0);
    setFinalScore(0);
    resetFeedback();
  };

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Neighbor Story game completed! Score: ${finalScore}/${questions.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
      // Update location state with nextGameId for GameOverModal
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [showResult, finalScore, gameId, nextGamePath, nextGameId, questions.length]);

  return (
    <GameShell
      title="Neighbor Story"
      score={coins}
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="sustainability"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
      backPath="/games/sustainability/kids"
    
      nextGamePathProp="/student/sustainability/kids/poster-community-action"
      nextGameIdProp="sustainability-kids-91">
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center max-w-4xl mx-auto px-4 py-4">
        {!showResult ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <span className="text-white/80 text-sm md:text-base">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold text-sm md:text-base">Coins: {coins}</span>
              </div>
              
              <h2 className="text-white text-base md:text-lg lg:text-xl mb-4 md:mb-6 text-center">
                {getCurrentQuestion().text}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                {getCurrentQuestion().options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl md:text-3xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-base md:text-xl mb-2">{option.text}</h3>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/20 text-center flex-1 flex flex-col justify-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-4xl md:text-5xl mb-4">🏘️</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Good Neighbor!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You know how to be a helpful neighbor!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80 text-sm md:text-base">
                  Great job! You know how to help your neighbors and live sustainably!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">🏘️</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, helping neighbors and living sustainably makes our community better!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-bold transition-all mb-4 text-sm md:text-base"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-xs md:text-sm">
                  Try to choose the option that helps your neighbors and environment.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default NeighborStory;