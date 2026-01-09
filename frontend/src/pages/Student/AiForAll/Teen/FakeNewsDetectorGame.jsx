import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getAiTeenGames } from '../../../../pages/Games/GameCategories/AiForAll/teenGamesData';

const FakeNewsDetectorGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("ai-teen-79");
  const gameId = gameData?.id || "ai-teen-79";
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 1;
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
      title: "Fake News Detection",
      emoji: "📰",
      question: "What helps identify fake news?",
      choices: [
        { id: 1, text: "Source verification", emoji: "🔍", isCorrect: true },
        { id: 2, text: "Clickbait headlines", emoji: "🔥", isCorrect: false },
        { id: 3, text: "Viral sharing", emoji: "📱", isCorrect: false },
      ],
    },
    {
      id: 2,
      title: "Fact Checking",
      emoji: "✅",
      question: "What's a reliable fact-checking method?",
      choices: [
        { id: 1, text: "Social media", emoji: "💬", isCorrect: false },
        { id: 2, text: "Cross-referencing", emoji: "🔄", isCorrect: true },
        { id: 3, text: "First source", emoji: "🥇", isCorrect: false },
      ],
    },
    {
      id: 3,
      title: "Misinformation",
      emoji: "🤥",
      question: "How does misinformation spread?",
      choices: [
        { id: 1, text: "Scientific data", emoji: "🧪", isCorrect: false },
        { id: 2, text: "Emotional appeal", emoji: "😢", isCorrect: true },
        { id: 3, text: "Peer review", emoji: "📚", isCorrect: false },
      ],
    },
    {
      id: 4,
      title: "AI Detection",
      emoji: "🤖",
      question: "How can AI help detect fake news?",
      choices: [
        { id: 1, text: "Manual review", emoji: "👩‍💼", isCorrect: false },
        { id: 2, text: "Human opinion", emoji: "👥", isCorrect: false },
        { id: 3, text: "Pattern analysis", emoji: "📊", isCorrect: true },
      ],
    },
    {
      id: 5,
      title: "Media Literacy",
      emoji: "🎓",
      question: "What skill helps fight misinformation?",
      choices: [
        { id: 1, text: "Critical thinking", emoji: "🤔", isCorrect: true },
        { id: 2, text: "Quick sharing", emoji: "🚀", isCorrect: false },
        { id: 3, text: "Passive reading", emoji: "📖", isCorrect: false },
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
    // Find next game path
    try {
      const games = getAiTeenGames({});
      const currentGame = games.find(g => g.id === gameId);
      if (currentGame && currentGame.index !== undefined) {
        const nextGame = games.find(g => g.index === currentGame.index + 1 && g.isSpecial && g.path);
        if (nextGame) {
          navigate(nextGame.path);
        } else {
          navigate("/student/ai-for-all/teen/ai-safety-reflex");
        }
      } else {
        navigate("/student/ai-for-all/teen/ai-safety-reflex");
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
      navigate("/student/ai-for-all/teen/ai-safety-reflex");
    }
  };

  const currentQuestionData = getCurrentQuestion();

  return (
    <GameShell
      title="Fake News Detector"
      subtitle={showResult ? "Game Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextGamePathProp="/student/ai-for-all/teen/ai-safety-reflex"
      nextGameIdProp="ai-teen-80"
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
      backPath="/games/ai-for-all/teens"
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
                <h3 className="text-2xl font-bold text-white mb-4">Fake News Detective!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {finalScore} out of {questions.length} correctly! ({Math.round((finalScore / questions.length) * 100)}%)
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  💡 Critical thinking and source verification help identify misinformation online!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {finalScore} out of {questions.length} correctly. ({Math.round((finalScore / questions.length) * 100)}%)
                  Keep practicing to improve your fake news detection skills!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  💡 Critical thinking and source verification help identify misinformation online!
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default FakeNewsDetectorGame;