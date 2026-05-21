import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Clock, 
  Tag, 
  ArrowRight,
  MoreVertical,
  BookOpen
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';

const mockHistory = [
  {
    id: 1,
    title: "Attention Is All You Need",
    date: "2 hours ago",
    category: "AI/NLP",
    color: "from-purple-500 to-blue-500"
  },
  {
    id: 2,
    title: "Language Models are Few-Shot Learners",
    date: "Yesterday",
    category: "Deep Learning",
    color: "from-emerald-500 to-teal-500"
  },
  {
    id: 3,
    title: "Denoising Diffusion Probabilistic Models",
    date: "3 days ago",
    category: "Generative AI",
    color: "from-orange-500 to-red-500"
  },
  {
    id: 4,
    title: "Scaling Laws for Neural Language Models",
    date: "1 week ago",
    category: "AI Research",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 5,
    title: "High-Resolution Image Synthesis with Latent Diffusion",
    date: "2 weeks ago",
    category: "Computer Vision",
    color: "from-pink-500 to-rose-500"
  },
  {
    id: 6,
    title: "Mastering the game of Go with deep neural networks",
    date: "1 month ago",
    category: "Reinforcement Learning",
    color: "from-amber-500 to-orange-500"
  }
];

const History = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5001/api/history');
        setHistoryData(response.data);
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filters = ['All', 'AI/NLP', 'Computer Vision', 'Generative AI', 'Deep Learning', 'General'];

  const filteredHistory = historyData.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || (paper.field && paper.field.includes(activeFilter));
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background text-white flex">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      
      <Sidebar />

      <main className="flex-1 overflow-y-auto relative z-10 p-8 lg:p-12">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Research Archive</h1>
              <p className="text-gray-400">Access and manage your previously analyzed papers.</p>
            </div>
            
            {/* Search Bar */}
            <div className="relative group w-full md:w-96">
              <div className="absolute inset-0 bg-gradient-to-r from-neonPurple to-neonBlue rounded-xl blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
              <div className="relative flex items-center glass rounded-xl px-4 py-3 border border-white/10 shadow-lg">
                <Search className="w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search papers, topics..."
                  className="bg-transparent border-none outline-none text-white placeholder-gray-500 ml-3 flex-1 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 hide-scrollbar">
            <Filter className="w-5 h-5 text-gray-400 shrink-0 mr-2" />
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === filter
                    ? 'bg-primary text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Grid Layout */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4"
            >
              <AnimatePresence>
                {filteredHistory.map((paper, index) => (
                  <motion.div
                    key={paper.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group relative h-full"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                    
                    <div className="relative glass-card h-full p-6 flex flex-col justify-between border border-white/10 hover:border-primary/50 transition-colors duration-300">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className={`p-2 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 bg-opacity-20`}>
                            <BookOpen className="w-5 h-5 text-white" />
                          </div>
                          <button className="text-gray-500 hover:text-white transition-colors">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                          {paper.title}
                        </h3>
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                          <div className="flex items-center text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-md">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(paper.created_at).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-xs text-primary bg-primary/10 px-2 py-1 rounded-md">
                            <Tag className="w-3 h-3 mr-1" />
                            {paper.field}
                          </div>
                        </div>

                        <Link 
                          to="/results"
                          state={{ 
                            resultData: {
                              metadata: {
                                title: paper.title,
                                authors: paper.authors,
                                date: paper.publication_date,
                                categories: paper.field,
                                url: paper.arxiv_url
                              },
                              summary: paper.summary_json
                            }
                          }}
                          className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium flex items-center justify-center space-x-2 transition-all group-hover:bg-primary group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                        >
                          <span>View Summary</span>
                          <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {filteredHistory.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <p>No research papers found matching your criteria.</p>
            </div>
          )}

        </div>
      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default History;
