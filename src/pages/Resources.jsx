import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ResourceCard from '../components/ResourceCard';

const API_BASE = 'http://localhost:5000/api';

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/resources`)
      .then(r => r.json())
      .then(setResources)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-gfg-green font-semibold text-sm uppercase tracking-widest">Handpicked by the GFG Team</span>
          <h1 className="section-title mt-2">Learning Resources</h1>
          <p className="section-subtitle">Everything you need to go from beginner to placement-ready.</p>
        </motion.div>

        {/* Resource Categories */}
        <div className="space-y-10">
          {resources.map((category, catIdx) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIdx * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gfg-green-pale">
                <span className="text-2xl">{category.icon}</span>
                <h2 className="font-bold text-gray-900 text-xl">{category.category}</h2>
                <span className="ml-auto text-xs text-gfg-green font-medium bg-white px-2 py-1 rounded-full border border-gfg-green/20">
                  {category.items.length} resources
                </span>
              </div>

              {/* Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                {category.items.map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: catIdx * 0.1 + i * 0.05 }}
                  >
                    <ResourceCard item={item} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center bg-gray-900 rounded-2xl p-10 text-white"
        >
          <h3 className="text-2xl font-bold mb-2">Want to suggest a resource?</h3>
          <p className="text-gray-400 text-sm mb-6">Reach out and we'll add it to our curated list.</p>
          <a href="mailto:gfgclub@rit.edu.in" className="btn-primary">
            Suggest a Resource →
          </a>
        </motion.div>
      </div>
    </div>
  );
}
