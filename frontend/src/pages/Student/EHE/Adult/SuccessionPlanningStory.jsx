import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SUCCESSION_STAGES = [
  {
    id: 1,
    prompt: "Your business is highly successful, but you manage every critical operation yourself. What happens if you get sick or want to take a long vacation?",
    options: [
      {
        id: "opt2",
        text: "The business stalls, losing momentum and revenue due to lack of leadership",
        outcome: "Correct! If the business relies entirely on you, your absence becomes a single point of failure.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "The business continues running smoothly on its own",
        outcome: "Without trained leaders in your absence, operations will likely stall.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Customers will patiently wait until you return",
        outcome: "Customers expect consistent service; they will turn to competitors if you are unavailable.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "You realize the danger of being the sole operator. What is the most effective way to start preparing for business continuity?",
    options: [
      {
        id: "opt1",
        text: "Ignore the risk and just promise yourself to never miss a day of work",
        outcome: "This is unrealistic and leads to burnout, completely avoiding the structural problem.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Begin identifying and training key employees to handle critical daily operations",
        outcome: "Exactly! Developing a capable team is the first step in succession planning.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Hire an expensive consultant to run the company tomorrow",
        outcome: "Bringing in an outsider abruptly without transition planning often causes team friction and poor performance.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "One of your trained managers makes a minor mistake while covering for you. How should you respond to build a strong successor?",
    options: [
      
      {
        id: "opt2",
        text: "Immediately take back all their responsibilities so it doesn't happen again",
        outcome: "Revoking responsibility destroys confidence and ensures you remain the bottleneck.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Fire them publicly to set an example for the rest of the staff",
        outcome: "Creating a culture of fear prevents anyone from stepping up to lead.",
        isCorrect: false,
      },
      {
        id: "opt1",
        text: "Use it as a coaching moment to explain the correction and improve their judgement",
        outcome: "Spot on! Mistakes are necessary learning opportunities for future leaders.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 4,
    prompt: "Years later, you are preparing to retire. You have a capable leadership team in place. What is the final step in handing over the business?",
    options: [
      {
        id: "opt1",
        text: "Leave unannounced and let them figure out the financial and legal transition",
        outcome: "An abrupt, unplanned exit creates legal chaos and undermines the team's authority.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Establish a clear, legally documented transition timeline and step back gradually",
        outcome: "Perfect! A structured transition ensures stability for employees, clients, and your own peace of mind.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Sell the business to a random competitor without telling your team",
        outcome: "This betrays your team's loyalty and often destroys the value you built.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "Ultimately, what is the core purpose of succession planning in a mature business?",
    options: [
      {
        id: "opt1",
        text: "To ensure the business survives and thrives independently of the original founder",
        outcome: "Exactly! True business success is creating an entity that outlives your daily involvement.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "To train your employees hard so you can pay them less",
        outcome: "Well-trained leaders command higher compensation because they deliver higher value.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "To find someone to blame when profits eventually go down",
        outcome: "Leadership is about taking accountability, not setting up scapegoats.",
        isCorrect: false,
      },
    ],
  },
];

const SuccessionPlanningStory = () => {
  const location = useLocation();
  const gameId = "ehe-adults-72";
  const gameData = getGameDataById(gameId);
  const totalStages = SUCCESSION_STAGES.length;

  const totalCoins = gameData?.coins || location.state?.totalCoins || 15;
  const totalXp = gameData?.xp || location.state?.totalXp || 30;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const stage = SUCCESSION_STAGES[currentStageIndex];

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
      title="Succession Planning Story"
      subtitle={
        showResult
          ? "Well done! You learned how to secure the future of a business."
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
                  Business Choice
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

export default SuccessionPlanningStory;
