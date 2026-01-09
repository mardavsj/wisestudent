import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TrainAIWithSounds = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("ai-kids-64");
  const gameId = gameData?.id || "ai-kids-64";
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  // Questions about training AI with sounds (exactly 5 questions with 3 options each)
  const questions = [
    {
      id: 1,
      text: "How should we train AI to recognize dog barks?",
      options: [
        { 
          id: "examples", 
          text: "Provide many examples of dog barks ", 
          emoji: "📚", 
          isCorrect: true
        },
        { 
          id: "once", 
          text: "Play one bark sound once ", 
          emoji: "🎵", 
          isCorrect: false
        },
        { 
          id: "guess", 
          text: "Let AI guess without examples ", 
          emoji: "🤔", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What's the best way to help AI distinguish between cat meows and dog barks?",
      options: [
       
        { 
          id: "mix", 
          text: "Mix all sounds together randomly ", 
          emoji: "🔀", 
          isCorrect: false
        },
        { 
          id: "silent", 
          text: "Train with silent recordings ", 
          emoji: "🤫", 
          isCorrect: false
        },
         { 
          id: "labels", 
          text: "Label each sound correctly ", 
          emoji: "🏷️", 
          isCorrect: true
        },
      ]
    },
    {
      id: 3,
      text: "Why is variety important when training AI with sounds?",
      options: [
        
        { 
          id: "same", 
          text: "Using the same sound repeatedly is best ", 
          emoji: "📻", 
          isCorrect: false
        },
        { 
          id: "variety", 
          text: "Different environments, pitches, and tones help AI generalize ", 
          emoji: "🔄", 
          isCorrect: true
        },
        { 
          id: "loud", 
          text: "Only use extremely loud sounds ", 
          emoji: "📢", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What helps AI learn to recognize sounds in noisy places?",
      options: [
        
        { 
          id: "quiet", 
          text: "Only train in perfectly quiet rooms ", 
          emoji: "🤫", 
          isCorrect: false
        },
        { 
          id: "noise", 
          text: "Train with background noise examples ", 
          emoji: "🎧", 
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Ignore background sounds completely ", 
          emoji: "🚫", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How often should we update AI's sound recognition training?",
      options: [
        
        { 
          id: "never", 
          text: "Never update after initial training ", 
          emoji: "🛑", 
          isCorrect: false
        },
        { 
          id: "random", 
          text: "Update randomly without a plan ", 
          emoji: "🔀", 
          isCorrect: false
        },
        { 
          id: "regular", 
          text: "Regular updates with new sound examples ", 
          emoji: "📅", 
          isCorrect: true
        }
      ]
    }
  ];

  // Function to get options without rotation - keeping actual positions fixed
  const getRotatedOptions = (options, questionIndex) => {
    // Return options without any rotation to keep their actual positions fixed
    return options;
  };

  const getCurrentQuestion = () => questions[currentQuestion];
  const displayOptions = getRotatedOptions(getCurrentQuestion().options, currentQuestion);

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
      }, isCorrect ? 1000 : 0);
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
    navigate("/student/ai-for-all/kids/robot-exam-story");
  };

  return (
    <GameShell
      title="Train AI with Sounds"
      score={coins}
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextGamePathProp="/student/ai-for-all/kids/robot-exam-story"
      nextGameIdProp="ai-kids-65"
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      
      gameId={gameId}
      gameType="ai"
      totalLevels={100}
      currentLevel={64}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
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
                {displayOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-xl">{option.text}</h3>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">👂</div>
                <h3 className="text-2xl font-bold text-white mb-4">Sound Training Expert!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You understand how to train AI with sounds!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white/90 text-sm">
                    🌟 Excellent! You know that training AI with sounds requires consistent examples, correct labels, variety, noise training, and regular updates!
                  </p>
                </div>
                <p className="text-white/80">
                  Your knowledge helps robots learn to recognize sounds in the real world!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Keep practicing to learn more about training AI with sounds!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white/90 text-sm">
                    💡 Remember: Training AI with sounds works best with consistent examples, correct labels, variety, noise training, and regular updates!
                  </p>
                </div>
                <p className="text-white/80 text-sm">
                  Think about what helps AI learn to recognize sounds in various environments.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default TrainAIWithSounds;