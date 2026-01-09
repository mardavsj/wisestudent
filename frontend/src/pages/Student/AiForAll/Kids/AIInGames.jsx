import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const AIInGames = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("ai-kids-11");
  const gameId = gameData?.id || "ai-kids-11";
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 1;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const questions = [
    {
      id: 1,
      title: "Video Game Enemy",
      emoji: "🎮",
      question: "Who controls the enemy in a video game?",
      choices: [
        { id: 1, text: "AI controls the enemy", emoji: "🤖", isCorrect: true },
        { id: 2, text: "Teacher controls it", emoji: "👩‍🏫", isCorrect: false },
        { id: 3, text: "Nobody", emoji: "❓", isCorrect: false },
      ],
    },
    {
      id: 2,
      title: "Racing Games",
      emoji: "🏎️",
      question: "What makes computer cars race against you?",
      choices: [
        { id: 1, text: "Your Friends", emoji: "👫", isCorrect: false },
        { id: 2, text: "AI Drivers", emoji: "🤖", isCorrect: true },
        { id: 3, text: "Magic", emoji: "✨", isCorrect: false },
      ],
    },
    {
      id: 3,
      title: "Chess Master",
      emoji: "♟️",
      question: "When you play chess on a computer, who moves the pieces for the computer?",
      choices: [
        { id: 1, text: "You", emoji: "🙋‍♀️", isCorrect: false },
        { id: 2, text: "AI", emoji: "🧠", isCorrect: true },
        { id: 3, text: "Random Luck", emoji: "🎲", isCorrect: false },
      ],
    },
    {
      id: 4,
      title: "Football Game",
      emoji: "⚽",
      question: "How do computer players know when to kick the ball?",
      choices: [
        { id: 1, text: "Coach tells them", emoji: "🏋️‍♂️", isCorrect: false },
        { id: 2, text: "They guess randomly", emoji: "🎯", isCorrect: false },
        { id: 3, text: "AI makes them act", emoji: "🤖", isCorrect: true },
      ],
    },
    {
      id: 5,
      title: "Adventure Game",
      emoji: "🗺️",
      question: "What helps enemies or friends react to your moves in adventure games?",
      choices: [
        { id: 1, text: "Game Music", emoji: "🎵", isCorrect: false },
        { id: 2, text: "Game Designer live", emoji: "🎮", isCorrect: false },
        { id: 3, text: "AI Logic", emoji: "⚙️", isCorrect: true },
      ],
    },
  ];

  const getCurrentQuestion = () => questions[currentQuestion];

  const handleChoice = (choiceId) => {
    const currentQ = getCurrentQuestion();
    const choice = currentQ.choices.find((c) => c.id === choiceId);
    const isCorrect = choice.isCorrect;
    
    const newChoices = [...choices, { 
      questionId: currentQ.id, 
      choice: choiceId,
      isCorrect: isCorrect
    }];
    
    setChoices(newChoices);
    
    if (isCorrect) {
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
    setChoices([]);
    setCoins(0);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/match-ai-tools");
  };

  const currentQuestionData = getCurrentQuestion();

  return (
    <GameShell
      title="AI in Games"
      subtitle={showResult ? "Game Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextGamePathProp="/student/ai-for-all/kids/match-ai-tools"
      nextGameIdProp="ai-kids-12"
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId={gameId}
      gameType="ai"
      totalLevels={5}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Coins: {coins}</span>
              </div>
              
              <div className="text-6xl mb-3 text-center">{currentQuestionData.emoji}</div>
              <h2 className="text-white text-xl font-bold mb-4 text-center">
                {currentQuestionData.title}
              </h2>
              <p className="text-white text-lg mb-6 text-center">
                "{currentQuestionData.question}"
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.choices.map((choice) => (
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
          </div>
        ) : showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Game AI Expert!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {finalScore} out of {questions.length} correctly! ({Math.round((finalScore / questions.length) * 100)}%)
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  💡 Artificial Intelligence makes games challenging and fun by controlling enemies, creating realistic behaviors, and adapting to your play style!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {finalScore} out of {questions.length} correctly. ({Math.round((finalScore / questions.length) * 100)}%)
                  Keep practicing to learn more about AI in games!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  💡 Artificial Intelligence makes games challenging and fun by controlling enemies, creating realistic behaviors, and adapting to your play style!
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default AIInGames;