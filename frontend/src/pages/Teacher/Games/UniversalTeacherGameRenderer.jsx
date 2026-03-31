import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { teacherEducationGameData } from "./TeacherEducation/data/gameData";

const teacherGameModules = import.meta.glob("./TeacherEducation/games/*.{jsx,js}");

const teacherCategoryMap = new Set([
  "teacher-education",
  "mental-health-emotional-regulation",
]);

const normalizeKey = (value) => (value || "").toLowerCase().replace(/[^a-z0-9]/g, "");

const toPascal = (word) => {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
};

const slugToCandidates = (slug) => {
  const tokens = (slug || "")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((token) => token.toLowerCase());

  if (!tokens.length) return [];
  return [tokens.map((token) => toPascal(token)).join("")];
};

const teacherIdToSlug = new Map(
  teacherEducationGameData.map((item) => [item.id, item.slug])
);

const resolveTeacherGameImporter = (gameId) => {
  const resolvedSlug = teacherIdToSlug.get(gameId) || gameId;
  const candidates = slugToCandidates(resolvedSlug);

  for (const candidate of candidates) {
    const pathJsx = `./TeacherEducation/games/${candidate}.jsx`;
    const pathJs = `./TeacherEducation/games/${candidate}.js`;
    if (teacherGameModules[pathJsx]) return teacherGameModules[pathJsx];
    if (teacherGameModules[pathJs]) return teacherGameModules[pathJs];
  }

  const normalizedSlug = normalizeKey(resolvedSlug);
  const fuzzyEntry = Object.entries(teacherGameModules).find(([filePath]) => {
    const filename = filePath.split("/").pop()?.replace(/\.(jsx|js)$/i, "") || "";
    return normalizeKey(filename) === normalizedSlug;
  });

  return fuzzyEntry?.[1] || null;
};

const UniversalTeacherGameRenderer = () => {
  const { category, gameId } = useParams();
  const navigate = useNavigate();
  const [currentGame, setCurrentGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const importer = useMemo(() => resolveTeacherGameImporter(gameId), [gameId]);

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

      if (!teacherCategoryMap.has(category)) {
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
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
            onClick={() => navigate("/school-teacher/games")}
            className="text-purple-600 hover:underline"
          >
            Back to Teacher Games
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

export default UniversalTeacherGameRenderer;
