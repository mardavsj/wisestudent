import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReproHealthAwareTeenBadge = () => {
  const navigate = useNavigate();
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  const challenges = [
    {
      id: 1,
      title: "Understand Reproductive Anatomy",
      description: "Learn basic male reproductive system functions",
      question: "What is the main function of the testes?",
      options: [
        { id: "a", text: "Store urine", emoji: "💧", isCorrect: false },
        { id: "b", text: "Pump blood", emoji: "❤️", isCorrect: false },
        { id: "c", text: "Produce sperm and hormones", emoji: "🫐", isCorrect: true },
        { id: "d", text: "Digest food", emoji: "🍽️", isCorrect: false }
      ]
    },
    {
      id: 2,
      title: "Recognize Normal Changes",
      description: "Accept that puberty brings normal reproductive changes",
      question: "Wet dreams during puberty are:",
      options: [
        { id: "a", text: "Something to be embarrassed about", emoji: "😳", isCorrect: false },
        { id: "b", text: "A sign of illness", emoji: "🤒", isCorrect: false },
        { id: "c", text: "Completely normal and natural", emoji: "✅", isCorrect: false },
        { id: "d", text: "A natural part of development", emoji: "🌱", isCorrect: true }
      ]
    },
    {
      id: 3,
      title: "Seek Help When Needed",
      description: "Know when to talk to healthcare providers about reproductive health",
      question: "When should you see a doctor about reproductive health concerns?",
      options: [
        { id: "a", text: "Only if something hurts a lot", emoji: "🤕", isCorrect: false },
        { id: "b", text: "Never, handle it yourself", emoji: "😶", isCorrect: false },
        { id: "c", text: "When you have questions or notice changes", emoji: "💬", isCorrect: false },
        { id: "d", text: "Whenever you're unsure or concerned", emoji: "🤔", isCorrect: true }
      ]
    },
    {
      id: 4,
      title: "Respect Privacy",
      description: "Understand the importance of personal boundaries",
      question: "What should you do when friends pressure you to share private information?",
      options: [
        { id: "a", text: "Share everything to fit in", emoji: "👥", isCorrect: false },
        { id: "b", text: "Get angry and argue", emoji: "😠", isCorrect: false },
        { id: "c", text: "Respectfully decline and maintain privacy", emoji: "🤝", isCorrect: false },
        { id: "d", text: "Politely set boundaries", emoji: "🛡️", isCorrect: true }
      ]
    },
    {
      id: 5,
      title: "Make Healthy Choices",
      description: "Choose behaviors that support reproductive health",
      question: "What supports good reproductive health?",
      options: [
        { id: "a", text: "Ignoring body changes", emoji: "🙈", isCorrect: false },
        { id: "b", text: "Following peer pressure", emoji: "👥", isCorrect: false },
        { id: "c", text: "Regular check-ups and healthy lifestyle", emoji: "🏥", isCorrect: true },
        { id: "d", text: "Skipping medical appointments", emoji: "⏭️", isCorrect: false }
      ]
    }
  ];

  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [score, setScore] = useState(0);

  const handleChallengeChoice = (optionIndex) => {
    if (answered) return;

    setAnswered(true);
    setSelectedOptionIndex(optionIndex);
    resetFeedback();

    const currentChallengeData = challenges[currentChallenge];
    const selectedOption = currentChallengeData.options[optionIndex];
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
      setCompletedChallenges([...completedChallenges, currentChallenge]);
    }

    const isLastChallenge = currentChallenge === challenges.length - 1;

    setTimeout(() => {
      if (isLastChallenge) {
        setGameFinished(true);
      } else {
        setCurrentChallenge(prev => prev + 1);
        setAnswered(false);
        setSelectedOptionIndex(null);
      }
    }, 2000);
  };

  const getCurrentChallenge = () => challenges[currentChallenge];

  const handleNext = () => {
    navigate("/games/health-male/teens");
  };

  const handleRetry = () => {
    setCurrentChallenge(0);
    setGameFinished(false);
    setSelectedOptionIndex(null);
    setScore(0);
    setAnswered(false);
    setCompletedChallenges([]);
    resetFeedback();
  };

  return (
    <GameShell
      title="Badge: Repro Health Aware Teen (Teen)"
      subtitle={gameFinished ? "Game Complete!" : `Question ${currentChallenge + 1} of ${challenges.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-male-teen-40"
      nextGamePathProp="/student/health-male/teens/sweat-control-story"
      nextGameIdProp="health-male-teen-41"
      gameType="health-male"
      totalLevels={5}
      currentLevel={10}
      showConfetti={gameFinished && score >= 4}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={challenges.length}
      coinsPerLevel={1}
      totalCoins={5}
      totalXp={10}
    >
      <div className="space-y-8">
        {!gameFinished ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentChallenge + 1}/{challenges.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{challenges.length}</span>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-white text-xl font-bold mb-2">
                  {getCurrentChallenge().title}
                </h3>
                <p className="text-white/80 mb-4">
                  {getCurrentChallenge().description}
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-4 mb-6">
                <p className="text-white text-lg text-center">
                  {getCurrentChallenge().question}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getCurrentChallenge().options.map((option, idx) => {
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
                      key={option.id}
                      onClick={() => handleChallengeChoice(idx)}
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
                  getCurrentChallenge().options[selectedOptionIndex]?.isCorrect
                    ? "bg-green-500/20 border border-green-500/30"
                    : "bg-red-500/20 border border-red-500/30"
                }`}>
                  <p className="text-white font-semibold">
                    {getCurrentChallenge().options[selectedOptionIndex]?.isCorrect
                      ? "That's correct! Well done."
                      : "That's not quite right. Try again!"}
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
                <h3 className="text-3xl font-bold text-white mb-4">Repro Health Aware Teen Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent knowledge about reproductive health with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Repro Health Aware Teen</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Anatomy Knowledge</h4>
                    <p className="text-white/90 text-sm">
                      You understand the basic functions of the male reproductive system.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Healthy Choices</h4>
                    <p className="text-white/90 text-sm">
                      You know when to seek help and how to make responsible decisions.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Reproductive Health!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review reproductive health topics to strengthen your knowledge and earn your badge.
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

        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-medium">Progress:</span>
            <span className="text-white">{completedChallenges.length}/{challenges.length}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(completedChallenges.length / challenges.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {completedChallenges.length > 0 && (
          <div className="mt-6">
            <h4 className="text-white font-bold mb-3">Completed Challenges:</h4>
            <div className="flex flex-wrap gap-2">
              {challenges.map((challenge, index) => (
                <div
                  key={challenge.id}
                  className={`px-3 py-2 rounded-full text-sm font-medium ${
                    completedChallenges.includes(index)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-600 text-gray-300'
                  }`}
                >
                  {challenge.title}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReproHealthAwareTeenBadge;

