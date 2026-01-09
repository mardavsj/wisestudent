import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReproductiveHealthDebateTeen = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Friend says: 'Reproductive health should only be taught to adults!' What do you think?",
      options: [
        {
          id: "b",
          text: "Agree, it's only for adults",
          emoji: "👨"
        },
        {
          id: "a",
          text: "Yes, but taught responsibly",
          emoji: "✅"
        },
        {
          id: "c",
          text: "No education needed",
          emoji: "❌"
        }
      ],
      correctAnswer: "a",
      explanation: "Age-appropriate education helps teens stay healthy. Teens need reproductive health education to make informed choices, and knowledge prevents health problems and misinformation."
    },
    {
      id: 2,
      text: "Parent says: 'We shouldn't talk about reproductive health in school.' How do you respond?",
      options: [
        {
          id: "c",
          text: "Stay silent",
          emoji: "🤐"
        },
        {
          id: "a",
          text: "Explain it helps teens make healthy choices",
          emoji: "💪"
        },
        {
          id: "b",
          text: "Argue that it's embarrassing",
          emoji: "😳"
        }
      ],
      correctAnswer: "b",
      explanation: "Reproductive health education reduces embarrassment through knowledge. Open discussion helps teens understand their bodies, and education empowers teens to take care of their health."
    },
    {
      id: 3,
      text: "Teacher asks: 'Should reproductive health be part of school curriculum?' Your view?",
      options: [
        {
          id: "a",
          text: "Yes, it's essential for teen health",
          emoji: "🏥"
        },
        {
          id: "b",
          text: "Only basic information needed",
          emoji: "📝"
        },
        {
          id: "c",
          text: "No, families should teach it",
          emoji: "👨‍👩‍👧‍👦"
        }
      ],
      correctAnswer: "a",
      explanation: "School provides accurate information from qualified teachers. Comprehensive education prevents health issues, and schools complement family education with medical facts."
    },
    {
      id: 4,
      text: "Classmate says: 'Reproductive health education makes teens curious about sex.' What do you say?",
      options: [
        {
          id: "b",
          text: "Agree, it encourages bad behavior",
          emoji: "👎"
        },
        {
          id: "a",
          text: "Education provides healthy understanding",
          emoji: "🧠"
        },
        {
          id: "c",
          text: "Change the subject",
          emoji: "😶"
        }
      ],
      correctAnswer: "a",
      explanation: "Knowledge helps teens make responsible decisions. Education provides facts, not encouragement, and addressing concerns openly builds understanding."
    },
    {
      id: 5,
      text: "Health expert says: 'Reproductive health education should include emotional aspects.' Do you agree?",
      options: [
        {
          id: "c",
          text: "No, only physical facts matter",
          emoji: "🔬"
        },
        {
          id: "a",
          text: "Yes, both body and emotions matter",
          emoji: "❤️"
        },
        {
          id: "b",
          text: "Maybe, but not important",
          emoji: "🤷"
        }
      ],
      correctAnswer: "a",
      explanation: "Reproductive health affects physical and emotional development. Emotional health is part of overall wellbeing, and understanding emotions helps with puberty changes."
    }
  ];

  const handleOptionSelect = (optionId) => {
    if (selectedOption || showFeedback) return;
    
    resetFeedback(); // Reset any existing feedback
    
    setSelectedOption(optionId);
    const isCorrect = optionId === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }
    
    setShowFeedback(true);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        setGameFinished(true);
      }
    }, 2000);
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  const handleNext = () => {
    navigate("/student/health-male/teens/puberty-awareness-journal");
  };

  return (
    <GameShell
      title="Debate: Talking About Reproductive Health (Teen)"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={0}
      gameId="health-male-teen-36"
      nextGamePathProp="/student/health-male/teens/teen-hygiene-journal"
      nextGameIdProp="health-male-teen-37"
      gameType="health-male"
      maxScore={questions.length}
      coinsPerLevel={1}
      totalCoins={5}
      totalXp={10}
      showConfetti={false}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 36/100</span>
            <span className="text-yellow-400 font-bold">Score: 0</span>
          </div>

          <div className="text-center mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl mb-4">
              <p className="font-bold">💬 Debate Topic</p>
            </div>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getCurrentQuestion().options.map(option => {
              const isSelected = selectedOption === option.id;
              const isCorrect = option.id === getCurrentQuestion().correctAnswer;
              const showCorrect = showFeedback && isCorrect;
              const showIncorrect = showFeedback && isSelected && !isCorrect;
                    
              // Add emojis for each option like in the reference game
              const optionEmojis = {
                a: "✅",
                b: "❌",
                c: "⚠️"
              };
                    
              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  disabled={showFeedback}
                  className={`bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left ${
                    showFeedback ? (isCorrect ? 'ring-4 ring-green-500' : isSelected ? 'ring-4 ring-red-500' : '') : ''
                  }`}
                >
                  <div className="flex items-center">
                    <div className="text-2xl mr-4">{optionEmojis[option.id] || '❓'}</div>
                    <div>
                      <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          
          {showFeedback && (
            <div className={`mt-6 p-4 rounded-xl ${
              selectedOption === getCurrentQuestion().correctAnswer
                ? 'bg-green-500/20 border border-green-500/30'
                : 'bg-red-500/20 border border-red-500/30'
            }`}>
              <p className={`font-semibold ${
                selectedOption === getCurrentQuestion().correctAnswer
                  ? 'text-green-300'
                  : 'text-red-300'
              }`}>
                {selectedOption === getCurrentQuestion().correctAnswer
                  ? 'Correct! 🎉'
                  : 'Not quite right!'}
              </p>
              <p className="text-white/90 mt-2">
                {getCurrentQuestion().explanation}
              </p>
            </div>
          )}
                
          {gameFinished && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
              <h3 className="text-3xl font-bold text-white mb-4">Debate Complete!</h3>
              <p className="text-xl text-white/90 mb-6">
                You scored 0 out of {questions.length}!
              </p>
              <p className="text-white/80 mb-8">
                Understanding reproductive health helps you make informed decisions.
              </p>
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-8 rounded-full font-bold text-lg transition-all transform hover:scale-105"
              >
                Next Challenge
              </button>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default ReproductiveHealthDebateTeen;

