import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const LANGUAGE_STORAGE_KEY = "app_language";
const LOCALES_MANIFEST_URL = "/locales-manifest.json";

const mergePageCards = (pageData = {}, cardData = {}) => ({
  ...pageData,
  cards: {
    ...(pageData?.cards || {}),
    ...(cardData?.cards || {}),
  },
});

const loadJsonAsset = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load locale JSON: ${url}`);
  }
  return response.json();
};

let manifestPromise = null;
const getLocalesManifest = async () => {
  if (!manifestPromise) {
    manifestPromise = loadJsonAsset(LOCALES_MANIFEST_URL);
  }
  return manifestPromise;
};

const languageResourceCache = new Map();
let availableLanguages = new Set(["en"]);
const loadedLanguages = new Set();

const loadPagesGamesForLanguage = async (manifest, lang) => {
  const games = {};
  const pageEntries = manifest.pageGamesByLang?.[lang] || [];
  const cardEntries = manifest.pageCardsByLang?.[lang] || [];

  const [pageResults, cardResults] = await Promise.all([
    Promise.all(
      pageEntries.map(async (entry) => ({
        entry,
        data: await loadJsonAsset(entry.path),
      }))
    ),
    Promise.all(
      cardEntries.map(async (entry) => ({
        entry,
        data: await loadJsonAsset(entry.path),
      }))
    ),
  ]);

  for (const { entry, data } of pageResults) {
    games[entry.pillar] = games[entry.pillar] || {};
    games[entry.pillar][entry.module] = data;
  }

  for (const { entry, data } of cardResults) {
    games[entry.pillar] = games[entry.pillar] || {};
    games[entry.pillar][entry.module] = mergePageCards(
      games[entry.pillar][entry.module] || {},
      data
    );
  }

  return games;
};

const loadGamecontentForLanguage = async (manifest, lang) => {
  const gamecontent = {};
  const entries = manifest.gamecontentByLang?.[lang] || [];

  const results = await Promise.all(
    entries.map(async (entry) => ({
      entry,
      data: await loadJsonAsset(entry.path),
    }))
  );

  for (const { entry, data } of results) {
    gamecontent[entry.pillar] = gamecontent[entry.pillar] || {};
    gamecontent[entry.pillar][entry.module] = gamecontent[entry.pillar][entry.module] || {};
    gamecontent[entry.pillar][entry.module][entry.slug] = data;
  }

  return gamecontent;
};

const loadLanguageResourceData = async (manifest, lang) => {
  if (languageResourceCache.has(lang)) {
    return languageResourceCache.get(lang);
  }

  const [gamesPages, gamecontent] = await Promise.all([
    loadPagesGamesForLanguage(manifest, lang),
    loadGamecontentForLanguage(manifest, lang),
  ]);

  const resourceData = {
    pages: { games: gamesPages },
    gamecontent,
  };
  languageResourceCache.set(lang, resourceData);
  return resourceData;
};

const ensureLanguageLoaded = async (lng) => {
  const manifest = await getLocalesManifest();
  availableLanguages = new Set(manifest.availableLanguages || ["en"]);
  const targetLanguage = availableLanguages.has(lng) ? lng : "en";

  if (loadedLanguages.has(targetLanguage)) {
    return targetLanguage;
  }

  const resourceData = await loadLanguageResourceData(manifest, targetLanguage);
  i18n.addResourceBundle(targetLanguage, "pages", resourceData.pages, true, true);
  i18n.addResourceBundle(targetLanguage, "gamecontent", resourceData.gamecontent, true, true);
  loadedLanguages.add(targetLanguage);

  return targetLanguage;
};

let wrappedChangeLanguage = false;
const wrapChangeLanguage = () => {
  if (wrappedChangeLanguage) return;
  wrappedChangeLanguage = true;

  const originalChangeLanguage = i18n.changeLanguage.bind(i18n);
  i18n.changeLanguage = async (lng, ...args) => {
    const targetLanguage = await ensureLanguageLoaded(lng);
    return originalChangeLanguage(targetLanguage, ...args);
  };
};

const bootstrapLocaleData = async () => {
  const savedLanguage =
    typeof window !== "undefined"
      ? window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
      : null;

  const manifest = await getLocalesManifest();
  availableLanguages = new Set(manifest.availableLanguages || ["en"]);
  const initialLanguage = availableLanguages.has(savedLanguage) ? savedLanguage : "en";

  await ensureLanguageLoaded("en");
  if (initialLanguage !== "en") {
    await ensureLanguageLoaded(initialLanguage);
  }
  await i18n.changeLanguage(initialLanguage);
};

const initI18n = i18n
  .use(initReactI18next)
  .init({
    resources: {},
    lng: "en",
    fallbackLng: "en",
    ns: ["pages", "gamecontent"],
    defaultNS: "pages",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })
  .then(async () => {
    wrapChangeLanguage();
    await bootstrapLocaleData();
  });

export { LANGUAGE_STORAGE_KEY };
export { initI18n };
export default i18n;

