import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FAKE_JOB_OFFER_STAGES = [
  {
    id: 1,
    prompt: "A job promises high pay with upfront registration fees. What does this indicate?",
    options: [
      {
        id: "a",
        label: "Genuine opportunity",
        reflection: "Genuine employers don't require upfront fees from job applicants. They invest in their employees, not the other way around. This is a major red flag for scams.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "Standard industry practice",
        reflection: "While some industries may have legitimate fees (like licensing), reputable employers typically cover these costs or pay them directly, not require upfront payment from applicants.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Sign of a competitive position",
        reflection: "High pay alone doesn't justify upfront fees. Legitimate high-paying positions are typically offered by established companies with clear hiring processes that don't involve applicant payments.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Likely scam",
        reflection: "Exactly! Legitimate jobs don't ask for money. This is one of the most common warning signs of employment scams designed to steal your money or personal information.",
        isCorrect: true,
      },
    ],
    reward: 20,
  },
  {
    id: 2,
    prompt: "What should you do if a job asks for personal documents early in the process?",
    options: [
      {
        id: "a",
        label: "Send everything immediately to secure the position",
        reflection: "Sending personal documents immediately, especially to unverified employers, puts you at risk for identity theft and document fraud. Legitimate employers follow proper verification procedures.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "Only send documents you can easily replace",
        reflection: "Even documents you can replace can be used for identity theft or fraudulent activities. It's better to verify the employer's legitimacy before sharing any sensitive information.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Verify the company's legitimacy first",
        reflection: "Perfect! Always research the company through official channels, check their business registration, and verify contact information before sharing any personal documents.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "Ask for a copy of their business license instead",
        reflection: "While asking for their credentials is reasonable, scammers can easily provide fake documents. Independent verification through official sources is more reliable than exchanging documents.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 3,
    prompt: "Which is a warning sign of a fake job offer?",
    options: [
      {
        id: "a",
        label: "Professional email address and company website",
        reflection: "Professional appearance can be easily faked by scammers. Don't rely solely on surface-level professionalism to determine legitimacy.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Immediate job offer without interview",
        reflection: "Exactly! Legitimate employers typically conduct interviews and follow established hiring processes. Immediate offers without proper evaluation are major red flags.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Clear job description and responsibilities",
        reflection: "Clear job descriptions are actually a positive sign, but they can also be included in fake offers to appear legitimate. Look for other warning signs in combination.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Multiple communication channels available",
        reflection: "Having multiple ways to contact a company can be legitimate, but scammers also provide various contact methods to appear more credible. Verify through independent research.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 4,
    prompt: "How can you research a company's legitimacy?",
    options: [
      {
        id: "a",
        label: "Check business registration and reviews independently",
        reflection: "Perfect! Verify through official business registries, check reviews on multiple platforms, and look for consistent information across different sources to confirm legitimacy.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Trust their social media presence alone",
        reflection: "Social media profiles can be easily created and manipulated by scammers. They're not reliable indicators of a company's legitimacy on their own.",
        isCorrect: false,
      },
      
      {
        id: "c",
        label: "Ask the company for references",
        reflection: "While asking for references is reasonable, scammers can provide fake references. Independent verification through official sources is more reliable than company-provided references.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Look at their office photos online",
        reflection: "Office photos can be easily staged or stolen from other companies. They don't provide reliable proof of a company's legitimacy or operations.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 5,
    prompt: "What's the safest approach to online job applications?",
    options: [
      {
        id: "a",
        label: "Apply to every opportunity you see",
        reflection: "Applying to every opportunity without proper research puts you at risk for scams and wastes your time on illegitimate positions. Quality over quantity is key.",
        isCorrect: false,
      },
     
      {
        id: "b",
        label: "Only apply through job boards you trust",
        reflection: "While trusted job boards are generally safer, even reputable platforms can occasionally host fake listings. Always verify the company independently regardless of the platform.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Focus only on high-paying positions",
        reflection: "Focusing solely on high pay can make you vulnerable to scams that promise unrealistic compensation. Consider the legitimacy and fit of positions, not just the salary.",
        isCorrect: false,
      },
       {
        id: "d",
        label: "Research thoroughly and verify legitimacy",
        reflection: "Exactly! Taking time to research companies, verify their legitimacy, and understand the hiring process protects you from scams and helps you find genuine opportunities.",
        isCorrect: true,
      },
    ],
    reward: 20,
  },
];

const FakeJobOffer = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  const gameId = "finance-young-adult-82";
  const gameContent = t(
    "financial-literacy.young-adult.fake-job-offer",
    { returnObjects: true }
  );
  const stages = Array.isArray(gameContent?.stages) ? gameContent.stages : [];
  const totalStages = stages.length;
  const successThreshold = totalStages;
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 20;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 20;
  const totalXp = gameData?.xp || location.state?.totalXp || 40;
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

  const reflectionPrompts = Array.isArray(gameContent?.reflectionPrompts)
    ? gameContent.reflectionPrompts
    : [];

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
    
    // Update coins if the answer is correct
    if (option.isCorrect) {
      setCoins(prevCoins => prevCoins + 1);
    }
    
    // Wait for the reflection period before allowing to proceed
    setTimeout(() => {
      setCanProceed(true);
    }, 1500);
    
    // Handle the final stage separately
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

  const subtitle =
    gameContent?.subtitleProgress
      ?.replace("{{current}}", Math.min(currentStage + 1, totalStages || 1))
      ?.replace("{{total}}", totalStages || 1) ||
    `Stage ${Math.min(currentStage + 1, totalStages || 1)} of ${totalStages || 1}`;
  const stage =
    stages.length > 0
      ? stages[Math.min(currentStage, stages.length - 1)]
      : null;
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Fake Job Offer"
      subtitle={subtitle}
      score={showResult ? finalScore : coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={FAKE_JOB_OFFER_STAGES.length}
      currentLevel={Math.min(currentStage + 1, FAKE_JOB_OFFER_STAGES.length)}
      totalLevels={FAKE_JOB_OFFER_STAGES.length}
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
            <span>Scenario</span>
            <span>Fake Job Offer</span>
          </div>
          <p className="text-lg text-white/90 mb-6">{stage.prompt}</p>
          <div className="grid grid-cols-2 gap-4">
            {stage.options.map((option) => {
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
                    <span>Choice {option.id.toUpperCase()}</span>
                  </div>
                  <p className="text-white font-semibold">{option.label}</p>
                </button>
              );
            })}
          </div>
          {(showResult || showFeedback) && (
            <div className="bg-white/5 border border-white/20 rounded-3xl p-6 shadow-xl max-w-4xl mx-auto space-y-3">
              <h4 className="text-lg font-semibold text-white">Reflection</h4>
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
                    <div className="py-2 px-6 text-white font-semibold">Reading...</div>
                  )}
                </div>
              )}
              {/* Automatically advance if we're in the last stage and the timeout has passed */}
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
                    Skill unlocked: <strong>Job offer verification</strong>
                  </p>
                  {!hasPassed && (
                    <p className="text-xs text-amber-300">
                      Answer all {totalStages} choices correctly to earn the full reward.
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
            <h4 className="text-lg font-semibold text-white">Reflection Prompts</h4>
            <ul className="text-sm list-disc list-inside space-y-1">
              {reflectionPrompts.map((prompt) => (
                <li key={prompt}>{prompt}</li>
              ))}
            </ul>
            <p className="text-sm text-white/70">
              Skill unlocked: <strong>Job offer verification</strong>
            </p>
            {!hasPassed && (
              <p className="text-xs text-amber-300">
                Answer all {totalStages} choices correctly to earn the full reward.
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

export default FakeJobOffer;