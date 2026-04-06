import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Sparkles, TrendingUp, Calendar, History } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import BlobMascot from '../components/BlobMascot';
import HookCard from '../components/HookCard';
import RateLimitModal from '../components/RateLimitModal';
import OfflineBanner from '../components/OfflineBanner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CATEGORY_COLORS = {
  General: '#FFD60A',
  Study: '#34C759',
  Gym: '#FF7A00',
  Tech: '#007AFF',
  Money: '#AF52DE',
  Relationships: '#FF2D55',
};

const Home = () => {
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('General');
  const [tone, setTone] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [showRateLimitModal, setShowRateLimitModal] = useState(false);
  const [trendingHooks, setTrendingHooks] = useState([]);
  const [hookOfTheDay, setHookOfTheDay] = useState(null);
  const [generationCount, setGenerationCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [cachedHooks, setCachedHooks] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const backgroundColor = CATEGORY_COLORS[category];

  useEffect(() => {
    // Online/Offline detection
    const handleOnline = () => {
      setIsOffline(false);
      toast.success('Back online! 🎉', { duration: 2000 });
      loadTrendingHooks(category);
      loadHookOfTheDay();
    };
    
    const handleOffline = () => {
      setIsOffline(true);
      toast.error('You\'re offline', { duration: 2000 });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load generation count from localStorage
    const today = new Date().toDateString();
    const stored = localStorage.getItem('hookforge_usage');
    if (stored) {
      const { date, count } = JSON.parse(stored);
      if (date === today) {
        setGenerationCount(count);
      } else {
        // Reset for new day
        localStorage.setItem('hookforge_usage', JSON.stringify({ date: today, count: 0 }));
        setGenerationCount(0);
      }
    } else {
      localStorage.setItem('hookforge_usage', JSON.stringify({ date: today, count: 0 }));
    }

    // Load cached hooks for offline mode
    const history = JSON.parse(localStorage.getItem('hookforge_history') || '[]');
    if (history.length > 0) {
      setCachedHooks(history.slice(0, 10));
    }

    // Load trending hooks and hook of the day
    if (!isOffline) {
      loadTrendingHooks(category);
      loadHookOfTheDay();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load trending hooks when category changes
  useEffect(() => {
    if (!isOffline) {
      loadTrendingHooks(category);
    }
  }, [category]);

  const loadTrendingHooks = async (selectedCategory) => {
    try {
      const response = await axios.get(`${API}/trending-hooks/${selectedCategory}`, { timeout: 5000 });
      setTrendingHooks(response.data);
    } catch (err) {
      console.error('Failed to load trending hooks', err);
      // Fail silently, not critical
    }
  };

  const loadHookOfTheDay = async () => {
    try {
      const response = await axios.get(`${API}/hook-of-the-day`, { timeout: 5000 });
      setHookOfTheDay(response.data);
    } catch (err) {
      console.error('Failed to load hook of the day', err);
      // Fail silently, not critical
    }
  };

  const handleGenerate = async () => {
    // Debounce - prevent rapid clicks
    const now = Date.now();
    if (now - lastClickTime < 1000) {
      return;
    }
    setLastClickTime(now);

    // Check if offline
    if (isOffline) {
      toast.error('You\'re offline. Please check your internet connection.', { duration: 3000 });
      return;
    }

    // Validate input
    if (!topic.trim()) {
      setError('Please enter a topic');
      toast.error('Please enter a topic', { duration: 2000 });
      return;
    }

    // Check rate limit
    if (generationCount >= 5) {
      setShowRateLimitModal(true);
      return;
    }

    setError('');
    setLoading(true);
    setResults(null);

    try {
      const response = await axios.post(
        `${API}/generate-hooks`,
        {
          topic: topic.trim(),
          category,
          tone: tone || null,
        },
        { timeout: 30000 } // 30 second timeout
      );

      setResults(response.data);

      // Update generation count
      const newCount = generationCount + 1;
      setGenerationCount(newCount);
      const today = new Date().toDateString();
      localStorage.setItem('hookforge_usage', JSON.stringify({ date: today, count: newCount }));

      // Save to history
      const history = JSON.parse(localStorage.getItem('hookforge_history') || '[]');
      history.unshift({
        topic,
        category,
        timestamp: new Date().toISOString(),
        hooks: response.data.hooks,
        captions: response.data.captions,
        video_ideas: response.data.video_ideas,
      });
      const updatedHistory = history.slice(0, 20);
      localStorage.setItem('hookforge_history', JSON.stringify(updatedHistory));
      setCachedHooks(updatedHistory.slice(0, 10));

      toast.success('Hooks generated! 🎉', { duration: 2000 });
    } catch (err) {
      console.error('Generation error:', err);
      
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.');
        toast.error('Request timed out. Please try again.', { duration: 3000 });
      } else if (!navigator.onLine) {
        setError('You appear to be offline. Please check your connection.');
        toast.error('Connection lost', { duration: 3000 });
        setIsOffline(true);
      } else {
        const errorMsg = err.response?.data?.detail || 'Failed to generate hooks. Please try again.';
        setError(errorMsg);
        toast.error(errorMsg, { duration: 3000 });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="app-container min-h-screen flex flex-col"
      style={{ backgroundColor }}
      data-testid="home-page"
    >
      <Toaster richColors position="top-center" />
      <OfflineBanner isOffline={isOffline} />
      <RateLimitModal isOpen={showRateLimitModal} onClose={() => setShowRateLimitModal(false)} />

      {/* Header */}
      <header className="bg-white/20 backdrop-blur-sm border-b-2 border-white/30" data-testid="app-header">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-slate-900" strokeWidth={3} />
              <h1 className="text-2xl font-black text-slate-900" data-testid="app-title">
                Hooksforge
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-2 bg-white/40 backdrop-blur-sm rounded-xl border-2 border-white/50 hover:bg-white/50 transition-colors"
                data-testid="history-button"
                title="View History"
              >
                <History className="w-5 h-5 text-slate-900" strokeWidth={3} />
              </button>
              <div className="text-sm font-bold text-slate-900 bg-white/40 backdrop-blur-sm px-3 py-1.5 rounded-xl border-2 border-white/50" data-testid="usage-counter">
                {generationCount}/5 today
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 flex-1">
        <div className="mb-6"></div>

        {/* Mascot */}
        <div className="mb-6">
          <BlobMascot category={category} />
        </div>

        {/* History View */}
        {showHistory && cachedHooks.length > 0 ? (
          <div className="space-y-4" data-testid="history-view">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900">Your History</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="text-sm font-bold text-slate-900 underline"
              >
                Back
              </button>
            </div>
            {cachedHooks.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border-2 border-slate-100 p-4 space-y-2"
                onClick={() => {
                  setResults(item);
                  setShowHistory(false);
                }}
              >
                <p className="font-bold text-slate-900">{item.topic}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Hook of the Day */}
            {hookOfTheDay && !results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/30 backdrop-blur-sm rounded-3xl border-2 border-white/40 p-4 mb-6"
                data-testid="hook-of-the-day"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-slate-900" strokeWidth={3} />
                  <span className="font-black text-slate-900">Hook of the Day</span>
                </div>
                <p className="text-slate-900 font-bold text-sm">{hookOfTheDay.hook}</p>
              </motion.div>
            )}

            {/* Input Form */}
            <div className="space-y-4 mb-6">
              <div>
                <input
                  type="text"
                  placeholder="idea likho ... scroll stopping hook pao"
                  value={topic}
                  onChange={(e) => {
                    setTopic(e.target.value);
                    // Clear results when input is erased
                    if (e.target.value.trim() === '') {
                      setResults(null);
                      setError('');
                    }
                  }}
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl p-4 text-lg font-bold focus:border-slate-400 focus:ring-0 outline-none placeholder:text-slate-400 transition-colors shadow-sm text-slate-800"
                  data-testid="topic-input"
                  onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                  disabled={isOffline}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border-2 border-slate-200 rounded-2xl p-4 text-base font-bold focus:border-slate-400 focus:ring-0 outline-none transition-colors shadow-sm text-slate-800"
                    data-testid="category-select"
                  >
                    <option value="General">General</option>
                    <option value="Gym">Gym</option>
                    <option value="Money">Money</option>
                    <option value="Relationships">Relationships</option>
                    <option value="Tech">Tech</option>
                    <option value="Study">Study</option>
                  </select>
                </div>

                <div>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-white border-2 border-slate-200 rounded-2xl p-4 text-base font-bold focus:border-slate-400 focus:ring-0 outline-none transition-colors shadow-sm text-slate-800"
                    data-testid="tone-select"
                  >
                    <option value="">Any Tone</option>
                    <option value="Emotional">Emotional</option>
                    <option value="Controversial">Controversial</option>
                    <option value="Motivational">Motivational</option>
                    <option value="Storytelling">Storytelling</option>
                  </select>
                </div>
              </div>

              {error && (
                <p className="text-red-700 font-bold text-sm bg-red-100 border-2 border-red-200 rounded-xl p-3" data-testid="error-message">
                  {error}
                </p>
              )}

              <button
                onClick={handleGenerate}
                disabled={loading || isOffline}
                className="w-full font-bold text-lg rounded-2xl px-6 py-4 bg-white text-slate-900 border-2 border-slate-200 shadow-[0_4px_0_0_rgb(226,232,240)] hover:bg-slate-50 transition-all duration-150 active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                data-testid="generate-button"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-slate-400 border-t-slate-900 rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : isOffline ? (
                  'Offline - Connect to generate'
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" strokeWidth={3} />
                    Generate Hooks
                  </>
                )}
              </button>
            </div>

            {/* Results */}
            {results && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
                data-testid="results-section"
              >
                {/* Hooks */}
                <div>
                  <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" strokeWidth={3} />
                    Viral Hooks
                  </h2>
                  <div className="space-y-3">
                    {results.hooks.map((hook, index) => (
                      <HookCard key={index} hook={hook} index={index} />
                    ))}
                  </div>
                </div>

                {/* Captions */}
                <div>
                  <h2 className="text-xl font-black text-slate-900 mb-4">Captions</h2>
                  <div className="space-y-3">
                    {results.captions.map((caption, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-2xl border-2 border-slate-100 p-4 shadow-sm"
                        data-testid={`caption-${index}`}
                      >
                        <p className="text-slate-800 font-semibold text-sm">{caption}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Video Ideas */}
                <div>
                  <h2 className="text-xl font-black text-slate-900 mb-4">Video Ideas</h2>
                  <div className="space-y-3">
                    {results.video_ideas.map((idea, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-2xl border-2 border-slate-100 p-4 shadow-sm"
                        data-testid={`video-idea-${index}`}
                      >
                        <p className="text-slate-800 font-semibold text-sm">{idea}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Trending Hooks */}
            {!results && trendingHooks.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" strokeWidth={3} />
                  Trending Hooks
                </h2>
                <div className="space-y-2">
                  {trendingHooks.map((hook, index) => (
                    <div
                      key={index}
                      className="bg-white/30 backdrop-blur-sm rounded-2xl border-2 border-white/40 p-3"
                      data-testid={`trending-hook-${index}`}
                    >
                      <p className="text-slate-900 font-bold text-sm">{hook.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white/20 backdrop-blur-sm border-t-2 border-white/30 mt-auto" data-testid="app-footer">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <p className="text-slate-900 font-bold text-sm">Created by Hooksforge</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="mailto:hooksforge@gmail.com"
                  className="flex items-center gap-2 text-slate-900 font-semibold text-sm hover:underline transition-all"
                  data-testid="email-link"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  hooksforge@gmail.com
                </a>
                <span className="hidden sm:inline text-slate-900">•</span>
                <a
                  href="https://www.instagram.com/hooksforge/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-900 font-semibold text-sm hover:underline transition-all"
                  data-testid="instagram-link"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  @hooksforge
                </a>
              </div>
            </div>
            <a
              href="/privacy"
              className="inline-block text-slate-900 font-bold text-sm underline"
              data-testid="privacy-link"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;