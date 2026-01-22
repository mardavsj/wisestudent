import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";

const NameYourFeeling = () => {
  const location = useLocation();

  // Get game data
  const gameId = "parent-education-1";
  const gameData = getParentEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  const allScenarios = [
    {
      id: 1,
      title: "Child Tantrum Scenario",
      description: "Your 8-year-old child is having a meltdown in the grocery store because you said 'no' to buying candy. They're crying loudly, throwing items, and other shoppers are staring.",
      options: [
        "Embarrassed and Angry",
        "Calm and Understanding",
        "Frustrated and Overwhelmed",
        "Indifferent and Unaffected"
      ],
      correct: 2, // Frustrated and Overwhelmed
      reflection: "Recognizing you feel 'Frustrated and Overwhelmed' helps you pause before reacting. Naming this emotion allows you to respond calmly instead of escalating the situation. Teaching your child to name their emotions (like 'I'm feeling frustrated') helps them self-regulate too.",
      parentTip: "Naming emotions reduces overreaction. When you label your feeling, you create space to choose your response rather than react impulsively."
    },
    {
      id: 2,
      title: "Work Stress Scenario",
      description: "You just received an urgent work email at 6 PM asking for a report by tomorrow morning. Your child is asking for help with homework, dinner needs to be made, and you feel pulled in multiple directions.",
      options: [
        "Energetic and Motivated",
        "Stressed and Pressured",
        "Excited and Challenged",
        "Relaxed and Unconcerned"
      ],
      correct: 1, // Stressed and Pressured
      reflection: "Acknowledging you feel 'Stressed and Pressured' helps you communicate your needs clearly. You can say to your child: 'I'm feeling stressed right now. Let me finish this, then I'll help you.' This models emotional awareness and sets healthy boundaries.",
      parentTip: "When you name your stress, you can ask for help or set boundaries. Your child learns that it's okay to feel overwhelmed and that they can ask for support too."
    },
    {
      id: 3,
      title: "Tense Silence Scenario",
      description: "You and your teenager haven't spoken in two days after an argument about screen time. The house feels heavy with unspoken tension. Every interaction is brief and cold.",
      options: [
        "Peaceful and Content",
        "Angry and Resentful",
        "Hopeful and Optimistic",
        "Sad and Disconnected",
      ],
      correct: 3, // Sad and Disconnected
      reflection: "Identifying you feel 'Sad and Disconnected' opens the door to repair. You can initiate: 'I'm feeling sad that we're not talking. Can we find a time to reconnect?' Naming the emotion breaks the silence and creates an opportunity for healing.",
      parentTip: "Naming 'sadness' or 'disconnection' helps you reach out instead of waiting for the other person. It shows your child that relationships can be repaired through honest communication."
    },
    {
      id: 4,
      title: "Joyful Laughter Scenario",
      description: "Your family is playing a board game together. Everyone is laughing, sharing jokes, and genuinely enjoying each other's company. The room is filled with warmth and connection.",
      options: [
        "Anxious and Worried",
        "Bored and Disinterested",
        "Joyful and Connected",
        "Irritated and Impatient"
      ],
      correct: 2, // Joyful and Connected
      reflection: "Recognizing you feel 'Joyful and Connected' helps you savor the moment. You can say: 'I'm feeling so happy right now being together.' This reinforces positive family bonds and teaches your child to appreciate joyful moments.",
      parentTip: "Naming positive emotions like 'joy' and 'connection' helps you create more of these moments. Your child learns to recognize and express happiness, strengthening family bonds."
    },
    {
      id: 5,
      title: "Disappointment Scenario",
      description: "Your child shows you their test score - it's much lower than expected. They worked hard and studied, but the results don't reflect their effort. You see the disappointment in their eyes.",
      options: [
        "Disappointed and Concerned",
        "Proud and Encouraging",
        "Angry and Critical",
        "Indifferent and Unmoved"
      ],
      correct: 0, // Disappointed and Concerned
      reflection: "Acknowledging you feel 'Disappointed and Concerned' allows you to respond with empathy. You can say: 'I'm feeling disappointed too, but I'm also concerned about how you're feeling. Let's talk about what happened.' This validates their feelings while offering support.",
      parentTip: "Naming your disappointment helps you respond with empathy rather than criticism. Your child learns that disappointment is a normal emotion that can be discussed and worked through together."
    }
  ];

  // Use first 5 scenarios for this game (as per game structure requirement)
  const scenarios = allScenarios.slice(0, 5);

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    const newSelectedAnswers = { ...selectedAnswers, [questionIndex]: optionIndex };
    setSelectedAnswers(newSelectedAnswers);

    // Check if answer is correct
    if (optionIndex === scenarios[questionIndex].correct) {
      setScore(prev => prev + 1);
    }

    // Move to next question after a short delay
    setTimeout(() => {
      if (questionIndex < scenarios.length - 1) {
        setCurrentQuestion(questionIndex + 1);
      } else {
        // All questions answered
        setShowGameOver(true);
      }
    }, 8000); // 2 second delay to show reflection
  };

  const getOptionStyle = (questionIndex, optionIndex) => {
    const selected = selectedAnswers[questionIndex] === optionIndex;
    const isCorrect = optionIndex === scenarios[questionIndex].correct;
    const isSelected = selected;
    const showFeedback = isSelected;

    let backgroundColor = "bg-white";
    let borderColor = "border-gray-300";
    let textColor = "text-gray-700";

    if (showFeedback) {
      if (isCorrect) {
        backgroundColor = "bg-green-50";
        borderColor = "border-green-500";
        textColor = "text-green-700";
      } else {
        backgroundColor = "bg-red-50";
        borderColor = "border-red-500";
        textColor = "text-red-700";
      }
    } else if (selected) {
      backgroundColor = "bg-blue-50";
      borderColor = "border-blue-500";
      textColor = "text-blue-700";
    }

    return `${backgroundColor} ${borderColor} ${textColor}`;
  };

  return (
    <ParentGameShell
      title={gameData?.title || "Name Your Feeling"}
      subtitle={gameData?.description || "Recognize and label emotions in daily family situations"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentQuestion}
    >
      {currentQuestion < scenarios.length ? (
        <div className="w-full max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">
                  Scenario {currentQuestion + 1} of {scenarios.length}
                </span>
                <span className="text-sm font-medium text-gray-500">
                  Score: {score}/{scenarios.length}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-700 mb-3">
                {scenarios[currentQuestion].title}
              </h3>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-4">
                <p className="text-gray-700 leading-relaxed">
                  {scenarios[currentQuestion].description}
                </p>
              </div>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
              What emotion are you feeling in this situation?
            </h2>

            <div className="space-y-4 mb-6">
              {scenarios[currentQuestion].options.map((option, optionIndex) => {
                const isSelected = selectedAnswers[currentQuestion] === optionIndex;
                const isCorrect = optionIndex === scenarios[currentQuestion].correct;
                const showFeedback = isSelected;

                return (
                  <button
                    key={optionIndex}
                    onClick={() => !selectedAnswers[currentQuestion] && handleAnswerSelect(currentQuestion, optionIndex)}
                    disabled={!!selectedAnswers[currentQuestion]}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${getOptionStyle(currentQuestion, optionIndex)
                      } ${selectedAnswers[currentQuestion] ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-md'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option}</span>
                      {showFeedback && (
                        <span className="text-xl">
                          {isCorrect ? '✓' : '✗'}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Reflection Message */}
            {selectedAnswers[currentQuestion] !== undefined && (
              <div className={`mt-6 p-4 rounded-xl border-2 ${selectedAnswers[currentQuestion] === scenarios[currentQuestion].correct
                  ? 'bg-green-50 border-green-200'
                  : 'bg-orange-50 border-orange-200'
                }`}>
                <div className="flex items-start gap-3">
                  <div className={`text-2xl flex-shrink-0 ${selectedAnswers[currentQuestion] === scenarios[currentQuestion].correct
                      ? 'text-green-600'
                      : 'text-orange-600'
                    }`}>
                    {selectedAnswers[currentQuestion] === scenarios[currentQuestion].correct ? '💡' : '📝'}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold mb-2 ${selectedAnswers[currentQuestion] === scenarios[currentQuestion].correct
                        ? 'text-green-800'
                        : 'text-orange-800'
                      }`}>
                      {selectedAnswers[currentQuestion] === scenarios[currentQuestion].correct
                        ? 'Reflection'
                        : 'Learning Moment'}
                    </h4>
                    <p className={`text-sm leading-relaxed mb-2 ${selectedAnswers[currentQuestion] === scenarios[currentQuestion].correct
                        ? 'text-green-700'
                        : 'text-orange-700'
                      }`}>
                      {scenarios[currentQuestion].reflection}
                    </p>
                    <div className="bg-white/60 rounded-lg p-3 mt-3 border border-blue-200">
                      <p className="text-xs font-semibold text-blue-800 mb-1">Parent Tip:</p>
                      <p className="text-xs text-blue-700">
                        {scenarios[currentQuestion].parentTip}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </ParentGameShell>
  );
};

export default NameYourFeeling;