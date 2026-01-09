import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const BadgeGreenInnovator = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  const gameId = "sustainability-teens-95";
  const games = getSustainabilityTeenGames({});
  const currentGameIndex = games.findIndex(game => game.id === gameId);
  const nextGame = games[currentGameIndex + 1];
  const nextGamePath = nextGame ? nextGame.path : "/games/sustainability/teens";
  const nextGameId = nextGame ? nextGame.id : null;

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [challenge, setChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const challenges = [
    {
      id: 1,
      question: "What makes an innovation truly sustainable?",
      options: [
        { id: 'a', text: "Addresses environmental, social, and economic needs", emoji: "🌱", isCorrect: true },
        { id: 'b', text: "Maximizes profit", emoji: "💰", isCorrect: false },
        { id: 'c', text: "Focuses only on technology", emoji: "⚙️", isCorrect: false },
        { id: 'd', text: "Ignores social impact", emoji: "👤", isCorrect: false }
      ]
    },
    {
      id: 2,
      question: "Which approach is most effective for scaling green innovations?",
      options: [
        { id: 'b', text: "Individual entrepreneurship only", emoji: "👤", isCorrect: false },
        { id: 'c', text: "Competition-driven approach", emoji: "⚔️", isCorrect: false },
        { id: 'd', text: "Technology-only solutions", emoji: "🤖", isCorrect: false },
        { id: 'a', text: "Collaborative partnerships and systemic change", emoji: "🤝", isCorrect: true },
      ]
    },
    {
      id: 3,
      question: "What's the key to successful sustainable innovation?",
      options: [
        { id: 'b', text: "Rapid market entry", emoji: "🚀", isCorrect: false },
        { id: 'a', text: "Balancing innovation with environmental responsibility", emoji: "⚖️", isCorrect: true },
        { id: 'c', text: "Cost minimization", emoji: "📉", isCorrect: false },
        { id: 'd', text: "Technology complexity", emoji: "⚙️", isCorrect: false }
      ]
    },
    {
      id: 4,
      question: "How should sustainable innovations be evaluated?",
      options: [
        { id: 'b', text: "Financial returns only", emoji: "💰", isCorrect: false },
        { id: 'c', text: "Market share", emoji: "📊", isCorrect: false },
        { id: 'a', text: "Using triple bottom line: people, planet, profit", emoji: "🌱", isCorrect: true },
        { id: 'd', text: "Speed of deployment", emoji: "⚡", isCorrect: false }
      ]
    },
    {
      id: 5,
      question: "What drives lasting innovation in sustainability?",
      options: [
        { id: 'a', text: "Systemic thinking and stakeholder collaboration", emoji: "🌍", isCorrect: true },
        { id: 'b', text: "Individual genius", emoji: "🧠", isCorrect: false },
        { id: 'c', text: "Capital investment only", emoji: "💸", isCorrect: false },
        { id: 'd', text: "Technology alone", emoji: "🤖", isCorrect: false }
      ]
    }
  ];

  const handleAnswer = (option) => {
    if (answered) return;

    setAnswered(true);
    resetFeedback();

    if (option.isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    const isLastChallenge = challenge === challenges.length - 1;

    setTimeout(() => {
      if (isLastChallenge) {
        setShowResult(true);
      } else {
        setChallenge(prev => prev + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      }
    }, 2000);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setChallenge(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    resetFeedback();
  };

  const handleNext = () => {
    navigate(nextGamePath);
  };

  const currentChallenge = challenges[challenge];

  return (
    <GameShell
      title="Badge: Green Innovator"
      subtitle={!showResult ? `Challenge ${challenge + 1} of ${challenges.length}` : "Badge Complete!"}
      score={score}
      currentLevel={challenge + 1}
      totalLevels={challenges.length}
      maxScore={challenges.length}
      showConfetti={showResult && score === challenges.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      showGameOver={showResult}
      gameId={gameId}
      gameType="sustainability"
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
      backPath="/games/sustainability/teens"
    
      nextGamePathProp="/student/sustainability/teens/leadership-story"
      nextGameIdProp="sustainability-teens-96">
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center max-w-4xl mx-auto px-4 py-4">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Challenge {challenge + 1}/{challenges.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4">Green Innovator Challenge</h3>
              
              <p className="text-white text-lg mb-6">{currentChallenge.question}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentChallenge.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 flex items-center space-x-3"
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <span>{option.text}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="text-center text-white/70 text-sm">
              Demonstrate your expertise as a green innovator
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Badge Earned!</h2>
              <div className="text-6xl mb-4">🌱</div>
              <p className="text-white/90 mb-2">Green Innovator Badge</p>
              <p className="text-white/90 mb-2">Score: {score}/{challenges.length}</p>
              <p className="text-white/70 mb-6">
                {score === challenges.length 
                  ? "Perfect score! You're a true green innovator!" 
                  : score >= challenges.length / 2 
                  ? "Great job! You understand green innovation principles." 
                  : "Keep learning about sustainable innovation."}
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
                >
                  Try Again
                </button>
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
                >
                  Next Challenge
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeGreenInnovator;