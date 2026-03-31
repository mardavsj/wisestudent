import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { parentEducationGameIdToSlug } from "./ParentEducation/gameSlugMap";

const parentGameModules = import.meta.glob("./ParentEducation/games/*.{jsx,js}");
const parentCategoryMap = new Set([
  "parent-education",
  "mental-health-emotional-regulation",
]);

const acronymTokenMap = {
  ai: ["AI", "Ai"],
  otp: ["OTP", "Otp"],
};

const normalizeKey = (value) => (value || "").toLowerCase().replace(/[^a-z0-9]/g, "");

const toPascal = (word) => {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
};

const slugToNameCandidates = (slug) => {
  const tokens = (slug || "")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((token) => token.toLowerCase());

  if (!tokens.length) return [];

  const variants = tokens.map((token) => acronymTokenMap[token] || [toPascal(token)]);
  const output = new Set();

  const walk = (idx, built) => {
    if (idx >= variants.length) {
      output.add(built.join(""));
      return;
    }
    for (const option of variants[idx]) {
      walk(idx + 1, [...built, option]);
    }
  };

  walk(0, []);
  return [...output];
};

const resolveParentImporter = (gameId) => {
  const resolvedSlug = parentEducationGameIdToSlug[gameId] || gameId;
  const candidates = slugToNameCandidates(resolvedSlug);

  for (const candidate of candidates) {
    const pathJsx = `./ParentEducation/games/${candidate}.jsx`;
    const pathJs = `./ParentEducation/games/${candidate}.js`;
    if (parentGameModules[pathJsx]) return parentGameModules[pathJsx];
    if (parentGameModules[pathJs]) return parentGameModules[pathJs];
  }

  const normalizedSlug = normalizeKey(resolvedSlug);
  const fuzzyEntry = Object.entries(parentGameModules).find(([filePath]) => {
    const fileName = filePath.split("/").pop()?.replace(/\.(jsx|js)$/i, "") || "";
    return normalizeKey(fileName) === normalizedSlug;
  });

  return fuzzyEntry?.[1] || null;
};

const UniversalParentGameRenderer = () => {
  const { category, gameId } = useParams();
  const navigate = useNavigate();
  const [currentGame, setCurrentGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const importer = useMemo(() => resolveParentImporter(gameId), [gameId]);

  useEffect(() => {
    let cancelled = false;

    const loadGame = async () => {
      setLoading(true);
      setError(null);
      setCurrentGame(null);

      if (!category || !gameId) {
        setError("Missing required parameters: category and game");
        setLoading(false);
        return;
      }

      if (!parentCategoryMap.has(category)) {
        setError(`Unknown category: ${category}`);
        setLoading(false);
        return;
      }

      if (!importer) {
        setError(`Game not found: ${gameId} in ${category}`);
        setLoading(false);
        return;
      }

      try {
        const module = await importer();
        if (cancelled) return;
        const component = module?.default;
        if (!component) {
          setError(`Invalid game module: ${gameId}`);
        } else {
          setCurrentGame(() => component);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError?.message || `Failed to load game: ${gameId}`);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadGame();

    return () => {
      cancelled = true;
    };
  }, [category, gameId, importer]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading game...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/parent/games")}
            className="text-blue-600 hover:underline"
          >
            Back to Parent Games
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

export default UniversalParentGameRenderer;

