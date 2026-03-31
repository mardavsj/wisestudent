import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; //eslint-disable-line no-unused-vars
import { 
  ArrowLeft, TrendingUp, TrendingDown, DollarSign, BarChart3, 
  RefreshCw, Clock, Info, Save, Plus, Minus, X, Check, 
  PieChart, LineChart, Activity, AlertCircle, CheckCircle2,
  Target, Zap, Award, TrendingUp as TrendingUpIcon, 
  TrendingDown as TrendingDownIcon, Filter, Download,
  Eye, EyeOff, Calendar, History, Bell, Settings,
  Lightbulb, Sparkles, Wallet, CreditCard, ArrowUp,
  ArrowDown, Percent, DollarSign as DollarIcon, 
  BarChart2, PieChart as PieChartIcon, LineChart as LineChartIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import LanguageSelector from '../../components/LanguageSelector';
import { fetchInvestmentData, saveInvestmentData } from '../../services/studentService';
import { logActivity } from '../../services/activityService';
import { toast } from 'react-hot-toast';

const InvestmentSimulator = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('tools');
  const tt = (key, defaultValue, options = {}) =>
    t(`financial-literacy.investment-simulator.${key}`, { defaultValue, ...options });
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState({
    cash: 100000,
    investments: [],
    history: [],
    transactions: [],
    watchlist: []
  });
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState('market'); // 'market', 'limit', 'stop'
  const [limitPrice, setLimitPrice] = useState('');
  const [stocks, setStocks] = useState([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('market'); // 'market', 'portfolio', 'analytics', 'history'
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [filterSector, setFilterSector] = useState('all');
  const [sortBy, setSortBy] = useState('symbol'); // 'symbol', 'price', 'change', 'volume'

  // Calculate user age
  const userAge = useMemo(() => {
    if (!user) return null;
    const dob = user.dateOfBirth || user.dob;
    if (!dob) return null;
    
    const dobDate = typeof dob === 'string' ? new Date(dob) : new Date(dob);
    if (isNaN(dobDate.getTime())) return null;
    
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    
    return age;
  }, [user]);

  // Determine age group
  const ageGroup = useMemo(() => {
    if (userAge === null) return 'adults';
    if (userAge < 13) return 'kids';
    if (userAge < 18) return 'teens';
    return 'adults';
  }, [userAge]);

  // Age-appropriate configuration
  const config = useMemo(() => {
    if (ageGroup === 'kids') {
      return {
        initialCash: 10000,
        sectors: ['Toys', 'Games', 'Tech', 'Food', 'Fun'],
        theme: 'fun',
        language: 'simple',
        showAdvanced: false,
        maxDays: 30,
      };
    } else if (ageGroup === 'teens') {
      return {
        initialCash: 50000,
        sectors: ['Technology', 'Finance', 'Healthcare', 'Energy', 'Consumer', 'Entertainment'],
        theme: 'modern',
        language: 'balanced',
        showAdvanced: true,
        maxDays: 90,
      };
    } else {
      return {
        initialCash: 100000,
        sectors: ['Technology', 'Finance', 'Healthcare', 'Energy', 'Consumer', 'Industrial', 'Retail', 'Utilities', 'Real Estate'],
        theme: 'professional',
        language: 'detailed',
        showAdvanced: true,
        maxDays: 365,
      };
    }
  }, [ageGroup]);

  // Generate realistic stock data
  const generateStocks = useCallback(() => {
    const stockTemplates = {
      kids: [
        { symbol: 'TOYS', name: 'ToyLand Inc', sector: 'Toys', basePrice: 25, volatility: 0.08 },
        { symbol: 'GAME', name: 'GameZone Corp', sector: 'Games', basePrice: 30, volatility: 0.10 },
        { symbol: 'TECH', name: 'TechKids', sector: 'Tech', basePrice: 40, volatility: 0.12 },
        { symbol: 'SNACK', name: 'SnackTime', sector: 'Food', basePrice: 15, volatility: 0.06 },
        { symbol: 'FUN', name: 'FunWorld', sector: 'Fun', basePrice: 20, volatility: 0.09 },
      ],
      teens: [
        { symbol: 'TECH', name: 'TechCorp', sector: 'Technology', basePrice: 150, volatility: 0.05 },
        { symbol: 'FNCE', name: 'FinanceHub', sector: 'Finance', basePrice: 120, volatility: 0.03 },
        { symbol: 'HLTH', name: 'HealthPlus', sector: 'Healthcare', basePrice: 100, volatility: 0.04 },
        { symbol: 'ENRG', name: 'EnergyNow', sector: 'Energy', basePrice: 80, volatility: 0.06 },
        { symbol: 'CONS', name: 'ConsumerGoods', sector: 'Consumer', basePrice: 60, volatility: 0.02 },
        { symbol: 'ENT', name: 'EntertainCo', sector: 'Entertainment', basePrice: 45, volatility: 0.07 },
      ],
      adults: [
        { symbol: 'TECH', name: 'TechCorp International', sector: 'Technology', basePrice: 250, volatility: 0.05 },
        { symbol: 'FNCE', name: 'Global Finance Group', sector: 'Finance', basePrice: 180, volatility: 0.03 },
        { symbol: 'HLTH', name: 'HealthCare Systems', sector: 'Healthcare', basePrice: 220, volatility: 0.04 },
        { symbol: 'ENRG', name: 'Energy Solutions Inc', sector: 'Energy', basePrice: 95, volatility: 0.06 },
        { symbol: 'CONS', name: 'Consumer Products Co', sector: 'Consumer', basePrice: 75, volatility: 0.02 },
        { symbol: 'INDS', name: 'Industrial Manufacturing', sector: 'Industrial', basePrice: 110, volatility: 0.04 },
        { symbol: 'RETL', name: 'Retail Giant Corp', sector: 'Retail', basePrice: 65, volatility: 0.03 },
        { symbol: 'UTIL', name: 'Utilities Power Co', sector: 'Utilities', basePrice: 50, volatility: 0.02 },
        { symbol: 'REAL', name: 'Real Estate Holdings', sector: 'Real Estate', basePrice: 140, volatility: 0.04 },
      ],
    };

    const templates = stockTemplates[ageGroup] || stockTemplates.adults;
    
    return templates.map((template, index) => {
      const price = template.basePrice * (0.8 + Math.random() * 0.4);
      const history = [];
      for (let i = 0; i < 30; i++) {
        history.push({
          day: i + 1,
          price: price * (0.9 + Math.random() * 0.2),
          volume: Math.floor(Math.random() * 1000000) + 100000
        });
      }
      
      return {
        id: index + 1,
        ...template,
        price: parseFloat(price.toFixed(2)),
        previousPrice: price,
        change: 0,
        changePercent: 0,
        volume: Math.floor(Math.random() * 1000000) + 100000,
        marketCap: price * (Math.floor(Math.random() * 10000000) + 1000000),
        peRatio: parseFloat((10 + Math.random() * 30).toFixed(2)),
        dividendYield: parseFloat((Math.random() * 5).toFixed(2)),
        beta: parseFloat((0.5 + Math.random() * 1.5).toFixed(2)),
        history,
        high52Week: price * 1.3,
        low52Week: price * 0.7,
        avgVolume: Math.floor(Math.random() * 2000000) + 500000,
      };
    });
  }, [ageGroup]);

  // Load investment data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const generatedStocks = generateStocks();
        setStocks(generatedStocks);
        
        const data = await fetchInvestmentData();
        if (data) {
          setPortfolio({
            cash: data.cash || config.initialCash,
            investments: data.investments || [],
            history: data.history || [],
            transactions: data.transactions || [],
            watchlist: data.watchlist || []
          });
          if (data.currentDay) setCurrentDay(data.currentDay);
        } else {
          setPortfolio(prev => ({
            ...prev,
            cash: config.initialCash
          }));
        }
        

        logActivity({
          activityType: 'page_view',
          description: 'Viewed investment simulator',
          metadata: {
            page: '/student/finance/investment-simulator',
            ageGroup,
            timestamp: new Date().toISOString(),
          },
          pageUrl: window.location.pathname,
        });
      } catch (error) {
        console.error('Error loading investment data:', error);
        const generatedStocks = generateStocks();
        setStocks(generatedStocks);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [ageGroup, config.initialCash, generateStocks]);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
      
      const timer = setTimeout(async () => {
        try {
          await saveInvestmentData({
            cash: portfolio.cash,
            investments: portfolio.investments,
            history: portfolio.history,
            transactions: portfolio.transactions,
            watchlist: portfolio.watchlist,
            currentDay
          });
          localStorage.setItem('investmentData', JSON.stringify({
            cash: portfolio.cash,
            investments: portfolio.investments,
            history: portfolio.history,
            transactions: portfolio.transactions,
            watchlist: portfolio.watchlist,
            currentDay
          }));
          setHasUnsavedChanges(false);
        } catch (error) {
          console.error('Auto-save failed:', error);
          localStorage.setItem('investmentData', JSON.stringify({
            cash: portfolio.cash,
            investments: portfolio.investments,
            history: portfolio.history,
            transactions: portfolio.transactions,
            watchlist: portfolio.watchlist,
            currentDay
          }));
        }
      }, 2000);
      
      setAutoSaveTimer(timer);
      
      return () => {
        if (timer) clearTimeout(timer);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portfolio, currentDay, hasUnsavedChanges]);

  // Calculate portfolio statistics
  const portfolioStats = useMemo(() => {
    const investmentsValue = portfolio.investments.reduce((total, investment) => {
      const stock = stocks.find(s => s.id === investment.stockId);
      return total + (stock ? stock.price * investment.shares : 0);
    }, 0);

    const totalValue = portfolio.cash + investmentsValue;
    const initialValue = config.initialCash;
    const totalReturn = totalValue - initialValue;
    const totalReturnPercent = initialValue > 0 ? (totalReturn / initialValue) * 100 : 0;

    const investments = portfolio.investments.map(inv => {
      const stock = stocks.find(s => s.id === inv.stockId);
      if (!stock) return null;
      const currentValue = stock.price * inv.shares;
      const costBasis = inv.averagePrice * inv.shares;
      const gain = currentValue - costBasis;
      const gainPercent = costBasis > 0 ? (gain / costBasis) * 100 : 0;
      return {
        ...inv,
        currentValue,
        costBasis,
        gain,
        gainPercent,
        stock
      };
    }).filter(Boolean);

    const totalGain = investments.reduce((sum, inv) => sum + inv.gain, 0);
    const totalCostBasis = investments.reduce((sum, inv) => sum + inv.costBasis, 0);
    const portfolioGainPercent = totalCostBasis > 0 ? (totalGain / totalCostBasis) * 100 : 0;

    // Calculate sector allocation
    const sectorAllocation = {};
    investments.forEach(inv => {
      const sector = inv.stock.sector;
      sectorAllocation[sector] = (sectorAllocation[sector] || 0) + inv.currentValue;
    });

    // Calculate daily returns for Sharpe ratio
    const dailyReturns = portfolio.history.slice(-30).map((h, i, arr) => {
      if (i === 0) return 0;
      const prevValue = arr[i - 1].total;
      return prevValue > 0 ? ((h.total - prevValue) / prevValue) * 100 : 0;
    }).filter(r => r !== 0);

    const avgReturn = dailyReturns.length > 0 
      ? dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length 
      : 0;
    const variance = dailyReturns.length > 0
      ? dailyReturns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / dailyReturns.length
      : 0;
    const stdDev = Math.sqrt(variance);
    const sharpeRatio = stdDev > 0 ? (avgReturn / stdDev) : 0;

    return {
      totalValue,
      investmentsValue,
      cash: portfolio.cash,
      totalReturn,
      totalReturnPercent,
      investments,
      totalGain,
      totalCostBasis,
      portfolioGainPercent,
      sectorAllocation,
      sharpeRatio,
      avgReturn,
      stdDev,
    };
  }, [portfolio, stocks, config.initialCash]);

  // Simulate market day
  const simulateMarketDay = useCallback(() => {
    if (currentDay >= config.maxDays) {
      toast.error(tt('toasts.simulationLimit', `Simulation complete! You've reached the {{days}}-day limit.`, { days: config.maxDays }));
      return;
    }

    const updatedStocks = stocks.map(stock => {
      // More realistic price movement with trend
      const trend = Math.sin(currentDay / 10) * 0.02; // Long-term trend
      const randomChange = (Math.random() - 0.5) * 2 * stock.volatility;
      const change = stock.price * (trend + randomChange);
      const newPrice = Math.max(0.01, parseFloat((stock.price + change).toFixed(2)));
      
      const priceChange = newPrice - stock.price;
      const percentChange = stock.price > 0 ? (priceChange / stock.price) * 100 : 0;

      // Update history
      const newHistory = [...stock.history, {
        day: currentDay,
        price: newPrice,
        volume: Math.floor(stock.volume * (0.8 + Math.random() * 0.4))
      }];
      
      return {
        ...stock,
        previousPrice: stock.price,
        price: newPrice,
        change: parseFloat(priceChange.toFixed(2)),
        changePercent: parseFloat(percentChange.toFixed(2)),
        volume: Math.floor(stock.volume * (0.8 + Math.random() * 0.4)),
        history: newHistory.slice(-100), // Keep last 100 days
      };
    });

    // Update portfolio history
    const portfolioValue = portfolio.investments.reduce((total, investment) => {
      const stock = updatedStocks.find(s => s.id === investment.stockId);
      return total + (stock ? stock.price * investment.shares : 0);
    }, 0);

    const newHistory = [...portfolio.history, {
        day: currentDay,
        cash: portfolio.cash,
        investments: portfolioValue,
        total: portfolio.cash + portfolioValue
    }];

    setStocks(updatedStocks);
    setPortfolio(prev => ({
      ...prev,
      history: newHistory.slice(-365) // Keep last year
    }));
    setCurrentDay(prev => prev + 1);
    setHasUnsavedChanges(true);

    logActivity({
      activityType: 'financial_action',
      description: 'Simulated market day',
      metadata: {
        action: 'simulate_market_day',
        day: currentDay,
        portfolioValue: portfolio.cash + portfolioValue,
        ageGroup,
        timestamp: new Date().toISOString(),
      },
      pageUrl: window.location.pathname,
    });

    toast.success(`Day ${currentDay + 1} simulated! 📈`);
  }, [stocks, portfolio, currentDay, config.maxDays, ageGroup]);

  // Buy stock
  const buyStock = useCallback(() => {
    if (!selectedStock) {
      toast.error(tt('toasts.selectStock', 'Please select a stock'));
      return;
    }
    
    const stock = stocks.find(s => s.id === selectedStock);
    if (!stock) return;

    const price = orderType === 'limit' && limitPrice 
      ? parseFloat(limitPrice) 
      : stock.price;
    
    const totalCost = price * quantity;
    
    if (totalCost > portfolio.cash) {
      toast.error(tt('toasts.insufficientFunds', 'Insufficient funds! 💰'));
      return;
    }
    
    if (quantity <= 0) {
      toast.error(tt('toasts.invalidQuantity', 'Quantity must be greater than 0'));
      return;
    }

    const existingInvestment = portfolio.investments.find(inv => inv.stockId === selectedStock);
    
    let updatedInvestments;
    if (existingInvestment) {
      updatedInvestments = portfolio.investments.map(inv => 
        inv.stockId === selectedStock 
          ? { 
              ...inv, 
              shares: inv.shares + quantity, 
              averagePrice: ((inv.averagePrice * inv.shares) + totalCost) / (inv.shares + quantity)
            }
          : inv
      );
    } else {
      updatedInvestments = [
        ...portfolio.investments,
        {
          stockId: selectedStock,
          symbol: stock.symbol,
          name: stock.name,
          sector: stock.sector,
          shares: quantity,
          purchasePrice: price,
          averagePrice: price,
          purchaseDate: currentDay
        }
      ];
    }

    const transaction = {
      id: `txn_${Date.now()}`,
      type: 'buy',
      stockId: selectedStock,
      symbol: stock.symbol,
      shares: quantity,
      price: price,
      total: totalCost,
      day: currentDay,
      timestamp: new Date().toISOString()
    };

    setPortfolio(prev => ({
      ...prev,
      cash: prev.cash - totalCost,
      investments: updatedInvestments,
      transactions: [transaction, ...prev.transactions].slice(0, 100)
    }));
    setHasUnsavedChanges(true);
    setQuantity(1);
    setLimitPrice('');
  
    toast.success(`Bought ${quantity} share(s) of ${stock.symbol}! 🎉`);
    
    logActivity({
      activityType: 'financial_action',
      description: 'Bought stock',
      metadata: {
        action: 'buy_stock',
        symbol: stock.symbol,
        shares: quantity,
        price: price,
        totalCost,
        ageGroup,
        timestamp: new Date().toISOString(),
      },
      pageUrl: window.location.pathname,
    });
  }, [selectedStock, stocks, quantity, orderType, limitPrice, portfolio, currentDay, ageGroup]);

  // Sell stock
  const sellStock = useCallback((investmentIndex, sharesToSell = null) => {
    const investment = portfolio.investments[investmentIndex];
    if (!investment) return;

    const stock = stocks.find(s => s.id === investment.stockId);
    if (!stock) return;

    const shares = sharesToSell || investment.shares;
    if (shares > investment.shares) {
      toast.error(tt('toasts.sellLimit', 'Cannot sell more shares than you own'));
      return;
    }

    const price = orderType === 'limit' && limitPrice 
      ? parseFloat(limitPrice) 
      : stock.price;
    
    const saleValue = price * shares;
    const costBasis = investment.averagePrice * shares;
    const profit = saleValue - costBasis;

    let updatedInvestments;
    if (shares === investment.shares) {
      updatedInvestments = portfolio.investments.filter((_, index) => index !== investmentIndex);
    } else {
      updatedInvestments = portfolio.investments.map((inv, index) =>
        index === investmentIndex
          ? { ...inv, shares: inv.shares - shares }
          : inv
      );
    }

    const transaction = {
      id: `txn_${Date.now()}`,
      type: 'sell',
      stockId: investment.stockId,
      symbol: investment.symbol,
      shares: shares,
      price: price,
      total: saleValue,
      profit: profit,
      day: currentDay,
      timestamp: new Date().toISOString()
    };

    setPortfolio(prev => ({
      ...prev,
      cash: prev.cash + saleValue,
      investments: updatedInvestments,
      transactions: [transaction, ...prev.transactions].slice(0, 100)
    }));
    setHasUnsavedChanges(true);
    setLimitPrice('');

    toast.success(`Sold ${shares} share(s) of ${investment.symbol}! 💰`);

      logActivity({
      activityType: 'financial_action',
      description: 'Sold stock',
        metadata: {
        action: 'sell_stock',
        symbol: investment.symbol,
        shares: shares,
        price: price,
        profit,
        ageGroup,
        timestamp: new Date().toISOString(),
      },
      pageUrl: window.location.pathname,
    });
  }, [portfolio, stocks, orderType, limitPrice, currentDay, ageGroup]);

  // Add to watchlist
  const toggleWatchlist = useCallback((stockId) => {
    setPortfolio(prev => {
      const isInWatchlist = prev.watchlist.includes(stockId);
      return {
        ...prev,
        watchlist: isInWatchlist
          ? prev.watchlist.filter(id => id !== stockId)
          : [...prev.watchlist, stockId]
      };
    });
    setHasUnsavedChanges(true);
  }, []);

  // Filter and sort stocks
  const filteredAndSortedStocks = useMemo(() => {
    let filtered = stocks;
    
    if (filterSector !== 'all') {
      filtered = filtered.filter(s => s.sector === filterSector);
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.price - a.price;
        case 'change':
          return b.changePercent - a.changePercent;
        case 'volume':
          return b.volume - a.volume;
        case 'symbol':
        default:
          return a.symbol.localeCompare(b.symbol);
      }
    });

    return sorted;
  }, [stocks, filterSector, sortBy]);

  // Export portfolio
  const exportPortfolio = useCallback(() => {
    const data = {
      portfolio: {
        cash: portfolio.cash,
        totalValue: portfolioStats.totalValue,
        totalReturn: portfolioStats.totalReturn,
        totalReturnPercent: portfolioStats.totalReturnPercent,
      },
      investments: portfolioStats.investments.map(inv => ({
        symbol: inv.symbol,
        shares: inv.shares,
        averagePrice: inv.averagePrice,
        currentPrice: inv.stock.price,
        currentValue: inv.currentValue,
        gain: inv.gain,
        gainPercent: inv.gainPercent,
      })),
      transactions: portfolio.transactions.slice(0, 50),
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `portfolio_export_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success('Portfolio exported successfully! 📊');
  }, [portfolio, portfolioStats]);

  if (loading) {
  return (
      <div className={`min-h-screen bg-gradient-to-br ${
        ageGroup === 'kids' ? 'from-pink-50 via-yellow-50 to-purple-50' :
        ageGroup === 'teens' ? 'from-blue-50 via-cyan-50 to-indigo-50' :
        'from-gray-50 via-white to-slate-50'
      } flex items-center justify-center`}>
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className={`w-16 h-16 border-4 ${
              ageGroup === 'kids' ? 'border-pink-500' :
              ageGroup === 'teens' ? 'border-blue-500' :
              'border-purple-500'
            } border-t-transparent rounded-full mx-auto mb-4`}
          />
          <p className="text-gray-600">{tt('loading', 'Loading investment simulator...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${
      ageGroup === 'kids' ? 'from-pink-50 via-yellow-50 to-purple-50' :
      ageGroup === 'teens' ? 'from-blue-50 via-cyan-50 to-indigo-50' :
      'from-gray-50 via-white to-slate-50'
    } p-4 sm:p-6 lg:p-8`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <button 
              onClick={() => navigate('/student/dashboard/financial-literacy')}
              className="flex items-center text-purple-600 hover:text-purple-800 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              {tt('backButton', 'Back to Financial Literacy')}
            </button>
            <LanguageSelector />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black mb-2 ${
            ageGroup === 'kids' ? 'bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent leading-tight' :
                ageGroup === 'teens' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent leading-tight' :
                'text-gray-900'
              }`}>
                {ageGroup === 'kids' && '💰 '}
                {tt('title', 'Investment Simulator')}
                {ageGroup === 'kids' && ' 💰'}
              </h1>
              <p className={`text-lg ${
                ageGroup === 'kids' ? 'text-purple-600' :
                ageGroup === 'teens' ? 'text-blue-600' :
                'text-gray-600'
              }`}>
                {ageGroup === 'kids' && tt('subtitle.kids', 'Learn to invest with virtual money! 🎯')}
                {ageGroup === 'teens' && tt('subtitle.teens', 'Practice investing with virtual money and real-time market simulation')}
                {ageGroup === 'adults' && tt('subtitle.adults', 'Advanced investment simulator with real-time analytics and portfolio management')}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {hasUnsavedChanges && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-md"
                >
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                  Auto-saving...
                </motion.div>
              )}
              
              <div className="bg-white rounded-xl shadow-lg p-4 flex items-center gap-3">
                <Clock className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-500">Day</p>
                  <p className="text-xl font-black text-gray-800">{currentDay} / {config.maxDays}</p>
                </div>
              </div>
              
              <button
                onClick={simulateMarketDay}
                disabled={currentDay >= config.maxDays}
                className={`px-6 py-3 rounded-xl font-black flex items-center gap-2 transition-all shadow-lg ${
                  currentDay >= config.maxDays
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : ageGroup === 'kids'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600'
                    : ageGroup === 'teens'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                    : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600'
                }`}
              >
                <RefreshCw className="w-5 h-5" />
                Next Day
              </button>
            </div>
          </div>
        </div>

        {/* Portfolio Summary Cards */}
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500"
          >
            <div className="p-3 rounded-xl bg-purple-100 mb-2">
              <Wallet className="w-6 h-6 text-purple-600" />
                </div>
            <p className="text-sm text-gray-500 mb-1">Total Portfolio Value</p>
            <p className="text-3xl font-black text-gray-800">
              ${portfolioStats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className={`text-xs mt-1 font-bold ${
              portfolioStats.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {portfolioStats.totalReturn >= 0 ? '+' : ''}
              {portfolioStats.totalReturnPercent.toFixed(2)}% ({portfolioStats.totalReturn >= 0 ? '+' : ''}${Math.abs(portfolioStats.totalReturn).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500"
          >
            <div className="p-3 rounded-xl bg-green-100 mb-2">
              <DollarSign className="w-6 h-6 text-green-600" />
                </div>
            <p className="text-sm text-gray-500 mb-1">Cash Available</p>
            <p className="text-3xl font-black text-gray-800">
              ${portfolioStats.cash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {((portfolioStats.cash / portfolioStats.totalValue) * 100).toFixed(1)}% of portfolio
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500"
          >
            <div className="p-3 rounded-xl bg-blue-100 mb-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
            <p className="text-sm text-gray-500 mb-1">Investments Value</p>
            <p className="text-3xl font-black text-gray-800">
              ${portfolioStats.investmentsValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className={`text-xs mt-1 font-bold ${
              portfolioStats.portfolioGainPercent >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {portfolioStats.portfolioGainPercent >= 0 ? '+' : ''}
              {portfolioStats.portfolioGainPercent.toFixed(2)}% gain
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500"
          >
            <div className="p-3 rounded-xl bg-orange-100 mb-2">
              <Activity className="w-6 h-6 text-orange-600" />
                        </div>
            <p className="text-sm text-gray-500 mb-1">Sharpe Ratio</p>
            <p className="text-3xl font-black text-gray-800">
              {portfolioStats.sharpeRatio.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {portfolioStats.sharpeRatio > 1 ? 'Excellent ⭐' : portfolioStats.sharpeRatio > 0.5 ? 'Good 👍' : 'Needs improvement'}
            </p>
          </motion.div>
          </motion.div>
          
        {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg mb-6"
        >
          <div className="flex border-b border-gray-200 overflow-x-auto">
                <button 
              onClick={() => setActiveTab('market')}
              className={`px-6 py-4 font-black text-sm transition-all ${
                activeTab === 'market'
                  ? ageGroup === 'kids'
                    ? 'text-pink-600 border-b-4 border-pink-600'
                    : ageGroup === 'teens'
                    ? 'text-blue-600 border-b-4 border-blue-600'
                    : 'text-purple-600 border-b-4 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
                >
              <TrendingUp className="w-5 h-5 inline mr-2" />
              Market
                </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-6 py-4 font-black text-sm transition-all ${
                activeTab === 'portfolio'
                  ? ageGroup === 'kids'
                    ? 'text-pink-600 border-b-4 border-pink-600'
                    : ageGroup === 'teens'
                    ? 'text-blue-600 border-b-4 border-blue-600'
                    : 'text-purple-600 border-b-4 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <PieChart className="w-5 h-5 inline mr-2" />
              Portfolio
            </button>
            {config.showAdvanced && (
              <>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-6 py-4 font-black text-sm transition-all ${
                    activeTab === 'analytics'
                      ? ageGroup === 'kids'
                        ? 'text-pink-600 border-b-4 border-pink-600'
                        : ageGroup === 'teens'
                        ? 'text-blue-600 border-b-4 border-blue-600'
                        : 'text-purple-600 border-b-4 border-purple-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <BarChart2 className="w-5 h-5 inline mr-2" />
                  Analytics
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-6 py-4 font-black text-sm transition-all ${
                    activeTab === 'history'
                      ? ageGroup === 'kids'
                        ? 'text-pink-600 border-b-4 border-pink-600'
                        : ageGroup === 'teens'
                        ? 'text-blue-600 border-b-4 border-blue-600'
                        : 'text-purple-600 border-b-4 border-purple-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <History className="w-5 h-5 inline mr-2" />
                  History
                </button>
              </>
            )}
              </div>
              
          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'market' && (
                <motion.div 
                key="market"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
              {/* Buy Stock Form */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 mb-6 border-2 border-purple-200">
                  <h3 className="text-xl font-black text-gray-800 mb-4 flex items-center gap-2">
                    <Plus className="w-6 h-6 text-purple-600" />
                    Buy Stocks
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Select Stock <span className="text-red-500">*</span>
                      </label>
                  <select
                        className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={selectedStock || ''}
                    onChange={(e) => setSelectedStock(parseInt(e.target.value))}
                  >
                        <option value="">Choose a stock</option>
                    {stocks.map(stock => (
                      <option key={stock.id} value={stock.id}>
                        {stock.symbol} - {stock.name} (${stock.price.toFixed(2)})
                      </option>
                    ))}
                  </select>
                    </div>
                  
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Quantity <span className="text-red-500">*</span>
                      </label>
                  <input
                    type="number"
                    min="1"
                        className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                    </div>

                    {config.showAdvanced && (
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Order Type
                        </label>
                        <select
                          className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={orderType}
                          onChange={(e) => setOrderType(e.target.value)}
                        >
                          <option value="market">Market</option>
                          <option value="limit">Limit</option>
                        </select>
                      </div>
                    )}

                    {config.showAdvanced && orderType === 'limit' && (
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Limit Price
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={limitPrice}
                          onChange={(e) => setLimitPrice(e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                    )}
                  </div>

                  {selectedStock && (
                    <div className="bg-white rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">Current Price</p>
                          <p className="text-2xl font-black text-gray-800">
                            ${stocks.find(s => s.id === selectedStock)?.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Total Cost</p>
                          <p className="text-2xl font-black text-purple-600">
                            ${((stocks.find(s => s.id === selectedStock)?.price || 0) * quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={buyStock}
                    disabled={!selectedStock}
                    className={`w-full py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
                      !selectedStock
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : ageGroup === 'kids'
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600'
                        : ageGroup === 'teens'
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                        : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600'
                    }`}
                  >
                    <Check className="w-6 h-6" />
                    Buy Stock
                  </button>
                </div>
                
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                      className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                      value={filterSector}
                      onChange={(e) => setFilterSector(e.target.value)}
                    >
                      <option value="all">All Sectors</option>
                      {config.sectors.map(sector => (
                        <option key={sector} value={sector}>{sector}</option>
                      ))}
                    </select>
                  </div>

                  <select
                    className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="symbol">Sort by Symbol</option>
                    <option value="price">Sort by Price</option>
                    <option value="change">Sort by Change</option>
                    <option value="volume">Sort by Volume</option>
                  </select>
              </div>
              
              {/* Stock Market Table */}
              <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-xl overflow-hidden">
                    <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                      <tr>
                        <th className="py-4 px-6 text-left font-black">Symbol</th>
                        <th className="py-4 px-6 text-left font-black">Company</th>
                        <th className="py-4 px-6 text-left font-black">Sector</th>
                        <th className="py-4 px-6 text-right font-black">Price</th>
                        <th className="py-4 px-6 text-right font-black">Change</th>
                        <th className="py-4 px-6 text-right font-black">Volume</th>
                        {config.showAdvanced && (
                          <>
                            <th className="py-4 px-6 text-right font-black">P/E</th>
                            <th className="py-4 px-6 text-right font-black">Beta</th>
                          </>
                        )}
                        <th className="py-4 px-6 text-center font-black">Actions</th>
                    </tr>
                  </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredAndSortedStocks.map(stock => {
                        const isWatched = portfolio.watchlist.includes(stock.id);
                      return (
                          <tr
                            key={stock.id}
                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={() => setSelectedStock(stock.id)}
                          >
                            <td className="py-4 px-6">
                              <span className="font-black text-gray-800">{stock.symbol}</span>
                            </td>
                            <td className="py-4 px-6 text-gray-700">{stock.name}</td>
                            <td className="py-4 px-6">
                              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                                {stock.sector}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right font-black text-gray-800">
                              ${stock.price.toFixed(2)}
                            </td>
                            <td className={`py-4 px-6 text-right font-black ${
                              stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              <div className="flex items-center justify-end gap-1">
                                {stock.changePercent >= 0 ? (
                                  <ArrowUp className="w-4 h-4" />
                                ) : (
                                  <ArrowDown className="w-4 h-4" />
                                )}
                                {stock.changePercent >= 0 ? '+' : ''}
                                {stock.changePercent.toFixed(2)}%
                              </div>
                            </td>
                            <td className="py-4 px-6 text-right text-gray-600">
                              {stock.volume.toLocaleString()}
                            </td>
                            {config.showAdvanced && (
                              <>
                                <td className="py-4 px-6 text-right text-gray-600">
                                  {stock.peRatio}
                                </td>
                                <td className="py-4 px-6 text-right text-gray-600">
                                  {stock.beta}
                                </td>
                              </>
                            )}
                            <td className="py-4 px-6 text-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleWatchlist(stock.id);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
                              >
                                {isWatched ? (
                                  <Eye className="w-5 h-5 text-purple-600" />
                                ) : (
                                  <EyeOff className="w-5 h-5 text-gray-400" />
                                )}
                              </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              </motion.div>
            )}

            {activeTab === 'portfolio' && (
              <motion.div
                key="portfolio"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <h3 className="text-xl font-black text-gray-800 mb-4">Your Holdings</h3>
                    {portfolioStats.investments.length > 0 ? (
                      <div className="space-y-4">
                        {portfolioStats.investments.map((investment, index) => (
                          <motion.div
                            key={investment.stockId}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-all"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h4 className="text-2xl font-black text-gray-800">{investment.symbol}</h4>
                                <p className="text-gray-600">{investment.name}</p>
                                <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                                  {investment.sector}
                                </span>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-black text-gray-800">
                                  ${investment.currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                                <p className={`text-sm font-bold ${
                                  investment.gainPercent >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {investment.gainPercent >= 0 ? '+' : ''}
                                  {investment.gainPercent.toFixed(2)}%
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Shares</p>
                                <p className="font-black text-gray-800">{investment.shares}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Avg. Price</p>
                                <p className="font-black text-gray-800">${investment.averagePrice.toFixed(2)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Current Price</p>
                                <p className="font-black text-gray-800">${investment.stock.price.toFixed(2)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Gain/Loss</p>
                                <p className={`font-black ${
                                  investment.gain >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {investment.gain >= 0 ? '+' : ''}
                                  ${investment.gain.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedStock(investment.stockId);
                                  setActiveTab('market');
                                }}
                                className="flex-1 px-4 py-2 bg-purple-100 text-purple-700 rounded-xl font-bold hover:bg-purple-200 transition-all"
                              >
                                Buy More
                              </button>
                              <button
                                onClick={() => sellStock(index)}
                                className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-xl font-bold hover:bg-red-200 transition-all"
                              >
                                Sell All
                              </button>
            </div>
          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-white border-2 border-dashed border-gray-300 rounded-xl">
                        <Wallet className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-2xl font-black text-gray-800 mb-2">No Investments Yet</h3>
                        <p className="text-gray-600 mb-6">
                          {ageGroup === 'kids' 
                            ? "Start investing to build your portfolio! 🚀"
                            : "Start building your portfolio by buying stocks!"}
                        </p>
                        <button
                          onClick={() => setActiveTab('market')}
                          className={`px-8 py-4 rounded-xl font-black text-lg inline-flex items-center gap-2 ${
                            ageGroup === 'kids'
                              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                              : ageGroup === 'teens'
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                              : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                          }`}
                        >
                          <Plus className="w-6 h-6" />
                          Browse Market
                        </button>
                      </div>
                    )}
        </div>

                  <div className="space-y-6">
                    {/* Sector Allocation */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-lg font-black text-gray-800 mb-4 flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-purple-600" />
                        Sector Allocation
                      </h3>
                      {Object.keys(portfolioStats.sectorAllocation).length > 0 ? (
                        <div className="space-y-3">
                          {Object.entries(portfolioStats.sectorAllocation)
                            .sort((a, b) => b[1] - a[1])
                            .map(([sector, value]) => {
                              const percentage = (value / portfolioStats.investmentsValue) * 100;
                              return (
                                <div key={sector}>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm font-bold text-gray-700">{sector}</span>
                                    <span className="text-sm font-black text-gray-800">
                                      {percentage.toFixed(1)}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full"
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No investments yet</p>
                      )}
                    </div>

                    {/* Performance Summary */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-lg font-black text-gray-800 mb-4">Performance</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total Gain/Loss</span>
                          <span className={`font-black ${
                            portfolioStats.totalGain >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {portfolioStats.totalGain >= 0 ? '+' : ''}
                            ${portfolioStats.totalGain.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Return %</span>
                          <span className={`font-black ${
                            portfolioStats.portfolioGainPercent >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {portfolioStats.portfolioGainPercent >= 0 ? '+' : ''}
                            {portfolioStats.portfolioGainPercent.toFixed(2)}%
                          </span>
                        </div>
                        {config.showAdvanced && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Sharpe Ratio</span>
                              <span className="font-black text-gray-800">
                                {portfolioStats.sharpeRatio.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Avg. Daily Return</span>
                              <span className={`font-black ${
                                portfolioStats.avgReturn >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {portfolioStats.avgReturn >= 0 ? '+' : ''}
                                {portfolioStats.avgReturn.toFixed(2)}%
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'analytics' && config.showAdvanced && (
        <motion.div
                key="analytics"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Portfolio Value Chart */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-black text-gray-800 mb-4">Portfolio Value Over Time</h3>
                    <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="text-center">
                        <LineChart className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p className="text-gray-500">Chart visualization coming soon</p>
                        <p className="text-sm text-gray-400 mt-2">
                          {portfolio.history.length} data points available
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Risk Metrics */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-black text-gray-800 mb-4">Risk Metrics</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-bold text-gray-700">Volatility (Std Dev)</span>
                          <span className="text-sm font-black text-gray-800">
                            {portfolioStats.stdDev.toFixed(2)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              portfolioStats.stdDev < 2 ? 'bg-green-500' :
                              portfolioStats.stdDev < 5 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(100, (portfolioStats.stdDev / 10) * 100)}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-bold text-gray-700">Sharpe Ratio</span>
                          <span className="text-sm font-black text-gray-800">
                            {portfolioStats.sharpeRatio.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {portfolioStats.sharpeRatio > 1 
                            ? 'Excellent risk-adjusted returns'
                            : portfolioStats.sharpeRatio > 0.5
                            ? 'Good risk-adjusted returns'
                            : 'Consider improving risk-adjusted returns'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'history' && config.showAdvanced && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-gray-800">Transaction History</h3>
          <button
                    onClick={exportPortfolio}
                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl font-bold hover:bg-purple-200 transition-all flex items-center gap-2"
          >
                    <Download className="w-4 h-4" />
                    Export
          </button>
      </div>
                {portfolio.transactions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-xl overflow-hidden">
                      <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                        <tr>
                          <th className="py-4 px-6 text-left font-black">Date</th>
                          <th className="py-4 px-6 text-left font-black">Type</th>
                          <th className="py-4 px-6 text-left font-black">Symbol</th>
                          <th className="py-4 px-6 text-right font-black">Shares</th>
                          <th className="py-4 px-6 text-right font-black">Price</th>
                          <th className="py-4 px-6 text-right font-black">Total</th>
                          <th className="py-4 px-6 text-right font-black">Profit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {portfolio.transactions.slice(0, 50).map((txn, index) => (
                          <tr key={txn.id || index} className="hover:bg-gray-50">
                            <td className="py-4 px-6 text-sm text-gray-600">
                              Day {txn.day}
                            </td>
                            <td className="py-4 px-6">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                txn.type === 'buy'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {txn.type.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-4 px-6 font-bold text-gray-800">{txn.symbol}</td>
                            <td className="py-4 px-6 text-right text-gray-700">{txn.shares}</td>
                            <td className="py-4 px-6 text-right text-gray-700">
                              ${txn.price.toFixed(2)}
                            </td>
                            <td className="py-4 px-6 text-right font-black text-gray-800">
                              ${txn.total.toFixed(2)}
                            </td>
                            <td className={`py-4 px-6 text-right font-black ${
                              txn.profit && txn.profit > 0 ? 'text-green-600' : 
                              txn.profit && txn.profit < 0 ? 'text-red-600' : 
                              'text-gray-600'
                            }`}>
                              {txn.profit !== undefined ? (
                                <>
                                  {txn.profit >= 0 ? '+' : ''}
                                  ${txn.profit.toFixed(2)}
                                </>
                              ) : (
                                '-'
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white border-2 border-dashed border-gray-300 rounded-xl">
                    <History className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-2xl font-black text-gray-800 mb-2">No Transactions Yet</h3>
                    <p className="text-gray-600">
                      Your transaction history will appear here once you start trading.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default InvestmentSimulator;
