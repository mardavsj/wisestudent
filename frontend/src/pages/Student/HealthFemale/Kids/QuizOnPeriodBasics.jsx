import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnPeriodBasics = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
    const coinsPerLevel = location.state?.coinsPerLevel || 1;
    const totalCoins = location.state?.totalCoins || 5;
    const totalXp = location.state?.totalXp || 10;
    const maxScore = 5;
    const gameId = "health-female-kids-92";

    const [coins, setCoins] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [gameFinished, setGameFinished] = useState(false);
    const { showCorrectAnswerFeedback, resetFeedback, flashPoints } = useGameFeedback();    const questions = [
        {
            id: 1,
            text: "Every girl gets her period at the same age.",
            emoji: "⏱️",
            options: [
                {
                    id: "a",
                    text: "True",
                    emoji: "👍",
                    // description: "Everyone is different.",
                    isCorrect: false
                },
                {
                    id: "b",
                    text: "False",
                    emoji: "👎",
                    // description: "Correct! Bodies grow at different speeds.",
                    isCorrect: true
                },
                {
                    id: "c",
                    text: "Only on Tuesday",
                    emoji: "📅",
                    // description: "Not true.",
                    isCorrect: false
                }
            ]
        },
        {
            id: 2,
            text: "A period usually happens...",
            emoji: "🌙",
            options: [
                {
                    id: "b",
                    text: "About once a month",
                    emoji: "🌜",
                    // description: "Correct! Like the moon cycle.",
                    isCorrect: true
                },
                {
                    id: "a",
                    text: "Once a year",
                    emoji: "🗓️",
                    // description: "More often than that.",
                    isCorrect: false
                },
                
                {
                    id: "c",
                    text: "Every day",
                    emoji: "☀️",
                    // description: "Not every day.",
                    isCorrect: false
                }
            ]
        },
        {
            id: 3,
            text: "Getting your period means...",
            emoji: "🌸",
            options: [
                {
                    id: "a",
                    text: "You are turning into a superhero",
                    emoji: "🦸‍♀️",
                    // description: "Not exactly.",
                    isCorrect: false
                },
                {
                    id: "b",
                    text: "Your body is healthy and growing up",
                    emoji: "🌱",
                    // description: "Yes! It is a sign of health.",
                    isCorrect: true
                },
                {
                    id: "c",
                    text: "You are sick",
                    emoji: "🤒",
                    // description: "It is not an illness.",
                    isCorrect: false
                }
            ]
        },
        {
            id: 4,
            text: "Can you still play sports on your period?",
            emoji: "🏅",
            options: [
                {
                    id: "a",
                    text: "No, never",
                    emoji: "🚫",
                    // description: "You can do anything!";,
                    isCorrect: false
                },
                {
                    id: "b",
                    text: "Yes, absolutely",
                    emoji: "⚽",
                    // description: "Correct! Exercise can even help cramps.",
                    isCorrect: false
                },
                {
                    id: "c",
                    text: "Only sitting sports",
                    emoji: "🪑",
                    // description: "Any sport is okay.",
                    isCorrect: true
                }
            ]
        },
        {
            id: 5,
            text: "Should you be ashamed of your period?",
            emoji: "😌",
            options: [
                {
                    id: "a",
                    text: "Yes, hide it",
                    emoji: "🫣",
                    // description: "Nothing to be ashamed of.",
                    isCorrect: false
                },
                {
                    id: "b",
                    text: "No, it is natural",
                    emoji: "💁‍♀️",
                    // description: "Correct! It happens to half the world.",
                    isCorrect: true
                },
                {
                    id: "c",
                    text: "Be scared",
                    emoji: "😨",
                    // description: "Don't be scared."
                    isCorrect: false
                }
            ]
        }
    ];

    const handleAnswer = (optionId) => {
        if (showFeedback || gameFinished) return;
        
        setSelectedOption(optionId);
        resetFeedback();
        
        const currentQuestionData = questions[currentQuestion];
        const selectedOptionData = currentQuestionData.options.find(opt => opt.id === optionId);
        const isCorrect = selectedOptionData?.isCorrect || false;
        
        if (isCorrect) {
            setCoins(prev => prev + 1);
            showCorrectAnswerFeedback(1, true);
        } else {
            showCorrectAnswerFeedback(0, false);
        }
        
        setShowFeedback(true);
        
        setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(prev => prev + 1);
                setSelectedOption(null);
                setShowFeedback(false);
                resetFeedback();
            } else {
                setGameFinished(true);
            }
        }, isCorrect ? 1000 : 800);
    };

    const handleNext = () => {
        navigate("/games/health-female/kids");
    };

    return (
        <GameShell
            title="Quiz on Period Basics"
            subtitle={gameFinished ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
            onNext={handleNext}
            nextEnabled={gameFinished}
            showGameOver={gameFinished}
            score={coins}
            gameId={gameId}
            gameType="health-female"
            totalLevels={5}
            currentLevel={92}
            showConfetti={gameFinished}
            backPath="/games/health-female/kids"
            maxScore={maxScore}
            coinsPerLevel={coinsPerLevel}
            totalCoins={totalCoins}
            totalXp={totalXp}
            flashPoints={flashPoints}
        >
            <div className="space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
                {!gameFinished && questions[currentQuestion] ? (
                    <div className="space-y-6">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                        <span className="text-yellow-400 font-bold">Score: {coins}/{questions.length}</span>
                    </div>

                    <div className="text-6xl mb-4 text-center">{questions[currentQuestion].emoji}</div>

                    <p className="text-white text-lg md:text-xl mb-6 text-center">
                        {questions[currentQuestion].text}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {questions[currentQuestion].options.map(option => {
                            const isSelected = selectedOption === option.id;
                            const showCorrect = showFeedback && option.isCorrect;
                            const showIncorrect = showFeedback && isSelected && !option.isCorrect;
                            
                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleAnswer(option.id)}
                                    disabled={showFeedback}
                                    className={`p-6 rounded-2xl shadow-lg transition-all transform text-center ${
                                        showCorrect
                                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                                          : showIncorrect
                                          ? "bg-red-500/20 border-2 border-red-400 opacity-75"
                                          : isSelected
                                          ? "bg-blue-600 border-2 border-blue-300 scale-105"
                                          : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                                      } ${showFeedback ? "cursor-not-allowed" : ""}`}
                                >
                                    <div className="text-2xl mb-2">{option.emoji}</div>
                                    <h4 className="font-bold text-base mb-2">{option.text}</h4>
                                </button>
                            );
                        })}
                    </div>
                    
                    {showFeedback && (
                        <div className={`rounded-lg p-5 mt-6 ${
                            questions[currentQuestion].options.find(opt => opt.id === selectedOption)?.isCorrect
                                ? "bg-green-500/20"
                                : "bg-red-500/20"
                        }`}>
                            <p className="text-white whitespace-pre-line">
                                {questions[currentQuestion].options.find(opt => opt.id === selectedOption)?.isCorrect
                                    ? "Great job! That's exactly right! 🎉"
                                    : "Not quite right. Try again next time!"}
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

export default QuizOnPeriodBasics;