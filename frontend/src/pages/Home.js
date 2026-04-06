import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Sparkles, TrendingUp, Calendar } from 'lucide-react';
import { Toaster } from 'sonner';
import BlobMascot from '../components/BlobMascot';
import HookCard from '../components/HookCard';
import RateLimitModal from '../components/RateLimitModal';

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

  const backgroundColor = CATEGORY_COLORS[category];

  useEffect(() => {
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

    // Load trending hooks
    loadTrendingHooks();
    // Load hook of the day
    loadHookOfTheDay();
  }, []);

  const loadTrendingHooks = async () => {
    try {
      const response = await axios.get(`${API}/trending-hooks`);
      setTrendingHooks(response.data);
    } catch (err) {
      console.error('Failed to load trending hooks', err);
    }
  };

  const loadHookOfTheDay = async () => {
    try {
      const response = await axios.get(`${API}/hook-of-the-day`);
      setHookOfTheDay(response.data);
    } catch (err) {
      console.error('Failed to load hook of the day', err);
    }
  };

  const handleGenerate = async () => {
    // Debounce - prevent rapid clicks
    const now = Date.now();
    if (now - lastClickTime < 1000) {
      return;
    }
    setLastClickTime(now);

    // Validate input
    if (!topic.trim()) {
      setError('Please enter a topic');
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
      const response = await axios.post(`${API}/generate-hooks`, {
        topic: topic.trim(),
        category,
        tone: tone || null,
      });

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
      });
      localStorage.setItem('hookforge_history', JSON.stringify(history.slice(0, 20)));
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate hooks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="app-container min-h-screen"
      style={{ backgroundColor }}
      data-testid="home-page"
    >
      <Toaster richColors />
      <RateLimitModal isOpen={showRateLimitModal} onClose={() => setShowRateLimitModal(false)} />

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-slate-900" data-testid="app-title">
            HookForge
          </h1>
          <div className="text-sm font-bold text-slate-900 bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-xl border-2 border-white/40" data-testid="usage-counter">
            {generationCount}/5 today
          </div>
        </div>

        {/* Mascot */}
        <div className="mb-6">
          <BlobMascot category={category} />
        </div>

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
              placeholder="Enter your topic..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-white border-2 border-slate-200 rounded-2xl p-4 text-lg font-bold focus:border-slate-400 focus:ring-0 outline-none placeholder:text-slate-400 transition-colors shadow-sm text-slate-800"
              data-testid="topic-input"
              onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
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
            disabled={loading}
            className="w-full font-bold text-lg rounded-2xl px-6 py-4 bg-white text-slate-900 border-2 border-slate-200 shadow-[0_4px_0_0_rgb(226,232,240)] hover:bg-slate-50 transition-all duration-150 active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            data-testid="generate-button"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-3 border-slate-400 border-t-slate-900 rounded-full animate-spin"></div>
                Generating...
              </>
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

        {/* Footer */}
        <div className="mt-12 text-center">
          <a
            href="/privacy"
            className="text-slate-900 font-bold text-sm underline"
            data-testid="privacy-link"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;