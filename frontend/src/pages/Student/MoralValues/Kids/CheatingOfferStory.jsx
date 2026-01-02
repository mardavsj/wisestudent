import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CheatingOfferStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "moral-kids-98";
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
      text: "A friend offers you the answers during a test. What should you do?",
      options: [
        { 
          id: "accept", 
          text: "Accept the answers and copy", 
          emoji: "🤫", 
          
          isCorrect: false
        },
        { 
          id: "peek", 
          text: "Ignore and peek occasionally", 
          emoji: "👀", 
          isCorrect: false
        },
        { 
          id: "refuse", 
          text: "Politely refuse and do your own work", 
          emoji: "🙅", 
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "Your friend offers the solution to a tricky math problem. What do you do?",
      options: [
        { 
          id: "take", 
          text: "Take it without asking", 
          emoji: "🙊", 
          isCorrect: false
        },
        { 
          id: "try", 
          text: "Try yourself first and refuse help", 
          emoji: "💪", 
          isCorrect: true
        },
        { 
          id: "copy", 
          text: "Copy and hope teacher doesn't notice", 
          emoji: "😅", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Friend whispers answers during a history quiz. What is your choice?",
      options: [
        { 
          id: "honest", 
          text: "Answer honestly on your own", 
          emoji: "🖊️", 
          isCorrect: true
        },
        { 
          id: "use", 
          text: "Use their answers", 
          emoji: "🤭", 
          isCorrect: false
        },
        { 
          id: "mix", 
          text: "Mix their answers with yours", 
          emoji: "🤷", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Friend wants to share lab results to cheat. What do you do?",
      options: [
        { 
          id: "copy", 
          text: "Copy their results", 
          emoji: "😬", 
          isCorrect: false
        },
        { 
          id: "change", 
          text: "Change some numbers to match theirs", 
          emoji: "😐", 
          isCorrect: false
        },
        { 
          id: "experiment", 
          text: "Do your own experiment honestly", 
          emoji: "🧪", 
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "Friend tries to give you answers secretly in the exam hall. Your choice?",
      options: [
        { 
          id: "accept", 
          text: "Accept secretly", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          id: "no", 
          text: "Say no and focus on your own work", 
          emoji: "✋", 
          isCorrect: true
        },
        { 
          id: "peek", 
          text: "Peek occasionally", 
          emoji: "👁️", 
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
      title="Cheating Offer Story"
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={98}
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

export default CheatingOfferStory;
