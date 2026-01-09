import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SportsStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 1; // 1 coin per question
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "The teacher asks who can play cricket. Some boys raise their hands immediately. What should happen next?",
      options: [
        {
          id: "a",
          text: "Only boys should play cricket",
          emoji: "⚾",
          isCorrect: false
        },
        {
          id: "b",
          text: "The teacher should ask if girls are also interested",
          emoji: "🙋‍♀️",
          isCorrect: true
        },
        {
          id: "c",
          text: "Girls should stay on the sidelines and watch",
          emoji: "👀",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Some girls want to join the cricket team, but other students are saying girls can't play as well as boys. How do you respond?",
      options: [
        {
          id: "b",
          text: "Encourage everyone to try out and let skill determine the team",
          emoji: "💪",
          isCorrect: true
        },
        {
          id: "a",
          text: "Agree that girls aren't as good at sports",
          emoji: "😞",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Stay quiet and let others decide",
          emoji: "🤫",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "During practice, a girl hits a great shot but some boys complain she got lucky. What should you do?",
      options: [
        {
          id: "a",
          text: "Join in and make fun of her",
          emoji: "😂",
          isCorrect: false
        },
        {
          id: "b",
          text: "Acknowledge her good shot and encourage her",
          emoji: "👏",
          isCorrect: true
        },
        {
          id: "c",
          text: "Tell her to let the boys practice",
          emoji: "🙅",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "The team captain position is open. There's a boy and a girl who are equally skilled. Who should be chosen?",
      options: [
        {
          id: "a",
          text: "The boy automatically because he's male",
          emoji: "👨",
          isCorrect: false
        },
       
        {
          id: "c",
          text: "Let the teacher decide without considering skills",
          emoji: "🤔",
          isCorrect: false
        },
         {
          id: "b",
          text: "Let them both demonstrate leadership and choose based on merit",
          emoji: "🏆",
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "Some parents are concerned that mixed-gender teams won't be competitive. How would you address this?",
      options: [
        {
          id: "a",
          text: "Agree with the parents that boys and girls should be separate",
          emoji: "💔",
          isCorrect: false
        },
        {
          id: "b",
          text: "Explain that mixed teams promote fairness and teamwork skills",
          emoji: "🤝",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignore the parents' concerns",
          emoji: "👂",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const newChoices = [...choices, { 
      questionId: questions[currentQuestion].id, 
      choice: optionId,
      isCorrect: questions[currentQuestion].options.find(opt => opt.id === optionId)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = questions[currentQuestion].options.find(opt => opt.id === optionId)?.isCorrect;
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, isCorrect ? 1000 : 800);
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setTimeout(() => {
        setShowResult(true);
      }, isCorrect ? 1000 : 800);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setChoices([]);
    setCoins(0);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Sports Story"
      score={coins}
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      showGameOver={showResult}
      gameId="civic-responsibility-kids-21"
      gameType="civic-responsibility"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      onNext={handleNext}
      nextEnabled={showResult}
      backPath="/games/civic-responsibility/kids"
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/civic-responsibility/kids/quiz-on-equality"
      nextGameIdProp="civic-responsibility-kids-22">
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center max-w-4xl mx-auto px-4 py-4">
        {!showResult ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <span className="text-white/80 text-sm md:text-base">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold text-sm md:text-base">Coins: {coins}</span>
              </div>
              
              <h2 className="text-white text-base md:text-lg lg:text-xl mb-4 md:mb-6 text-center">
                {getCurrentQuestion().text}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                {getCurrentQuestion().options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl md:text-3xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-base md:text-xl mb-2">{option.text}</h3>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/20 text-center flex-1 flex flex-col justify-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-4xl md:text-5xl mb-4">🏅</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Sports Equality Champion!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You understand the importance of equality in sports!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80 text-sm md:text-base">
                  Great job! You know how to promote fairness and inclusion in sports!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, everyone deserves equal opportunities in sports regardless of gender!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-bold transition-all mb-4 text-sm md:text-base"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-xs md:text-sm">
                  Try to choose the option that shows how to support equality in sports.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SportsStory;