import React from 'react';
import { motion } from 'framer-motion';
import { Brain, FileDigit, Lightbulb, Save } from 'lucide-react';

const featuresData = [
  {
    title: 'AI Summaries',
    description: 'Instantly condense 50-page research papers into bite-sized, readable summaries without losing critical context.',
    icon: <Brain className="w-8 h-8 text-primary" />,
    delay: 0.1,
  },
  {
    title: 'ELI5 Explanation',
    description: 'Complex jargon translated into plain English. "Explain Like I\'m 5" mode makes any academic paper accessible.',
    icon: <Lightbulb className="w-8 h-8 text-secondary" />,
    delay: 0.2,
  },
  {
    title: 'Key Insights Extraction',
    description: 'Automatically pull out the Problem Statement, Methodology, Results, and Limitations in a structured format.',
    icon: <FileDigit className="w-8 h-8 text-neonPurple" />,
    delay: 0.3,
  },
  {
    title: 'Save to Notion',
    description: 'One-click sync directly to your Notion workspace. Build a persistent, searchable knowledge base of your research.',
    icon: <Save className="w-8 h-8 text-neonBlue" />,
    delay: 0.4,
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Supercharge Your <span className="text-gradient">Research</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Our neural engine parses, understands, and breaks down complex academic PDFs into digestible, actionable intelligence.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuresData.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: feature.delay, duration: 0.5 }}
              className="glass-card p-8 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] border border-white/10">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 text-white group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
