import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const YouTubeRecommendation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [choices, setChoices] = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const questions = [
    {
      text: "What kind of videos should AI recommend to kids?",
      emoji: "📺",
      choices: [
        { id: 1, text: "Cartoons 🧸", isCorrect: true },
        { id: 2, text: "Adult Shows 📺", isCorrect: false },
        { id: 3, text: "News Reports 📰", isCorrect: false }
      ]
    },
    {
      text: "Which of these is a fun and educational video for kids?",
      emoji: "🎓",
      choices: [
        { id: 1, text: "Politics Debate 🏛️", isCorrect: false },
        { id: 2, text: "Science Experiment 🔬", isCorrect: true },
        { id: 3, text: "Horror Movie 👻", isCorrect: false }
      ]
    },
    {
      text: "If you watch DIY craft videos often, what will YouTube show next?",
      emoji: "✂️",
      choices: [
        { id: 1, text: "More DIY Craft Videos 🎨", isCorrect: true },
        { id: 2, text: "Random Scary Movies 👻", isCorrect: false },
        { id: 3, text: "Cooking Shows 🍳", isCorrect: false }
      ]
    },
    {
      text: "AI uses what to decide your recommendations?",
      emoji: "🧠",
      choices: [
        { id: 1, text: "Your Watch History 📜", isCorrect: true },
        { id: 2, text: "Random Guessing 🎲", isCorrect: false },
        { id: 3, text: "Your Age 🎂", isCorrect: false }
      ]
    },
    {
      text: "Why does YouTube ask 'Do you like this video?'",
      emoji: "👍",
      choices: [
        { id: 1, text: "Just for fun 🎈", isCorrect: false },
        { id: 2, text: "To learn your taste and improve recommendations 💡", isCorrect: true },
        { id: 3, text: "To collect money 💰", isCorrect: false }
      ]
    }
  ];

  const question = questions[currentQuestion];

  const handleChoice = (choiceId) => {
    const choice = question.choices.find((c) => c.id === choiceId);
    const isCorrect = choice.isCorrect;
    
    const newChoices = [...choices, { 
      questionId: currentQuestion, 
      choice: choiceId,
      isCorrect: isCorrect
    }];
    
    setChoices(newChoices);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
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
    setScore(0);
    setCoins(0);
    setChoices([]);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/smart-fridge-story");
  };

  return (
    <GameShell
      title="YouTube Recommendation Quiz"
      score={score}
      subtitle={showResult ? "Game Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={questions.length}
      gameId="ai-kids-29"
      gameType="ai"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">Test Your Knowledge</h3>
            
            <div className="bg-white/10 rounded-lg p-6 mb-6">
              <div className="text-6xl mb-3 text-center">{question.emoji}</div>
              <p className="text-white text-xl font-semibold text-center">"{question.text}"</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {question.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
                >
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
                <h3 className="text-2xl font-bold text-white mb-4">Recommendation Expert!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {finalScore} out of {questions.length} correctly! ({Math.round((finalScore / questions.length) * 100)}%)
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  💡 AI recommendation systems learn from your preferences to suggest content you'll enjoy!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {finalScore} out of {questions.length} correctly. ({Math.round((finalScore / questions.length) * 100)}%)
                  Keep practicing to learn more about AI recommendation systems!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  💡 AI recommendation systems learn from your preferences to suggest content you'll enjoy!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default YouTubeRecommendation;