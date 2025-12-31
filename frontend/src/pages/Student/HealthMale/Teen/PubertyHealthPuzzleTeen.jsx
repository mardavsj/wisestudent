import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PubertyHealthPuzzleTeen = () => {
    const navigate = useNavigate();

    // Get game data from game category folder (source of truth)
    const gameId = "health-male-teen-34";

    // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
    const coinsPerLevel = 1;
    const totalCoins = 5;
    const totalXp = 10;

    const [score, setScore] = useState(0);
    const [matches, setMatches] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [selectedSolution, setSelectedSolution] = useState(null);
    const [gameFinished, setGameFinished] = useState(false);
    const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

    // Puberty Health Clues (left side)
const topics = [
  { id: 1, name: "Late-Night Alert Brain", emoji: "🧠", },
  { id: 2, name: "Sudden Sweat Spikes", emoji: "💦",  },
  { id: 3, name: "Red Inflamed Skin", emoji: "🔥",  },
  { id: 4, name: "Constant Irritability", emoji: "⚡",  },
  { id: 5, name: "Rapid Bone Stretching", emoji: "🦴",  }
];


    // Puberty Health Responses (right side)
const solutions = [
    { id: 1, name: "Low-Glycemic Eating", emoji: "🥦",  },
    { id: 2, name: "Antibacterial Fabric Choice", emoji: "👕",  },
    { id: 3, name: "Nervous System Reset", emoji: "🔁",  },
  { id: 4, name: "Consistent Wind-Down Routine", emoji: "🌙",  },
  { id: 5, name: "Stretch + Mobility Work", emoji: "🧘‍♂️",  },
];


    const correctMatches = [
  { topicId: 1, solutionId: 4 }, // Late-Night Alert Brain → Wind-Down Routine
  { topicId: 2, solutionId: 2 }, // Sudden Sweat Spikes → Antibacterial Fabric
  { topicId: 3, solutionId: 1 }, // Red Inflamed Skin → Low-Glycemic Eating
  { topicId: 4, solutionId: 3 }, // Constant Irritability → Nervous System Reset
  { topicId: 5, solutionId: 5 }  // Rapid Bone Stretching → Stretch + Mobility Work
];


    const handleTopicSelect = (topic) => {
        if (gameFinished) return;
        setSelectedTopic(topic);
    };

    const handleSolutionSelect = (solution) => {
        if (gameFinished) return;
        setSelectedSolution(solution);
    };

    const handleMatch = () => {
        if (!selectedTopic || !selectedSolution || gameFinished) return;

        resetFeedback();

        const newMatch = {
            topicId: selectedTopic.id,
            solutionId: selectedSolution.id,
            isCorrect: correctMatches.some(
                match => match.topicId === selectedTopic.id && match.solutionId === selectedSolution.id
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
        };

        // Check if all items are matched
        if (newMatches.length === topics.length) {
            setTimeout(() => {
                setGameFinished(true);
            }, 1500);
        }

        // Reset selections
        setSelectedTopic(null);
        setSelectedSolution(null);
    };

    // Check if a topic is already matched
    const isTopicMatched = (topicId) => {
        return matches.some(match => match.topicId === topicId);
    };

    // Check if a solution is already matched
    const isSolutionMatched = (solutionId) => {
        return matches.some(match => match.solutionId === solutionId);
    };

    // Get match result for a topic
    const getMatchResult = (topicId) => {
        const match = matches.find(m => m.topicId === topicId);
        return match ? match.isCorrect : null;
    };

    const handleNext = () => {
        navigate("/student/health-male/teens/shaving-story-teen");
    };

    return (
        <GameShell
            title="Puberty Health Puzzle"
            subtitle={gameFinished ? "Puzzle Complete!" : `Match Topics with Solutions (${matches.length}/${topics.length} matched)`}
            onNext={handleNext}
            nextEnabled={gameFinished}
            showGameOver={gameFinished}
            score={score}
            gameId={gameId}
            gameType="health-male"
            totalLevels={topics.length}
            currentLevel={matches.length + 1}
            showConfetti={gameFinished && score === topics.length}
            flashPoints={flashPoints}
            showAnswerConfetti={showAnswerConfetti}
            backPath="/games/health-male/teens"
            maxScore={topics.length}
            coinsPerLevel={coinsPerLevel}
            totalCoins={totalCoins}
            totalXp={totalXp}
        >
            <div className="space-y-8 max-w-4xl mx-auto">
                {!gameFinished ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left column - Puberty Health Topics */}
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <h3 className="text-xl font-bold text-white mb-4 text-center">Health Topics</h3>
                            <div className="space-y-4">
                                {topics.map(topic => (
                                    <button
                                        key={topic.id}
                                        onClick={() => handleTopicSelect(topic)}
                                        disabled={isTopicMatched(topic.id)}
                                        className={`w-full p-4 rounded-xl text-left transition-all ${
                                            isTopicMatched(topic.id)
                                                ? getMatchResult(topic.id)
                                                    ? "bg-green-500/30 border-2 border-green-500"
                                                    : "bg-red-500/30 border-2 border-red-500"
                                                : selectedTopic?.id === topic.id
                                                    ? "bg-blue-500/50 border-2 border-blue-400"
                                                    : "bg-white/10 hover:bg-white/20 border border-white/20"
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <div className="text-2xl mr-3">{topic.emoji}</div>
                                            <div>
                                                <h4 className="font-bold text-white">{topic.name}</h4>
                                                <p className="text-white/80 text-sm">{topic.description}</p>
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
                                    {selectedTopic 
                                        ? `Selected: ${selectedTopic.name}` 
                                        : "Select a Topic"}
                                </p>
                                <button
                                    onClick={handleMatch}
                                    disabled={!selectedTopic || !selectedSolution}
                                    className={`py-3 px-6 rounded-full font-bold transition-all ${
                                        selectedTopic && selectedSolution
                                            ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                                            : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                                    }`}
                                >
                                    Match
                                </button>
                                <div className="mt-4 text-white/80">
                                    <p>Score: {score}/{topics.length}</p>
                                    <p>Matched: {matches.length}/{topics.length}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right column - Solutions */}
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <h3 className="text-xl font-bold text-white mb-4 text-center">Solutions</h3>
                            <div className="space-y-4">
                                {solutions.map(solution => (
                                    <button
                                        key={solution.id}
                                        onClick={() => handleSolutionSelect(solution)}
                                        disabled={isSolutionMatched(solution.id)}
                                        className={`w-full p-4 rounded-xl text-left transition-all ${
                                            isSolutionMatched(solution.id)
                                                ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                                                : selectedSolution?.id === solution.id
                                                    ? "bg-purple-500/50 border-2 border-purple-400"
                                                    : "bg-white/10 hover:bg-white/20 border border-white/20"
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <div className="text-2xl mr-3">{solution.emoji}</div>
                                            <div>
                                                <h4 className="font-bold text-white">{solution.name}</h4>
                                                <p className="text-white/80 text-sm">{solution.description}</p>
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
                                    You correctly matched {score} out of {topics.length} puberty health topics with their solutions!
                                </p>
                                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                                    <span>+{score} Coins</span>
                                </div>
                                <p className="text-white/80">
                                    Lesson: Managing your health during puberty involves understanding the right solutions for common challenges!
                                </p>
                            </div>
                        ) : (
                            <div>
                                <div className="text-5xl mb-4">💪</div>
                                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                                <p className="text-white/90 text-lg mb-4">
                                    You matched {score} out of {topics.length} topics correctly.
                                </p>
                                <p className="text-white/80 text-sm">
                                    Tip: Think about which solution best addresses each health challenge!
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </GameShell>
    );
};

export default PubertyHealthPuzzleTeen;
