import { motion } from 'motion/react';

export function AnimationPrompts() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 px-6 pb-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-4 text-center">
            Animation Prompts
          </h1>
          <p className="text-lg text-slate-600 text-center mb-12">
            AI-generated prompts used to build the Clam Processing Data Flow Animation.
          </p>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">🎨 Visual Design</h3>
              <p className="text-slate-600">
                Create a modern, clean data flow animation showing the clam processing pipeline
                from raw material intake through QC checks, processing, freezing, and final product output.
                Use a professional color palette with blue for production steps and green for QC steps.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">⚡ Animation Flow</h3>
              <p className="text-slate-600">
                Animate data packets flowing through the pipeline nodes sequentially.
                Each node should highlight when active, with particle effects showing
                data transmission between production and QC streams.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">📊 Data Streams</h3>
              <p className="text-slate-600">
                Show two parallel data streams — Production Staff collecting forms (Form 1-3)
                and QC Inspectors performing quality checks (Form 4-5, Final Check).
                Both streams feed into a central processing pipeline visualization.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
