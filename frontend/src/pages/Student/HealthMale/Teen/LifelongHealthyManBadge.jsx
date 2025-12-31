import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const LifelongHealthyManBadge = () => {
  const location = useLocation();

  // Hardcode rewards
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [challenge, setChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const challenges = [
  {
    id: 1,
    title: "Daily Habits",
    question: "Which habit most consistently supports lifelong health?",
    options: [
      { text: "Skipping hygiene when busy", emoji: "🙅", isCorrect: false },
      { text: "Maintaining consistent hygiene & grooming", emoji: "🚿", isCorrect: true },
      { text: "Showering only on weekends", emoji: "🗓️", isCorrect: false },
      { text: "Using deodorant instead of bathing", emoji: "💨", isCorrect: false }
    ]
  },
  {
    id: 2,
    title: "Nutrition & Fitness",
    question: "What combination ensures sustainable physical health?",
    options: [
      { text: "Fast food & minimal movement", emoji: "🍔", isCorrect: false },
      { text: "Only exercising, ignoring diet", emoji: "🏋️", isCorrect: false },
      { text: "Balanced meals, regular exercise, and rest", emoji: "🥗", isCorrect: true },
      { text: "Skipping meals to lose weight quickly", emoji: "❌", isCorrect: false }
    ]
  },
  {
    id: 3,
    title: "Emotional Intelligence",
    question: "Which behavior demonstrates true emotional strength?",
    options: [
      { text: "Recognizing emotions and seeking support when needed", emoji: "🧠", isCorrect: true },
      { text: "Suppressing all feelings", emoji: "🤐", isCorrect: false },
      { text: "Pretending to be tough always", emoji: "💪", isCorrect: false },
      { text: "Ignoring stress until it goes away", emoji: "🙈", isCorrect: false }
    ]
  },
  {
    id: 4,
    title: "Decision Making",
    question: "Which reflects responsible, long-term decision making?",
    options: [
      { text: "Following friends blindly", emoji: "👥", isCorrect: false },
      { text: "Acting on impulse", emoji: "⚡", isCorrect: false },
      { text: "Ignoring potential outcomes", emoji: "🤷", isCorrect: false },
      { text: "Carefully evaluating pros, cons, and consequences", emoji: "⚖️", isCorrect: true }
    ]
  },
  {
    id: 5,
    title: "Lifelong Growth",
    question: "Which mindset is essential for lifelong personal development?",
    options: [
      { text: "Stopping learning after formal education", emoji: "🛑", isCorrect: false },
      { text: "Continuously learning and improving oneself", emoji: "📈", isCorrect: true },
      { text: "Remaining the same throughout life", emoji: "🗿", isCorrect: false },
      { text: "Avoiding new experiences or ideas", emoji: "🙉", isCorrect: false }
    ]
  }
];


  const handleAnswer = (isCorrect) => {
    if (answered) return;

    setAnswered(true);
    resetFeedback();

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    const isLastChallenge = challenge === challenges.length - 1;

    setTimeout(() => {
      if (isLastChallenge) {
        setShowResult(true);
      } else {
        setChallenge(prev => prev + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      }
    }, 2000);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setChallenge(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    resetFeedback();
  };

  return (
    <GameShell
      title="Badge: Lifelong Healthy Man"
      subtitle={!showResult ? `Challenge ${challenge + 1} of ${challenges.length}` : "Badge Complete!"}
      score={score}
      currentLevel={challenge + 1}
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={challenges.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId="health-male-teen-100"
      gameType="health-male"
      backPath="/games/health-male/teens"
    >
      <div className="space-y-8">
        {!showResult && challenges[challenge] ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Challenge {challenge + 1}/{challenges.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{challenges.length}</span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{challenges[challenge].title}</h3>
              <p className="text-white text-lg mb-6">
                {challenges[challenge].question}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {challenges[challenge].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedAnswer(idx);
                      handleAnswer(option.isCorrect);
                    }}
                    disabled={answered}
                    className={`p-6 rounded-2xl text-left transition-all transform ${answered
                      ? option.isCorrect
                        ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                        : selectedAnswer === idx
                          ? "bg-red-500/20 border-4 border-red-400 ring-4 ring-red-400"
                          : "bg-white/5 border-2 border-white/20 opacity-50"
                      : "bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-white/40 hover:scale-105"
                      } ${answered ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.emoji}</span>
                      <span className="text-white font-semibold">{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold text-white mb-4">Lifelong Healthy Man Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} challenges correct!
                  You have mastered the habits of a healthy man!
                </p>
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-4 inline-block mb-4">
                  <div className="text-white font-bold text-xl">LIFELONG HEALTHY MAN</div>
                </div>
                <p className="text-white/80">
                  Lesson: Commitment to hygiene, health, emotional intelligence, and growth is for life!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Growing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} challenges correct.
                  Review your healthy habits and try again!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: A healthy lifestyle is about consistent good choices in body, mind, and spirit!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default LifelongHealthyManBadge;
