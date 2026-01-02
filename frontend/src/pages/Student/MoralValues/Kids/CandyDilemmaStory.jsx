import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CandyDilemmaStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "moral-kids-91";
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
      text: "You find extra candy in your bag. What should you do?",
      options: [
        { 
          id: "keep", 
          text: "Keep it secretly", 
          emoji: "😏", 
          
          isCorrect: false
        },
        { 
          id: "eat", 
          text: "Eat it quickly", 
          emoji: "😋", 
          isCorrect: false
        },
        { 
          id: "return", 
          text: "Return it to the teacher/shopkeeper", 
          emoji: "🙋", 
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "You see candy on the classroom floor. Do you eat it or return it?",
      options: [
        { 
          id: "eat", 
          text: "Eat it immediately", 
          emoji: "😋", 
          isCorrect: false
        },
        { 
          id: "give", 
          text: "Give it back to the teacher", 
          emoji: "🙌", 
          isCorrect: true
        },
        { 
          id: "share", 
          text: "Share it with friends", 
          emoji: "👥", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "A friend accidentally gives you extra candy. What do you do?",
      options: [
        { 
          id: "return", 
          text: "Return it politely", 
          emoji: "🫱", 
          isCorrect: true
        },
        { 
          id: "keep", 
          text: "Keep it quietly", 
          emoji: "🤫", 
          isCorrect: false
        },
        { 
          id: "eat", 
          text: "Eat it right away", 
          emoji: "🍬", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You got extra candy at a party. Should you keep or return?",
      options: [
        { 
          id: "keep", 
          text: "Keep it", 
          emoji: "😎", 
          isCorrect: false
        },
        { 
          id: "share", 
          text: "Share with siblings only", 
          emoji: "👨‍👩‍👧", 
          isCorrect: false
        },
        { 
          id: "return", 
          text: "Return to the host", 
          emoji: "🙋‍♂️", 
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "The store gives you extra candy by mistake. What is right?",
      options: [
        { 
          id: "keep", 
          text: "Keep it without telling", 
          emoji: "😏", 
          isCorrect: false
        },
        { 
          id: "return", 
          text: "Return it to the shopkeeper", 
          emoji: "🛎️", 
          isCorrect: true
        },
        { 
          id: "eat", 
          text: "Eat it before anyone notices", 
          emoji: "😋", 
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
      title="Candy Dilemma Story"
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={91}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={showResult ? finalScore : coins}
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

export default CandyDilemmaStory;
