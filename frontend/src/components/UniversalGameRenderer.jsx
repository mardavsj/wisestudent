import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const studentGameModules = import.meta.glob("../pages/Student/**/**/*.{jsx,js}");

const categoryFolderMap = {
  finance: "Finance",
  "financial-literacy": "Finance",
  brain: "Brain",
  "brain-health": "Brain",
  uvls: "UVLS",
  dcos: "DCOS",
  "moral-values": "MoralValues",
  "ai-for-all": "AiForAll",
  ehe: "EHE",
  "civic-responsibility": "CRGC",
  sustainability: "Sustainability",
  "health-male": "HealthMale",
  "health-female": "HealthFemale",
};

const ageFolderMap = {
  kids: "Kids",
  teen: "Teen",
  teens: "Teen",
  "young-adult": "YoungAdult",
  adult: "Adult",
  adults: "Adult",
  "insurance-pension": "InsurancePension",
  "business-livelihood-finance": "BusinessLivelihood",
};

const acronymTokenMap = {
  ai: ["AI", "Ai"],
  atm: ["ATM", "Atm"],
  uvls: ["UVLS", "Uvls"],
  dcos: ["DCOS", "Dcos"],
  ehe: ["EHE", "Ehe"],
  crgc: ["CRGC", "Crgc"],
};

const normalizeKey = (value) => (value || "").toLowerCase().replace(/[^a-z0-9]/g, "");

const toPascal = (word) => {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
};

const buildNameCandidates = (gameId) => {
  const tokens = (gameId || "")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((token) => token.toLowerCase());

  if (!tokens.length) {
    return [];
  }

  const variants = tokens.map((token) => acronymTokenMap[token] || [toPascal(token)]);
  const candidateSet = new Set();

  const walk = (index, built) => {
    if (index === variants.length) {
      candidateSet.add(built.join(""));
      return;
    }
    for (const option of variants[index]) {
      walk(index + 1, [...built, option]);
    }
  };

  walk(0, []);
  return [...candidateSet];
};

const resolveGameImporter = (category, age, gameId) => {
  const categoryFolder = categoryFolderMap[category];
  const ageFolder = ageFolderMap[age];

  if (!categoryFolder || !ageFolder || !gameId) {
    return null;
  }

  const basePath = `../pages/Student/${categoryFolder}/${ageFolder}/`;
  const baseEntries = Object.entries(studentGameModules).filter(([filePath]) =>
    filePath.startsWith(basePath)
  );

  if (!baseEntries.length) {
    return null;
  }

  const candidates = buildNameCandidates(gameId);
  for (const candidate of candidates) {
    const exactPathJsx = `${basePath}${candidate}.jsx`;
    const exactPathJs = `${basePath}${candidate}.js`;
    const exactEntry =
      studentGameModules[exactPathJsx] ||
      studentGameModules[exactPathJs];
    if (exactEntry) {
      return exactEntry;
    }
  }

  const normalizedGameId = normalizeKey(gameId);
  const fuzzyEntry = baseEntries.find(([filePath]) => {
    const filename = filePath.split("/").pop()?.replace(/\.(jsx|js)$/i, "") || "";
    return normalizeKey(filename) === normalizedGameId;
  });

  return fuzzyEntry?.[1] || null;
};

const UniversalGameRenderer = () => {
  const { category, age, game: gameId } = useParams();
  const navigate = useNavigate();
  const [currentGame, setCurrentGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const importer = useMemo(
    () => resolveGameImporter(category, age, gameId),
    [category, age, gameId]
  );

  useEffect(() => {
    let isCancelled = false;

    const loadGame = async () => {
      setLoading(true);
      setError(null);
      setCurrentGame(null);

      if (!category || !age || !gameId) {
        setError("Missing required parameters: category, age, and game");
        setLoading(false);
        return;
      }

      if (!importer) {
        setError(`Game not found: ${gameId} in ${category}/${age}`);
        setLoading(false);
        return;
      }

      try {
        const module = await importer();
        if (isCancelled) return;
        const component = module?.default;
        if (!component) {
          setError(`Invalid game module: ${gameId}`);
        } else {
          setCurrentGame(() => component);
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(loadError?.message || `Failed to load game: ${gameId}`);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadGame();

    return () => {
      isCancelled = true;
    };
  }, [category, age, gameId, importer]);

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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Game Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/student/dashboard")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!currentGame) {
    return null;
  }

  const GameComponent = currentGame;
  return <GameComponent />;
};

export default UniversalGameRenderer;
