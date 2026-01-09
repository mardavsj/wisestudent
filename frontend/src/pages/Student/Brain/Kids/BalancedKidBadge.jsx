import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { Monitor, BookOpenCheck, Clock, Gamepad, PenTool } from 'lucide-react';

const BalancedKidBadge = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-80");
  const gameId = gameData?.id || "brain-kids-80";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for BalancedKidBadge, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [challenge, setChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const challenges = [
    {
      id: 1,
      title: "Tablet Story Challenge",
      description: "Choose the balanced approach in digital dilemmas!",
      icon: <Monitor className="w-8 h-8" />,
      color: "bg-blue-500",
      question: "It's tablet time! Which choice shows digital balance?",
      options: [
        { 
          text: "Play tablet for 1 hour, then go outside", 
          emoji: "⚖️", 
          isCorrect: true
        },
        { 
          text: "Play tablet all day without breaks", 
          emoji: "📱", 
          isCorrect: false
        },
        { 
          text: "Never use tablet at all", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          text: "Play tablet until bedtime", 
          emoji: "🌙", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Screen Quiz Master",
      description: "Test your knowledge of healthy screen habits!",
      icon: <BookOpenCheck className="w-8 h-8" />,
      color: "bg-purple-500",
      question: "Answer this question: What's the best screen time limit for kids?",
      options: [
        { 
          text: "10 hours per day", 
          emoji: "⏰", 
          isCorrect: false
        },
        { 
          text: "1-2 hours per day", 
          emoji: "✅", 
          isCorrect: true
        },
        { 
          text: "No limit needed", 
          emoji: "♾️", 
          isCorrect: false
        },
        { 
          text: "All day is fine", 
          emoji: "📱", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Digital Reflex",
      description: "Quickly identify balanced digital activities!",
      icon: <Clock className="w-8 h-8" />,
      color: "bg-green-500",
      question: "Is this a balanced digital activity: 'Playing games for 1 hour then going outside'?",
      options: [
        { 
          text: "No, games are always bad", 
          emoji: "❌", 
          isCorrect: false
        },
        { 
          text: "No, you should only play games", 
          emoji: "🎮", 
          isCorrect: false
        },
        { 
          text: "Yes, it balances screen time with outdoor play", 
          emoji: "✅", 
          isCorrect: true
        },
        { 
          text: "No, balance doesn't matter", 
          emoji: "🤷", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Balance Puzzle",
      description: "Match screen time with its effects!",
      icon: <Gamepad className="w-8 h-8" />,
      color: "bg-yellow-500",
      question: "What effect does balanced screen use have?",
      options: [
        { 
          text: "Makes you tired all the time", 
          emoji: "😴", 
          isCorrect: false
        },
        { 
          text: "Helps you stay healthy and active", 
          emoji: "💪", 
          isCorrect: true
        },
        { 
          text: "Doesn't help at all", 
          emoji: "🤷", 
          isCorrect: false
        },
        { 
          text: "Makes you lazy", 
          emoji: "😑", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Homework Priority",
      description: "Learn to prioritize tasks effectively!",
      icon: <PenTool className="w-8 h-8" />,
      color: "bg-red-500",
      question: "You have homework and a game. What's the balanced approach?",
      options: [
        { 
          text: "Play game all day, skip homework", 
          emoji: "🎮", 
          isCorrect: false
        },
        { 
          text: "Do homework first, then play game for limited time", 
          emoji: "⚖️", 
          isCorrect: true
        },
        { 
          text: "Only do homework, never play", 
          emoji: "📚", 
          isCorrect: false
        },
        { 
          text: "Do homework while playing game", 
          emoji: "🤹", 
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
    
    const isLastChallenge = challenge === challenges.length - 1;
    
    setTimeout(() => {
      if (isLastChallenge) {
        setShowResult(true);
      } else {
        setChallenge(prev => prev + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      }
    }, 500);
  };

  const currentChallenge = challenges[challenge];

  return (
    <GameShell
      title="Badge: Balanced Kid"
      score={score}
      subtitle={!showResult ? `Challenge ${challenge + 1} of ${challenges.length}` : "Badge Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/brain/kids/lost-key-story"
      nextGameIdProp="brain-kids-81"
      gameType="brain"
      totalLevels={challenges.length}
      currentLevel={challenge + 1}
      maxScore={challenges.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult && currentChallenge ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Challenge {challenge + 1}/{challenges.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{challenges.length}</span>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className={`${currentChallenge.color} p-3 rounded-lg mr-3`}>
                    {currentChallenge.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{currentChallenge.title}</h3>
                    <p className="text-white/70 text-sm">{currentChallenge.description}</p>
                  </div>
                </div>
              </div>
              
              <p className="text-white text-lg mb-6 text-center">
                {currentChallenge.question}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentChallenge.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedAnswer(index);
                      handleChoice(option.isCorrect);
                    }}
                    disabled={answered}
                    className={`p-6 rounded-2xl text-left transition-all transform ${
                      answered
                        ? option.isCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : selectedAnswer === index
                          ? "bg-red-500/20 border-4 border-red-400 ring-4 ring-red-400"
                          : "bg-white/5 border-2 border-white/20 opacity-50"
                        : "bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-white/40 hover:scale-105"
                    } ${answered ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.emoji}</span>
                      <span className="text-white font-semibold">{option.text}</span>
                    </div>
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

export default BalancedKidBadge;

