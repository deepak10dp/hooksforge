import React from 'react';
import { motion } from 'framer-motion';

const BlobMascot = ({ category }) => {
  const categoryStyles = {
    General: { color: '#FFD60A', accent: '#FFA500', emoji: '😊' },
    Study: { color: '#34C759', accent: '#2D9F4D', emoji: '📚' },
    Gym: { color: '#FF7A00', accent: '#FF5500', emoji: '💪' },
    Tech: { color: '#007AFF', accent: '#0055CC', emoji: '💻' },
    Money: { color: '#AF52DE', accent: '#8B3FBF', emoji: '💰' },
    Relationships: { color: '#FF2D55', accent: '#CC0033', emoji: '❤️' },
  };

  const style = categoryStyles[category] || categoryStyles.General;

  return (
    <motion.div
      className="flex justify-center items-center"
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      data-testid="blob-mascot"
    >
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        {/* Blob body */}
        <path
          d="M60 10C75 10 90 20 95 35C100 50 100 70 90 85C80 100 65 110 50 105C35 100 20 90 15 75C10 60 10 40 20 25C30 10 45 10 60 10Z"
          fill={style.color}
          stroke="#1C1C1E"
          strokeWidth="3"
        />
        
        {/* Left eye */}
        <circle cx="45" cy="50" r="8" fill="white" stroke="#1C1C1E" strokeWidth="2" />
        <circle cx="46" cy="51" r="4" fill="#1C1C1E" />
        
        {/* Right eye */}
        <circle cx="75" cy="50" r="8" fill="white" stroke="#1C1C1E" strokeWidth="2" />
        <circle cx="76" cy="51" r="4" fill="#1C1C1E" />
        
        {/* Mouth - smile */}
        <path
          d="M45 70 Q60 80 75 70"
          stroke="#1C1C1E"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Category-specific accent */}
        {category === 'Gym' && (
          <>
            {/* Sweatband */}
            <ellipse cx="60" cy="25" rx="30" ry="5" fill={style.accent} stroke="#1C1C1E" strokeWidth="2" />
          </>
        )}
        {category === 'Tech' && (
          <>
            {/* Glasses */}
            <rect x="35" y="45" width="18" height="12" rx="2" fill="none" stroke="#1C1C1E" strokeWidth="2" />
            <rect x="67" y="45" width="18" height="12" rx="2" fill="none" stroke="#1C1C1E" strokeWidth="2" />
            <line x1="53" y1="51" x2="67" y2="51" stroke="#1C1C1E" strokeWidth="2" />
          </>
        )}
        {category === 'Relationships' && (
          <>
            {/* Hearts */}
            <text x="25" y="30" fontSize="16">💕</text>
            <text x="80" y="30" fontSize="16">💕</text>
          </>
        )}
        {category === 'Money' && (
          <>
            {/* Dollar sign */}
            <text x="48" y="38" fontSize="20" fontWeight="bold" fill={style.accent}>$</text>
          </>
        )}
      </svg>
    </motion.div>
  );
};

export default BlobMascot;