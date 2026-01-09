import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeInclusionLeader = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "civic-responsibility-teens-20";
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
      title: "Welcoming New Students",
      question: "What is the best way to welcome a new student to your school?",
      options: [
        { 
          text: "Ignore them until they approach you", 
          isCorrect: false
        },
        { 
          text: "Introduce yourself and invite them to join activities", 
          isCorrect: true
        },
        { 
          text: "Tell your friends not to talk to them", 
          isCorrect: false
        },
        { 
          text: "Ask them personal questions immediately", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Introducing yourself and inviting them to activities helps new students feel welcomed and included.",
        wrong: "Introducing yourself and inviting them to activities helps new students feel welcomed and included."
      }
    },
    {
      id: 2,
      title: "Standing Against Exclusion",
      question: "What should you do if you notice someone being left out of a group activity?",
      options: [
         { 
          text: "Invite the excluded person to join your group", 
          isCorrect: true
        },
        { 
          text: "Join the group that's excluding others", 
          isCorrect: false
        },
       
        { 
          text: "Ignore the situation", 
          isCorrect: false
        },
        { 
          text: "Tell others to exclude more people", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Inviting excluded individuals to join activities promotes inclusion and belonging.",
        wrong: "Inviting excluded individuals to join activities promotes inclusion and belonging."
      }
    },
    {
      id: 3,
      title: "Cultural Appreciation",
      question: "How can you show appreciation for a culture different from your own?",
      options: [
        { 
          text: "Make fun of their traditions", 
          isCorrect: false
        },
        { 
          text: "Learn about their customs and celebrate diversity", 
          isCorrect: true
        },
        { 
          text: "Avoid people from different cultures", 
          isCorrect: false
        },
        { 
          text: "Force others to adopt your culture", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Learning about and celebrating different cultures promotes understanding and inclusion.",
        wrong: "Learning about and celebrating different cultures promotes understanding and inclusion."
      }
    },
    {
      id: 4,
      title: "Equal Participation",
      question: "What is the best way to ensure equal participation in group activities?",
      options: [
        { 
          text: "Let the loudest voices dominate", 
          isCorrect: false
        },
       
        { 
          text: "Exclude quieter members", 
          isCorrect: false
        },
         { 
          text: "Give everyone a chance to contribute and share ideas", 
          isCorrect: true
        },
        { 
          text: "Make all decisions yourself", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Ensuring everyone has a chance to contribute creates an inclusive environment where all voices are valued.",
        wrong: "Ensuring everyone has a chance to contribute creates an inclusive environment where all voices are valued."
      }
    },
    {
      id: 5,
      title: "Respecting Differences",
      question: "How should you respond when someone has a different opinion than yours?",
      options: [
        { 
          text: "Insist that your opinion is the only correct one", 
          isCorrect: false
        },
        
        { 
          text: "Mock their viewpoint", 
          isCorrect: false
        },
        { 
          text: "Avoid all discussions about differing opinions", 
          isCorrect: false
        },
        { 
          text: "Listen respectfully and try to understand their perspective", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Listening respectfully to different opinions promotes understanding and inclusive dialogue.",
        wrong: "Listening respectfully to different opinions promotes understanding and inclusive dialogue."
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
      title="Badge: Inclusion Leader"
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
    
      nextGamePathProp="/student/civic-responsibility/teens/education-story"
      nextGameIdProp="civic-responsibility-teens-21">
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
                <h3 className="text-3xl font-bold text-white mb-4">Inclusion Leader Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated strong inclusion leadership with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Inclusion Leader</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Inclusive Practices</h4>
                    <p className="text-white/90 text-sm">
                      You understand how to create welcoming environments for everyone.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Cultural Awareness</h4>
                    <p className="text-white/90 text-sm">
                      You recognize the value of diversity and different perspectives.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Promoting Inclusion!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review inclusion concepts to strengthen your leadership skills.
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

export default BadgeInclusionLeader;