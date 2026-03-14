import { motion } from 'framer-motion';

const rankColors = {
  1: 'bg-yellow-400 text-yellow-900',
  2: 'bg-gray-300 text-gray-700',
  3: 'bg-amber-600 text-white',
};

export default function LeaderboardRow({ member, index }) {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`border-b border-gray-100 hover:bg-gfg-green-pale/40 transition-colors ${
        member.rank <= 3 ? 'bg-gfg-green-pale/20' : ''
      }`}
    >
      <td className="py-4 px-4">
        <span
          className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
            rankColors[member.rank] || 'bg-gray-100 text-gray-600'
          }`}
        >
          {member.rank <= 3 ? member.badge : member.rank}
        </span>
      </td>
      <td className="py-4 px-4">
        <div>
          <p className="font-semibold text-gray-900 text-sm">{member.name}</p>
          <p className="text-xs text-gray-400">{member.branch} • {member.year} Year</p>
        </div>
      </td>
      <td className="py-4 px-4 text-center">
        <span className="font-bold text-gfg-green">{member.points.toLocaleString()}</span>
      </td>
      <td className="py-4 px-4 text-center">
        <span className="text-sm text-gray-600">{member.solved}</span>
      </td>
      <td className="py-4 px-4 text-center">
        <span className="text-xs bg-orange-100 text-orange-600 font-medium px-2 py-1 rounded-full">
          🔥 {member.streak} days
        </span>
      </td>
    </motion.tr>
  );
}
