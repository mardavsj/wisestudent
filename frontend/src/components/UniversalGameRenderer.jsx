import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import financeGames, { getFinanceGame } from '../pages/Student/Finance';
import brainGames, { getBrainGame } from '../pages/Student/Brain';
import uvlsGames, { getUvlsGame } from '../pages/Student/UVLS';
import dcosGames, { getDcosGame } from '../pages/Student/DCOS';
import moralValuesGames, { getMoralValuesGame } from '../pages/Student/MoralValues';
import aiForAllGames, { getAiForAllGame } from '../pages/Student/AiForAll';
import eheGames, { getEheGame } from '../pages/Student/EHE';
import crgcGames, { getCrgcGame } from '../pages/Student/CRGC';
import sustainabilityGames, { getSustainabilityGame } from '../pages/Student/Sustainability';
import healthMaleGames, { getHealthMaleGame } from '../pages/Student/HealthMale';
import healthFemaleGames, { getHealthFemaleGame } from '../pages/Student/HealthFemale';

// registry of all game categories 
// TODO: add remaning games
const gameCategories = {
  finance: {
    games: financeGames,
    getGame: getFinanceGame,
    title: 'Financial Literacy',
    icon: '💰',
    color: 'from-green-500 to-emerald-600'
  },
  brain: {
    games: brainGames,
    getGame: getBrainGame,
    title: 'Brain Health',
    icon: '🧠',
    color: 'from-purple-500 to-pink-500'
  },
  uvls: {
    games: uvlsGames,
    getGame: getUvlsGame,
    title: 'Social Values (UVLS)',
    icon: '🤝',
    color: 'from-blue-500 to-indigo-600'
  },
  dcos: {
    games: dcosGames,
    getGame: getDcosGame,
    title: 'Digital Citizenship',
    icon: '🛡️',
    color: 'from-red-500 to-orange-500'
  },
  'moral-values': {
    games: moralValuesGames,
    getGame: getMoralValuesGame,
    title: 'Moral Values',
    icon: '⚖️',
    color: 'from-amber-500 to-yellow-600'
  },
  'ai-for-all': {
    games: aiForAllGames,
    getGame: getAiForAllGame,
    title: 'AI For All',
    icon: '🤖',
    color: 'from-cyan-500 to-teal-600'
  },
  ehe: {
    games: eheGames,
    getGame: getEheGame,
    title: 'Entrepreneurship & Career',
    icon: '🚀',
    color: 'from-violet-500 to-purple-600'
  },
  'civic-responsibility': {
    games: crgcGames,
    getGame: getCrgcGame,
    title: 'Civic Responsibility',
    icon: '🌍',
    color: 'from-emerald-500 to-green-600'
  },
  sustainability: {
    games: sustainabilityGames,
    getGame: getSustainabilityGame,
    title: 'Sustainability',
    icon: '🌱',
    color: 'from-green-500 to-teal-600'
  },
  'health-male': {
    games: healthMaleGames,
    getGame: getHealthMaleGame,
    title: 'Health - Male',
    icon: '🛡️',
    color: 'from-green-500 to-blue-600'
  },
  'health-female': {
    games: healthFemaleGames,
    getGame: getHealthFemaleGame,
    title: 'Health - Female',
    icon: '🌸',
    color: 'from-pink-500 to-purple-600'
  }
};

gameCategories["brain-health"] = gameCategories.brain;

const UniversalGameRenderer = () => {
  const {category, age, game: gameId} = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentGame, setCurrentGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState(null);
  const [error, setError] = useState(null);

  // Validate and load game component 
  useEffect(() => {
    const stateGameId = location.state?.gameId;
    console.log('Loading game:', { category, age, gameId, stateGameId });

    // Validate parameters
    if (!category || !age || !gameId) {
      setError('Missing required parameters: category, age, and game');
      setLoading(false);
      return;
    }

    // Validate category exists
    const catData = gameCategories[category];
    if (!catData) {
      setError(`Unknown category: ${category}`);
      setLoading(false);
      return;
    }

    // Validate age group
    if (!['kids', 'teen', 'teens', 'young-adult', 'adult', 'adults'].includes(age)) {
      setError(
        `Invalid age group: ${age}. Must be 'kids', 'teen', 'teens', 'young-adult', or 'adult'`
      );
      setLoading(false);
      return;
    }

    // Get the game component function
    let GameComponent = catData.getGame(age, gameId);
    
    // Special handling for duplicate paths: if gameId is in location.state, 
    // check if the component matches the expected gameId
    // This is needed for games like 'sports-story' which has two different games
    if (GameComponent && stateGameId && gameId === 'sports-story') {
      // For sports-story, we need to check which component should be used
      // brain-kids-38 should use SportsStory, brain-kids-98 should use SportsStories
      // The component itself will check location.state.gameId and return null if it's the wrong one
      // So we'll just use the first one found and let the component handle the check
      console.log('⚠️ Duplicate path detected for sports-story, using component with gameId check');
    }
    
    if (!GameComponent) {
      setError(`Game not found: ${gameId} in ${category} ${age}`);
      setLoading(false);
      return;
    }

    // Set category data and game component
    setCategoryData(catData);
    setCurrentGame(() => GameComponent); // Store as function to prevent looping
    setLoading(false);
  }, [category, age, gameId, location.state]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading game...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Game Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/student/dashboard')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!currentGame || !categoryData) {
    return null;
  }

  // Call the game component function here at top level for resolving issue of infinite rendering
  const GameComponent = currentGame;

  return (
      <GameComponent />
  );
};

export default UniversalGameRenderer;
