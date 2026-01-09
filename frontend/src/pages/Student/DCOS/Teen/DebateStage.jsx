import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DebateStage = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-teen-56";
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
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
  {
    id: 1,
    text: "A classmate wants to share your online post without asking. How should you respond to maintain respect and privacy?",
    options: [
      { 
        id: "express-concern", 
        text: "Explain why permission is important before sharing", 
        emoji: "💬", 
        isCorrect: true
      },
      { 
        id: "ignore", 
        text: "Ignore it and hope they understand later", 
        emoji: "🙃", 
        isCorrect: false
      },
      { 
        id: "share-back", 
        text: "Share one of their posts without asking as a joke", 
        emoji: "😏", 
        isCorrect: false
      }
    ]
  },
  {
    id: 2,
    text: "You notice a group spreading rumors online about another student. What is the most responsible action?",
    options: [
     
      { 
        id: "join-joke", 
        text: "Join the group to fit in", 
        emoji: "😄", 
        isCorrect: false
      },
      { 
        id: "ignore-event", 
        text: "Ignore it and scroll past", 
        emoji: "📱", 
        isCorrect: false
      },
       { 
        id: "intervene-positively", 
        text: "Message them to stop and support the student privately", 
        emoji: "🤝", 
        isCorrect: true
      },
    ]
  },
  {
    id: 3,
    text: "During a school debate, you are asked if using someone else’s online work without credit is fair. What’s the most thoughtful response?",
    options: [
      { 
        id: "credit-author", 
        text: "Credit the original creator and explain why it matters", 
        emoji: "✍️", 
        isCorrect: true
      },
      { 
        id: "pretend-original", 
        text: "Present it as your own to save time", 
        emoji: "🤫", 
        isCorrect: false
      },
      { 
        id: "skip-topic", 
        text: "Change the subject to avoid confrontation", 
        emoji: "😐", 
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    text: "A friend wants to share their password with you so you can play together. How do you handle it responsibly?",
    options: [
      
      { 
        id: "use-password", 
        text: "Use it quickly to help them", 
        emoji: "🎮", 
        isCorrect: false
      },
      { 
        id: "advise-safety", 
        text: "Explain why passwords should remain private and suggest alternatives", 
        emoji: "🙂", 
        isCorrect: true
      },
      { 
        id: "ignore-request", 
        text: "Ignore their request and move on", 
        emoji: "😶", 
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    text: "During an online group project, one member posts inappropriate content in the shared chat. What’s the best approach?",
    options: [
      { 
        id: "address-respectfully", 
        text: "Politely ask them to remove it and remind the group of guidelines", 
        emoji: "📝", 
        isCorrect: true
      },
      { 
        id: "reply-angrily", 
        text: "Respond with anger to make them stop", 
        emoji: "😡", 
        isCorrect: false
      },
      { 
        id: "leave-group", 
        text: "Leave the group and avoid participation", 
        emoji: "🚪", 
        isCorrect: false
      }
    ]
  }
];


  const handleChoice = (selectedChoice) => {
    const newChoices = [...choices, { 
      questionId: questions[currentQuestion].id, 
      choice: selectedChoice,
      isCorrect: questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect;
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

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Debate: Privacy Rights"
      score={coins}
      subtitle={showResult ? "Debate Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/dcos/teens/digital-footprint-story1"
      nextGameIdProp="dcos-teen-57"
      gameType="dcos"
      totalLevels={5}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult && finalScore === 5}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {coins}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {getCurrentQuestion().text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getCurrentQuestion().options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
                  >
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

export default DebateStage;

