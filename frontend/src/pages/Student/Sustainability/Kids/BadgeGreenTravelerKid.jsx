import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Car, Bike, Bus, Footprints, Train } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityKidsGames } from "../../../../pages/Games/GameCategories/Sustainability/kidGamesData";

const BadgeGreenTravelerKid = () => {
  const location = useLocation();
  const gameId = "sustainability-kids-55";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { showCorrectAnswerFeedback, flashPoints, showAnswerConfetti, resetFeedback } = useGameFeedback();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);

  // Find next game path and ID if not provided in location.state
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    try {
      const games = getSustainabilityKidsGames({});
      const currentGame = games.find(g => g.id === gameId);
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
  }, [location.state, gameId]);

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Badge: Green Traveler Kid game completed! Score: ${score}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [showResult, score, gameId, nextGamePath, nextGameId]);

  const levels = [
    {
      id: 1,
      title: "Biking",
      question: "What's the best way to travel for short distances?",
      icon: Bike,
      item: "Green Transport",
      options: [
          { id: "b", text: "Take a car", emoji: "🚗", correct: false, coins: 0 },
          { id: "c", text: "Fly there", emoji: "✈️", correct: false, coins: 0 },
          { id: "d", text: "Stay home", emoji: "🏠", correct: false, coins: 0 },
          { id: "a", text: "Bike or walk", emoji: "🚴", correct: true, coins: 1 },
      ],
      feedback: {
        correct: "Excellent! Biking and walking are the best for short distances!",
        wrong: "For short distances, biking or walking is best for the environment!"
      }
    },
    {
      id: 2,
      title: "Public Transport",
      question: "How can you travel with many people at once?",
      icon: Bus,
      item: "Public Transport",
      options: [
          { id: "b", text: "Drive alone", emoji: "🚗", correct: false, coins: 0 },
          { id: "c", text: "Each take a car", emoji: "🚗", correct: false, coins: 0 },
          { id: "a", text: "Take the bus", emoji: "🚌", correct: true, coins: 1 },
        { id: "d", text: "Ignore transport", emoji: "🤷", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Perfect! Taking the bus helps reduce pollution!",
        wrong: "Public transport like buses help reduce emissions by sharing rides!"
      }
    },
    {
      id: 3,
      title: "Walking",
      question: "What's the cleanest way to travel?",
      icon: Footprints,
      item: "Walking",
      options: [
          { id: "b", text: "Drive a car", emoji: "🚗", correct: false, coins: 0 },
          { id: "a", text: "Walk", emoji: "🚶", correct: true, coins: 1 },
        { id: "c", text: "Use a motorcycle", emoji: "🏍️", correct: false, coins: 0 },
        { id: "d", text: "Take a plane", emoji: "✈️", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Great! Walking produces zero emissions!",
        wrong: "Walking is the cleanest way to travel - no emissions at all!"
      }
    },
    {
      id: 4,
      title: "Carpooling",
      question: "How can you reduce pollution when you need a car?",
      icon: Car,
      item: "Carpooling",
      options: [
        { id: "a", text: "Carpool with friends", emoji: "👥", correct: true, coins: 1 },
        { id: "b", text: "Each drive separately", emoji: "🚗", correct: false, coins: 0 },
        { id: "c", text: "Use many cars", emoji: "🚗", correct: false, coins: 0 },
        { id: "d", text: "Drive alone", emoji: "🚗", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Amazing! Carpooling reduces the number of cars on the road!",
        wrong: "Carpooling means fewer cars and less pollution!"
      }
    },
    {
      id: 5,
      title: "Green Travel",
      question: "What makes you a Green Traveler Kid?",
      icon: Train,
      item: "Green Travel",
      options: [
          { id: "b", text: "Drive everywhere", emoji: "🚗", correct: false, coins: 0 },
          { id: "c", text: "Fly everywhere", emoji: "✈️", correct: false, coins: 0 },
          { id: "a", text: "Use green transport like walking, biking, and buses", emoji: "🌍", correct: true, coins: 1 },
        { id: "d", text: "Ignore transport choices", emoji: "🤷", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Wonderful! You're a true Green Traveler Kid!",
        wrong: "Green Travelers choose eco-friendly transport like walking, biking, and public transport!"
      }
    }
  ];

  const currentLevelData = levels[currentLevel - 1];
  const Icon = currentLevelData.icon;

  const handleAnswer = (optionIndex) => {
    if (answered) return;
    
    setAnswered(true);
    setSelectedOptionIndex(optionIndex);
    resetFeedback();
    
    const selectedOption = currentLevelData.options[optionIndex];
    const isCorrect = selectedOption.correct;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    const isLastQuestion = currentLevel === 5;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
        if (score + (isCorrect ? 1 : 0) >= 4) {
          showAnswerConfetti();
        }
      } else {
        setCurrentLevel(prev => prev + 1);
        setAnswered(false);
        setSelectedOptionIndex(null);
      }
    }, 2000);
  };

  const finalScore = score;
  const coins = finalScore;

  return (
    <GameShell
      title="Badge: Green Traveler Kid"
      subtitle={!showResult ? `Question ${currentLevel} of 5: Test your green transport knowledge!` : "Badge Earned!"}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      coins={coins}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      gameType="sustainability"
      maxScore={5}
      showConfetti={showResult && finalScore >= 4}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    
      nextGamePathProp="/student/sustainability/kids/animal-story"
      nextGameIdProp="sustainability-kids-56">
      <div className="text-center text-white space-y-6">
        {!showResult && currentLevelData && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <div className="flex justify-center mb-4">
              <Icon className="w-16 h-16 text-green-400" />
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80">Question {currentLevel} of 5</span>
              <span className="text-yellow-400 font-bold">Score: {score}/5</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">{currentLevelData.title}</h3>
            <p className="text-white text-lg mb-6 text-center">
              {currentLevelData.question}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentLevelData.options.map((option, idx) => {
                const isSelected = selectedOptionIndex === idx;
                const showFeedback = answered;

                let buttonClass = "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[60px] flex items-center justify-center gap-3";

                if (showFeedback) {
                  if (isSelected) {
                    buttonClass = option.correct
                      ? "bg-green-500 ring-4 ring-green-300 text-white p-6 rounded-2xl shadow-lg min-h-[60px] flex items-center justify-center gap-3"
                      : "bg-red-500 ring-4 ring-red-300 text-white p-6 rounded-2xl shadow-lg min-h-[60px] flex items-center justify-center gap-3";
                  } else {
                    buttonClass = "bg-white/10 opacity-50 text-white p-6 rounded-2xl shadow-lg min-h-[60px] flex items-center justify-center gap-3";
                  }
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(idx)}
                    disabled={showFeedback}
                    className={buttonClass}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <span className="font-bold text-lg">{option.text}</span>
                  </button>
                );
              })}
            </div>
            {answered && selectedOptionIndex !== null && (
              <div className={`mt-4 p-4 rounded-xl ${
                currentLevelData.options[selectedOptionIndex].correct
                  ? 'bg-green-500/20 border border-green-500/30'
                  : 'bg-red-500/20 border border-red-500/30'
              }`}>
                <p className="text-white font-semibold">
                  {currentLevelData.options[selectedOptionIndex].correct
                    ? currentLevelData.feedback.correct
                    : currentLevelData.feedback.wrong}
                </p>
              </div>
            )}
          </div>
        )}
        {showResult && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {finalScore >= 4 ? (
              <div>
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-3xl font-bold text-white mb-4">Green Traveler Kid Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent knowledge about green transport with {finalScore} correct answers out of 5!
                </p>
                
                <div className="bg-gradient-to-br from-green-500 to-teal-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Green Traveler Kid</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Transport Expert</h4>
                    <p className="text-white/90 text-sm">
                      You understand the importance of eco-friendly transportation.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Eco Traveler</h4>
                    <p className="text-white/90 text-sm">
                      You know how to travel in a way that protects our planet.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    // Let GameShell handle navigation via GameOverModal
                    if (window.history && window.history.replaceState) {
                      const currentState = window.history.state || {};
                      window.history.replaceState({
                        ...currentState,
                        nextGamePath: nextGamePath,
                        nextGameId: nextGameId
                      }, '');
                    }
                  }}
                  className="bg-gradient-to-br from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Green Transport!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {finalScore} questions correctly out of 5.
                </p>
                <p className="text-white/90 mb-6">
                  Review green transport topics to strengthen your knowledge and earn your badge.
                </p>
                <button
                  onClick={() => {
                    setCurrentLevel(1);
                    setScore(0);
                    setAnswered(false);
                    setSelectedOptionIndex(null);
                    setShowResult(false);
                    resetFeedback();
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeGreenTravelerKid;