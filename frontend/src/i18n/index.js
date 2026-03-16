import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import {
  enFinancialLiteracyKidsGameContent,
  hiFinancialLiteracyKidsGameContent,
} from "./financial-literacy/kids";

import {
  enBrainKidsGameContent,
  hiBrainKidsGameContent,
} from "./brain-health/kids";

import {
  enFinancialLiteracyTeensGameContent,
  hiFinancialLiteracyTeensGameContent,
} from "./financial-literacy/teens";

import {
  enFinancialLiteracyYoungAdultGameContent,
  hiFinancialLiteracyYoungAdultGameContent,
} from "./financial-literacy/young-adult";

import enFinancialLiteracyTeens from "../locales/en/pages/games/financial-literacy/teens.json";
import enFinancialLiteracyTeensCards from "../locales/en/pages/cardcontent/financial-literacy/teens.json";
import enFinancialLiteracyYoungAdult from "../locales/en/pages/games/financial-literacy/young-adult.json";
import enFinancialLiteracyYoungAdultCards from "../locales/en/pages/cardcontent/financial-literacy/young-adult.json";
import enFinancialLiteracyKids from "../locales/en/pages/games/financial-literacy/kids.json";
import enFinancialLiteracyKidsCards from "../locales/en/pages/cardcontent/financial-literacy/kids.json";
import enFinancialLiteracyBusinessLivelihoodFinance from "../locales/en/pages/games/financial-literacy/business-livelihood-finance.json";
import enFinancialLiteracyBusinessLivelihoodFinanceCards from "../locales/en/pages/cardcontent/financial-literacy/business-livelihood-finance.json";
import enFinancialLiteracyInsurancePension from "../locales/en/pages/games/financial-literacy/insurance-pension.json";
import enFinancialLiteracyInsurancePensionCards from "../locales/en/pages/cardcontent/financial-literacy/insurance-pension.json";
import enFinancialLiteracyAdults from "../locales/en/pages/games/financial-literacy/adults.json";
import enFinancialLiteracyAdultsCards from "../locales/en/pages/cardcontent/financial-literacy/adults.json";

import enBrainHealthKids from "../locales/en/pages/games/brain-health/kids.json";
import enBrainHealthKidsCards from "../locales/en/pages/cardcontent/brain-health/kids.json";
import enBrainHealthTeens from "../locales/en/pages/games/brain-health/teens.json";
import enBrainHealthTeensCards from "../locales/en/pages/cardcontent/brain-health/teens.json";
import enBrainHealthYoungAdult from "../locales/en/pages/games/brain-health/young-adult.json";
import enBrainHealthYoungAdultCards from "../locales/en/pages/cardcontent/brain-health/young-adult.json";
import enBrainHealthAdults from "../locales/en/pages/games/brain-health/adults.json";
import enBrainHealthAdultsCards from "../locales/en/pages/cardcontent/brain-health/adults.json";

import enUvlsKids from "../locales/en/pages/games/uvls/kids.json";
import enUvlsKidsCards from "../locales/en/pages/cardcontent/uvls/kids.json";
import enUvlsTeens from "../locales/en/pages/games/uvls/teens.json";
import enUvlsTeensCards from "../locales/en/pages/cardcontent/uvls/teens.json";
import enUvlsYoungAdult from "../locales/en/pages/games/uvls/young-adult.json";
import enUvlsAdults from "../locales/en/pages/games/uvls/adults.json";

import enDigitalCitizenshipKids from "../locales/en/pages/games/digital-citizenship/kids.json";
import enDigitalCitizenshipKidsCards from "../locales/en/pages/cardcontent/digital-citizenship/kids.json";
import enDigitalCitizenshipTeens from "../locales/en/pages/games/digital-citizenship/teens.json";
import enDigitalCitizenshipTeensCards from "../locales/en/pages/cardcontent/digital-citizenship/teens.json";
import enDigitalCitizenshipYoungAdult from "../locales/en/pages/games/digital-citizenship/young-adult.json";
import enDigitalCitizenshipAdults from "../locales/en/pages/games/digital-citizenship/adults.json";

import enMoralValuesKids from "../locales/en/pages/games/moral-values/kids.json";
import enMoralValuesKidsCards from "../locales/en/pages/cardcontent/moral-values/kids.json";
import enMoralValuesTeens from "../locales/en/pages/games/moral-values/teens.json";
import enMoralValuesTeensCards from "../locales/en/pages/cardcontent/moral-values/teens.json";
import enMoralValuesYoungAdult from "../locales/en/pages/games/moral-values/young-adult.json";
import enMoralValuesAdults from "../locales/en/pages/games/moral-values/adults.json";

import enAiForAllKids from "../locales/en/pages/games/ai-for-all/kids.json";
import enAiForAllKidsCards from "../locales/en/pages/cardcontent/ai-for-all/kids.json";
import enAiForAllTeens from "../locales/en/pages/games/ai-for-all/teens.json";
import enAiForAllTeensCards from "../locales/en/pages/cardcontent/ai-for-all/teens.json";
import enAiForAllYoungAdult from "../locales/en/pages/games/ai-for-all/young-adult.json";
import enAiForAllAdults from "../locales/en/pages/games/ai-for-all/adults.json";

import enHealthMaleKids from "../locales/en/pages/games/health-male/kids.json";
import enHealthMaleKidsCards from "../locales/en/pages/cardcontent/health-male/kids.json";
import enHealthMaleTeens from "../locales/en/pages/games/health-male/teens.json";
import enHealthMaleTeensCards from "../locales/en/pages/cardcontent/health-male/teens.json";
import enHealthMaleYoungAdult from "../locales/en/pages/games/health-male/young-adult.json";
import enHealthMaleAdults from "../locales/en/pages/games/health-male/adults.json";

import enHealthFemaleKids from "../locales/en/pages/games/health-female/kids.json";
import enHealthFemaleKidsCards from "../locales/en/pages/cardcontent/health-female/kids.json";
import enHealthFemaleTeens from "../locales/en/pages/games/health-female/teens.json";
import enHealthFemaleTeensCards from "../locales/en/pages/cardcontent/health-female/teens.json";
import enHealthFemaleYoungAdult from "../locales/en/pages/games/health-female/young-adult.json";
import enHealthFemaleAdults from "../locales/en/pages/games/health-female/adults.json";

import enEheKids from "../locales/en/pages/games/ehe/kids.json";
import enEheKidsCards from "../locales/en/pages/cardcontent/ehe/kids.json";
import enEheTeens from "../locales/en/pages/games/ehe/teens.json";
import enEheTeensCards from "../locales/en/pages/cardcontent/ehe/teens.json";
import enEheYoungAdult from "../locales/en/pages/games/ehe/young-adult.json";
import enEheAdults from "../locales/en/pages/games/ehe/adults.json";

import enCivicResponsibilityKids from "../locales/en/pages/games/civic-responsibility/kids.json";
import enCivicResponsibilityKidsCards from "../locales/en/pages/cardcontent/civic-responsibility/kids.json";
import enCivicResponsibilityTeens from "../locales/en/pages/games/civic-responsibility/teens.json";
import enCivicResponsibilityTeensCards from "../locales/en/pages/cardcontent/civic-responsibility/teens.json";
import enCivicResponsibilityYoungAdult from "../locales/en/pages/games/civic-responsibility/young-adult.json";
import enCivicResponsibilityAdults from "../locales/en/pages/games/civic-responsibility/adults.json";

import enSustainabilityKids from "../locales/en/pages/games/sustainability/kids.json";
import enSustainabilityKidsCards from "../locales/en/pages/cardcontent/sustainability/kids.json";
import enSustainabilityTeens from "../locales/en/pages/games/sustainability/teens.json";
import enSustainabilityTeensCards from "../locales/en/pages/cardcontent/sustainability/teens.json";
import enSustainabilityYoungAdult from "../locales/en/pages/games/sustainability/young-adult.json";
import enSustainabilityAdults from "../locales/en/pages/games/sustainability/adults.json";

import hiFinancialLiteracyTeens from "../locales/hi/pages/games/financial-literacy/teens.json";
import hiFinancialLiteracyTeensCards from "../locales/hi/pages/cardcontent/financial-literacy/teens.json";
import hiFinancialLiteracyYoungAdult from "../locales/hi/pages/games/financial-literacy/young-adult.json";
import hiFinancialLiteracyYoungAdultCards from "../locales/hi/pages/cardcontent/financial-literacy/young-adult.json";
import hiFinancialLiteracyKids from "../locales/hi/pages/games/financial-literacy/kids.json";
import hiFinancialLiteracyKidsCards from "../locales/hi/pages/cardcontent/financial-literacy/kids.json";
import hiFinancialLiteracyBusinessLivelihoodFinance from "../locales/hi/pages/games/financial-literacy/business-livelihood-finance.json";
import hiFinancialLiteracyBusinessLivelihoodFinanceCards from "../locales/hi/pages/cardcontent/financial-literacy/business-livelihood-finance.json";
import hiFinancialLiteracyInsurancePension from "../locales/hi/pages/games/financial-literacy/insurance-pension.json";
import hiFinancialLiteracyInsurancePensionCards from "../locales/hi/pages/cardcontent/financial-literacy/insurance-pension.json";
import hiFinancialLiteracyAdults from "../locales/hi/pages/games/financial-literacy/adults.json";
import hiFinancialLiteracyAdultsCards from "../locales/hi/pages/cardcontent/financial-literacy/adults.json";

import hiBrainHealthKids from "../locales/hi/pages/games/brain-health/kids.json";
import hiBrainHealthKidsCards from "../locales/hi/pages/cardcontent/brain-health/kids.json";
import hiBrainHealthTeens from "../locales/hi/pages/games/brain-health/teens.json";
import hiBrainHealthTeensCards from "../locales/hi/pages/cardcontent/brain-health/teens.json";
import hiBrainHealthYoungAdult from "../locales/hi/pages/games/brain-health/young-adult.json";
import hiBrainHealthYoungAdultCards from "../locales/hi/pages/cardcontent/brain-health/young-adult.json";
import hiBrainHealthAdults from "../locales/hi/pages/games/brain-health/adults.json";
import hiBrainHealthAdultsCards from "../locales/hi/pages/cardcontent/brain-health/adults.json";

import hiUvlsKids from "../locales/hi/pages/games/uvls/kids.json";
import hiUvlsKidsCards from "../locales/hi/pages/cardcontent/uvls/kids.json";
import hiUvlsTeens from "../locales/hi/pages/games/uvls/teens.json";
import hiUvlsTeensCards from "../locales/hi/pages/cardcontent/uvls/teens.json";
import hiUvlsYoungAdult from "../locales/hi/pages/games/uvls/young-adult.json";
import hiUvlsAdults from "../locales/hi/pages/games/uvls/adults.json";

import hiDigitalCitizenshipKids from "../locales/hi/pages/games/digital-citizenship/kids.json";
import hiDigitalCitizenshipKidsCards from "../locales/hi/pages/cardcontent/digital-citizenship/kids.json";
import hiDigitalCitizenshipTeens from "../locales/hi/pages/games/digital-citizenship/teens.json";
import hiDigitalCitizenshipTeensCards from "../locales/hi/pages/cardcontent/digital-citizenship/teens.json";
import hiDigitalCitizenshipYoungAdult from "../locales/hi/pages/games/digital-citizenship/young-adult.json";
import hiDigitalCitizenshipAdults from "../locales/hi/pages/games/digital-citizenship/adults.json";

import hiMoralValuesKids from "../locales/hi/pages/games/moral-values/kids.json";
import hiMoralValuesKidsCards from "../locales/hi/pages/cardcontent/moral-values/kids.json";
import hiMoralValuesTeens from "../locales/hi/pages/games/moral-values/teens.json";
import hiMoralValuesTeensCards from "../locales/hi/pages/cardcontent/moral-values/teens.json";
import hiMoralValuesYoungAdult from "../locales/hi/pages/games/moral-values/young-adult.json";
import hiMoralValuesAdults from "../locales/hi/pages/games/moral-values/adults.json";

import hiAiForAllKids from "../locales/hi/pages/games/ai-for-all/kids.json";
import hiAiForAllKidsCards from "../locales/hi/pages/cardcontent/ai-for-all/kids.json";
import hiAiForAllTeens from "../locales/hi/pages/games/ai-for-all/teens.json";
import hiAiForAllTeensCards from "../locales/hi/pages/cardcontent/ai-for-all/teens.json";
import hiAiForAllYoungAdult from "../locales/hi/pages/games/ai-for-all/young-adult.json";
import hiAiForAllAdults from "../locales/hi/pages/games/ai-for-all/adults.json";

import hiHealthMaleKids from "../locales/hi/pages/games/health-male/kids.json";
import hiHealthMaleKidsCards from "../locales/hi/pages/cardcontent/health-male/kids.json";
import hiHealthMaleTeens from "../locales/hi/pages/games/health-male/teens.json";
import hiHealthMaleTeensCards from "../locales/hi/pages/cardcontent/health-male/teens.json";
import hiHealthMaleYoungAdult from "../locales/hi/pages/games/health-male/young-adult.json";
import hiHealthMaleAdults from "../locales/hi/pages/games/health-male/adults.json";

import hiHealthFemaleKids from "../locales/hi/pages/games/health-female/kids.json";
import hiHealthFemaleKidsCards from "../locales/hi/pages/cardcontent/health-female/kids.json";
import hiHealthFemaleTeens from "../locales/hi/pages/games/health-female/teens.json";
import hiHealthFemaleTeensCards from "../locales/hi/pages/cardcontent/health-female/teens.json";
import hiHealthFemaleYoungAdult from "../locales/hi/pages/games/health-female/young-adult.json";
import hiHealthFemaleAdults from "../locales/hi/pages/games/health-female/adults.json";

import hiEheKids from "../locales/hi/pages/games/ehe/kids.json";
import hiEheKidsCards from "../locales/hi/pages/cardcontent/ehe/kids.json";
import hiEheTeens from "../locales/hi/pages/games/ehe/teens.json";
import hiEheTeensCards from "../locales/hi/pages/cardcontent/ehe/teens.json";
import hiEheYoungAdult from "../locales/hi/pages/games/ehe/young-adult.json";
import hiEheAdults from "../locales/hi/pages/games/ehe/adults.json";

import hiCivicResponsibilityKids from "../locales/hi/pages/games/civic-responsibility/kids.json";
import hiCivicResponsibilityKidsCards from "../locales/hi/pages/cardcontent/civic-responsibility/kids.json";
import hiCivicResponsibilityTeens from "../locales/hi/pages/games/civic-responsibility/teens.json";
import hiCivicResponsibilityTeensCards from "../locales/hi/pages/cardcontent/civic-responsibility/teens.json";
import hiCivicResponsibilityYoungAdult from "../locales/hi/pages/games/civic-responsibility/young-adult.json";
import hiCivicResponsibilityAdults from "../locales/hi/pages/games/civic-responsibility/adults.json";

import hiSustainabilityKids from "../locales/hi/pages/games/sustainability/kids.json";
import hiSustainabilityKidsCards from "../locales/hi/pages/cardcontent/sustainability/kids.json";
import hiSustainabilityTeens from "../locales/hi/pages/games/sustainability/teens.json";
import hiSustainabilityTeensCards from "../locales/hi/pages/cardcontent/sustainability/teens.json";
import hiSustainabilityYoungAdult from "../locales/hi/pages/games/sustainability/young-adult.json";
import hiSustainabilityAdults from "../locales/hi/pages/games/sustainability/adults.json";

const LANGUAGE_STORAGE_KEY = "app_language";
const savedLanguage = typeof window !== "undefined"
  ? window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  : null;

const mergePageCards = (pageData, cardData) => ({
  ...pageData,
  cards: {
    ...(pageData?.cards || {}),
    ...(cardData?.cards || {}),
  },
});

const resources = {
  en: {
    pages: {
      games: {
        "financial-literacy": {
          kids: mergePageCards(enFinancialLiteracyKids, enFinancialLiteracyKidsCards),
          teens: mergePageCards(enFinancialLiteracyTeens, enFinancialLiteracyTeensCards),
          "young-adult": mergePageCards(enFinancialLiteracyYoungAdult, enFinancialLiteracyYoungAdultCards),
          "business-livelihood-finance": mergePageCards(
            enFinancialLiteracyBusinessLivelihoodFinance,
            enFinancialLiteracyBusinessLivelihoodFinanceCards
          ),
          "insurance-pension": mergePageCards(
            enFinancialLiteracyInsurancePension,
            enFinancialLiteracyInsurancePensionCards
          ),
          adults: mergePageCards(enFinancialLiteracyAdults, enFinancialLiteracyAdultsCards),
        },
        "brain-health": {
          kids: mergePageCards(enBrainHealthKids, enBrainHealthKidsCards),
          teens: mergePageCards(enBrainHealthTeens, enBrainHealthTeensCards),
          "young-adult": mergePageCards(enBrainHealthYoungAdult, enBrainHealthYoungAdultCards),
          adults: mergePageCards(enBrainHealthAdults, enBrainHealthAdultsCards),
        },
        uvls: {
          kids: mergePageCards(enUvlsKids, enUvlsKidsCards),
          teens: mergePageCards(enUvlsTeens, enUvlsTeensCards),
          "young-adult": enUvlsYoungAdult,
          adults: enUvlsAdults,
        },
        "digital-citizenship": {
          kids: mergePageCards(enDigitalCitizenshipKids, enDigitalCitizenshipKidsCards),
          teens: mergePageCards(enDigitalCitizenshipTeens, enDigitalCitizenshipTeensCards),
          "young-adult": enDigitalCitizenshipYoungAdult,
          adults: enDigitalCitizenshipAdults,
        },
        "moral-values": {
          kids: mergePageCards(enMoralValuesKids, enMoralValuesKidsCards),
          teens: mergePageCards(enMoralValuesTeens, enMoralValuesTeensCards),
          "young-adult": enMoralValuesYoungAdult,
          adults: enMoralValuesAdults,
        },
        "ai-for-all": {
          kids: mergePageCards(enAiForAllKids, enAiForAllKidsCards),
          teens: mergePageCards(enAiForAllTeens, enAiForAllTeensCards),
          "young-adult": enAiForAllYoungAdult,
          adults: enAiForAllAdults,
        },
        "health-male": {
          kids: mergePageCards(enHealthMaleKids, enHealthMaleKidsCards),
          teens: mergePageCards(enHealthMaleTeens, enHealthMaleTeensCards),
          "young-adult": enHealthMaleYoungAdult,
          adults: enHealthMaleAdults,
        },
        "health-female": {
          kids: mergePageCards(enHealthFemaleKids, enHealthFemaleKidsCards),
          teens: mergePageCards(enHealthFemaleTeens, enHealthFemaleTeensCards),
          "young-adult": enHealthFemaleYoungAdult,
          adults: enHealthFemaleAdults,
        },
        ehe: {
          kids: mergePageCards(enEheKids, enEheKidsCards),
          teens: mergePageCards(enEheTeens, enEheTeensCards),
          "young-adult": enEheYoungAdult,
          adults: enEheAdults,
        },
        "civic-responsibility": {
          kids: mergePageCards(enCivicResponsibilityKids, enCivicResponsibilityKidsCards),
          teens: mergePageCards(enCivicResponsibilityTeens, enCivicResponsibilityTeensCards),
          "young-adult": enCivicResponsibilityYoungAdult,
          adults: enCivicResponsibilityAdults,
        },
        sustainability: {
          kids: mergePageCards(enSustainabilityKids, enSustainabilityKidsCards),
          teens: mergePageCards(enSustainabilityTeens, enSustainabilityTeensCards),
          "young-adult": enSustainabilityYoungAdult,
          adults: enSustainabilityAdults,
        },
      },
    },
    gamecontent: {
      "financial-literacy": {
        kids: enFinancialLiteracyKidsGameContent,
        teens: enFinancialLiteracyTeensGameContent,
        "young-adult": enFinancialLiteracyYoungAdultGameContent,
      },
      "brain-health": {
        kids: enBrainKidsGameContent,
      },
    },
  },
  hi: {
    pages: {
      games: {
        "financial-literacy": {
          kids: mergePageCards(hiFinancialLiteracyKids, hiFinancialLiteracyKidsCards),
          teens: mergePageCards(hiFinancialLiteracyTeens, hiFinancialLiteracyTeensCards),
          "young-adult": mergePageCards(hiFinancialLiteracyYoungAdult, hiFinancialLiteracyYoungAdultCards),
          "business-livelihood-finance": mergePageCards(
            hiFinancialLiteracyBusinessLivelihoodFinance,
            hiFinancialLiteracyBusinessLivelihoodFinanceCards
          ),
          "insurance-pension": mergePageCards(
            hiFinancialLiteracyInsurancePension,
            hiFinancialLiteracyInsurancePensionCards
          ),
          adults: mergePageCards(hiFinancialLiteracyAdults, hiFinancialLiteracyAdultsCards),
        },
        "brain-health": {
          kids: mergePageCards(hiBrainHealthKids, hiBrainHealthKidsCards),
          teens: mergePageCards(hiBrainHealthTeens, hiBrainHealthTeensCards),
          "young-adult": mergePageCards(hiBrainHealthYoungAdult, hiBrainHealthYoungAdultCards),
          adults: mergePageCards(hiBrainHealthAdults, hiBrainHealthAdultsCards),
        },
        uvls: {
          kids: mergePageCards(hiUvlsKids, hiUvlsKidsCards),
          teens: mergePageCards(hiUvlsTeens, hiUvlsTeensCards),
          "young-adult": hiUvlsYoungAdult,
          adults: hiUvlsAdults,
        },
        "digital-citizenship": {
          kids: mergePageCards(hiDigitalCitizenshipKids, hiDigitalCitizenshipKidsCards),
          teens: mergePageCards(hiDigitalCitizenshipTeens, hiDigitalCitizenshipTeensCards),
          "young-adult": hiDigitalCitizenshipYoungAdult,
          adults: hiDigitalCitizenshipAdults,
        },
        "moral-values": {
          kids: mergePageCards(hiMoralValuesKids, hiMoralValuesKidsCards),
          teens: mergePageCards(hiMoralValuesTeens, hiMoralValuesTeensCards),
          "young-adult": hiMoralValuesYoungAdult,
          adults: hiMoralValuesAdults,
        },
        "ai-for-all": {
          kids: mergePageCards(hiAiForAllKids, hiAiForAllKidsCards),
          teens: mergePageCards(hiAiForAllTeens, hiAiForAllTeensCards),
          "young-adult": hiAiForAllYoungAdult,
          adults: hiAiForAllAdults,
        },
        "health-male": {
          kids: mergePageCards(hiHealthMaleKids, hiHealthMaleKidsCards),
          teens: mergePageCards(hiHealthMaleTeens, hiHealthMaleTeensCards),
          "young-adult": hiHealthMaleYoungAdult,
          adults: hiHealthMaleAdults,
        },
        "health-female": {
          kids: mergePageCards(hiHealthFemaleKids, hiHealthFemaleKidsCards),
          teens: mergePageCards(hiHealthFemaleTeens, hiHealthFemaleTeensCards),
          "young-adult": hiHealthFemaleYoungAdult,
          adults: hiHealthFemaleAdults,
        },
        ehe: {
          kids: mergePageCards(hiEheKids, hiEheKidsCards),
          teens: mergePageCards(hiEheTeens, hiEheTeensCards),
          "young-adult": hiEheYoungAdult,
          adults: hiEheAdults,
        },
        "civic-responsibility": {
          kids: mergePageCards(hiCivicResponsibilityKids, hiCivicResponsibilityKidsCards),
          teens: mergePageCards(hiCivicResponsibilityTeens, hiCivicResponsibilityTeensCards),
          "young-adult": hiCivicResponsibilityYoungAdult,
          adults: hiCivicResponsibilityAdults,
        },
        sustainability: {
          kids: mergePageCards(hiSustainabilityKids, hiSustainabilityKidsCards),
          teens: mergePageCards(hiSustainabilityTeens, hiSustainabilityTeensCards),
          "young-adult": hiSustainabilityYoungAdult,
          adults: hiSustainabilityAdults,
        },
      },
    },
    gamecontent: {
      "financial-literacy": {
        kids: hiFinancialLiteracyKidsGameContent,
        teens: hiFinancialLiteracyTeensGameContent,
        "young-adult": hiFinancialLiteracyYoungAdultGameContent,
      },
      "brain-health": {
        kids: hiBrainKidsGameContent,
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage || "en",
  fallbackLng: "en",
  ns: ["pages", "gamecontent"],
  defaultNS: "pages",
  interpolation: {
    escapeValue: false,
  },
});

export { LANGUAGE_STORAGE_KEY };
export default i18n;
