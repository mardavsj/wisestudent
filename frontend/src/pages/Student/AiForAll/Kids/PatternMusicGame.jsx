import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PatternMusicGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentPattern, setCurrentPattern] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [choices, setChoices] = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const patterns = [
    {
      id: 1,
      pattern: ["👏", "👏", "⏸️"],
     
      choices: [
        { id: 1, text: "Clap-Clap-Pause", isCorrect: true },
        { id: 2, text: "Clap-Pause-Clap", isCorrect: false },
        { id: 3, text: "Pause-Clap-Clap", isCorrect: false }
      ]
    },
    {
      id: 2,
      pattern: ["👏", "⏸️", "👏"],
      
      choices: [
        { id: 1, text: "Clap-Clap-Pause", isCorrect: false },
        { id: 2, text: "Clap-Pause-Clap", isCorrect: true },
        { id: 3, text: "Clap-Clap-Clap-Pause", isCorrect: false }
      ]
    },
    {
      id: 3,
      pattern: ["👏", "👏", "👏", "⏸️"],
     
      choices: [
        { id: 1, text: "Clap-Pause-Clap-Pause", isCorrect: false },
        { id: 2, text: "Clap-Clap-Clap-Pause", isCorrect: true },
        { id: 3, text: "Clap-Pause-Clap", isCorrect: false }
      ]
    },
    {
      id: 4,
      pattern: ["⏸️", "👏", "👏"],
     
      choices: [
        { id: 1, text: "Pause-Clap-Clap", isCorrect: true },
        { id: 2, text: "Clap-Clap-Pause", isCorrect: false },
        { id: 3, text: "Clap-Pause-Clap-Pause", isCorrect: false }
      ]
    },
    {
      id: 5,
      pattern: ["👏", "⏸️", "👏", "⏸️"],
      
      choices: [
        { id: 1, text: "Clap-Clap-Pause", isCorrect: false },
        { id: 2, text: "Clap-Pause-Clap-Pause", isCorrect: true },
        { id: 3, text: "Pause-Clap-Clap", isCorrect: false }
      ]
    }
  ];

  const currentPatternData = patterns[currentPattern];

  const handleChoice = (choiceId) => {
    const choice = currentPatternData.choices.find((c) => c.id === choiceId);
    const isCorrect = choice.isCorrect;
    
    const newChoices = [...choices, { 
      questionId: currentPatternData.id, 
      choice: choiceId,
      isCorrect: isCorrect
    }];
    
    setChoices(newChoices);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    if (currentPattern < patterns.length - 1) {
      setTimeout(() => {
        setCurrentPattern(prev => prev + 1);
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
    setCurrentPattern(0);
    setScore(0);
    setCoins(0);
    setChoices([]);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/robot-vision-game");
  };

  return (
    <GameShell
      title="Pattern Music Game"
      score={score}
      subtitle={showResult ? "Game Complete!" : `Pattern ${currentPattern + 1} of ${patterns.length}`}
      onNext={handleNext}
      nextGamePathProp="/student/ai-for-all/kids/robot-vision-game"
      nextGameIdProp="ai-kids-14"
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      maxScore={patterns.length}
      gameId="ai-kids-13"
      gameType="ai"
      totalLevels={patterns.length}
      currentLevel={currentPattern + 1}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">What pattern is this?</h3>
            
            <div className="bg-purple-500/20 rounded-xl p-8 mb-6">
              <div className="flex justify-center items-center gap-3 mb-4">
                {currentPatternData.pattern.map((item, idx) => (
                  <div key={idx} className="text-6xl">{item}</div>
                ))}
              </div>
              <p className="text-white text-xl font-bold text-center">{currentPatternData.display}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentPatternData.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
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
                <h3 className="text-2xl font-bold text-white mb-4">Rhythm Master!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {finalScore} out of {patterns.length} correctly! ({Math.round((finalScore / patterns.length) * 100)}%)
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  💡 AI can detect patterns in music, speech, and sounds - just like you did!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {finalScore} out of {patterns.length} correctly. ({Math.round((finalScore / patterns.length) * 100)}%)
                  Keep practicing to learn more about pattern recognition!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  💡 AI can detect patterns in music, speech, and sounds - just like you did!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PatternMusicGame;