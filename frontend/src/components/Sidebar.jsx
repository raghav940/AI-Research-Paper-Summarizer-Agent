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
  BrainCircuit,
  LogOut,
  LogIn
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
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

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

      {/* Bottom Settings & User */}
      <div className="mt-auto">
        <SidebarItem icon={Settings} label="Settings" to="/settings" />
        
        {user ? (
          <div className="mt-6 pt-6 border-t border-white/10 flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neonPurple to-neonBlue flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                {user.email[0].toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate w-full">{user.email}</p>
                <p className="text-xs text-gray-400">Pro Plan</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-2 rounded-xl text-red-400 hover:text-white hover:bg-red-500/20 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        ) : (
          <div className="mt-6 pt-6 border-t border-white/10">
            <SidebarItem icon={LogIn} label="Sign In" to="/auth" />
          </div>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
