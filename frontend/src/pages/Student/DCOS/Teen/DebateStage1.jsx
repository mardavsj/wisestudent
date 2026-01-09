import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DebateStage1 = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-teen-65";
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
    text: "During a school debate, someone argues that deleting old posts fully removes them from the internet. Which position is strongest?",
    options: [
      
      {
        id: "b",
        text: "Once deleted, content disappears permanently",
        isCorrect: false
      },
      {
        id: "c",
        text: "Only famous people need to worry about old posts",
        isCorrect: false
      },
      {
        id: "a",
        text: "Deleted content can still exist through screenshots or archives",
        isCorrect: true
      },
    ]
  },
  {
    id: 2,
    text: "A debate topic asks whether anonymous accounts improve online discussions. What is the most reasonable stance?",
    options: [
      {
        id: "a",
        text: "They allow free speech without consequences",
        isCorrect: false
      },
      {
        id: "b",
        text: "They can reduce accountability and increase misuse",
        isCorrect: true
      },
      {
        id: "c",
        text: "They make online spaces completely fair",
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    text: "In a digital ethics debate, a student claims that reposting content means agreeing with it. Which counter-argument is strongest?",
    options: [
      {
        id: "a",
        text: "Reposting can spread ideas without understanding them",
        isCorrect: true
      },
      {
        id: "b",
        text: "Reposts always show personal belief",
        isCorrect: false
      },
      {
        id: "c",
        text: "Algorithms decide meaning, not users",
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    text: "A debate question asks whether online arguments affect real-world relationships. Which response is most accurate?",
    options: [
      
      {
        id: "b",
        text: "Digital conflicts stay separate from real life",
        isCorrect: false
      },
      {
        id: "a",
        text: "Online words can influence trust and perception offline",
        isCorrect: true
      },
      {
        id: "c",
        text: "Only adults are affected by online arguments",
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    text: "During a debate on influence, someone claims likes and followers equal credibility. What is the best rebuttal?",
    options: [
      
      {
        id: "b",
        text: "Large audiences always indicate expertise",
        isCorrect: false
      },
      {
        id: "c",
        text: "Only viral content should be trusted",
        isCorrect: false
      },
      {
        id: "a",
        text: "Popularity does not guarantee accuracy or responsibility",
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
      title="Debate: Online Identity"
      score={coins}
      subtitle={showResult ? "Debate Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/dcos/teens/digital-reputation-puzzle"
      nextGameIdProp="dcos-teen-66"
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

export default DebateStage1;

