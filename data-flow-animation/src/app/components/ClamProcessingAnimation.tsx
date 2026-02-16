import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Camera, Fingerprint, Printer, Scale, CheckCircle, Package, Thermometer, BarChart } from 'lucide-react';

interface Worker {
  id: number;
  name: string;
  role: 'production' | 'qc';
  position: { x: number; y: number };
}

export function ClamProcessingAnimation() {
  const [activeStep, setActiveStep] = useState(0);
  const [dataFlowActive, setDataFlowActive] = useState<string | null>(null);

  const steps = [
    { id: 0, name: 'Raw Material Intake', form: 'Form 1', color: '#3B82F6' },
    { id: 1, name: 'QC Quality Check', form: 'Form 4', color: '#10B981' },
    { id: 2, name: 'Processing', form: null, color: '#F59E0B' },
    { id: 3, name: 'QC Yield Verification', form: 'Form 5', color: '#10B981' },
    { id: 4, name: 'Pre-Processing Complete', form: 'Form 2', color: '#3B82F6' },
    { id: 5, name: 'Freezing & Packing', form: 'Form 3', color: '#3B82F6' },
    { id: 6, name: 'Final QC Check', form: 'Final Check', color: '#10B981' },
    { id: 7, name: 'Product Out', form: null, color: '#8B5CF6' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeStep === 0 || activeStep === 1 || activeStep === 3 || activeStep === 4 || activeStep === 5 || activeStep === 6) {
      setDataFlowActive(steps[activeStep].form);
      setTimeout(() => setDataFlowActive(null), 2000);
    }
  }, [activeStep]);

  const productionWorkers: Worker[] = [
    { id: 1, name: 'Production Worker 1', role: 'production', position: { x: 10, y: 20 } },
    { id: 2, name: 'Production Worker 2', role: 'production', position: { x: 50, y: 50 } },
    { id: 3, name: 'Production Worker 3', role: 'production', position: { x: 80, y: 70 } }
  ];

  const qcWorkers: Worker[] = [
    { id: 4, name: 'QC Inspector 1', role: 'qc', position: { x: 30, y: 15 } },
    { id: 5, name: 'QC Inspector 2', role: 'qc', position: { x: 70, y: 45 } }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-slate-800 mb-3">
            Clam Processing Data Flow Animation
          </h1>
          <p className="text-slate-600 text-lg">
            Watch how Production Staff & QC Staff collect data through the processing pipeline
          </p>
        </motion.div>

        {/* Main Animation Area */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Production Stream */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                <Package className="size-6" />
                Production Stream
              </h2>
              
              <div className="space-y-4">
                {[0, 4, 5].map((stepId) => {
                  const step = steps[stepId];
                  const isActive = activeStep === stepId;
                  return (
                    <motion.div
                      key={stepId}
                      animate={{
                        scale: isActive ? 1.05 : 1,
                        boxShadow: isActive 
                          ? '0 10px 40px rgba(59, 130, 246, 0.3)' 
                          : '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                      className={`p-6 rounded-lg border-2 ${
                        isActive ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-slate-800">{step.name}</h3>
                        {step.form && (
                          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {step.form}
                          </span>
                        )}
                      </div>
                      
                      {/* Animated Worker */}
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-3 mb-3"
                        >
                          <motion.div
                            animate={{ rotate: [0, -10, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl"
                          >
                            👷
                          </motion.div>
                          <div>
                            <p className="text-sm font-semibold text-slate-700">Production Staff</p>
                            <p className="text-xs text-slate-500">Collecting data...</p>
                          </div>
                        </motion.div>
                      )}

                      {/* Data Collection Icons */}
                      {isActive && step.form && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex gap-2 flex-wrap"
                        >
                          <Camera className="size-5 text-blue-500" />
                          <Fingerprint className="size-5 text-blue-500" />
                          <Scale className="size-5 text-blue-500" />
                          <BarChart className="size-5 text-blue-500" />
                        </motion.div>
                      )}

                      {/* Data Flow Animation */}
                      {isActive && step.form && dataFlowActive === step.form && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0] }}
                          transition={{ duration: 1.5 }}
                          className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 rounded text-xs"
                        >
                          Data Sent ✓
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* QC/QA Stream */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-green-600 flex items-center gap-2">
                <CheckCircle className="size-6" />
                Quality Assurance Stream
              </h2>
              
              <div className="space-y-4">
                {[1, 3, 6].map((stepId) => {
                  const step = steps[stepId];
                  const isActive = activeStep === stepId;
                  return (
                    <motion.div
                      key={stepId}
                      animate={{
                        scale: isActive ? 1.05 : 1,
                        boxShadow: isActive 
                          ? '0 10px 40px rgba(16, 185, 129, 0.3)' 
                          : '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                      className={`p-6 rounded-lg border-2 ${
                        isActive ? 'border-green-500 bg-green-50' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-slate-800">{step.name}</h3>
                        {step.form && (
                          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {step.form}
                          </span>
                        )}
                      </div>
                      
                      {/* Animated QC Worker */}
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-3 mb-3"
                        >
                          <motion.div
                            animate={{ rotate: [0, -10, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white text-xl"
                          >
                            🔬
                          </motion.div>
                          <div>
                            <p className="text-sm font-semibold text-slate-700">QC Inspector</p>
                            <p className="text-xs text-slate-500">Performing checks...</p>
                          </div>
                        </motion.div>
                      )}

                      {/* QC Check Icons */}
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex gap-2 flex-wrap"
                        >
                          <CheckCircle className="size-5 text-green-500" />
                          <Thermometer className="size-5 text-green-500" />
                          <Scale className="size-5 text-green-500" />
                          <Camera className="size-5 text-green-500" />
                        </motion.div>
                      )}

                      {/* Data Flow Animation */}
                      {isActive && step.form && dataFlowActive === step.form && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0] }}
                          transition={{ duration: 1.5 }}
                          className="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 rounded text-xs"
                        >
                          QC Data Sent ✓
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Processing Steps */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-700">Processing Pipeline</h3>
            <div className="relative">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex-1 relative">
                    {/* Step Node */}
                    <motion.div
                      animate={{
                        scale: activeStep === index ? 1.2 : 1,
                        backgroundColor: activeStep === index ? step.color : '#E2E8F0'
                      }}
                      className="w-12 h-12 rounded-full mx-auto flex items-center justify-center text-white font-bold shadow-lg"
                    >
                      {index + 1}
                    </motion.div>
                    
                    {/* Step Label */}
                    <p className="text-xs text-center mt-2 font-medium text-slate-600">
                      {step.name.split(' ').slice(0, 2).join(' ')}
                    </p>

                    {/* Connecting Line */}
                    {index < steps.length - 1 && (
                      <motion.div
                        animate={{
                          backgroundColor: activeStep >= index ? step.color : '#CBD5E1'
                        }}
                        className="absolute top-6 left-1/2 h-1 w-full"
                        style={{ transformOrigin: 'left' }}
                      />
                    )}

                    {/* Data Flow Particle */}
                    {activeStep === index && (
                      <motion.div
                        initial={{ x: 0, opacity: 1 }}
                        animate={{ 
                          x: index < steps.length - 1 ? 100 : 0,
                          opacity: index < steps.length - 1 ? [1, 1, 0] : 1
                        }}
                        transition={{ duration: 2 }}
                        className="absolute top-4 left-1/2 w-4 h-4 rounded-full bg-yellow-400 shadow-lg"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-slate-700 mb-4">Legend</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-xl">
                👷
              </div>
              <div>
                <p className="font-semibold text-slate-700">Production Staff</p>
                <p className="text-sm text-slate-500">White coat, hairnet, gloves</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-xl">
                🔬
              </div>
              <div>
                <p className="font-semibold text-slate-700">QC Inspector</p>
                <p className="text-sm text-slate-500">Lab coat, safety glasses</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-4 h-4 rounded-full bg-yellow-600"
                />
              </div>
              <div>
                <p className="font-semibold text-slate-700">Data Flow</p>
                <p className="text-sm text-slate-500">Real-time data transmission</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}