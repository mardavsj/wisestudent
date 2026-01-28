import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const choices = [
  {
    id: "a",
    title: "Continue engaging",
    outcome: "Stress continues.",
  },
  {
    id: "b",
    title: "Create healthy distance",
    outcome: "Emotional balance improves.",
  },
  {
    id: "c",
    title: "Cut off abruptly",
    outcome: "Guilt and conflict increase.",
  },
];

const MIN_CHARS = 10;

const ChoosingDistance = () => {
  const location = useLocation();
  const gameId = "brain-young-adult-50";
  const gameData = getGameDataById(gameId);

  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 10;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 10;
  const totalXp = gameData?.xp || location.state?.totalXp || 20;

  const [selectedChoice, setSelectedChoice] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);

  // 🔑 NEW STATES (important)
  const [outcomeSeen, setOutcomeSeen] = useState(false);
  const [showFirstReflection, setShowFirstReflection] = useState(false);
  const [showSecondReflection, setShowSecondReflection] = useState(false);
  const [firstReflectionText, setFirstReflectionText] = useState("");
  const [secondReflectionText, setSecondReflectionText] = useState("");
  const [firstReflectionCompleted, setFirstReflectionCompleted] = useState(false);
  const [secondReflectionCompleted, setSecondReflectionCompleted] = useState(false);
  const [skillUnlocked, setSkillUnlocked] = useState(false);

  const {
    flashPoints,
    showAnswerConfetti,
    showCorrectAnswerFeedback,
    resetFeedback,
  } = useGameFeedback();

  const handleChoice = (choice) => {
    if (selectedChoice) return;

    setSelectedChoice(choice.id);
    resetFeedback();

    setFeedback({ text: choice.outcome, success: true });
    setScore(1);
    showCorrectAnswerFeedback(1, true);

    // Move to outcome screen
    setOutcomeSeen(true);
  };

  const reflectionPrompts = useMemo(
    () => [
      "Which relationships drain energy?",
      "What does healthy distance mean?",
    ],
    []
  );

  const handleFirstReflectionContinue = () => {
    setFirstReflectionCompleted(true);
    setShowSecondReflection(true);
  };

  const handleSecondReflectionContinue = () => {
    setSecondReflectionCompleted(true);
    setTimeout(() => setSkillUnlocked(true), 500); // Small delay before skill unlock
  };

  useEffect(() => {
    if (skillUnlocked) {
      console.log("Skill unlocked: Relationship boundary awareness");
    }
  }, [skillUnlocked]);

  return (
    <GameShell
      title="Choosing Distance"
      subtitle={
        skillUnlocked
          ? "Insight unlocked"
          : showSecondReflection && !secondReflectionCompleted
            ? "Reflect on the next prompt"
            : showFirstReflection && !firstReflectionCompleted
              ? "Reflect on your response"
              : "Decide how to respond"
      }
      score={score}
      currentLevel={1}
      totalLevels={1}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="brain"
      showGameOver={skillUnlocked}
      maxScore={1}
      showConfetti={showAnswerConfetti}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-6 max-w-4xl mx-auto p-4">

        {/* Scenario */}
        <Section title="Scenario Setup">
          A relationship feels emotionally draining.
        </Section>

        {/* Trigger */}
        <Section title="Trigger / Stress Point">
          Repeated discomfort.
        </Section>

        {/* Decision */}
        <Section title="Decision Moment">
          The person must choose how to respond.
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {choices.map((choice) => (
              <button
                key={choice.id}
                disabled={!!selectedChoice}
                onClick={() => handleChoice(choice)}
                className={`rounded-2xl p-4 border ${
                  selectedChoice === choice.id
                    ? "border-green-400 bg-green-500/20"
                    : "border-white/20 bg-white/5"
                }`}
              >
                <div className="text-xs text-white/60 mb-1">
                  Choice {choice.id.toUpperCase()}
                </div>
                <p className="text-white">{choice.title}</p>
              </button>
            ))}
          </div>

        </Section>

        {/* Outcome - only shown after choice */}
        {outcomeSeen && !showFirstReflection && (
          <Section title="Outcome">
            <p className="text-white/90">{feedback?.text}</p>
            <button 
              onClick={() => {
                setShowFirstReflection(true);
              }}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Continue
            </button>
          </Section>
        )}
        
        {/* First Reflection - full screen */}
        {showFirstReflection && !firstReflectionCompleted && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-2xl">
              <Section title="Reflection Prompt">
                <p className="mb-2 text-white/80 text-sm">{reflectionPrompts[0]}</p>
                <textarea 
                  value={firstReflectionText}
                  onChange={(e) => setFirstReflectionText(e.target.value)}
                  placeholder="Write your reflection here..."
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 mt-2"
                  rows="6"
                />
                <div className="text-right text-xs text-white/60 mt-1">
                  {firstReflectionText.length}/{MIN_CHARS} characters
                </div>
                <button 
                  onClick={handleFirstReflectionContinue}
                  disabled={firstReflectionText.length < MIN_CHARS}
                  className={`mt-2 px-4 py-2 rounded-lg transition-colors ${
                    firstReflectionText.length >= MIN_CHARS 
                      ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer" 
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Continue
                </button>
              </Section>
            </div>
          </div>
        )}
        
        {/* Second Reflection - full screen */}
        {showSecondReflection && !secondReflectionCompleted && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-2xl">
              <Section title="Reflection Prompt">
                <p className="mb-2 text-white/80 text-sm">{reflectionPrompts[1]}</p>
                <textarea 
                  value={secondReflectionText}
                  onChange={(e) => setSecondReflectionText(e.target.value)}
                  placeholder="Write your reflection here..."
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 mt-2"
                  rows="6"
                />
                <div className="text-right text-xs text-white/60 mt-1">
                  {secondReflectionText.length}/{MIN_CHARS} characters
                </div>
                <button 
                  onClick={handleSecondReflectionContinue}
                  disabled={secondReflectionText.length < MIN_CHARS}
                  className={`mt-2 px-4 py-2 rounded-lg transition-colors ${
                    secondReflectionText.length >= MIN_CHARS 
                      ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer" 
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Continue
                </button>
              </Section>
            </div>
          </div>
        )}

        {/* Skill */}
        {skillUnlocked && (
          <Section title="Skill / Insight Unlocked">
            <strong>Relationship boundary awareness</strong>
          </Section>
        )}
      </div>
    </GameShell>
  );
};

const Section = ({ title, children }) => (
  <div className="bg-white/10 rounded-3xl p-6 border border-white/20">
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <div className="text-white/90 text-sm">{children}</div>
  </div>
);

export default ChoosingDistance;