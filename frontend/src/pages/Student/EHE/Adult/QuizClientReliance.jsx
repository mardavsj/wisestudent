import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CLIENT_RELIANCE_STAGES = [
  {
    id: 1,
    prompt: "70% of your business revenue comes from a single customer. What is the biggest risk here?",
    options: [
      {
        id: "opt1",
        text: "Guaranteed expansion",
        outcome: "Relying on one client does not guarantee overall business expansion.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Revenue vulnerability",
        outcome: "Correct! If that one client leaves or delays payment, your entire business is at risk.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Higher profits",
        outcome: "While they may provide high revenue now, the risk of total loss outweighs short-term profit.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "A large client demands a significant price discount, threatening to leave if you don't comply. How does client concentration affect this negotiation?",
    options: [
      {
        id: "opt1",
        text: "It empowers you to reject their offer easily",
        outcome: "If they are your main revenue source, rejecting them could mean bankruptcy.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "It has no impact on the negotiation",
        outcome: "Having one massive client always impacts leverage in negotiations.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "It forces you to accept the discount to survive",
        outcome: "Exactly. Heavy reliance strips away your negotiating power.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 3,
    prompt: "What is the most effective strategy to mitigate the risk of client over-reliance?",
    options: [
      {
        id: "opt2",
        text: "Diversify your client base by acquiring multiple smaller clients",
        outcome: "Correct! Spreading revenue across many clients builds stability.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "Focus entirely on keeping that one client happy",
        outcome: "While good service is important, it doesn't solve the underlying structural risk.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Stop working with the large client immediately",
        outcome: "Abruptly cutting off your main revenue source is financial suicide.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "Your massive, single client goes bankrupt and cannot pay their outstanding invoices. What happens to your business?",
    options: [
      
      {
        id: "opt2",
        text: "Your business automatically scales down without issues",
        outcome: "Scaling down takes time and money; sudden revenue loss usually causes crisis.",
        isCorrect: false,
      },
      {
        id: "opt1",
        text: "You experience a severe cash flow crisis that threatens your survival",
        outcome: "Spot on! This is the exact danger of high client concentration.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "You can simply sue them and get the money instantly",
        outcome: "Lawsuits take time and money, and bankrupt companies often cannot pay.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "When reviewing your business analytics, what indicates a healthy, diversified revenue model?",
    options: [
      {
        id: "opt1",
        text: "One client accounts for 80% of total revenue",
        outcome: "This indicates extreme vulnerability, not health.",
        isCorrect: false,
      },
     
      {
        id: "opt3",
        text: "You have only three massive clients",
        outcome: "Having only three clients still leaves you highly exposed.",
        isCorrect: false,
      },
       {
        id: "opt2",
        text: "No single client accounts for more than 15-20% of total revenue",
        outcome: "Correct! This ensures the loss of any single client is manageable.",
        isCorrect: true,
      },
    ],
  },
];

const QuizClientReliance = () => {
  const location = useLocation();
  const gameId = "ehe-adults-63";
  const gameData = getGameDataById(gameId);
  const totalStages = CLIENT_RELIANCE_STAGES.length;

  const totalCoins = gameData?.coins || location.state?.totalCoins || 15;
  const totalXp = gameData?.xp || location.state?.totalXp || 30;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const stage = CLIENT_RELIANCE_STAGES[currentStageIndex];

  const handleChoice = (option) => {
    if (selectedChoice) return;
    setSelectedChoice(option);
    if (option.isCorrect) {
      setScore((s) => s + 1);
      showCorrectAnswerFeedback(1, true);
    }
  };

  const handleNext = () => {
    if (currentStageIndex === totalStages - 1) {
      setShowResult(true);
    } else {
      setCurrentStageIndex((i) => i + 1);
    }
    setSelectedChoice(null);
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Quiz: Client Reliance"
      subtitle={
        showResult
          ? "Well done! You understand the risks of client concentration."
          : `Question ${currentStageIndex + 1} of ${totalStages}`
      }
      currentLevel={currentStageIndex + 1}
      totalLevels={totalStages}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      score={score}
      showConfetti={showResult && score === totalStages}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="ehe"
      nextGamePath={location.state?.nextGamePath}
      nextGameId={location.state?.nextGameId}
      backPath={location.state?.returnPath}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!showResult && stage && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 md:p-10 border border-slate-700 shadow-2xl relative overflow-hidden">

              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 to-indigo-600"></div>

              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-8 border-b border-slate-700 pb-4">
                <span>Question {progressLabel}</span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Score: {score}/{totalStages}
                </span>
              </div>

              <div className="text-center mb-10">
                <span className="inline-block py-1 px-3 rounded-full bg-violet-900/50 text-violet-300 text-xs font-bold uppercase tracking-wider mb-4 border border-violet-500/30">
                  Risk Assessment Scenario
                </span>
                <p className="text-white text-xl md:text-2xl font-bold leading-relaxed">
                  "{stage.prompt}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;

                  let baseStyle = "from-slate-800 to-slate-900 border-slate-700 hover:border-violet-500 hover:from-slate-800 hover:to-violet-900/40 text-slate-200";

                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "from-emerald-900/80 to-emerald-800 border-emerald-500 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-[1.02]"
                      : "from-rose-900/80 to-rose-800 border-rose-500 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.3)] scale-[1.02]";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    baseStyle = "from-emerald-900/30 to-slate-900 border-emerald-500/50 text-emerald-400/80 ring-1 ring-emerald-500/30 opacity-80";
                  } else if (selectedChoice) {
                    baseStyle = "from-slate-900 to-slate-900 border-slate-800 text-slate-600 opacity-40";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      className={`relative rounded-xl bg-gradient-to-r ${baseStyle} border-2 p-5 text-left font-medium transition-all duration-300 disabled:cursor-not-allowed`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? (option.isCorrect ? 'border-emerald-400 bg-emerald-500/20' : 'border-rose-400 bg-rose-500/20') : 'border-slate-600'}`}>
                          {isSelected && <div className={`w-2.5 h-2.5 rounded-full ${option.isCorrect ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>}
                        </div>
                        <div className="flex-1">
                          <span className="block text-lg">{option.text}</span>

                          <div className={`overflow-hidden transition-all duration-500 ${isSelected ? 'max-h-24 mt-3 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className={`text-sm font-semibold p-3 rounded-lg ${option.isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                              <span className="uppercase text-xs tracking-wider opacity-70 block mb-1">
                                {option.isCorrect ? '✅ Correct' : '❌ Incorrect'}
                              </span>
                              {option.outcome}
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedChoice && (
                <div className="flex justify-end mt-8">
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-lg shadow-lg shadow-violet-500/25 transition-all duration-300 hover:scale-105 hover:shadow-violet-500/40"
                  >
                    {currentStageIndex === totalStages - 1 ? "See Results" : "Next →"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default QuizClientReliance;
