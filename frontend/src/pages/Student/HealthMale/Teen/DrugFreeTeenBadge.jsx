import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { Award, Shield, Heart, ThumbsUp, Star } from "lucide-react";

const DrugFreeTeenBadge = () => {
  const navigate = useNavigate();
  
  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-male-teen-90";

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
  {
    id: 1,
    icon: <Shield className="w-12 h-12 text-blue-400" />,
    title: "Refusal Skills",
    text: "Someone at a party keeps offering you drugs and insists 'Just this once'. What's the smartest response?",
    options: [
      { text: "Politely but firmly say 'No' and leave if pressured", emoji: "✋", isCorrect: true },
      { text: "Say 'Maybe later' to avoid conflict", emoji: "⏰", isCorrect: false },
      { text: "Take it secretly to see what happens", emoji: "🤫", isCorrect: false },
      { text: "Ignore them and hope they stop", emoji: "🙈", isCorrect: false }
    ],
    feedback: {
      correct: "Correct! Being assertive and removing yourself from pressure is the safest approach.",
      wrong: "The best way is to clearly refuse and exit the situation if the pressure continues."
    }
  },
  {
    id: 2,
    icon: <Heart className="w-12 h-12 text-red-400" />,
    title: "Brain & Body Impact",
    text: "Why are drugs particularly risky for teens, even if friends say they 'help you relax'?",
    options: [
      { text: "They are expensive and addictive", emoji: "💸", isCorrect: false },
      { text: "They interfere with developing brain pathways and decision-making", emoji: "🧠", isCorrect: true },
      { text: "They make you sleepy", emoji: "😴", isCorrect: false },
      { text: "They taste bad", emoji: "🤢", isCorrect: false }
    ],
    feedback: {
      correct: "Exactly! Drugs can alter brain development, affecting learning, memory, and impulse control.",
      wrong: "During adolescence, the brain is still developing, so drugs can cause long-term cognitive and emotional issues."
    }
  },
  {
    id: 3,
    icon: <ThumbsUp className="w-12 h-12 text-green-400" />,
    title: "Smart Alternatives",
    text: "You feel stressed and your peers suggest using substances. Which choice builds resilience instead?",
    options: [
      { text: "Sleep excessively to escape stress", emoji: "🛌", isCorrect: false },
      { text: "Skip school or responsibilities", emoji: "🚫", isCorrect: false },
      { text: "Engage in sports, arts, or hobbies", emoji: "⚽", isCorrect: true },
      { text: "Spend money recklessly to feel better", emoji: "💰", isCorrect: false }
    ],
    feedback: {
      correct: "Yes! Positive activities improve mood, skills, and social connections safely.",
      wrong: "Constructive activities like sports, arts, or hobbies help you cope without harming your health."
    }
  },
  {
    id: 4,
    icon: <Star className="w-12 h-12 text-yellow-400" />,
    title: "Future Planning",
    text: "Choosing to stay drug-free affects your future by:",
    options: [
      { text: "Not making a difference", emoji: "🤷", isCorrect: false },
      { text: "Protecting health, relationships, and opportunities", emoji: "🛡️", isCorrect: true },
      { text: "Making life boring and isolated", emoji: "😴", isCorrect: false },
      { text: "Other people won’t notice anyway", emoji: "😑", isCorrect: false }
    ],
    feedback: {
      correct: "Correct! Staying drug-free supports your long-term goals and well-being.",
      wrong: "Avoiding substances preserves health, learning ability, and opens up life opportunities."
    }
  },
  {
    id: 5,
    icon: <Award className="w-12 h-12 text-purple-400" />,
    title: "Trusted Support",
    text: "If you feel pressured by peers to use substances, who is the most reliable to approach?",
    options: [
      { text: "Strangers online", emoji: "🖥️", isCorrect: false },
      { text: "Nobody, handle it alone", emoji: "😶", isCorrect: false },
      { text: "Parents, guardians, or trusted adults", emoji: "👨‍👩‍👧‍👦", isCorrect: true },
      { text: "Friends who also use substances", emoji: "👥", isCorrect: false }
    ],
    feedback: {
      correct: "Exactly! Trusted adults provide guidance, safety, and strategies to resist peer pressure.",
      wrong: "The safest approach is to reach out to parents, counselors, or other trusted adults for support."
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
      title="Drug-Free Teen Badge"
      subtitle={gameFinished ? "Game Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="health-male"
      totalLevels={5}
      currentLevel={90}
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

              <div className="flex justify-center mb-4">
                {currentQ.icon}
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
                <h3 className="text-3xl font-bold text-white mb-4">Drug-Free Teen Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent knowledge about staying drug-free with {score} correct answers out of {questions.length}!
                </p>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Drug-Free Teen</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Decision Making</h4>
                    <p className="text-white/90 text-sm">
                      You understand how to make healthy choices and resist peer pressure effectively.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Future Planning</h4>
                    <p className="text-white/90 text-sm">
                      You recognize how staying drug-free protects your health and opens opportunities.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Drug Prevention!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {questions.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review strategies for staying drug-free to strengthen your knowledge and earn your badge.
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

export default DrugFreeTeenBadge;
