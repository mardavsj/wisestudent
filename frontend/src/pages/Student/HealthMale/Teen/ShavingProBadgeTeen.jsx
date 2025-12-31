import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle, Heart, UserCheck, CheckCircle, Badge } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ShavingProBadgeTeen = () => {
    const navigate = useNavigate();

    // Get game data from game category folder (source of truth)
    const gameId = "health-male-teen-40";

    // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
    const coinsPerLevel = 1;
    const totalCoins = 5;
    const totalXp = 10;

    const { showCorrectAnswerFeedback, flashPoints, showAnswerConfetti, resetFeedback } = useGameFeedback();
    const [currentLevel, setCurrentLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [answered, setAnswered] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);

   const levels = [
    {
        id: 1,
        title: "Skin Awareness",
        question: "Your skin feels tight and itchy before shaving. What should you do?",
        icon: UserCheck,
        options: [
            { id: "a", text: "Shave Immediately", emoji: "⚡", correct: false },
            { id: "b", text: "Add Fragrance", emoji: "🌸", correct: false },
            { id: "c", text: "Hydrate Skin First", emoji: "💧", correct: true },
            { id: "d", text: "Use Extra Pressure", emoji: "💪", correct: false }
        ],
        feedback: {
            correct: "Correct! Hydrated skin reduces irritation.",
            wrong: "Dry skin increases cuts and razor burn."
        }
    },
    {
        id: 2,
        title: "Blade Control",
        question: "Hair keeps clogging your razor mid-shave. Best move?",
        icon: Shield,
        options: [
            { id: "a", text: "Keep Shaving", emoji: "🏃", correct: false },
            { id: "b", text: "Tap Razor Dry", emoji: "🧻", correct: false },
            { id: "d", text: "Shake Aggressively", emoji: "🤜", correct: false },
            { id: "c", text: "Rinse Blade Often", emoji: "🚿", correct: true },
        ],
        feedback: {
            correct: "Exactly! A clean blade shaves safely.",
            wrong: "Clogged blades pull hair and damage skin."
        }
    },
    {
        id: 3,
        title: "Product Knowledge",
        question: "Which ingredient is BEST for sensitive skin?",
        icon: AlertTriangle,
        options: [
            { id: "c", text: "Aloe Vera", emoji: "🌿", correct: true },
            { id: "a", text: "Alcohol", emoji: "🔥", correct: false },
            { id: "b", text: "Menthol", emoji: "❄️", correct: false },
            { id: "d", text: "Strong Fragrance", emoji: "💨", correct: false }
        ],
        feedback: {
            correct: "Right! Aloe soothes and heals skin.",
            wrong: "Harsh ingredients irritate sensitive skin."
        }
    },
    {
        id: 4,
        title: "Technique Mastery",
        question: "You feel razor drag on your skin. What does this signal?",
        icon: Heart,
        options: [
            { id: "a", text: "Skin Is Dirty", emoji: "🧼", correct: false },
            { id: "b", text: "Blade Needs Attention", emoji: "🪒", correct: true },
            { id: "c", text: "Hair Is Stronger", emoji: "💪", correct: false },
            { id: "d", text: "Shave Faster", emoji: "⚡", correct: false }
        ],
        feedback: {
            correct: "Correct! Drag means blade or lubrication issue.",
            wrong: "Ignoring drag causes razor burn and cuts."
        }
    },
    {
        id: 5,
        title: "Pro Decision",
        question: "You notice redness spreading after shaving. Pro response?",
        icon: Badge,
        options: [
            { id: "a", text: "Apply Heat", emoji: "🔥", correct: false },
            { id: "b", text: "Scratch Area", emoji: "💅", correct: false },
            { id: "c", text: "Apply Cooling Balm", emoji: "❄️", correct: true },
            { id: "d", text: "Shave Again", emoji: "🔁", correct: false }
        ],
        feedback: {
            correct: "Excellent! Calm the skin immediately.",
            wrong: "Redness means inflammation — treat gently."
        }
    }
];


    const currentLevelData = levels[currentLevel - 1];
    const Icon = currentLevelData?.icon;

    const handleAnswer = (optionIndex) => {
        if (answered) return;

        const selectedOption = currentLevelData.options[optionIndex];
        setSelectedAnswer(selectedOption);
        setAnswered(true);
        resetFeedback();

        const isCorrect = selectedOption.correct;
        const isLastQuestion = currentLevel === 5;

        if (isCorrect) {
            setScore(prev => prev + 1);
            showCorrectAnswerFeedback(1, true);
        }

        setTimeout(() => {
            if (isLastQuestion) {
                setShowResult(true);
            } else {
                setCurrentLevel(prev => prev + 1);
                setAnswered(false);
                setSelectedAnswer(null);
            }
        }, 2000);
    };

    const handleNext = () => {
        // Navigate to next category or menu
        navigate("/student/health-male/teens");
    };

    return (
        <GameShell
            title="Shaving Pro Badge"
            subtitle={!showResult ? `Challenge ${currentLevel} of 5` : "Badge Earned!"}
            onNext={handleNext}
            nextEnabled={showResult}
            showGameOver={showResult}
            score={score}
            gameId={gameId}
            gameType="health-male"
            flashPoints={flashPoints}
            showAnswerConfetti={showAnswerConfetti}
            maxScore={levels.length}
            coinsPerLevel={coinsPerLevel}
            totalCoins={totalCoins}
            totalXp={totalXp}
        >
            <div className="text-center text-white space-y-6">
                {!showResult && currentLevelData && (
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
                        <div className="flex justify-center mb-4">
                            <Icon className="w-16 h-16 text-blue-400" />
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-white/80">Challenge {currentLevel} of 5</span>
                            <span className="text-yellow-400 font-bold">Coins: {score}</span>
                        </div>

                        <h3 className="text-2xl font-bold mb-2">{currentLevelData.title}</h3>
                        <p className="text-white text-lg mb-6 text-center">
                            {currentLevelData.question}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {currentLevelData.options.map((option, index) => {
                                const isSelected = selectedAnswer === option;
                                const showFeedback = answered;

                                let buttonClass = "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[60px] flex items-center justify-center gap-3";

                                if (showFeedback) {
                                    if (isSelected) {
                                        buttonClass = option.correct
                                            ? "bg-green-500 ring-4 ring-green-300 text-white p-6 rounded-2xl shadow-lg min-h-[60px] flex items-center justify-center gap-3"
                                            : "bg-red-500 ring-4 ring-red-300 text-white p-6 rounded-2xl shadow-lg min-h-[60px] flex items-center justify-center gap-3";
                                    } else {
                                        buttonClass = "bg-white/10 opacity-50 text-white p-6 rounded-2xl shadow-lg min-h-[60px] flex items-center justify-center gap-3";
                                    }
                                }

                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => handleAnswer(index)}
                                        disabled={showFeedback}
                                        className={buttonClass}
                                    >
                                        <span className="text-2xl">{option.emoji}</span>
                                        <span className="font-bold text-lg">{option.text}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {answered && selectedAnswer && (
                            <div className={`mt-4 p-4 rounded-xl ${selectedAnswer.correct
                                    ? 'bg-green-500/20 border-2 border-green-400'
                                    : 'bg-red-500/20 border-2 border-red-400'
                                }`}>
                                <p className="text-white font-semibold">
                                    {selectedAnswer.correct
                                        ? currentLevelData.feedback.correct
                                        : currentLevelData.feedback.wrong}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {showResult && (
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
                        {score >= 4 ? (
                            <div>
                                <div className="text-6xl mb-4">🏆</div>
                                <h3 className="text-3xl font-bold text-white mb-4">Shaving Pro Badge Earned!</h3>
                                <p className="text-white/90 text-lg mb-6">
                                    You demonstrated excellent knowledge about shaving safety with {score} correct answers out of {levels.length}!
                                </p>
                                                
                                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl mb-6">
                                    <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                                    <p className="text-xl">Badge: Shaving Pro</p>
                                </div>
                                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-green-500/20 p-4 rounded-xl">
                                        <h4 className="font-bold text-green-300 mb-2">Safety Knowledge</h4>
                                        <p className="text-white/90 text-sm">
                                            You understand the importance of proper shaving techniques and safety.
                                        </p>
                                    </div>
                                    <div className="bg-blue-500/20 p-4 rounded-xl">
                                        <h4 className="font-bold text-blue-300 mb-2">Grooming Expert</h4>
                                        <p className="text-white/90 text-sm">
                                            You know how to care for your skin before and after shaving.
                                        </p>
                                    </div>
                                </div>
                                                
                                <button
                                    onClick={handleNext}
                                    className="bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
                                >
                                    Continue Learning
                                </button>
                            </div>
                        ) : (
                            <div>
                                <div className="text-5xl mb-4">💪</div>
                                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Shaving Safety!</h3>
                                <p className="text-white/90 text-lg mb-4">
                                    You answered {score} questions correctly out of {levels.length}.
                                </p>
                                <p className="text-white/90 mb-6">
                                    Review shaving safety topics to strengthen your knowledge and earn your badge.
                                </p>
                                <button
                                    onClick={() => {
                                        setCurrentLevel(1);
                                        setScore(0);
                                        setAnswered(false);
                                        setSelectedAnswer(null);
                                        setShowResult(false);
                                        resetFeedback();
                                    }}
                                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </GameShell>
    );
};

export default ShavingProBadgeTeen;
