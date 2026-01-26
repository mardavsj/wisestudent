import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "A bank asks for ID and address proof. Why?",
    options: [
      {
        id: "trouble",
        label: "To trouble customers",
        reflection: "Banks don't ask for documents just to inconvenience customers; there are important regulatory reasons behind these requirements.",
        isCorrect: false,
      },
      
      {
        id: "profit",
        label: "To generate revenue from document processing",
        reflection: "Banks don't profit from document verification; KYC is a regulatory requirement designed for security purposes.",
        isCorrect: false,
      },
      {
        id: "storage",
        label: "To store customer information",
        reflection: "While banks do store customer information, KYC specifically focuses on verifying identity and preventing fraud.",
        isCorrect: false,
      },
      {
        id: "kyc",
        label: "To verify identity and prevent fraud",
        reflection: "Exactly! KYC (Know Your Customer) procedures help banks verify identity and prevent fraudulent activities.",
        isCorrect: true,
      },
    ],
    reward: 5,
  },
  {
    id: 2,
    prompt: "What does KYC stand for?",
    options: [
      {
        id: "know",
        label: "Know Your Customer",
        reflection: "Exactly! KYC stands for Know Your Customer, a process to verify customer identity and assess risks.",
        isCorrect: true,
      },
      {
        id: "keep",
        label: "Keep Your Cash",
        reflection: "KYC is not about keeping your cash; it refers to Know Your Customer procedures.",
        isCorrect: false,
      },
      {
        id: "key",
        label: "Key to Your Credit",
        reflection: "KYC stands for Know Your Customer, not Key to Your Credit.",
        isCorrect: false,
      },
      {
        id: "credit-score",
        label: "Know Your Credit Score",
        reflection: "KYC stands for Know Your Customer, not Know Your Credit Score.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 3,
    prompt: "Which document is commonly required for KYC verification?",
    options: [
      
      {
        id: "receipt",
        label: "Receipts from recent purchases",
        reflection: "Receipts don't verify identity; official government-issued documents are required for KYC.",
        isCorrect: false,
      },
      {
        id: "passport",
        label: "Passport or government-issued ID",
        reflection: "Exactly! Government-issued IDs like passports, driver's licenses, or national ID cards are standard KYC documents.",
        isCorrect: true,
      },
      {
        id: "letter",
        label: "Letter from employer",
        reflection: "While employment letters might be requested for other purposes, official ID is what's required for KYC verification.",
        isCorrect: false,
      },
      {
        id: "photo",
        label: "Any photo with your face",
        reflection: "Photos alone aren't sufficient; official government-issued documents are required for KYC verification.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 4,
    prompt: "How does KYC protect customers?",
    options: [
      {
        id: "fees",
        label: "By reducing banking fees",
        reflection: "KYC doesn't directly reduce banking fees; its purpose is to prevent fraud and protect identities.",
        isCorrect: false,
      },
      
      {
        id: "speed",
        label: "By making transactions faster",
        reflection: "KYC might initially slow down account opening, but it protects against fraud in the long term.",
        isCorrect: false,
      },
      {
        id: "passport",
        label: "Passport or government-issued ID",
        reflection: "Exactly! Government-issued IDs like passports, driver's licenses, or national ID cards are standard KYC documents.",
        isCorrect: true,
      },
      {
        id: "credit",
        label: "By improving credit scores",
        reflection: "KYC doesn't directly improve credit scores; its purpose is identity verification and fraud prevention.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
  {
    id: 5,
    prompt: "What happens if someone opens an account with fake documents?",
    options: [
      {
        id: "benefit",
        label: "They get better banking services",
        reflection: "Using fake documents is illegal and results in serious consequences, not better services.",
        isCorrect: false,
      },
      {
        id: "risk",
        label: "It increases risk of fraud for everyone",
        reflection: "Exactly! Fake documents enable fraud, which increases costs and risks for the entire financial system.",
        isCorrect: true,
      },
      {
        id: "reward",
        label: "They receive rewards for creativity",
        reflection: "Using fake documents is a criminal offense with serious legal consequences, not a rewarded activity.",
        isCorrect: false,
      },
      {
        id: "access",
        label: "They gain easier access to loans",
        reflection: "Fake documents lead to legal issues and account closures, not easier loan access.",
        isCorrect: false,
      },
    ],
    reward: 5,
  },
];

const totalStages = STAGES.length;
const successThreshold = totalStages;

const KycBasics = () => {
  const location = useLocation();
  const gameId = "finance-adults-12";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const [stageIndex, setStageIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [coins, setCoins] = useState(0);
  const [history, setHistory] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedReflection, setSelectedReflection] = useState(null);
  const [canProceed, setCanProceed] = useState(false);

  const reflectionPrompts = useMemo(
    () => [
      "How does KYC protect both you and the financial system?",
      "What documents should you keep ready for banking procedures?",
    ],
    []
  );

  const handleSelect = (option) => {
    if (selectedOption || showResult) return;
    resetFeedback();
    const updatedHistory = [
      ...history,
      { stageId: STAGES[stageIndex].id, isCorrect: option.isCorrect },
    ];
    setHistory(updatedHistory);
    setSelectedOption(option.id);
    setSelectedReflection(option.reflection); // Set the reflection for the selected option
    setShowFeedback(true); // Show feedback after selection
    setCanProceed(false); // Disable proceeding initially
    
    // Update coins if the answer is correct
    if (option.isCorrect) {
      setCoins(prevCoins => prevCoins + 1);
    }
    
    // Wait for the reflection period before allowing to proceed
    setTimeout(() => {
      setCanProceed(true); // Enable proceeding after showing reflection
    }, 1500); // Wait 1.5 seconds before allowing to proceed
    
    // Handle the final stage separately
    if (stageIndex === totalStages - 1) {
      setTimeout(() => {
        const correctCount = updatedHistory.filter((item) => item.isCorrect).length;
        const passed = correctCount === successThreshold;
        setFinalScore(correctCount);
        setCoins(passed ? totalCoins : 0); // Set final coins based on performance
        setShowResult(true);
      }, 2500); // Wait longer before showing final results
    }
    
    const points = option.isCorrect ? 1 : 0;
    showCorrectAnswerFeedback(points, option.isCorrect);
  };

  const handleRetry = () => {
    resetFeedback();
    setStageIndex(0);
    setSelectedOption(null);
    setCoins(0);
    setHistory([]);
    setFinalScore(0);
    setShowResult(false);
  };

  const subtitle = `Stage ${Math.min(stageIndex + 1, totalStages)} of ${totalStages}`;
  const stage = STAGES[Math.min(stageIndex, totalStages - 1)];
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="KYC Basics"
      subtitle={subtitle}
      score={coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={totalStages}
      currentLevel={Math.min(stageIndex + 1, totalStages)}
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
            <span>Scenario</span>
            <span>KYC Verification</span>
          </div>
          <p className="text-lg text-white/90 mb-6">{stage.prompt}</p>
          <div className="grid grid-cols-2 gap-4">
            {stage.options.map((option) => {
              const isSelected = selectedOption === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option)}
                  disabled={!!selectedOption}
                  className={`rounded-2xl border-2 p-5 text-left transition ${
                    isSelected
                      ? option.isCorrect
                        ? "border-emerald-400 bg-emerald-500/20"
                        : "border-red-400 bg-red-500/10 text-white"
                        : "border-white/30 bg-white/5 hover:border-white/60 hover:bg-white/10"
                  }`}
                >
                  <div className="text-sm text-white/70 mb-2">
                    Choice {option.id.toUpperCase()}
                  </div>
                  <p className="text-white font-semibold">{option.label}</p>
                  
                </button>
              );
            })}
          </div>
          <div className="mt-6 text-right text-sm text-white/70">
            Coins collected: <strong>{coins}</strong>
          </div>
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
                      if (stageIndex < totalStages - 1) {
                        setStageIndex((prev) => prev + 1);
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
            {!showResult && stageIndex === totalStages - 1 && canProceed && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => {
                    const updatedHistory = [
                      ...history,
                      { stageId: STAGES[stageIndex].id, isCorrect: STAGES[stageIndex].options.find(opt => opt.id === selectedOption)?.isCorrect },
                    ];
                    const correctCount = updatedHistory.filter((item) => item.isCorrect).length;
                    const passed = correctCount === successThreshold;
                    setFinalScore(correctCount);
                    setCoins(passed ? totalCoins : 0);
                    setShowResult(true);
                  }}
                  className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-6 font-semibold shadow-lg hover:opacity-90"
                >
                  Finish
                </button>
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
                  {hasPassed ? (
                    <>
                      <strong>Congratulations!</strong> KYC helps protect both you and the financial system.
                    </>
                  ) : (
                    <>Skill unlocked: <strong>Understanding of KYC procedures</strong></>
                  )}
                </p>
                {!hasPassed && (
                  <p className="text-xs text-amber-300">
                    Answer every stage sharply to earn the full reward.
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
    </GameShell>
  );
};

export default KycBasics;