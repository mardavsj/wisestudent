import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateInnovationTech = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = 1; // Changed from 5 to 1 for +1 coin per correct answer
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Is innovation only about technology and gadgets?",
      options: [
       
        {
          id: "b",
          text: "Yes, only technology counts as innovation",
          emoji: "💻",
          isCorrect: false
        },
        {
          id: "c",
          text: "Innovation is impossible without huge investment",
          emoji: "💰",
          isCorrect: false
        },
        {
          id: "a",
          text: "No, any new idea or improvement counts",
          emoji: "🔄",
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      text: "What's an example of non-technology innovation?",
      options: [
        {
          id: "a",
          text: "New teaching method in a classroom",
          emoji: "📚",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only creating new smartphone apps",
          emoji: "📱",
          isCorrect: false
        },
        {
          id: "c",
          text: "Copying existing solutions exactly",
          emoji: "📎",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Why is broadening the definition of innovation important?",
      options: [
        {
          id: "a",
          text: "It encourages creative problem-solving in all areas",
          emoji: "🎯",
          isCorrect: true
        },
        {
          id: "b",
          text: "It makes innovation more exclusive",
          emoji: "🔒",
          isCorrect: false
        },
        {
          id: "c",
          text: "It focuses only on wealthy sectors",
          emoji: "💎",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What role does social innovation play?",
      options: [
        
        {
          id: "b",
          text: "Only benefits corporations",
          emoji: "🏢",
          isCorrect: false
        },
        {
          id: "a",
          text: "Creates solutions for societal challenges",
          emoji: "🌍",
          isCorrect: true
        },
        {
          id: "c",
          text: "Isn't as valuable as tech innovation",
          emoji: "📉",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How can teens innovate without technology?",
      options: [
        
        {
          id: "b",
          text: "Only by starting businesses",
          emoji: "💼",
          isCorrect: false
        },
        {
          id: "c",
          text: "By avoiding all challenges",
          emoji: "🚫",
          isCorrect: false
        },
        {
          id: "a",
          text: "Improve processes, create art, solve community problems",
          emoji: "🌟",
          isCorrect: true
        },
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(1, true); // Changed from 2 to 1 for +1 coin feedback
    }

    setChoices([...choices, { question: currentQuestion, optionId, isCorrect }]);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const getCurrentQuestion = () => {
    // If game is finished, return the last question
    if (gameFinished && questions.length > 0) {
      return questions[questions.length - 1];
    }
    // If currentQuestion is within bounds, return the current question
    if (currentQuestion >= 0 && currentQuestion < questions.length) {
      return questions[currentQuestion];
    }
    // Fallback: return the first question if somehow currentQuestion is negative
    if (questions.length > 0) {
      return questions[0];
    }
    // If no questions exist, return a default object
    return { text: '', options: [] };
  };

  const handleNext = () => {
    navigate("/student/ehe/teens/journal-teen-innovation");
  };

  return (
    <GameShell
      title="Debate: Innovation = Only Tech?"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length} // Changed from * 2 to just the count for +1 scoring
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-36"
      gameType="ehe"
      totalLevels={5}
      currentLevel={currentQuestion + 1}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
    
      nextGamePathProp="/student/ehe/teens/journal-teen-innovation"
      nextGameIdProp="ehe-teen-37">
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Debate {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span> 
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">💡</div> {/* Changed emoji to be more relevant to innovation */}
            <h3 className="text-2xl font-bold text-white mb-2">Innovation Debate</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default DebateInnovationTech;