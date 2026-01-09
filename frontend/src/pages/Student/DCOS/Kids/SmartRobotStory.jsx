import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SmartRobotStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-kids-71";
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
      text: "You ask your robot for help with your homework. It gives you the full answer instantly. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Copy Answer", 
          emoji: "📋", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Read and Understand", 
          emoji: "🧠", 
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Submit Without Check", 
          emoji: "🚫", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "The robot shows how to solve a math problem. You don't understand the steps. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Ask to Explain", 
          emoji: "❓", 
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Copy Answers", 
          emoji: "🙄", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Complain", 
          emoji: "😡", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "The robot suggests a cool science project idea. You like it but want to make it unique. What should you do?",
      options: [
       
        { 
          id: "b", 
          text: "Copy Project", 
          emoji: "🧾", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Do Nothing", 
          emoji: "😴", 
          isCorrect: false
        },
         { 
          id: "a", 
          text: "Add Creativity", 
          emoji: "🎨", 
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      text: "The robot writes an essay for you. It looks perfect but doesn't sound like you. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Edit in Own Words", 
          emoji: "🗣️", 
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Submit As Is", 
          emoji: "📄", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Complain", 
          emoji: "😕", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "After finishing your work, the robot gives feedback that you improved a lot! What should you do?",
      options: [
       
        { 
          id: "b", 
          text: "Ignore Feedback", 
          emoji: "🙃", 
          isCorrect: false
        },
         { 
          id: "a", 
          text: "Say Thanks", 
          emoji: "😊", 
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Ask Robot to Do All", 
          emoji: "🤷‍♂️", 
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
      title="Smart Robot Story"
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={5}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={coins}
      gameId="dcos-kids-71"
      nextGamePathProp="/student/dcos/kids/reflex-ai-safety1"
      nextGameIdProp="dcos-kids-72"
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

export default SmartRobotStory;

