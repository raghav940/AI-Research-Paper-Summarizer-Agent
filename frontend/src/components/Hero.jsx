import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Link as LinkIcon, ArrowRight } from 'lucide-react';
import GlowingBrain from './GlowingBrain';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[100px] opacity-50 pointer-events-none" />

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Column: Text & CTA */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-left"
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
            <SparklesIcon className="w-4 h-4" />
            <span>AI-Powered Research Assistant</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            Understand Research Papers <br/>
            <span className="text-gradient">10X Faster</span> with AI
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed">
            Upload any complex PDF or paste an ArXiv link. Our neural engine instantly generates ELI5 explanations, extracts key insights, and syncs directly to your Notion workspace.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button className="group relative w-full sm:w-auto flex items-center justify-center space-x-2 bg-white text-black px-8 py-4 rounded-full font-semibold overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
              <FileText className="w-5 h-5" />
              <span>Upload Paper</span>
              <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 -skew-x-12 -translate-x-full" />
            </button>
            
            <button className="group w-full sm:w-auto flex items-center justify-center space-x-2 glass px-8 py-4 rounded-full font-semibold text-white hover:bg-white/10 transition-colors border border-white/20">
              <LinkIcon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              <span>Try ArXiv Link</span>
              <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </button>
          </div>
          
          <div className="mt-8 flex items-center space-x-4 text-sm text-gray-500 font-medium">
            <div className="flex -space-x-2">
              {[1,2,3,4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-gray-800" />
              ))}
            </div>
            <p>Joined by 10,000+ researchers globally</p>
          </div>
        </motion.div>

        {/* Right Column: 3D Animation */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative h-[600px] w-full flex items-center justify-center"
        >
          {/* We will place the 3D Brain Component here */}
          <GlowingBrain />
        </motion.div>
        
      </div>
    </section>
  );
};

// Mini Sparkles icon component
function SparklesIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

export default Hero;
