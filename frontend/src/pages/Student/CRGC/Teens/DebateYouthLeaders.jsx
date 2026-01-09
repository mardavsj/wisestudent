import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateYouthLeaders = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Can teens lead big change?",
      options: [
        { id: "a", text: "Yes, teens have unique perspectives and energy" },
        { id: "b", text: "No, teens lack experience and knowledge" },
        { id: "c", text: "Only with adult supervision" }
      ],
      correctAnswer: "a",
      explanation: "Teens can indeed lead significant change by bringing fresh perspectives, energy, and innovative solutions to complex problems."
    },
    {
      id: 2,
      text: "What advantage do young leaders bring to social movements?",
      options: [
        { id: "b", text: "Established networks and resources" },
        { id: "a", text: "Fresh ideas and digital fluency" },
        { id: "c", text: "Traditional approaches to problems" }
      ],
      correctAnswer: "a",
      explanation: "Young leaders often bring innovative ideas and are fluent in digital platforms that can amplify social movements."
    },
    {
      id: 3,
      text: "How can teens effectively influence policy decisions?",
      options: [
        { id: "b", text: "By protesting without clear objectives" },
        { id: "c", text: "Only by waiting until they're adults" },
        { id: "a", text: "Through research, advocacy, and coalition building" },
      ],
      correctAnswer: "a",
      explanation: "Teens can influence policy through well-researched advocacy, building coalitions, and engaging with decision-makers."
    },
    {
      id: 4,
      text: "What historical examples show youth leadership impact?",
      options: [
        { id: "a", text: "Malala Yousafzai, Greta Thunberg, March for Our Lives" },
        { id: "b", text: "Only adult political leaders have created change" },
        { id: "c", text: "Youth movements have never been successful" }
      ],
      correctAnswer: "a",
      explanation: "Many young leaders like Malala, Greta, and the Parkland students have successfully advocated for significant social and policy changes."
    },
    {
      id: 5,
      text: "What is essential for effective youth leadership?",
      options: [
        { id: "b", text: "Working completely independently" },
        { id: "c", text: "Avoiding adult mentors and guidance" },
        { id: "a", text: "Preparation, collaboration, and persistence" },
      ],
      correctAnswer: "a",
      explanation: "Effective youth leadership combines preparation, collaboration with others, and persistence in working toward goals."
    }
  ];

  const handleOptionSelect = (optionId) => {
    if (selectedOption || showFeedback) return;
    
    resetFeedback(); // Reset any existing feedback
    
    const currentQ = questions[currentQuestion];
    const isCorrect = optionId === currentQ.correctAnswer;
    
    setSelectedOption(optionId);
    
    if (isCorrect) {
      setCoins(prev => prev + 1); // 1 coin per correct answer
      showCorrectAnswerFeedback(1, true);
    }
    
    setShowFeedback(true);
    
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedOption(null);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 2000);
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/teens");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  if (gameFinished) {
    return (
      <GameShell
        title="Debate: Youth Leaders?"
        subtitle="Debate Complete!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={coins}
        gameId="civic-responsibility-teens-96"
        gameType="civic-responsibility"
        totalLevels={5}
        currentLevel={currentQuestion + 1}
        showConfetti={true}
        backPath="/games/civic-responsibility/teens"
        maxScore={questions.length} // Max score is total number of questions (all correct)
        coinsPerLevel={coinsPerLevel}
        totalCoins={totalCoins}
        totalXp={totalXp}
        flashPoints={flashPoints}
        showAnswerConfetti={showAnswerConfetti}
        nextGamePathProp="/student/civic-responsibility/teens/journal-of-leadership"
        nextGameIdProp="civic-responsibility-teens-97">
        <div className="text-center p-8">
          <div className="text-6xl mb-6">🏆</div>
          <h2 className="text-2xl font-bold mb-4">Excellent Debate!</h2>
          <p className="text-white mb-6">
            You scored {coins} out of {questions.length} points!
          </p>
          <div className="text-yellow-400 font-bold text-lg mb-4">
            You understand youth leadership potential!
          </div>
          <p className="text-white/80">
            Remember: Teens can and do lead significant positive change in their communities and beyond!
          </p>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Debate: Youth Leaders?"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-96"
      gameType="civic-responsibility"
      totalLevels={5}
      currentLevel={currentQuestion + 1}
      showConfetti={gameFinished}
      backPath="/games/civic-responsibility/teens"
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Debate {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>
          
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🌟</div>
            <h3 className="text-2xl font-bold text-white mb-2">Youth Leadership Debate</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getCurrentQuestion().options.map((option) => {
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
        </div>
      </div>
    </GameShell>
  );
};

export default DebateYouthLeaders;