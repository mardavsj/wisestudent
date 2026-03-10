import i18n from "i18next";
import { initReactI18next } from "react-i18next";

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
import enFinancialLiteracyKidsMoneyBankStory from "../locales/en/gamecontent/financial-literacy/kids/money-bank-story.json";
import enFinancialLiteracyKidsQuizOnSaving from "../locales/en/gamecontent/financial-literacy/kids/quiz-on-saving.json";
import enFinancialLiteracyKidsReflexSavings from "../locales/en/gamecontent/financial-literacy/kids/reflex-savings.json";
import enFinancialLiteracyKidsPuzzleSaveOrSpend from "../locales/en/gamecontent/financial-literacy/kids/puzzle-save-or-spend.json";
import enFinancialLiteracyKidsBirthdayMoneyStory from "../locales/en/gamecontent/financial-literacy/kids/birthday-money-story.json";
import enFinancialLiteracyKidsPosterSavingHabit from "../locales/en/gamecontent/financial-literacy/kids/poster-saving-habit.json";
import enFinancialLiteracyKidsJournalOfSaving from "../locales/en/gamecontent/financial-literacy/kids/journal-of-saving.json";
import enFinancialLiteracyKidsShopStory from "../locales/en/gamecontent/financial-literacy/kids/shop-story.json";
import enFinancialLiteracyKidsReflexMoneyChoice from "../locales/en/gamecontent/financial-literacy/kids/reflex-money-choice.json";
import enFinancialLiteracyKidsBadgeSaverKid from "../locales/en/gamecontent/financial-literacy/kids/badge-saver-kid.json";
import enFinancialLiteracyKidsIceCreamStory from "../locales/en/gamecontent/financial-literacy/kids/ice-cream-story.json";
import enFinancialLiteracyKidsQuizOnSpending from "../locales/en/gamecontent/financial-literacy/kids/quiz-on-spending.json";
import enFinancialLiteracyKidsReflexSpending from "../locales/en/gamecontent/financial-literacy/kids/reflex-spending.json";
import enFinancialLiteracyKidsPuzzleSmartVsWaste from "../locales/en/gamecontent/financial-literacy/kids/puzzle-smart-vs-waste.json";
import enFinancialLiteracyKidsShopStory2 from "../locales/en/gamecontent/financial-literacy/kids/shop-story-2.json";
import enFinancialLiteracyKidsPosterSmartShopping from "../locales/en/gamecontent/financial-literacy/kids/poster-smart-shopping.json";
import enFinancialLiteracyKidsJournalOfSmartBuy from "../locales/en/gamecontent/financial-literacy/kids/journal-of-smart-buy.json";
import enFinancialLiteracyKidsCandyOfferStory from "../locales/en/gamecontent/financial-literacy/kids/candy-offer-story.json";
import enFinancialLiteracyKidsReflexNeedsFirst from "../locales/en/gamecontent/financial-literacy/kids/reflex-needs-first.json";
import enFinancialLiteracyKidsBadgeSmartSpenderKid from "../locales/en/gamecontent/financial-literacy/kids/badge-smart-spender-kid.json";
import enFinancialLiteracyKidsCandyStory from "../locales/en/gamecontent/financial-literacy/kids/candy-story.json";
import enFinancialLiteracyKidsBudgetingQuiz from "../locales/en/gamecontent/financial-literacy/kids/budgeting-quiz.json";
import enFinancialLiteracyKidsReflexBudget from "../locales/en/gamecontent/financial-literacy/kids/reflex-budget.json";
import enFinancialLiteracyKidsBudgetItemsPuzzle from "../locales/en/gamecontent/financial-literacy/kids/budget-items-puzzle.json";
import enFinancialLiteracyKidsBirthdayMoney from "../locales/en/gamecontent/financial-literacy/kids/birthday-money.json";
import enFinancialLiteracyKidsPosterPlanFirst from "../locales/en/gamecontent/financial-literacy/kids/poster-plan-first.json";
import enFinancialLiteracyKidsJournalOfBudgeting from "../locales/en/gamecontent/financial-literacy/kids/journal-of-budgeting.json";
import enFinancialLiteracyKidsSchoolFairStory from "../locales/en/gamecontent/financial-literacy/kids/school-fair-story.json";
import enFinancialLiteracyKidsReflexMoneyPlan from "../locales/en/gamecontent/financial-literacy/kids/reflex-money-plan.json";
import enFinancialLiteracyKidsBadgeBudgetKid from "../locales/en/gamecontent/financial-literacy/kids/badge-budget-kid.json";
import enFinancialLiteracyKidsIceCreamVsBookStory from "../locales/en/gamecontent/financial-literacy/kids/ice-cream-vs-book-story.json";
import enFinancialLiteracyKidsQuizOnNeeds from "../locales/en/gamecontent/financial-literacy/kids/quiz-on-needs.json";
import enFinancialLiteracyKidsReflexNeedVsWant from "../locales/en/gamecontent/financial-literacy/kids/reflex-need-vs-want.json";
import enFinancialLiteracyKidsPuzzleNeedsWants from "../locales/en/gamecontent/financial-literacy/kids/puzzle-needs-wants.json";
import enFinancialLiteracyKidsSnackStory from "../locales/en/gamecontent/financial-literacy/kids/snack-story.json";
import enFinancialLiteracyKidsPosterNeedsFirst from "../locales/en/gamecontent/financial-literacy/kids/poster-needs-first.json";
import enFinancialLiteracyKidsJournalOfNeeds from "../locales/en/gamecontent/financial-literacy/kids/journal-of-needs.json";
import enFinancialLiteracyKidsGiftMoneyStory from "../locales/en/gamecontent/financial-literacy/kids/gift-money-story.json";
import enFinancialLiteracyKidsReflexSmartPick from "../locales/en/gamecontent/financial-literacy/kids/reflex-smart-pick.json";
import enFinancialLiteracyKidsNeedsFirstKidBadge from "../locales/en/gamecontent/financial-literacy/kids/needs-first-kid-badge.json";
import enFinancialLiteracyKidsBankVisitStory from "../locales/en/gamecontent/financial-literacy/kids/bank-visit-story.json";
import enFinancialLiteracyKidsQuizBanks from "../locales/en/gamecontent/financial-literacy/kids/quiz-banks.json";
import enFinancialLiteracyKidsReflexBank from "../locales/en/gamecontent/financial-literacy/kids/reflex-bank.json";
import enFinancialLiteracyKidsPuzzleBankUses from "../locales/en/gamecontent/financial-literacy/kids/puzzle-bank-uses.json";
import enFinancialLiteracyKidsSavingsStory from "../locales/en/gamecontent/financial-literacy/kids/savings-story.json";
import enFinancialLiteracyKidsPosterBanksHelp from "../locales/en/gamecontent/financial-literacy/kids/poster-banks-help.json";
import enFinancialLiteracyKidsJournalFirstBank from "../locales/en/gamecontent/financial-literacy/kids/journal-first-bank.json";
import enFinancialLiteracyKidsAtmStory from "../locales/en/gamecontent/financial-literacy/kids/atm-story.json";
import enFinancialLiteracyKidsReflexBankSymbols from "../locales/en/gamecontent/financial-literacy/kids/reflex-bank-symbols.json";
import enFinancialLiteracyKidsBadgeBankExplorer from "../locales/en/gamecontent/financial-literacy/kids/badge-bank-explorer.json";
import enFinancialLiteracyKidsPencilStory from "../locales/en/gamecontent/financial-literacy/kids/pencil-story.json";
import enFinancialLiteracyKidsQuizBorrowing from "../locales/en/gamecontent/financial-literacy/kids/quiz-borrowing.json";
import enFinancialLiteracyKidsReflexBorrowSteal from "../locales/en/gamecontent/financial-literacy/kids/reflex-borrow-steal.json";
import enFinancialLiteracyKidsPuzzleBorrowMatch from "../locales/en/gamecontent/financial-literacy/kids/puzzle-borrow-match.json";
import enFinancialLiteracyKidsLunchBoxStory from "../locales/en/gamecontent/financial-literacy/kids/lunch-box-story.json";
import enFinancialLiteracyKidsPosterReturnBorrow from "../locales/en/gamecontent/financial-literacy/kids/poster-return-borrow.json";
import enFinancialLiteracyKidsJournalBorrowing from "../locales/en/gamecontent/financial-literacy/kids/journal-borrowing.json";
import enFinancialLiteracyKidsToyStory from "../locales/en/gamecontent/financial-literacy/kids/toy-story.json";
import enFinancialLiteracyKidsReflexBorrowRight from "../locales/en/gamecontent/financial-literacy/kids/reflex-borrow-right.json";
import enFinancialLiteracyKidsBadgeGoodBorrower from "../locales/en/gamecontent/financial-literacy/kids/badge-good-borrower.json";
import enFinancialLiteracyKidsTreeStory from "../locales/en/gamecontent/financial-literacy/kids/tree-story.json";
import enFinancialLiteracyKidsQuizOnGrowth from "../locales/en/gamecontent/financial-literacy/kids/quiz-on-growth.json";
import enFinancialLiteracyKidsReflexInvestmentBasics from "../locales/en/gamecontent/financial-literacy/kids/reflex-investment-basics.json";
import enFinancialLiteracyKidsPuzzleOfGrowth from "../locales/en/gamecontent/financial-literacy/kids/puzzle-of-growth.json";
import enFinancialLiteracyKidsPiggyBank from "../locales/en/gamecontent/financial-literacy/kids/piggy-bank.json";
import enFinancialLiteracyKidsPosterGrowYourMoney from "../locales/en/gamecontent/financial-literacy/kids/poster-grow-your-money.json";
import enFinancialLiteracyKidsJournalOfGrowth from "../locales/en/gamecontent/financial-literacy/kids/journal-of-growth.json";
import enFinancialLiteracyKidsToyVsSavingStory from "../locales/en/gamecontent/financial-literacy/kids/toy-vs-saving-story.json";
import enFinancialLiteracyKidsReflexGrowthCheck from "../locales/en/gamecontent/financial-literacy/kids/reflex-growth-check.json";
import enFinancialLiteracyKidsBadgeMoneyGardener from "../locales/en/gamecontent/financial-literacy/kids/badge-money-gardener.json";
import enFinancialLiteracyKidsLemonadeStory from "../locales/en/gamecontent/financial-literacy/kids/lemonade-story.json";
import enFinancialLiteracyKidsQuizOnEarning from "../locales/en/gamecontent/financial-literacy/kids/quiz-on-earning.json";
import enFinancialLiteracyKidsReflexWorkVsPlay from "../locales/en/gamecontent/financial-literacy/kids/reflex-work-vs-play.json";
import enFinancialLiteracyKidsPuzzleOfJobs from "../locales/en/gamecontent/financial-literacy/kids/puzzle-of-jobs.json";
import enFinancialLiteracyKidsHelpingParentsStory from "../locales/en/gamecontent/financial-literacy/kids/helping-parents-story.json";
import enFinancialLiteracyKidsPosterWorkToEarn from "../locales/en/gamecontent/financial-literacy/kids/poster-work-to-earn.json";
import enFinancialLiteracyKidsJournalOfEarning from "../locales/en/gamecontent/financial-literacy/kids/journal-of-earning.json";
import enFinancialLiteracyKidsPetSittingStory from "../locales/en/gamecontent/financial-literacy/kids/pet-sitting-story.json";
import enFinancialLiteracyKidsReflexSmallBusiness from "../locales/en/gamecontent/financial-literacy/kids/reflex-small-business.json";
import enFinancialLiteracyKidsBadgeYoungEarner from "../locales/en/gamecontent/financial-literacy/kids/badge-young-earner.json";
import enFinancialLiteracyKidsCandyShopStory from "../locales/en/gamecontent/financial-literacy/kids/candy-shop-story.json";
import enFinancialLiteracyKidsQuizOnHonesty from "../locales/en/gamecontent/financial-literacy/kids/quiz-on-honesty.json";
import enFinancialLiteracyKidsReflexScamAlert from "../locales/en/gamecontent/financial-literacy/kids/reflex-scam-alert.json";
import enFinancialLiteracyKidsPuzzleHonestVsFraud from "../locales/en/gamecontent/financial-literacy/kids/puzzle-honest-vs-fraud.json";
import enFinancialLiteracyKidsStrangerStory from "../locales/en/gamecontent/financial-literacy/kids/stranger-story.json";
import enFinancialLiteracyKidsPosterBeAlert from "../locales/en/gamecontent/financial-literacy/kids/poster-be-alert.json";
import enFinancialLiteracyKidsJournalSafety from "../locales/en/gamecontent/financial-literacy/kids/journal-safety.json";
import enFinancialLiteracyKidsToyShopStory from "../locales/en/gamecontent/financial-literacy/kids/toy-shop-story.json";
import enFinancialLiteracyKidsReflexCheckFirst from "../locales/en/gamecontent/financial-literacy/kids/reflex-check-first.json";
import enFinancialLiteracyKidsBadgeScamSpotterKid from "../locales/en/gamecontent/financial-literacy/kids/badge-scam-spotter-kid.json";
import enFinancialLiteracyKidsLostCoinStory from "../locales/en/gamecontent/financial-literacy/kids/lost-coin-story.json";
import enFinancialLiteracyKidsMoneyHonestyQuiz from "../locales/en/gamecontent/financial-literacy/kids/money-honesty-quiz.json";
import enFinancialLiteracyKidsReflexEthics from "../locales/en/gamecontent/financial-literacy/kids/reflex-ethics.json";
import enFinancialLiteracyKidsHonestyPuzzle from "../locales/en/gamecontent/financial-literacy/kids/honesty-puzzle.json";
import enFinancialLiteracyKidsFriendsMoneyStory from "../locales/en/gamecontent/financial-literacy/kids/friends-money-story.json";
import enFinancialLiteracyKidsHonestyPoster from "../locales/en/gamecontent/financial-literacy/kids/honesty-poster.json";
import enFinancialLiteracyKidsEthicsJournal from "../locales/en/gamecontent/financial-literacy/kids/ethics-journal.json";
import enFinancialLiteracyKidsShopStoryGame from "../locales/en/gamecontent/financial-literacy/kids/shop-story-game.json";
import enFinancialLiteracyKidsReflexMoneyTruth from "../locales/en/gamecontent/financial-literacy/kids/reflex-money-truth.json";
import enFinancialLiteracyKidsHonestKidBadge from "../locales/en/gamecontent/financial-literacy/kids/honest-kid-badge.json";

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
import hiFinancialLiteracyKidsMoneyBankStory from "../locales/hi/gamecontent/financial-literacy/kids/money-bank-story.json";
import hiFinancialLiteracyKidsQuizOnSaving from "../locales/hi/gamecontent/financial-literacy/kids/quiz-on-saving.json";
import hiFinancialLiteracyKidsReflexSavings from "../locales/hi/gamecontent/financial-literacy/kids/reflex-savings.json";
import hiFinancialLiteracyKidsPuzzleSaveOrSpend from "../locales/hi/gamecontent/financial-literacy/kids/puzzle-save-or-spend.json";
import hiFinancialLiteracyKidsBirthdayMoneyStory from "../locales/hi/gamecontent/financial-literacy/kids/birthday-money-story.json";
import hiFinancialLiteracyKidsPosterSavingHabit from "../locales/hi/gamecontent/financial-literacy/kids/poster-saving-habit.json";
import hiFinancialLiteracyKidsJournalOfSaving from "../locales/hi/gamecontent/financial-literacy/kids/journal-of-saving.json";
import hiFinancialLiteracyKidsShopStory from "../locales/hi/gamecontent/financial-literacy/kids/shop-story.json";
import hiFinancialLiteracyKidsReflexMoneyChoice from "../locales/hi/gamecontent/financial-literacy/kids/reflex-money-choice.json";
import hiFinancialLiteracyKidsBadgeSaverKid from "../locales/hi/gamecontent/financial-literacy/kids/badge-saver-kid.json";
import hiFinancialLiteracyKidsIceCreamStory from "../locales/hi/gamecontent/financial-literacy/kids/ice-cream-story.json";
import hiFinancialLiteracyKidsQuizOnSpending from "../locales/hi/gamecontent/financial-literacy/kids/quiz-on-spending.json";
import hiFinancialLiteracyKidsReflexSpending from "../locales/hi/gamecontent/financial-literacy/kids/reflex-spending.json";
import hiFinancialLiteracyKidsPuzzleSmartVsWaste from "../locales/hi/gamecontent/financial-literacy/kids/puzzle-smart-vs-waste.json";
import hiFinancialLiteracyKidsShopStory2 from "../locales/hi/gamecontent/financial-literacy/kids/shop-story-2.json";
import hiFinancialLiteracyKidsPosterSmartShopping from "../locales/hi/gamecontent/financial-literacy/kids/poster-smart-shopping.json";
import hiFinancialLiteracyKidsJournalOfSmartBuy from "../locales/hi/gamecontent/financial-literacy/kids/journal-of-smart-buy.json";
import hiFinancialLiteracyKidsCandyOfferStory from "../locales/hi/gamecontent/financial-literacy/kids/candy-offer-story.json";
import hiFinancialLiteracyKidsReflexNeedsFirst from "../locales/hi/gamecontent/financial-literacy/kids/reflex-needs-first.json";
import hiFinancialLiteracyKidsBadgeSmartSpenderKid from "../locales/hi/gamecontent/financial-literacy/kids/badge-smart-spender-kid.json";
import hiFinancialLiteracyKidsCandyStory from "../locales/hi/gamecontent/financial-literacy/kids/candy-story.json";
import hiFinancialLiteracyKidsBudgetingQuiz from "../locales/hi/gamecontent/financial-literacy/kids/budgeting-quiz.json";
import hiFinancialLiteracyKidsReflexBudget from "../locales/hi/gamecontent/financial-literacy/kids/reflex-budget.json";
import hiFinancialLiteracyKidsBudgetItemsPuzzle from "../locales/hi/gamecontent/financial-literacy/kids/budget-items-puzzle.json";
import hiFinancialLiteracyKidsBirthdayMoney from "../locales/hi/gamecontent/financial-literacy/kids/birthday-money.json";
import hiFinancialLiteracyKidsPosterPlanFirst from "../locales/hi/gamecontent/financial-literacy/kids/poster-plan-first.json";
import hiFinancialLiteracyKidsJournalOfBudgeting from "../locales/hi/gamecontent/financial-literacy/kids/journal-of-budgeting.json";
import hiFinancialLiteracyKidsSchoolFairStory from "../locales/hi/gamecontent/financial-literacy/kids/school-fair-story.json";
import hiFinancialLiteracyKidsReflexMoneyPlan from "../locales/hi/gamecontent/financial-literacy/kids/reflex-money-plan.json";
import hiFinancialLiteracyKidsBadgeBudgetKid from "../locales/hi/gamecontent/financial-literacy/kids/badge-budget-kid.json";
import hiFinancialLiteracyKidsIceCreamVsBookStory from "../locales/hi/gamecontent/financial-literacy/kids/ice-cream-vs-book-story.json";
import hiFinancialLiteracyKidsQuizOnNeeds from "../locales/hi/gamecontent/financial-literacy/kids/quiz-on-needs.json";
import hiFinancialLiteracyKidsReflexNeedVsWant from "../locales/hi/gamecontent/financial-literacy/kids/reflex-need-vs-want.json";
import hiFinancialLiteracyKidsPuzzleNeedsWants from "../locales/hi/gamecontent/financial-literacy/kids/puzzle-needs-wants.json";
import hiFinancialLiteracyKidsSnackStory from "../locales/hi/gamecontent/financial-literacy/kids/snack-story.json";
import hiFinancialLiteracyKidsPosterNeedsFirst from "../locales/hi/gamecontent/financial-literacy/kids/poster-needs-first.json";
import hiFinancialLiteracyKidsJournalOfNeeds from "../locales/hi/gamecontent/financial-literacy/kids/journal-of-needs.json";
import hiFinancialLiteracyKidsGiftMoneyStory from "../locales/hi/gamecontent/financial-literacy/kids/gift-money-story.json";
import hiFinancialLiteracyKidsReflexSmartPick from "../locales/hi/gamecontent/financial-literacy/kids/reflex-smart-pick.json";
import hiFinancialLiteracyKidsNeedsFirstKidBadge from "../locales/hi/gamecontent/financial-literacy/kids/needs-first-kid-badge.json";
import hiFinancialLiteracyKidsBankVisitStory from "../locales/hi/gamecontent/financial-literacy/kids/bank-visit-story.json";
import hiFinancialLiteracyKidsQuizBanks from "../locales/hi/gamecontent/financial-literacy/kids/quiz-banks.json";
import hiFinancialLiteracyKidsReflexBank from "../locales/hi/gamecontent/financial-literacy/kids/reflex-bank.json";
import hiFinancialLiteracyKidsPuzzleBankUses from "../locales/hi/gamecontent/financial-literacy/kids/puzzle-bank-uses.json";
import hiFinancialLiteracyKidsSavingsStory from "../locales/hi/gamecontent/financial-literacy/kids/savings-story.json";
import hiFinancialLiteracyKidsPosterBanksHelp from "../locales/hi/gamecontent/financial-literacy/kids/poster-banks-help.json";
import hiFinancialLiteracyKidsJournalFirstBank from "../locales/hi/gamecontent/financial-literacy/kids/journal-first-bank.json";
import hiFinancialLiteracyKidsAtmStory from "../locales/hi/gamecontent/financial-literacy/kids/atm-story.json";
import hiFinancialLiteracyKidsReflexBankSymbols from "../locales/hi/gamecontent/financial-literacy/kids/reflex-bank-symbols.json";
import hiFinancialLiteracyKidsBadgeBankExplorer from "../locales/hi/gamecontent/financial-literacy/kids/badge-bank-explorer.json";
import hiFinancialLiteracyKidsPencilStory from "../locales/hi/gamecontent/financial-literacy/kids/pencil-story.json";
import hiFinancialLiteracyKidsQuizBorrowing from "../locales/hi/gamecontent/financial-literacy/kids/quiz-borrowing.json";
import hiFinancialLiteracyKidsReflexBorrowSteal from "../locales/hi/gamecontent/financial-literacy/kids/reflex-borrow-steal.json";
import hiFinancialLiteracyKidsPuzzleBorrowMatch from "../locales/hi/gamecontent/financial-literacy/kids/puzzle-borrow-match.json";
import hiFinancialLiteracyKidsLunchBoxStory from "../locales/hi/gamecontent/financial-literacy/kids/lunch-box-story.json";
import hiFinancialLiteracyKidsPosterReturnBorrow from "../locales/hi/gamecontent/financial-literacy/kids/poster-return-borrow.json";
import hiFinancialLiteracyKidsJournalBorrowing from "../locales/hi/gamecontent/financial-literacy/kids/journal-borrowing.json";
import hiFinancialLiteracyKidsToyStory from "../locales/hi/gamecontent/financial-literacy/kids/toy-story.json";
import hiFinancialLiteracyKidsReflexBorrowRight from "../locales/hi/gamecontent/financial-literacy/kids/reflex-borrow-right.json";
import hiFinancialLiteracyKidsBadgeGoodBorrower from "../locales/hi/gamecontent/financial-literacy/kids/badge-good-borrower.json";
import hiFinancialLiteracyKidsTreeStory from "../locales/hi/gamecontent/financial-literacy/kids/tree-story.json";
import hiFinancialLiteracyKidsQuizOnGrowth from "../locales/hi/gamecontent/financial-literacy/kids/quiz-on-growth.json";
import hiFinancialLiteracyKidsReflexInvestmentBasics from "../locales/hi/gamecontent/financial-literacy/kids/reflex-investment-basics.json";
import hiFinancialLiteracyKidsPuzzleOfGrowth from "../locales/hi/gamecontent/financial-literacy/kids/puzzle-of-growth.json";
import hiFinancialLiteracyKidsPiggyBank from "../locales/hi/gamecontent/financial-literacy/kids/piggy-bank.json";
import hiFinancialLiteracyKidsPosterGrowYourMoney from "../locales/hi/gamecontent/financial-literacy/kids/poster-grow-your-money.json";
import hiFinancialLiteracyKidsJournalOfGrowth from "../locales/hi/gamecontent/financial-literacy/kids/journal-of-growth.json";
import hiFinancialLiteracyKidsToyVsSavingStory from "../locales/hi/gamecontent/financial-literacy/kids/toy-vs-saving-story.json";
import hiFinancialLiteracyKidsReflexGrowthCheck from "../locales/hi/gamecontent/financial-literacy/kids/reflex-growth-check.json";
import hiFinancialLiteracyKidsBadgeMoneyGardener from "../locales/hi/gamecontent/financial-literacy/kids/badge-money-gardener.json";
import hiFinancialLiteracyKidsLemonadeStory from "../locales/hi/gamecontent/financial-literacy/kids/lemonade-story.json";
import hiFinancialLiteracyKidsQuizOnEarning from "../locales/hi/gamecontent/financial-literacy/kids/quiz-on-earning.json";
import hiFinancialLiteracyKidsReflexWorkVsPlay from "../locales/hi/gamecontent/financial-literacy/kids/reflex-work-vs-play.json";
import hiFinancialLiteracyKidsPuzzleOfJobs from "../locales/hi/gamecontent/financial-literacy/kids/puzzle-of-jobs.json";
import hiFinancialLiteracyKidsHelpingParentsStory from "../locales/hi/gamecontent/financial-literacy/kids/helping-parents-story.json";
import hiFinancialLiteracyKidsPosterWorkToEarn from "../locales/hi/gamecontent/financial-literacy/kids/poster-work-to-earn.json";
import hiFinancialLiteracyKidsJournalOfEarning from "../locales/hi/gamecontent/financial-literacy/kids/journal-of-earning.json";
import hiFinancialLiteracyKidsPetSittingStory from "../locales/hi/gamecontent/financial-literacy/kids/pet-sitting-story.json";
import hiFinancialLiteracyKidsReflexSmallBusiness from "../locales/hi/gamecontent/financial-literacy/kids/reflex-small-business.json";
import hiFinancialLiteracyKidsBadgeYoungEarner from "../locales/hi/gamecontent/financial-literacy/kids/badge-young-earner.json";
import hiFinancialLiteracyKidsCandyShopStory from "../locales/hi/gamecontent/financial-literacy/kids/candy-shop-story.json";
import hiFinancialLiteracyKidsQuizOnHonesty from "../locales/hi/gamecontent/financial-literacy/kids/quiz-on-honesty.json";
import hiFinancialLiteracyKidsReflexScamAlert from "../locales/hi/gamecontent/financial-literacy/kids/reflex-scam-alert.json";
import hiFinancialLiteracyKidsPuzzleHonestVsFraud from "../locales/hi/gamecontent/financial-literacy/kids/puzzle-honest-vs-fraud.json";
import hiFinancialLiteracyKidsStrangerStory from "../locales/hi/gamecontent/financial-literacy/kids/stranger-story.json";
import hiFinancialLiteracyKidsPosterBeAlert from "../locales/hi/gamecontent/financial-literacy/kids/poster-be-alert.json";
import hiFinancialLiteracyKidsJournalSafety from "../locales/hi/gamecontent/financial-literacy/kids/journal-safety.json";
import hiFinancialLiteracyKidsToyShopStory from "../locales/hi/gamecontent/financial-literacy/kids/toy-shop-story.json";
import hiFinancialLiteracyKidsReflexCheckFirst from "../locales/hi/gamecontent/financial-literacy/kids/reflex-check-first.json";
import hiFinancialLiteracyKidsBadgeScamSpotterKid from "../locales/hi/gamecontent/financial-literacy/kids/badge-scam-spotter-kid.json";
import hiFinancialLiteracyKidsLostCoinStory from "../locales/hi/gamecontent/financial-literacy/kids/lost-coin-story.json";
import hiFinancialLiteracyKidsMoneyHonestyQuiz from "../locales/hi/gamecontent/financial-literacy/kids/money-honesty-quiz.json";
import hiFinancialLiteracyKidsReflexEthics from "../locales/hi/gamecontent/financial-literacy/kids/reflex-ethics.json";
import hiFinancialLiteracyKidsHonestyPuzzle from "../locales/hi/gamecontent/financial-literacy/kids/honesty-puzzle.json";
import hiFinancialLiteracyKidsFriendsMoneyStory from "../locales/hi/gamecontent/financial-literacy/kids/friends-money-story.json";
import hiFinancialLiteracyKidsHonestyPoster from "../locales/hi/gamecontent/financial-literacy/kids/honesty-poster.json";
import hiFinancialLiteracyKidsEthicsJournal from "../locales/hi/gamecontent/financial-literacy/kids/ethics-journal.json";
import hiFinancialLiteracyKidsShopStoryGame from "../locales/hi/gamecontent/financial-literacy/kids/shop-story-game.json";
import hiFinancialLiteracyKidsReflexMoneyTruth from "../locales/hi/gamecontent/financial-literacy/kids/reflex-money-truth.json";
import hiFinancialLiteracyKidsHonestKidBadge from "../locales/hi/gamecontent/financial-literacy/kids/honest-kid-badge.json";

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
        kids: {
          "money-bank-story": enFinancialLiteracyKidsMoneyBankStory,
          "quiz-on-saving": enFinancialLiteracyKidsQuizOnSaving,
          "reflex-savings": enFinancialLiteracyKidsReflexSavings,
          "puzzle-save-or-spend": enFinancialLiteracyKidsPuzzleSaveOrSpend,
          "birthday-money-story": enFinancialLiteracyKidsBirthdayMoneyStory,
          "poster-saving-habit": enFinancialLiteracyKidsPosterSavingHabit,
          "journal-of-saving": enFinancialLiteracyKidsJournalOfSaving,
          "shop-story": enFinancialLiteracyKidsShopStory,
          "reflex-money-choice": enFinancialLiteracyKidsReflexMoneyChoice,
          "badge-saver-kid": enFinancialLiteracyKidsBadgeSaverKid,
          "ice-cream-story": enFinancialLiteracyKidsIceCreamStory,
          "quiz-on-spending": enFinancialLiteracyKidsQuizOnSpending,
          "reflex-spending": enFinancialLiteracyKidsReflexSpending,
          "puzzle-smart-vs-waste": enFinancialLiteracyKidsPuzzleSmartVsWaste,
          "shop-story-2": enFinancialLiteracyKidsShopStory2,
          "poster-smart-shopping": enFinancialLiteracyKidsPosterSmartShopping,
          "journal-of-smart-buy": enFinancialLiteracyKidsJournalOfSmartBuy,
          "candy-offer-story": enFinancialLiteracyKidsCandyOfferStory,
          "reflex-needs-first": enFinancialLiteracyKidsReflexNeedsFirst,
          "badge-smart-spender-kid": enFinancialLiteracyKidsBadgeSmartSpenderKid,
          "candy-story": enFinancialLiteracyKidsCandyStory,
          "budgeting-quiz": enFinancialLiteracyKidsBudgetingQuiz,
          "reflex-budget": enFinancialLiteracyKidsReflexBudget,
          "budget-items-puzzle": enFinancialLiteracyKidsBudgetItemsPuzzle,
          "birthday-money": enFinancialLiteracyKidsBirthdayMoney,
          "poster-plan-first": enFinancialLiteracyKidsPosterPlanFirst,
          "journal-of-budgeting": enFinancialLiteracyKidsJournalOfBudgeting,
          "school-fair-story": enFinancialLiteracyKidsSchoolFairStory,
          "reflex-money-plan": enFinancialLiteracyKidsReflexMoneyPlan,
          "badge-budget-kid": enFinancialLiteracyKidsBadgeBudgetKid,
          "ice-cream-vs-book-story": enFinancialLiteracyKidsIceCreamVsBookStory,
          "quiz-on-needs": enFinancialLiteracyKidsQuizOnNeeds,
          "reflex-need-vs-want": enFinancialLiteracyKidsReflexNeedVsWant,
          "puzzle-needs-wants": enFinancialLiteracyKidsPuzzleNeedsWants,
          "snack-story": enFinancialLiteracyKidsSnackStory,
          "poster-needs-first": enFinancialLiteracyKidsPosterNeedsFirst,
          "journal-of-needs": enFinancialLiteracyKidsJournalOfNeeds,
          "gift-money-story": enFinancialLiteracyKidsGiftMoneyStory,
          "reflex-smart-pick": enFinancialLiteracyKidsReflexSmartPick,
          "needs-first-kid-badge": enFinancialLiteracyKidsNeedsFirstKidBadge,
          "bank-visit-story": enFinancialLiteracyKidsBankVisitStory,
          "quiz-banks": enFinancialLiteracyKidsQuizBanks,
          "reflex-bank": enFinancialLiteracyKidsReflexBank,
          "puzzle-bank-uses": enFinancialLiteracyKidsPuzzleBankUses,
          "savings-story": enFinancialLiteracyKidsSavingsStory,
          "poster-banks-help": enFinancialLiteracyKidsPosterBanksHelp,
          "journal-first-bank": enFinancialLiteracyKidsJournalFirstBank,
          "atm-story": enFinancialLiteracyKidsAtmStory,
          "reflex-bank-symbols": enFinancialLiteracyKidsReflexBankSymbols,
          "badge-bank-explorer": enFinancialLiteracyKidsBadgeBankExplorer,
          "pencil-story": enFinancialLiteracyKidsPencilStory,
          "quiz-borrowing": enFinancialLiteracyKidsQuizBorrowing,
          "reflex-borrow-steal": enFinancialLiteracyKidsReflexBorrowSteal,
          "puzzle-borrow-match": enFinancialLiteracyKidsPuzzleBorrowMatch,
          "lunch-box-story": enFinancialLiteracyKidsLunchBoxStory,
          "poster-return-borrow": enFinancialLiteracyKidsPosterReturnBorrow,
          "journal-borrowing": enFinancialLiteracyKidsJournalBorrowing,
          "toy-story": enFinancialLiteracyKidsToyStory,
          "reflex-borrow-right": enFinancialLiteracyKidsReflexBorrowRight,
          "badge-good-borrower": enFinancialLiteracyKidsBadgeGoodBorrower,
          "tree-story": enFinancialLiteracyKidsTreeStory,
          "quiz-on-growth": enFinancialLiteracyKidsQuizOnGrowth,
          "reflex-investment-basics": enFinancialLiteracyKidsReflexInvestmentBasics,
          "puzzle-of-growth": enFinancialLiteracyKidsPuzzleOfGrowth,
          "piggy-bank": enFinancialLiteracyKidsPiggyBank,
          "poster-grow-your-money": enFinancialLiteracyKidsPosterGrowYourMoney,
          "journal-of-growth": enFinancialLiteracyKidsJournalOfGrowth,
          "toy-vs-saving-story": enFinancialLiteracyKidsToyVsSavingStory,
          "reflex-growth-check": enFinancialLiteracyKidsReflexGrowthCheck,
          "badge-money-gardener": enFinancialLiteracyKidsBadgeMoneyGardener,
          "lemonade-story": enFinancialLiteracyKidsLemonadeStory,
          "quiz-on-earning": enFinancialLiteracyKidsQuizOnEarning,
          "reflex-work-vs-play": enFinancialLiteracyKidsReflexWorkVsPlay,
          "puzzle-of-jobs": enFinancialLiteracyKidsPuzzleOfJobs,
          "helping-parents-story": enFinancialLiteracyKidsHelpingParentsStory,
          "poster-work-to-earn": enFinancialLiteracyKidsPosterWorkToEarn,
          "journal-of-earning": enFinancialLiteracyKidsJournalOfEarning,
          "pet-sitting-story": enFinancialLiteracyKidsPetSittingStory,
          "reflex-small-business": enFinancialLiteracyKidsReflexSmallBusiness,
          "badge-young-earner": enFinancialLiteracyKidsBadgeYoungEarner,
          "candy-shop-story": enFinancialLiteracyKidsCandyShopStory,
          "quiz-on-honesty": enFinancialLiteracyKidsQuizOnHonesty,
          "reflex-scam-alert": enFinancialLiteracyKidsReflexScamAlert,
          "puzzle-honest-vs-fraud": enFinancialLiteracyKidsPuzzleHonestVsFraud,
          "stranger-story": enFinancialLiteracyKidsStrangerStory,
          "poster-be-alert": enFinancialLiteracyKidsPosterBeAlert,
          "journal-safety": enFinancialLiteracyKidsJournalSafety,
          "toy-shop-story": enFinancialLiteracyKidsToyShopStory,
          "reflex-check-first": enFinancialLiteracyKidsReflexCheckFirst,
          "badge-scam-spotter-kid": enFinancialLiteracyKidsBadgeScamSpotterKid,
          "lost-coin-story": enFinancialLiteracyKidsLostCoinStory,
          "money-honesty-quiz": enFinancialLiteracyKidsMoneyHonestyQuiz,
          "reflex-ethics": enFinancialLiteracyKidsReflexEthics,
          "honesty-puzzle": enFinancialLiteracyKidsHonestyPuzzle,
          "friends-money-story": enFinancialLiteracyKidsFriendsMoneyStory,
          "honesty-poster": enFinancialLiteracyKidsHonestyPoster,
          "ethics-journal": enFinancialLiteracyKidsEthicsJournal,
          "shop-story-game": enFinancialLiteracyKidsShopStoryGame,
          "reflex-money-truth": enFinancialLiteracyKidsReflexMoneyTruth,
          "honest-kid-badge": enFinancialLiteracyKidsHonestKidBadge,
        },
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
        kids: {
          "money-bank-story": hiFinancialLiteracyKidsMoneyBankStory,
          "quiz-on-saving": hiFinancialLiteracyKidsQuizOnSaving,
          "reflex-savings": hiFinancialLiteracyKidsReflexSavings,
          "puzzle-save-or-spend": hiFinancialLiteracyKidsPuzzleSaveOrSpend,
          "birthday-money-story": hiFinancialLiteracyKidsBirthdayMoneyStory,
          "poster-saving-habit": hiFinancialLiteracyKidsPosterSavingHabit,
          "journal-of-saving": hiFinancialLiteracyKidsJournalOfSaving,
          "shop-story": hiFinancialLiteracyKidsShopStory,
          "reflex-money-choice": hiFinancialLiteracyKidsReflexMoneyChoice,
          "badge-saver-kid": hiFinancialLiteracyKidsBadgeSaverKid,
          "ice-cream-story": hiFinancialLiteracyKidsIceCreamStory,
          "quiz-on-spending": hiFinancialLiteracyKidsQuizOnSpending,
          "reflex-spending": hiFinancialLiteracyKidsReflexSpending,
          "puzzle-smart-vs-waste": hiFinancialLiteracyKidsPuzzleSmartVsWaste,
          "shop-story-2": hiFinancialLiteracyKidsShopStory2,
          "poster-smart-shopping": hiFinancialLiteracyKidsPosterSmartShopping,
          "journal-of-smart-buy": hiFinancialLiteracyKidsJournalOfSmartBuy,
          "candy-offer-story": hiFinancialLiteracyKidsCandyOfferStory,
          "reflex-needs-first": hiFinancialLiteracyKidsReflexNeedsFirst,
          "badge-smart-spender-kid": hiFinancialLiteracyKidsBadgeSmartSpenderKid,
          "candy-story": hiFinancialLiteracyKidsCandyStory,
          "budgeting-quiz": hiFinancialLiteracyKidsBudgetingQuiz,
          "reflex-budget": hiFinancialLiteracyKidsReflexBudget,
          "budget-items-puzzle": hiFinancialLiteracyKidsBudgetItemsPuzzle,
          "birthday-money": hiFinancialLiteracyKidsBirthdayMoney,
          "poster-plan-first": hiFinancialLiteracyKidsPosterPlanFirst,
          "journal-of-budgeting": hiFinancialLiteracyKidsJournalOfBudgeting,
          "school-fair-story": hiFinancialLiteracyKidsSchoolFairStory,
          "reflex-money-plan": hiFinancialLiteracyKidsReflexMoneyPlan,
          "badge-budget-kid": hiFinancialLiteracyKidsBadgeBudgetKid,
          "ice-cream-vs-book-story": hiFinancialLiteracyKidsIceCreamVsBookStory,
          "quiz-on-needs": hiFinancialLiteracyKidsQuizOnNeeds,
          "reflex-need-vs-want": hiFinancialLiteracyKidsReflexNeedVsWant,
          "puzzle-needs-wants": hiFinancialLiteracyKidsPuzzleNeedsWants,
          "snack-story": hiFinancialLiteracyKidsSnackStory,
          "poster-needs-first": hiFinancialLiteracyKidsPosterNeedsFirst,
          "journal-of-needs": hiFinancialLiteracyKidsJournalOfNeeds,
          "gift-money-story": hiFinancialLiteracyKidsGiftMoneyStory,
          "reflex-smart-pick": hiFinancialLiteracyKidsReflexSmartPick,
          "needs-first-kid-badge": hiFinancialLiteracyKidsNeedsFirstKidBadge,
          "bank-visit-story": hiFinancialLiteracyKidsBankVisitStory,
          "quiz-banks": hiFinancialLiteracyKidsQuizBanks,
          "reflex-bank": hiFinancialLiteracyKidsReflexBank,
          "puzzle-bank-uses": hiFinancialLiteracyKidsPuzzleBankUses,
          "savings-story": hiFinancialLiteracyKidsSavingsStory,
          "poster-banks-help": hiFinancialLiteracyKidsPosterBanksHelp,
          "journal-first-bank": hiFinancialLiteracyKidsJournalFirstBank,
          "atm-story": hiFinancialLiteracyKidsAtmStory,
          "reflex-bank-symbols": hiFinancialLiteracyKidsReflexBankSymbols,
          "badge-bank-explorer": hiFinancialLiteracyKidsBadgeBankExplorer,
          "pencil-story": hiFinancialLiteracyKidsPencilStory,
          "quiz-borrowing": hiFinancialLiteracyKidsQuizBorrowing,
          "reflex-borrow-steal": hiFinancialLiteracyKidsReflexBorrowSteal,
          "puzzle-borrow-match": hiFinancialLiteracyKidsPuzzleBorrowMatch,
          "lunch-box-story": hiFinancialLiteracyKidsLunchBoxStory,
          "poster-return-borrow": hiFinancialLiteracyKidsPosterReturnBorrow,
          "journal-borrowing": hiFinancialLiteracyKidsJournalBorrowing,
          "toy-story": hiFinancialLiteracyKidsToyStory,
          "reflex-borrow-right": hiFinancialLiteracyKidsReflexBorrowRight,
          "badge-good-borrower": hiFinancialLiteracyKidsBadgeGoodBorrower,
          "tree-story": hiFinancialLiteracyKidsTreeStory,
          "quiz-on-growth": hiFinancialLiteracyKidsQuizOnGrowth,
          "reflex-investment-basics": hiFinancialLiteracyKidsReflexInvestmentBasics,
          "puzzle-of-growth": hiFinancialLiteracyKidsPuzzleOfGrowth,
          "piggy-bank": hiFinancialLiteracyKidsPiggyBank,
          "poster-grow-your-money": hiFinancialLiteracyKidsPosterGrowYourMoney,
          "journal-of-growth": hiFinancialLiteracyKidsJournalOfGrowth,
          "toy-vs-saving-story": hiFinancialLiteracyKidsToyVsSavingStory,
          "reflex-growth-check": hiFinancialLiteracyKidsReflexGrowthCheck,
          "badge-money-gardener": hiFinancialLiteracyKidsBadgeMoneyGardener,
          "lemonade-story": hiFinancialLiteracyKidsLemonadeStory,
          "quiz-on-earning": hiFinancialLiteracyKidsQuizOnEarning,
          "reflex-work-vs-play": hiFinancialLiteracyKidsReflexWorkVsPlay,
          "puzzle-of-jobs": hiFinancialLiteracyKidsPuzzleOfJobs,
          "helping-parents-story": hiFinancialLiteracyKidsHelpingParentsStory,
          "poster-work-to-earn": hiFinancialLiteracyKidsPosterWorkToEarn,
          "journal-of-earning": hiFinancialLiteracyKidsJournalOfEarning,
          "pet-sitting-story": hiFinancialLiteracyKidsPetSittingStory,
          "reflex-small-business": hiFinancialLiteracyKidsReflexSmallBusiness,
          "badge-young-earner": hiFinancialLiteracyKidsBadgeYoungEarner,
          "candy-shop-story": hiFinancialLiteracyKidsCandyShopStory,
          "quiz-on-honesty": hiFinancialLiteracyKidsQuizOnHonesty,
          "reflex-scam-alert": hiFinancialLiteracyKidsReflexScamAlert,
          "puzzle-honest-vs-fraud": hiFinancialLiteracyKidsPuzzleHonestVsFraud,
          "stranger-story": hiFinancialLiteracyKidsStrangerStory,
          "poster-be-alert": hiFinancialLiteracyKidsPosterBeAlert,
          "journal-safety": hiFinancialLiteracyKidsJournalSafety,
          "toy-shop-story": hiFinancialLiteracyKidsToyShopStory,
          "reflex-check-first": hiFinancialLiteracyKidsReflexCheckFirst,
          "badge-scam-spotter-kid": hiFinancialLiteracyKidsBadgeScamSpotterKid,
          "lost-coin-story": hiFinancialLiteracyKidsLostCoinStory,
          "money-honesty-quiz": hiFinancialLiteracyKidsMoneyHonestyQuiz,
          "reflex-ethics": hiFinancialLiteracyKidsReflexEthics,
          "honesty-puzzle": hiFinancialLiteracyKidsHonestyPuzzle,
          "friends-money-story": hiFinancialLiteracyKidsFriendsMoneyStory,
          "honesty-poster": hiFinancialLiteracyKidsHonestyPoster,
          "ethics-journal": hiFinancialLiteracyKidsEthicsJournal,
          "shop-story-game": hiFinancialLiteracyKidsShopStoryGame,
          "reflex-money-truth": hiFinancialLiteracyKidsReflexMoneyTruth,
          "honest-kid-badge": hiFinancialLiteracyKidsHonestKidBadge,
        },
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
