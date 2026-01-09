import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getAiTeenGames } from "../../../../pages/Games/GameCategories/AiForAll/teenGamesData";

const MusicPlaylistAI = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-teen-32";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  // Find next game path and ID if not provided in location.state
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    try {
      const games = getAiTeenGames({});
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
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      id: 1,
      text: "How does AI create personalized music playlists?",
      emoji: "🎵",
      options: [
        { 
          id: 1, 
          text: "Analyzes listening habits", 
          emoji: "📊",
          isCorrect: true
        },
        { 
          id: 2, 
          text: "Random song selection", 
          emoji: "🎲",
          isCorrect: false
        },
        { 
          id: 3, 
          text: "Only uses popular songs", 
          emoji: "🔥", 
          isCorrect: false
        }
      ],
      explanation: "Analyzes listening habits! AI music systems study what songs you play, skip, replay, and save to understand your preferences. This data helps create playlists tailored specifically to your taste, making music discovery more enjoyable and relevant."
    },
    {
      id: 2,
      text: "What technique helps AI recommend similar artists?",
      emoji: "🎸",
      options: [
         { 
          id: 1, 
          text: "Random guessing", 
          emoji: "🔮", 
          isCorrect: false
        },
        { 
          id: 2, 
          text: "Collaborative filtering", 
          emoji: "👥", 
          isCorrect: true
        },
       
        { 
          id: 3, 
          text: "Artist popularity ranking", 
          emoji: "🏆", 
          isCorrect: false
        }
      ],
      explanation: "Collaborative filtering! This technique finds users with similar listening habits and recommends music that those similar listeners enjoy. If people who like the same songs as you also enjoy a particular artist, AI will likely recommend that artist to you."
    },
    {
      id: 3,
      text: "What helps AI understand song characteristics?",
      emoji: "🎼",
      options: [
        { 
          id: 1, 
          text: "Song length only", 
          emoji: "⏱️", 
          isCorrect: false
        },
        { 
          id: 2, 
          text: "Audio analysis", 
          emoji: "🔍", 
          isCorrect: true
        },
        
        { 
          id: 3, 
          text: "Release date", 
          emoji: "📅",
          isCorrect: false
        }
      ],
      explanation: "Audio analysis! AI examines musical elements like tempo, key, rhythm, and instrumentation to understand what makes songs similar. This allows the system to recommend tracks with comparable sounds even from different artists or genres."
    },
    {
      id: 4,
      text: "Why is mood detection important for music AI?",
      emoji: "😊",
      options: [
        { 
          id: 1, 
          text: "Matches songs to feelings", 
          emoji: "❤️",
          isCorrect: true
        },
        { 
          id: 2, 
          text: "Increases app downloads", 
          emoji: "📱", 
          isCorrect: false
        },
        { 
          id: 3, 
          text: "Reduces battery usage", 
          emoji: "🔋", 
          isCorrect: false
        }
      ],
      explanation: "Matches songs to feelings! Mood detection allows AI to suggest uplifting songs when you're energetic or calming tracks when you're relaxed. This emotional intelligence makes music streaming more intuitive and personally meaningful."
    },
    {
      id: 5,
      text: "What data source is most valuable for music AI?",
      emoji: "💾",
      options: [
        
        { 
          id: 2, 
          text: "Radio station playlists", 
          emoji: "📻", 
          isCorrect: false
        },
        { 
          id: 3, 
          text: "Chart rankings", 
          emoji: "🏅", 
          isCorrect: false
        },
        { 
          id: 1, 
          text: "User interaction patterns", 
          emoji: "📈", 
          isCorrect: true
        },
      ],
      explanation: "User interaction patterns! How you actually engage with music (playing, skipping, saving) reveals your genuine preferences better than any external chart or playlist. This behavioral data is gold for creating truly personalized music experiences."
    }
  ];

  const handleAnswer = (optionId) => {
    if (answered || levelCompleted) return;
    
    setAnswered(true);
    setSelectedOption(optionId);
    resetFeedback();
    
    const currentQuestionData = questions[currentQuestion];
    const selectedOptionData = currentQuestionData.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOptionData?.isCorrect || false;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setAnswered(false);
        resetFeedback();
      } else {
        setLevelCompleted(true);
      }
    }, isCorrect ? 1000 : 800);
  };

  const currentQuestionData = questions[currentQuestion];
  const finalScore = score;

  return (
    <GameShell
      title="Music Playlist AI"
      subtitle={levelCompleted ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      score={finalScore}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      nextGamePathProp="/student/ai-for-all/teen/airport-security-story"
      nextGameIdProp="ai-teen-33"
      gameType="ai"
      showGameOver={levelCompleted}
      maxScore={questions.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
      showConfetti={levelCompleted && finalScore >= 3}
    >
      <div className="space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
        {!levelCompleted && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {finalScore}/{questions.length}</span>
              </div>
              
              <div className="text-6xl mb-4 text-center">{currentQuestionData.emoji}</div>
              
              <p className="text-white text-lg md:text-xl mb-6 text-center">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options.map(option => {
                  const isSelected = selectedOption === option.id;
                  const showCorrect = answered && option.isCorrect;
                  const showIncorrect = answered && isSelected && !option.isCorrect;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(option.id)}
                      disabled={answered}
                      className={`p-6 rounded-2xl shadow-lg transition-all transform text-center ${
                        showCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : showIncorrect
                          ? "bg-red-500/20 border-2 border-red-400 opacity-75"
                          : isSelected
                          ? "bg-blue-600 border-2 border-blue-300 scale-105"
                          : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                      } ${answered ? "cursor-not-allowed" : ""}`}
                    >
                      <div className="text-2xl mb-2">{option.emoji}</div>
                      <h4 className="font-bold text-base mb-2">{option.text}</h4>
                      <p className="text-white/90 text-sm">{option.description}</p>
                    </button>
                  );
                })}
              </div>
              
              {answered && (
                <div className={`rounded-lg p-4 mt-6 ${
                  currentQuestionData.options.find(opt => opt.id === selectedOption)?.isCorrect
                    ? "bg-green-500/20"
                    : "bg-red-500/20"
                }`}>
                  <p className="text-white text-center">
                    {currentQuestionData.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default MusicPlaylistAI;