import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, Clock } from 'lucide-react';

const RateLimitModal = ({ isOpen, onClose }) => {
  const [timeUntilReset, setTimeUntilReset] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0);
      
      const diff = tomorrow - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeUntilReset(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
        data-testid="rate-limit-modal-overlay"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl border-2 border-slate-200 shadow-[0_8px_0_0_rgb(226,232,240)] p-6 max-w-sm w-full relative"
          data-testid="rate-limit-modal"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-slate-100 rounded-xl border-2 border-slate-200 hover:bg-slate-200 transition-colors"
            data-testid="close-modal-button"
          >
            <X className="w-4 h-4 text-slate-700" strokeWidth={3} />
          </button>

          <div className="flex flex-col items-center text-center gap-4">
            <div className="p-4 bg-orange-100 rounded-2xl border-2 border-orange-200">
              <AlertCircle className="w-8 h-8 text-orange-600" strokeWidth={3} />
            </div>

            <h2 className="text-2xl font-black text-slate-900" data-testid="modal-title">
              Daily Limit Reached
            </h2>

            <p className="text-slate-600 font-semibold" data-testid="modal-message">
              You've used all 5 generations for today. Your limit will reset at midnight.
            </p>

            <div className="w-full bg-slate-100 rounded-2xl border-2 border-slate-200 p-4" data-testid="countdown-timer">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-slate-700" strokeWidth={3} />
                <span className="text-sm font-bold text-slate-700">Resets in:</span>
              </div>
              <p className="text-2xl font-black text-slate-900">{timeUntilReset}</p>
            </div>

            <div className="w-full space-y-2">
              <p className="text-xs text-slate-500 font-semibold">
                💡 Tip: Check out your saved hooks in the meantime!
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full font-bold text-lg rounded-2xl px-6 py-4 bg-slate-900 text-white border-2 border-slate-900 shadow-[0_4px_0_0_rgb(71,85,105)] hover:bg-slate-800 transition-all duration-150 active:translate-y-1 active:shadow-none"
              data-testid="modal-ok-button"
            >
              Got it!
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RateLimitModal;