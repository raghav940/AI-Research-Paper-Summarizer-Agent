import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { BrainCircuit, FileSearch, Sparkles, CheckCircle2 } from 'lucide-react';
import GlowingBrain from '../components/GlowingBrain';
import axios from 'axios';

const steps = [
  { id: 1, text: 'Extracting PDF Text', icon: FileSearch },
  { id: 2, text: 'Analyzing Research Content', icon: BrainCircuit },
  { id: 3, text: 'Generating AI Summary', icon: Sparkles },
  { id: 4, text: 'Finalizing Insights', icon: CheckCircle2 },
];

const Processing = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const { arxivUrl, file } = location.state || {};
    
    if (!arxivUrl && !file) {
      navigate('/');
      return;
    }

    // Fake progress incrementor that slows down at 90%
    let progressValue = 0;
    const interval = setInterval(() => {
      progressValue += (90 - progressValue) * 0.05;
      setProgress(progressValue);
      setCurrentStep(Math.min(Math.floor((progressValue / 100) * steps.length), steps.length - 1));
    }, 500);

    const processData = async () => {
      const API_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://127.0.0.1:5001' : '');
      try {
        const selectedModel = localStorage.getItem('ai-model') || 'claude-3-opus';
        let resultData;
        if (arxivUrl) {
          const res = await axios.post(`${API_URL}/api/summarize-arxiv`, { 
            url: arxivUrl,
            model: selectedModel
          });
          resultData = res.data;
        } else if (file) {
          const formData = new FormData();
          formData.append('file', file);
          const uploadRes = await axios.post(`${API_URL}/api/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          const text = uploadRes.data.text;
          const metadataObj = {
            title: uploadRes.data.filename || "Uploaded PDF Document",
            authors: "Unknown",
            date: new Date().toLocaleDateString(),
            field: "Document",
            url: ""
          };
          
          const summarizeRes = await axios.post(`${API_URL}/api/summarize`, { 
            text: text,
            metadata: metadataObj,
            model: selectedModel
          });
          
          resultData = {
            metadata: metadataObj,
            summary: summarizeRes.data
          };
        }

        clearInterval(interval);
        setProgress(100);
        setCurrentStep(steps.length);
        
        setTimeout(() => {
          navigate('/results', { state: { resultData } });
        }, 1000);
      } catch (error) {
        clearInterval(interval);
        const msg = error?.response?.data?.error || error?.message || 'Unknown error';
        console.error("Error processing paper:", error);
        alert(`Processing failed: ${msg}`);
        navigate('/');
      }
    };

    processData();

    return () => clearInterval(interval);
  }, [navigate, location]);

  return (
    <div className="min-h-screen bg-background text-white flex items-center justify-center relative overflow-hidden">
      {/* Background Neural Network Animation */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <GlowingBrain />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="glass-card p-12 max-w-xl w-full relative z-10 flex flex-col items-center shadow-[0_0_50px_rgba(139,92,246,0.15)]"
      >
        {/* Circular Progress Bar */}
        <div className="relative w-48 h-48 mb-12 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="4"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="url(#neonGradient)"
              strokeWidth="4"
              strokeDasharray={283} // 2 * pi * r
              strokeDashoffset={283 - (283 * progress) / 100}
              strokeLinecap="round"
              className="drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]"
              style={{ transition: 'stroke-dashoffset 0.1s linear' }}
            />
            {/* Gradient Definition */}
            <defs>
              <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neonPurple to-neonBlue">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Processing Steps */}
        <div className="w-full space-y-4">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const Icon = step.icon;

            return (
              <div 
                key={step.id} 
                className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-500 ${
                  isActive 
                    ? 'bg-primary/20 border border-primary/40 shadow-[0_0_20px_rgba(139,92,246,0.2)] scale-[1.02]' 
                    : isCompleted
                      ? 'opacity-60 bg-white/5'
                      : 'opacity-30'
                }`}
              >
                <div className={`p-2 rounded-full ${
                  isActive ? 'bg-primary text-white animate-pulse' : 
                  isCompleted ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-500'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold ${isActive ? 'text-white' : 'text-gray-400'}`}>
                    {step.text}
                  </h4>
                </div>
                {isCompleted && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </motion.div>
                )}
                {isActive && (
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <BrainCircuit className="w-5 h-5 text-primary" />
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Processing;
