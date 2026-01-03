import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';
import { getBrainTeenGames } from '../../../../pages/Games/GameCategories/Brain/teenGamesData';

const DebateSleepVsStudy = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-66";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  // Find next game path and ID if not provided in location.state
  const { nextGamePath, nextGameId } = useMemo(() => {
    // First, try to get from location.state (passed from GameCategoryPage)
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    // Fallback: find next game from game data
    try {
      const games = getBrainTeenGames({});
      const currentGame = games.find(g => g.id === gameId);
      if (currentGame && currentGame.index !== undefined) {
        const nextGame = games.find(g => g.index === currentGame.index + 1 && g.isSpecial && g.path);
        return {
          nextGamePath: nextGame ? nextGame.path : null,
          nextGameId: nextGame ? nextGame.id : null
        };
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
    }
    
    return { nextGamePath: null, nextGameId: null };
  }, [location.state, gameId]);
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      id: 1,
      text: "Is it better to sleep or study late? ",
      choices: [
        { id: 'a', text: 'sleep first, then study' },
        { id: 'b', text: 'Study all night, skip sleep' },
        { id: 'c', text: 'Sleep all the time, never study' }
      ],
      correct: 'a',
      explanation: 'A balanced approach prioritizing sleep first ensures better memory consolidation, focus, and learning when you study the next day!'
    },
    {
      id: 2,
      text: "What happens when you sacrifice sleep to study?",
      choices: [
        { id: 'b', text: 'Better learning and memory' },
        { id: 'a', text: 'Poor memory retention and reduced learning efficiency' },
        { id: 'c', text: 'No effect on learning' }
      ],
      correct: 'a',
      explanation: 'Sacrificing sleep actually reduces memory consolidation and learning efficiency, making your study time less effective!'
    },
    {
      id: 3,
      text: "What's the best strategy for exam preparation?",
      choices: [
        { id: 'b', text: 'Stay up all night cramming' },
        { id: 'c', text: 'Skip sleep for multiple nights' },
        { id: 'a', text: 'Get adequate sleep and study during the day' }
      ],
      correct: 'a',
      explanation: 'Getting adequate sleep and studying during the day when you\'re alert leads to better retention and exam performance!'
    },
    {
      id: 4,
      text: "How does sleep help with studying?",
      choices: [
        { id: 'a', text: 'Sleep consolidates memories and improves recall' },
        { id: 'b', text: 'Sleep has no effect on memory' },
        { id: 'c', text: 'Less sleep improves memory' }
      ],
      correct: 'a',
      explanation: 'During sleep, your brain consolidates memories, processes information, and strengthens neural connections, improving recall!'
    },
    {
      id: 5,
      text: "What's the ideal balance between sleep and study?",
      choices: [
        { id: 'b', text: 'Study all night, sleep during the day' },
        { id: 'c', text: 'Study constantly, sleep only when exhausted' },
        { id: 'a', text: 'Prioritize 8-10 hours sleep, study during peak alertness' }
      ],
      correct: 'a',
      explanation: 'Prioritizing 8-10 hours of sleep and studying during your peak alertness hours maximizes learning efficiency and retention!'
    }
  ];

  const handleOptionSelect = (optionId) => {
    if (selectedOption || levelCompleted) return;
    
    setSelectedOption(optionId);
    const isCorrect = optionId === questions[currentQuestion].correct;
    setFeedbackType(isCorrect ? "correct" : "wrong");
    setShowFeedback(true);
    resetFeedback();
    
    // Save answer
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: {
        selected: optionId,
        correct: isCorrect
      }
    }));
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    // Auto-advance to next question after delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
        setShowFeedback(false);
        setFeedbackType(null);
      } else {
        setLevelCompleted(true);
      }
    }, 1500);
  };

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (levelCompleted) {
      console.log(`🎮 Debate: Sleep vs Study game completed! Score: ${score}/${questions.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
      // Update location state with nextGameId for GameOverModal
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [levelCompleted, score, gameId, nextGamePath, nextGameId, questions.length]);

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Debate: Sleep vs Study"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="brain"
      showGameOver={levelCompleted}
      maxScore={questions.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto px-4">
        {!levelCompleted && currentQuestionData ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <span className="text-white/80 text-sm md:text-base">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold text-sm md:text-base">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-base md:text-lg lg:text-xl mb-4 md:mb-6 text-center">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {currentQuestionData.choices.map((choice) => {
                  const isSelected = selectedOption === choice.id;
                  const showCorrect = showFeedback && isSelected && choice.id === questions[currentQuestion].correct;
                  const showIncorrect = showFeedback && isSelected && choice.id !== questions[currentQuestion].correct;
                  
                  return (
                    <button
                      key={choice.id}
                      onClick={() => handleOptionSelect(choice.id)}
                      disabled={!!selectedOption}
                      className={`p-4 md:p-6 rounded-xl md:rounded-2xl transition-all transform ${
                        showCorrect
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 border-2 border-green-300 scale-105"
                          : showIncorrect
                          ? "bg-gradient-to-r from-red-500 to-red-600 border-2 border-red-300"
                          : isSelected
                          ? "bg-gradient-to-r from-blue-600 to-cyan-700 border-2 border-blue-300 scale-105"
                          : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 border-2 border-transparent hover:scale-105"
                      } disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none text-white font-bold text-sm md:text-base`}
                    >
                      {choice.text}
                    </button>
                  );
                })}
              </div>
              
              {showFeedback && feedbackType === "wrong" && (
                <div className="mt-4 md:mt-6 text-white/90 text-center text-sm md:text-base">
                  <p>💡 {currentQuestionData.explanation}</p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default DebateSleepVsStudy;
