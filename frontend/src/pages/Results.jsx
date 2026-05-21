import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FileText, 
  Target,
  Brain, 
  FlaskConical, 
  BarChart, 
  AlertTriangle,
  FastForward, 
  Lightbulb, 
  Download, 
  Share2, 
  Bookmark,
  Calendar,
  Users,
  Tag,
  Loader2
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

const Results = () => {
  const [activeTab, setActiveTab] = useState('summary');
  const [isSaving, setIsSaving] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { resultData } = location.state || {};

  useEffect(() => {
    if (!resultData) {
      navigate('/');
    }
  }, [resultData, navigate]);

  if (!resultData) return null;

  const metadata = resultData.metadata || {
    title: "Research Paper Summary",
    authors: "Unknown Authors",
    published: new Date().toLocaleDateString(),
    categories: "General"
  };

  const summary = resultData.summary || {};

  const paperData = {
    title: metadata.title,
    authors: metadata.authors,
    date: metadata.published,
    field: metadata.categories,
    tabs: {
      summary: {
        icon: FileText,
        label: "Summary",
        content: summary.summary || "No summary available."
      },
      problem_statement: {
        icon: Target,
        label: "Problem Statement",
        content: summary.problem_statement || "No problem statement available."
      },
      methodology: {
        icon: FlaskConical,
        label: "Methodology",
        content: summary.methodology || "No methodology available."
      },
      results: {
        icon: BarChart,
        label: "Results",
        content: summary.results || "No results available."
      },
      limitations: {
        icon: AlertTriangle,
        label: "Limitations",
        content: summary.limitations || "No limitations available."
      },
      future_improvements: {
        icon: FastForward,
        label: "Future Work",
        content: summary.future_improvements || "No future work available."
      },
      eli5: {
        icon: Brain,
        label: "ELI5",
        content: summary.eli5 || "No ELI5 available."
      },
      insights: {
        icon: Lightbulb,
        label: "Key Insights",
        content: summary.insights || "No key insights available."
      }
    }
  };

  const handleSaveToNotion = async () => {
    setIsSaving(true);
    try {
      await axios.post('http://127.0.0.1:5001/api/notion', {
        summary_data: summary,
        metadata: metadata
      });
      alert('Successfully saved to Notion!');
    } catch (error) {
      console.error(error);
      alert('Failed to save to Notion. Make sure your Notion token and Database ID are correct in .env');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    const mdContent = `
# ${paperData.title}

**Authors:** ${paperData.authors}
**Date:** ${paperData.date}
**Field:** ${paperData.field}
${metadata.url ? `**ArXiv URL:** ${metadata.url}\n` : ''}

---

## 📝 Summary
${paperData.tabs.summary.content}

## 🎯 Problem Statement
${paperData.tabs.problem_statement.content}

## 🧪 Methodology
${paperData.tabs.methodology.content}

## 📊 Results
${paperData.tabs.results.content}

## ⚠️ Limitations
${paperData.tabs.limitations.content}

## 🚀 Future Work
${paperData.tabs.future_improvements.content}

## 🧠 ELI5
${paperData.tabs.eli5.content}

## 💡 Key Insights
${paperData.tabs.insights.content}
`.trim();

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Clean title for filename
    const cleanTitle = paperData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 50);
    link.href = url;
    link.setAttribute('download', `${cleanTitle}_summary.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    const shareText = `Check out the AI-generated summary for the paper "${paperData.title}"!`;
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: paperData.title,
          text: shareText,
          url: shareUrl
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      // Fallback: Copy URL to clipboard
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        alert('Share link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy share link:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-white flex">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      
      <Sidebar />

      <main className="flex-1 overflow-y-auto relative z-10 p-8 lg:p-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto space-y-8"
        >
          
          {/* Header Section */}
          <div className="glass-card p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-50 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-4 flex-1">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  {paperData.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{paperData.authors}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 text-secondary" />
                    <span>{paperData.date}</span>
                  </div>
                  <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white">
                    <Tag className="w-3 h-3 text-neonPurple" />
                    <span className="text-xs font-semibold uppercase tracking-wider">{paperData.field}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 shrink-0">
                <button 
                  onClick={handleShare}
                  className="p-3 glass rounded-xl hover:bg-white/10 hover:text-white text-gray-400 transition-colors group/btn"
                >
                  <Share2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                </button>
                <button 
                  onClick={handleDownload}
                  className="p-3 glass rounded-xl hover:bg-white/10 hover:text-white text-gray-400 transition-colors group/btn"
                >
                  <Download className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                </button>
                <button 
                  onClick={handleSaveToNotion}
                  disabled={isSaving}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl bg-white text-black font-bold transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)] ${
                    isSaving ? 'opacity-80 cursor-not-allowed' : 'hover:bg-gray-200 hover:scale-105 active:scale-95'
                  }`}
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bookmark className="w-5 h-5" />}
                  <span>{isSaving ? 'Saving...' : 'Save to Notion'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Tabs */}
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Tab Navigation */}
            <div className="lg:w-64 shrink-0 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 hide-scrollbar">
              {Object.entries(paperData.tabs).map(([key, tab]) => {
                const Icon = tab.icon;
                const isActive = activeTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex items-center space-x-3 px-4 py-4 rounded-xl transition-all duration-300 whitespace-nowrap text-left ${
                      isActive 
                        ? 'bg-primary/20 border border-primary/40 text-white shadow-[inset_0_0_20px_rgba(139,92,246,0.1)]' 
                        : 'bg-surface border border-surfaceBorder text-gray-400 hover:bg-white/5 hover:text-gray-200'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-neonPurple' : 'text-gray-500'}`} />
                    <span className="font-semibold">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
                  transition={{ duration: 0.3 }}
                  className="glass-card p-8 min-h-[400px] border-l-2 border-l-primary/50"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    {React.createElement(paperData.tabs[activeTab].icon, { className: "w-6 h-6 text-primary" })}
                    <h2 className="text-2xl font-bold text-white">
                      {paperData.tabs[activeTab].label}
                    </h2>
                  </div>
                  
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                      {paperData.tabs[activeTab].content}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </motion.div>
      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default Results;
