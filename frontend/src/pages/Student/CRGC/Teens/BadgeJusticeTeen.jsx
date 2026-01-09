import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeJusticeTeen = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "civic-responsibility-teens-70";
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
      title: "Identifying Social Injustice",
      question: "Which scenario represents a social injustice that should be addressed?",
      options: [
        { 
          text: "Someone choosing not to attend a party", 
          isCorrect: false
        },
        { 
          text: "People being denied opportunities based on their race or gender", 
          isCorrect: true
        },
        { 
          text: "A store running out of a popular item", 
          isCorrect: false
        },
        { 
          text: "Students having different favorite subjects", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Denying opportunities based on race or gender is a form of discrimination that violates principles of equality and justice.",
        wrong: "Denying opportunities based on race or gender is a form of discrimination that violates principles of equality and justice."
      }
    },
    {
      id: 2,
      title: "Standing Against Discrimination",
      question: "What is the best way to respond when you witness discrimination?",
      options: [
        { 
          text: "Ignore it to avoid conflict", 
          isCorrect: false
        },
        
        { 
          text: "Join in with the discriminatory behavior", 
          isCorrect: false
        },
        { 
          text: "Support the victim and report the incident appropriately", 
          isCorrect: true
        },
        { 
          text: "Tell others about it for entertainment", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Supporting victims and reporting discrimination helps protect those being harmed and can prevent future incidents.",
        wrong: "Supporting victims and reporting discrimination helps protect those being harmed and can prevent future incidents."
      }
    },
    {
      id: 3,
      title: "Educating Others About Justice",
      question: "How can you effectively educate others about social justice issues?",
      options: [
        { 
          text: "Force your views on others without discussion", 
          isCorrect: false
        },
        
        { 
          text: "Only discuss issues on social media anonymously", 
          isCorrect: false
        },
        
        { 
          text: "Avoid all conversations about controversial topics", 
          isCorrect: false
        },
        { 
          text: "Share factual information and encourage thoughtful dialogue", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Sharing factual information and encouraging dialogue helps others understand issues and form informed opinions.",
        wrong: "Sharing factual information and encouraging dialogue helps others understand issues and form informed opinions."
      }
    },
    {
      id: 4,
      title: "Supporting Justice Causes",
      question: "What is an effective way to support organizations working on social justice?",
      options: [
        { 
          text: "Donate time, resources, or skills based on your abilities", 
          isCorrect: true
        },
        { 
          text: "Only provide financial support when convenient", 
          isCorrect: false
        },
        
        { 
          text: "Expect recognition for your contributions", 
          isCorrect: false
        },
        { 
          text: "Only support causes that align with your personal benefits", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Contributing time, resources, or skills based on your abilities provides meaningful support to justice organizations.",
        wrong: "Contributing time, resources, or skills based on your abilities provides meaningful support to justice organizations."
      }
    },
    {
      id: 5,
      title: "Advocating for Policy Change",
      question: "Why is advocating for legislative change important for social justice?",
      options: [
        { 
          text: "To gain personal political advantage", 
          isCorrect: false
        },
        { 
          text: "To create systemic solutions that address root causes of injustice", 
          isCorrect: true
        },
        { 
          text: "To eliminate all individual responsibility", 
          isCorrect: false
        },
        { 
          text: "To avoid community-based solutions", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Legislative change can create systemic solutions that address the root causes of injustice and protect rights.",
        wrong: "Legislative change can create systemic solutions that address the root causes of injustice and protect rights."
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
      title="Badge: Justice Teen"
      subtitle={showResult ? "Game Complete!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      showGameOver={showResult}
      score={score}
      gameId={gameId}
      gameType="civic-responsibility"
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      currentLevel={challenge + 1}
      maxScore={challenges.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/civic-responsibility/teens"
    
      nextGamePathProp="/student/civic-responsibility/teens/constitution-story"
      nextGameIdProp="civic-responsibility-teens-71">
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
                    className={`bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[60px] flex items-center justify-center gap-3 ${
                      answered && selectedAnswer === idx
                        ? option.isCorrect
                          ? "ring-4 ring-green-400"
                          : "ring-4 ring-red-400"
                        : ""
                    }`}
                  >
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
                <div className="text-6xl mb-4">🏅</div>
                <h3 className="text-3xl font-bold text-white mb-4">Justice Teen Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated strong commitment to justice with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Justice Teen</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Social Awareness</h4>
                    <p className="text-white/90 text-sm">
                      You understand how to identify and respond to social injustices in your community.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Advocacy Skills</h4>
                    <p className="text-white/90 text-sm">
                      You know how to effectively support causes and advocate for systemic change.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    window.location.href = "/games/civic-responsibility/teens";
                  }}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Fighting for Justice!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review social justice concepts to strengthen your advocacy skills.
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

export default BadgeJusticeTeen;