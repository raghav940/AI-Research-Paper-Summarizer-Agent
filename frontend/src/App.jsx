import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Dashboard from './pages/Dashboard';
import Processing from './pages/Processing';
import Results from './pages/Results';
import History from './pages/History';
import Settings from './pages/Settings';

const LandingPage = () => (
  <>
    <Navbar />
    <main>
      <Hero />
      <Features />
    </main>
    <footer className="py-8 text-center text-gray-500 text-sm border-t border-surfaceBorder mt-20 relative z-10">
      <p>© 2026 NeuroSynth. AI Research Summarizer.</p>
    </footer>
  </>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen relative selection:bg-primary/30 text-white bg-background">
        {/* Global Background Grid Pattern - applied globally */}
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/processing" element={<Processing />} />
          <Route path="/results" element={<Results />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
