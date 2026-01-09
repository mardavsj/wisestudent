import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, ArrowRight, Gamepad2, Sparkles, Heart, Brain } from "lucide-react";
import { motion } from "framer-motion";
import { useWallet } from "../../../context/WalletContext";
import { useAuth } from "../../../hooks/useAuth";

const ParentGamesHub = () => {
  const navigate = useNavigate();
  const { wallet } = useWallet();
  const { user } = useAuth();

  const gameCategories = [
    {
      id: 'parent-education',
      title: 'Mental Health & Emotional Regulation',
      description: 'Core self-awareness and stress balance for parents.',
      icon: <Brain className="w-8 h-8" />,
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      hoverGradient: 'from-purple-400 via-pink-400 to-rose-400',
      bgGradient: 'from-purple-50 via-pink-50 to-rose-50',
      borderColor: 'border-purple-200',
      gamesCount: 100,
      emoji: '🧠'
    },
    // Future categories can be added here
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
      {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Gamepad2 className="w-8 h-8 text-white" />
                  </motion.div>
            <div>
                    <h1 className="text-4xl font-black text-white mb-1">
                      Parent Module
                    </h1>
                    <p className="text-white/90 text-lg font-medium">
                      Welcome back, {user?.name?.split(" ")[0] || "Parent"}! 👋 Learn and grow with interactive educational games
                    </p>
                  </div>
            </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl border border-white/30 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-white" />
                    <span className="text-white font-bold text-lg">
                      {wallet?.balance || 0} Healcoins
              </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

      {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {gameCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => navigate(`/parent/games/${category.id}`)}
              className={`group relative overflow-hidden rounded-3xl border-2 ${category.borderColor} bg-gradient-to-br ${category.bgGradient} shadow-xl cursor-pointer transition-all hover:shadow-2xl hover:border-purple-400`}
            >
              {/* Decorative background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white to-transparent rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white to-transparent rounded-full blur-xl"></div>
              </div>
              
              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <motion.div
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-white shadow-lg`}
                  >
                    {category.icon}
                  </motion.div>
                  <span className="text-3xl">{category.emoji}</span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">
                  {category.title}
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {category.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/50">
                  <span className="text-sm font-semibold text-gray-700 bg-white/60 px-3 py-1 rounded-full">
                  {category.gamesCount} {category.gamesCount === 1 ? 'game' : 'games'} available
                </span>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className={`p-2 rounded-lg bg-gradient-to-br ${category.gradient} text-white shadow-md`}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.hoverGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gameCategories.length * 0.1 }}
            className="relative overflow-hidden lg:col-span-2 rounded-3xl border border-indigo-200/70 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-6 py-5"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white to-transparent rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white to-transparent rounded-full blur-xl"></div>
            </div>
            <div className="relative h-full flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Why Play These Games?</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                These interactive games help you develop emotional intelligence, manage stress, and create a more positive home environment.
                Earn Healcoins by completing games and improve your parenting practice while taking care of your mental wellbeing.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ParentGamesHub;

