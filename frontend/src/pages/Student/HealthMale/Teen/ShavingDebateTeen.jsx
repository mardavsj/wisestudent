import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ShavingDebateTeen = () => {
    const navigate = useNavigate();

    // Get game data from game category folder (source of truth)
    const gameId = "health-male-teen-36";

    // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
    const coinsPerLevel = 1;
    const totalCoins = 5;
    const totalXp = 10;

    const [coins, setCoins] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [score, setScore] = useState(0);
    const [gameFinished, setGameFinished] = useState(false);
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


    const handleOptionSelect = (optionId) => {
        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = optionId === currentQuestion.correctAnswer;
        
        setSelectedOption(optionId);
        setShowFeedback(true);
        
        if (isCorrect) {
            setCoins(prev => prev + 1);
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
        }, 1500);
    };

    const handleNext = () => {
        navigate("/student/health-male/teens/teen-hygiene-journal");
    };

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <GameShell
            title="Shaving Debate"
            subtitle={`Question ${currentQuestionIndex + 1} of ${questions.length}`}
            onNext={handleNext}
            nextEnabled={gameFinished}
            showGameOver={gameFinished}
            score={coins}
            gameId={gameId}
            gameType="health-male"
            flashPoints={flashPoints}
            showAnswerConfetti={showAnswerConfetti}
            maxScore={questions.length}
            coinsPerLevel={coinsPerLevel}
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
