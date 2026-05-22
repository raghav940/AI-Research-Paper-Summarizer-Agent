import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BrainCircuit, 
  Database, 
  Palette, 
  Bell, 
  Save, 
  Check, 
  ChevronDown 
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

// Custom Toggle Component
const Toggle = ({ enabled, setEnabled }) => (
  <div 
    onClick={() => setEnabled(!enabled)}
    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
      enabled ? 'bg-primary shadow-[0_0_10px_rgba(139,92,246,0.5)]' : 'bg-gray-700'
    }`}
  >
    <motion.div 
      layout
      className="bg-white w-4 h-4 rounded-full shadow-md"
      initial={false}
      animate={{ x: enabled ? 24 : 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    />
  </div>
);

const Settings = () => {
  const [model, setModel] = useState(() => localStorage.getItem('ai-model') || 'claude-3-opus');
  const [notionConnected, setNotionConnected] = useState(() => {
    const saved = localStorage.getItem('notion-connected');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [autoSave, setAutoSave] = useState(() => {
    const saved = localStorage.getItem('auto-save');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [emailAlerts, setEmailAlerts] = useState(() => {
    const saved = localStorage.getItem('email-alerts');
    return saved !== null ? JSON.parse(saved) : false;
  });

  const handleSave = () => {
    localStorage.setItem('ai-model', model);
    localStorage.setItem('notion-connected', JSON.stringify(notionConnected));
    localStorage.setItem('auto-save', JSON.stringify(autoSave));
    localStorage.setItem('notifications', JSON.stringify(notifications));
    localStorage.setItem('email-alerts', JSON.stringify(emailAlerts));
    alert('Settings saved successfully!');
  };

  return (
    <div className="min-h-screen bg-background text-white flex">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      
      <Sidebar />

      <main className="flex-1 overflow-y-auto relative z-10 p-8 lg:p-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Settings</h1>
            <p className="text-gray-400">Manage your AI preferences, integrations, and application settings.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left Column */}
            <div className="md:col-span-8 space-y-8">
              
              {/* AI Model Selection */}
              <section className="glass-card p-8 border border-white/10 hover:border-primary/30 transition-colors duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-primary/20 rounded-lg text-primary">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold">AI Model Configuration</h2>
                </div>
                
                <div className="space-y-4">
                  {[
                    { id: 'claude-3-opus', name: 'Claude 3 Opus', desc: 'Maximum intelligence, best for complex papers.' },
                    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', desc: 'Balanced speed and intelligence.' },
                    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', desc: 'Fast and reliable general reasoning.' }
                  ].map(m => (
                    <div 
                      key={m.id}
                      onClick={() => setModel(m.id)}
                      className={`relative flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
                        model === m.id 
                          ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(139,92,246,0.15)]' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div>
                        <h4 className="font-semibold text-white">{m.name}</h4>
                        <p className="text-sm text-gray-400 mt-1">{m.desc}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        model === m.id ? 'border-primary bg-primary' : 'border-gray-500'
                      }`}>
                        {model === m.id && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Integrations */}
              <section className="glass-card p-8 border border-white/10 hover:border-secondary/30 transition-colors duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-secondary/20 rounded-lg text-secondary">
                    <Database className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold">Integrations</h2>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png" alt="Notion" className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Notion Workspace</h4>
                      <p className="text-sm text-gray-400">Sync summaries automatically to your database.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setNotionConnected(!notionConnected)}
                    className={`px-5 py-2 rounded-lg font-medium text-sm transition-all ${
                      notionConnected 
                        ? 'bg-white/10 text-white border border-white/20 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30' 
                        : 'bg-white text-black hover:bg-gray-200'
                    }`}
                  >
                    {notionConnected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              </section>

            </div>

            {/* Right Column */}
            <div className="md:col-span-4 space-y-8">
              
              {/* Preferences */}
              <section className="glass-card p-6 border border-white/10">
                <h2 className="text-lg font-bold mb-6 flex items-center">
                  <Save className="w-4 h-4 mr-2 text-gray-400" />
                  Preferences
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-white">Auto-Save</h4>
                      <p className="text-xs text-gray-400 mt-1">Save drafts automatically</p>
                    </div>
                    <Toggle enabled={autoSave} setEnabled={setAutoSave} />
                  </div>
                  
                  <div className="h-px bg-white/10" />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-white">In-App Notifications</h4>
                      <p className="text-xs text-gray-400 mt-1">Show processing alerts</p>
                    </div>
                    <Toggle enabled={notifications} setEnabled={setNotifications} />
                  </div>
                  
                  <div className="h-px bg-white/10" />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-white">Email Digests</h4>
                      <p className="text-xs text-gray-400 mt-1">Weekly summary reports</p>
                    </div>
                    <Toggle enabled={emailAlerts} setEnabled={setEmailAlerts} />
                  </div>
                </div>
              </section>

              {/* Appearance */}
              <section className="glass-card p-6 border border-white/10">
                <h2 className="text-lg font-bold mb-6 flex items-center">
                  <Palette className="w-4 h-4 mr-2 text-gray-400" />
                  Appearance
                </h2>
                
                <div className="relative group cursor-pointer">
                  <div className="absolute inset-0 bg-primary/20 rounded-xl blur transition-opacity opacity-0 group-hover:opacity-100" />
                  <div className="relative flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-xl">
                    <span className="text-sm font-medium">Dark Theme (Neon)</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </section>

            </div>
          </div>
          
          <div className="pt-6 border-t border-white/10 flex justify-end">
             <button 
                onClick={handleSave}
                className="relative group/btn bg-white text-black px-8 py-3 rounded-xl font-bold transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
             >
                Save Changes
             </button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Settings;
