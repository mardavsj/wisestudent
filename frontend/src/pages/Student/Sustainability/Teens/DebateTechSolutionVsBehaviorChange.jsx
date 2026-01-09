import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const DebateTechSolutionVsBehaviorChange = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  const gameId = "sustainability-teens-91";
  const games = getSustainabilityTeenGames({});
  const currentGameIndex = games.findIndex(game => game.id === gameId);
  const nextGame = games[currentGameIndex + 1];
  const nextGamePath = nextGame ? nextGame.path : "/games/sustainability/teens";
  const nextGameId = nextGame ? nextGame.id : null;

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const questions = [
  {
    id: 1,
    text: "Which approach creates the strongest environmental impact?",
    options: [
      { id: 'a', text: "Only technology solutions", emoji: "⚙️", isCorrect: false },
      { id: 'b', text: "Only behavior changes", emoji: "👤", isCorrect: false },
      { id: 'c', text: "Both technology and behavior change together", emoji: "🤝", isCorrect: true }
    ]
  },
  {
    id: 2,
    text: "What is most effective for solving climate problems?",
    options: [
      { id: 'c', text: "Technology supported by behavior change", emoji: "🌍", isCorrect: true },
      { id: 'a', text: "New technologies alone", emoji: "💡", isCorrect: false },
      { id: 'b', text: "Changing habits alone", emoji: "🔄", isCorrect: false },
    ]
  },
  {
    id: 3,
    text: "Which approach works best in the long run?",
    options: [
      { id: 'a', text: "Technology without behavior change", emoji: "🤖", isCorrect: false },
      { id: 'c', text: "Both support each other", emoji: "🔗", isCorrect: true },
      { id: 'b', text: "Behavior change without technology", emoji: "💪", isCorrect: false },
    ]
  },
  {
    id: 4,
    text: "What helps sustainability last over time?",
    options: [
      { id: 'c', text: "Technology that encourages sustainable behavior", emoji: "🌱", isCorrect: true },
      { id: 'a', text: "Technology alone", emoji: "⚙️", isCorrect: false },
      { id: 'b', text: "Behavior change alone", emoji: "👤", isCorrect: false },
    ]
  },
  {
    id: 5,
    text: "Which approach leads to real-world environmental change?",
    options: [
      { id: 'a', text: "Large-scale technology only", emoji: "📈", isCorrect: false },
      { id: 'b', text: "Individual actions only", emoji: "👤", isCorrect: false },
      { id: 'c', text: "Technology combined with responsible behavior", emoji: "🌍", isCorrect: true }
    ]
  }
];


  const handleAnswer = (optionId) => {
    if (answered) return;
    
    setSelectedOption(optionId);
    setAnswered(true);
    resetFeedback();
    
    const selectedOptionData = questions[currentQuestion].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOptionData.isCorrect;
    
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
        setSelectedOption(null);
      } else {
        setShowResult(true);
      }
    }, isCorrect ? 1000 : 800);
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Debate: Tech Solution vs Behavior Change"
      score={coins}
      subtitle={showResult ? "Debate Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="sustainability"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
      backPath="/games/sustainability/teens"
    
      nextGamePathProp="/student/sustainability/teens/journal-of-innovation"
      nextGameIdProp="sustainability-teens-92">
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center max-w-4xl mx-auto px-4 py-4">
        {!showResult ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <span className="text-white/80 text-sm md:text-base">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold text-sm md:text-base">Coins: {coins}</span>
              </div>
              
              <p className="text-white text-lg md:text-xl mb-6">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.id)}
                    disabled={answered}
                    className={`bg-gradient-to-r ${
                      answered && option.id === selectedOption
                        ? option.isCorrect
                          ? 'bg-green-500'
                          : 'bg-red-500'
                        : 'from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 text-left flex items-center space-x-3`}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <span>{option.text}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="text-center text-white/70 text-sm">
              Debate the effectiveness of technology vs behavior change for sustainability
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Debate Complete!</h2>
              <p className="text-white/90 mb-2">You earned {coins} coins</p>
              <p className="text-white/70 mb-6">Great job debating tech solutions vs behavior change!</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => navigate(nextGamePath)}
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

export default DebateTechSolutionVsBehaviorChange;