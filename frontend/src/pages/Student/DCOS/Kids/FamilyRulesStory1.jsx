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
    text: "Your family has a rule that devices must stay in the living room at night. You want to take your tablet to your bedroom. What is the best choice?",
    options: [
      {
        id: "a",
        text: "Take it quietly so no one notices",
        emoji: "🌙",
        isCorrect: false
      },
      {
        id: "b",
        text: "Leave it where the rule says",
        emoji: "📦",
        isCorrect: true
      },
      {
        id: "c",
        text: "Use it only for a few minutes",
        emoji: "⏱️",
        isCorrect: false
      }
    ]
  },
  {
    id: 2,
    text: "Your family rule says you must ask before downloading new apps or games. You see a fun new game your friends are playing. What should you do?",
    options: [
      {
        id: "a",
        text: "Download it later when adults are busy",
        emoji: "🎯",
        isCorrect: false
      },
      
      {
        id: "c",
        text: "Ask a friend to download it for you",
        emoji: "🔄",
        isCorrect: false
      },
      {
        id: "b",
        text: "Check the game rules with an adult first",
        emoji: "📄",
        isCorrect: true
      },
    ]
  },
  {
    id: 3,
    text: "There is a family rule about being kind online. You see a rude comment in a group chat. What action follows the family rule?",
    options: [
       {
        id: "b",
        text: "Ignore the message and move on",
        emoji: "➡️",
        isCorrect: true
      },
      {
        id: "a",
        text: "Reply with another rude message",
        emoji: "💬",
        isCorrect: false
      },
     
      {
        id: "c",
        text: "Share the comment to others",
        emoji: "📣",
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    text: "Your family rule says screen time ends after a timer. The timer rings while you are in the middle of a level. What should you do?",
    options: [
      {
        id: "a",
        text: "Finish the level before stopping",
        emoji: "🎮",
        isCorrect: false
      },
      {
        id: "b",
        text: "Pause and stop when the timer rings",
        emoji: "⏰",
        isCorrect: true
      },
      {
        id: "c",
        text: "Lower the volume and continue",
        emoji: "🔉",
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    text: "Your family has a rule about sharing problems openly. You receive a strange message online that makes you uncomfortable. What is the right step?",
    options: [
      {
        id: "a",
        text: "Delete the message and forget it",
        emoji: "🗑️",
        isCorrect: false
      },
      
      {
        id: "c",
        text: "Reply to see what happens next",
        emoji: "❓",
        isCorrect: false
      },
      {
        id: "b",
        text: "Tell a trusted adult in your family",
        emoji: "🤗",
        isCorrect: true
      },
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
      nextGamePathProp="/student/dcos/kids/eye-strain-reflex"
      nextGameIdProp="dcos-kids-24"
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

