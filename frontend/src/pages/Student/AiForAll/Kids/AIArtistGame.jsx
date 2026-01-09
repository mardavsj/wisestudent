import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AIArtistGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [choices, setChoices] = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const quizQuestions = [
    {
      text: "Can AI help you draw creative pictures from your ideas?",
      emoji: "🎨",
      choices: [
        { id: 1, text: "Yes", emoji: "👍", isCorrect: true },
        { id: 2, text: "No", emoji: "👎", isCorrect: false },
        { id: 3, text: "Maybe", emoji: "🤔", isCorrect: false }
      ],
      explanation:
        "Yes! AI can turn your words into amazing pictures, just like DALL·E or other art generators.",
    },
    {
      text: "Can AI draw a flying cat if you tell it to?",
      emoji: "🐱✨",
      choices: [
        { id: 1, text: "No", emoji: "👎", isCorrect: false },
        { id: 2, text: "Yes", emoji: "👍", isCorrect: true },
        { id: 3, text: "Only on weekends", emoji: "📅", isCorrect: false }
      ],
      explanation:
        "Yes! AI can imagine and draw creative scenes from your text prompts — even flying cats!",
    },
    {
      text: "Does AI use data from artists to learn how to draw?",
      emoji: "🧠🖌️",
      choices: [
        { id: 1, text: "Yes", emoji: "👍", isCorrect: true },
        { id: 2, text: "No", emoji: "👎", isCorrect: false },
        { id: 3, text: "Only famous artists", emoji: "🌟", isCorrect: false }
      ],
      explanation:
        "AI learns from many artworks and styles to understand colors, shapes, and how to draw objects.",
    },
    {
      text: "Can AI draw emotions, like a happy or sad face?",
      emoji: "😊😢",
      choices: [
        { id: 1, text: "No", emoji: "👎", isCorrect: false },
        { id: 2, text: "Yes", emoji: "👍", isCorrect: true },
        { id: 3, text: "Only basic emotions", emoji: "😐", isCorrect: false }
      ],
      explanation:
        "Yes! AI can capture emotions and expressions when asked, just like an artist does.",
    },
    {
      text: "Can humans and AI work together to make art?",
      emoji: "🤝🎨",
      choices: [
        { id: 1, text: "Yes", emoji: "👍", isCorrect: true },
        { id: 2, text: "No", emoji: "👎", isCorrect: false },
        { id: 3, text: "Only professionals", emoji: "👩‍🎨", isCorrect: false }
      ],
      explanation:
        "Of course! Many artists use AI tools to enhance creativity — AI helps, but you imagine!",
    },
  ];

  const currentQuestion = quizQuestions[currentIndex];

  const handleChoice = (choiceId) => {
    const choice = currentQuestion.choices.find((c) => c.id === choiceId);
    const isCorrect = choice?.isCorrect;
    
    const newChoices = [...choices, { 
      questionId: currentQuestion.id, 
      choice: choiceId,
      isCorrect: isCorrect
    }];
    
    setChoices(newChoices);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    if (currentIndex < quizQuestions.length - 1) {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
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
    setCurrentIndex(0);
    setScore(0);
    setCoins(0);
    setChoices([]);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/music-ai-story"); // update next route as needed
  };

  return (
    <GameShell
      title="AI Artist Game 🎨"
      score={score}
      subtitle={showResult ? "Game Complete!" : `Question ${currentIndex + 1} of ${quizQuestions.length}`}
      onNext={handleNext}
      nextGamePathProp="/student/ai-for-all/kids/music-ai-story"
      nextGameIdProp="ai-kids-44"
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      maxScore={quizQuestions.length}
      gameId="ai-kids-43"
      gameType="ai"
      totalLevels={quizQuestions.length}
      currentLevel={currentIndex + 1}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-9xl mb-6 text-center">{currentQuestion.emoji}</div>
            <h3 className="text-white text-2xl font-bold mb-6 text-center">
              {currentQuestion.text}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentQuestion.choices.map((choice) => (
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
                <h3 className="text-2xl font-bold text-white mb-4">Creative Genius!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {finalScore} out of {quizQuestions.length} correctly! ({Math.round((finalScore / quizQuestions.length) * 100)}%)
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  💡 AI artists are amazing tools that can help bring your creative visions to life. Great job learning about them!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {finalScore} out of {quizQuestions.length} correctly. ({Math.round((finalScore / quizQuestions.length) * 100)}%)
                  Keep practicing to learn more about AI artists!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  💡 AI artists are amazing tools that can help bring your creative visions to life. Great job learning about them!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AIArtistGame;