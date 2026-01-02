import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PeriodToolsPuzzle = () => {
    const navigate = useNavigate();
    
    // Hardcoded Game Rewards & Configuration
    const coinsPerLevel = 1;
    const totalCoins = 5;
    const totalXp = 10;
    const maxScore = 5;
    const gameId = "health-female-kids-94";
    
    const [score, setScore] = useState(0);
    const [matches, setMatches] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedPurpose, setSelectedPurpose] = useState(null);
    const [gameFinished, setGameFinished] = useState(false);
    const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
    
    // Period Items (left side) - 5 items
    const items = [
        { id: 1, name: "Menstrual Pad", emoji: "🩸",  },
        { id: 2, name: "Heating Pad", emoji: "🔥",  },
        { id: 3, name: "Calendar", emoji: "📅",  },
        { id: 4, name: "Wet Wipes", emoji: "🧻",  },
        { id: 5, name: "Pain Reliever", emoji: "💊",  }
    ];
    
    // Purposes (right side) - 5 items (shuffled order)
    const purposes = [
        { id: 4, text: "Gentle cleansing without water",  },
        { id: 1, text: "Absorbs menstrual blood flow",  },
        { id: 5, text: "Reduces menstrual cramps and pain",  },
        { id: 2, text: "Eases abdominal and back pain",  },
        { id: 3, text: "Tracks menstrual cycle dates",  }
    ];
    
    // Correct matches
    const correctMatches = [
        { itemId: 1, purposeId: 1 }, // Menstrual Pad → Absorbs menstrual blood flow
        { itemId: 2, purposeId: 2 }, // Heating Pad → Eases abdominal and back pain
        { itemId: 3, purposeId: 3 }, // Calendar → Tracks menstrual cycle dates
        { itemId: 4, purposeId: 4 }, // Wet Wipes → Gentle cleansing without water
        { itemId: 5, purposeId: 5 }  // Pain Reliever → Reduces menstrual cramps and pain
    ];
    
    const handleItemSelect = (item) => {
        if (gameFinished) return;
        setSelectedItem(item);
    };
    
    const handlePurposeSelect = (purpose) => {
        if (gameFinished) return;
        setSelectedPurpose(purpose);
    };
    
    const handleMatch = () => {
        if (!selectedItem || !selectedPurpose || gameFinished) return;
        
        resetFeedback();
        
        const newMatch = {
            itemId: selectedItem.id,
            purposeId: selectedPurpose.id,
            isCorrect: correctMatches.some(
                match => match.itemId === selectedItem.id && match.purposeId === selectedPurpose.id
            )
        };
        
        const newMatches = [...matches, newMatch];
        setMatches(newMatches);
        
        // If the match is correct, add score and show flash/confetti
        if (newMatch.isCorrect) {
            setScore(prev => prev + 1);
            showCorrectAnswerFeedback(1, true);
        } else {
            showCorrectAnswerFeedback(0, false);
        }
        
        // Check if all items are matched
        if (newMatches.length === items.length) {
            setTimeout(() => {
                setGameFinished(true);
            }, 1500);
        }
        
        // Reset selections
        setSelectedItem(null);
        setSelectedPurpose(null);
    };
    
    const handleTryAgain = () => {
        setGameFinished(false);
        setMatches([]);
        setSelectedItem(null);
        setSelectedPurpose(null);
        setScore(0);
        resetFeedback();
    };
    
    const handleNext = () => {
        navigate("/games/health-female/kids");
    };
    
    // Check if an item is already matched
    const isItemMatched = (itemId) => {
        return matches.some(match => match.itemId === itemId);
    };
    
    // Check if a purpose is already matched
    const isPurposeMatched = (purposeId) => {
        return matches.some(match => match.purposeId === purposeId);
    };
    
    // Get match result for an item
    const getMatchResult = (itemId) => {
        const match = matches.find(m => m.itemId === itemId);
        return match ? match.isCorrect : null;
    };

    return (
        <GameShell
            title="Puzzle: Period Tools"
            subtitle={gameFinished ? "Game Complete!" : `Match Items with Purposes (${matches.length}/${items.length} matched)`}
            onNext={handleNext}
            nextEnabled={gameFinished}
            showGameOver={gameFinished}
            score={score}
            gameId={gameId}
            gameType="health-female"
            totalLevels={items.length}
            currentLevel={matches.length + 1}
            showConfetti={gameFinished}
            flashPoints={flashPoints}
            backPath="/games/health-female/kids"
            showAnswerConfetti={showAnswerConfetti}
            maxScore={maxScore}
            coinsPerLevel={coinsPerLevel}
            totalCoins={totalCoins}
            totalXp={totalXp}>
            <div className="space-y-8 max-w-4xl mx-auto">
                {!gameFinished ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left column - Items */}
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <h3 className="text-xl font-bold text-white mb-4 text-center">Period Items</h3>
                            <div className="space-y-4">
                                {items.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleItemSelect(item)}
                                        disabled={isItemMatched(item.id)}
                                        className={`w-full p-4 rounded-xl text-left transition-all ${
                                            isItemMatched(item.id)
                                                ? getMatchResult(item.id)
                                                    ? "bg-green-500/30 border-2 border-green-500"
                                                    : "bg-red-500/30 border-2 border-red-500"
                                                : selectedItem?.id === item.id
                                                ? "bg-blue-500/50 border-2 border-blue-400"
                                                : "bg-white/10 hover:bg-white/20 border border-white/20"
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <div className="text-2xl mr-3">{item.emoji}</div>
                                            <div>
                                                <h4 className="font-bold text-white">{item.name}</h4>
                                                <p className="text-white/80 text-sm">{item.hint}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        {/* Middle column - Match button */}
                        <div className="flex flex-col items-center justify-center">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
                                <p className="text-white/80 mb-4">
                                    {selectedItem 
                                        ? `Selected: ${selectedItem.name}` 
                                        : "Select an Item"}
                                </p>
                                <button
                                    onClick={handleMatch}
                                    disabled={!selectedItem || !selectedPurpose}
                                    className={`py-3 px-6 rounded-full font-bold transition-all ${
                                        selectedItem && selectedPurpose
                                            ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                                            : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                                    }`}
                                >
                                    Match
                                </button>
                                <div className="mt-4 text-white/80">
                                    <p>Score: {score}/{items.length}</p>
                                    <p>Matched: {matches.length}/{items.length}</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Right column - Purposes */}
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <h3 className="text-xl font-bold text-white mb-4 text-center">Purposes</h3>
                            <div className="space-y-4">
                                {purposes.map(purpose => (
                                    <button
                                        key={purpose.id}
                                        onClick={() => handlePurposeSelect(purpose)}
                                        disabled={isPurposeMatched(purpose.id)}
                                        className={`w-full p-4 rounded-xl text-left transition-all ${
                                            isPurposeMatched(purpose.id)
                                                ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                                                : selectedPurpose?.id === purpose.id
                                                ? "bg-purple-500/50 border-2 border-purple-400"
                                                : "bg-white/10 hover:bg-white/20 border border-white/20"
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <div>
                                                <h4 className="font-bold text-white">{purpose.text}</h4>
                                                <p className="text-white/80 text-sm">{purpose.hint}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
                        {score >= 3 ? (
                            <div>
                                <div className="text-5xl mb-4">🎉</div>
                                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                                <p className="text-white/90 text-lg mb-4">
                                    You correctly matched {score} out of {items.length} period items with their purposes!
                                </p>
                                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                                    <span>+{score} Coins</span>
                                </div>
                                <p className="text-white/80">
                                    Lesson: Understanding period tools and their purposes helps manage menstruation with confidence!
                                </p>
                            </div>
                        ) : (
                            <div>
                                <div className="text-5xl mb-4">💪</div>
                                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                                <p className="text-white/90 text-lg mb-4">
                                    You matched {score} out of {items.length} items correctly.
                                </p>
                                <button
                                    onClick={handleTryAgain}
                                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                                >
                                    Try Again
                                </button>
                                <p className="text-white/80 text-sm">
                                    Tip: Think about what each period item is designed to accomplish!
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </GameShell>
    );
};

export default PeriodToolsPuzzle;