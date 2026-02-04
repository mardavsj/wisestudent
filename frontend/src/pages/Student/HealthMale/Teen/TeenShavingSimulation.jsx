import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TeenShavingSimulation = () => {
    const navigate = useNavigate();

    // Get game data from game category folder (source of truth)
    const gameId = "health-male-teen-38";

    // Hardcode rewards: 2 coins per question, 10 total coins, 20 total XP
    const coinsPerLevel = 2;
    const totalCoins = 10;
    const totalXp = 20;

    const [coins, setCoins] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [currentScenario, setCurrentScenario] = useState(0);
    const [gameFinished, setGameFinished] = useState(false);
    const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

    const steps = [
    {
        id: 1,
        title: "Skin Readiness",
        instruction: "Prepare your skin safely before shaving.",
        options: [
            {
                id: "a",
                text: "Soften hair using warm water or steam",
                emoji: "♨️",
                isCorrect: true
            },
            {
                id: "b",
                text: "Splash cold water immediately",
                emoji: "🧊",
                isCorrect: false
            },
            {
                id: "c",
                text: "Apply perfume first",
                emoji: "🌸",
                isCorrect: false
            },
            {
                id: "d",
                text: "Shave as soon as you wake up",
                emoji: "⏰",
                isCorrect: false
            }
        ]
    },
    {
        id: 2,
        title: "Product Choice",
        instruction: "Choose the safest shaving aid.",
        options: [
           
            {
                id: "b",
                text: "Use soap meant for clothes",
                emoji: "👕",
                isCorrect: false
            },
             {
                id: "a",
                text: "Use a lubricating shaving gel or cream",
                emoji: "🫧",
                isCorrect: true
            },
            {
                id: "c",
                text: "Use body spray foam",
                emoji: "💨",
                isCorrect: false
            },
            {
                id: "d",
                text: "Use water only to save time",
                emoji: "💦",
                isCorrect: false
            }
        ]
    },
    {
        id: 3,
        title: "Blade Technique",
        instruction: "Reduce irritation while shaving.",
        options: [
           
            {
                id: "b",
                text: "Drag razor repeatedly over same spot",
                emoji: "🔁",
                isCorrect: false
            },
            {
                id: "c",
                text: "Apply force for a closer shave",
                emoji: "💥",
                isCorrect: false
            },
             {
                id: "a",
                text: "Move the razor in hair-growth direction",
                emoji: "📉",
                isCorrect: true
            },
            {
                id: "d",
                text: "Rush to finish quickly",
                emoji: "🏃",
                isCorrect: false
            }
        ]
    },
    {
        id: 4,
        title: "Post-Shave Clean",
        instruction: "Protect skin after shaving.",
        options: [
           
            {
                id: "b",
                text: "Rub face aggressively",
                emoji: "😖",
                isCorrect: false
            },
            {
                id: "c",
                text: "Skip washing completely",
                emoji: "🚫",
                isCorrect: false
            },
            {
                id: "d",
                text: "Use shared towel",
                emoji: "🧺",
                isCorrect: false
            },
             {
                id: "a",
                text: "Cool water rinse to calm skin",
                emoji: "❄️",
                isCorrect: true
            },
        ]
    },
    {
        id: 5,
        title: "Skin Recovery",
        instruction: "Help skin heal after shaving.",
        options: [
            {
                id: "a",
                text: "Apply alcohol-free soothing balm",
                emoji: "🌿",
                isCorrect: true
            },
            {
                id: "b",
                text: "Expose skin to heat immediately",
                emoji: "🔥",
                isCorrect: false
            },
            {
                id: "c",
                text: "Scratch itchy areas",
                emoji: "🤏",
                isCorrect: false
            },
            {
                id: "d",
                text: "Apply strong fragrance",
                emoji: "🌺",
                isCorrect: false
            }
        ]
    }
];

    // Set global window variables for useGameFeedback
    useEffect(() => {
        if (typeof window !== "undefined") {
            window.__flashTotalCoins = totalCoins;
            window.__flashQuestionCount = steps.length;
            window.__flashPointsMultiplier = coinsPerLevel;
            
            return () => {
                // Clean up on unmount
                window.__flashTotalCoins = null;
                window.__flashQuestionCount = null;
                window.__flashPointsMultiplier = 1;
            };
        }
    }, [totalCoins, coinsPerLevel, steps.length]);


    const handleChoice = (optionId) => {
        // Check if current scenario and its options exist
        if (!steps[currentScenario] || !steps[currentScenario].options) {
            return;
        }
        
        const selectedOption = steps[currentScenario].options.find(opt => opt.id === optionId);
        
        // Check if selected option exists
        if (!selectedOption) {
            return;
        }
        
        const isCorrect = selectedOption.isCorrect;

        console.log('Answer clicked', { currentScenario: currentScenario + 1, optionId, isCorrect, coins, correctAnswers });

        if (isCorrect) {
            setCoins(prev => {
                const next = prev + 2;
                console.log('Coins updated', { prev, next });
                return next;
            }); // 2 coins per correct answer
            setCorrectAnswers(prev => {
                const next = prev + 1;
                console.log('Correct answers updated', { prev, next });
                return next;
            });
            showCorrectAnswerFeedback(1, true);
        }

        setTimeout(() => {
            if (currentScenario < steps.length - 1) {
                setCurrentScenario(prev => prev + 1);
            } else {
                setGameFinished(true);
            }
        }, 1500);
    };

    const handleNext = () => {
        navigate("/student/health-male/teens/reflex-shaving-teen");
    };

    return (
        <GameShell
            title="Shaving Simulation"
            subtitle={`Scenario ${Math.min(currentScenario + 1, steps.length)} of ${steps.length}`}
            onNext={handleNext}
            nextEnabled={gameFinished}
            showGameOver={gameFinished}
            score={correctAnswers}
            gameId={gameId}
            nextGamePathProp="/student/health-male/teens/reflex-shaving-teen"
            nextGameIdProp="health-male-teen-39"
            gameType="health-male"
            flashPoints={flashPoints}
            showAnswerConfetti={showAnswerConfetti}
            maxScore={totalCoins}
            coinsPerLevel={coinsPerLevel}
            totalCoins={totalCoins}
            totalXp={totalXp}
            totalLevels={steps.length}
        >
            <div className="space-y-8">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-white/80">Scenario {Math.min(currentScenario + 1, steps.length)}/{steps.length}</span>
                        <span className="text-yellow-400 font-bold">Coins: {coins}</span>
                    </div>

                    <h2 className="text-xl font-semibold text-white mb-4">
                        {steps[currentScenario] ? steps[currentScenario].title : "Loading..."}
                    </h2>
                    
                    <p className="text-white/90 mb-6">
                        {steps[currentScenario] ? steps[currentScenario].instruction : "Loading..."}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {steps[currentScenario] && steps[currentScenario].options ? steps[currentScenario].options.map(option => (
                            <button
                                key={option.id}
                                onClick={() => handleChoice(option.id)}
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
                            >
                                <div className="flex items-center">
                                    <div className="text-2xl mr-4">{option.emoji}</div>
                                    <div>
                                        <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                                    </div>
                                </div>
                            </button>
                        )) : <div className="text-white text-center py-8">Loading options...</div>}
                    </div>
                </div>
            </div>
        </GameShell>
    );
};

export default TeenShavingSimulation;

