import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from '../../../../utils/getGameData';

const ComfortRoleplay = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-8");
  const gameId = gameData?.id || "uvls-kids-8";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for ComfortRoleplay, using fallback ID");
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
      text: "Your friend is crying because they lost their favorite toy. What's the best way to comfort them?",
      emoji: "😢",
      options: [
        
        { 
          id: "dismiss", 
          text: "It's just a toy, get over it.", 
          emoji: "😤", 
          // description: "Dismissive and unkind",
          isCorrect: false 
        },
        { 
          id: "help", 
          text: "I'm sorry you're sad. Can I help you look for it?", 
          emoji: "🔍", 
          // description: "Show empathy and offer help",
          isCorrect: true 
        },
        { 
          id: "ignore", 
          text: "Stop crying, it's not a big deal.", 
          emoji: "🚫", 
          // description: "Invalidates their feelings",
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "Your classmate is upset because they got a bad grade. How should you comfort them?",
      emoji: "📝",
      options: [
        { 
          id: "support", 
          text: "You can do better next time. I believe in you!", 
          emoji: "💪", 
          // description: "Encouraging and supportive",
          isCorrect: true 
        },
        { 
          id: "insult", 
          text: "You're not smart enough, that's why.", 
          emoji: "😔", 
          // description: "Hurts their self-esteem",
          isCorrect: false 
        },
        { 
          id: "blame", 
          text: "I told you so, you should have studied more.", 
          emoji: "👆", 
          // description: "Blaming and unhelpful",
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "A new student is sitting alone and looks lonely. What should you do?",
      emoji: "😔",
      options: [
        
        { 
          id: "judge", 
          text: "Why are you sitting alone? That's weird.", 
          emoji: "🤨", 
          // description: "Judgmental and unkind",
          isCorrect: false 
        },
        { 
          id: "ignore", 
          text: "You look sad. What's wrong with you?", 
          emoji: "😕", 
          // description: "Insensitive question",
          isCorrect: false 
        },
        { 
          id: "invite", 
          text: "Hi! Want to sit with me and my friends?", 
          emoji: "👋", 
          // description: "Welcoming and inclusive",
          isCorrect: true 
        },
      ]
    },
    {
      id: 4,
      text: "Your sibling is scared about their first day at a new school. How can you comfort them?",
      emoji: "😰",
      options: [
        
        { 
          id: "dismiss", 
          text: "Stop being scared, it's just school.", 
          emoji: "😒", 
          // description: "Dismisses their fear",
          isCorrect: false 
        },
        { 
          id: "support", 
          text: "I'll walk with you to school. You'll be okay!", 
          emoji: "🚶", 
          // description: "Offers practical support",
          isCorrect: true 
        },
        { 
          id: "scare", 
          text: "Everyone will laugh at you.", 
          emoji: "😱", 
          // description: "Makes them more scared",
          isCorrect: false 
        }
      ]
    },
    {
      id: 5,
      text: "Your friend is worried about a test tomorrow. What's the best way to help?",
      emoji: "😟",
      options: [
        { 
          id: "study", 
          text: "Want to study together? We can practice!", 
          emoji: "📚", 
          // description: "Offers help and support",
          isCorrect: true 
        },
        { 
          id: "discourage", 
          text: "You'll probably fail anyway.", 
          emoji: "😞", 
          // description: "Discouraging and negative",
          isCorrect: false 
        },
        { 
          id: "dismiss", 
          text: "Tests are easy, why are you worried?", 
          emoji: "🤷", 
          // description: "Minimizes their concern",
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
      title="Comfort Roleplay"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/uvls/kids/share-reflex"
      nextGameIdProp="uvls-kids-9"
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

export default ComfortRoleplay;

