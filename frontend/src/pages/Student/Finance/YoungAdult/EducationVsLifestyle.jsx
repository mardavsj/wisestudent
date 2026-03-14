import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const stages = [
  {
    id: 1,
    prompt: "You have limited money. Which should come first?",
    options: [
      {
        id: "gadgets",
        label: "New gadgets and electronics",
        reflection: "While gadgets provide temporary satisfaction, they depreciate quickly and don't increase your earning potential.",
        isCorrect: false,
      },
      
      {
        id: "clothes",
        label: "Latest fashion and clothing",
        reflection: "Fashion trends change rapidly and clothing purchases don't contribute to long-term financial growth.",
        isCorrect: false,
      },
      {
        id: "education",
        label: "Education or skill development",
        reflection: "Exactly! Education and skills create long-term value and increase your future income potential.",
        isCorrect: true,
      },
      {
        id: "entertainment",
        label: "Entertainment and social activities",
        reflection: "While social connections are valuable, entertainment spending doesn't build your professional capabilities.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 2,
    prompt: "How should you prioritize education spending?",
    options: [
      {
        id: "expensive",
        label: "Most expensive programs regardless of ROI",
        reflection: "High cost doesn't guarantee high return - research programs carefully for actual career advancement potential.",
        isCorrect: false,
      },
      {
        id: "value",
        label: "Highest value for career advancement",
        reflection: "Perfect! Focus on education that directly improves your marketability and earning potential.",
        isCorrect: true,
      },
      {
        id: "interest",
        label: "Whatever interests you most personally",
        reflection: "Personal interest matters, but consider how it translates to market demand and career opportunities.",
        isCorrect: false,
      },
      {
        id: "easy",
        label: "Easiest options to complete quickly",
        reflection: "Quick completion isn't valuable if the education doesn't enhance your professional skills meaningfully.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 3,
    prompt: "What's the best way to fund education with limited budget?",
    options: [
      {
        id: "combination",
        label: "Combination of savings, scholarships, part-time work",
        reflection: "Excellent! Diversified funding reduces debt burden and builds multiple valuable skills simultaneously.",
        isCorrect: true,
      },
      {
        id: "loans",
        label: "Take large education loans",
        reflection: "Large loans create long-term financial burden that can limit future opportunities and flexibility.",
        isCorrect: false,
      },
      
      {
        id: "postpone",
        label: "Postpone all education indefinitely",
        reflection: "Delaying education can mean missing crucial career development windows and falling behind professionally.",
        isCorrect: false,
      },
      {
        id: "family",
        label: "Rely entirely on family support",
        reflection: "Depending solely on others limits your financial independence and personal responsibility development.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
  {
    id: 4,
    prompt: "How do lifestyle choices affect education investment?",
    options: [
      
      {
        id: "balance",
        label: "Equal spending on both lifestyle and education",
        reflection: "Equal allocation may underfund education while still maintaining expensive lifestyle habits.",
        isCorrect: false,
      },
      {
        id: "lifestyle",
        label: "Prioritize lifestyle first, education later",
        reflection: "Delayed education investment often means missed opportunities and slower career advancement.",
        isCorrect: false,
      },
      {
        id: "neither",
        label: "Neither - focus on entertainment instead",
        reflection: "Entertainment spending provides temporary enjoyment but no long-term career or financial benefits.",
        isCorrect: false,
      },
      {
        id: "support",
        label: "Minimal lifestyle supports maximum education investment",
        reflection: "Exactly! Reducing lifestyle spending frees up resources for education that pays dividends over decades.",
        isCorrect: true,
      },
    ],
    reward: 10,
  },
  {
    id: 5,
    prompt: "What's the long-term impact of choosing education over lifestyle?",
    options: [
      {
        id: "restrictions",
        label: "Creates unnecessary restrictions now",
        reflection: "Short-term sacrifices for education typically lead to greater long-term financial freedom and choices.",
        isCorrect: false,
      },
      
      {
        id: "regret",
        label: "Leads to future regret about missed fun",
        reflection: "People typically regret missed educational opportunities more than lifestyle sacrifices made for growth.",
        isCorrect: false,
      },
      {
        id: "growth",
        label: "Builds career growth and higher future income",
        reflection: "Perfect! Education investments compound over time, creating exponentially greater earning potential.",
        isCorrect: true,
      },
      {
        id: "same",
        label: "Makes no real difference long-term",
        reflection: "Education consistently correlates with higher lifetime earnings and better career opportunities across industries.",
        isCorrect: false,
      },
    ],
    reward: 10,
  },
];

const EducationVsLifestyle = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  const gameId = "finance-young-adult-31";
  const gameContent = t("financial-literacy.young-adult.education-vs-lifestyle", { returnObjects: true });
  const stages = Array.isArray(gameContent?.stages) ? gameContent.stages : [];
  const totalStages = stages.length;
  const successThreshold = totalStages;
  const reflectionPrompts = Array.isArray(gameContent?.reflectionPrompts) ? gameContent.reflectionPrompts : [];
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 10;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 10;
  const totalXp = gameData?.xp || location.state?.totalXp || 20;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [history, setHistory] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedReflection, setSelectedReflection] = useState(null);
  const [canProceed, setCanProceed] = useState(false);
  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = stages[currentStage];
    const updatedHistory = [
      ...history,
      { stageId: currentStageData.id, isCorrect: option.isCorrect },
    ];
    setHistory(updatedHistory);
    setSelectedOption(option.id);
    setSelectedReflection(option.reflection);
    setShowFeedback(true);
    setCanProceed(false);
    
    if (option.isCorrect) {
      setCoins(prevCoins => prevCoins + 1);
    }
    
    setTimeout(() => {
      setCanProceed(true);
    }, 1500);
    
    if (currentStage === totalStages - 1) {
      setTimeout(() => {
        const correctCount = updatedHistory.filter((item) => item.isCorrect).length;
        const passed = correctCount === successThreshold;
        setFinalScore(correctCount);
        setCoins(passed ? totalCoins : 0);
        setShowResult(true);
      }, 5500);
    }
    
    if (option.isCorrect) {
      showCorrectAnswerFeedback(currentStageData.reward, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
  };

  const handleRetry = () => {
    resetFeedback();
    setCurrentStage(0);
    setHistory([]);
    setSelectedOption(null);
    setCoins(0);
    setFinalScore(0);
    setShowResult(false);
  };
  const subtitle = t("financial-literacy.young-adult.education-vs-lifestyle.subtitleProgress", {
    current: Math.min(currentStage + 1, totalStages),
    total: totalStages,
  });
  const stage = stages[Math.min(currentStage, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title={gameContent?.title}
      subtitle={subtitle}
      score={showResult ? finalScore : coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={totalStages}
      currentLevel={Math.min(currentStage + 1, totalStages)}
      totalLevels={totalStages}
      gameId={gameId}
      gameType="finance"
      showGameOver={showResult}
      showConfetti={showResult && hasPassed}
      shouldSubmitGameCompletion={hasPassed}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-5 text-white">
        <div className="bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4 text-sm uppercase tracking-[0.3em] text-white/60">
            <span>{gameContent?.scenarioLabel}</span>
            <span>{gameContent?.scenarioValue}</span>
          </div>
          <p className="text-lg text-white/90 mb-6">{stage?.prompt}</p>
          <div className="grid grid-cols-2 gap-4">
            {(stage?.options || []).map((option) => {
              const isSelected = selectedOption === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option)}
                  disabled={!!selectedOption}
                  className={`rounded-2xl border-2 p-5 text-left transition ${isSelected
                      ? option.isCorrect
                        ? "border-emerald-400 bg-emerald-500/20"
                        : "border-rose-400 bg-rose-500/10"
                      : "border-white/30 bg-white/5 hover:border-white/60 hover:bg-white/10"
                    }`}
                >
                  <div className="flex justify-between items-center mb-2 text-sm text-white/70">
                    <span>{t("financial-literacy.young-adult.education-vs-lifestyle.choiceLabel", { id: String(option.id || "").toUpperCase() })}</span>
                  </div>
                  <p className="text-white font-semibold">{option.label}</p>
                </button>
              );
            })}
          </div>
          {(showResult || showFeedback) && (
            <div className="bg-white/5 border border-white/20 rounded-3xl p-6 shadow-xl max-w-4xl mx-auto space-y-3">
              <h4 className="text-lg font-semibold text-white">{gameContent?.reflectionTitle}</h4>
              {selectedReflection && (
                <div className="max-h-24 overflow-y-auto pr-2">
                  <p className="text-sm text-white/90">{selectedReflection}</p>
                </div>
              )}
              {showFeedback && !showResult && (
                <div className="mt-4 flex justify-center">
                  {canProceed ? (
                    <button
                      onClick={() => {
                        if (currentStage < totalStages - 1) {
                          setCurrentStage((prev) => prev + 1);
                          setSelectedOption(null);
                          setSelectedReflection(null);
                          setShowFeedback(false);
                          setCanProceed(false);
                        }
                      }}
                      className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-6 font-semibold shadow-lg hover:opacity-90"
                    >
                      Continue
                    </button>
                  ) : (
                    <div className="py-2 px-6 text-white font-semibold">{gameContent?.readingLabel}</div>
                  )}
                </div>
              )}
              {!showResult && currentStage === totalStages - 1 && canProceed && (
                <div className="mt-4 flex justify-center">
                  
                </div>
              )}
              {showResult && (
                <>
                  <ul className="text-sm list-disc list-inside space-y-1">
                    {reflectionPrompts.map((prompt) => (
                      <li key={prompt}>{prompt}</li>
                    ))}
                  </ul>
                  <p className="text-sm text-white/70">
                    {gameContent?.skillUnlockedLabel} <strong>{gameContent?.skillName}</strong>
                  </p>
                  {!hasPassed && (
                    <p className="text-xs text-amber-300">
                      {t("financial-literacy.young-adult.education-vs-lifestyle.fullRewardHint", { total: totalStages })}
                    </p>
                  )}
                  {!hasPassed && (
                    <button
                      onClick={handleRetry}
                      className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 font-semibold shadow-lg hover:opacity-90"
                    >
                      Try Again
                    </button>
                  )}
                </>
              )}
            </div>
          )}
         
        </div>
        {showResult && (
          <div className="bg-white/5 border border-white/20 rounded-3xl p-6 shadow-xl max-w-4xl mx-auto space-y-3">
            <h4 className="text-lg font-semibold text-white">{gameContent?.reflectionPromptsTitle}</h4>
            <ul className="text-sm list-disc list-inside space-y-1">
              {reflectionPrompts.map((prompt) => (
                <li key={prompt}>{prompt}</li>
              ))}
            </ul>
            <p className="text-sm text-white/70">
              {gameContent?.skillUnlockedLabel} <strong>{gameContent?.skillName}</strong>
            </p>
            {!hasPassed && (
              <p className="text-xs text-amber-300">
                {t("financial-literacy.young-adult.education-vs-lifestyle.fullRewardHint", { total: totalStages })}
              </p>
            )}
            {!hasPassed && (
              <button
                onClick={handleRetry}
                className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 font-semibold shadow-lg hover:opacity-90"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EducationVsLifestyle;