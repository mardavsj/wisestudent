// File: MemoryMatchPuzzle.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { Brain, Apple, Banana, Cherry, Grape, Cookie, Candy, IceCream, Timer, Trophy, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGameDataById } from '../../../../utils/getGameData';

const MemoryMatchPuzzle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-kids-44";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentLevel, setCurrentLevel] = useState(1);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const levelPairs = [3, 4, 5, 6, 8]; // Increasing difficulty
  const levelTimes = [60, 70, 80, 90, 120]; // Time per level

  // More colorful icons
  const iconTypes = [Apple, Banana, Cherry, Grape, Cookie, Candy, IceCream];

  // Initialize game
  useEffect(() => {
    const numPairs = levelPairs[currentLevel - 1];
    // Create pairs of icons
    let levelIcons = [];
    for (let i = 0; i < numPairs; i++) {
      const Icon = iconTypes[i % iconTypes.length];
      levelIcons.push({ id: i * 2, Icon, type: i });
      levelIcons.push({ id: i * 2 + 1, Icon, type: i });
    }
    
    // Shuffle the cards
    const shuffledIcons = [...levelIcons].sort(() => Math.random() - 0.5);
    
    setCards(shuffledIcons.map(card => ({ ...card, isFlipped: false, isMatched: false })));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTimeLeft(levelTimes[currentLevel - 1]);
    setIsTimerActive(true);
    setStreak(0);
  }, [currentLevel]);

  // Timer effect
  useEffect(() => {
    let timer;
    if (isTimerActive && timeLeft > 0 && !levelCompleted) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      // Time's up
      setIsTimerActive(false);
      setFeedbackType("wrong");
      setFeedbackMessage("Time's up! Try again.");
      setShowFeedback(true);
      setTimeout(() => {
        setShowFeedback(false);
        resetLevel();
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, isTimerActive, levelCompleted]);

  const handleFlip = (id) => {
    // Don't allow flipping if two cards are already flipped or if card is matched
    if (flipped.length >= 2 || matched.includes(id) || flipped.includes(id)) return;

    const newCards = cards.map(card => 
      card.id === id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [firstId, secondId] = newFlipped;
      
      // Find the actual card objects
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);
      
      // Check for match using the type property
      if (firstCard.type === secondCard.type) {
        // Match found
        const updatedCards = newCards.map(card => 
          card.id === firstId || card.id === secondId ? { ...card, isMatched: true } : card
        );
        setCards(updatedCards);
        
        setMatched([...matched, firstId, secondId]);
        setScore(prev => prev + 1); // 1 coin per correct match
        setStreak(streak + 1);
        setBestStreak(Math.max(bestStreak, streak + 1));
        
        setFeedbackType("correct");
        setFeedbackMessage(`Match! +1 coin`);
        setShowFeedback(true);
        
        // Reset flipped state immediately after match
        setFlipped([]);
        
        setTimeout(() => setShowFeedback(false), 1500);
        
        // Check if level is completed
        if (matched.length + 2 === cards.length) {
          setIsTimerActive(false);
          setFeedbackType("correct");
          setFeedbackMessage(`Level ${currentLevel} Complete!`);
          setShowFeedback(true);
          
          setTimeout(() => {
            if (currentLevel < 5) {
              setCurrentLevel(prev => prev + 1);
            } else {
              setLevelCompleted(true);
            }
            setShowFeedback(false);
          }, 2500);
        }
      } else {
        // No match
        setStreak(0);
        setFeedbackType("wrong");
        setFeedbackMessage("No match!");
        setShowFeedback(true);
        
        // Flip cards back after delay
        setTimeout(() => {
          const resetCards = newCards.map(card => 
            card.id === firstId || card.id === secondId ? { ...card, isFlipped: false } : card
          );
          setCards(resetCards);
          setFlipped([]);
          setShowFeedback(false);
        }, 1500);
      }
    }
  };

  const resetLevel = () => {
    const numPairs = levelPairs[currentLevel - 1];
    // Create pairs of icons
    let levelIcons = [];
    for (let i = 0; i < numPairs; i++) {
      const Icon = iconTypes[i % iconTypes.length];
      levelIcons.push({ id: i * 2, Icon, type: i });
      levelIcons.push({ id: i * 2 + 1, Icon, type: i });
    }
    
    // Shuffle the cards
    const shuffledIcons = [...levelIcons].sort(() => Math.random() - 0.5);
    
    setCards(shuffledIcons.map(card => ({ ...card, isFlipped: false, isMatched: false })));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTimeLeft(levelTimes[currentLevel - 1]);
    setIsTimerActive(true);
    setStreak(0);
  };

  const handleGameComplete = () => {
    navigate('/games/brain-health/kids');
  };

  // Get color for card based on icon type
  const getCardColor = (Icon) => {
    if (Icon === Apple) return 'bg-red-400';
    if (Icon === Banana) return 'bg-yellow-300';
    if (Icon === Cherry) return 'bg-red-500';
    if (Icon === Grape) return 'bg-purple-500';
    if (Icon === Cookie) return 'bg-amber-600';
    if (Icon === Candy) return 'bg-pink-400';
    if (Icon === IceCream) return 'bg-pink-200';
    return 'bg-blue-500';
  };

  return (
    <GameShell
      title="Memory Match Puzzle"
      score={score}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-kids-44"
      nextGamePathProp="/student/brain/kids/sharing-story"
      nextGameIdProp="brain-kids-45"
      gameType="brain-health"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/kids"
    
      maxScore={5} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-2 text-center">Memory Match Puzzle</h3>
        <p className="text-white/80 mb-4 text-center">Match the items! Find all pairs before time runs out.</p>
        
        {/* Game stats */}
        <div className="flex justify-between items-center mb-4 bg-white/10 rounded-lg p-2">
          <div className="text-center">
            <div className="text-xs text-white/70">Time</div>
            <div className={`font-bold ${timeLeft < 10 ? 'text-red-400 animate-pulse' : 'text-yellow-400'}`}>
              {timeLeft}s
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-white/70">Moves</div>
            <div className="font-bold text-blue-400">{moves}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-white/70">Streak</div>
            <div className="font-bold text-green-400">{streak}x</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-white/70">Best</div>
            <div className="font-bold text-purple-400">{bestStreak}x</div>
          </div>
        </div>
        
        <div className="rounded-2xl p-4 mb-4 bg-white/10 backdrop-blur-sm">
          {/* Level info */}
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm font-semibold text-white/90">
              Level {currentLevel}: {levelPairs[currentLevel - 1]} Pairs
            </div>
            <button 
              onClick={resetLevel}
              className="flex items-center text-xs bg-white/20 hover:bg-white/30 rounded-full px-3 py-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </button>
          </div>
          
          {/* Game board */}
          <div className={`grid gap-3 ${
            levelPairs[currentLevel - 1] <= 4 ? 'grid-cols-4' : 
            levelPairs[currentLevel - 1] <= 6 ? 'grid-cols-5' : 'grid-cols-6'
          }`}>
            <AnimatePresence>
              {cards.map(({ id, Icon, isFlipped, isMatched }) => (
                <motion.div
                  key={id}
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFlip(id)}
                  className={`
                    aspect-square rounded-xl cursor-pointer flex items-center justify-center
                    transition-all duration-300 relative
                    ${isMatched 
                      ? `${getCardColor(Icon)} text-white shadow-lg` 
                      : isFlipped 
                        ? 'bg-white text-black shadow-md' 
                        : 'bg-gradient-to-br from-blue-400 to-purple-500 text-white shadow-lg'
                    }
                    ${!isMatched && !isFlipped ? 'hover:from-blue-500 hover:to-purple-600' : ''}
                  `}
                >
                  {isMatched || isFlipped ? (
                    <motion.div
                      initial={{ rotateY: 180 }}
                      animate={{ rotateY: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ rotateY: 0 }}
                      animate={{ rotateY: isFlipped ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-2xl font-bold"
                    >
                      ?
                    </motion.div>
                  )}
                  
                  {/* Match indicator */}
                  {isMatched && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1"
                    >
                      <Trophy className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-white/70 mb-1">
            <span>Progress</span>
            <span>{matched.length/2} / {levelPairs[currentLevel - 1]}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(matched.length/2) / levelPairs[currentLevel - 1] * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* Feedback */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4"
            >
              <FeedbackBubble 
                message={feedbackMessage}
                type={feedbackType}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Completion screen */}
        {levelCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-bounce" />
            <h3 className="text-2xl font-bold text-white mb-2">Puzzle Master!</h3>
            <p className="text-white/80 mb-4">You completed all levels with {score} points!</p>
            <div className="flex justify-center space-x-4 mb-4">
              <div className="bg-blue-500/20 rounded-lg p-2">
                <div className="text-lg font-bold text-blue-300">{moves}</div>
                <div className="text-xs text-white/70">Moves</div>
              </div>
              <div className="bg-green-500/20 rounded-lg p-2">
                <div className="text-lg font-bold text-green-300">{bestStreak}x</div>
                <div className="text-xs text-white/70">Best Streak</div>
              </div>
            </div>
          </motion.div>
        )}
      </GameCard>
    </GameShell>
  );
};

export default MemoryMatchPuzzle;