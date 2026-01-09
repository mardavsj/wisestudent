import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FamilyRuleDebate = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-teen-27";
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
    text: "Your parents say no social media after 9 PM. You want to chat with friends. What’s the healthiest response?",
    options: [
     
      { 
        id: "sneak-chat", 
        text: "Sneak messages without telling", 
        emoji: "🤫", 
        isCorrect: false
      },
       { 
        id: "follow-rule", 
        text: "Follow the rule and chat tomorrow", 
        emoji: "😑", 
        isCorrect: true
      },
      { 
        id: "argue", 
        text: "Argue why you should stay online", 
        emoji: "😠", 
        isCorrect: false
      }
    ]
  },
  {
    id: 2,
    text: "Family rule: Screens off during meals. You see something funny online. What should you do?",
    options: [
      { 
        id: "respect-rule", 
        text: "Wait until the meal ends", 
        emoji: "🤔", 
        isCorrect: true
      },
      { 
        id: "check-anyway", 
        text: "Quickly check while eating", 
        emoji: "📱", 
        isCorrect: false
      },
      { 
        id: "share-story", 
        text: "Tell friends online about your meal instead", 
        emoji: "💬", 
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    text: "Your parents ask you to limit gaming to 1 hour a day. You have homework and also want to play. What’s the best approach?",
    options: [
      
      { 
        id: "ignore-limit", 
        text: "Play longer anyway", 
        emoji: "🎮", 
        isCorrect: false
      },
      { 
        id: "skip-homework", 
        text: "Skip homework to play", 
        emoji: "📝", 
        isCorrect: false
      },
      { 
        id: "balance", 
        text: "Finish homework first, then play for 1 hour", 
        emoji: "⚖️", 
        isCorrect: true
      },
    ]
  },
  {
    id: 4,
    text: "Parents say no devices in your bedroom. You want privacy for study. What’s a smart choice?",
    options: [
      
      { 
        id: "hide-device", 
        text: "Hide device in bedroom anyway", 
        emoji: "🙈", 
        isCorrect: false
      },
      { 
        id: "study-common-area", 
        text: "Use a shared area to study quietly", 
        emoji: "🙂", 
        isCorrect: true
      },
      { 
        id: "complain", 
        text: "Complain that rules are unfair", 
        emoji: "😡", 
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    text: "Family rule: Share online passwords only with parents. A friend asks for yours to play a game. What’s correct?",
    options: [
      { 
        id: "tell-parent", 
        text: "Tell parent instead of sharing", 
        emoji: "🤓", 
        isCorrect: true
      },
      { 
        id: "share-friend", 
        text: "Share just this once", 
        emoji: "🤝", 
        isCorrect: false
      },
      { 
        id: "ignore-rule", 
        text: "Ignore the rule and share", 
        emoji: "🙃", 
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
      title="Debate: Family Rules"
      score={coins}
      subtitle={showResult ? "Debate Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/dcos/teens/sleep-hygiene-reflex"
      nextGameIdProp="dcos-teen-28"
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

export default FamilyRuleDebate;

