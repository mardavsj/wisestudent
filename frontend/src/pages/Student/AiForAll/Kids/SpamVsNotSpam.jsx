import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SpamVsNotSpam = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentEmail, setCurrentEmail] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [choices, setChoices] = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const emails = [
    {
      id: 1,
      subject: "Win money free!",
      emoji: "💰",
      type: "spam",
      choices: [
        { id: 1, text: "Spam", emoji: "🚫", isCorrect: true },
        { id: 2, text: "Not Spam", emoji: "✓", isCorrect: false },
        { id: 3, text: "Important", emoji: "⭐", isCorrect: false }
      ]
    },
    {
      id: 2,
      subject: "Homework update from teacher",
      emoji: "📚",
      type: "not-spam",
      choices: [
        { id: 1, text: "Junk", emoji: "🗑️", isCorrect: false },
        { id: 2, text: "Not Spam", emoji: "✓", isCorrect: true },
        { id: 3, text: "Spam", emoji: "🚫", isCorrect: false }
      ]
    },
    {
      id: 3,
      subject: "Click here for prize!",
      emoji: "🎁",
      type: "spam",
      choices: [
        { id: 1, text: "Advertisement", emoji: "📢", isCorrect: false },
        { id: 2, text: "Spam", emoji: "🚫", isCorrect: true },
        { id: 3, text: "Not Spam", emoji: "✓", isCorrect: false }
      ]
    },
    {
      id: 4,
      subject: "Parent-teacher meeting notice",
      emoji: "👨‍👩‍👧",
      type: "not-spam",
      choices: [
        { id: 1, text: "Not Spam", emoji: "✓", isCorrect: true },
        { id: 2, text: "Spam", emoji: "🚫", isCorrect: false },
        { id: 3, text: "Promotion", emoji: "📈", isCorrect: false }
      ]
    },
    {
      id: 5,
      subject: "You won $1 million!",
      emoji: "💸",
      type: "spam",
      choices: [
        { id: 1, text: "Spam", emoji: "🚫", isCorrect: true },
        { id: 2, text: "Urgent", emoji: "⏰", isCorrect: false },
        { id: 3, text: "Not Spam", emoji: "✓", isCorrect: false }
      ]
    }
  ];

  const currentEmailData = emails[currentEmail];

  const handleChoice = (choiceId) => {
    const choice = currentEmailData.choices.find((c) => c.id === choiceId);
    const isCorrect = choice.isCorrect;
    
    const newChoices = [...choices, { 
      questionId: currentEmailData.id, 
      choice: choiceId,
      isCorrect: isCorrect
    }];
    
    setChoices(newChoices);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    if (currentEmail < emails.length - 1) {
      setTimeout(() => {
        setCurrentEmail(prev => prev + 1);
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
    setCurrentEmail(0);
    setScore(0);
    setCoins(0);
    setChoices([]);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/siri-alexa-quiz");
  };

  return (
    <GameShell
      title="Spam vs Not Spam"
      score={score}
      subtitle={showResult ? "Game Complete!" : `Email ${currentEmail + 1} of ${emails.length}`}
      onNext={handleNext}
      nextGamePathProp="/student/ai-for-all/kids/siri-alexa-quiz"
      nextGameIdProp="ai-kids-10"
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      maxScore={emails.length}
      gameId="ai-kids-9"
      gameType="ai"
      totalLevels={emails.length}
      currentLevel={currentEmail + 1}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">How should this email be classified?</h3>
            
            <div className="bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-xl p-12 mb-6 flex justify-center items-center">
              <div className="text-center">
                <div className="text-8xl mb-4">{currentEmailData.emoji}</div>
                <p className="text-white text-xl font-semibold">"{currentEmailData.subject}"</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentEmailData.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
                >
                  <div className="text-2xl mb-2">{choice.emoji}</div>
                  <h3 className="font-bold text-xl mb-2">{choice.text}</h3>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Spam Filter Expert!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {finalScore} out of {emails.length} correctly! ({Math.round((finalScore / emails.length) * 100)}%)
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  💡 AI email filters work just like this! They learn to recognize spam and keep your inbox clean!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {finalScore} out of {emails.length} correctly. ({Math.round((finalScore / emails.length) * 100)}%)
                  Keep practicing to learn more about email filtering!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  💡 AI email filters work just like this! They learn to recognize spam and keep your inbox clean!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SpamVsNotSpam;