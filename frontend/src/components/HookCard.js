import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Eye, Copy } from 'lucide-react';
import { toast } from 'sonner';

const HookCard = ({ hook, index }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(hook.text);
    toast.success('Copied ✅', {
      duration: 2000,
      position: 'top-center',
    });
  };

  const getViralColor = (score) => {
    if (score >= 90) return 'text-red-500';
    if (score >= 75) return 'text-orange-500';
    return 'text-yellow-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        bounce: 0.5,
        duration: 0.6,
        delay: index * 0.1,
      }}
      onClick={handleCopy}
      className="bg-white rounded-3xl border-2 border-slate-100 shadow-[0_8px_0_0_rgb(226,232,240)] p-5 relative overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_0_0_rgb(226,232,240)] cursor-pointer active:translate-y-1 active:shadow-[0_4px_0_0_rgb(226,232,240)]"
      data-testid={`hook-card-${index}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-slate-900 font-bold text-base flex-1" data-testid={`hook-text-${index}`}>
          {hook.text}
        </p>
        <button
          className="shrink-0 p-2 bg-slate-100 rounded-xl border-2 border-slate-200 hover:bg-slate-200 transition-colors"
          onClick={handleCopy}
          data-testid={`copy-button-${index}`}
        >
          <Copy className="w-4 h-4 text-slate-700" strokeWidth={3} />
        </button>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <div className="flex items-center gap-1.5" data-testid={`viral-score-${index}`}>
          <Flame className={`w-4 h-4 ${getViralColor(hook.viral_score)}`} strokeWidth={3} />
          <span className="font-bold text-sm text-slate-700">{hook.viral_score}</span>
        </div>
        <div className="flex items-center gap-1.5" data-testid={`estimated-views-${index}`}>
          <Eye className="w-4 h-4 text-slate-600" strokeWidth={3} />
          <span className="font-bold text-sm text-slate-600">{hook.estimated_views}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default HookCard;