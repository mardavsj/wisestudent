import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FirstPeriodStory = () => {
    const navigate = useNavigate();
    const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
    const [coins, setCoins] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [choices, setChoices] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [finalScore, setFinalScore] = useState(0);

    // Hardcoded Game Rewards & Configuration
    const coinsPerLevel = 1;
    const totalCoins = 5;
    const totalXp = 10;
    const maxScore = 5;
    const gameId = "health-female-kids-91";

    const questions = [
        {
            id: 1,
            text: "You see a red stain on your underwear at school.",
            options: [
                {
                    id: "a",
                    text: "Panic and cry",
                    emoji: "😭",
                    isCorrect: false
                },
                {
                    id: "b",
                    text: "Stay calm and go to the bathroom",
                    emoji: "😌",
                    isCorrect: true
                },
                {
                    id: "c",
                    text: "Run home",
                    emoji: "🏃‍♀️",
                    isCorrect: false
                }
            ]
        },
        {
            id: 2,
            text: "You realize you got your period.",
            options: [
                {
                    id: "b",
                    text: "Ignore it",
                    emoji: "🙈",
                    isCorrect: false
                },
                {
                    id: "c",
                    text: "Tell everyone in class",
                    emoji: "📢",
                    isCorrect: false
                },
                {
                    id: "a",
                    text: "Tell a teacher or nurse",
                    emoji: "👩‍🏫",
                    isCorrect: true
                }
            ]
        },
        {
            id: 3,
            text: "You don't have a pad with you.",
            options: [
                {
                    id: "a",
                    text: "Use notebook paper",
                    emoji: "📄",
                    isCorrect: false
                },
                {
                    id: "c",
                    text: "Use nothing",
                    emoji: "🚫",
                    isCorrect: false
                },
                {
                    id: "b",
                    text: "Ask a friend or the nurse",
                    emoji: "🙋‍♀️",
                    isCorrect: true
                }
            ]
        },
        {
            id: 4,
            text: "Your tummy hurts a little (cramps).",
            options: [
                {
                    id: "b",
                    text: "Eat lots of candy",
                    emoji: "🍬",
                    isCorrect: false
                },
                {
                    id: "a",
                    text: "Rest a bit and drink water",
                    emoji: "💧",
                    isCorrect: true
                },
                {
                    id: "c",
                    text: "Jump up and down",
                    emoji: "🤸‍♀️",
                    isCorrect: false
                }
            ]
        },
        {
            id: 5,
            text: "Is this normal?",
            options: [
                {
                    id: "a",
                    text: "No, it's weird",
                    emoji: "👽",
                    isCorrect: false
                },
                {
                    id: "c",
                    text: "Only happened to you",
                    emoji: "👉",
                    isCorrect: false
                },
                {
                    id: "b",
                    text: "Yes, it happens to every girl",
                    emoji: "🌸",
                    isCorrect: true
                }
            ]
        }
    ];

    const handleChoice = (optionId) => {
        const newChoices = [...choices, { 
            questionId: questions[currentQuestion].id, 
            choice: optionId,
            isCorrect: questions[currentQuestion].options.find(opt => opt.id === optionId)?.isCorrect
        }];
        
        setChoices(newChoices);
        
        // If the choice is correct, add coins and show flash/confetti
        const isCorrect = questions[currentQuestion].options.find(opt => opt.id === optionId)?.isCorrect;
        if (isCorrect) {
            setCoins(prev => prev + 1);
            showCorrectAnswerFeedback(1, true);
        } else {
            showCorrectAnswerFeedback(0, false);
        }
        
        // Move to next question or show results
        if (currentQuestion < questions.length - 1) {
            setTimeout(() => {
                setCurrentQuestion(prev => prev + 1);
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
        setCurrentQuestion(0);
        setChoices([]);
        setCoins(0);
        setFinalScore(0);
        resetFeedback();
    };

    const handleNext = () => {
        navigate("/games/health-female/kids");
    };

    const getCurrentQuestion = () => questions[currentQuestion];

    return (
        <GameShell
            title="First Period Story"
            score={coins}
            subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
            showGameOver={showResult}
            gameId={gameId}
            gameType="health-female"
            totalLevels={questions.length}
            currentLevel={currentQuestion + 1}
            showConfetti={showResult}
            flashPoints={flashPoints}
            showAnswerConfetti={showAnswerConfetti}
            onNext={handleNext}
            nextEnabled={showResult}
            backPath="/games/health-female/kids"
            maxScore={maxScore}
            coinsPerLevel={coinsPerLevel}
            totalCoins={totalCoins}
            totalXp={totalXp}>
            <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center max-w-4xl mx-auto px-4 py-4">
                {!showResult ? (
                    <div className="space-y-4 md:space-y-6">
                        <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                                <span className="text-white/80 text-sm md:text-base">Question {currentQuestion + 1}/{questions.length}</span>
                                <span className="text-yellow-400 font-bold text-sm md:text-base">Coins: {coins}</span>
                            </div>
                            
                            <h2 className="text-white text-base md:text-lg lg:text-xl mb-4 md:mb-6 text-center">
                                {getCurrentQuestion().text}
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                                {getCurrentQuestion().options.map(option => (
                                    <button
                                        key={option.id}
                                        onClick={() => handleChoice(option.id)}
                                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg transition-all transform hover:scale-105"
                                    >
                                        <div className="text-2xl md:text-3xl mb-2">{option.emoji}</div>
                                        <h3 className="font-bold text-base md:text-xl mb-2">{option.text}</h3>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/20 text-center flex-1 flex flex-col justify-center">
                        {finalScore >= 3 ? (
                            <div>
                                <div className="text-4xl md:text-5xl mb-4">🌸</div>
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Growing Up Expert!</h3>
                                <p className="text-white/90 text-base md:text-lg mb-4">
                                    You got {finalScore} out of {questions.length} questions correct!
                                    You understand what to do during your first period!
                                </p>
                                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                                    <span>+{coins} Coins</span>
                                </div>
                                <p className="text-white/80 text-sm md:text-base">
                                    Great job! You know that staying calm, asking for help, and resting are the right things to do!
                                </p>
                            </div>
                        ) : (
                            <div>
                                <div className="text-4xl md:text-5xl mb-4">😔</div>
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                                <p className="text-white/90 text-base md:text-lg mb-4">
                                    You got {finalScore} out of {questions.length} questions correct.
                                    Remember, getting your period is a normal part of growing up!
                                </p>
                                <button
                                    onClick={handleTryAgain}
                                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-bold transition-all mb-4 text-sm md:text-base"
                                >
                                    Try Again
                                </button>
                                <p className="text-white/80 text-xs md:text-sm">
                                    Try to choose the option that shows how to handle your first period calmly.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </GameShell>
    );
};

export default FirstPeriodStory;