import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FamilyRulesStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-kids-7";
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
      text: "It's 9:00 PM. Mom says, 'Time to turn off all devices and get ready for bed.' But you're in the middle of an exciting game. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Follow Mom's Rule", 
          emoji: "😊", 
          
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Keep Playing Secretly", 
          emoji: "😈", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Argue with Mom", 
          emoji: "😠", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Dad says, 'No devices at dinner table.' You want to check a message. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Check Message Secretly", 
          emoji: "😈", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Follow the Rule", 
          emoji: "😊", 
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Argue About It", 
          emoji: "😠", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Parent says, 'Ask before downloading apps.' You see a fun game. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Download Without Asking", 
          emoji: "😈", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Ask Parent First", 
          emoji: "😊", 
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Ignore the Rule", 
          emoji: "😔", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Family rule: 'No devices after 8 PM.' It's 8:30 PM and you want to watch a video. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Follow the Rule", 
          emoji: "😊", 
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Watch Secretly", 
          emoji: "😈", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Complain Loudly", 
          emoji: "😠", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Parent says, 'Share passwords with us for safety.' You want privacy. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Refuse to Share", 
          emoji: "😠", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Share with Parents", 
          emoji: "😊", 
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Give Fake Password", 
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
      gameId="dcos-kids-7"
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

export default FamilyRulesStory;
