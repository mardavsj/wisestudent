import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const AIJobsDebate1 = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-teen-75";
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
      text: "Will AI take jobs or create new ones?",
      options: [
        { 
          id: "take-jobs", 
          text: "AI will only take jobs", 
          emoji: "🤖", 
          isCorrect: false
        },
        { 
          id: "both-fairness", 
          text: "fairness needed", 
          emoji: "😇", 
          isCorrect: true
        },
        { 
          id: "create-only", 
          text: "AI will only create jobs", 
          emoji: "💼", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Should we be worried about AI replacing workers?",
      options: [
        { 
          id: "balance-fair", 
          text: "Balance change with fairness", 
          emoji: "⚖️", 
          isCorrect: true
        },
        { 
          id: "yes-worried", 
          text: "AI will replace everyone", 
          emoji: "😰", 
          isCorrect: false
        },
        
        { 
          id: "no-worried", 
          text: "nothing to worry about", 
          emoji: "😊", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How should we handle AI in the workplace?",
      options: [
        { 
          id: "ban-ai", 
          text: "Ban AI completely", 
          emoji: "🚫", 
          isCorrect: false
        },
       
        { 
          id: "use-all", 
          text: "Use AI everywhere without limits", 
          emoji: "🤖", 
          isCorrect: false
        },
         { 
          id: "ethical-fair", 
          text: "Use AI ethically and fairly", 
          emoji: "😇", 
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      text: "What's the best approach to AI and jobs?",
      options: [
        { 
          id: "fear-ai", 
          text: "Fear and resist AI", 
          emoji: "😨", 
          isCorrect: false
        },
        { 
          id: "adapt-fair", 
          text: "Adapt with fairness and ethics", 
          emoji: "🔌", 
          isCorrect: true
        },
        { 
          id: "ignore-ai", 
          text: "Ignore AI completely", 
          emoji: "🙈", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Should workers be protected from AI changes?",
      options: [
        { 
          id: "no-protection", 
          text: "let AI replace workers", 
          emoji: "🤖", 
          isCorrect: false
        },
        
        { 
          id: "maybe", 
          text: "depends on the job", 
          emoji: "🤔", 
          isCorrect: false
        },
        { 
          id: "yes-fair-transition", 
          text: "ensure fair transition", 
          emoji: "⚧️", 
          isCorrect: true
        },
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
      title="Debate: AI in Jobs"
      score={coins}
      subtitle={showResult ? "Debate Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/dcos/teens/puzzle-ai-uses"
      nextGameIdProp="dcos-teen-76"
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
                    <h3 className="font-bold text-xl">{option.text}</h3>
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

export default AIJobsDebate1;

