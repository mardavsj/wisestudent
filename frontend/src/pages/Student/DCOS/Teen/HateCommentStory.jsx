import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const HateCommentStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-teen-81";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Someone posts 'Go back to your country!' on a classmate's post. What should you do?",
      options: [
        { 
          id: "ignore", 
          text: "Ignore it - don't get involved", 
          emoji: "😐", 
          
          isCorrect: false
        },
       
        { 
          id: "reply", 
          text: "Reply with an insult", 
          emoji: "😡", 
          
          isCorrect: false
        },
         { 
          id: "report", 
          text: "Report the hate comment", 
          emoji: "🚫", 
          
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      text: "You see a comment saying 'People like you don't belong here.' What's the right action?",
      options: [
        { 
          id: "report-hate", 
          text: "Report it as hate speech", 
          emoji: "🚫", 
          
          isCorrect: true
        },
        { 
          id: "scroll-past", 
          text: "Scroll past it", 
          emoji: "😐", 
          isCorrect: false
        },
        
        { 
          id: "like", 
          text: "Like it to show support", 
          emoji: "👍", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "A comment says 'You're so stupid because of where you're from.' What should you do?",
      options: [
        { 
          id: "ignore-comment", 
          text: "Ignore it - it's just words", 
          emoji: "😐", 
          isCorrect: false
        },
        { 
          id: "report-discrimination", 
          text: "Report it - this is discrimination", 
          emoji: "🚫", 
          isCorrect: true
        },
        { 
          id: "share", 
          text: "Share it to expose them", 
          emoji: "📤", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You see a comment targeting someone's religion with hateful words. What's your response?",
      options: [
        { 
          id: "not-my-business", 
          text: "Not my business - stay out", 
          emoji: "😐", 
          isCorrect: false
        },
        { 
          id: "report-religious-hate", 
          text: "Report it - religious hate is wrong", 
          emoji: "🚫", 
          isCorrect: true
        },
        { 
          id: "comment-back", 
          text: "Comment back with anger", 
          emoji: "😡", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "A comment says 'People from your background are all the same and bad.' What should you do?",
      options: [
        { 
          id: "ignore-stereotype", 
          text: "Ignore it - just a stereotype", 
          emoji: "😐", 
          isCorrect: false
        },
       
        { 
          id: "laugh", 
          text: "Laugh it off", 
          emoji: "😄", 
          isCorrect: false
        },
         { 
          id: "report-stereotype", 
          text: "Report it - this is hateful stereotyping", 
          emoji: "🚫", 
          isCorrect: true
        },
      ]
    }
  ];

  const handleChoice = (selectedChoice) => {
    const newChoices = [...choices, { 
      questionId: questions[currentQuestion].id, 
      choice: selectedChoice,
      isCorrect: questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect;
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, isCorrect ? 1000 : 0); // Delay if correct to show animation
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setShowResult(true);
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
    navigate("/student/dcos/teen/freedom-vs-abuse-quiz");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Hate Comment Story"
      score={coins}
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      gameId={gameId}
      gameType="dcos"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Coins: {coins}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {getCurrentQuestion().text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getCurrentQuestion().options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-xl mb-2">{option.text}</h3>
                    <p className="text-white/90">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You understand how to respond to hate comments!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  Remember: Always report hate comments - they cause real harm and should not be tolerated!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, hate comments should always be reported!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Try to choose the option that reports hate comments and stands against discrimination.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default HateCommentStory;
