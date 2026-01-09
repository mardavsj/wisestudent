import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const HateCommentStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-teen-81";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
  {
    id: 1,
    text: "A harsh comment targets a student during a live discussion thread. Other students are watching. What response best supports a healthy online space?",
    options: [
      
      {
        id: "b",
        text: "Jump into the thread and argue with the commenter",
        emoji: "🗣️",
        isCorrect: false
      },
      {
        id: "c",
        text: "Wait to see if the situation fixes itself",
        emoji: "⏳",
        isCorrect: false
      },
      {
        id: "a",
        text: "Privately support the targeted person and flag the comment",
        emoji: "💬",
        isCorrect: true
      },
    ]
  },
  {
    id: 2,
    text: "A meme shared in a group chat uses hateful language disguised as humor. What is the most responsible action?",
    options: [
      
      {
        id: "b",
        text: "React silently and leave the group later",
        emoji: "🚪",
        isCorrect: false
      },
      {
        id: "a",
        text: "Point out why the content is harmful and use reporting tools",
        emoji: "📌",
        isCorrect: true
      },
      {
        id: "c",
        text: "Reshare it so others can judge for themselves",
        emoji: "🔁",
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    text: "Someone repeatedly posts hateful replies under different usernames. What does this behavior indicate?",
    options: [
      {
        id: "a",
        text: "An attempt to avoid accountability using anonymity",
        emoji: "🛡️",
        isCorrect: true
      },
      {
        id: "b",
        text: "Strong opinions being expressed creatively",
        emoji: "📝",
        isCorrect: false
      },
      {
        id: "c",
        text: "Normal disagreement in online debates",
        emoji: "⚖️",
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    text: "After reading hateful comments, a friend feels anxious and stops posting online. What does this show?",
    options: [
     
      {
        id: "b",
        text: "People should avoid social platforms entirely",
        emoji: "🚫",
        isCorrect: false
      },
       {
        id: "a",
        text: "Online words can seriously affect mental well-being",
        emoji: "🧠",
        isCorrect: true
      },
      {
        id: "c",
        text: "Only public figures face online pressure",
        emoji: "👤",
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    text: "A hate comment remains online for months and keeps getting replies. What is the long-term concern?",
    options: [
      
      {
        id: "b",
        text: "Older posts stop affecting anyone",
        emoji: "📅",
        isCorrect: false
      },
      {
        id: "c",
        text: "Time alone solves online harm",
        emoji: "⌛",
        isCorrect: false
      },
      {
        id: "a",
        text: "Harmful content can continue influencing attitudes over time",
        emoji: "📉",
        isCorrect: true
      },
    ]
  }
];


  const handleChoice = (selectedChoice) => {
    const newChoices = [...choices, { 
      questionId: questions[currentQuestion].id, 
      choice: selectedChoice,
      isCorrect: questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect;
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, isCorrect ? 1000 : 0); // Delay if correct to show animation
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setShowResult(true);
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
    navigate("/student/dcos/teen/freedom-vs-abuse-quiz");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Hate Comment Story"
      score={coins}
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextGamePathProp="/student/dcos/teens/freedom-vs-abuse-quiz"
      nextGameIdProp="dcos-teen-82"
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      gameId={gameId}
      gameType="dcos"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Coins: {coins}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {getCurrentQuestion().text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getCurrentQuestion().options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-xl mb-2">{option.text}</h3>
                    <p className="text-white/90">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You understand how to respond to hate comments!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  Remember: Always report hate comments - they cause real harm and should not be tolerated!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, hate comments should always be reported!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Try to choose the option that reports hate comments and stands against discrimination.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default HateCommentStory;

