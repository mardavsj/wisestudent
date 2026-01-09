import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PowerOfNoPoster = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-66";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [currentStage, setCurrentStage] = useState(0);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stages = [
    {
      question: "Your friend wants you to skip class to play games, but you know it's wrong. What should you do?",
      posters: [
        {
          id: 1,
          title: "Skip class anyway, it's just one time",
          
          emoji: "🏃",
          isCorrect: false
        },
        {
          id: 2,
          title: "Politely say no and suggest studying together later",
        
          emoji: "💬",
          isCorrect: true
        },
        {
          id: 3,
          title: "Go with them but feel guilty about it",
          emoji: "😰",
          isCorrect: false
        }
      ],
      correctFeedback: "Great choice! Standing up for what's right takes courage!",
      explanation: "It's important to make good choices even when your friends try to convince you otherwise."
    },
    {
      question: "An older student is pressuring you to share your personal information online. What's the best response?",
      posters: [
        {
          id: 1,
          title: "Share everything to make them like you",
          emoji: "📱",
          isCorrect: false
        },
        
        {
          id: 2,
          title: "Ask your parents for advice first",
          emoji: "❓",
          isCorrect: false
        },
        {
          id: 3,
          title: "Say no firmly and walk away",
          emoji: "🚶",
          isCorrect: true
        },
      ],
      correctFeedback: "Perfect! Protecting your privacy is very important!",
      explanation: "Never share personal information with strangers or people pressuring you."
    },
    {
      question: "Your friend is being mean to someone new at school and wants you to join in. What do you do?",
      posters: [
        {
          id: 1,
          title: "Stand up for the new student and tell your friend it's wrong",
          emoji: "🦸",
          isCorrect: true
        },
        {
          id: 2,
          title: "Join in so you fit in with your friend",
          emoji: "👎",
          isCorrect: false
        },
        
        {
          id: 3,
          title: "Stay quiet to avoid conflict",
          emoji: "🤐",
          isCorrect: false
        }
      ],
      correctFeedback: "Excellent! Being kind and standing up for others is the right thing to do!",
      explanation: "True friends don't ask you to be mean to others. It's important to stand up for what's right."
    },
    {
      question: "Someone is offering you a reward to do something that doesn't feel right to you. What should you choose?",
      posters: [
        {
          id: 3,
          title: "Take the reward and do it, since you'll benefit",
          emoji: "💰",
          isCorrect: false
        },
        
        {
          id: 1,
          title: "Ask other friends what they would do",
          emoji: "👥",
          isCorrect: false
        },
        {
          id: 2,
          title: "Say no and trust your instincts",
          emoji: "🧠",
          isCorrect: true
        },
      ],
      correctFeedback: "Wise decision! Always trust your instincts!",
      explanation: "If something doesn't feel right, it probably isn't. Your instincts protect you."
    },
    {
      question: "A trusted adult is asking you to do something that makes you uncomfortable, even though they seem nice. What's your best action?",
      posters: [
        {
          id: 2,
          title: "Do what they say because adults are always right",
          emoji: "🤖",
          isCorrect: false
        },
        {
          id: 1,
          title: "Say no and tell another trusted adult immediately",
          emoji: "🗣️",
          isCorrect: true
        },
        {
          id: 3,
          title: "Ignore the feeling and go along with it",
          emoji: "😔",
          isCorrect: false
        }
      ],
      correctFeedback: "Smart thinking! Always speak up if something feels wrong!",
      explanation: "Even trusted adults should respect your boundaries. Tell another adult you trust if something feels wrong."
    }
  ];

  const currentStageData = stages[currentStage];
  const posters = currentStageData?.posters || [];

  const handlePosterSelect = (poster) => {
    setSelectedPoster(poster.id);

    if (poster.isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);

      // Check if this is the last stage
      const isLastStage = currentStage === stages.length - 1;

      if (isLastStage) {
        // Last stage - show result and game over modal
        setShowResult(true);
      } else {
        // Automatically move to next question after showing feedback
        setTimeout(() => {
          setCurrentStage(currentStage + 1);
          setSelectedPoster(null);
          setShowResult(false);
          resetFeedback();
        }, 1500);
      }
    } else {
      // Show feedback for incorrect answer and move to next question
      showCorrectAnswerFeedback(0, false);
      
      // Check if this is the last stage
      const isLastStage = currentStage === stages.length - 1;
      
      if (isLastStage) {
        // Last stage - show result and game over modal
        setTimeout(() => {
          setShowResult(true);
        }, 1500);
      } else {
        // Move to next question after showing feedback
        setTimeout(() => {
          setCurrentStage(currentStage + 1);
          setSelectedPoster(null);
          setShowResult(false);
          resetFeedback();
        }, 1500);
      }
    }
  };

  const handleNext = () => {
    navigate("/games/health-male/kids");
  };

  const handleTryAgain = () => {
    setSelectedPoster(null);
    setShowResult(false);
    resetFeedback();
  };

  const isLastStage = currentStage === stages.length - 1;
  const selectedPosterData = selectedPoster ? posters.find(p => p.id === selectedPoster) : null;
  const isCorrect = selectedPosterData?.isCorrect || false;

  return (
    <GameShell
      title="Poster: Power of No"
      subtitle={`Question ${currentStage + 1} of ${stages.length}`}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={showResult && selectedPoster && isCorrect && !isLastStage}
      showGameOver={showResult && isLastStage && isCorrect}
      score={coins}
      gameId={gameId}
      nextGamePathProp="/student/health-male/kids/pressure-journal"
      nextGameIdProp="health-male-kids-67"
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={stages.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-xl font-bold mb-6 text-center">
                Question {currentStage + 1}: {currentStageData?.question}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {posters.map(poster => (
                  <button
                    key={poster.id}
                    onClick={() => handlePosterSelect(poster)}
                    disabled={showResult}
                    className={`p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 ${selectedPoster === poster.id
                      ? "ring-4 ring-yellow-400 bg-gradient-to-r from-blue-500 to-indigo-600"
                      : "bg-gradient-to-r from-green-500 to-emerald-600"
                      } ${showResult ? "opacity-75 cursor-not-allowed" : "hover:scale-105"}`}
                  >
                    <div className="text-4xl mb-4 text-center">{poster.emoji}</div>
                    <h3 className="font-bold text-xl text-white mb-2 text-center">{poster.title}</h3>
                    <p className="text-white/90 text-center">{poster.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {isCorrect ? (
              <div>
                <div className="text-5xl mb-4">🎨</div>
                <h3 className="text-2xl font-bold text-white mb-4">Powerful Choice!</h3>
                <p className="text-white/90 text-lg mb-4">
                  {currentStageData?.correctFeedback}
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+1 Coin</span>
                </div>
                <p className="text-white/80 mb-4">
                  {currentStageData?.explanation}
                </p>
                {!isLastStage && (
                  <p className="text-white/70 text-sm mt-4">
                    Question {currentStage + 1} of {stages.length} completed!
                  </p>
                )}
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">🤔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Think About It!</h3>
                <p className="text-white/90 text-lg mb-4">
                  {currentStageData?.correctFeedback || "That's not quite right. Try again!"}
                </p>
                {/* Removed Try Again button to standardize behavior */}
                <p className="text-white/80 text-sm">
                  {currentStageData?.explanation || "Look for the poster that shows strength in saying no."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PowerOfNoPoster;

