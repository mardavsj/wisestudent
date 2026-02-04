import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ReadingStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-98";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards: 4 coins per question, 20 total coins, 40 total XP
  const coinsPerLevel = 4;
  const totalCoins = 20;
  const totalXp = 40;

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
    text: "Riya wants to become a journalist. While reading a long news article, which habit will help her understand facts clearly?",
    options: [
      {
        id: "a",
        text: "Skipping paragraphs randomly",
        emoji: "⏭️",
        isCorrect: false
      },
      {
        id: "b",
        text: "Only reading headlines",
        emoji: "📰",
        isCorrect: false
      },
      {
        id: "c",
        text: "Noting important details and sources",
        emoji: "📝",
        isCorrect: true
      }
    ]
  },
  {
    id: 2,
    text: "Arjun dreams of becoming a scientist. While reading a science story, what should he focus on to understand experiments?",
    options: [
      {
        id: "a",
        text: "Steps, results, and explanations",
        emoji: "🔬",
        isCorrect: true
      },
      {
        id: "b",
        text: "Only the pictures",
        emoji: "🖼️",
        isCorrect: false
      },
      {
        id: "c",
        text: "Ignoring difficult words",
        emoji: "🙈",
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    text: "Meera is interested in becoming a lawyer. While reading a case story, what reading skill helps her most?",
    options: [
      {
        id: "a",
        text: "Guessing without reading fully",
        emoji: "🎯",
        isCorrect: false
      },
      {
        id: "b",
        text: "Understanding arguments from both sides",
        emoji: "⚖️",
        isCorrect: true
      },
      {
        id: "c",
        text: "Reading only the ending",
        emoji: "📘",
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    text: "Kabir wants to become a game designer. While reading a fantasy story, what should he observe to create better games?",
    options: [
      {
        id: "a",
        text: "Characters, challenges, and story flow",
        emoji: "🎮",
        isCorrect: true
      },
      {
        id: "b",
        text: "Counting pages",
        emoji: "📄",
        isCorrect: false
      },
      {
        id: "c",
        text: "Memorizing words without meaning",
        emoji: "🔤",
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    text: "Ananya wants to become a doctor. While reading a medical story for kids, what reading approach is most useful?",
    options: [
      {
        id: "a",
        text: "Skipping symptoms",
        emoji: "🚫",
        isCorrect: false
      },
      {
        id: "b",
        text: "Reading only difficult terms",
        emoji: "📚",
        isCorrect: false
      },
      {
        id: "c",
        text: "Connecting symptoms with causes and care",
        emoji: "🩺",
        isCorrect: true
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
    console.log('🎮 ReadingStory debug:', {
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
      setCoins(prev => prev + 4); // Increment coins when correct (4 coins per question)
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
    navigate("/student/health-male/kids/reflex-habit-alert");
  };

  return (
    <GameShell
      title="Reading Story"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={correctAnswers}
      gameId={gameId}
      nextGamePathProp="/student/health-male/kids/reflex-habit-alert"
      nextGameIdProp="health-male-kids-99"
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      totalLevels={questions.length}
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
              Great job learning about reading strategies and comprehension!
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

export default ReadingStory;

