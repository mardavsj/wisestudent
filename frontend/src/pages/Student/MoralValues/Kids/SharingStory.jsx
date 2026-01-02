import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SharingStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "moral-kids-21";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You have 2 chocolates, your friend has none. Do you share?",
      options: [
        { 
          id: "share", 
          text: "Share one chocolate", 
          emoji: "🤝", 
          
          isCorrect: true
        },
        { 
          id: "keep", 
          text: "Keep both for yourself", 
          emoji: "🙅‍♀️", 
          isCorrect: false
        },
        { 
          id: "hide", 
          text: "Hide them", 
          emoji: "🙈", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You have a new toy, your friend has none. Do you let them play?",
      options: [
        
        { 
          id: "no", 
          text: "No, keep it to yourself", 
          emoji: "🙅‍♂️", 
          isCorrect: false
        },
        { 
          id: "let", 
          text: "Yes, let them play too", 
          emoji: "🤗", 
          isCorrect: true
        },
        { 
          id: "break", 
          text: "Break it so no one can play", 
          emoji: "💥", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Your friend forgot their pencil. Do you lend one?",
      options: [
       
        { 
          id: "no", 
          text: "No, they should buy one", 
          emoji: "🚫", 
          isCorrect: false
        },
         { 
          id: "lend", 
          text: "Yes, lend your pencil", 
          emoji: "✌️", 
          isCorrect: true
        },
        { 
          id: "hide", 
          text: "Hide your pencil", 
          emoji: "🙈", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You have extra snack. Your friend is hungry. Do you share?",
      options: [
       
        { 
          id: "eat", 
          text: "Eat it all yourself", 
          emoji: "😋", 
          isCorrect: false
        },
        { 
          id: "throw", 
          text: "Throw it away", 
          emoji: "🗑️", 
          isCorrect: false
        },
         { 
          id: "share", 
          text: "Share with your friend", 
          emoji: "🤲", 
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "You have a fun book. Your friend has none. Do you lend it?",
      options: [
        { 
          id: "lend", 
          text: "Yes, lend it for a while", 
          emoji: "🤝", 
          isCorrect: true
        },
        { 
          id: "keep", 
          text: "No, keep it", 
          emoji: "🙅‍♀️", 
          isCorrect: false
        },
        { 
          id: "tear", 
          text: "Tear pages out", 
          emoji: "😈", 
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (selectedChoice) => {
    if (currentQuestion < 0 || currentQuestion >= questions.length) {
      return;
    }

    const currentQ = questions[currentQuestion];
    if (!currentQ || !currentQ.options) {
      return;
    }

    const newChoices = [...choices, { 
      questionId: currentQ.id, 
      choice: selectedChoice,
      isCorrect: currentQ.options.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = currentQ.options.find(opt => opt.id === selectedChoice)?.isCorrect;
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
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

  const handleNext = () => {
    // Navigation handled by GameShell
  };

  const getCurrentQuestion = () => {
    if (currentQuestion >= 0 && currentQuestion < questions.length) {
      return questions[currentQuestion];
    }
    return null;
  };

  const currentQuestionData = getCurrentQuestion();

  return (
    <GameShell
      title="Sharing Story"
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={21}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={coins}
      gameId={gameId}
      gameType="moral"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === questions.length}>
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {coins}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6 text-center">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options && currentQuestionData.options.map(option => (
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

export default SharingStory;
