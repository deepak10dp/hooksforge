import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

const RateLimitModal = ({ isOpen, onClose }) => {
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
              You've used all 5 generations for today. Come back tomorrow for more viral hooks!
            </p>

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