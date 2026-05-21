import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  UploadCloud, 
  Search, 
  History, 
  Bookmark, 
  Settings,
  BrainCircuit
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, to }) => {
  const location = useLocation();
  const active = location.pathname === to;
  
  return (
    <Link 
      to={to}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
        active 
          ? 'bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(139,92,246,0.15)]' 
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
};

const Sidebar = () => {
  return (
    <motion.aside 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-64 h-screen glass border-r border-surfaceBorder border-l-0 border-t-0 border-b-0 flex flex-col p-6 z-20 relative"
    >
      {/* Logo */}
      <div className="flex items-center space-x-2 mb-10 pl-2">
        <div className="p-2 bg-primary/20 rounded-xl border border-primary/30">
          <BrainCircuit className="w-6 h-6 text-neonPurple" />
        </div>
        <span className="text-xl font-bold tracking-wide">
          Neuro<span className="text-gradient">Synth</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        <SidebarItem icon={Home} label="Home" to="/" />
        <SidebarItem icon={UploadCloud} label="Upload" to="/dashboard" />
        <SidebarItem icon={Search} label="ArXiv Search" to="/dashboard#search" />
        <SidebarItem icon={History} label="History" to="/history" />
        <SidebarItem icon={Bookmark} label="Saved" to="/dashboard#saved" />
      </nav>

      {/* Bottom Settings */}
      <div className="mt-auto">
        <SidebarItem icon={Settings} label="Settings" to="/settings" />
        
        {/* Storage Widget */}
        <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-400">Monthly Usage</span>
            <span className="text-xs text-primary font-bold">45%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-neonPurple to-neonBlue w-[45%] rounded-full" />
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
