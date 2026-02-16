import { ClamProcessingAnimation } from './components/ClamProcessingAnimation';
import { AnimationPrompts } from './components/AnimationPrompts';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Video, FileText } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'animation' | 'prompts'>('animation');

  return (
    <div className="size-full">
      {/* Navigation */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white rounded-full shadow-2xl p-2 flex gap-2 border border-slate-200">
          <button
            onClick={() => setView('animation')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
              view === 'animation'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-transparent text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Video className="size-5" />
            Web Animation
          </button>
          <button
            onClick={() => setView('prompts')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
              view === 'prompts'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-transparent text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="size-5" />
            AI Prompts
          </button>
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={view}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {view === 'animation' ? <ClamProcessingAnimation /> : <AnimationPrompts />}
      </motion.div>
    </div>
  );
}