import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';

function App() {
  return (
    <div className="min-h-screen relative selection:bg-primary/30">
      {/* Global Background Grid Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      <Navbar />
      
      <main>
        <Hero />
        <Features />
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm border-t border-surfaceBorder mt-20 relative z-10">
        <p>© 2026 NeuroSynth. AI Research Summarizer.</p>
      </footer>
    </div>
  );
}

export default App;
