import { motion } from 'framer-motion';

const tagColors = {
  Career: 'bg-blue-100 text-blue-700',
  DSA: 'bg-green-100 text-green-700',
  CP: 'bg-purple-100 text-purple-700',
  Dev: 'bg-orange-100 text-orange-700',
};

export default function BlogCard({ post }) {
  return (
    <motion.a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card p-6 cursor-pointer group block"
    >
      {/* Avatar + Meta */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gfg-green flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {post.avatar}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{post.author}</p>
          <p className="text-xs text-gray-400">{post.date} • {post.readTime}</p>
        </div>
        <span className={`ml-auto text-xs font-bold px-2.5 py-1 rounded-full ${tagColors[post.tag] || 'bg-gray-100 text-gray-600'}`}>
          {post.tag}
        </span>
      </div>

      <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 group-hover:text-gfg-green transition-colors line-clamp-2">
        {post.title}
      </h3>
      <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{post.excerpt}</p>

      <div className="mt-4 flex items-center gap-1 text-gfg-green text-sm font-semibold group-hover:gap-2 transition-all">
        Read More <span>→</span>
      </div>
    </motion.a>
  );
}
