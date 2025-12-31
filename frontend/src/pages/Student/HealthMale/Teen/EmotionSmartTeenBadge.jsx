import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { Award, Heart, Brain, Shield, Star, Smile, Handshake } from "lucide-react";

const EmotionSmartTeenBadge = () => {
  const navigate = useNavigate();
  
  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-male-teen-60";

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
  {
    id: 1,
    title: "Emotional Awareness",
    text: "Why is it important to identify your emotions?",
    icon: <Brain className="w-12 h-12 text-purple-400" />,
    options: [
      { text: "To ignore them", emoji: "🙈", isCorrect: false },
      { text: "To blame others", emoji: "👉", isCorrect: false },
      { text: "To hide them", emoji: "🤐", isCorrect: false },
      { text: "To control and respond effectively", emoji: "🧠", isCorrect: true },
    ],
    feedback: {
      correct: "Right! Recognizing emotions helps you respond thoughtfully instead of reacting impulsively.",
      wrong: "Understanding your emotions is key to managing them effectively, not suppressing or ignoring them."
    }
  },
  {
    id: 2,
    title: "Active Listening",
    text: "Why is active listening important in friendships?",
    icon: <Heart className="w-12 h-12 text-blue-400" />,
    options: [
      { text: "To respond faster", emoji: "⚡", isCorrect: false },
      { text: "To genuinely understand others", emoji: "🤝", isCorrect: true },
      { text: "To judge them secretly", emoji: "🕵️", isCorrect: false },
      { text: "To ignore feelings", emoji: "🙈", isCorrect: false }
    ],
    feedback: {
      correct: "Exactly! Active listening shows empathy and strengthens trust in relationships.",
      wrong: "Active listening is about understanding and validating others' feelings, not judging or ignoring them."
    }
  },
  {
    id: 3,
    title: "Handling Peer Pressure",
    text: "How can you handle peer pressure positively?",
    icon: <Shield className="w-12 h-12 text-red-400" />,
    options: [
      { text: "Politely decline and assert your values", emoji: "✋", isCorrect: true },
      { text: "Give in to fit in", emoji: "🤷", isCorrect: false },
      { text: "Ignore friends forever", emoji: "🚪", isCorrect: false },
      { text: "Rebel aggressively", emoji: "🔥", isCorrect: false }
    ],
    feedback: {
      correct: "Correct! Standing firm on your values shows self-respect and emotional maturity.",
      wrong: "Handling peer pressure effectively means being assertive, not ignoring or rebelling without thought."
    }
  },
  {
    id: 4,
    title: "Managing Stress",
    text: "Which strategy helps manage stress effectively?",
    icon: <Star className="w-12 h-12 text-yellow-400" />,
    options: [
      { text: "Bottling it up", emoji: "🙈", isCorrect: false },
      { text: "Complain constantly", emoji: "📢", isCorrect: false },
      { text: "Engage in healthy coping like exercise or meditation", emoji: "🧘", isCorrect: true },
      { text: "Avoid responsibilities", emoji: "🏃", isCorrect: false }
    ],
    feedback: {
      correct: "Yes! Healthy coping mechanisms reduce stress and improve overall well-being.",
      wrong: "Effective stress management requires active, healthy strategies, not avoidance or complaints."
    }
  },
  {
    id: 5,
    title: "Conflict Resolution",
    text: "Best way to resolve a disagreement with a friend?",
    icon: <Handshake className="w-12 h-12 text-green-400" />,
    options: [
      { text: "Yell to win", emoji: "📢", isCorrect: false },
      { text: "Listen, express feelings calmly, and seek compromise", emoji: "💬", isCorrect: true },
      { text: "Ignore them forever", emoji: "🚪", isCorrect: false },
      { text: "Gossip about them", emoji: "🤫", isCorrect: false }
    ],
    feedback: {
      correct: "Exactly! Calm communication and compromise strengthen friendships.",
      wrong: "Healthy conflict resolution involves listening, expressing yourself, and finding a fair solution."
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
      title="Emotion Smart Teen Badge"
      subtitle={gameFinished ? "Game Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="health-male"
      totalLevels={5}
      currentLevel={60}
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
                <h3 className="text-3xl font-bold text-white mb-4">Emotion Smart Teen Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent knowledge about emotional intelligence with {score} correct answers out of {questions.length}!
                </p>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Emotion Smart Teen</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Emotional Awareness</h4>
                    <p className="text-white/90 text-sm">
                      You understand how to recognize and manage emotions effectively in yourself and others.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Healthy Relationships</h4>
                    <p className="text-white/90 text-sm">
                      You know how to establish boundaries and build meaningful connections with empathy.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Emotional Intelligence!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {questions.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review emotional intelligence concepts to strengthen your knowledge and earn your badge.
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

export default EmotionSmartTeenBadge;
