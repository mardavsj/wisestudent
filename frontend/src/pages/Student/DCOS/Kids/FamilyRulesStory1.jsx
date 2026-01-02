import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FamilyRulesStory1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-kids-23";
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
      text: "Your parents say, 'No phones at dinner.' Everyone should talk together instead. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Hide Phone", 
          emoji: "📱", 
          
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Put Phone Away", 
          emoji: "😊", 
          
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Complain", 
          emoji: "🙄", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your family rule says: 'Homework before games.' What do you do?",
      options: [
        { 
          id: "a", 
          text: "Play Games First", 
          emoji: "🎮", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Finish Homework", 
          emoji: "📝", 
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Ask Friend", 
          emoji: "🤫", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Family rule: No TV before breakfast. You wake up early and want to watch cartoons. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Wait for Breakfast", 
          emoji: "🍳", 
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Turn TV Secretly", 
          emoji: "🤫", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Ignore Rule", 
          emoji: "😒", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Your parents ask you to clean your room before playing outside. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Go Outside First", 
          emoji: "🏃", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Clean First", 
          emoji: "🌟", 
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Complain", 
          emoji: "😠", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Family rule: Lights out by 9 PM. You're reading your comic under the blanket. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Turn Off Lights", 
          emoji: "😴", 
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Keep Reading", 
          emoji: "📖", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Argue", 
          emoji: "😤", 
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
    navigate("/games/digital-citizenship/kids");
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
      title="Family Rules Story"
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={5}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={coins}
      gameId="dcos-kids-23"
      gameType="dcos"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}>
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

export default FamilyRulesStory1;
