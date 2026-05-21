import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUp, Link as LinkIcon, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const UploadArea = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [arxivUrl, setArxivUrl] = useState('');
  
  // New states for animations
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const [file, setFile] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        startUpload(droppedFile);
      } else {
        alert("Please upload a valid PDF file.");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      startUpload(selectedFile);
    }
  };

  const startUpload = (uploadFile) => {
    setIsUploading(true);
    setUploadProgress(0);
    // Simulate progress bar quickly, then navigate
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            navigate('/processing', { state: { file: uploadFile } });
          }, 500);
          return 100;
        }
        return prev + 20;
      });
    }, 100);
  };
  
  const handleGenerate = () => {
    if (!arxivUrl) return;
    setIsGenerating(true);
    navigate('/processing', { state: { arxivUrl: arxivUrl } });
  };

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-2xl"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-3">Initialize Analysis</h1>
        <p className="text-gray-400">Upload a PDF or paste an ArXiv link to generate AI insights.</p>
      </div>

      {/* Drag & Drop Zone */}
      <div 
        className={`relative group rounded-3xl p-12 text-center transition-all duration-300 ease-out border-2 border-dashed overflow-hidden ${
          isDragging 
            ? 'border-primary bg-primary/10 scale-[1.02] shadow-[0_0_30px_rgba(139,92,246,0.3)]' 
            : 'border-white/20 bg-surface hover:border-primary/50 hover:bg-white/5'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <AnimatePresence mode="wait">
          {isUploading || uploadProgress === 100 ? (
            <motion.div 
              key="uploading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10 flex flex-col items-center justify-center space-y-4"
            >
              {uploadProgress === 100 ? (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="p-4 rounded-full bg-green-500/20 text-green-400 mb-2 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                >
                  <CheckCircle2 className="w-8 h-8" />
                </motion.div>
              ) : (
                <div className="p-4 rounded-full bg-primary/20 text-primary mb-2 animate-pulse">
                  <FileUp className="w-8 h-8" />
                </div>
              )}
              
              <p className="text-lg font-medium text-white">
                {uploadProgress === 100 ? 'Upload Complete!' : 'Analyzing PDF...'}
              </p>
              
              {/* Progress Bar */}
              <div className="w-full max-w-xs bg-gray-800 rounded-full h-2 mt-4 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  className="h-full bg-gradient-to-r from-neonPurple to-neonBlue"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">{uploadProgress}% processing</p>
            </motion.div>
          ) : (
            <motion.div 
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10 flex flex-col items-center justify-center space-y-4"
            >
              <div className={`p-4 rounded-full transition-colors duration-300 ${
                isDragging ? 'bg-primary text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]' : 'bg-white/10 text-primary'
              }`}>
                <FileUp className="w-8 h-8" />
              </div>
              
              <div>
                <p className="text-lg font-medium text-white mb-1">
                  {isDragging ? 'Drop paper here...' : 'Drag & Drop your PDF'}
                </p>
                <p className="text-sm text-gray-400">or click to browse files</p>
              </div>
              
              <input 
                type="file" 
                id="fileUpload" 
                className="hidden" 
                accept="application/pdf"
                onChange={handleFileChange}
              />
              <label 
                htmlFor="fileUpload"
                className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors border border-white/10 mt-2 cursor-pointer"
              >
                Browse Files
              </label>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center space-x-4 my-8">
        <div className="h-px bg-white/10 flex-1" />
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">OR</span>
        <div className="h-px bg-white/10 flex-1" />
      </div>

      {/* ArXiv Input & CTA */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-neonPurple to-neonBlue rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
        
        <div className="relative glass rounded-2xl p-2 flex flex-col sm:flex-row items-center shadow-lg gap-2">
          <div className="hidden sm:block pl-4 pr-1 text-gray-400">
            <LinkIcon className="w-5 h-5" />
          </div>
          <input 
            type="text" 
            placeholder="Paste ArXiv URL here (e.g. arxiv.org/abs/2103...)"
            className="flex-1 w-full sm:w-auto bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm py-3 px-4 sm:px-0"
            value={arxivUrl}
            onChange={(e) => setArxivUrl(e.target.value)}
          />
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`relative overflow-hidden group/btn bg-white text-black px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all w-full sm:w-auto ${
              isGenerating ? 'opacity-80 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]'
            }`}
          >
            <span className="relative z-10 flex items-center space-x-2">
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  <span>Processing AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>Generate Summary</span>
                </>
              )}
            </span>
            {!isGenerating && (
              <div className="absolute inset-0 bg-gray-200 translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
            )}
          </button>
        </div>
      </div>

    </motion.div>
  );
};

export default UploadArea;
