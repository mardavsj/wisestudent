import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SiriAlexaQuiz = () => {
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
      text: "Is Alexa an AI?",
      emoji: "🔊",
      choices: [
        { id: 1, text: "Yes", emoji: "✓", isCorrect: true },
        { id: 2, text: "No", emoji: "✗", isCorrect: false },
        { id: 3, text: "Maybe", emoji: "🤔", isCorrect: false }
      ]
    },
    {
      text: "What can Siri do using AI?",
      emoji: "📱",
      choices: [
        { id: 1, text: "Cook food", emoji: "🍳", isCorrect: false },
        { id: 2, text: "Set alarms and reminders", emoji: "⏰", isCorrect: true },
        { id: 3, text: "Drive a car", emoji: "🚗", isCorrect: false }
      ]
    },
    {
      text: "Does Alexa learn from your voice patterns?",
      emoji: "🗣️",
      choices: [
        { id: 2, text: "Yes, to improve answers", emoji: "💡", isCorrect: true },
        { id: 1, text: "No, it never learns", emoji: "🚫", isCorrect: false },
        { id: 3, text: "Sometimes", emoji: "⏳", isCorrect: false }
      ]
    },
    {
      text: "Which of these is NOT an AI assistant?",
      emoji: "🤔",
      choices: [
        { id: 1, text: "Google Assistant", emoji: "🎙️", isCorrect: false },
        { id: 3, text: "Siri", emoji: "📱", isCorrect: false },
        { id: 2, text: "Refrigerator", emoji: "🧊", isCorrect: true },
      ]
    },
    {
      text: "How do Siri and Alexa help us daily?",
      emoji: "💬",
      choices: [
        { id: 1, text: "By playing video games for us", emoji: "🎮", isCorrect: false },
        { id: 2, text: "By answering questions and reminders", emoji: "🧠", isCorrect: true },
        { id: 3, text: "By doing laundry", emoji: "👕", isCorrect: false }
      ]
    }
  ];

  const current = questions[currentQuestion];

  const handleChoice = (choiceId) => {
    const choice = current.choices.find((c) => c.id === choiceId);
    const isCorrect = choice.isCorrect;
    
    const newChoices = [...choices, { 
      questionId: currentQuestion + 1, 
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
    navigate("/student/ai-for-all/kids/ai-in-games");
  };

  return (
    <GameShell
      title="Siri/Alexa Quiz"
      score={score}
      subtitle={showResult ? "Game Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextGamePathProp="/student/ai-for-all/kids/ai-in-games"
      nextGameIdProp="ai-kids-11"
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      maxScore={questions.length}
      gameId="ai-kids-10"
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
            <h3 className="text-white text-xl font-bold mb-6 text-center">Test Your Knowledge About AI Assistants</h3>
            
            <div className="bg-white/10 rounded-lg p-6 mb-6">
              <div className="text-6xl mb-3 text-center">{current.emoji}</div>
              <p className="text-white text-xl font-semibold text-center">"{current.text}"</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {current.choices.map((choice) => (
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
                <h3 className="text-2xl font-bold text-white mb-4">AI Assistant Expert!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {finalScore} out of {questions.length} correctly! ({Math.round((finalScore / questions.length) * 100)}%)
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  💡 AI assistants like Siri, Alexa, and Google Assistant use artificial intelligence to understand and respond to your voice!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {finalScore} out of {questions.length} correctly. ({Math.round((finalScore / questions.length) * 100)}%)
                  Keep practicing to learn more about AI assistants!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  💡 AI assistants like Siri, Alexa, and Google Assistant use artificial intelligence to understand and respond to your voice!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SiriAlexaQuiz;