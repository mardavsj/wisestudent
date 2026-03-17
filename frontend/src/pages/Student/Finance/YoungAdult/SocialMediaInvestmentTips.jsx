import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SOCIAL_MEDIA_INVESTMENT_TIPS_STAGES = [
  {
    id: 1,
    prompt: "Influencers promise “sure-shot returns.” What’s the safest response?",
    options: [
      {
        id: "a",
        label: "Follow blindly",
        reflection: "Following investment advice blindly, especially from social media influencers, is extremely risky. Even well-intentioned influencers may not have your best interests at heart or the proper qualifications to give financial advice.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Be cautious and research independently",
        reflection: "Exactly! Social media investment tips often hide risks and may not be suitable for your financial situation. Always research independently, understand the risks, and consult qualified financial advisors before making investment decisions.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Follow only if they have many followers",
        reflection: "The number of followers doesn't guarantee the quality or legitimacy of investment advice. Popular influencers can still provide poor financial guidance or promote scams to their large audiences.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Ask friends who follow them for advice",
        reflection: "While friends' opinions can be valuable, they're not financial experts. Relying on secondhand advice from social media influencers, even through friends, doesn't replace proper research and professional financial guidance.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 2,
    prompt: "What should you be most cautious about with social media investment tips?",
    options: [
      {
        id: "a",
        label: "Hidden risks and lack of regulation",
        reflection: "Perfect! Social media investment tips often lack proper disclosure of risks, may not be regulated, and can be biased or misleading. The informal nature of social media makes it easy for important information to be omitted or misrepresented.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "The influencer's communication style",
        reflection: "While communication style can be important, it's not the primary concern with social media investment tips. The content and legitimacy of the advice itself should be your main focus when evaluating investment suggestions.",
        isCorrect: false,
      },
      
      {
        id: "c",
        label: "The platform they use to share tips",
        reflection: "While the platform can affect how information is presented, the core issue with social media investment tips is the content itself - the lack of proper risk disclosure, potential bias, and absence of regulatory oversight.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Their posting frequency",
        reflection: "Posting frequency doesn't determine the quality or reliability of investment advice. Some of the best financial advice comes from infrequent but well-researched sources, while frequent posting can sometimes indicate low-quality content.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 3,
    prompt: "How can you verify the credibility of investment advice from social media?",
    options: [
      
      {
        id: "a",
        label: "See if their tips have worked for others",
        reflection: "Past performance or testimonials from others don't guarantee future results or the legitimacy of advice. Individual experiences can be cherry-picked or fabricated, making them unreliable indicators of advice quality.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Check if they have professional certifications",
        reflection: "Exactly! Look for proper financial certifications, regulatory registrations, and professional credentials. Legitimate financial advisors will have verifiable qualifications and be registered with appropriate regulatory bodies.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Trust them if they seem confident",
        reflection: "Confidence doesn't equal competence or honesty. Scammers and unqualified individuals can appear very confident while providing poor or fraudulent advice. Focus on credentials and track record rather than presentation style.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Follow their advice on a small scale first",
        reflection: "While starting small can limit potential losses, it doesn't validate the quality of advice. Even small-scale following of poor advice can lead to losses and establish risky investment habits that could be costly later.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 4,
    prompt: "What's a red flag when evaluating social media investment advice?",
    options: [
      {
        id: "a",
        label: "They provide detailed risk disclosures",
        reflection: "Detailed risk disclosures are actually a positive sign of responsible financial advice. Legitimate advisors are required to disclose potential risks and conflicts of interest to their clients.",
        isCorrect: false,
      },
     
      {
        id: "b",
        label: "They explain the investment strategy clearly",
        reflection: "Clear explanations of investment strategies are generally positive, as they help you understand what you're investing in. However, clarity alone doesn't guarantee the legitimacy or suitability of the advice.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "They have a professional-looking profile",
        reflection: "Professional appearance can be easily faked and doesn't indicate the quality or legitimacy of financial advice. Focus on credentials, track record, and proper risk disclosure rather than surface-level presentation.",
        isCorrect: false,
      },
       {
        id: "d",
        label: "Promises of guaranteed returns",
        reflection: "Exactly! Promises of guaranteed returns are a major red flag in investing. All investments carry risk, and anyone claiming guaranteed returns is either misleading or running a scam. Legitimate financial advice acknowledges and explains risks.",
        isCorrect: true,
      },
    ],
    reward: 20,
  },
  {
    id: 5,
    prompt: "What's the best approach to social media investment content?",
    options: [
      {
        id: "a",
        label: "Treat it as entertainment only",
        reflection: "While treating it as pure entertainment might prevent you from acting on poor advice, it's better to use social media investment content as a starting point for your own research rather than dismissing it entirely.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "Follow advice from multiple influencers",
        reflection: "Following advice from multiple influencers doesn't necessarily improve the quality of your decisions. If multiple influencers are promoting the same poor ideas or scams, you're still making risky choices. Quality research is better than quantity of sources.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Use it as a research starting point",
        reflection: "Perfect! Social media can be a useful source of investment ideas and market awareness, but it should always be your starting point for further research, not the end of your decision-making process. Verify information through multiple reliable sources.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "Ignore it completely",
        reflection: "Completely ignoring social media investment content might cause you to miss legitimate opportunities or important market information. A balanced approach that uses it as one of many research sources is more practical and beneficial.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
];

const SocialMediaInvestmentTips = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  const gameId = "finance-young-adult-84";
  const gameContent = t(
    "financial-literacy.young-adult.social-media-investment-tips",
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
      title="Social Media Investment Tips"
      subtitle={subtitle}
      score={showResult ? finalScore : coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={SOCIAL_MEDIA_INVESTMENT_TIPS_STAGES.length}
      currentLevel={Math.min(currentStage + 1, SOCIAL_MEDIA_INVESTMENT_TIPS_STAGES.length)}
      totalLevels={SOCIAL_MEDIA_INVESTMENT_TIPS_STAGES.length}
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
            <span>Social Media Investment Tips</span>
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
                    Skill unlocked: <strong>Investment advice evaluation</strong>
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
              Skill unlocked: <strong>Investment advice evaluation</strong>
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

export default SocialMediaInvestmentTips;