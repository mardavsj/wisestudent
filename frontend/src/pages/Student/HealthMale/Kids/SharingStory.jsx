import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SharingStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-55";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards: 3 coins per question, 15 total coins, 30 total XP
  const coinsPerLevel = 3;
  const totalCoins = 15;
  const totalXp = 30;

  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [coins, setCoins] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0); // Track number of correct answers for score
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You feel scared during a thunderstorm. What should you do?",
      options: [
       
        {
          id: "b",
          text: "Hide under the bed and stay quiet",
          emoji: "🛏️",
          isCorrect: false
        },
         {
          id: "a",
          text: "Tell your parents you're scared",
          emoji: "💬",
         
          isCorrect: true
        },
        {
          id: "c",
          text: "Pretend you're not scared",
          emoji: "😊",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friend says something that hurts your feelings. What do you do?",
      options: [
        {
          id: "a",
          text: "Tell them how you feel",
          emoji: "🗣️",
          isCorrect: true
        },
        {
          id: "b",
          text: "Never talk to them again",
          emoji: "🚫",
          isCorrect: false
        },
        {
          id: "c",
          text: "Say nothing and stay mad",
          emoji: "😠",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You feel worried about a test at school. What's the best choice?",
      options: [
        {
          id: "b",
          text: "Keep worry inside and don't study",
          emoji: "😰",
          isCorrect: false
        },
       
        {
          id: "c",
          text: "Pretend everything is fine",
          emoji: "😄",
          isCorrect: false
        },
         {
          id: "a",
          text: "Talk to teacher or parents about it",
          emoji: "👨‍🏫",
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      text: "You feel excited about your birthday party. What should you do?",
      options: [
        
        {
          id: "b",
          text: "Act like you don't care",
          emoji: "😑",
          isCorrect: false
        },
        {
          id: "a",
          text: "Share your excitement with family",
          emoji: "🎉",
          isCorrect: true
        },
        {
          id: "c",
          text: "Keep excitement to yourself",
          emoji: "🤐",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You feel angry at your sibling. What's the healthy choice?",
      options: [
        {
          id: "a",
          text: "Tell them calmly how you feel",
          emoji: "💭",
          isCorrect: true
        },
        {
          id: "b",
          text: "Yell and say mean things",
          emoji: "😡",
          isCorrect: false
        },
        {
          id: "c",
          text: "Stay silent and stay mad",
          emoji: "🤐",
          isCorrect: false
        }
      ]
    }
  ];
  
  // Set global window variables for useGameFeedback
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.__flashTotalCoins = totalCoins;
      window.__flashQuestionCount = questions.length;
      window.__flashPointsMultiplier = coinsPerLevel;
      
      return () => {
        // Clean up on unmount
        window.__flashTotalCoins = null;
        window.__flashQuestionCount = null;
        window.__flashPointsMultiplier = 1;
      };
    }
  }, [totalCoins, coinsPerLevel, questions.length]);

  // Debug logging
  useEffect(() => {
    console.log('🎮 SharingStory debug:', {
      correctAnswers,
      coins,
      coinsPerLevel,
      totalCoins,
      questionsLength: questions.length,
      showResult
    });
  }, [correctAnswers, coins, coinsPerLevel, totalCoins, showResult, questions.length]);

  // Debug: Log GameShell props
  useEffect(() => {
    if (showResult) {
      console.log('🎮 GameShell props:', {
        score: correctAnswers,
        maxScore: questions.length,
        coinsPerLevel,
        totalCoins,
        totalXp,
        totalLevels: questions.length
      });
    }
  }, [showResult, correctAnswers, coinsPerLevel, totalCoins, totalXp, questions.length]);

  const handleChoice = (optionId) => {
    if (answered) return;
    
    const selectedOption = questions[currentQuestion].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;
    
    setAnswered(true);
    resetFeedback();

    if (isCorrect) {
      setCoins(prev => prev + 3); // Increment coins when correct (3 coins per question)
      setCorrectAnswers(prev => prev + 1); // Increment correct answers count
      // Show feedback after state updates
      setTimeout(() => {
        showCorrectAnswerFeedback(1, true);
      }, 50);
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

  const handleNext = () => {
    navigate("/games/health-male/kids");
  };

  return (
    <GameShell
      title="Sharing Story"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={correctAnswers}
      gameId={gameId}
      nextGamePathProp="/student/health-male/kids/feelings-normal-poster"
      nextGameIdProp="health-male-kids-56"
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      totalLevels={questions.length}
      backPath="/games/health-male/kids"
      showConfetti={showResult && score >= 3}
    >
      <div className="space-y-8">
        {!showResult && questions[currentQuestion] ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {correctAnswers}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {questions[currentQuestion].text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
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
        
        {showResult && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">Story Complete!</h3>
            <p className="text-xl text-white/90 mb-6">
              You finished the game with {correctAnswers} out of {questions.length} correct
            </p>
            <p className="text-xl text-white/90 mb-6">
              You earned {coins} coins!
            </p>
            <p className="text-white/80 mb-8">
              Great job learning about sharing your feelings!
            </p>
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-8 rounded-full font-bold text-lg transition-all transform hover:scale-105"
            >
              Next Challenge
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SharingStory;

