import { motion } from 'framer-motion';

export default function ResourceCard({ item }) {
  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ x: 4 }}
      transition={{ duration: 0.15 }}
      className="flex items-start gap-3 p-4 bg-white border border-gray-100 rounded-xl hover:border-gfg-green hover:shadow-md transition-all duration-200 group"
    >
      <div className="w-8 h-8 bg-gfg-green-pale rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gfg-green transition-colors">
        <span className="text-gfg-green group-hover:text-white text-sm">🔗</span>
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-sm text-gray-800 group-hover:text-gfg-green transition-colors leading-snug">
          {item.title}
        </p>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
      </div>
      <span className="text-gray-300 group-hover:text-gfg-green ml-auto self-center flex-shrink-0 transition-colors">→</span>
    </motion.a>
  );
}
