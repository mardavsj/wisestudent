import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const HygieneConfidenceDebate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-6";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Set global window variables for useGameFeedback to ensure correct +1 popup
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Force cleanup first to prevent interference from other games
      window.__flashTotalCoins = null;
      window.__flashQuestionCount = null;
      window.__flashPointsMultiplier = 1;
      
      // Small delay to ensure cleanup
      setTimeout(() => {
        // Then set the correct values for this game
        window.__flashTotalCoins = totalCoins;        // 5
        window.__flashQuestionCount = questions.length; // 5
        window.__flashPointsMultiplier = coinsPerLevel; // 1
      }, 50);
      
      return () => {
        // Clean up on unmount
        window.__flashTotalCoins = null;
        window.__flashQuestionCount = null;
        window.__flashPointsMultiplier = 1;
      };
    }
  }, [totalCoins, coinsPerLevel]);

  const questions = [
  {
    id: 1,
    text: "During a group presentation, one teammate is very skilled but ignores basic hygiene. How does this most realistically affect the team’s confidence as a whole?",
    options: [
      {
        id: "c",
        text: "It has no effect if work is good",
        emoji: "📄"
      },
      {
        id: "a",
        text: "It can quietly lower the group’s confidence",
        emoji: "📉"
      },
      {
        id: "b",
        text: "It improves focus on skills only",
        emoji: "🎯"
      }
    ],
    correctAnswer: "a",
    explanation: "Even strong skills can be overshadowed by discomfort. Confidence in teams depends on both performance and presence."
  },
  {
    id: 2,
    text: "In debates and discussions, why is personal hygiene often linked to how seriously others take your opinion?",
    options: [
      {
        id: "b",
        text: "It signals discipline and self-awareness",
        emoji: "🧠"
      },
      
      {
        id: "c",
        text: "It makes you louder",
        emoji: "🔊"
      },
      {
        id: "a",
        text: "It shows social class",
        emoji: "🏷️"
      },
    ],
    correctAnswer: "b",
    explanation: "People subconsciously link hygiene with responsibility and clarity—important traits in communication and debate."
  },
  {
    id: 3,
    text: "A student argues that confidence is purely internal and hygiene is irrelevant. What is the strongest counter-argument?",
    options: [
      {
        id: "a",
        text: "Confidence changes depending on environment",
        emoji: "🌍"
      },
      {
        id: "c",
        text: "External comfort affects internal mindset",
        emoji: "🔁"
      },
      {
        id: "b",
        text: "Everyone feels confident sometimes",
        emoji: "🙂"
      }
    ],
    correctAnswer: "c",
    explanation: "Mental state is influenced by physical comfort. Hygiene reduces distraction and boosts self-assurance."
  },
  {
    id: 4,
    text: "In competitive spaces (sports trials, interviews, debates), hygiene mostly affects which layer of confidence?",
    options: [
      {
        id: "a",
        text: "Deep performance confidence",
        emoji: "🏗️"
      },
      {
        id: "b",
        text: "Surface confidence only",
        emoji: "🎭"
      },
      
      {
        id: "c",
        text: "It has no measurable impact",
        emoji: "❌"
      }
    ],
    correctAnswer: "a",
    explanation: "When you’re not distracted by discomfort or self-doubt, performance confidence becomes stronger."
  },
  {
    id: 5,
    text: "Which statement best balances confidence and hygiene without exaggeration?",
    options: [
      {
        id: "c",
        text: "Hygiene replaces skill",
        emoji: "🔄"
      },
      {
        id: "a",
        text: "Hygiene supports confidence, not defines worth",
        emoji: "⚖️"
      },
      {
        id: "b",
        text: "Hygiene is only for public settings",
        emoji: "🏫"
      }
    ],
    correctAnswer: "a",
    explanation: "Hygiene is a confidence amplifier—not a measure of intelligence or value, but a powerful support system."
  }
];

  const handleChoice = (optionId) => {
    const newChoices = [...choices, { 
      questionId: questions[currentQuestion].id, 
      choice: optionId,
      isCorrect: optionId === questions[currentQuestion].correctAnswer
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = optionId === questions[currentQuestion].correctAnswer;
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

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setChoices([]);
    setCoins(0);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/self-care-journal");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Hygiene Confidence Debate"
      score={coins}
      subtitle={showResult ? "Debate Complete!" : `Debate ${currentQuestion + 1} of ${questions.length}`}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/health-male/teens/self-care-journal"
      nextGameIdProp="health-male-teen-7"
      gameType="health-male"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      onNext={handleNext}
      nextEnabled={showResult}
      backPath="/games/health-male/teens"
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center max-w-4xl mx-auto px-4 py-4">
        {!showResult ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <span className="text-white/80 text-sm md:text-base">Debate {currentQuestion + 1}/{questions.length}</span>
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
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg transition-all transform hover:scale-105"
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
                <div className="text-4xl md:text-5xl mb-4">🧼</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Hygiene Confidence Champion!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} debates correct!
                  You understand how hygiene affects confidence and social interactions!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80 text-sm md:text-base">
                  Great job! You know how proper hygiene boosts confidence and improves social connections!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} debates correct.
                  Remember, good hygiene builds confidence and stronger relationships!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-bold transition-all mb-4 text-sm md:text-base">
                  Try Again
                </button>
                <p className="text-white/80 text-xs md:text-sm">
                  Try to choose the option that shows how hygiene affects confidence and social interactions.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default HygieneConfidenceDebate;

