import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getAiTeenGames } from "../../../../pages/Games/GameCategories/AiForAll/teenGamesData";

const TrainWithSounds = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-teen-54";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  // Find next game path and ID if not provided in location.state
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    try {
      const games = getAiTeenGames({});
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
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      id: 1,
      text: "An AI assistant is designed to recognize emergency vehicle sirens. Which scenario would be most challenging for the AI to accurately identify?",
      audio: "🚨",
      emoji: "🔊",
      options: [
        { 
          id: 1, 
          text: "Siren in a quiet residential area", 
          emoji: "🏘️", 
          isCorrect: false
        },
        { 
          id: 2, 
          text: "Siren in heavy traffic with multiple sound sources", 
          emoji: "🚗", 
          isCorrect: true
        },
        { 
          id: 3, 
          text: "Siren at night with minimal background noise", 
          emoji: "🌙",
          isCorrect: false
        }
      ],
      explanation: "Siren in heavy traffic! This is a complex audio recognition challenge for AI. In busy traffic, the AI must use advanced sound separation techniques to distinguish the emergency siren from other vehicle sounds, horns, and engine noise. This is an example of 'audio source separation' in AI signal processing."
    },
    {
      id: 2,
      text: "A smart home AI needs to distinguish between different household sounds. Which sound combination would be most difficult to process correctly?",
      audio: "🏠",
      emoji: "🏠",
      options: [
        { 
          id: 1, 
          text: "Crying baby and running dishwasher", 
          emoji: "👶", 
          isCorrect: true
        },
        { 
          id: 2, 
          text: "Running vacuum cleaner alone", 
          emoji: "🧹", 
          isCorrect: false
        },
        { 
          id: 3, 
          text: "Television playing at low volume", 
          emoji: "📺", 
          isCorrect: false
        }
      ],
      explanation: "Crying baby and dishwasher! This is challenging for AI because both sounds occupy similar frequency ranges. The AI must use advanced pattern recognition to separate and identify the baby's cry, which might be critical for safety purposes, from the background noise of the dishwasher. This requires sophisticated 'sound event detection' algorithms."
    },
    {
      id: 3,
      text: "Which application demonstrates the most advanced use of AI in sound processing?",
      audio: "🤖",
      emoji: "🧠",
      options: [
        { 
          id: 1, 
          text: "Voice assistants recognizing 'Hey Siri' or 'OK Google'", 
          emoji: "📱",
          isCorrect: false
        },
        
        { 
          id: 3, 
          text: "Music recognition apps identifying song titles", 
          emoji: "🎵",
          isCorrect: false
        },
        { 
          id: 2, 
          text: "AI detecting subtle changes in a person's voice to predict health issues", 
          emoji: "🏥",
          isCorrect: true
        },
      ],
      explanation: "AI detecting health issues through voice changes! This represents cutting-edge AI research where subtle changes in voice patterns, tone, and speech rhythm can indicate health conditions like depression, Parkinson's disease, or respiratory issues. The AI must analyze complex acoustic features that even humans might not consciously notice."
    },
    {
      id: 4,
      text: "In a noisy restaurant, an AI-powered hearing aid needs to focus on the user's conversation. What technology enables this?",
      audio: "🍽️",
      emoji: "👂",
      options: [
        { 
          id: 1, 
          text: "Noise cancellation", 
          emoji: "🔇", 
          isCorrect: false
        },
        { 
          id: 2, 
          text: "Beamforming and audio source separation", 
          emoji: "🎯", 
          isCorrect: true
        },
        { 
          id: 3, 
          text: "Volume amplification", 
          emoji: "🔊",
          isCorrect: false
        }
      ],
      explanation: "Beamforming and audio source separation! This advanced AI technology can spatially isolate the desired sound source (the person you're talking to) from background noise. The AI uses multiple microphones and complex algorithms to 'focus' on the specific direction of the conversation while suppressing other sounds."
    },
    {
      id: 5,
      text: "What is the most challenging aspect of training AI to recognize and interpret human emotions through voice?",
      audio: "🎭",
      emoji: "💬",
      options: [
         { 
          id: 2, 
          text: "Accounting for individual vocal characteristics and cultural differences", 
          emoji: "👤", 
          isCorrect: true
        },
        { 
          id: 1, 
          text: "Distinguishing between different languages", 
          emoji: "🌐", 
          isCorrect: false
        },
       
        { 
          id: 3, 
          text: "Processing audio quickly enough", 
          emoji: "⚡",
          isCorrect: false
        }
      ],
      explanation: "Accounting for individual and cultural differences! Emotions are expressed differently across individuals and cultures. AI must be trained on diverse datasets to understand that the same emotion might be expressed with different vocal patterns, intensity levels, and cultural expressions. This requires complex machine learning models and extensive, diverse training data."
    }
  ];

  const handleAnswer = (optionId) => {
    if (answered || levelCompleted) return;
    
    setAnswered(true);
    setSelectedOption(optionId);
    resetFeedback();
    
    const currentQuestionData = questions[currentQuestion];
    const selectedOptionData = currentQuestionData.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOptionData?.isCorrect || false;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setAnswered(false);
        resetFeedback();
      } else {
        setLevelCompleted(true);
      }
    }, isCorrect ? 1000 : 800);
  };

  const currentQuestionData = questions[currentQuestion];
  const finalScore = score;

  return (
    <GameShell
      title="Train with Sounds"
      subtitle={levelCompleted ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      score={finalScore}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="ai"
      showGameOver={levelCompleted}
      maxScore={questions.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
      showConfetti={levelCompleted && finalScore >= 3}
    >
      <div className="space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
        {!levelCompleted && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {finalScore}/{questions.length}</span>
              </div>
              
              <div className="text-6xl mb-4 text-center">{currentQuestionData.emoji}</div>
              
              <p className="text-white text-lg md:text-xl mb-6 text-center">
                {currentQuestionData.text}
              </p>
              
              <div className="bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-xl p-8 mb-6 flex flex-col items-center justify-center">
                <p className="text-white text-2xl font-bold mb-2">Sound: {currentQuestionData.audio}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options.map(option => {
                  const isSelected = selectedOption === option.id;
                  const showCorrect = answered && option.isCorrect;
                  const showIncorrect = answered && isSelected && !option.isCorrect;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(option.id)}
                      disabled={answered}
                      className={`p-6 rounded-2xl shadow-lg transition-all transform text-center ${
                        showCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : showIncorrect
                          ? "bg-red-500/20 border-2 border-red-400 opacity-75"
                          : isSelected
                          ? "bg-blue-600 border-2 border-blue-300 scale-105"
                          : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                      } ${answered ? "cursor-not-allowed" : ""}`}
                    >
                      <div className="text-2xl mb-2">{option.emoji}</div>
                      <h4 className="font-bold text-base mb-2">{option.text}</h4>
                      <p className="text-white/90 text-sm">{option.description}</p>
                    </button>
                  );
                })}
              </div>
              
              {answered && (
                <div className={`rounded-lg p-4 mt-6 ${
                  currentQuestionData.options.find(opt => opt.id === selectedOption)?.isCorrect
                    ? "bg-green-500/20"
                    : "bg-red-500/20"
                }`}>
                  <p className="text-white text-center">
                    {currentQuestionData.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default TrainWithSounds;