import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HealthyManTeenBadge = () => {
  const navigate = useNavigate();
  
  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-male-teen-70";

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
  {
    id: 1,
    title: "Identity & Strength",
    text: "Which behavior best reflects long-term inner strength in a man?",
    options: [
      {
        text: "Always appearing confident in public",
        emoji: "🎭",
        isCorrect: false
      },
      {
        text: "Adapting values when alone vs with peers",
        emoji: "🔄",
        isCorrect: false
      },
      {
        text: "Acting according to values even when unpopular",
        emoji: "🧭",
        isCorrect: true
      },
      {
        text: "Winning arguments to prove dominance",
        emoji: "🏆",
        isCorrect: false
      }
    ],
    feedback: {
      correct: "Yes. Integrity means consistency between values and actions, especially under pressure. This is a core marker of healthy masculinity.",
      wrong: "Confidence and dominance can be performative. True strength is value-driven behavior even when it costs social approval."
    }
  },
  {
    id: 2,
    title: "Emotional Intelligence",
    text: "What is the most emotionally intelligent response when you feel intense anger but lack clarity?",
    options: [
      {
        text: "Distract yourself until it fades",
        emoji: "📺",
        isCorrect: false
      },
      {
        text: "Pause, identify the emotion, then choose action",
        emoji: "🎭",
        isCorrect: true
      },
      {
        text: "Immediately confront the source",
        emoji: "⚡",
        isCorrect: false
      },
      
      {
        text: "Suppress it to avoid conflict",
        emoji: "🧱",
        isCorrect: false
      }
    ],
    feedback: {
      correct: "Correct. Naming emotions before acting reduces impulsive behavior and improves decision-making.",
      wrong: "Avoidance or impulsive reactions delay resolution. Emotional intelligence starts with awareness, not action."
    }
  },
  {
    id: 3,
    title: "Power & Respect",
    text: "Which situation shows misuse of power rather than leadership?",
    options: [
      {
        text: "Using fear to ensure obedience",
        emoji: "😨",
        isCorrect: true
      },
      {
        text: "Setting clear boundaries in a group",
        emoji: "🚧",
        isCorrect: false
      },
      {
        text: "Listening before making decisions",
        emoji: "👂",
        isCorrect: false
      },
      
      {
        text: "Taking responsibility for outcomes",
        emoji: "📦",
        isCorrect: false
      }
    ],
    feedback: {
      correct: "Yes. Fear-based control creates compliance, not respect, and reflects insecurity rather than strength.",
      wrong: "Leadership builds trust and accountability. Control through fear weakens relationships and character."
    }
  },
  {
    id: 4,
    title: "Conflict Ethics",
    text: "You are insulted publicly. Which response best preserves self-respect without escalating harm?",
    options: [
      {
        text: "Respond with a sharper insult",
        emoji: "🔥",
        isCorrect: false
      },
      {
        text: "Stay silent but resentful",
        emoji: "🫥",
        isCorrect: false
      },
      
      {
        text: "Gather friends to confront together",
        emoji: "👥",
        isCorrect: false
      },
      {
        text: "Address it calmly later or disengage",
        emoji: "🕊️",
        isCorrect: true
      },
    ],
    feedback: {
      correct: "Exactly. Self-respect is maintained by control, not retaliation. Timing and tone matter.",
      wrong: "Escalation or suppression both damage emotional health. Calm disengagement is a mature choice."
    }
  },
  {
    id: 5,
    title: "Relationships & Autonomy",
    text: "Which belief most strongly supports healthy relationships?",
    options: [
      {
        text: "Love requires sacrifice of personal boundaries",
        emoji: "🩸",
        isCorrect: false
      },
      {
        text: "Trust means constant access to each other",
        emoji: "📱",
        isCorrect: false
      },
      {
        text: "Both people remain independent and accountable",
        emoji: "⚖️",
        isCorrect: true
      },
      {
        text: "Jealousy proves emotional investment",
        emoji: "👁️",
        isCorrect: false
      }
    ],
    feedback: {
      correct: "Correct. Healthy relationships balance connection with independence and mutual respect.",
      wrong: "Control, jealousy, and boundary loss are warning signs, not proof of care."
    }
  }
];


  const handleChoice = (optionIndex) => {
    if (answered) return;

    setAnswered(true);
    setSelectedOptionIndex(optionIndex);
    resetFeedback();

    const selectedOption = questions[currentQuestion].options[optionIndex];
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    const isLastQuestion = currentQuestion === questions.length - 1;

    setTimeout(() => {
      if (isLastQuestion) {
        setGameFinished(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
        setSelectedOptionIndex(null);
      }
    }, 2000);
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setGameFinished(false);
    setSelectedOptionIndex(null);
    setScore(0);
    setAnswered(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/health-male/teens");
  };

  const currentQ = questions[currentQuestion];

  return (
    <GameShell
      title="Healthy Man Teen Badge"
      subtitle={gameFinished ? "Game Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="health-male"
      totalLevels={5}
      currentLevel={70}
      showConfetti={gameFinished && score >= 4}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={maxScore}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!gameFinished ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{maxScore}</span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2 text-center">
                {currentQ.title}
              </h2>
              
              <p className="text-xl text-white mb-8 text-center">
                {currentQ.text}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedOptionIndex === idx;
                  const showFeedback = answered;

                  let buttonClass = "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[60px] flex items-center justify-center gap-3";

                  if (showFeedback) {
                    if (isSelected) {
                      buttonClass = option.isCorrect
                        ? "bg-green-500 ring-4 ring-green-300 text-white p-6 rounded-2xl shadow-lg min-h-[60px] flex items-center justify-center gap-3"
                        : "bg-red-500 ring-4 ring-red-300 text-white p-6 rounded-2xl shadow-lg min-h-[60px] flex items-center justify-center gap-3";
                    } else {
                      buttonClass = "bg-white/10 opacity-50 text-white p-6 rounded-2xl shadow-lg min-h-[60px] flex items-center justify-center gap-3";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleChoice(idx)}
                      disabled={showFeedback}
                      className={buttonClass}
                    >
                      <span className="text-2xl">{option.emoji}</span>
                      <span className="font-bold text-lg">{option.text}</span>
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className={`mt-4 p-4 rounded-xl ${
                  currentQ.options[selectedOptionIndex]?.isCorrect
                    ? "bg-green-500/20 border border-green-500/30"
                    : "bg-red-500/20 border border-red-500/30"
                }`}>
                  <p className="text-white font-semibold">
                    {currentQ.options[selectedOptionIndex]?.isCorrect
                      ? currentQ.feedback.correct
                      : currentQ.feedback.wrong}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 4 ? (
              <div>
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-3xl font-bold text-white mb-4">Healthy Man Teen Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent knowledge about healthy masculinity with {score} correct answers out of {questions.length}!
                </p>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Healthy Man Teen</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Emotional Intelligence</h4>
                    <p className="text-white/90 text-sm">
                      You understand how to express emotions healthily and manage challenging feelings constructively.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Respectful Relationships</h4>
                    <p className="text-white/90 text-sm">
                      You know how to build and maintain healthy relationships based on mutual respect and trust.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Healthy Masculinity!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {questions.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review concepts of healthy masculinity to strengthen your knowledge and earn your badge.
                </p>
                <button
                  onClick={handleRetry}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default HealthyManTeenBadge;
