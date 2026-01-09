import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DebateStage2 = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-teen-85";
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
    text: "During an online debate, a comment targets a group using stereotypes rather than arguments. What principle should guide the platform’s response?",
    options: [
      {
        id: "a",
        text: "Protect open discussion even if harm occurs",
        emoji: "🧩",
        isCorrect: false
      },
      
      {
        id: "c",
        text: "Let users decide individually whether it is offensive",
        emoji: "🧭",
        isCorrect: false
      },
      {
        id: "b",
        text: "Limit speech that undermines dignity and safety",
        emoji: "⚖️",
        isCorrect: true
      },
    ]
  },
  {
    id: 2,
    text: "A post claims hate speech laws threaten freedom of expression. What is the strongest counter-argument in a debate?",
    options: [
      {
        id: "a",
        text: "All speech must be allowed without exception",
        emoji: "📢",
        isCorrect: false
      },
      {
        id: "b",
        text: "Restrictions exist to prevent measurable social harm",
        emoji: "📊",
        isCorrect: true
      },
      {
        id: "c",
        text: "Online platforms should avoid responsibility",
        emoji: "🛰️",
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    text: "In a moderated forum, a user argues hate speech is only harmful if violence follows. How should this claim be challenged?",
    options: [
      {
        id: "a",
        text: "Emotional harm and normalization occur even without violence",
        emoji: "🧠",
        isCorrect: true
      },
      {
        id: "b",
        text: "Online words disappear quickly",
        emoji: "🫥",
        isCorrect: false
      },
      {
        id: "c",
        text: "Impact depends only on personal sensitivity",
        emoji: "🎭",
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    text: "A debate panel discusses whether reporting hate speech discourages dialogue. What perspective best supports reporting?",
    options: [
      
      {
        id: "b",
        text: "Reporting is mainly about punishment",
        emoji: "🔗",
        isCorrect: false
      },
      {
        id: "c",
        text: "Ignoring speech keeps debates neutral",
        emoji: "🌫️",
        isCorrect: false
      },
      {
        id: "a",
        text: "Reporting helps maintain fair participation for all voices",
        emoji: "🏛️",
        isCorrect: true
      },
    ]
  },
  {
    id: 5,
    text: "When hate speech is left unchallenged in online debates, what long-term effect is most likely?",
    options: [
      {
        id: "b",
        text: "Normalization of exclusionary attitudes",
        emoji: "📉",
        isCorrect: true
      },
      {
        id: "a",
        text: "Increased participation from diverse groups",
        emoji: "🌍",
        isCorrect: false
      },
      
      {
        id: "c",
        text: "Stronger critical thinking skills",
        emoji: "🧪",
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
      title="Debate: Hate Speech"
      score={coins}
      subtitle={showResult ? "Debate Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/dcos/teens/puzzle-respect-vs-hate"
      nextGameIdProp="dcos-teen-86"
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

export default DebateStage2;

