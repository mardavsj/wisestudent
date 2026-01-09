import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const InviteRoleplay = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-18");
  const gameId = gameData?.id || "uvls-kids-18";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for InviteRoleplay, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      id: 1,
      text: "A shy student is standing alone during group activities. What should you say?",
      emoji: "🧍",
      options: [
        { 
          id: "invite1", 
          text: "Hey! Want to be in our group?", 
          emoji: "👋", 
          // description: "Direct and welcoming invitation",
          isCorrect: true 
        },
        { 
          id: "watch", 
          text: "You can watch us if you want", 
          emoji: "👀", 
          // description: "Passive and not inclusive",
          isCorrect: false 
        },
        { 
          id: "enough", 
          text: "We already have enough people", 
          emoji: "🚫", 
          // description: "Excludes them from joining",
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "A new student looks confused during PE class. What should you do?",
      emoji: "🤸",
      options: [
        { 
          id: "figure", 
          text: "Figure it out yourself", 
          emoji: "😒", 
          // description: "Unhelpful and dismissive",
          isCorrect: false 
        },
        { 
          id: "explain", 
          text: "Want me to explain the game rules?", 
          emoji: "📖", 
          // description: "Offers help and explanation",
          isCorrect: true 
        },
        { 
          id: "know", 
          text: "Don't you know how to play?", 
          emoji: "🤨", 
          // description: "Makes them feel embarrassed",
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "Someone is sitting alone during art time. What should you say?",
      emoji: "🖌️",
      options: [
        { 
          id: "why", 
          text: "Why aren't you with anyone?", 
          emoji: "😕", 
          // description: "Makes them feel uncomfortable",
          isCorrect: false 
        },
        { 
          id: "find", 
          text: "You should find your own group", 
          emoji: "🚶", 
          // description: "Excludes them from joining",
          isCorrect: false 
        },
        { 
          id: "together", 
          text: "Want to create something together?", 
          emoji: "🎨", 
          // description: "Invites them to collaborate",
          isCorrect: true 
        }
      ]
    },
    {
      id: 4,
      text: "A classmate is waiting to be picked for a team. What should you do?",
      emoji: "👥",
      options: [
        { 
          id: "pick", 
          text: "Come join our team! We'd love to have you!", 
          emoji: "🤝", 
          // description: "Welcoming and inclusive invitation",
          isCorrect: true 
        },
        { 
          id: "wait", 
          text: "Maybe next time", 
          emoji: "⏳", 
          // description: "Delays inclusion",
          isCorrect: false 
        },
        { 
          id: "ignore", 
          text: "Pretend you don't see them", 
          emoji: "🙈", 
          // description: "Excludes them completely",
          isCorrect: false 
        }
      ]
    },
    {
      id: 5,
      text: "Someone looks nervous about joining a group discussion. What should you say?",
      emoji: "💬",
      options: [
        { 
          id: "quiet", 
          text: "You're too quiet, speak up", 
          emoji: "😤", 
          // description: "Puts pressure on them",
          isCorrect: false 
        },
        { 
          id: "welcome", 
          text: "We'd love to hear what you think! Join us!", 
          emoji: "👂", 
          // description: "Encouraging and welcoming",
          isCorrect: true 
        },
        { 
          id: "later", 
          text: "Maybe you can join later", 
          emoji: "⏰", 
          // description: "Postpones their inclusion",
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
      title="Invite Roleplay"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/uvls/kids/respect-signals"
      nextGameIdProp="uvls-kids-19"
      gameType="uvls"
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

export default InviteRoleplay;

