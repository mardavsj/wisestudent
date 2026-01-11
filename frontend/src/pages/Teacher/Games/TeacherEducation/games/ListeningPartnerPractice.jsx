import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Headphones, MessageCircle, Users, CheckCircle, Clock, TrendingUp, BookOpen, Star } from "lucide-react";

const ListeningPartnerPractice = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-75";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 2;
  
  const [currentRole, setCurrentRole] = useState("talker"); // "talker" or "listener"
  const [currentRound, setCurrentRound] = useState(1); // Round 1 or 2
  const [timeRemaining, setTimeRemaining] = useState(180); // 3 minutes = 180 seconds
  const [isActive, setIsActive] = useState(false);
  const [talkerNotes, setTalkerNotes] = useState("");
  const [listenerRatings, setListenerRatings] = useState({
    round1: null,
    round2: null
  });
  const [showScript, setShowScript] = useState(true);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Script cards for Talker and Listener roles
  const scriptCards = {
    talker: {
      title: "Talker Role",
      instructions: [
        "Share something you're experiencing - a challenge, success, or concern from teaching",
        "Speak for up to 3 minutes about your topic",
        "Notice how well your listener is listening - eye contact, body language, focus",
        "After your turn, rate how well you felt heard (1-5 stars)"
      ],
      prompts: [
        "A recent challenge in the classroom",
        "A success or win you want to share",
        "Something you're struggling with this week",
        "A concern about a student or situation",
        "An idea or plan you're excited about"
      ],
      tips: [
        "Choose something meaningful to you",
        "Speak naturally - this is practice for real conversations",
        "Notice what helps you feel heard",
        "There's no right or wrong thing to share"
      ]
    },
    listener: {
      title: "Listener Role",
      instructions: [
        "Give your full attention - eye contact, body language, focus",
        "Listen without interrupting - let them speak for up to 3 minutes",
        "Avoid problem-solving, advice, or sharing your own experiences",
        "Just listen actively - nod, maintain eye contact, show engagement"
      ],
      tips: [
        "Put away distractions - phone, papers, other thoughts",
        "Make eye contact (comfortable, not staring)",
        "Use body language - nod, lean slightly forward, open posture",
        "Avoid mental rehearsing what you'll say next",
        "Focus on understanding, not responding",
        "Notice when you want to interrupt - resist and keep listening"
      ],
      doNot: [
        "Don't interrupt or finish their sentences",
        "Don't give advice unless asked",
        "Don't share your own similar experiences",
        "Don't problem-solve or fix their issue",
        "Don't check your phone or look around"
      ]
    }
  };

  // Timer countdown
  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isActive && timeRemaining === 0) {
      // Time's up
      setIsActive(false);
    }
  }, [isActive, timeRemaining]);

  const handleStartRound = () => {
    setTimeRemaining(180); // Reset to 3 minutes
    setIsActive(true);
    setShowScript(false);
  };

  const handleStopRound = () => {
    setIsActive(false);
  };

  const handleRatingChange = (round, rating) => {
    setListenerRatings(prev => ({
      ...prev,
      [round]: rating
    }));
  };

  const handleNextRound = () => {
    if (currentRound === 1) {
      // Switch roles and move to round 2
      setCurrentRole("listener");
      setCurrentRound(2);
      setTimeRemaining(180);
      setShowScript(true);
      setIsActive(false);
    } else {
      // All rounds complete
      const avgRating = (listenerRatings.round1 + listenerRatings.round2) / 2;
      setScore(Math.round(avgRating || 0));
      setShowGameOver(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentScript = scriptCards[currentRole];
  const progress = currentRound === 1 ? 50 : 100;

  return (
    <TeacherGameShell
      title={gameData?.title || "Listening Partner Practice"}
      subtitle={gameData?.description || "Develop active listening through peer conversations"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentRound}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Round {currentRound} of 2</span>
            <span>{progress}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
            />
          </div>
        </div>

        {!showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Role Indicator */}
            <div className="text-center mb-8">
              <div className={`inline-block p-6 rounded-full mb-4 ${
                currentRole === "talker"
                  ? 'bg-gradient-to-r from-pink-100 to-rose-100'
                  : 'bg-gradient-to-r from-blue-100 to-indigo-100'
              }`}>
                <div className="text-5xl mb-2">
                  {currentRole === "talker" ? "🎤" : "👂"}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Round {currentRound}: {currentRole === "talker" ? "You are the Talker" : "You are the Listener"}
                </h2>
                <p className="text-gray-600">
                  {currentRound === 1 
                    ? "Practice sharing while your partner listens"
                    : "Practice listening while your partner shares"}
                </p>
              </div>
            </div>

            {/* Script Card */}
            {showScript && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-gradient-to-br rounded-xl p-6 border-2 mb-6 ${
                  currentRole === "talker"
                    ? 'from-pink-50 via-rose-50 to-orange-50 border-pink-200'
                    : 'from-blue-50 via-indigo-50 to-purple-50 border-blue-200'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r flex items-center justify-center ${
                    currentRole === "talker"
                      ? 'from-pink-500 to-rose-500'
                      : 'from-blue-500 to-indigo-500'
                  }`}>
                    {currentRole === "talker" ? (
                      <MessageCircle className="w-5 h-5 text-white" />
                    ) : (
                      <Headphones className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{currentScript.title}</h3>
                </div>

                <div className="bg-white rounded-lg p-5 mb-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Instructions:</h4>
                  <ul className="space-y-2 text-gray-700">
                    {currentScript.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {currentRole === "talker" && currentScript.prompts && (
                  <div className="bg-pink-100 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Talk about:</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      {currentScript.prompts.map((prompt, index) => (
                        <li key={index}>• {prompt}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentRole === "listener" && currentScript.tips && (
                  <div className="bg-blue-100 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Active Listening Tips:</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      {currentScript.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentRole === "listener" && currentScript.doNot && (
                  <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
                    <h4 className="font-semibold text-red-900 mb-2">Avoid:</h4>
                    <ul className="space-y-1 text-red-800 text-sm">
                      {currentScript.doNot.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="text-center mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStartRound}
                    className={`px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all ${
                      currentRole === "talker"
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-xl'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-xl'
                    }`}
                  >
                    Start {currentRole === "talker" ? "Sharing" : "Listening"}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Active Practice Session */}
            {!showScript && isActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`bg-gradient-to-br rounded-xl p-8 border-2 mb-6 ${
                  currentRole === "talker"
                    ? 'from-pink-50 via-rose-50 to-orange-50 border-pink-200'
                    : 'from-blue-50 via-indigo-50 to-purple-50 border-blue-200'
                }`}
              >
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">
                    {currentRole === "talker" ? "🎤" : "👂"}
                  </div>
                  <div className="text-6xl font-bold mb-4 text-gray-800">
                    {formatTime(timeRemaining)}
                  </div>
                  <p className="text-lg text-gray-600">
                    {currentRole === "talker" 
                      ? "Share your thoughts..." 
                      : "Listen actively..."}
                  </p>
                </div>

                {currentRole === "talker" && (
                  <div className="bg-white rounded-lg p-6 mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your notes or what you're sharing:
                    </label>
                    <textarea
                      value={talkerNotes}
                      onChange={(e) => setTalkerNotes(e.target.value)}
                      placeholder="Write down what you're sharing or your thoughts..."
                      rows={6}
                      className="w-full p-4 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-pink-500 focus:outline-none resize-none"
                    />
                  </div>
                )}

                {currentRole === "listener" && (
                  <div className="bg-white rounded-lg p-6 mb-6">
                    <div className="text-center mb-4">
                      <Headphones className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                      <p className="text-lg text-gray-700 font-semibold mb-2">
                        Practice Active Listening
                      </p>
                      <p className="text-gray-600 text-sm">
                        Focus on listening without interrupting. Notice your body language, eye contact, and attention.
                      </p>
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStopRound}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    End Round
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Rating Screen (After Round) */}
            {!showScript && !isActive && timeRemaining < 180 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-8 border-2 border-gray-200 mb-6"
              >
                {currentRole === "talker" ? (
                  <>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                      Rate How Well You Were Heard
                    </h3>
                    <p className="text-gray-600 text-center mb-6">
                      On a scale of 1-5, how well did your listener make you feel heard?
                    </p>
                    
                    <div className="flex justify-center gap-2 mb-6">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <motion.button
                          key={rating}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRatingChange(`round${currentRound}`, rating)}
                          className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all ${
                            listenerRatings[`round${currentRound}`] >= rating
                              ? 'bg-yellow-400 text-gray-900 shadow-lg'
                              : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                          }`}
                        >
                          <Star className={`w-8 h-8 ${
                            listenerRatings[`round${currentRound}`] >= rating
                              ? 'fill-current'
                              : ''
                          }`} />
                        </motion.button>
                      ))}
                    </div>

                    {listenerRatings[`round${currentRound}`] && (
                      <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200 mb-6">
                        <p className="text-center text-green-800 font-semibold">
                          You rated: {listenerRatings[`round${currentRound}`]} out of 5 stars
                        </p>
                      </div>
                    )}

                    <div className="text-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNextRound}
                        disabled={!listenerRatings[`round${currentRound}`]}
                        className={`px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all ${
                          listenerRatings[`round${currentRound}`]
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-xl'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {currentRound === 1 ? 'Switch to Listener Role' : 'View Summary'}
                      </motion.button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        Listening Round Complete
                      </h3>
                      <p className="text-gray-600">
                        You practiced active listening for 3 minutes. Well done!
                      </p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200 mb-6">
                      <h4 className="font-semibold text-blue-900 mb-3">Reflect on your listening:</h4>
                      <ul className="space-y-2 text-blue-800 text-sm">
                        <li>• Did you maintain eye contact?</li>
                        <li>• Did you avoid interrupting?</li>
                        <li>• Did you avoid giving advice or sharing your own experiences?</li>
                        <li>• Did you focus fully on understanding them?</li>
                        <li>• How did your body language show engagement?</li>
                      </ul>
                    </div>

                    <div className="text-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNextRound}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                      >
                        {currentRound === 1 ? 'Switch to Talker Role' : 'View Summary'}
                      </motion.button>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </div>
        )}

        {/* Game Over Summary */}
        {showGameOver && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-6xl mb-4"
              >
                👂✨
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Listening Partner Practice Complete!
              </h2>
              <p className="text-xl text-gray-600">
                You practiced both Talker and Listener roles
              </p>
            </div>

            {/* Rating Summary */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Your Experience Ratings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                  <p className="text-sm text-gray-600 mb-2">Round 1: As Talker</p>
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 ${
                          listenerRatings.round1 >= star
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-2">
                    {listenerRatings.round1 ? `${listenerRatings.round1} / 5 stars` : 'Not rated'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                  <p className="text-sm text-gray-600 mb-2">Round 2: As Talker</p>
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 ${
                          listenerRatings.round2 >= star
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-2">
                    {listenerRatings.round2 ? `${listenerRatings.round2} / 5 stars` : 'Not rated'}
                  </p>
                </div>
              </div>
              {listenerRatings.round1 && listenerRatings.round2 && (
                <div className="mt-4 text-center">
                  <p className="text-lg font-bold text-blue-600">
                    Average Rating: {((listenerRatings.round1 + listenerRatings.round2) / 2).toFixed(1)} / 5
                  </p>
                </div>
              )}
            </div>

            {/* Key Learnings */}
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <Headphones className="w-5 h-5" />
                Active Listening Skills Practiced
              </h3>
              <ul className="space-y-2 text-green-800">
                <li>• <strong>Full attention:</strong> You practiced giving complete focus to the speaker without distractions</li>
                <li>• <strong>Body language:</strong> You practiced using eye contact and open posture to show engagement</li>
                <li>• <strong>Non-interrupting:</strong> You practiced letting others speak without interrupting or finishing sentences</li>
                <li>• <strong>Non-judgmental:</strong> You practiced listening without immediately problem-solving or giving advice</li>
                <li>• <strong>Empathy:</strong> You practiced focusing on understanding the speaker's experience</li>
                <li>• <strong>Presence:</strong> You practiced being fully present rather than mentally rehearsing responses</li>
              </ul>
            </div>

            {/* Benefits */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Benefits of Active Listening
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li>• <strong>Builds trust:</strong> When people feel heard, they trust you more</li>
                <li>• <strong>Reduces misunderstandings:</strong> Full attention helps you understand accurately</li>
                <li>• <strong>Strengthens relationships:</strong> Active listening creates deeper connections</li>
                <li>• <strong>Improves problem-solving:</strong> Better understanding leads to better solutions</li>
                <li>• <strong>Reduces conflict:</strong> Feeling heard reduces defensiveness and conflict</li>
                <li>• <strong>Creates respect:</strong> Active listening shows respect for others' perspectives</li>
              </ul>
            </div>

            {/* Teacher Tip */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <BookOpen className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed mb-3">
                    <strong>Pair teachers randomly every week for 5-min listening rounds.</strong> Creating structured listening practice builds skills and strengthens relationships:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>Random pairing:</strong> Pair teachers randomly each week so everyone practices with different colleagues. This builds connections across the school and prevents cliques.</li>
                    <li><strong>Regular practice:</strong> Weekly practice makes active listening a habit rather than something that only happens in crisis moments. Consistency builds skills.</li>
                    <li><strong>Short time commitment:</strong> 5-minute rounds are manageable and don't feel burdensome. Short, regular practice is more sustainable than long sessions.</li>
                    <li><strong>Structured format:</strong> Use the Talker/Listener role format: 5 minutes for talker, then switch. The structure ensures everyone practices both roles.</li>
                    <li><strong>Safe space:</strong> Make it clear this is practice, not therapy. Teachers can share something light or something deeper - their choice.</li>
                    <li><strong>No pressure:</strong> Keep it low-pressure and optional (though encouraged). Teachers can pass or share something brief if preferred.</li>
                    <li><strong>Build culture:</strong> Regular listening practice creates a culture where people feel heard and supported. This strengthens the entire school community.</li>
                    <li><strong>Improve communication:</strong> Regular practice improves all communication in the school - with colleagues, students, and parents. Better listening skills benefit everyone.</li>
                    <li><strong>Reduce isolation:</strong> Regular listening rounds reduce teacher isolation and create connections. Teachers feel more supported and connected to the team.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you pair teachers randomly every week for 5-min listening rounds, you're creating structured practice that builds active listening skills, strengthens relationships, reduces isolation, and creates a culture where everyone feels heard and supported. Regular listening practice transforms school communication and builds a stronger, more connected teaching community.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default ListeningPartnerPractice;

