import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getAiTeenGames } from '../../../../pages/Games/GameCategories/AiForAll/teenGamesData';

const ImageClassifierGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("ai-teen-3");
  const gameId = gameData?.id || "ai-teen-3";
  
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
      title: "Image Classification",
      emoji: "🖼️",
      question: "What technology helps computers recognize objects in photos?",
      choices: [
        { id: 1, text: "Magic Powers", emoji: "✨", isCorrect: false },
        { id: 2, text: "Manual Sorting", emoji: "✋", isCorrect: false },
        { id: 3, text: "Image Recognition AI", emoji: "🤖", isCorrect: true },
      ],
    },
    {
      id: 2,
      title: "Medical Imaging",
      emoji: "🏥",
      question: "How do doctors use AI to analyze X-rays?",
      choices: [
        { id: 1, text: "AI spots issues", emoji: "🔍", isCorrect: true },
        { id: 2, text: "Doctors guess", emoji: "🤔", isCorrect: false },
        { id: 3, text: "Patients diagnose", emoji: "👤", isCorrect: false },
      ],
    },
    {
      id: 3,
      title: "Social Media",
      emoji: "📱",
      question: "How does Facebook recognize faces in photos?",
      choices: [
        { id: 1, text: "Manual tagging", emoji: "✍️", isCorrect: false },
        { id: 2, text: "Facial Recognition", emoji: "👁️", isCorrect: true },
        { id: 3, text: "Pure luck", emoji: "🍀", isCorrect: false },
      ],
    },
    {
      id: 4,
      title: "Self-Driving Cars",
      emoji: "🚗",
      question: "What helps autonomous vehicles see obstacles?",
      choices: [
        { id: 1, text: "Computer Vision", emoji: "🚦", isCorrect: true },
        { id: 2, text: "Driver instincts", emoji: "🧠", isCorrect: false },
        { id: 3, text: "Blind driving", emoji: "🙈", isCorrect: false },
      ],
    },
    {
      id: 5,
      title: "Security Systems",
      emoji: "🔒",
      question: "What technology identifies people at airport security?",
      choices: [
        { id: 1, text: "Manual checks", emoji: "📋", isCorrect: false },
        { id: 2, text: "Psychic powers", emoji: "🔮", isCorrect: false },
        { id: 3, text: "Biometric Scanning", emoji: "📸", isCorrect: true },
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
          navigate("/student/ai-for-all/teen/human-vs-ai-quiz");
        }
      } else {
        navigate("/student/ai-for-all/teen/human-vs-ai-quiz");
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
      navigate("/student/ai-for-all/teen/human-vs-ai-quiz");
    }
  };

  const currentQuestionData = getCurrentQuestion();

  return (
    <GameShell
      title="Image Classifier Game"
      subtitle={showResult ? "Game Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextGamePathProp="/student/ai-for-all/teen/human-vs-ai-quiz"
      nextGameIdProp="ai-teen-4"
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
                <h3 className="text-2xl font-bold text-white mb-4">Classification Expert!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {finalScore} out of {questions.length} correctly! ({Math.round((finalScore / questions.length) * 100)}%)
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  💡 Image classification is a core AI task! AI systems use this to identify objects, faces, and even medical conditions in X-rays!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {finalScore} out of {questions.length} correctly. ({Math.round((finalScore / questions.length) * 100)}%)
                  Keep practicing to learn more about image classification!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  💡 Image classification is a core AI task! AI systems use this to identify objects, faces, and even medical conditions in X-rays!
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default ImageClassifierGame;


