import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Settings, Home, LayoutDashboard, Sparkles } from 'lucide-react';

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto glass rounded-full px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary/20 rounded-xl">
            <BrainCircuit className="w-6 h-6 text-neonPurple" />
          </div>
          <span className="text-xl font-bold tracking-wide">
            Neuro<span className="text-gradient">Synth</span>
          </span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
          <a href="#" className="flex items-center space-x-1 hover:text-white transition-colors">
            <Home className="w-4 h-4" />
            <span>Home</span>
          </a>
          <a href="#features" className="flex items-center space-x-1 hover:text-white transition-colors">
            <Sparkles className="w-4 h-4" />
            <span>Features</span>
          </a>
          <a href="#dashboard" className="flex items-center space-x-1 hover:text-white transition-colors">
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </a>
          <a href="#settings" className="flex items-center space-x-1 hover:text-white transition-colors">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </a>
        </div>

        {/* CTA */}
        <div className="flex items-center space-x-4">
          <button className="hidden md:block px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Sign In
          </button>
          <button className="px-5 py-2 text-sm font-medium bg-white text-black rounded-full hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            Get Started
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
