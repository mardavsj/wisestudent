import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const INDUSTRY_CERTIFICATION_STAGES = [
  {
    id: 1,
    prompt: "You are thinking of delaying your certification until after graduation. What is the actual advantage of early certification?",
    options: [
      {
        id: "opt1",
        text: "You pay higher tuition fees",
        outcome: "Certifications usually cost money, but they don't increase your university tuition.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Competitive advantage during placements",
        outcome: "Correct! Having a recognized certification before graduation makes you stand out to recruiters immediately.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "It guarantees you a salary of $100k",
        outcome: "No single certification guarantees a specific salary; it just improves your odds of getting hired.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "How do employers view recognized industry certifications compared to just listing standard college courses on a resume?",
    options: [
      {
        id: "opt1",
        text: "They prefer college courses because they take longer",
        outcome: "Length of study matters less than practical, verified, up-to-date skills.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "They ignore certifications completely",
        outcome: "In many tech, finance, and specialized fields, certifications are often mandatory filters.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "As proof of practical, standardized, and up-to-date skills",
        outcome: "Exactly! Certifications prove you meet a specific, current industry standard that textbooks might miss.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 3,
    prompt: "You want to learn Cloud Computing. Which certification path is the smartest investment?",
    options: [
      {
        id: "opt1",
        text: "A highly-rated, globally recognized provider (e.g., AWS, Azure)",
        outcome: "Correct! Brand recognition matters. Employers look for standard certs they already trust.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "A random, free certificate from an unknown website",
        outcome: "Free knowledge is great, but unknown certificates carry no weight on a resume.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Buying a certificate without taking the exam",
        outcome: "This is fraud. It will get you fired immediately when you can't perform the work.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "What is the biggest mistake students make when collecting certifications?",
    options: [
    
      {
        id: "opt2",
        text: "Only getting one highly relevant certification",
        outcome: "One deep, relevant certification is often better than many shallow, unrelated ones.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Putting them on their LinkedIn profile",
        outcome: "You absolutely should put valid certifications on your professional profiles.",
        isCorrect: false,
      },
        {
        id: "opt1",
        text: "Collecting multiple unrelated certs without actually building projects applying those skills",
        outcome: "Spot on! 10 random certs without a portfolio of real work looks like a lack of focus.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 5,
    prompt: "If a certification requires renewal every 2 years, what does this signal to employers?",
    options: [
      {
        id: "opt1",
        text: "That the certifying company just wants more money",
        outcome: "While there is a cost, the primary reason is to ensure practitioners stay current.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "That the field changes rapidly, and you are committed to staying updated",
        outcome: "Correct! Renewals prove you have the most current knowledge in a fast-moving industry.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "That the knowledge expires and becomes totally useless",
        outcome: "Core concepts remain, but tools evolve rapidly.",
        isCorrect: false,
      },
      
    ],
  },
];

const QuizIndustryCertification = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-73";
  const gameData = getGameDataById(gameId);
  const totalStages = INDUSTRY_CERTIFICATION_STAGES.length;

  const totalCoins = gameData?.coins || location.state?.totalCoins || 15;
  const totalXp = gameData?.xp || location.state?.totalXp || 30;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const stage = INDUSTRY_CERTIFICATION_STAGES[currentStageIndex];

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
      title="Quiz: Industry Certification"
      subtitle={
        showResult
          ? "Well done! You know how to leverage certifications for your career."
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
                  Career Prep Check
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

export default QuizIndustryCertification;
