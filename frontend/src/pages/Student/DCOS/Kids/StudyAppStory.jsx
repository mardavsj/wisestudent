import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const StudyAppStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-kids-91";
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
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
  {
    id: 1,
    text: "It’s afternoon study time. Your tablet shows a science learning app and a loud popup app asking to play. What is the smarter choice?",
    options: [
      { id: "b", text: "Tap the popup to see what happens", emoji: "📢", isCorrect: false },
      { id: "a", text: "Open the learning app to continue lessons", emoji: "📘", isCorrect: true },
      { id: "c", text: "Switch off the tablet without checking", emoji: "🔌", isCorrect: false }
    ]
  },
  {
    id: 2,
    text: "You don’t understand a homework question. Your study app has examples and hints. What should you do first?",
    options: [
      { id: "a", text: "Use the app to review examples", emoji: "🧩", isCorrect: true },
      { id: "b", text: "Skip the question completely", emoji: "⏭️", isCorrect: false },
      { id: "c", text: "Wait and hope it disappears", emoji: "⌛", isCorrect: false }
    ]
  },
  {
    id: 3,
    text: "While studying, a message notification appears. Your lesson timer is still running. What is the best decision?",
    options: [
      { id: "b", text: "Reply immediately to every message", emoji: "💬", isCorrect: false },
      { id: "c", text: "Exit the app and scroll freely", emoji: "📱", isCorrect: false },
      { id: "a", text: "Finish the lesson before checking messages", emoji: "⏱️", isCorrect: true },
    ]
  },
  {
    id: 4,
    text: "Your study app shows progress stars and suggests a short break. What should you do?",
    options: [
      { id: "b", text: "Ignore breaks and keep tapping randomly", emoji: "🔄", isCorrect: false },
      { id: "a", text: "Take a short break and return later", emoji: "🌿", isCorrect: true },
      { id: "c", text: "Close the app for the whole day", emoji: "📴", isCorrect: false }
    ]
  },
  {
    id: 5,
    text: "You finish your work early using the study app. What is a balanced next step?",
    options: [
      { id: "a", text: "Review what you learned today", emoji: "📝", isCorrect: true },
      { id: "b", text: "Download many apps without checking", emoji: "⬇️", isCorrect: false },
      { id: "c", text: "Keep screen on until sleep time", emoji: "🌙", isCorrect: false }
    ]
  }
];


  const handleChoice = (selectedChoice) => {
    if (currentQuestion < 0 || currentQuestion >= questions.length) {
      return;
    }

    const currentQ = questions[currentQuestion];
    if (!currentQ || !currentQ.options) {
      return;
    }

    const newChoices = [...choices, { 
      questionId: currentQ.id, 
      choice: selectedChoice,
      isCorrect: currentQ.options.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = currentQ.options.find(opt => opt.id === selectedChoice)?.isCorrect;
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
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

  const handleNext = () => {
    navigate("/games/digital-citizenship/kids");
  };

  const getCurrentQuestion = () => {
    if (currentQuestion >= 0 && currentQuestion < questions.length) {
      return questions[currentQuestion];
    }
    return null;
  };

  const currentQuestionData = getCurrentQuestion();

  return (
    <GameShell
      title="Study App Story"
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={5}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={coins}
      gameId="dcos-kids-91"
      nextGamePathProp="/student/dcos/kids/reflex-learning-tools"
      nextGameIdProp="dcos-kids-92"
      gameType="dcos"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}>
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {coins}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6 text-center">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options && currentQuestionData.options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-xl mb-2">{option.text}</h3>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default StudyAppStory;

