import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const EthicsBadge = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-teen-91";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const [challenge, setChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const challenges = [
    {
      id: 1,
      title: "AI Ethics Fundamentals",
      question: "What is the primary principle of ethical AI development?",
      options: [
        { 
          text: "Ensuring fairness and preventing harm to individuals or groups", 
          emoji: "⚖️", 
          isCorrect: true
        },
        { 
          text: "Maximizing profits for technology companies", 
          emoji: "💰", 
          isCorrect: false
        },
        { 
          text: "Creating the most advanced technology possible", 
          emoji: "🚀", 
          isCorrect: false
        },
        { 
          text: "Minimizing development time and costs", 
          emoji: "⏱️", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Ethical AI prioritizes human welfare, fairness, and harm prevention above all else!",
        wrong: "While business considerations matter, ethical AI places human welfare and fairness as the highest priorities."
      }
    },
    {
      id: 2,
      title: "Privacy Protection",
      question: "Why is informed consent crucial in AI data collection?",
      options: [
        
        { 
          text: "It speeds up the data collection process", 
          emoji: "⚡", 
          isCorrect: false
        },
        { 
          text: "It reduces storage requirements", 
          emoji: "💾", 
          isCorrect: false
        },
        { 
          text: "It eliminates the need for data security", 
          emoji: "🔓", 
          isCorrect: false
        },
        { 
          text: "Individuals have the right to know how their data is used", 
          emoji: "📊", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Correct! Informed consent respects individual autonomy and transparency in data usage!",
        wrong: "Informed consent is fundamentally about respecting people's rights to control their personal information."
      }
    },
    {
      id: 3,
      title: "Algorithmic Bias",
      question: "What is a key strategy for reducing bias in AI systems?",
      options: [
       
        { 
          text: "Using only technical metrics for evaluation", 
          emoji: "📊", 
          isCorrect: false
        },
        { 
          text: "Focusing solely on algorithmic accuracy", 
          emoji: "🎯", 
          isCorrect: false
        },
         { 
          text: "Diverse teams and inclusive dataset development", 
          emoji: "👩‍💻", 
          isCorrect: true
        },
        { 
          text: "Deploying systems without human oversight", 
          emoji: "🤖", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Right! Diverse perspectives in development help identify and mitigate potential biases!",
        wrong: "Technical metrics alone can't capture societal impacts; human-centered approaches are essential."
      }
    },
    {
      id: 4,
      title: "Transparency",
      question: "Why is explainability important in AI decision-making?",
      options: [
        { 
          text: "It builds trust and enables accountability", 
          emoji: "🤝", 
          isCorrect: true
        },
        { 
          text: "It makes AI systems run faster", 
          emoji: "⚡", 
          isCorrect: false
        },
        { 
          text: "It reduces computational requirements", 
          emoji: "🔋", 
          isCorrect: false
        },
        { 
          text: "It eliminates the need for testing", 
          emoji: "🧪", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Explainability allows stakeholders to understand, trust, and challenge AI decisions!",
        wrong: "Explainability is about accountability and trust, not technical performance optimization."
      }
    },
    {
      id: 5,
      title: "Digital Responsibility",
      question: "What is a core principle of responsible AI use?",
      options: [
       
        { 
          text: "Maximizing automation in all processes", 
          emoji: "⚙️", 
          isCorrect: false
        },
         { 
          text: "Considering societal impact and long-term consequences", 
          emoji: "🌍", 
          isCorrect: true
        },
        { 
          text: "Prioritizing convenience over security", 
          emoji: "🔓", 
          isCorrect: false
        },
        { 
          text: "Focusing only on immediate benefits", 
          emoji: "🎁", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Responsible AI considers broader implications for society and future generations!",
        wrong: "Responsible AI requires balancing immediate benefits with long-term societal wellbeing."
      }
    }
  ];

  const handleAnswer = (isCorrect, optionIndex) => {
    if (answered) return;
    
    setAnswered(true);
    setSelectedAnswer(optionIndex);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
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

  const currentChallenge = challenges[challenge];

  return (
    <GameShell
      title="Badge: AI Ethics Champion"
      subtitle={showResult ? "Badge Earned!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      showGameOver={showResult}
      score={score}
      gameId={gameId}
      nextGamePathProp="/student/ai-for-all/teen/ai-human-roles-story"
      nextGameIdProp="ai-teen-92"
      gameType="ai"
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      currentLevel={challenge + 1}
      maxScore={challenges.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showResult && currentChallenge ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-2">{currentChallenge.title}</h3>
              <p className="text-white text-lg mb-6">
                {currentChallenge.question}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentChallenge.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option.isCorrect, idx)}
                    disabled={answered}
                    className={`bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[60px] flex items-center justify-center gap-3 ${
                      answered && selectedAnswer === idx
                        ? option.isCorrect
                          ? "ring-4 ring-green-400"
                          : "ring-4 ring-red-400"
                        : ""
                    }`}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <span className="font-bold text-lg">{option.text}</span>
                  </button>
                ))}
              </div>
              
              {answered && (
                <div className={`mt-4 p-4 rounded-xl ${
                  currentChallenge.options[selectedAnswer]?.isCorrect
                    ? "bg-green-500/20 border border-green-500/30"
                    : "bg-red-500/20 border border-red-500/30"
                }`}>
                  <p className="text-white font-semibold">
                    {currentChallenge.options[selectedAnswer]?.isCorrect
                      ? currentChallenge.feedback.correct
                      : currentChallenge.feedback.wrong}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 4 ? (
              <div>
                <div className="text-6xl mb-4">🌟</div>
                <h3 className="text-3xl font-bold text-white mb-4">AI Ethics Champion Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  Outstanding! You demonstrated strong ethical reasoning with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: AI Ethics Champion</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Ethical Principles</h4>
                    <p className="text-white/90 text-sm">
                      You understand core ethical concepts including fairness, privacy, bias mitigation, and transparency.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Responsible Innovation</h4>
                    <p className="text-white/90 text-sm">
                      You recognize the importance of considering societal impact and long-term consequences in AI development.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    // Navigate to next game path
                    window.location.href = "/student/ai-for-all/teen/ai-human-roles-story";
                  }}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning Ethics!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review concepts of fairness, privacy protection, bias mitigation, and responsible innovation.
                </p>
                <button
                  onClick={handleTryAgain}
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

export default EthicsBadge;