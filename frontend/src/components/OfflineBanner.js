import React from 'react';
import { WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OfflineBanner = ({ isOffline }) => {
  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white py-3 px-4"
          data-testid="offline-banner"
        >
          <div className="max-w-md mx-auto flex items-center justify-center gap-2">
            <WifiOff className="w-5 h-5" strokeWidth={3} />
            <p className="font-bold text-sm">You're offline. Showing cached content.</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineBanner;