import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FAKE_PAYMENT_SCREENSHOT_STAGES = [
  {
    id: 1,
    prompt: "A buyer shows a payment screenshot but money isn’t credited. What should you trust?",
    options: [
      {
        id: "a",
        label: "Screenshot",
        reflection: "Screenshots can be easily faked or manipulated to show false information. They provide no real proof of payment and can be used to scam sellers by making them believe they've been paid when they haven't.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Bank confirmation only",
        reflection: "Exactly! Only bank confirmation through official channels like your online banking app, SMS notifications from your bank, or statements from your payment app provides real proof of payment. Always verify through trusted sources before shipping products.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Both the screenshot and your intuition",
        reflection: "While trusting your intuition is good, combining it with an unreliable screenshot doesn't increase the validity of the payment verification. The screenshot is what scammers primarily rely on to fool sellers, so don't use it for payment confirmation.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "The buyer's assurance they sent money",
        reflection: "Assurance alone without real confirmation of payment should not be sufficient proof to verify payments. Trusted people make payment errors as well. Additionally, communication intercept is now really easy to handle messages verification.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 2,
    prompt: "Which of the following should prompt you to verify payment immediately?",
    options: [
      {
        id: "a",
        label: "Screenshot of payment with no bank confirmation",
        reflection: "Exactly! A payment screenshot without bank confirmation is a major red flag. Screenshots can be easily faked, and the absence of official bank confirmation means the payment may not have actually gone through.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Notifications in digital payment mode",
        reflection: "Received digitally instantly transfers aren't real paid while still receive other receipts. It's important to confirm the payment status through official verification channels.",
        isCorrect: false,
      },
      
      {
        id: "c",
        label: "The buyer's message saying payment is done",
        reflection: "While a buyer's message can be a good indicator, it's not sufficient proof of payment. Messages can be misleading or the buyer might genuinely believe they've sent the payment when there was an error in the process.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "A photo of the buyer with their phone",
        reflection: "A photo of the buyer with their phone doesn't provide any proof of payment. It's irrelevant to verifying whether a transaction has actually been completed and the money has been transferred to your account.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 3,
    prompt: "What's the best way to verify payment for online transactions?",
    options: [
      
      {
        id: "a",
        label: "Ask the buyer to send another screenshot",
        reflection: "Asking for another screenshot doesn't solve the verification problem, as the new screenshot can also be fake. The issue is with relying on screenshots in general, not the number of screenshots provided.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Trust the buyer's word that they paid",
        reflection: "Trusting the buyer's word alone is risky, especially in online transactions where you can't physically verify the payment. Even honest buyers can make mistakes or have technical issues with their payments.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Wait for the buyer to complain about not receiving the item",
        reflection: "Waiting for complaints is a reactive approach that can lead to disputes and potential losses. Proactive verification of payment before shipping is always the safer and more professional approach.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Check your bank app or payment platform",
        reflection: "Exactly! Checking your bank app, payment platform (like PayPal, Venmo, or your bank's mobile app) directly is the most reliable way to verify payment. These platforms provide real-time, official confirmation of transactions.",
        isCorrect: true,
      },
    ],
    reward: 20,
  },
  {
    id: 4,
    prompt: "What should you do if a buyer only provides a payment screenshot?",
    options: [
      {
        id: "a",
        label: "Ship the item immediately to build trust",
        reflection: "Shipping immediately based only on a screenshot is extremely risky and can lead to financial loss. Building trust is important, but not at the expense of verifying actual payment receipt.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "Accept the screenshot but ask for a small additional payment",
        reflection: "Asking for additional payment doesn't address the core issue of verifying the original payment. It can also create confusion and may not prevent losses if the initial payment was fake.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Request official bank confirmation before shipping",
        reflection: "Exactly! Requesting official bank confirmation before shipping is the safest approach. This protects you from potential scams and ensures you only ship items after receiving verified payment.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "Ignore the transaction and move on",
        reflection: "Ignoring the transaction entirely might cause you to miss legitimate sales opportunities. The better approach is to establish clear verification procedures that protect both you and legitimate buyers.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 5,
    prompt: "Which scenario represents a common payment scam tactic?",
    options: [
      {
        id: "a",
        label: "Buyer sends payment confirmation from bank app",
        reflection: "A payment confirmation from a legitimate bank app is generally reliable proof of payment. This represents proper verification, not a scam tactic.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Buyer shows screenshot of payment but no bank record",
        reflection: "Exactly! This is a common scam tactic where fraudsters show fake or manipulated screenshots to convince sellers they've been paid. The absence of bank records is a key indicator that the payment may not be real.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Buyer provides both screenshot and bank confirmation",
        reflection: "Providing both screenshot and bank confirmation actually strengthens the legitimacy of the payment. While you should still verify independently, this combination is generally more trustworthy than screenshot alone.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Buyer calls to confirm payment verbally",
        reflection: "While a phone call can provide additional communication, verbal confirmation alone isn't sufficient proof of payment. The key is still verifying through official banking channels, regardless of additional communication methods.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
];

const FakePaymentScreenshot = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  const gameId = "finance-young-adult-85";
  const gameContent = t(
    "financial-literacy.young-adult.fake-payment-screenshot",
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
      title="Fake Payment Screenshot"
      subtitle={subtitle}
      score={showResult ? finalScore : coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={FAKE_PAYMENT_SCREENSHOT_STAGES.length}
      currentLevel={Math.min(currentStage + 1, FAKE_PAYMENT_SCREENSHOT_STAGES.length)}
      totalLevels={FAKE_PAYMENT_SCREENSHOT_STAGES.length}
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
            <span>Fake Payment Screenshot</span>
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
                    Skill unlocked: <strong>Payment verification</strong>
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
              Skill unlocked: <strong>Payment verification</strong>
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

export default FakePaymentScreenshot;