import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ShavingDebateTeen = () => {
    const navigate = useNavigate();

    // Get game data from game category folder (source of truth)
    const gameId = "health-male-teen-36";

    // Hardcode rewards: 2 coins per question, 10 total coins, 20 total XP
    const coinsPerLevel = 2;
    const totalCoins = 10;
    const totalXp = 20;

    const [coins, setCoins] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [score, setScore] = useState(0);
    const [gameFinished, setGameFinished] = useState(false);
    
    // Debug logging for state changes
    useEffect(() => {
        console.log('🔄 State update - Coins:', coins, 'Question:', currentQuestionIndex + 1, 'Selected:', selectedOption, 'Feedback:', showFeedback);
    }, [coins, currentQuestionIndex, selectedOption, showFeedback]);
    const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

    const questions = [
    {
        id: 1,
        text: "A teen feels pressured to shave because friends tease them. What is the healthiest response?",
        options: [
            {
                id: "a",
                text: "Shave immediately to fit in",
                emoji: "😬"
            },
            {
                id: "b",
                text: "Ignore grooming forever",
                emoji: "🙈"
            },
            {
                id: "c",
                text: "Decide based on personal comfort",
                emoji: "🧠"
            }
        ],
        correctAnswer: "c",
        explanation: "Grooming choices should be based on personal comfort, not peer pressure."
    },
    {
        id: 2,
        text: "Why is sharing a razor risky even if it looks clean?",
        options: [
            {
                id: "a",
                text: "It becomes dull",
                emoji: "⚙️"
            },
            {
                id: "b",
                text: "Invisible cuts can spread infections",
                emoji: "🦠"
            },
            {
                id: "c",
                text: "It won’t shave properly",
                emoji: "🪒"
            }
        ],
        correctAnswer: "b",
        explanation: "Tiny cuts and blood can spread bacteria or viruses even when a razor looks clean."
    },
    {
        id: 3,
        text: "A teen gets frequent razor bumps. What is the BEST adjustment?",
        options: [
            {
                id: "a",
                text: "Shave faster",
                emoji: "⚡"
            },
            {
                id: "b",
                text: "Use more pressure",
                emoji: "💪"
            },
            {
                id: "c",
                text: "Shave less often or change method",
                emoji: "🔄"
            }
        ],
        correctAnswer: "c",
        explanation: "Razor bumps often improve by shaving less often or switching to a gentler method."
    },
    {
        id: 4,
        text: "Why might alcohol-based aftershave be a problem for teens?",
        options: [
            {
                id: "a",
                text: "It smells bad",
                emoji: "👃"
            },
            {
                id: "b",
                text: "It can dry and irritate sensitive skin",
                emoji: "🔥"
            },
            {
                id: "c",
                text: "It stops hair growth",
                emoji: "✋"
            }
        ],
        correctAnswer: "b",
        explanation: "Teen skin can be sensitive; alcohol may cause burning, dryness, or irritation."
    },
    {
        id: 5,
        text: "Which statement best describes healthy shaving habits?",
        options: [
            {
                id: "c",
                text: "Shaving routines depend on skin and hair type",
                emoji: "🧬"
            },
            {
                id: "a",
                text: "Everyone should shave the same way",
                emoji: "📏"
            },
            {
                id: "b",
                text: "Shaving is required for hygiene",
                emoji: "🚿"
            },
            
        ],
        correctAnswer: "c",
        explanation: "Skin type, hair growth, and comfort all affect how and whether someone should shave."
    }
];

    // Set global window variables for useGameFeedback
    useEffect(() => {
        if (typeof window !== "undefined") {
            window.__flashTotalCoins = totalCoins;
            window.__flashQuestionCount = questions.length;
            window.__flashPointsMultiplier = coinsPerLevel;
            console.log('useGameFeedback globals set', {
                __flashTotalCoins: window.__flashTotalCoins,
                __flashQuestionCount: window.__flashQuestionCount,
                __flashPointsMultiplier: window.__flashPointsMultiplier
            });

            return () => {
                // Clean up on unmount
                window.__flashTotalCoins = null;
                window.__flashQuestionCount = null;
                window.__flashPointsMultiplier = 1;
            };
        }
    }, [totalCoins, coinsPerLevel, questions.length]);


    const handleOptionSelect = (optionId) => {
        // Prevent multiple executions for the same question
        if (showFeedback || selectedOption) {
            console.log('⚠️ handleOptionSelect blocked - already processing');
            return;
        }
        
        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = optionId === currentQuestion.correctAnswer;
        
        console.log('🎯 handleOptionSelect called for option:', optionId, 'Question:', currentQuestionIndex + 1, { coins, score });
        
        setSelectedOption(optionId);
        setShowFeedback(true);
        
        if (isCorrect) {
            console.log('✅ Correct answer! Current coins:', coins, 'Adding 2 coins');
            setCoins(prev => {
                const newCoins = prev + 2;
                console.log('💰 Coin increment:', prev, '->', newCoins);
                return newCoins;
            }); // 2 coins per correct answer
            setScore(prev => prev + 1);
            showCorrectAnswerFeedback(1, true);
        } else {
            showCorrectAnswerFeedback(0, false);
        }
        
        // Move to next question after delay
        setTimeout(() => {
            setShowFeedback(false);
            setSelectedOption(null);
            
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                setGameFinished(true);
            }
        }, 5000);
    };

    const handleNext = () => {
        navigate("/student/health-male/teens/teen-hygiene-journal");
    };

    const currentQuestion = questions[currentQuestionIndex];
    
    // Debug logging for GameShell props
    useEffect(() => {
        console.log('🎮 GameShell props:', {
            score: coins,
            maxScore: totalCoins,
            totalLevels: questions.length,
            coinsPerLevel,
            totalCoins,
            currentQuestion: currentQuestionIndex + 1
        });
    }, [coins, totalCoins, coinsPerLevel, currentQuestionIndex]);

    // Final results logging
    useEffect(() => {
        if (gameFinished) {
            console.log('🏁 ShavingDebateTeen finished', {
                gameId,
                finalScore: score,
                finalCoins: coins,
                totalCoins,
                coinsPerLevel,
                windowFlash: {
                    totalCoins: typeof window !== 'undefined' ? window.__flashTotalCoins : undefined,
                    questionCount: typeof window !== 'undefined' ? window.__flashQuestionCount : undefined,
                    multiplier: typeof window !== 'undefined' ? window.__flashPointsMultiplier : undefined
                }
            });
        }
    }, [gameFinished, score, coins, gameId, totalCoins, coinsPerLevel]);

    return (
        <GameShell
            title="Shaving Debate"
            subtitle={`Question ${currentQuestionIndex + 1} of ${questions.length}`}
            onNext={handleNext}
            nextEnabled={gameFinished}
            showGameOver={gameFinished}
            score={score}
            gameId={gameId}
            nextGamePathProp="/student/health-male/teens/teen-hygiene-journal"
            nextGameIdProp="health-male-teen-37"
            gameType="health-male"
            flashPoints={flashPoints}
            showAnswerConfetti={showAnswerConfetti}
            maxScore={totalCoins}
            coinsPerLevel={coinsPerLevel}
            totalLevels={questions.length}
            totalCoins={totalCoins}
            totalXp={totalXp}
        >
            <div className="space-y-8">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-white mb-4">Shaving Debate</h3>
                        <p className="text-white/90 text-lg">{currentQuestion.text}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {currentQuestion.options.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => !showFeedback && handleOptionSelect(option.id)}
                                disabled={showFeedback}
                                className={`bg-white/10 p-4 rounded-xl border-2 transition-all transform hover:scale-105 flex flex-col items-center gap-3 group ${selectedOption === option.id ? (showFeedback ? (option.id === currentQuestion.correctAnswer ? 'border-green-400 bg-green-400/20' : 'border-red-400 bg-red-400/20') : 'border-yellow-400 bg-yellow-400/20') : 'border-white/20 hover:bg-white/20'} ${showFeedback && option.id === currentQuestion.correctAnswer ? 'border-green-400 bg-green-400/20' : ''}`}
                            >
                                <div className="text-5xl transition-transform">
                                    {option.emoji}
                                </div>
                                <div className="text-white font-bold text-lg text-center">
                                    {option.text}
                                </div>
                                {showFeedback && selectedOption === option.id && option.id !== currentQuestion.correctAnswer && (
                                    <div className="text-red-400 font-bold">Incorrect</div>
                                )}
                                {showFeedback && option.id === currentQuestion.correctAnswer && (
                                    <div className="text-green-400 font-bold">Correct!</div>
                                )}
                            </button>
                        ))}
                    </div>
                    
                    {showFeedback && (
                        <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/20">
                            <p className="text-white/90 text-center">{currentQuestion.explanation}</p>
                        </div>
                    )}
                </div>
            </div>
        </GameShell>
    );
};

export default ShavingDebateTeen;

